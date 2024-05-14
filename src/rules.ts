// Implementation of Recursive Descent Parsing as descibed in the WGSL spec.

import { TextMatcher, createRegExpTextMatcher, createStringTextMatcher } from "./patterns";
import { Cursor, Sequence } from "./sequence";

export interface Token {
    text: string;

    /** The file that the token originates from. */
    src: string;
}

export interface TokenMatch {
    // Tokens
    tokens?: Token | TokenMatch | Array<Token | TokenMatch>;

    // Rule name
    rule?: string;
}

export interface RuleMatch extends TokenMatch {
    // Next cursor after the match.
    cursor: Cursor;
}

export interface RuleExec {
    match: (cursor: Cursor, context: Context) => (RuleMatch | null);
}

export interface NamedRuleExec extends RuleExec {
    readonly name: string;
    rule?: RuleExec;
    match: (cursor: Cursor, context: Context) => (RuleMatch | null);
}


/** Context for rule token matching. */
export class Context {
    readonly sequence: Sequence;
    readonly cache = new Map<string, Map<RuleExec, RuleMatch | null>>();

    text(cursor: Cursor, matcher: TextMatcher): RuleMatch | null {
        // TODO: Optionally cache results, though this is linear cost.
        const cursorKey = this.sequence.stringify(cursor);
        const textMatch = this.sequence.match(cursor, matcher);

        if (!textMatch) {
            return null;
        }

        const segment = this.sequence.segments[textMatch.segment];
        return {
            tokens: {
                text: textMatch.text,
                src: cursorKey,
            },

            cursor: textMatch.cursor,
        }
    }

    rule(cursor: Cursor, rule: RuleExec): RuleMatch | null {
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
    get(cursorKey: string, rule: RuleExec): RuleMatch | null | undefined {
        const cursorMap = this.cache.get(cursorKey);

        if (!cursorMap) {
            return undefined;
        }

        return cursorMap.get(rule);
    }

    /** Sets a match for a position and rule in the cache. */
    set(cursorKey: string, rule: RuleExec, match: RuleMatch) {
        let cursorMap = this.cache.get(cursorKey);

        if (!cursorMap) {
            cursorMap = new Map<RuleExec, RuleMatch | null>();
            this.cache.set(cursorKey, cursorMap);
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

type RuleFlex = string | RegExp | RuleExec;

function rulify(rule: RuleFlex): RuleExec;
function rulify(rules: RuleFlex[]): RuleExec[];
function rulify(ruleOrRules: RuleFlex | RuleFlex[]): RuleExec | RuleExec[] {
    if (Array.isArray(ruleOrRules)) {
        return ruleOrRules.map(r => rulify(r));
    }

    if (typeof ruleOrRules === 'string') {
        return literal(ruleOrRules);
    }

    if (ruleOrRules instanceof RegExp) {
        return regex(ruleOrRules);
    }

    return ruleOrRules;
}

function tokenify(token: TokenMatch): TokenMatch {
    const { tokens, rule } = token;
    const t: TokenMatch = {
        tokens,
    };

    if (rule) {
        t.rule = rule;
    }

    return t;
}

export function literal(...text: string[]): RuleExec {
    const matcher = createStringTextMatcher(...text);

    // if matches, return the text.
    const rule = {
        match: (cursor: Cursor, context: Context) => {
            return context.text(cursor, matcher);
        },
    };

    return rule;
}

export function regex(...regex: RegExp[]): RuleExec {
    const matcher = createRegExpTextMatcher(...regex);

    // if matches, return the text.
    const rule = {
        match: (cursor: Cursor, context: Context) => {
            return context.text(cursor, matcher);
        },
    };

    return rule;
}

export function sequence(first: RuleFlex, ...rest: RuleFlex[]): RuleExec {
    if (rest.length === 0) {
        return rulify(first);
    }

    const rules = rulify([first, ...rest]);

    return {
        match: (cursor: Cursor, context: Context) => {
            const matches: RuleMatch[] = [];
            for (const rule of rules) {
                const match = context.rule(cursor, rule);
                if (!match) {
                    return null;
                }
                matches.push(match);
                cursor = match.cursor;
            }

            return {
                tokens: matches.map(tokenify),
                cursor: cursor,
            }
        },
    }
}

class NamedRuleExecImpl implements NamedRuleExec {
    readonly name: string;
    rule?: RuleExec;
    match(cursor: Cursor, context: Context): RuleMatch {
        if (!this.rule) {
            throw new Error(`Uninitialized rule ${this.name}`);
        }

        const match = context.rule(cursor, this.rule);

        if (match) {
            match.rule = this.name;
        }

        return match;
    }

    constructor(name: string) {
        this.name = name;
    }
}

const registry = new Map<string, NamedRuleExec>();
export function name(name: string): NamedRuleExec {
    const rule = new NamedRuleExecImpl(name);

    if (registry.has(name)) {
        throw new Error(`Duplicate named rule ${rule}`);
    }

    return rule;
}

export function rule(name: string): NamedRuleExec {
    const rule = registry.get(name);

    if (!rule) {
        throw new Error(`Duplicate named rule ${rule}`);
    }

    return rule;
}

export function union(first: RuleFlex | RuleFlex[], ...rest: (RuleFlex | RuleFlex[])[]): RuleExec {
    const rules = [first, ...rest].map(r => {
        if (Array.isArray(r)) {
            const [first, ...rest] = r;
            return sequence(first, ...rest);
        }

        return rulify(r);
    });

    if (rules.length === 1) {
        return rules[1];
    }

    return {
        match: (cursor: Cursor, context: Context) => {
            let longest: RuleMatch | undefined = undefined;

            for (const rule of rules) {
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
        },
    }

}

export function maybe(first: RuleFlex, ...rest: RuleFlex[]): RuleExec {
    const rule = rest.length
        ? sequence(first, ...rest)
        : rulify(first);

    return {
        match: (cursor: Cursor, context: Context) => {
            const match = context.rule(cursor, rule);
            if (match) {
                return match;
            }

            return {
                tokens: undefined,
                cursor: cursor,
            }
        },
    }
}

export function star(first: RuleFlex, ...rest: RuleFlex[]): RuleExec {
    const rule = rest.length
        ? sequence(first, ...rest)
        : rulify(first);

    return {
        match: (cursor: Cursor, context: Context) => {
            const matches: RuleMatch[] = [];
            let match = context.rule(cursor, rule);
            while (match) {
                matches.push(match);
                match = context.rule(cursor, rule);
            }

            return {
                tokens: matches,
                cursor: cursor,
            }
        },
    }
}