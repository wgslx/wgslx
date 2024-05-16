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

    toObject(): TokenObject {
        const object: TokenObject = {};

        if (this.source) object.source = this.source;
        if (this.text) object.text = this.text;
        if (this.symbols) object.symbols = [...this.symbols];
        if (this.children) object.children = this.children.map(t => t.toObject());

        return object;
    }

    toString() {
        if (this.children) {
            return this.children
                .map(m => m?.toString())
                .filter(t => t)
                .join(' ');
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
            if (symbol !== undefined) {
                Token.symbol(children[0], symbol);
            }
            return children[0];
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