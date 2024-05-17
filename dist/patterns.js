"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchBlockComment = exports.BLOCK_COMMENT_CLOSE = exports.BLOCK_COMMENT_OPEN = exports.matchLineEndingComment = exports.LINE_ENDING_COMMENT_REGEX = exports.matchIdentPatternToken = exports.IDENT_PATTERN_TOKEN_REGEX = exports.matchLiteral = exports.LITERAL_REGEX = exports.FLOAT_LITERAL_REGEX = exports.FLOAT_HEX_LITERAL_REGEX = exports.FLOAT_DEC_LITERAL_REGEX = exports.INT_LITERAL_REGEX = exports.INT_HEX_LITERAL_REGEX = exports.INT_DEC_LITERAL_REGEX = exports.BOOL_LITERAL_REGEX = exports.matchBlankspace = exports.LINE_BREAK_REGEX = exports.BLANKSPACE_REGEX = exports.createStringTextMatcher = exports.createRegExpTextMatcher = void 0;
function createRegExpTextMatcher(...regexes) {
    const stickRegexes = regexes.map(r => {
        let flags = 'y';
        if (r.dotAll)
            flags += 's';
        if (r.ignoreCase)
            flags += 'i';
        if (r.multiline)
            flags += 'm';
        if (r.unicode)
            flags += 'u';
        return new RegExp(r, flags);
    });
    return (text, start) => {
        let longest = undefined;
        for (const regex of stickRegexes) {
            regex.lastIndex = start ?? 0;
            const match = regex.exec(text);
            if (match) {
                if (!longest || match[0].length > longest[0].length) {
                    longest = match;
                }
            }
        }
        return longest?.[0];
    };
}
exports.createRegExpTextMatcher = createRegExpTextMatcher;
function createStringTextMatcher(...strings) {
    return (text, position) => {
        let longest = undefined;
        if (position)
            text = text.substring(position);
        for (let string of strings) {
            if (text.startsWith(string)) {
                if (longest === undefined || string.length > longest.length) {
                    longest = string;
                }
            }
        }
        return longest;
    };
}
exports.createStringTextMatcher = createStringTextMatcher;
exports.BLANKSPACE_REGEX = /[\u0020\u0009\u000a\u000b\u000c\u000d\u0085\u200e\u200f\u2028\u2029]+/;
exports.LINE_BREAK_REGEX = /(?:\u000d\u000a?|[\u000a\u000b\u000c\u0085\u2028\u2029])/;
exports.matchBlankspace = createRegExpTextMatcher(exports.BLANKSPACE_REGEX);
exports.BOOL_LITERAL_REGEX = [/true/, /false/];
exports.INT_DEC_LITERAL_REGEX = [/0[iu]?/, /[1-9][0-9]*[iu]?/];
exports.INT_HEX_LITERAL_REGEX = [/0[xX][0-9a-fA-F]+[iu]?/];
exports.INT_LITERAL_REGEX = [...exports.INT_DEC_LITERAL_REGEX, ...exports.INT_HEX_LITERAL_REGEX];
exports.FLOAT_DEC_LITERAL_REGEX = [
    /0[fh]/,
    /[1-9][0-9]*[fh]/,
    /[0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[fh]?/,
    /[0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[fh]?/,
    /[0-9]+[eE][+-]?[0-9]+[fh]?/,
];
exports.FLOAT_HEX_LITERAL_REGEX = [
    /0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+([pP][+-]?[0-9]+[fh]?)?/,
    /0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*([pP][+-]?[0-9]+[fh]?)?/,
    /0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]?/,
];
exports.FLOAT_LITERAL_REGEX = [...exports.FLOAT_DEC_LITERAL_REGEX, ...exports.FLOAT_HEX_LITERAL_REGEX];
exports.LITERAL_REGEX = [...exports.BOOL_LITERAL_REGEX, ...exports.INT_DEC_LITERAL_REGEX, ...exports.FLOAT_LITERAL_REGEX];
exports.matchLiteral = createRegExpTextMatcher(...exports.LITERAL_REGEX);
exports.IDENT_PATTERN_TOKEN_REGEX = /([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/u;
exports.matchIdentPatternToken = createRegExpTextMatcher(exports.IDENT_PATTERN_TOKEN_REGEX);
exports.LINE_ENDING_COMMENT_REGEX = /\/\/.*$/;
exports.matchLineEndingComment = createRegExpTextMatcher(exports.LINE_ENDING_COMMENT_REGEX);
exports.BLOCK_COMMENT_OPEN = '/*';
exports.BLOCK_COMMENT_CLOSE = '*/';
function matchBlockComment(text, start) {
    start = start ?? 0;
    let position = start;
    if (text.substring(position, position + exports.BLOCK_COMMENT_OPEN.length) !== exports.BLOCK_COMMENT_OPEN) {
        return undefined;
    }
    position += exports.BLOCK_COMMENT_OPEN.length;
    let depth = 1;
    while (depth != 0) {
        let open = text.indexOf(exports.BLOCK_COMMENT_OPEN, position);
        let close = text.indexOf(exports.BLOCK_COMMENT_CLOSE, position);
        if (open !== -1 && open < close) {
            depth++;
            position = open + exports.BLOCK_COMMENT_OPEN.length;
            continue;
        }
        if (close === -1) {
            throw new Error('Unmatched bracket.');
        }
        depth--;
        position = close + exports.BLOCK_COMMENT_CLOSE.length;
    }
    return text.substring(start, position);
}
exports.matchBlockComment = matchBlockComment;
const BLANKSPACE = [
    '\u0020',
    '\u0009',
    '\u000a',
    '\u000b',
    '\u000c',
    '\u000d',
    '\u0085',
    '\u200e',
    '\u200f',
    '\u2028',
    '\u2029',
];
const LINE_BREAK = [
    '\u000a',
    '\u000b',
    '\u000c',
    '\u000d\u000a',
    '\u000d',
    '\u0085',
    '\u2028',
    '\u2029',
];
