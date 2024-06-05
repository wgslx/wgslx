import { Token } from './token';
export interface ImportResolver {
    resolveFilePath(baseFilePath: string, importStatementPath: string): string;
    readSource(filePath: string): string;
}
export interface WgslxOptions {
    sourceMap: boolean;
    mode: 'auto' | 'wgsl' | 'wgslx';
    importResolver?: ImportResolver;
    whitespace?: 'none' | 'tokens';
}
export declare const DEFAULT_WGSLX_OPTIONS: Readonly<WgslxOptions>;
export declare function getImportPath(importStatementToken: Token): string;
export declare function compileWgslx(source: string, filePath: string, options?: Partial<WgslxOptions>): string;
