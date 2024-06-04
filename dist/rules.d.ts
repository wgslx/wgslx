import { TextMatcher } from './patterns';
import { Cursor, Sequence } from './sequence';
import { Token } from './token';
export interface Match {
    token: Token;
    cursor: Cursor;
}
export interface Canary {
    rules: Rule[];
    cursor: Cursor;
}
export declare class MatchResult {
    match?: Match;
    canaries?: Canary[];
    clone(): MatchResult;
    static success(cursor: Cursor, token: Token): MatchResult;
    static successFrom(rule: Rule, match: Match, canaries?: Canary[]): MatchResult;
    static failure(cursor: Cursor, rule: Rule): MatchResult;
    static failureFrom(rule: Rule, canaries?: Canary[]): MatchResult;
}
export declare class Context {
    readonly sequence: Sequence;
    readonly cache: Map<string, Map<Rule, MatchResult>>;
    text(cursor: Cursor, textRule: LiteralRule | RegExpRule): MatchResult;
    rule(cursor: Cursor, rule: Rule): MatchResult;
    get(cursorKey: string, rule: Rule): MatchResult | undefined;
    set(cursorKey: string, rule: Rule, matchResult: MatchResult): void;
    constructor(sequence: Sequence);
    static from(text: string, file: string): Context;
    matchSource(rootRule: Rule): MatchResult;
    static matchSource(text: string, file: string, rootRule: Rule): MatchResult;
}
export declare abstract class Rule {
    symbol?: string;
    abstract match(cursor: Cursor, context: Context): MatchResult;
}
type FlexRule = string | RegExp | Rule;
export declare class LiteralRule extends Rule {
    readonly matcher: TextMatcher;
    readonly literals: string[];
    match(cursor: Cursor, context: Context): MatchResult;
    constructor(literals: string[]);
}
export declare function literal(...literals: string[]): Rule;
export declare class RegExpRule extends Rule {
    readonly matcher: TextMatcher;
    readonly patterns: RegExp[];
    match(cursor: Cursor, context: Context): MatchResult;
    constructor(patterns: RegExp[]);
}
export declare function regex(...patterns: RegExp[]): Rule;
export declare class SequenceRule extends Rule {
    readonly rules: Rule[];
    match(cursor: Cursor, context: Context): MatchResult;
    constructor(rules: Rule[]);
}
export declare function sequence(first: FlexRule, ...rest: FlexRule[]): Rule;
export declare class UnionRule extends Rule {
    readonly rules: Rule[];
    match(cursor: Cursor, context: Context): MatchResult;
    constructor(rules: Rule[]);
}
export declare function union(first: FlexRule, ...rest: FlexRule[]): Rule;
export declare class MaybeRule extends Rule {
    readonly rule: Rule;
    match(cursor: Cursor, context: Context): MatchResult;
    constructor(rule: Rule);
}
export declare function maybe(first: FlexRule, ...rest: FlexRule[]): Rule;
export declare class StarRule extends Rule {
    readonly rule: Rule;
    match(cursor: Cursor, context: Context): MatchResult;
    constructor(rule: Rule);
}
export declare function star(first: FlexRule, ...rest: FlexRule[]): Rule;
export declare class SymbolRule extends Rule {
    readonly symbol: string;
    private leftRecursiveRest?;
    private rule?;
    isLeftRecursive(): boolean;
    get(): Rule | null;
    set(rule: Rule): void;
    match(cursor: Cursor, context: Context): MatchResult;
    constructor(name: string);
    static symbolize(rule: Rule, symbol: string): void;
}
export declare function symbol(name: string): SymbolRule;
export declare function rule(name: string): SymbolRule;
export {};
