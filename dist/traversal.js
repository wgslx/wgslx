"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverse = exports.childrenOfType = exports.ofType = exports.assertType = void 0;
function symbolName(symbol) {
    if (typeof symbol === 'string') {
        return symbol;
    }
    return symbol.symbol;
}
function symbolNames(symbols) {
    return symbols.map((s) => symbolName(s));
}
function assertType(token, symbol) {
    if (!token.hasSymbol(symbolName(symbol))) {
        throw new Error('Type');
    }
}
exports.assertType = assertType;
function ofType(...symbols) {
    const names = symbolNames(symbols);
    return (token) => {
        if (token.symbol) {
            const symbols = token.symbol;
            return names.some((n) => symbols.includes(n));
        }
        return false;
    };
}
exports.ofType = ofType;
function childrenOfType(token, symbols) {
    if (!token.children || symbols.length === 0) {
        return [];
    }
    return token.children.filter(ofType(...symbols));
}
exports.childrenOfType = childrenOfType;
function _traverse(tokens, ancestors, options) {
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const match = options.predicate?.(token) ?? true;
        let preorderResponse = undefined;
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
                _traverse(Array.isArray(preorderResponse.children)
                    ? preorderResponse.children
                    : [preorderResponse.children], [...ancestors, token], options);
            }
        }
        else if (token.children) {
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
function traverse(token, options) {
    if (!options.preorderCallback && !options.postorderCallback) {
        throw new Error('At leat one callback must be provided.');
    }
    if (!Array.isArray(token)) {
        token = [token];
    }
    _traverse(token, [], options);
}
exports.traverse = traverse;
