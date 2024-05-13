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