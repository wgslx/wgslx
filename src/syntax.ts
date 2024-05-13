// https://github.com/gpuweb/gpuweb/blob/main/wgsl/syntax.bnf


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
