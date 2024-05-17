
import { compoundStatement, functionDecl, functionHeader, globalValueDecl, globalVariableDecl, ident, optionallyTypedIdent, translationUnit, variableDecl, variableOrValueStatement } from "./syntax";
import { Token } from "./token";
import { assertType, ofType, traverse } from "./traversal";


// mark scopes.

// attribute identifiers.

// minify identifiers.


/**
 * Two declarations in the same WGSL source program must not simultaneously:
 *  - introduce the same identifier name, and
 *  - have the same end-of-scope.
 * @param token 
 */
export function minify(token: Token) {
    assertType(token, translationUnit);
    traverse(token, {
        predicate: ofType(
            // Scope changing.
            functionDecl,
            compoundStatement,

            // Identifier
            ident,
        ),
        preorderCallback: (token: Token) => {

        },
    });
    // mark scopes

    // global
    // function decl
    // compound_statement

    // for



}