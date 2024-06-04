"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = exports.symbol = exports.SymbolRule = exports.star = exports.StarRule = exports.maybe = exports.MaybeRule = exports.union = exports.UnionRule = exports.sequence = exports.SequenceRule = exports.regex = exports.RegExpRule = exports.literal = exports.LiteralRule = exports.Rule = exports.Context = exports.MatchResult = void 0;
const patterns_1 = require("./patterns");
const sequence_1 = require("./sequence");
const token_1 = require("./token");
class MatchResult {
    match;
    canaries;
    clone() {
        const result = new MatchResult();
        if (this.match) {
            result.match = {
                token: this.match.token.clone(),
                cursor: this.match.cursor,
            };
        }
        if (this.canaries) {
            result.canaries = this.canaries.map((c) => ({
                rules: [...c.rules],
                cursor: c.cursor,
            }));
        }
        return result;
    }
    static success(cursor, token) {
        const result = new MatchResult();
        result.match = { token, cursor };
        return result;
    }
    static successFrom(rule, match, canaries) {
        const result = new MatchResult();
        result.match = match;
        if (canaries) {
            result.canaries = canaries
                .filter((c) => (0, sequence_1.cursorGreaterOrEqualThan)(c.cursor, match.cursor))
                .map((c) => ({
                rules: [...c.rules, rule],
                cursor: c.cursor,
            }));
        }
        return result;
    }
    static failure(cursor, rule) {
        const result = new MatchResult();
        result.canaries = [{ rules: [rule], cursor }];
        return result;
    }
    static failureFrom(rule, canaries) {
        const result = new MatchResult();
        if (!canaries || canaries.length === 0) {
            throw new Error('Expected canaries');
        }
        result.canaries = canaries.map((c) => ({
            rules: [...c.rules, rule],
            cursor: c.cursor,
        }));
        return result;
    }
}
exports.MatchResult = MatchResult;
class Context {
    sequence;
    cache = new Map();
    text(cursor, textRule) {
        const cursorKey = this.sequence.stringify(cursor);
        const textMatch = this.sequence.match(cursor, textRule.matcher);
        if (!textMatch) {
            return MatchResult.failure(cursor, textRule);
        }
        const match = MatchResult.success(textMatch.cursor, token_1.Token.text(textMatch.text, cursorKey));
        return match;
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
        if (!cached) {
            return undefined;
        }
        return cached.clone();
    }
    set(cursorKey, rule, matchResult) {
        let cursorMap = this.cache.get(cursorKey);
        if (!cursorMap) {
            cursorMap = new Map();
            this.cache.set(cursorKey, cursorMap);
        }
        cursorMap.set(rule, matchResult.clone());
    }
    constructor(sequence) {
        this.sequence = sequence;
    }
    static from(text, file) {
        return new Context(sequence_1.Sequence.from(text, file));
    }
    matchSource(rootRule) {
        const cursor = (0, sequence_1.Cursor)(0);
        const matchResult = rootRule.match(cursor, this);
        if (matchResult.canaries) {
            matchResult.canaries.sort((a, b) => -(0, sequence_1.compareCursor)(a.cursor, b.cursor));
        }
        if (!matchResult.match) {
            return matchResult;
        }
        const { match } = matchResult;
        if (match.cursor.segment < this.sequence.segments.length) {
            return MatchResult.failure(cursor, rootRule);
        }
        return matchResult;
    }
    static matchSource(text, file, rootRule) {
        const context = Context.from(text, file);
        return context.matchSource(rootRule);
    }
}
exports.Context = Context;
class Rule {
    symbol;
}
exports.Rule = Rule;
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
    return rules.map((r) => rulifyOne(r));
}
class LiteralRule extends Rule {
    matcher;
    literals;
    match(cursor, context) {
        return context.text(cursor, this);
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
        return context.text(cursor, this);
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
        const tokens = [];
        for (const rule of this.rules) {
            const matchResult = context.rule(cursor, rule);
            if (!matchResult.match) {
                if (!matchResult.canaries) {
                    throw new Error('Expected match or canaries');
                }
                return MatchResult.failureFrom(this, matchResult.canaries);
            }
            tokens.push(matchResult.match.token);
            cursor = matchResult.match.cursor;
        }
        const token = token_1.Token.group(tokens, '()');
        return MatchResult.success(cursor, token);
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
        let longestMatch = undefined;
        let combinedCanaries = [];
        for (const rule of this.rules) {
            const matchResult = context.rule(cursor, rule);
            if (!matchResult.match) {
                if (!matchResult.canaries) {
                    throw new Error('Expected match or canaries');
                }
                combinedCanaries.push(...matchResult.canaries);
                continue;
            }
            const { match, canaries } = matchResult;
            if (canaries) {
                combinedCanaries.push(...canaries);
            }
            if (!longestMatch) {
                longestMatch = match;
                continue;
            }
            if ((0, sequence_1.cursorGreaterThan)(match.cursor, longestMatch.cursor)) {
                longestMatch = match;
                continue;
            }
        }
        if (!longestMatch) {
            return MatchResult.failureFrom(this, combinedCanaries);
        }
        return MatchResult.successFrom(this, longestMatch, combinedCanaries);
    }
    constructor(rules) {
        super();
        this.rules = rules;
        if (this.rules.length === 0) {
            throw new Error('Expected at least one rule in a union.');
        }
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
        const matchResult = context.rule(cursor, this.rule);
        const token = matchResult.match ? [matchResult.match.token] : [];
        const match = {
            token: token_1.Token.group(token, '?'),
            cursor: matchResult.match ? matchResult.match.cursor : cursor,
        };
        return MatchResult.successFrom(this, match, matchResult.canaries);
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
        const tokens = [];
        let matchResult = context.rule(cursor, this.rule);
        while (matchResult.match) {
            tokens.push(matchResult.match.token);
            cursor = matchResult.match.cursor;
            matchResult = context.rule(cursor, this.rule);
        }
        const result = {
            token: token_1.Token.group(tokens, '*'),
            cursor,
        };
        return MatchResult.successFrom(this, result, matchResult.canaries);
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
        let matchResult = context.rule(cursor, this.rule);
        if (!matchResult.match) {
            return MatchResult.failureFrom(this, matchResult.canaries);
        }
        let match = matchResult.match;
        match.token = token_1.Token.symbol(match.token, this.symbol);
        if (this.leftRecursiveRest) {
            matchResult = context.rule(match.cursor, this.leftRecursiveRest);
            while (matchResult.match) {
                let restMatch = matchResult.match;
                if (!restMatch.token.children && !restMatch.token.text) {
                    throw new Error('Successful left-recursion must emit tokens');
                }
                match = {
                    token: restMatch.token.children
                        ? token_1.Token.group([match.token, ...restMatch.token.children], 'left-recursion', this.symbol)
                        : token_1.Token.group([match.token, restMatch.token], 'left-recursion', this.symbol),
                    cursor: restMatch.cursor,
                };
                matchResult = context.rule(match.cursor, this.leftRecursiveRest);
            }
        }
        return MatchResult.successFrom(this, match, matchResult.canaries);
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
