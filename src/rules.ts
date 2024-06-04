// Implementation of Recursive Descent Parsing as described in the WGSL spec.
import {inspect} from 'util';

import {
  TextMatcher,
  createRegExpTextMatcher,
  createStringTextMatcher,
} from './patterns';
import {
  Cursor,
  Sequence,
  compareCursor,
  cursorGreaterOrEqualThan,
  cursorGreaterThan,
} from './sequence';
import {Token} from './token';

export interface Match {
  token: Token;
  cursor: Cursor;
}

/** A canary of what should have matched. */
export interface Canary {
  /** The token that should have matched. */
  rules: Rule[];

  /** The cursor before the match. */
  cursor: Cursor;
}

export class MatchResult {
  /** The token that matched. */
  match?: Match;

  /** Canaries of what should have matched. */
  canaries?: Canary[];

  clone(): MatchResult {
    const result = new MatchResult();
    if (this.match) {
      result.match = {
        token: this.match.token.clone(),
        cursor: this.match.cursor,
      };
    }

    if (this.canaries) {
      result.canaries = this.canaries.map((c) => ({
        rules: [...c.rules],
        cursor: c.cursor,
      }));
    }

    return result;
  }

  static success(cursor: Cursor, token: Token): MatchResult {
    const result = new MatchResult();
    result.match = {token, cursor};
    return result;
  }

  static successFrom(
    rule: Rule,
    match: Match,
    canaries?: Canary[]
  ): MatchResult {
    const result = new MatchResult();
    result.match = match;
    if (canaries) {
      result.canaries = canaries
        .filter((c) => cursorGreaterOrEqualThan(c.cursor, match.cursor))
        .map((c) => ({
          rules: [...c.rules, rule],
          cursor: c.cursor,
        }));
    }
    return result;
  }

  static failure(cursor: Cursor, rule: Rule): MatchResult {
    const result = new MatchResult();
    result.canaries = [{rules: [rule], cursor}];
    return result;
  }

  static failureFrom(rule: Rule, canaries?: Canary[]): MatchResult {
    const result = new MatchResult();

    if (!canaries || canaries.length === 0) {
      throw new Error('Expected canaries');
    }

    result.canaries = canaries.map((c) => ({
      rules: [...c.rules, rule],
      cursor: c.cursor,
    }));

    return result;
  }
}

/** Context for rule token matching. */
export class Context {
  readonly sequence: Sequence;
  readonly cache = new Map<string, Map<Rule, MatchResult>>();

  text(cursor: Cursor, textRule: LiteralRule | RegExpRule): MatchResult {
    // TODO: Optionally cache results, though this is linear cost.
    const cursorKey = this.sequence.stringify(cursor);
    const textMatch = this.sequence.match(cursor, textRule.matcher);

    if (!textMatch) {
      return MatchResult.failure(cursor, textRule);
    }

    const match = MatchResult.success(
      textMatch.cursor,
      Token.text(textMatch.text, cursorKey)
    );

    return match;
  }

  rule(cursor: Cursor, rule: Rule): MatchResult {
    const cursorKey = this.sequence.stringify(cursor);
    const cached = this.get(cursorKey, rule);

    if (cached !== undefined) {
      return cached;
    }

    const match = rule.match(cursor, this);
    this.set(cursorKey, rule, match);
    return match;
  }

  /** Gets a match for a position and rule in the cache. */
  get(cursorKey: string, rule: Rule): MatchResult | undefined {
    const cursorMap = this.cache.get(cursorKey);

    if (!cursorMap) {
      return undefined;
    }

    const cached = cursorMap.get(rule);

    if (!cached) {
      return undefined;
    }

    return cached.clone();
  }

  /** Sets a match for a position and rule in the cache. */
  set(cursorKey: string, rule: Rule, matchResult: MatchResult) {
    let cursorMap = this.cache.get(cursorKey);

    if (!cursorMap) {
      cursorMap = new Map<Rule, MatchResult>();
      this.cache.set(cursorKey, cursorMap);
    }

    cursorMap.set(rule, matchResult.clone());
  }

  constructor(sequence: Sequence) {
    this.sequence = sequence;
  }

  static from(text: string, file: string): Context {
    return new Context(Sequence.from(text, file));
  }

  matchSource(rootRule: Rule): MatchResult {
    const cursor = Cursor(0);

    const matchResult = rootRule.match(cursor, this);

    if (matchResult.canaries) {
      // Sort canaries by descending cursor position.
      matchResult.canaries.sort((a, b) => -compareCursor(a.cursor, b.cursor));
    }

    if (!matchResult.match) {
      return matchResult;
    }

    //console.log(inspect(matchResult, {depth: 10}));
    const {match} = matchResult;
    if (match.cursor.segment < this.sequence.segments.length) {
      return MatchResult.failure(cursor, rootRule);
    }

    return matchResult;
  }

  static matchSource(text: string, file: string, rootRule: Rule): MatchResult {
    const context = Context.from(text, file);
    return context.matchSource(rootRule);
  }
}

export abstract class Rule {
  /** The symbol this rule is a part of. */
  symbol?: string;

  /** Match this cursor against a context. */
  abstract match(cursor: Cursor, context: Context): MatchResult;
}

type FlexRule = string | RegExp | Rule;

function rulifyOne(rule: FlexRule): Rule {
  if (typeof rule === 'string') {
    return literal(rule);
  }

  if (rule instanceof RegExp) {
    return regex(rule);
  }

  return rule;
}

function rulifyAll(rules: FlexRule[]): Rule[] {
  return rules.map((r) => rulifyOne(r));
}

export class LiteralRule extends Rule {
  readonly matcher: TextMatcher;
  readonly literals: string[];

  match(cursor: Cursor, context: Context): MatchResult {
    return context.text(cursor, this);
  }

  constructor(literals: string[]) {
    super();

    this.matcher = createStringTextMatcher(...literals);
    this.literals = literals;
  }
}

export function literal(...literals: string[]): Rule {
  return new LiteralRule(literals);
}

export class RegExpRule extends Rule {
  readonly matcher: TextMatcher;
  readonly patterns: RegExp[];

  match(cursor: Cursor, context: Context): MatchResult {
    return context.text(cursor, this);
  }

  constructor(patterns: RegExp[]) {
    super();

    this.matcher = createRegExpTextMatcher(...patterns);
    this.patterns = patterns;
  }
}

export function regex(...patterns: RegExp[]): Rule {
  return new RegExpRule(patterns);
}

export class SequenceRule extends Rule {
  readonly rules: Rule[];

  match(cursor: Cursor, context: Context): MatchResult {
    const tokens: Token[] = [];
    for (const rule of this.rules) {
      const matchResult = context.rule(cursor, rule);
      if (!matchResult.match) {
        if (!matchResult.canaries) {
          throw new Error('Expected match or canaries');
        }

        return MatchResult.failureFrom(this, matchResult.canaries);
      }
      tokens.push(matchResult.match.token);
      cursor = matchResult.match.cursor;
    }

    const token = Token.group(tokens, '()');
    return MatchResult.success(cursor, token);
  }

  constructor(rules: Rule[]) {
    super();

    this.rules = rules;
  }
}

export function sequence(first: FlexRule, ...rest: FlexRule[]): Rule {
  const rules = rulifyAll([first, ...rest]);

  if (rules.length === 0) {
    throw new Error();
  }

  if (rules.length === 1) {
    return rules[0];
  }

  return new SequenceRule(rules);
}

export class UnionRule extends Rule {
  readonly rules: Rule[];

  match(cursor: Cursor, context: Context): MatchResult {
    let longestMatch: Match | undefined = undefined;

    let combinedCanaries: Canary[] = [];

    for (const rule of this.rules) {
      const matchResult = context.rule(cursor, rule);
      if (!matchResult.match) {
        if (!matchResult.canaries) {
          throw new Error('Expected match or canaries');
        }
        combinedCanaries.push(...matchResult.canaries);
        continue;
      }

      const {match, canaries} = matchResult;

      if (canaries) {
        combinedCanaries.push(...canaries);
      }

      if (!longestMatch) {
        longestMatch = match;
        continue;
      }

      if (cursorGreaterThan(match.cursor, longestMatch.cursor)) {
        longestMatch = match;
        continue;
      }
    }

    if (!longestMatch) {
      return MatchResult.failureFrom(this, combinedCanaries);
    }

    return MatchResult.successFrom(this, longestMatch, combinedCanaries);
  }

  constructor(rules: Rule[]) {
    super();

    this.rules = rules;

    if (this.rules.length === 0) {
      throw new Error('Expected at least one rule in a union.');
    }
  }
}

export function union(first: FlexRule, ...rest: FlexRule[]): Rule {
  const rules = rulifyAll([first, ...rest]);

  if (rules.length === 1) {
    return rules[0];
  }

  // const literals: LiteralRule[] = [];
  // const regexps: RegExpRule[] = [];
  // const others: RuleExec[] = [];

  return new UnionRule(rules);
}

export class MaybeRule extends Rule {
  readonly rule: Rule;

  match(cursor: Cursor, context: Context): MatchResult {
    const matchResult = context.rule(cursor, this.rule);
    const token = matchResult.match ? [matchResult.match.token] : [];

    const match: Match = {
      token: Token.group(token, '?'),
      cursor: matchResult.match ? matchResult.match.cursor : cursor,
    };

    return MatchResult.successFrom(this, match, matchResult.canaries);
  }

  constructor(rule: Rule) {
    super();

    this.rule = rule;
  }
}

export function maybe(first: FlexRule, ...rest: FlexRule[]): Rule {
  const rule = sequence(first, ...rest);
  return new MaybeRule(rule);
}

export class StarRule extends Rule {
  readonly rule: Rule;

  match(cursor: Cursor, context: Context): MatchResult {
    const tokens: Token[] = [];
    let matchResult = context.rule(cursor, this.rule);

    while (matchResult.match) {
      tokens.push(matchResult.match.token);
      cursor = matchResult.match.cursor;
      matchResult = context.rule(cursor, this.rule);
    }

    const result = {
      token: Token.group(tokens, '*'),
      cursor,
    };

    //console.log(matchResult.canaries);
    return MatchResult.successFrom(this, result, matchResult.canaries);
  }

  constructor(rule: Rule) {
    super();

    this.rule = rule;
  }
}

export function star(first: FlexRule, ...rest: FlexRule[]): Rule {
  const rule = sequence(first, ...rest);
  return new StarRule(rule);
}

export class SymbolRule extends Rule {
  readonly symbol: string;
  private leftRecursiveRest?: Rule;
  private rule?: Rule;

  isLeftRecursive() {
    return !!this.leftRecursiveRest;
  }

  get(): Rule | null {
    return this.rule ?? null;
  }

  set(rule: Rule) {
    if (this.rule) {
      throw new Error(`Duplicate initialization of rule ${this.rule}`);
    }

    SymbolRule.symbolize(rule, this.symbol);

    // Look for left recursion.
    if (rule instanceof UnionRule) {
      const recursive: Rule[] = [];
      const nonrecursive: Rule[] = [];

      for (const or of rule.rules) {
        if (or instanceof SequenceRule && or.rules[0] === this) {
          // Left recursion detected, remove the recursive element.
          const [_, second, ...rest] = or.rules;
          recursive.push(sequence(second, ...rest));
          continue;
        }
        nonrecursive.push(or);
      }

      if (recursive.length !== 0) {
        const [f1, ...r1] = recursive;
        this.leftRecursiveRest = union(f1, ...r1);
        const [f2, ...r2] = nonrecursive;
        rule = union(f2, ...r2);
      }
    }

    this.rule = rule;
  }

  match(cursor: Cursor, context: Context): MatchResult {
    if (!this.rule) {
      throw new Error(`Uninitialized rule ${this.symbol}`);
    }

    let matchResult = context.rule(cursor, this.rule);
    if (!matchResult.match) {
      return MatchResult.failureFrom(this, matchResult.canaries);
    }

    let match = matchResult.match;

    match.token = Token.symbol(match.token, this.symbol);

    if (this.leftRecursiveRest) {
      matchResult = context.rule(match.cursor, this.leftRecursiveRest);
      while (matchResult.match) {
        let restMatch = matchResult.match;
        // Left recursion found.
        if (!restMatch.token.children && !restMatch.token.text) {
          throw new Error('Successful left-recursion must emit tokens');
        }

        match = {
          token: restMatch.token.children
            ? Token.group(
                [match.token, ...restMatch.token.children],
                'left-recursion',
                this.symbol
              )
            : Token.group(
                [match.token, restMatch.token],
                'left-recursion',
                this.symbol
              ),
          cursor: restMatch.cursor,
        };

        matchResult = context.rule(match.cursor, this.leftRecursiveRest);
      }
    }

    return MatchResult.successFrom(this, match, matchResult.canaries);
  }

  constructor(name: string) {
    super();

    this.symbol = name;
  }

  static symbolize(rule: Rule, symbol: string) {
    if (rule instanceof SymbolRule) {
      return;
    }

    rule.symbol = symbol;

    if (rule instanceof StarRule || rule instanceof MaybeRule) {
      SymbolRule.symbolize(rule.rule, symbol);
    }

    if (rule instanceof SequenceRule || rule instanceof UnionRule) {
      for (const subrule of rule.rules) {
        SymbolRule.symbolize(subrule, symbol);
      }
    }
  }
}

const registry = new Map<string, SymbolRule>();
export function symbol(name: string): SymbolRule {
  const rule = new SymbolRule(name);

  if (registry.has(name)) {
    throw new Error(`Duplicate named rule ${rule}`);
  }

  return rule;
}

export function rule(name: string): SymbolRule {
  const rule = registry.get(name);

  if (!rule) {
    throw new Error(`Duplicate named rule ${rule}`);
  }

  return rule;
}
