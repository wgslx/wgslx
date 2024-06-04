import { TextMatcher } from './patterns';
export interface Segment {
    text: string;
    file: string;
    line: number;
    column: number;
}
export interface Cursor {
    readonly segment: number;
    readonly offset: number;
}
export declare function Cursor(segment: number, start?: number): Cursor;
export declare function compareCursor(a: Cursor, b: Cursor): number;
export declare function cursorGreaterThan(candidate: Cursor, current: Cursor): boolean;
export declare function cursorGreaterOrEqualThan(candidate: Cursor, current: Cursor): boolean;
export interface SourceCursor {
    readonly line: number;
    readonly column: number;
}
export interface TextMatch {
    readonly text: string;
    readonly segment: number;
    readonly offset: number;
    readonly end: number;
    readonly cursor: Cursor;
}
export declare class Sequence {
    readonly segments: Segment[];
    stringify(cursor: Cursor): string;
    toSourceCursor(cursor: Cursor): SourceCursor;
    match(cursor: Cursor, matcher: TextMatcher): TextMatch | null;
    static from(text: string, file: string): Sequence;
    protected constructor(segments: Segment[]);
}
