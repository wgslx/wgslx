import {postprocess} from './postprocess';
import {preprocess} from './preprocess';
import {Context, SymbolRule} from './rules';
import {
  globalDecl,
  globalDirectiveExtended,
  globalDirectiveImport,
  importDirective,
  translationUnit,
  translationUnitExtended,
  translationUnitImport,
} from './syntax';
import {Token} from './token';
import {childrenOfType, symbolEquals} from './traversal';

import {inspect} from 'util';

export interface ImportResolver {
  resolveFilePath(baseFilePath: string, importStatementPath: string): string;

  readSource(filePath: string): string;
}

export interface WgslxOptions {
  // Whether to generate a source map.
  sourceMap: boolean;

  mode: 'wgsl' | 'wgslx';

  /** Resolver for imports */
  importResolver?: ImportResolver;

  whitespace?: 'none' | 'tokens';
}

export const DEFAULT_WGSLX_OPTIONS = Object.freeze<WgslxOptions>({
  sourceMap: false,
  mode: 'wgslx',
  whitespace: 'tokens',
});

function tokenizeFile(
  source: string,
  filePath: string,
  rootSymbol: SymbolRule
): Token {
  source = preprocess(source);
  const context = Context.from(source, filePath);
  const matchResult = context.matchSource(rootSymbol);

  if (!matchResult.match) {
    // Convert to a more readable error message.
    if (!matchResult.canaries) {
      throw new Error(`Failed to parse ${filePath} for unknown reasons.`);
    }

    const lines = source.split('\n');
    const errors: string[] = [];
    errors.push(`Failed to parse ${filePath}\n`);

    for (let i = 0; i < matchResult.canaries.length; i++) {
      const canary = matchResult.canaries[i];

      const sourceCursor = context.sequence.toSourceCursor(canary.cursor);
      const lineText = `${sourceCursor.line}: `;
      // Create an ascii indicator for the error.
      errors.push(
        `#${i + 1}: ${filePath}:${sourceCursor.line}:${sourceCursor.column}`
      );
      errors.push(`    ${lineText}${lines[sourceCursor.line - 1]}`);
      errors.push(
        `    ${'-'.repeat(lineText.length + sourceCursor.column - 1)}^`
      );

      for (let j = 0; j < canary.rules.length; j++) {
        const rule = canary.rules[j];
        errors.push(`    @: ${rule.symbol}`);
      }
    }

    throw new Error(errors.join('\n'));
  }

  return matchResult.match.token;
}

class ImportContext {
  resolved: Set<string> = new Set();
  importResolver: ImportResolver;

  constructor(importResolver: ImportResolver, baseFilePath: string) {
    this.importResolver = importResolver;
    this.resolved.add(baseFilePath);
  }

  import(currentFilePath: string, importStatementPath: string): Token | null {
    const importFilePath = this.importResolver.resolveFilePath(
      currentFilePath,
      importStatementPath
    );

    if (this.resolved.has(importFilePath)) {
      return null;
    }
    this.resolved.add(importFilePath);

    const importSource = this.importResolver.readSource(importFilePath);
    const token = tokenizeFile(
      importSource,
      importFilePath,
      translationUnitImport
    );

    if (!token) {
      throw new Error('Failed to parse');
    }

    const directives: Token[] = [];
    const declarations: Token[] = [];

    for (let i = 0; i < token.children!.length; i++) {
      if (!symbolEquals(token.children![i], globalDirectiveImport)) {
        declarations.push(token.children![i]);
        continue;
      }

      const directive = token.children![i];
      for (let j = 0; j < directive.children!.length; j++) {
        const importStatement = directive.children![j];
        if (symbolEquals(importStatement, importDirective)) {
          const importPath = importStatement.children![1].text!;
          const importToken = this.import(importFilePath, importPath);

          if (importToken) {
            declarations.push(...importToken.children!);
          }
        }
      }
    }

    token.children = [...declarations];
    return token;
  }
}

export function compileWgslx(
  source: string,
  filePath: string,
  options?: Partial<WgslxOptions>
): string {
  const opts = {...DEFAULT_WGSLX_OPTIONS, ...options};

  if (opts.mode === 'wgsl') {
    const token = tokenizeFile(source, filePath, translationUnit);
    return postprocess(token, opts.whitespace === 'none');
  }

  // wgslx
  const rootToken = tokenizeFile(source, filePath, translationUnitExtended);

  // resolve imports
  const globalDirectives = childrenOfType(rootToken, [globalDirectiveExtended]);
  const nonImportGlobalDirectives: Token[] = [];
  const globalDeclarations = childrenOfType(rootToken, [globalDecl]);
  for (const directive of globalDirectives) {
    if (!directive.children) {
      nonImportGlobalDirectives.push(directive);
      continue;
    }

    for (let i = 0; i < directive.children.length; i++) {
      const importStatement = directive.children[i];
      if (!symbolEquals(importStatement, importDirective)) {
        nonImportGlobalDirectives.push(importStatement);
        continue;
      }

      if (!opts.importResolver) {
        throw new Error('Import resolver is required');
      }

      const importContext = new ImportContext(opts.importResolver, filePath);
      // Move all declarations to the top level.

      if (!importStatement.children || importStatement.children.length < 2) {
        throw new Error('Expected children');
      }

      const importLiteral = importStatement.children[1].text!.substring(
        1,
        importStatement.children[1].text!.length - 1
      );

      const importRoot = importContext.import(filePath, importLiteral);
      if (!importRoot) {
        throw new Error('Failed to import');
      }
      const importDeclarations = childrenOfType(importRoot, [globalDecl]);
      nonImportGlobalDirectives.unshift(...importDeclarations);
    }
  }

  //console.log(inspect(rootToken, {depth: 10}));
  //console.log(nonImportGlobalDirectives, globalDeclarations);
  //return rootToken.toString();
  rootToken.children = [...nonImportGlobalDirectives, ...globalDeclarations];

  return postprocess(rootToken, opts.whitespace === 'none');
}
