import { Token } from './token';
export declare function postprocess(token: Token, compact?: boolean): string;
export declare function minify(token: Token): void;
export declare function generateSourceMap(token: Token, file?: string, sourceRoot?: string): string;
