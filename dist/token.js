"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Multimap = exports.Token = void 0;
class Token {
    id;
    text;
    symbol;
    source;
    destination;
    children;
    maybe = false;
    hasSymbol(symbol) {
        return this.symbol && this.symbol.includes(symbol);
    }
    clone() {
        const token = new Token();
        token.text = this.text;
        token.symbol = this.symbol;
        token.source = this.source;
        token.destination = this.destination;
        token.children = this.children;
        token.maybe = this.maybe;
        return token;
    }
    toObject() {
        const object = {};
        if (this.source)
            object.source = this.source;
        if (this.destination)
            object.destination = this.destination;
        if (this.text)
            object.text = this.text;
        if (this.symbol)
            object.symbol = this.symbol;
        if (this.children)
            object.children = this.children.map((t) => t.toObject());
        return object;
    }
    toString(compact = false) {
        if (this.children) {
            const text = this.children
                .map((m) => m?.toString())
                .filter((t) => t)
                .join(' ');
            if (compact) {
                return text.replace(/([^\p{XID_Continue}] |[\p{XID_Continue}] (?![\p{XID_Continue}]))/gu, (match) => match[0]);
            }
            return text;
        }
        return this.text;
    }
    static text(text, source) {
        const token = new Token();
        token.source = source;
        token.text = text;
        return token;
    }
    static group(children, symbol) {
        const token = new Token();
        token.children = children;
        if (symbol !== undefined) {
            token.symbol = symbol;
        }
        return token;
    }
    static symbol(token, symbol) {
        if (token.symbol === undefined) {
            token.symbol = symbol;
            return token;
        }
        const parent = new Token();
        parent.children = [token];
        parent.symbol = symbol;
        return parent;
    }
    static idCount = 0;
    constructor() {
        this.id = ++Token.idCount;
    }
}
exports.Token = Token;
class Multimap {
    map = new Map();
    get(key) {
        return this.map.get(key) ?? [];
    }
    add(key, value) {
        let list = this.map.get(key);
        if (list) {
            list.push(value);
        }
        else {
            list = [value];
            this.map.set(key, list);
        }
        return list;
    }
}
exports.Multimap = Multimap;
