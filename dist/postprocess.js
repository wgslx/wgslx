"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSourceMap = exports.minify = exports.postprocess = void 0;
const syntax_1 = require("./syntax");
const traversal_1 = require("./traversal");
const source_map_1 = require("source-map");
const util_1 = require("./util");
function postprocess(token) {
    let text = token.toString();
    text = text.replaceAll(util_1.TEMPLATE_START, '<').replaceAll(util_1.TEMPLATE_END, '>');
    return text;
}
exports.postprocess = postprocess;
function minify(token) {
    (0, traversal_1.assertType)(token, syntax_1.translationUnit);
    (0, traversal_1.traverse)(token, {
        predicate: (0, traversal_1.ofType)(syntax_1.functionDecl, syntax_1.compoundStatement, syntax_1.ident),
        preorderCallback: (token) => { },
    });
}
exports.minify = minify;
function generateSourceMap(token, file, sourceRoot) {
    const generator = new source_map_1.SourceMapGenerator({ file, sourceRoot });
    (0, traversal_1.traverse)(token, {
        preorderCallback(token, ancestors, index) {
            if (!token.source || !token.destination)
                return;
            const source = token.source.split(':');
            const destination = token.destination.split(':');
            const file = source[2];
            const original = {
                line: parseInt(source[0]),
                column: parseInt(source[1]),
            };
            const generated = {
                line: parseInt(destination[0]),
                column: parseInt(destination[1]),
            };
            generator.addMapping({
                source: file,
                original,
                generated,
            });
        },
    });
    return generator.toString();
}
exports.generateSourceMap = generateSourceMap;
