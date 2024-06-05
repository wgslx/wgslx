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
  canaries: Canary[] = [];

  clone(): MatchResult {
    const result = new MatchResult();
    if (this.match) {
      result.match = {
        token: this.match.token.clone(),
        cursor: this.match.cursor,
      };
    }

    result.canaries = this.canaries.map((c) => ({
      rules: [...c.rules],
      cursor: c.cursor,
    }));

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
    canaries: Canary[]
  ): MatchResult {
    const result = new MatchResult();
    result.match = match;
    result.canaries = this.augmentCanaries(rule, canaries, match.cursor);
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
      throw new Error('Expected canaries'); //@@
    }

    result.canaries = this.augmentCanaries(rule, canaries);

    return result;
  }

  static augmentCanaries(
    rule: Rule,
    canaries: Canary[],
    cursor?: Cursor
  ): Canary[] {
    if (cursor) {
      canaries = canaries.filter((c) =>
        cursorGreaterOrEqualThan(c.cursor, cursor)
      );
    }

    if (canaries.length === 0) {
      return [];
    }

    canaries.sort((a, b) => -compareCursor(a.cursor, b.cursor));

    let culledCanaries: Canary[] = [];
    let canary = {
      rules: [...canaries[0].rules, rule],
      cursor: canaries[0].cursor,
    };
    for (let i = 1; i < canaries.length; i++) {
      if (compareCursor(canaries[i].cursor, canary.cursor) === 0) {
        if (canaries[i].rules.length < canary.rules.length) {
          canary = {
            rules: [...canaries[i].rules, rule],
            cursor: canaries[i].cursor,
          };
        }
      } else {
        culledCanaries.push(canary);
        if (culledCanaries.length >= 5) {
          return culledCanaries;
        }
      }
    }

    return [canary];
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
      matchResult.canaries.sort((a, b) => -compareCursor(a.cursor, b.cursor)); //@@
    }

    if (!matchResult.match) {
      return matchResult; //@@
    }

    // If the match did not consume the entire sequence, it is a failure.
    if (matchResult.match.cursor.segment < this.sequence.segments.length) {
      matchResult.match = undefined;
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
    const canaries: Canary[] = [];
    for (const rule of this.rules) {
      const matchResult = context.rule(cursor, rule);
      canaries.push(...matchResult.canaries);

      if (!matchResult.match) {
        return MatchResult.failureFrom(this, canaries);
      }

      tokens.push(matchResult.match.token);
      cursor = matchResult.match.cursor;
    }

    const token = Token.group(tokens, 'S');
    return MatchResult.successFrom(
      this,
      {
        cursor,
        token,
      },
      canaries
    );
  }

  constructor(rules: Rule[]) {
    super();

    this.rules = rules;
  }
}

export function sequence(first: FlexRule, ...rest: FlexRule[]): Rule {
  const rules = rulifyAll([first, ...rest]);

  if (rules.length === 0) {
    throw new Error(); //@@
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
      combinedCanaries.push(...matchResult.canaries);

      if (!matchResult.match) {
        continue;
      }

      if (!longestMatch) {
        longestMatch = matchResult.match;
        continue;
      }

      if (cursorGreaterThan(matchResult.match.cursor, longestMatch.cursor)) {
        longestMatch = matchResult.match;
        continue;
      }
    }

    if (!longestMatch) {
      return MatchResult.failureFrom(this, combinedCanaries);
    }
    longestMatch.token = Token.group([longestMatch.token], 'U');
    return MatchResult.successFrom(this, longestMatch, combinedCanaries);
  }

  constructor(rules: Rule[]) {
    super();

    this.rules = rules;

    if (this.rules.length === 0) {
      throw new Error('Expected at least one rule in a union.'); //@@
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
  readonly modifiedSymbol?: string;

  match(cursor: Cursor, context: Context): MatchResult {
    const matchResult = context.rule(cursor, this.rule);
    const token = matchResult.match ? [matchResult.match.token] : [];

    const match: Match = {
      token: Token.modify(token, '?', this.modifiedSymbol),
      cursor: matchResult.match ? matchResult.match.cursor : cursor,
    };

    return MatchResult.successFrom(this, match, matchResult.canaries);
  }

  constructor(rule: Rule) {
    super();

    this.rule = rule;

    if (rule instanceof SymbolRule) {
      this.modifiedSymbol = rule.symbol;
    }
  }
}

export function maybe(first: FlexRule, ...rest: FlexRule[]): Rule {
  const rule = sequence(first, ...rest);
  return new MaybeRule(rule);
}

export class StarRule extends Rule {
  readonly rule: Rule;
  readonly modifiedSymbol?: string;

  match(cursor: Cursor, context: Context): MatchResult {
    const tokens: Token[] = [];
    let matchResult = context.rule(cursor, this.rule);
    const canaries: Canary[] = [];

    while (matchResult.match) {
      tokens.push(matchResult.match.token);
      cursor = matchResult.match.cursor;
      matchResult = context.rule(cursor, this.rule);
    }

    const result = {
      token: Token.modify(tokens, '*', this.modifiedSymbol),
      cursor,
    };

    return MatchResult.successFrom(this, result, matchResult.canaries);
  }

  constructor(rule: Rule) {
    super();

    this.rule = rule;

    if (rule instanceof SymbolRule) {
      this.modifiedSymbol = rule.symbol;
    }
  }
}

export function star(first: FlexRule, ...rest: FlexRule[]): Rule {
  const rule = sequence(first, ...rest);
  return new StarRule(rule);
}

export class SymbolRule extends Rule {
  readonly symbol: string;
  private leftRecursiveTail?: Rule;
  private rule?: Rule;

  isLeftRecursive() {
    return !!this.leftRecursiveTail; //@@
  }

  get(): Rule | null {
    return this.rule ?? null;
  }

  set(rule: Rule) {
    if (this.rule) {
      throw new Error(`Duplicate initialization of rule ${this.rule}`); //@@
    }

    //SymbolRule.symbolize(rule, this.symbol);

    // Look for left recursion.
    if (rule instanceof UnionRule) {
      const tail: Rule[] = [];
      const body: Rule[] = [];

      for (const or of rule.rules) {
        if (or instanceof SequenceRule && or.rules[0] === this) {
          // Left recursion detected, remove the recursive element.
          const [_, second, ...rest] = or.rules;
          tail.push(sequence(second, ...rest));
          continue;
        }
        body.push(or);
      }

      if (tail.length !== 0) {
        const [tail1, ...tailRest] = tail;
        this.leftRecursiveTail = union(tail1, ...tailRest);
        const [body1, ...bodyRest] = body;
        rule = union(body1, ...bodyRest);
      }
    }

    this.rule = rule;
  }

  match(cursor: Cursor, context: Context): MatchResult {
    const bodyRule = this.rule;
    if (!bodyRule) {
      throw new Error(`Uninitialized rule ${this.symbol}`);
    }

    // Match the body once.
    let initialMatchResult = context.rule(cursor, bodyRule);
    if (!initialMatchResult.match) {
      return MatchResult.failureFrom(this, initialMatchResult.canaries);
    }

    if (!this.leftRecursiveTail) {
      initialMatchResult.match.token = Token.symbol(
        initialMatchResult.match.token,
        this.symbol
      );
      return MatchResult.successFrom(
        this,
        initialMatchResult.match,
        initialMatchResult.canaries
      );
    }

    console.log('entering left-recursion', this);

    // If left recursive, we keep matching the body as long as a tail matches after.
    // TODO: We can optimize by working backwards by matching as many body instances first.
    const tailRule = this.leftRecursiveTail;
    const recursiveBodyMatchResults: MatchResult[] = [initialMatchResult];

    // Try to match the body rule as many times as possible.
    let matchResult = context.rule(initialMatchResult.match.cursor, bodyRule);
    while (matchResult.match) {
      recursiveBodyMatchResults.push(matchResult);
      matchResult = context.rule(matchResult.match.cursor, bodyRule);
    }

    // Try to match the tail once.
    let tailCanaries: Canary[] = [];
    for (let i = recursiveBodyMatchResults.length - 1; i >= 0; i--) {
      const bodyMatchResult = recursiveBodyMatchResults[i];
      // Assert the match is not empty due to the loop condition above.
      const tailMatchResult = context.rule(
        bodyMatchResult.match!.cursor,
        tailRule
      );
      if (tailMatchResult.match) {
        // We have matched the longest tail recursion, collect and return.
        const tokens = recursiveBodyMatchResults
          .slice(0, i + 1)
          .map((r) => r.match!.token);
        tokens.push(tailMatchResult.match.token);
        return MatchResult.successFrom(
          this,
          {
            token: Token.group(tokens, 'L', this.symbol),
            cursor: tailMatchResult.match.cursor,
          },
          // Canaries are combined from the last body match and the tail.
          [
            ...recursiveBodyMatchResults[i].canaries,
            ...tailMatchResult.canaries,
          ]
        );
      }
      // Collect the canaries of the tail.
      tailCanaries.push(...tailMatchResult.canaries);
    }

    //console.log('no recursive match', this);

    // If we never matched the tail, we simply return the initial match.
    initialMatchResult.match.token = Token.symbol(
      initialMatchResult.match.token,
      this.symbol
    );

    // Canaries are combined from the initial match and the tail.
    return MatchResult.successFrom(this, initialMatchResult.match, [
      ...initialMatchResult.canaries,
      ...tailCanaries,
    ]);
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
    throw new Error(`Duplicate named rule ${rule}`); //@@
  }

  return rule;
}

export function rule(name: string): SymbolRule {
  const rule = registry.get(name);

  if (!rule) {
    throw new Error(`Duplicate named rule ${rule}`); //@@
  }

  return rule;
}
