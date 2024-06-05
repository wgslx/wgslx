"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverse = exports.childrenOfType = exports.ofType = exports.assertType = exports.isType = void 0;
const token_1 = require("./token");
function symbolName(symbol) {
    if (typeof symbol === 'string') {
        return symbol;
    }
    if (symbol instanceof token_1.Token) {
        return symbol.symbol ?? '';
    }
    return symbol.symbol;
}
function symbolNames(symbols) {
    return symbols.map((s) => symbolName(s));
}
function isType(token, symbol) {
    const name = symbolName(symbol);
    while (token.symbol === undefined && token.children?.length === 1) {
        token = token.children[0];
    }
    if (token.symbol === name) {
        return token;
    }
    return null;
}
exports.isType = isType;
function assertType(token, symbol) {
    if (token.symbol !== symbolName(symbol)) {
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
    const predicate = ofType(...symbols);
    return token.children.flatMap((child) => {
        if (child.symbol) {
            return predicate(child) ? [child] : [];
        }
        else {
            return childrenOfType(child, symbols);
        }
    });
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
