// Implementation of Recursive Descent Parsing as descibed in the WGSL spec.
import { inspect } from 'util';

import { TextMatcher, createRegExpTextMatcher, createStringTextMatcher } from "./patterns";
import { Cursor, Sequence } from "./sequence";
import { Token } from "./token";
import { isValued } from './util';

export interface RuleMatch {
    token?: Token;

    // Next cursor after the match.
    cursor: Cursor;
}

export function ruleMatch(cursor: Cursor, token?: Token | RuleMatch[], symbol?: string): RuleMatch {
    if (Array.isArray(token)) {
        if (token.length === 0) {
            token = undefined;
        } else {

            token = Token.group(token.map(r => r.token).filter(isValued));
        }
    }

    if (token && symbol !== undefined) {
        token = Token.symbol(token, symbol);
    }

    return { token, cursor };
}

export interface Rule {
    symbol?: string;
    match(cursor: Cursor, context: Context): RuleMatch | null;
}

/** Context for rule token matching. */
export class Context {
    readonly sequence: Sequence;
    readonly cache = new Map<string, Map<Rule, RuleMatch | null>>();

    text(cursor: Cursor, matcher: TextMatcher): RuleMatch | null {
        // TODO: Optionally cache results, though this is linear cost.
        const cursorKey = this.sequence.stringify(cursor);
        const textMatch = this.sequence.match(cursor, matcher);

        if (!textMatch) {
            return null;
        }

        return ruleMatch(textMatch.cursor, Token.text(textMatch.text, cursorKey));
    }

    rule(cursor: Cursor, rule: Rule): RuleMatch | null {
        const cursorKey = this.sequence.stringify(cursor);
        const cached = this.get(cursorKey, rule);

        if (cached !== undefined) {
            return cached;
        }

        const match = rule.match(cursor, this);
        this.set(cursorKey, rule, match);
        return match;
    }

    /** Gets a match for a position and rule in the cache. */
    get(cursorKey: string, rule: Rule): RuleMatch | null | undefined {
        const cursorMap = this.cache.get(cursorKey);

        if (!cursorMap) {
            return undefined;
        }

        const cached = cursorMap.get(rule);
        return cached
            ? { cursor: cached.cursor, token: cached.token?.clone() }
            : cached;
    }

    /** Sets a match for a position and rule in the cache. */
    set(cursorKey: string, rule: Rule, match: RuleMatch | null) {
        let cursorMap = this.cache.get(cursorKey);

        if (!cursorMap) {
            cursorMap = new Map<Rule, RuleMatch | null>();
            this.cache.set(cursorKey, cursorMap);
        }

        if (match) {
            match = { cursor: match.cursor, token: match.token?.clone() };
        }

        cursorMap.set(rule, match);
    }

    constructor(sequence: Sequence) {
        this.sequence = sequence;
    }

    static from(text: string, file: string): Context {
        return new Context(Sequence.from(text, file));
    }
}

type FlexRule = string | RegExp | Rule;

function rulifyOne(rule: FlexRule): Rule {
    if (typeof rule === 'string') {
        return literal(rule);
    }

    if (rule instanceof RegExp) {
        return regex(rule);
    }

    return rule;
}

function rulifyAll(rules: FlexRule[]): Rule[] {
    return rules.map(r => rulifyOne(r));
}

export class LiteralRule implements Rule {
    readonly matcher: TextMatcher;
    readonly literals: string[];

    match(cursor: Cursor, context: Context): RuleMatch | null {
        return context.text(cursor, this.matcher);
    }

    constructor(literals: string[]) {
        this.matcher = createStringTextMatcher(...literals);
        this.literals = literals;
    }
}

export function literal(...literals: string[]): Rule {
    return new LiteralRule(literals);
}

export class RegExpRule implements Rule {
    readonly matcher: TextMatcher;
    readonly patterns: RegExp[];

    match(cursor: Cursor, context: Context): RuleMatch | null {
        return context.text(cursor, this.matcher);
    }

    constructor(patterns: RegExp[]) {
        this.matcher = createRegExpTextMatcher(...patterns);
        this.patterns = patterns;
    }
}

export function regex(...patterns: RegExp[]): Rule {
    return new RegExpRule(patterns)
}

export class SequenceRule implements Rule {
    readonly rules: Rule[];

    match(cursor: Cursor, context: Context): RuleMatch | null {
        const matches: RuleMatch[] = [];
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

    constructor(rules: Rule[]) {
        this.rules = rules;
    }
}

export function sequence(first: FlexRule, ...rest: FlexRule[]): Rule {
    const rules = rulifyAll([first, ...rest]);

    if (rules.length === 0) {
        throw new Error();
    }

    if (rules.length === 1) {
        return rules[0];
    }

    return new SequenceRule(rules);
}

export class UnionRule implements Rule {
    readonly rules: Rule[];

    match(cursor: Cursor, context: Context): RuleMatch | null {

        let longest: RuleMatch | undefined = undefined;

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

    constructor(rules: Rule[]) {
        this.rules = rules;
    }
}

export function union(first: FlexRule, ...rest: FlexRule[]): Rule {
    const rules = rulifyAll([first, ...rest]);

    if (rules.length === 1) {
        return rules[0];
    }

    // const literals: LiteralRule[] = [];
    // const regexps: RegExpRule[] = [];
    // const others: RuleExec[] = [];

    return new UnionRule(rules);
}

export class MaybeRule implements Rule {
    readonly rule: Rule;

    match(cursor: Cursor, context: Context): RuleMatch | null {
        const match = context.rule(cursor, this.rule);
        if (match) {
            if (match.token) {
                match.token = Token.symbol(match.token, '?');
            }
            return match;
        }

        return {
            cursor: cursor,
        }
    }

    constructor(rule: Rule) {
        this.rule = rule;
    }
}

export function maybe(first: FlexRule, ...rest: FlexRule[]): Rule {
    const rule = sequence(first, ...rest);
    return new MaybeRule(rule);
}

export class StarRule implements Rule {
    readonly rule: Rule;

    match(cursor: Cursor, context: Context): RuleMatch | null {
        const matches: RuleMatch[] = [];
        let match = context.rule(cursor, this.rule);
        while (match) {
            matches.push(match);
            cursor = match.cursor;
            match = context.rule(cursor, this.rule);
        }

        return ruleMatch(cursor, matches, "*");
    }

    constructor(rule: Rule) {
        this.rule = rule;
    }
}

export function star(first: FlexRule, ...rest: FlexRule[]): Rule {
    const rule = sequence(first, ...rest);
    return new StarRule(rule);
}

export class SymbolRule implements Rule {
    readonly symbol: string;
    private leftRecursiveRest?: Rule;
    private rule?: Rule;

    isLeftRecursive() {
        return !!this.leftRecursiveRest;
    }

    get(): Rule | null {
        return this.rule ?? null;
    }

    set(rule: Rule) {
        if (this.rule) {
            throw new Error(`Duplicate initialization of rule ${this.rule}`);
        }

        SymbolRule.symbolize(rule, this.symbol);

        // Look for left recursion.
        if (rule instanceof UnionRule) {
            const recursive: Rule[] = [];
            const nonrecursive: Rule[] = [];

            for (const or of rule.rules) {
                if (or instanceof SequenceRule && or.rules[0] === this) {
                    // Left recursion detected, remove the recursive element.
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

    match(cursor: Cursor, context: Context): RuleMatch | null {
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

        match.token = Token.symbol(match.token, this.symbol);

        if (this.leftRecursiveRest) {
            let restMatch = context.rule(match.cursor, this.leftRecursiveRest);
            while (restMatch) {
                if (!restMatch.token) {
                    console.error('Left recursive rest-match should have token.');
                    break;
                }

                // Left recursion found.
                if (!restMatch.token.children && !restMatch.token.text) {
                    throw new Error('Successful left-recursion must emit tokens');
                }

                match = {
                    token: restMatch.token.children
                        ? Token.group([match.token!, ...restMatch.token.children], this.symbol)
                        : Token.group([match.token!, restMatch.token], this.symbol),
                    cursor: restMatch.cursor,
                };

                restMatch = context.rule(match.cursor, this.leftRecursiveRest);
            }
        }

        return match;
    }

    constructor(name: string) {
        this.symbol = name;
    }

    static symbolize(rule: Rule, symbol: string) {
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

const registry = new Map<string, SymbolRule>();
export function symbol(name: string): SymbolRule {
    const rule = new SymbolRule(name);

    if (registry.has(name)) {
        throw new Error(`Duplicate named rule ${rule}`);
    }

    return rule;
}

export function rule(name: string): SymbolRule {
    const rule = registry.get(name);

    if (!rule) {
        throw new Error(`Duplicate named rule ${rule}`);
    }

    return rule;
}
