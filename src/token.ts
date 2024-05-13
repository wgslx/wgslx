/**
 * @see https://www.w3.org/TR/WGSL/#tokens
 */

export interface Token {
    value: string;

    /** The file that the token originates from. */
    file: string;

    /** The line that the token originates from. */
    line: number;

    /** The column that the token originates from */
    column: number;
}


const LINE_BREAK = [
    '\u000a', // line feed
    '\u000b', // vertical tab
    '\u000c', // form feed
    '\u000d\u000a', // carriage return when followed by line feed
    '\u000d', // carriage return when not folled by line feed
    '\u0085', // next line
    '\u2028', // line sparator
    '\u2029', // paragraph separator
];