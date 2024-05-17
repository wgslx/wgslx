"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minify = void 0;
const syntax_1 = require("./syntax");
const traversal_1 = require("./traversal");
function minify(token) {
    (0, traversal_1.assertType)(token, syntax_1.translationUnit);
    (0, traversal_1.traverse)(token, {
        predicate: (0, traversal_1.ofType)(syntax_1.functionDecl, syntax_1.compoundStatement, syntax_1.ident),
        preorderCallback: (token) => {
        },
    });
}
exports.minify = minify;
