// Implementation of Recursive Descent Parsing as descibed in the WGSL spec.

import { Cursor } from "./cursor";
import { Token } from "./token";

const BOOL_LITERAL = [/true/, /false/];
const INT_DEC_LITERAL = [/0[iu]?/, /[1-9][0-9]*[iu]?/];
const INT_HEX_LITERAL = [/0[xX][0-9a-fA-F]+[iu]?/];

const FLOAT_DEC_LITERAL = [
    /0[fh]/,
    /[1-9][0-9]*[fh]/,
    /[0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[fh]?/,
    /[0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[fh]?/,
    /[0-9]+[eE][+-]?[0-9]+[fh]?/,
];
const FLOAT_HEX_LITERAL = [
    /0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+([pP][+-]?[0-9]+[fh]?)?/,
    /0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*([pP][+-]?[0-9]+[fh]?)?/,
    /0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]?/,
];

const IDENT_PATTERN_TOKEN = [
    /([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/u,
]

interface RuleExec {
    name?: string;
    match: (cursor: Cursor) => Token[] | null;
}

type Rule = RuleExec | string | RegExp | Rule[];

/** Creates a matcher which matches a sequence. */
function named(matcherSequence: RuleExec[]) {

}

function rule(rule: Rule): RuleExec {

}

const literalCache = new Map<string, RuleExec>();
function literal(text: string): RuleExec {
    if (literalCache.has(text)) {
        return literalCache.get(text);
    }

    // if matches, return the text.
    const rule = {
        match: () => [],
    };

    literalCache.set(text, rule);
    return rule;
}

const regexCache = new Map<string, RuleExec>();
function regex(regex: RegExp): RuleExec {
    // Create sticky regex.

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