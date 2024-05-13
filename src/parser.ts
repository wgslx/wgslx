// Implementation of Recursive Descent Parsing as descibed in the WGSL spec.

const DECIMAL_INT_LITERAL = [/0[iu]?/, /[1-9][0-9]*[iu]?/];
const HEX_INT_LITERAL = [/0[xX][0-9a-fA-F]+[iu]?/];

const DECIMAL_FLOAT_LITERAL = [
    /0[fh]/,
    /[1-9][0-9]*[fh]/,
    /[0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[fh]?/,
    /[0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[fh]?/,
    /[0-9]+[eE][+-]?[0-9]+[fh]?/,
];

const HEX_FLOAT_LITERAL = [
    /0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+([pP][+-]?[0-9]+[fh]?)?/,
    /0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*([pP][+-]?[0-9]+[fh]?)?/,
    /0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]?/,
];

const IDENT_PATTERN_TOKEN = [
    /([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/u,
]



type Matcher = () => void;

/** Creates a matcher which matches any of the given literals exactly. */
function createLiteralMatcher(literals: string[]) {

}

/** Creates a matcher which matches any of the given regular expressions. */
function createRegularExpressionMatcher(regularExpressions: RegExp[]) {

}

/** Creates a matcher which matches a sequence. */
function createSequentialMatcher(matcherSequence: Matcher[]) {

}

/** Creates a matcher which matches a union. */
function createUnionMatcher(matchers: Matcher[]) {

}

/** Creates a match which matches the child matcher a variable number of times. */
function createRepeatedMatcher(matcher: Matcher) {

}