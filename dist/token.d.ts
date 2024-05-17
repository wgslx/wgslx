export interface TokenObject {
    text?: string;
    symbol?: string;
    source?: string;
    children?: TokenObject[];
}
export declare class Token {
    id: number;
    text?: string;
    symbol?: string;
    source?: string;
    children?: Token[];
    maybe: boolean;
    hasSymbol(symbol: string): boolean | "" | undefined;
    clone(): Token;
    toObject(): TokenObject;
    toString(compact?: boolean): any;
    static text(text: string, source: string): Token;
    static group(children: Token[], symbol?: string): Token;
    static symbol(token: Token, symbol: string): Token;
    private static idCount;
    private constructor();
}
export declare class Multimap<TKey, TValue> {
    readonly map: Map<TKey, TValue[]>;
    get(key: TKey): TValue[];
    add(key: TKey, value: TValue): TValue[];
}
