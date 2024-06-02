import {Cursor} from './sequence';
import {Token} from './token';

/** A canary of what should have matched. */
export interface MatchCanary {}

/** A match result with the potential of having failure canaries. */
export interface MatchResult {
  token?: Token;

  canaries?: MatchCanary[];

  // Next cursor after the match.
  cursor: Cursor;
}
