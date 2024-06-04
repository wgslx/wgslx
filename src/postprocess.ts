import {
  compoundStatement,
  functionDecl,
  functionHeader,
  globalValueDecl,
  globalVariableDecl,
  ident,
  optionallyTypedIdent,
  translationUnit,
  variableDecl,
  variableOrValueStatement,
} from './syntax';
import {Token} from './token';
import {assertType, ofType, traverse} from './traversal';
import {SourceMapGenerator} from 'source-map';
import {TEMPLATE_END, TEMPLATE_START} from './util';

export function postprocess(token: Token, compact?: boolean): string {
  let text = token.toString(compact);

  // Remove placeholder template strings.
  text = text.replaceAll(TEMPLATE_START, '<').replaceAll(TEMPLATE_END, '>');

  return text;
}

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
      ident
    ),
    preorderCallback: (token: Token) => {},
  });
  // mark scopes

  // global
  // function decl
  // compound_statement

  // for
}

export function generateSourceMap(
  token: Token,
  file?: string,
  sourceRoot?: string
): string {
  const generator = new SourceMapGenerator({file, sourceRoot});

  traverse(token, {
    preorderCallback(token, ancestors, index) {
      if (!token.source || !token.destination) return;

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
        // name: token.constructor.name,
      });
    },
  });

  return generator.toString();
}
