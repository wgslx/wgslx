"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sequence = exports.cursorGreaterOrEqualThan = exports.cursorGreaterThan = exports.compareCursor = exports.Cursor = void 0;
const preprocess_1 = require("./preprocess");
const BLANKSPACE_GLOBAL_REGEX = /[\u0020\u0009\u000a\u000b\u000c\u000d\u0085\u200e\u200f\u2028\u2029]+/g;
const LINE_BREAK_REGEX = /(?:\u000d\u000a?|[\u000a\u000b\u000c\u0085\u2028\u2029])/;
function Cursor(segment, start = 0) {
    return { segment, offset: start };
}
exports.Cursor = Cursor;
function compareCursor(a, b) {
    if (a.segment === b.segment) {
        return a.offset - b.offset;
    }
    return a.segment - b.segment;
}
exports.compareCursor = compareCursor;
function cursorGreaterThan(candidate, current) {
    if (candidate.segment > current.segment) {
        return true;
    }
    if (candidate.segment === current.segment) {
        return candidate.offset > current.offset;
    }
    return false;
}
exports.cursorGreaterThan = cursorGreaterThan;
function cursorGreaterOrEqualThan(candidate, current) {
    if (candidate.segment >= current.segment) {
        return true;
    }
    if (candidate.segment === current.segment) {
        return candidate.offset >= current.offset;
    }
    return false;
}
exports.cursorGreaterOrEqualThan = cursorGreaterOrEqualThan;
class Sequence {
    segments;
    stringify(cursor) {
        if (cursor.segment >= this.segments.length) {
            return 'eof';
        }
        const segment = this.segments[cursor.segment];
        return `${segment.line}:${segment.column + cursor.offset}:${segment.file}`;
    }
    toSourceCursor(cursor) {
        if (cursor.segment >= this.segments.length) {
            return { line: -1, column: -1 };
        }
        const segment = this.segments[cursor.segment];
        return { line: segment.line + 1, column: segment.column + cursor.offset + 1 };
    }
    match(cursor, matcher) {
        if (cursor.segment >= this.segments.length) {
            return null;
        }
        const segment = this.segments[cursor.segment];
        const match = matcher(segment.text, cursor.offset);
        if (!match) {
            return null;
        }
        let next;
        if (cursor.offset + match.length === segment.text.length) {
            next = {
                segment: cursor.segment + 1,
                offset: 0,
            };
        }
        else {
            next = {
                segment: cursor.segment,
                offset: cursor.offset + match.length,
            };
        }
        return {
            text: match,
            segment: cursor.segment,
            offset: cursor.offset,
            end: cursor.offset + match.length,
            cursor: next,
        };
    }
    static from(text, file) {
        text = (0, preprocess_1.preprocess)(text);
        const lines = text.split(LINE_BREAK_REGEX);
        const segments = [];
        for (let l = 0; l < lines.length; l++) {
            const line = lines[l];
            const whitespaceMatches = line.matchAll(BLANKSPACE_GLOBAL_REGEX);
            let i = 0;
            for (const match of whitespaceMatches) {
                if (match.index === i) {
                    i += match[0].length;
                    continue;
                }
                segments.push({
                    text: line.substring(i, match.index),
                    file,
                    line: l,
                    column: i,
                });
                i = match.index + match.length;
            }
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
    constructor(segments) {
        this.segments = segments;
    }
}
exports.Sequence = Sequence;
