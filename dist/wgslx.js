"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileWgslx = exports.DEFAULT_WGSLX_OPTIONS = void 0;
const postprocess_1 = require("./postprocess");
const preprocess_1 = require("./preprocess");
const syntax_1 = require("./syntax");
const traversal_1 = require("./traversal");
exports.DEFAULT_WGSLX_OPTIONS = Object.freeze({
    sourceMap: false,
    mode: 'wgslx',
    whitespace: 'tokens',
});
function tokenizeFile(source, filePath, rootSymbol) {
    source = (0, preprocess_1.preprocess)(source);
    const token = rootSymbol.matchAll(source, filePath);
    if (!token) {
        throw new Error('Failed to parse');
    }
    return token;
}
class ImportContext {
    resolved = new Set();
    importResolver;
    constructor(importResolver, baseFilePath) {
        this.importResolver = importResolver;
        this.resolved.add(baseFilePath);
    }
    import(currentFilePath, importStatementPath) {
        const importFilePath = this.importResolver.resolveFilePath(currentFilePath, importStatementPath);
        if (this.resolved.has(importFilePath)) {
            return null;
        }
        this.resolved.add(importFilePath);
        const importSource = this.importResolver.readSource(importFilePath);
        const token = tokenizeFile(importSource, importFilePath, syntax_1.translationUnitImport);
        if (!token) {
            throw new Error('Failed to parse');
        }
        const directives = [];
        const declarations = [];
        for (let i = 0; i < token.children.length; i++) {
            if (!(0, traversal_1.symbolEquals)(token.children[i], syntax_1.globalDirectiveImport)) {
                declarations.push(token.children[i]);
                continue;
            }
            const directive = token.children[i];
            for (let j = 0; j < directive.children.length; j++) {
                const importStatement = directive.children[j];
                if ((0, traversal_1.symbolEquals)(importStatement, syntax_1.importDirective)) {
                    const importPath = importStatement.children[1].text;
                    const importToken = this.import(importFilePath, importPath);
                    if (importToken) {
                        declarations.push(...importToken.children);
                    }
                }
            }
        }
        token.children = [...declarations];
        return token;
    }
}
function compileWgslx(source, filePath, options) {
    const opts = { ...exports.DEFAULT_WGSLX_OPTIONS, ...options };
    if (opts.mode === 'wgsl') {
        const token = tokenizeFile(source, filePath, syntax_1.translationUnit);
        return (0, postprocess_1.postprocess)(token, opts.whitespace === 'none');
    }
    const rootToken = tokenizeFile(source, filePath, syntax_1.translationUnitExtended);
    const globalDirectives = (0, traversal_1.childrenOfType)(rootToken, [syntax_1.globalDirectiveExtended]);
    const nonImportGlobalDirectives = [];
    const globalDeclarations = (0, traversal_1.childrenOfType)(rootToken, [syntax_1.globalDecl]);
    for (const directive of globalDirectives) {
        if (!directive.children) {
            nonImportGlobalDirectives.push(directive);
            continue;
        }
        for (let i = 0; i < directive.children.length; i++) {
            const importStatement = directive.children[i];
            if (!(0, traversal_1.symbolEquals)(importStatement, syntax_1.importDirective)) {
                nonImportGlobalDirectives.push(importStatement);
                continue;
            }
            if (!opts.importResolver) {
                throw new Error('Import resolver is required');
            }
            const importContext = new ImportContext(opts.importResolver, filePath);
            if (!importStatement.children || importStatement.children.length < 2) {
                throw new Error('Expected children');
            }
            const importLiteral = importStatement.children[1].text.substring(1, importStatement.children[1].text.length - 1);
            const importRoot = importContext.import(filePath, importLiteral);
            if (!importRoot) {
                throw new Error('Failed to import');
            }
            const importDeclarations = (0, traversal_1.childrenOfType)(importRoot, [syntax_1.globalDecl]);
            nonImportGlobalDirectives.unshift(...importDeclarations);
        }
    }
    rootToken.children = [...nonImportGlobalDirectives, ...globalDeclarations];
    return (0, postprocess_1.postprocess)(rootToken, opts.whitespace === 'none');
}
exports.compileWgslx = compileWgslx;
