import { TextMatcher } from "./patterns";
import { preprocess } from "./preprocess";

/** Global match regex for all blankspace. */
const BLANKSPACE_GLOBAL_REGEX = /[\u0020\u0009\u000a\u000b\u000c\u000d\u0085\u200e\u200f\u2028\u2029]+/g;

/** Line break regex. */
const LINE_BREAK_REGEX = /(?:\u000d\u000a?|[\u000a\u000b\u000c\u0085\u2028\u2029])/;

export interface Segment {
    /** The text contained in the segment. */
    text: string,

    /** The file that the segment belongs to. */
    file: string,

    /** The line number of the segment. */
    line: number,

    /** The beginning column number of the text. */
    column: number,
}

/** Cursor pointing to a specific location in a code sequence. */
export interface Cursor {
    readonly segment: number;
    readonly start: number;
}

export function Cursor(segment: number, start = 0): Cursor {
    return { segment, start }
}

/** Match in a code sequence containing the match and the advanced cursor. */
export interface TextMatch {
    /** The text of the match. */
    readonly text: string;

    /** The segment number of the match. */
    readonly segment: number;

    /** The starting position of the match inside the sequence. */
    readonly start: number;

    /** The ending position of the match inside the sequence. */
    readonly end: number;

    /** The next cursor. */
    readonly cursor: Cursor;
}

/**
 * Code sequence for parsing. The segments are separated by whitespace and comments are removed.
 * Matching tokens never crosses whitespace delimiters in WGSL and this will allow us to inject
 * code from multiple files.
 */
export class Sequence {
    /** List of segments that make up the sequence. */
    readonly segments: Segment[];

    stringify(cursor: Cursor): string {
        if (cursor.segment >= this.segments.length) {
            return 'eof';
        }

        const segment = this.segments[cursor.segment];
        return `${segment.line}:${segment.column + cursor.start}:${segment.file}`;
    }

    /** Tries to match the text matcher at the given position. */
    match(cursor: Cursor, matcher: TextMatcher): TextMatch | null {
        if (cursor.segment >= this.segments.length) {
            return null;
        }

        const segment = this.segments[cursor.segment];
        const match = matcher(segment.text, cursor.start);

        // Match not found
        if (!match) {
            return null;
        }

        let next: Cursor;

        if (cursor.start + match.length === segment.text.length) {
            // Match found and takes the rest of the segment.
            next = {
                segment: cursor.segment + 1,
                start: 0,
            }
        } else {
            // Match was found and there is more in this segment.
            next = {
                segment: cursor.segment,
                start: cursor.start + match.length,
            }
        }

        return {
            text: match,
            segment: cursor.segment,
            start: cursor.start,
            end: cursor.start + match.length,

            cursor: next,
        }
    }

    /** Creates a sequence from the specified file text and file name. */
    static from(text: string, file: string): Sequence {
        text = preprocess(text);
        // Split by new lines.
        const lines = text.split(LINE_BREAK_REGEX);
        const segments: Segment[] = [];

        for (let l = 0; l < lines.length; l++) {
            const line = lines[l];
            const whitespaceMatches = line.matchAll(BLANKSPACE_GLOBAL_REGEX);
            let i = 0;

            for (const match of whitespaceMatches) {
                // Starts with whitespace, should only be at
                if (match.index === i) {
                    i += match.length;
                    continue;
                }

                // Add text sequence
                segments.push({
                    text: line.substring(i, match.index),
                    file,
                    line: l,
                    column: i,
                });

                i = match.index + match.length;
            }

            // Does not end in whitespace, add the remaining characters.
            if (i !== line.length) {
                segments.push({
                    text: line.substring(i),
                    file,
                    line: l,
                    column: i,
                });
            }
        }

        return new Sequence(segments);
    }

    protected constructor(segments: Segment[]) {
        this.segments = segments;
    }
}
