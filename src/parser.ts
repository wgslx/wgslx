// Implementation of Recursive Descent Parsing as descibed in the WGSL spec.

import { TextMatcher, createRegExpTextMatcher, createStringTextMatcher } from "./patterns";
import { Cursor, Sequence, TextMatch } from "./sequence";

export interface Token {
    value: string;

    /** The file that the token originates from. */
    file: string;

    /** The line that the token originates from. */
    line: number;

    /** The column that the token originates from */
    column: number;
}

export interface TokenMatch {
    // Tokens
    tokens: Token | TokenMatch | Array<Token | TokenMatch>;

    // Rule name
    rule?: string;
}

export interface RuleMatch {
    // Matched tokens.
    match: TokenMatch;

    // Next cursor after the match.
    cursor: Cursor;
}

interface RuleExec {
    name?: string;
    match: (cursor: Cursor, context: Context) => (RuleMatch | null);
}

/** Context for rule token matching. */
export class Context {
    readonly sequence: Sequence;
    readonly cache = new Map<string, Map<RuleExec, RuleMatch | null>>();

    text(cursor: Cursor, matcher: TextMatcher): RuleMatch | null {
        // TODO: Optionally cache results, though this is linear cost.
        const textMatch = this.sequence.match(cursor, matcher);

        if (!textMatch) {
            return null;
        }

        const segment = this.sequence.segments[textMatch.segment];
        return {
            match: {
                tokens: {
                    value: textMatch.text,
                    file: segment.file,
                    line: segment.line,
                    column: segment.column + textMatch.start,
                }
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
}


/** Creates a matcher which matches a sequence. */
function named(matcherSequence: RuleExec[]) {

}

function rule(rule: Rule): RuleExec {

}

function literal(...text: string[]): RuleExec {
    const matcher = createStringTextMatcher(...text);

    // if matches, return the text.
    const rule = {
        match: (cusor: Cursor, context: Context) => {
            return context.text(cusor, matcher);
        },
    };

    return rule;
}
const regexCache = new Map<string, RuleExec>();
function regex(...regex: RegExp[]): RuleExec {
    const matcher = createRegExpTextMatcher(...regex);

    // if matches, return the text.
    const rule = {
        match: (cusor: Cursor, context: Context) => {
            return context.text(cusor, matcher);
        },
    };

    return rule;
}

/** Creates a matcher which matches a union. */
function union(rules: RuleExec[]): RuleExec {

}

/** Creates a match which matches the child matcher a variable number of times. */
function maybe(matcher: RuleExec): RuleExec {

}

/** Creates a match which matches the child matcher a variable number of times. */
function any(matcher: RuleExec): RuleExec {

}