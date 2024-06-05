import {
  Context,
  Rule,
  symbol,
  literal,
  regex,
  union,
  sequence,
  maybe,
  star,
  MatchResult,
} from '../src/rules';
import {Cursor} from '../src/sequence';

describe('rules', () => {
  describe('Context', () => {
    test('caches', () => {
      const context = Context.from('foobar', 'file');
      let times = 0;

      class CountRule extends Rule {
        match(cursor: Cursor, context: Context) {
          times++;
          return MatchResult.failure(cursor, this);
        }
      }
      const rule = new CountRule();

      const cursor = {
        segment: 0,
        offset: 0,
      };

      context.rule(cursor, rule);
      context.rule(cursor, rule);

      expect(times).toBe(1);
    });
  });

  describe('literal', () => {
    test('matches literal', () => {
      const context = Context.from('foobar', 'file');
      const rule = literal('foo');
      const cursor = {
        segment: 0,
        offset: 0,
      };

      const {match, canaries} = context.rule(cursor, rule);
      expect(match).toBeTruthy();
      expect(match?.cursor).toEqual({
        segment: 0,
        offset: 3,
      });
      expect(match?.token.toObject()).toEqual({
        text: 'foo',
        source: '0:0:file',
      });
    });
  });

  test('matches longest literal', () => {
    const context = Context.from('foobar', 'file');
    const rule = literal('foo', 'fooba', 'fo', 'bar');
    const cursor = {
      segment: 0,
      offset: 0,
    };

    const {match, canaries} = context.rule(cursor, rule);
    expect(match).toBeTruthy();
    expect(match?.cursor).toEqual({
      segment: 0,
      offset: 5,
    });
    expect(match?.token.toObject()).toEqual({
      text: 'fooba',
      source: '0:0:file',
    });
  });

  test('fails to match a literal', () => {
    const context = Context.from('foobar', 'file');
    const rule = literal('baz', 'qux');
    const cursor = {
      segment: 0,
      offset: 0,
    };

    const {match, canaries} = context.rule(cursor, rule);
    expect(match).toBeFalsy();
    expect(canaries).toBeTruthy();
    expect(canaries).toEqual([
      {
        cursor,
        rules: [rule],
      },
    ]);
  });
});

describe('regex', () => {
  test('matches regex', () => {
    const context = Context.from('foobar', 'file');
    const rule = regex(/foo/);
    const cursor = {
      segment: 0,
      offset: 0,
    };

    const {match, canaries} = context.rule(cursor, rule);
    expect(match).toBeTruthy();
    expect(match?.cursor).toEqual({
      segment: 0,
      offset: 3,
    });
    expect(match?.token.toObject()).toEqual({
      text: 'foo',
      source: '0:0:file',
    });
  });

  test('matches longest regex', () => {
    const context = Context.from('foobar', 'file');
    const rule = regex(/foo/, /fooba/, /fo/, /bar/);
    const cursor = {
      segment: 0,
      offset: 0,
    };

    const {match, canaries} = context.rule(cursor, rule);
    expect(match).toBeTruthy();
    expect(match?.cursor).toEqual({
      segment: 0,
      offset: 5,
    });
    expect(match?.token.toObject()).toEqual({
      text: 'fooba',
      source: '0:0:file',
    });
  });

  test('fails to match a regex', () => {
    const context = Context.from('foobar', 'file');
    const rule = regex(/baz/, /qux/);
    const cursor = {
      segment: 0,
      offset: 0,
    };

    const {match, canaries} = context.rule(cursor, rule);
    expect(match).toBeFalsy();
    expect(canaries).toBeTruthy();
    expect(canaries).toEqual([
      {
        cursor,
        rules: [rule],
      },
    ]);
  });
});

describe('sequence', () => {
  test('matches sequence', () => {
    const context = Context.from('quick brown fox jumps', 'file');
    const rule = sequence('quick', 'brown', 'fox');
    const cursor = {
      segment: 0,
      offset: 0,
    };

    const {match, canaries} = context.rule(cursor, rule);
    expect(match).toBeTruthy();
    expect(match?.cursor).toEqual({
      segment: 3,
      offset: 0,
    });
    expect(match?.token.toObject()).toEqual({
      children: [
        {
          text: 'quick',
          source: '0:0:file',
        },
        {
          text: 'brown',
          source: '0:6:file',
        },
        {
          text: 'fox',
          source: '0:12:file',
        },
      ],
      modifier: 'S',
    });
  });

  test('fails sequence', () => {
    const context = Context.from('quick brown fox jumps', 'file');
    const rules = [literal('quick'), literal('brown'), literal('box')];
    const rule = sequence(rules[0], ...rules.slice(1));
    const cursor = {
      segment: 0,
      offset: 0,
    };

    const {match, canaries} = context.rule(cursor, rule);
    expect(match).toBeFalsy();
    expect(canaries).toBeTruthy();
    expect(canaries).toEqual([
      {
        cursor: {
          segment: 2,
          offset: 0,
        },
        rules: [rules[2], rule],
      },
    ]);
  });
});

describe('maybe', () => {
  test('matches single positive', () => {
    const context = Context.from('quick brown fox jumps', 'file');
    const rule = maybe('quick');
    const cursor = {
      segment: 0,
      offset: 0,
    };

    const {match, canaries} = context.rule(cursor, rule);
    expect(match).toBeTruthy();
    expect(match?.cursor).toEqual({
      segment: 1,
      offset: 0,
    });
    expect(match?.token.toObject()).toEqual({
      children: [
        {
          text: 'quick',
          source: '0:0:file',
        },
      ],
      modifier: '?',
    });
  });

  test('matches multiple positive', () => {
    const context = Context.from('quick brown fox jumps', 'file');
    const rule = maybe('quick', 'brown');
    const cursor = {
      segment: 0,
      offset: 0,
    };

    const {match, canaries} = context.rule(cursor, rule);
    expect(match).toBeTruthy();
    expect(match?.cursor).toEqual({
      segment: 2,
      offset: 0,
    });
    expect(match?.token.toObject()).toEqual({
      children: [
        {
          children: [
            {
              text: 'quick',
              source: '0:0:file',
            },
            {
              text: 'brown',
              source: '0:6:file',
            },
          ],
          modifier: 'S',
        },
      ],
      modifier: '?',
    });
  });

  test('matches negative', () => {
    const context = Context.from('quick brown fox jumps', 'file');
    const rule = maybe('slow');
    const cursor = {
      segment: 0,
      offset: 0,
    };

    const {match, canaries} = context.rule(cursor, rule);
    expect(match?.cursor).toEqual({
      segment: 0,
      offset: 0,
    });
    expect(match?.token.toObject()).toEqual({
      children: [],
      modifier: '?',
    });
  });
});

describe('star', () => {
  test('matches zero', () => {
    const context = Context.from('quick brown fox jumps', 'file');
    const rule = star('slow');
    const cursor = {
      segment: 0,
      offset: 0,
    };

    const {match, canaries} = context.rule(cursor, rule);
    expect(match?.cursor).toEqual({
      segment: 0,
      offset: 0,
    });
    expect(match?.token.toObject()).toEqual({
      children: [],
      modifier: '*',
    });
  });

  test('matches single positive', () => {
    const context = Context.from('quick brown fox jumps', 'file');
    const rule = star('quick');
    const cursor = {
      segment: 0,
      offset: 0,
    };

    const {match, canaries} = context.rule(cursor, rule);
    expect(match?.cursor).toEqual({
      segment: 1,
      offset: 0,
    });
    expect(match?.token.toObject()).toEqual({
      children: [
        {
          text: 'quick',
          source: '0:0:file',
        },
      ],
      modifier: '*',
    });
  });

  test('matches multiple positives', () => {
    const context = Context.from('quick quick quick jumps', 'file');
    const rule = star('quick');
    const cursor = {
      segment: 0,
      offset: 0,
    };

    const {match, canaries} = context.rule(cursor, rule);
    expect(match?.cursor).toEqual({
      segment: 3,
      offset: 0,
    });
    expect(match?.token.toObject()).toEqual({
      children: [
        {
          text: 'quick',
          source: '0:0:file',
        },
        {
          text: 'quick',
          source: '0:6:file',
        },
        {
          text: 'quick',
          source: '0:12:file',
        },
      ],
      modifier: '*',
    });
  });

  test('creates canary for first unmatched', () => {
    const context = Context.from('a a a a b', 'file');
    const lit = literal('a');
    const rule = star(lit);
    const cursor = {
      segment: 0,
      offset: 0,
    };

    const {match, canaries} = context.rule(cursor, rule);
    expect(match?.cursor).toEqual({
      segment: 4,
      offset: 0,
    });
    expect(match?.token.toObject()).toEqual({
      children: [
        {
          text: 'a',
          source: '0:0:file',
        },
        {
          text: 'a',
          source: '0:2:file',
        },
        {
          text: 'a',
          source: '0:4:file',
        },
        {
          text: 'a',
          source: '0:6:file',
        },
      ],
      modifier: '*',
    });
    expect(canaries).toBeTruthy();
    expect(canaries).toEqual([
      {
        cursor: {
          segment: 4,
          offset: 0,
        },
        rules: [lit, rule],
      },
    ]);
  });
});

describe('union', () => {
  test('matches longest rule', () => {
    const context = Context.from('foobar', 'file');
    const rule = union('foo', /fooba/, 'fo', 'bar');
    const cursor = {
      segment: 0,
      offset: 0,
    };

    const {match, canaries} = context.rule(cursor, rule);
    expect(match?.cursor).toEqual({
      segment: 0,
      offset: 5,
    });
    expect(match?.token.toObject()).toEqual({
      children: [
        {
          text: 'fooba',
          source: '0:0:file',
        },
      ],
      modifier: 'U',
    });
  });

  test('fails to match a rule', () => {
    const context = Context.from('foobar', 'file');
    const rules = [literal('baz'), literal('qux')];
    const rule = union(rules[0], ...rules.slice(1));
    const cursor = {
      segment: 0,
      offset: 0,
    };

    const {match, canaries} = context.rule(cursor, rule);
    expect(match).toBeFalsy();
    expect(canaries).toBeTruthy();
    expect(canaries).toEqual([
      {
        cursor,
        rules: [rules[0], rule],
      },
      {
        cursor,
        rules: [rules[1], rule],
      },
    ]);
  });

  test('passes through canaries', () => {
    const context = Context.from('a a a b', 'file');
    const litA = literal('a');
    const litB = literal('b');
    const sequenceRule = sequence(litA, litA, litB);
    const starRule = star(litA);
    const unionRule = union(sequenceRule, starRule);

    const cursor = {
      segment: 0,
      offset: 0,
    };

    const {match, canaries} = context.rule(cursor, unionRule);
    expect(match?.cursor).toEqual({
      segment: 3,
      offset: 0,
    });
    expect(canaries).toBeTruthy();
    expect(canaries).toEqual([
      {
        cursor: {
          segment: 3,
          offset: 0,
        },
        rules: [litA, starRule, unionRule],
      },
    ]);
  });

  describe('symbol', () => {
    test('matches symbol', () => {
      const context = Context.from('barfoo', 'file');
      const rule = symbol('foo');
      rule.set(literal('bar'));
      const cursor = {
        segment: 0,
        offset: 0,
      };

      const {match, canaries} = context.rule(cursor, rule);
      expect(match).toBeTruthy();
      expect(match?.cursor).toEqual({
        segment: 0,
        offset: 3,
      });
      expect(match?.token.toObject()).toEqual({
        text: 'bar',
        symbol: 'foo',
        source: '0:0:file',
      });
    });

    test('fails to match a symbol', () => {
      const context = Context.from('foobar', 'file');
      const rule = symbol('foo');
      const lit = literal('baz');
      const starRule = star(lit);
      rule.set(lit);
      const cursor = {
        segment: 0,
        offset: 0,
      };

      const {match, canaries} = context.rule(cursor, rule);
      expect(match).toBeFalsy();
      expect(canaries).toBeTruthy();
      expect(canaries).toEqual([
        {
          cursor,
          rules: [lit, rule],
        },
      ]);
    });

    test('passes through canaries', () => {
      const context = Context.from('bar bar bar foo', 'file');
      const rule = symbol('rule');
      const lit = literal('bar');
      const starRule = star(lit);
      rule.set(starRule);
      const cursor = {
        segment: 0,
        offset: 0,
      };

      const {match, canaries} = context.rule(cursor, rule);
      expect(match).toBeTruthy();
      expect(match?.cursor).toEqual({
        segment: 3,
        offset: 0,
      });
      expect(match?.token.toObject()).toEqual({
        children: [
          {
            text: 'bar',
            source: '0:0:file',
          },
          {
            text: 'bar',
            source: '0:4:file',
          },
          {
            text: 'bar',
            source: '0:8:file',
          },
        ],
        modifier: '*',
        symbol: 'rule',
      });
      expect(canaries).toBeTruthy();
      expect(canaries).toEqual([
        {
          cursor: {
            segment: 3,
            offset: 0,
          },
          rules: [lit, starRule, rule],
        },
      ]);
    });

    test('left-recursion succeeds and passes canaries', () => {
      const context = Context.from('a a a b b', 'file');
      const rule = symbol('rule');
      const litA = literal('a');
      const litB = literal('b');
      const sequenceRule = sequence(rule, litB);
      rule.set(union(litA, sequenceRule));
      expect(rule.isLeftRecursive()).toBeTruthy();

      // 'a' | rule 'b'

      const cursor = {
        segment: 0,
        offset: 0,
      };

      const {match, canaries} = context.rule(cursor, rule);
      expect(match?.cursor).toEqual({
        segment: 4,
        offset: 0,
      });
      expect(match?.token.toObject()).toEqual({
        children: [
          {
            text: 'a',
            source: '0:0:file',
          },
          {
            text: 'a',
            source: '0:2:file',
          },
          {
            text: 'a',
            source: '0:4:file',
          },
          {
            text: 'b',
            source: '0:6:file',
          },
        ],
        modifier: 'L',
        symbol: 'rule',
      });
      expect(canaries).toBeTruthy();
      expect(canaries).toEqual([]);
    });

    test('left-recursion succeeds and passes canaries', () => {
      const context = Context.from('a a c', 'file');
      const rule = symbol('rule');
      const litA = literal('a');
      const litB = literal('b');
      const sequenceRule = sequence(rule, litB);
      rule.set(union(litA, sequenceRule));
      expect(rule.isLeftRecursive()).toBeTruthy();

      // 'a' | rule 'b'

      const cursor = {
        segment: 0,
        offset: 0,
      };

      const {match, canaries} = context.rule(cursor, rule);
      expect(match?.cursor).toEqual({
        segment: 1,
        offset: 0,
      });
      expect(match?.token.toObject()).toEqual({
        text: 'a',
        symbol: 'rule',
        source: '0:0:file',
      });
      expect(canaries).toBeTruthy();
      expect(canaries).toEqual([
        {
          cursor: {
            segment: 2,
            offset: 0,
          },
          rules: [litB, rule],
        },
        {
          cursor: {
            segment: 1,
            offset: 0,
          },
          rules: [litB, rule],
        },
      ]);
    });
  });
});
