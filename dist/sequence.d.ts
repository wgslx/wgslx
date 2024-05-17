import { TextMatcher } from "./patterns";
export interface Segment {
    text: string;
    file: string;
    line: number;
    column: number;
}
export interface Cursor {
    readonly segment: number;
    readonly start: number;
}
export declare function Cursor(segment: number, start?: number): Cursor;
export interface TextMatch {
    readonly text: string;
    readonly segment: number;
    readonly start: number;
    readonly end: number;
    readonly cursor: Cursor;
}
export declare class Sequence {
    readonly segments: Segment[];
    stringify(cursor: Cursor): string;
    match(cursor: Cursor, matcher: TextMatcher): TextMatch | null;
    static from(text: string, file: string): Sequence;
    protected constructor(segments: Segment[]);
}
