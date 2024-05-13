export type TextMatcher = (text: string, position?: number) => string | undefined;

/** Creates a RegExp text matcher that matches any of the given regular expressions. */
export function createRegExpTextMatcher(...regexes: RegExp[]): TextMatcher {
    // Ensure that regex is sticky.
    const stickRegexes = regexes.map(r => {
        let flags = 'y';

        if (r.dotAll) flags += 's';
        if (r.ignoreCase) flags += 'i';
        if (r.multiline) flags += 'm';
        if (r.unicode) flags += 'u';

        return new RegExp(r, flags);
    });

    return (text: string, start?: number) => {
        let longest: RegExpExecArray | undefined = undefined;

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
    }
}

export function createStringTextMatcher(...strings: string[]): TextMatcher {
    return (text: string, position?: number) => {
        let longest: string | undefined = undefined;
        if (position) text = text.substring(position);

        for (let string of strings) {
            if (text.startsWith(string)) {
                if (longest === undefined || string.length > longest.length) {
                    longest = string;
                }
            }
        }

        return longest;
    }
}

export const BLANKSPACE_REGEX = /[\u0020\u0009\u000a\u000b\u000c\u000d\u0085\u200e\u200f\u2028\u2029]+/;
export const LINE_BREAK_REGEX = /(?:\u000d\u000a?|[\u000a\u000b\u000c\u0085\u2028\u2029])/;
export const matchBlankspace = createRegExpTextMatcher(BLANKSPACE_REGEX);

export const BOOL_LITERAL_REGEX = [/true/, /false/];
export const INT_DEC_LITERAL_REGEX = [/0[iu]?/, /[1-9][0-9]*[iu]?/];
export const INT_HEX_LITERAL_REGEX = [/0[xX][0-9a-fA-F]+[iu]?/];
export const INT_LITERAL_REGEX = [...INT_DEC_LITERAL_REGEX, ...INT_HEX_LITERAL_REGEX];
export const FLOAT_DEC_LITERAL_REGEX = [
    /0[fh]/,
    /[1-9][0-9]*[fh]/,
    /[0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[fh]?/,
    /[0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[fh]?/,
    /[0-9]+[eE][+-]?[0-9]+[fh]?/,
];
export const FLOAT_HEX_LITERAL_REGEX = [
    /0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+([pP][+-]?[0-9]+[fh]?)?/,
    /0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*([pP][+-]?[0-9]+[fh]?)?/,
    /0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]?/,
];
export const FLOAT_LITERAL_REGEX = [...FLOAT_DEC_LITERAL_REGEX, ...FLOAT_HEX_LITERAL_REGEX];

export const LITERAL_REGEX = [...BOOL_LITERAL_REGEX, ...INT_DEC_LITERAL_REGEX, ...FLOAT_LITERAL_REGEX];

export const matchLiteral = createRegExpTextMatcher(
    ...LITERAL_REGEX
)



export const IDENT_PATTERN_TOKEN_REGEX = /([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/u;
export const matchIdentPatternToken = createRegExpTextMatcher(IDENT_PATTERN_TOKEN_REGEX);

export const LINE_ENDING_COMMENT_REGEX = /\/\/.*$/;
export const matchLineEndingComment = createRegExpTextMatcher(LINE_ENDING_COMMENT_REGEX);



export const BLOCK_COMMENT_OPEN = '/*';
export const BLOCK_COMMENT_CLOSE = '*/';

/**
 * 
 * @param text 
 * @param start 
 * @returns The length of the block comment or -1 if there is none found.
 */
export function matchBlockComment(text: string, start?: number) {
    start = start ?? 0;
    let position = start;

    if (text.substring(position, position + BLOCK_COMMENT_OPEN.length) !== BLOCK_COMMENT_OPEN) {
        // No block comment at the current position.
        return undefined;
    }

    position += BLOCK_COMMENT_OPEN.length;
    let depth = 1;

    while (depth != 0) {
        let open = text.indexOf(BLOCK_COMMENT_OPEN, position);
        let close = text.indexOf(BLOCK_COMMENT_CLOSE, position);

        if (open !== -1 && open < close) {
            depth++;
            position = open + BLOCK_COMMENT_OPEN.length;
            continue;
        }

        if (close === -1) {
            throw new Error('Unmatched bracket.');
        }

        depth--;
        position = close + BLOCK_COMMENT_CLOSE.length;
    }

    return text.substring(start, position);
}


const BLANKSPACE = [
    '\u0020', // space
    '\u0009', // horizontal tab
    '\u000a', // line feed
    '\u000b', // vertical tab
    '\u000c', // form feed
    '\u000d', // carriage return
    '\u0085', // next line
    '\u200e', // left to right mark
    '\u200f', // right to left mark
    '\u2028', // line separator
    '\u2029', // paragraph separator
];