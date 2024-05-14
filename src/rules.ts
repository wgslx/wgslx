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
    name?: string;
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

function rulify(rules: RuleFlex[]): RuleExec[] {
    return rules.map(r => {
        if (typeof r === 'string') {
            return literal(r);
        }

        if (r instanceof RegExp) {
            return regex(r);
        }

        return r;
    });
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

export function named(name: string, rule: RuleExec): RuleExec {
    return {
        match: (cursor: Cursor, context: Context) => {
            const match = context.rule(cursor, rule);

            if (match) {
                match.rule = name;
            }

            return match;
        },
    };
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

export function sequence(...rulesRegexOrLiterals: RuleFlex[]): RuleExec {
    const rules = rulify(rulesRegexOrLiterals);
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

export function union(...rulesRegexOrLiterals: RuleFlex[]): RuleExec {
    const rules = rulify(rulesRegexOrLiterals);

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
    const rules = rulify([first, ...rest]);
    const rule = rules.length > 1
        ? sequence(...rules)
        : rules[0];

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
    const rules = rulify([first, ...rest]);
    const rule = rules.length > 1
        ? sequence(...rules)
        : rules[0];

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