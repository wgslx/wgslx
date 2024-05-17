export interface TokenObject {
    text?: string;

    symbol?: string;

    source?: string;

    children?: TokenObject[];
}

export class Token {
    id: number;

    text?: string;

    symbol?: string;

    source?: string;

    children?: Token[];

    maybe: boolean = false;

    hasSymbol(symbol: string) {
        return this.symbol && this.symbol.includes(symbol);
    }

    clone(): Token {
        const token = new Token();
        token.text = this.text;
        token.symbol = this.symbol;
        token.source = this.source;
        token.children = this.children; // shallow
        token.maybe = this.maybe;
        return token;
    }

    toObject(): TokenObject {
        const object: TokenObject = {};

        if (this.source) object.source = this.source;
        if (this.text) object.text = this.text;
        if (this.symbol) object.symbol = this.symbol;
        if (this.children) object.children = this.children.map(t => t.toObject());

        return object;
    }

    toString(compact = false) {
        if (this.children) {
            const text = this.children
                .map(m => m?.toString())
                .filter(t => t)
                .join(' ');

            if (compact) {
                return text.replace(
                    /([^\p{XID_Continue}] |[\p{XID_Continue}] (?![\p{XID_Continue}]))/gu,
                    (match: string) => match[0]);
            }

            return text;
        }

        return this.text;
    }

    static text(text: string, source: string): Token {
        const token = new Token();
        token.source = source;
        token.text = text;
        return token;
    }

    static group(children: Token[], symbol?: string): Token {
        // if (children.length === 1) {
        //     const token = children[0];
        //     if (symbol !== undefined) {
        //         Token.symbol(token, symbol);
        //     }
        //     return token;
        // }

        const token = new Token();
        token.children = children;
        if (symbol !== undefined) {
            token.symbol = symbol;
        }
        return token;
    }

    static symbol(token: Token, symbol: string): Token {
        if (token.symbol === undefined) {
            token.symbol = symbol;
            return token;
        }

        const parent = new Token();
        parent.children = [token];
        parent.symbol = symbol;
        return parent;
    }

    private static idCount = 0;

    private constructor() {
        this.id = ++Token.idCount;
    }
}


/** Context for rule token matching. */
export class Multimap<TKey, TValue> {
    readonly map = new Map<TKey, TValue[]>();

    /** Gets a match for a position and rule in the cache. */
    get(key: TKey): TValue[] {
        return this.map.get(key) ?? [];
    }

    /** Sets a match for a position and rule in the cache. */
    add(key: TKey, value: TValue) {
        let list = this.map.get(key);

        if (list) {
            list.push(value);
        } else {
            list = [value];
            this.map.set(key, list);
        }

        return list;
    }
}