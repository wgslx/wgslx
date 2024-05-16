export interface TokenObject {
    text?: string;

    symbols?: string[];

    source?: string;

    children?: TokenObject[];
}

export class Token {
    text?: string;

    symbols?: string[];

    source?: string;

    children?: Token[];

    maybe: boolean = false;

    hasSymbol(symbol: string) {
        return this.symbols && this.symbols.includes(symbol);
    }

    clone(): Token {
        const token = new Token();
        token.text = this.text;
        token.symbols = this.symbols;
        token.source = this.source;
        token.children = this.children; // shallow
        token.maybe = this.maybe;
        return token;
    }

    toObject(): TokenObject {
        const object: TokenObject = {};

        if (this.source) object.source = this.source;
        if (this.text) object.text = this.text;
        if (this.symbols) object.symbols = [...this.symbols];
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
        if (children.length === 1) {
            const token = children[0];
            if (symbol !== undefined) {
                Token.symbol(token, symbol);
            }
            return token;
        }

        const token = new Token();
        token.children = children;
        if (symbol !== undefined) {
            token.symbols = [symbol];
        }
        return token;
    }

    static symbol(token: Token, symbol: string): Token {
        if (token.symbols === undefined) {
            token.symbols = [symbol];
        } else {
            token.symbols.push(symbol);
        }
        return token;
    }
}