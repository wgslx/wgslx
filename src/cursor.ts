import { Cursor, Sequence } from './sequence';
import { TextMatcher } from './patterns';


export class Context {
    readonly buffer: Sequence;
    readonly cursor: Cursor;

    rule(cursor: Cursor) {

    }
}