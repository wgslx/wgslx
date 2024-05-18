"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = exports.symbol = exports.SymbolRule = exports.star = exports.StarRule = exports.maybe = exports.MaybeRule = exports.union = exports.UnionRule = exports.sequence = exports.SequenceRule = exports.regex = exports.RegExpRule = exports.literal = exports.LiteralRule = exports.Context = exports.Rule = exports.ruleMatch = void 0;
const patterns_1 = require("./patterns");
const sequence_1 = require("./sequence");
const token_1 = require("./token");
const util_1 = require("./util");
function ruleMatch(cursor, token, symbol) {
    if (Array.isArray(token)) {
        if (token.length === 0) {
            token = undefined;
        }
        else {
            token = token_1.Token.group(token.map(r => r.token).filter(util_1.isValued));
        }
    }
    if (token && symbol !== undefined) {
        token = token_1.Token.symbol(token, symbol);
    }
    return { token, cursor };
}
exports.ruleMatch = ruleMatch;
class Rule {
    symbol;
    matchAll(text, file) {
        const context = Context.from(text, file);
        const cursor = (0, sequence_1.Cursor)(0);
        const match = this.match(cursor, context);
        if (match?.token) {
            if (match.cursor.segment < context.sequence.segments.length) {
                console.log(match.cursor.segment, context.sequence);
                return null;
            }
            return match.token;
        }
        return null;
    }
}
exports.Rule = Rule;
class Context {
    sequence;
    cache = new Map();
    text(cursor, matcher) {
        const cursorKey = this.sequence.stringify(cursor);
        const textMatch = this.sequence.match(cursor, matcher);
        if (!textMatch) {
            return null;
        }
        return ruleMatch(textMatch.cursor, token_1.Token.text(textMatch.text, cursorKey));
    }
    rule(cursor, rule) {
        const cursorKey = this.sequence.stringify(cursor);
        const cached = this.get(cursorKey, rule);
        if (cached !== undefined) {
            return cached;
        }
        const match = rule.match(cursor, this);
        this.set(cursorKey, rule, match);
        return match;
    }
    get(cursorKey, rule) {
        const cursorMap = this.cache.get(cursorKey);
        if (!cursorMap) {
            return undefined;
        }
        const cached = cursorMap.get(rule);
        return cached
            ? { cursor: cached.cursor, token: cached.token?.clone() }
            : cached;
    }
    set(cursorKey, rule, match) {
        let cursorMap = this.cache.get(cursorKey);
        if (!cursorMap) {
            cursorMap = new Map();
            this.cache.set(cursorKey, cursorMap);
        }
        if (match) {
            match = { cursor: match.cursor, token: match.token?.clone() };
        }
        cursorMap.set(rule, match);
    }
    constructor(sequence) {
        this.sequence = sequence;
    }
    static from(text, file) {
        return new Context(sequence_1.Sequence.from(text, file));
    }
}
exports.Context = Context;
function rulifyOne(rule) {
    if (typeof rule === 'string') {
        return literal(rule);
    }
    if (rule instanceof RegExp) {
        return regex(rule);
    }
    return rule;
}
function rulifyAll(rules) {
    return rules.map(r => rulifyOne(r));
}
class LiteralRule extends Rule {
    matcher;
    literals;
    match(cursor, context) {
        return context.text(cursor, this.matcher);
    }
    constructor(literals) {
        super();
        this.matcher = (0, patterns_1.createStringTextMatcher)(...literals);
        this.literals = literals;
    }
}
exports.LiteralRule = LiteralRule;
function literal(...literals) {
    return new LiteralRule(literals);
}
exports.literal = literal;
class RegExpRule extends Rule {
    matcher;
    patterns;
    match(cursor, context) {
        return context.text(cursor, this.matcher);
    }
    constructor(patterns) {
        super();
        this.matcher = (0, patterns_1.createRegExpTextMatcher)(...patterns);
        this.patterns = patterns;
    }
}
exports.RegExpRule = RegExpRule;
function regex(...patterns) {
    return new RegExpRule(patterns);
}
exports.regex = regex;
class SequenceRule extends Rule {
    rules;
    match(cursor, context) {
        const matches = [];
        for (const rule of this.rules) {
            const match = context.rule(cursor, rule);
            if (!match) {
                return null;
            }
            matches.push(match);
            cursor = match.cursor;
        }
        return ruleMatch(cursor, matches);
    }
    constructor(rules) {
        super();
        this.rules = rules;
    }
}
exports.SequenceRule = SequenceRule;
function sequence(first, ...rest) {
    const rules = rulifyAll([first, ...rest]);
    if (rules.length === 0) {
        throw new Error();
    }
    if (rules.length === 1) {
        return rules[0];
    }
    return new SequenceRule(rules);
}
exports.sequence = sequence;
class UnionRule extends Rule {
    rules;
    match(cursor, context) {
        let longest = undefined;
        for (const rule of this.rules) {
            const match = context.rule(cursor, rule);
            if (!match) {
                continue;
            }
            if (!longest) {
                longest = match;
                continue;
            }
            if (match.cursor.segment > longest.cursor.segment) {
                longest = match;
                continue;
            }
            if (match.cursor.segment === longest.cursor.segment &&
                match.cursor.start > longest.cursor.start) {
                longest = match;
                continue;
            }
        }
        if (!longest) {
            return null;
        }
        return longest;
    }
    constructor(rules) {
        super();
        this.rules = rules;
    }
}
exports.UnionRule = UnionRule;
function union(first, ...rest) {
    const rules = rulifyAll([first, ...rest]);
    if (rules.length === 1) {
        return rules[0];
    }
    return new UnionRule(rules);
}
exports.union = union;
class MaybeRule extends Rule {
    rule;
    match(cursor, context) {
        const match = context.rule(cursor, this.rule);
        if (match) {
            return match;
        }
        return {
            cursor: cursor,
        };
    }
    constructor(rule) {
        super();
        this.rule = rule;
    }
}
exports.MaybeRule = MaybeRule;
function maybe(first, ...rest) {
    const rule = sequence(first, ...rest);
    return new MaybeRule(rule);
}
exports.maybe = maybe;
class StarRule extends Rule {
    rule;
    match(cursor, context) {
        const matches = [];
        let match = context.rule(cursor, this.rule);
        while (match) {
            matches.push(match);
            cursor = match.cursor;
            match = context.rule(cursor, this.rule);
        }
        return ruleMatch(cursor, matches);
    }
    constructor(rule) {
        super();
        this.rule = rule;
    }
}
exports.StarRule = StarRule;
function star(first, ...rest) {
    const rule = sequence(first, ...rest);
    return new StarRule(rule);
}
exports.star = star;
class SymbolRule extends Rule {
    symbol;
    leftRecursiveRest;
    rule;
    isLeftRecursive() {
        return !!this.leftRecursiveRest;
    }
    get() {
        return this.rule ?? null;
    }
    set(rule) {
        if (this.rule) {
            throw new Error(`Duplicate initialization of rule ${this.rule}`);
        }
        SymbolRule.symbolize(rule, this.symbol);
        if (rule instanceof UnionRule) {
            const recursive = [];
            const nonrecursive = [];
            for (const or of rule.rules) {
                if (or instanceof SequenceRule && or.rules[0] === this) {
                    const [_, second, ...rest] = or.rules;
                    recursive.push(sequence(second, ...rest));
                    continue;
                }
                nonrecursive.push(or);
            }
            if (recursive.length !== 0) {
                const [f1, ...r1] = recursive;
                this.leftRecursiveRest = union(f1, ...r1);
                const [f2, ...r2] = nonrecursive;
                rule = union(f2, ...r2);
            }
        }
        this.rule = rule;
    }
    match(cursor, context) {
        if (!this.rule) {
            throw new Error(`Uninitialized rule ${this.symbol}`);
        }
        let match = context.rule(cursor, this.rule);
        if (!match) {
            return null;
        }
        if (!match.token) {
            console.error('Left recursive match should have token.');
            return match;
        }
        match.token = token_1.Token.symbol(match.token, this.symbol);
        if (this.leftRecursiveRest) {
            let restMatch = context.rule(match.cursor, this.leftRecursiveRest);
            while (restMatch) {
                if (!restMatch.token) {
                    console.error('Left recursive rest-match should have token.');
                    break;
                }
                if (!restMatch.token.children && !restMatch.token.text) {
                    throw new Error('Successful left-recursion must emit tokens');
                }
                match = {
                    token: restMatch.token.children
                        ? token_1.Token.group([match.token, ...restMatch.token.children], this.symbol)
                        : token_1.Token.group([match.token, restMatch.token], this.symbol),
                    cursor: restMatch.cursor,
                };
                restMatch = context.rule(match.cursor, this.leftRecursiveRest);
            }
        }
        return match;
    }
    constructor(name) {
        super();
        this.symbol = name;
    }
    static symbolize(rule, symbol) {
        if (rule instanceof SymbolRule) {
            return;
        }
        rule.symbol = symbol;
        if (rule instanceof StarRule || rule instanceof MaybeRule) {
            SymbolRule.symbolize(rule.rule, symbol);
        }
        if (rule instanceof SequenceRule || rule instanceof UnionRule) {
            for (const subrule of rule.rules) {
                SymbolRule.symbolize(subrule, symbol);
            }
        }
    }
}
exports.SymbolRule = SymbolRule;
const registry = new Map();
function symbol(name) {
    const rule = new SymbolRule(name);
    if (registry.has(name)) {
        throw new Error(`Duplicate named rule ${rule}`);
    }
    return rule;
}
exports.symbol = symbol;
function rule(name) {
    const rule = registry.get(name);
    if (!rule) {
        throw new Error(`Duplicate named rule ${rule}`);
    }
    return rule;
}
exports.rule = rule;
