"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = exports.symbol = exports.SymbolRule = exports.star = exports.StarRule = exports.maybe = exports.MaybeRule = exports.union = exports.UnionRule = exports.sequence = exports.SequenceRule = exports.regex = exports.RegExpRule = exports.literal = exports.LiteralRule = exports.Rule = exports.Context = exports.MatchResult = void 0;
const patterns_1 = require("./patterns");
const sequence_1 = require("./sequence");
const token_1 = require("./token");
class MatchResult {
    match;
    canaries = [];
    clone() {
        const result = new MatchResult();
        if (this.match) {
            result.match = {
                token: this.match.token.clone(),
                cursor: this.match.cursor,
            };
        }
        result.canaries = this.canaries.map((c) => ({
            rules: [...c.rules],
            cursor: c.cursor,
        }));
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
        result.canaries = this.augmentCanaries(rule, canaries, match.cursor);
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
        result.canaries = this.augmentCanaries(rule, canaries);
        return result;
    }
    static augmentCanaries(rule, canaries, cursor) {
        if (cursor) {
            canaries = canaries.filter((c) => (0, sequence_1.cursorGreaterOrEqualThan)(c.cursor, cursor));
        }
        if (canaries.length === 0) {
            return [];
        }
        canaries.sort((a, b) => -(0, sequence_1.compareCursor)(a.cursor, b.cursor));
        let culledCanaries = [];
        let canary = {
            rules: [...canaries[0].rules, rule],
            cursor: canaries[0].cursor,
        };
        for (let i = 1; i < canaries.length; i++) {
            if ((0, sequence_1.compareCursor)(canaries[i].cursor, canary.cursor) === 0) {
                if (canaries[i].rules.length < canary.rules.length) {
                    canary = {
                        rules: [...canaries[i].rules, rule],
                        cursor: canaries[i].cursor,
                    };
                }
            }
            else {
                culledCanaries.push(canary);
                if (culledCanaries.length >= 5) {
                    return culledCanaries;
                }
            }
        }
        return [canary];
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
        if (matchResult.match.cursor.segment < this.sequence.segments.length) {
            matchResult.match = undefined;
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
        const canaries = [];
        for (const rule of this.rules) {
            const matchResult = context.rule(cursor, rule);
            canaries.push(...matchResult.canaries);
            if (!matchResult.match) {
                return MatchResult.failureFrom(this, canaries);
            }
            tokens.push(matchResult.match.token);
            cursor = matchResult.match.cursor;
        }
        const token = token_1.Token.group(tokens, 'S');
        return MatchResult.successFrom(this, {
            cursor,
            token,
        }, canaries);
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
            combinedCanaries.push(...matchResult.canaries);
            if (!matchResult.match) {
                continue;
            }
            if (!longestMatch) {
                longestMatch = matchResult.match;
                continue;
            }
            if ((0, sequence_1.cursorGreaterThan)(matchResult.match.cursor, longestMatch.cursor)) {
                longestMatch = matchResult.match;
                continue;
            }
        }
        if (!longestMatch) {
            return MatchResult.failureFrom(this, combinedCanaries);
        }
        longestMatch.token = token_1.Token.group([longestMatch.token], 'U');
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
    modifiedSymbol;
    match(cursor, context) {
        const matchResult = context.rule(cursor, this.rule);
        const token = matchResult.match ? [matchResult.match.token] : [];
        const match = {
            token: token_1.Token.modify(token, '?', this.modifiedSymbol),
            cursor: matchResult.match ? matchResult.match.cursor : cursor,
        };
        return MatchResult.successFrom(this, match, matchResult.canaries);
    }
    constructor(rule) {
        super();
        this.rule = rule;
        if (rule instanceof SymbolRule) {
            this.modifiedSymbol = rule.symbol;
        }
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
    modifiedSymbol;
    match(cursor, context) {
        const tokens = [];
        let matchResult = context.rule(cursor, this.rule);
        const canaries = [];
        while (matchResult.match) {
            tokens.push(matchResult.match.token);
            cursor = matchResult.match.cursor;
            matchResult = context.rule(cursor, this.rule);
        }
        const result = {
            token: token_1.Token.modify(tokens, '*', this.modifiedSymbol),
            cursor,
        };
        return MatchResult.successFrom(this, result, matchResult.canaries);
    }
    constructor(rule) {
        super();
        this.rule = rule;
        if (rule instanceof SymbolRule) {
            this.modifiedSymbol = rule.symbol;
        }
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
    leftRecursiveTail;
    rule;
    isLeftRecursive() {
        return !!this.leftRecursiveTail;
    }
    get() {
        return this.rule ?? null;
    }
    set(rule) {
        if (this.rule) {
            throw new Error(`Duplicate initialization of rule ${this.rule}`);
        }
        if (rule instanceof UnionRule) {
            const tail = [];
            const body = [];
            for (const or of rule.rules) {
                if (or instanceof SequenceRule && or.rules[0] === this) {
                    const [_, second, ...rest] = or.rules;
                    tail.push(sequence(second, ...rest));
                    continue;
                }
                body.push(or);
            }
            if (tail.length !== 0) {
                const [tail1, ...tailRest] = tail;
                this.leftRecursiveTail = union(tail1, ...tailRest);
                const [body1, ...bodyRest] = body;
                rule = union(body1, ...bodyRest);
            }
        }
        this.rule = rule;
    }
    match(cursor, context) {
        const bodyRule = this.rule;
        if (!bodyRule) {
            throw new Error(`Uninitialized rule ${this.symbol}`);
        }
        let initialMatchResult = context.rule(cursor, bodyRule);
        if (!initialMatchResult.match) {
            return MatchResult.failureFrom(this, initialMatchResult.canaries);
        }
        if (!this.leftRecursiveTail) {
            initialMatchResult.match.token = token_1.Token.symbol(initialMatchResult.match.token, this.symbol);
            return MatchResult.successFrom(this, initialMatchResult.match, initialMatchResult.canaries);
        }
        const tailRule = this.leftRecursiveTail;
        const recursiveBodyMatchResults = [initialMatchResult];
        let matchResult = context.rule(initialMatchResult.match.cursor, bodyRule);
        while (matchResult.match) {
            recursiveBodyMatchResults.push(matchResult);
            matchResult = context.rule(matchResult.match.cursor, bodyRule);
        }
        let tailCanaries = [];
        for (let i = recursiveBodyMatchResults.length - 1; i >= 0; i--) {
            const bodyMatchResult = recursiveBodyMatchResults[i];
            const tailMatchResult = context.rule(bodyMatchResult.match.cursor, tailRule);
            if (tailMatchResult.match) {
                const tokens = recursiveBodyMatchResults
                    .slice(0, i + 1)
                    .map((r) => r.match.token);
                tokens.push(tailMatchResult.match.token);
                return MatchResult.successFrom(this, {
                    token: token_1.Token.group(tokens, 'L', this.symbol),
                    cursor: tailMatchResult.match.cursor,
                }, [
                    ...recursiveBodyMatchResults[i].canaries,
                    ...tailMatchResult.canaries,
                ]);
            }
            tailCanaries.push(...tailMatchResult.canaries);
        }
        initialMatchResult.match.token = token_1.Token.symbol(initialMatchResult.match.token, this.symbol);
        return MatchResult.successFrom(this, initialMatchResult.match, [
            ...initialMatchResult.canaries,
            ...tailCanaries,
        ]);
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
