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

export function assertType(token: Token, symbol: FlexSymbol) {
    if (!token.hasSymbol(symbolName(symbol))) {
        throw new Error('Type');
    }
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

type PreorderCallback = (token: Token, ancestors: Token[], index: number) => void | boolean | PostorderCallback;
type PostorderCallback = (token: Token, ancestors: Token[], index: number) => void;
interface TraversalOptions {
    predicate?: (t: Token) => boolean;
    preorderCallback?: PreorderCallback;
    postorderCallback?: PostorderCallback;
}

function _traverse(tokens: Token[], ancestors: Token[], options: TraversalOptions) {
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const match = options?.predicate(token) ?? true;
        let cleanupCallback: PostorderCallback | undefined = undefined;

        if (match && options.preorderCallback) {
            const result = options.preorderCallback(token, ancestors, i);
            if (typeof result === 'function') {
                cleanupCallback = result;
            }

            if (result === false) {
                continue;
            }
        }

        if (token.children) {
            _traverse(token.children, [...ancestors, token], options);
        }

        if (cleanupCallback) {
            cleanupCallback(token, ancestors, i);
        }

        if (match && options.postorderCallback) {
            options.postorderCallback(token, ancestors, i);
        }
    }
}

export function traverse(token: Token | Token[], options: TraversalOptions) {
    if (!options.preorderCallback && !options.postorderCallback) {
        throw new Error('At leat one callback must be provided.');
    }

    if (!Array.isArray(token)) {
        token = [token];
    }

    _traverse(token, [], options);
}
