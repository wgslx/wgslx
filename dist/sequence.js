"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sequence = exports.Cursor = void 0;
const preprocess_1 = require("./preprocess");
const BLANKSPACE_GLOBAL_REGEX = /[\u0020\u0009\u000a\u000b\u000c\u000d\u0085\u200e\u200f\u2028\u2029]+/g;
const LINE_BREAK_REGEX = /(?:\u000d\u000a?|[\u000a\u000b\u000c\u0085\u2028\u2029])/;
function Cursor(segment, start = 0) {
    return { segment, start };
}
exports.Cursor = Cursor;
class Sequence {
    segments;
    stringify(cursor) {
        if (cursor.segment >= this.segments.length) {
            return 'eof';
        }
        const segment = this.segments[cursor.segment];
        return `${segment.line}:${segment.column + cursor.start}:${segment.file}`;
    }
    match(cursor, matcher) {
        if (cursor.segment >= this.segments.length) {
            return null;
        }
        const segment = this.segments[cursor.segment];
        const match = matcher(segment.text, cursor.start);
        if (!match) {
            return null;
        }
        let next;
        if (cursor.start + match.length === segment.text.length) {
            next = {
                segment: cursor.segment + 1,
                start: 0,
            };
        }
        else {
            next = {
                segment: cursor.segment,
                start: cursor.start + match.length,
            };
        }
        return {
            text: match,
            segment: cursor.segment,
            start: cursor.start,
            end: cursor.start + match.length,
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
