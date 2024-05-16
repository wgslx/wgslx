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
    const names = symbolNames(symbols);
    return (token: Token): boolean => {
        if (token.symbols) {
            const symbols = token.symbols;
            return names.some(n => symbols.includes(n));
        }
        return false;
    };
}

export function childrenOfType(token: Token, symbols: FlexSymbol[]): Token[] {
    if (!token.children || symbols.length === 0) {
        return [];
    }

    return token.children.filter(ofType(...symbols));
}

interface PreorderResponse {
    /** Whether to continue */
    continue?: boolean,

    /** Override set of children to traverse. */
    children?: null | Token | Token[];

    /**
     * Cleanup callback to call after children have been traversed, but before
     * the afterCallback is called.
     */
    cleanupCallback?: PostorderCallback,
}
type PreorderCallback = (token: Token, ancestors: Token[], index: number) => PreorderResponse | undefined | void;
type PostorderCallback = (token: Token, ancestors: Token[], index: number) => void;
interface TraversalOptions {
    predicate?: (t: Token) => boolean;
    preorderCallback?: PreorderCallback;
    postorderCallback?: PostorderCallback;
}

function _traverse(tokens: Token[], ancestors: Token[], options: TraversalOptions) {
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const match = options.predicate?.(token) ?? true;
        let preorderResponse: PreorderResponse | undefined = undefined;

        if (match && options.preorderCallback) {
            const result = options.preorderCallback(token, ancestors, i);
            if (result) {
                if (result.continue === false) {
                    result.cleanupCallback?.(token, ancestors, i);
                    continue;
                }

                preorderResponse = result;
            }
        }

        if (preorderResponse?.children !== undefined) {
            if (preorderResponse.children !== null) {
                _traverse(
                    Array.isArray(preorderResponse.children)
                        ? preorderResponse.children
                        : [preorderResponse.children],
                    [...ancestors, token],
                    options);
            }
        } else if (token.children) {
            _traverse(token.children, [...ancestors, token], options);
        }

        if (preorderResponse?.cleanupCallback) {
            preorderResponse.cleanupCallback(token, ancestors, i);
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
