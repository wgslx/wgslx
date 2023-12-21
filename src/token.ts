/**
 * @see https://www.w3.org/TR/WGSL/#tokens
 */

export interface Token {
    value: string;
    line: number;
    column: number;
}