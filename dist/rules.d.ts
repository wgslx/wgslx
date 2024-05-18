import { TextMatcher } from "./patterns";
import { Cursor, Sequence } from "./sequence";
import { Token } from "./token";
export interface RuleMatch {
    token?: Token;
    cursor: Cursor;
}
export declare function ruleMatch(cursor: Cursor, token?: Token | RuleMatch[], symbol?: string): RuleMatch;
export declare abstract class Rule {
    symbol?: string;
    abstract match(cursor: Cursor, context: Context): RuleMatch | null;
    matchAll(text: string, file: string): Token | null;
}
export declare class Context {
    readonly sequence: Sequence;
    readonly cache: Map<string, Map<Rule, RuleMatch | null>>;
    text(cursor: Cursor, matcher: TextMatcher): RuleMatch | null;
    rule(cursor: Cursor, rule: Rule): RuleMatch | null;
    get(cursorKey: string, rule: Rule): RuleMatch | null | undefined;
    set(cursorKey: string, rule: Rule, match: RuleMatch | null): void;
    constructor(sequence: Sequence);
    static from(text: string, file: string): Context;
}
type FlexRule = string | RegExp | Rule;
export declare class LiteralRule extends Rule {
    readonly matcher: TextMatcher;
    readonly literals: string[];
    match(cursor: Cursor, context: Context): RuleMatch | null;
    constructor(literals: string[]);
}
export declare function literal(...literals: string[]): Rule;
export declare class RegExpRule extends Rule {
    readonly matcher: TextMatcher;
    readonly patterns: RegExp[];
    match(cursor: Cursor, context: Context): RuleMatch | null;
    constructor(patterns: RegExp[]);
}
export declare function regex(...patterns: RegExp[]): Rule;
export declare class SequenceRule extends Rule {
    readonly rules: Rule[];
    match(cursor: Cursor, context: Context): RuleMatch | null;
    constructor(rules: Rule[]);
}
export declare function sequence(first: FlexRule, ...rest: FlexRule[]): Rule;
export declare class UnionRule extends Rule {
    readonly rules: Rule[];
    match(cursor: Cursor, context: Context): RuleMatch | null;
    constructor(rules: Rule[]);
}
export declare function union(first: FlexRule, ...rest: FlexRule[]): Rule;
export declare class MaybeRule extends Rule {
    readonly rule: Rule;
    match(cursor: Cursor, context: Context): RuleMatch | null;
    constructor(rule: Rule);
}
export declare function maybe(first: FlexRule, ...rest: FlexRule[]): Rule;
export declare class StarRule extends Rule {
    readonly rule: Rule;
    match(cursor: Cursor, context: Context): RuleMatch | null;
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
    match(cursor: Cursor, context: Context): RuleMatch | null;
    constructor(name: string);
    static symbolize(rule: Rule, symbol: string): void;
}
export declare function symbol(name: string): SymbolRule;
export declare function rule(name: string): SymbolRule;
export {};
