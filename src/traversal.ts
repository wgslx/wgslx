import { SymbolRule } from "./rules";
import { Token } from "./token";

type FlexSymbol = string | SymbolRule

function symbolName(symbol: FlexSymbol): string {
    if (typeof symbol === 'string') {
        return symbol;
    }
    return symbol.symbol;
}

function symbolNames(symbols: FlexSymbol[]): string[] {
    return symbols.map(s => symbolName(s));
}

export function ofType(...symbols: FlexSymbol[]) {
    const name = symbolNames(symbols);
    return (token: Token) => token.symbols && name.some(n => token.symbols.includes(n));
}

export function childrenOfType(token: Token, symbols: FlexSymbol[]): Token[] {
    if (!token.children || symbols.length === 0) {
        return [];
    }

    const names = symbolNames(symbols);
    return token.children.filter(t => t.symbols && names.some(n => t.symbols.includes(n)));
}

type TraversalCallback = (token: Token, ancestors: Token[], index: number) => void;
interface TraversalOptions {
    predicate?: (t: Token) => boolean;
    beforeCallback?: TraversalCallback;
    afterCallback?: TraversalCallback;
}

function _traverse(tokens: Token[], ancestors: Token[], options: TraversalOptions) {
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const match = options?.predicate(token) ?? true;

        if (match) {
            options.beforeCallback?.(token, ancestors, i);
        }

        if (token.children) {
            _traverse(token.children, [...ancestors, token], options);
        }

        if (match) {
            options.afterCallback?.(token, ancestors, i);
        }
    }
}

export function traverse(token: Token, options: TraversalOptions) {
    _traverse([token], [], options);
}
