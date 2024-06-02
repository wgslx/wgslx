import { Cursor } from './sequence';
import { Token } from './token';
export interface MatchCanary {
}
export interface MatchResult {
    token?: Token;
    canaries?: MatchCanary[];
    cursor: Cursor;
}
