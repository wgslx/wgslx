import { SymbolRule } from './rules';
import { Token } from './token';
type FlexSymbol = string | SymbolRule | Token;
export declare function symbolEquals(left: FlexSymbol, right: FlexSymbol): boolean;
export declare function assertType(token: Token, symbol: FlexSymbol): void;
export declare function ofType(...symbols: FlexSymbol[]): (token: Token) => boolean;
export declare function childrenOfType(token: Token, symbols: FlexSymbol[]): Token[];
interface PreorderResponse {
    continue?: boolean;
    children?: null | Token | Token[];
    cleanupCallback?: PostorderCallback;
}
type PreorderCallback = (token: Token, ancestors: Token[], index: number) => PreorderResponse | undefined | void;
type PostorderCallback = (token: Token, ancestors: Token[], index: number) => void;
interface TraversalOptions {
    predicate?: (t: Token) => boolean;
    preorderCallback?: PreorderCallback;
    postorderCallback?: PostorderCallback;
}
export declare function traverse(token: Token | Token[], options: TraversalOptions): void;
export {};
