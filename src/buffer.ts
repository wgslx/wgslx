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
const BLANKSPACE_REGEX = /[\u0020\u0009\u000a\u000b\u000c\u000d\u0085\u200e\u200f\u2028\u2029]+/g;
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
const LINE_BREAK_REGEX = /(\u000d\u000a?|[\u000a\u000b\u000c\u0085\u2028\u2029])+/u;

interface Sequence {
    text: string,

    file: string,
    line: number,
    column: number,
}

/** Buffer for code with code pointers. */
export class Buffer {
    sequences: Sequence[];

    constructor(sequences: Sequence[]) {
        this.sequences = sequences;
    }

    static from(text: string, file: string): Buffer {
        // Split by new lines.
        const lines = text.split(LINE_BREAK_REGEX);
        const sequences: Sequence[] = [];

        for (let l = 0; l < lines.length; l++) {
            const line = lines[l];
            const whitespaceMatches = line.matchAll(BLANKSPACE_REGEX);
            let i = 0;


            for (const match of whitespaceMatches) {
                // Starts with whitespace, should only be at
                if (match.index === i) {
                    i += match.length;
                    continue;
                }

                // Add text sequence
                sequences.push({
                    text: line.substring(i, match.index),
                    file,
                    line: l,
                    column: i,
                });

                i = match.index + match.length;
            }

            // Does not end in whitespace, add the remaining characters.
            if (i !== line.length) {
                sequences.push({
                    text: line.substring(i),
                    file,
                    line: l,
                    column: i,
                });
            }
        }

        return new Buffer(sequences);
    }
}