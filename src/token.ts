/** Json representation of the token. */
export interface TokenJson {
  text?: string;

  symbol?: string;

  modifier?: string;

  source?: string;

  destination?: string;

  children?: TokenJson[];
}

export interface TokenRange {
  file: string;
  line: number;
  column: number;
}

export class TokenOptions {
  symbol?: string;
  modifier?: string;
}

export class Token {
  /** Execution unique identifier. */
  id: number;

  text?: string;

  symbol?: string;

  /** The method of grouping */
  modifier?: string;

  source?: string;

  destination?: string;

  children?: Token[];

  clone(): Token {
    const token = new Token();
    if (this.text) token.text = this.text;
    if (this.symbol) token.symbol = this.symbol;
    if (this.modifier) token.modifier = this.modifier;
    if (this.source) token.source = this.source;
    if (this.destination) token.destination = this.destination;
    if (this.children) token.children = this.children; // shallow copy
    return token;
  }

  toObject(): TokenJson {
    const object: TokenJson = {};

    if (this.source) object.source = this.source;
    if (this.destination) object.destination = this.destination;
    if (this.text) object.text = this.text;
    if (this.symbol) object.symbol = this.symbol;
    if (this.modifier) object.modifier = this.modifier;
    if (this.children) object.children = this.children.map((t) => t.toObject());

    return object;
  }

  toString(compact = false) {
    if (this.children) {
      const text = this.children
        .map((m) => m?.toString())
        .filter((t) => t)
        .join(' ');

      if (compact) {
        return text.replace(
          /([^\p{XID_Continue}] |[\p{XID_Continue}] (?![\p{XID_Continue}]))/gu,
          (match: string) => match[0]
        );
      }

      return text;
    }

    return this.text;
  }

  static text(text: string, source: string): Token {
    const token = new Token();
    token.source = source;
    token.text = text;
    return token;
  }

  static group(children: Token[], modifier: string, symbol?: string): Token {
    const token = new Token();
    token.children = children;
    token.modifier = modifier;
    if (symbol) {
      token.symbol = symbol;
    }
    return token;
  }

  static symbol(token: Token, symbol: string): Token {
    if (token.symbol === undefined) {
      token.symbol = symbol;
      return token;
    }

    const parent = new Token();
    parent.children = [token];
    if (symbol) parent.symbol = symbol;
    return parent;
  }

  private static idCount = 0;

  private constructor() {
    this.id = ++Token.idCount;
  }
}

/** Context for rule token matching. */
export class Multimap<TKey, TValue> {
  readonly map = new Map<TKey, TValue[]>();

  /** Gets a match for a position and rule in the cache. */
  get(key: TKey): TValue[] {
    return this.map.get(key) ?? [];
  }

  /** Sets a match for a position and rule in the cache. */
  add(key: TKey, value: TValue) {
    let list = this.map.get(key);

    if (list) {
      list.push(value);
    } else {
      list = [value];
      this.map.set(key, list);
    }

    return list;
  }
}
