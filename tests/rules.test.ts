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
          return null;
        }
      }
      const rule = new CountRule();

      const cursor = {
        segment: 0,
        start: 0,
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
        start: 0,
      };

      const match = context.rule(cursor, rule);
      expect(match?.cursor).toEqual({
        segment: 0,
        start: 3,
      });
      expect(match?.token?.toObject()).toEqual({
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
      start: 0,
    };

    const match = context.rule(cursor, rule);
    expect(match?.cursor).toEqual({
      segment: 0,
      start: 5,
    });
    expect(match?.token?.toObject()).toEqual({
      text: 'fooba',
      source: '0:0:file',
    });
  });
});

describe('regex', () => {
  test('matches regex', () => {
    const context = Context.from('foobar', 'file');
    const rule = regex(/foo/);
    const cursor = {
      segment: 0,
      start: 0,
    };

    const match = context.rule(cursor, rule);
    expect(match?.cursor).toEqual({
      segment: 0,
      start: 3,
    });
    expect(match?.token?.toObject()).toEqual({
      text: 'foo',
      source: '0:0:file',
    });
  });

  test('matches longest regex', () => {
    const context = Context.from('foobar', 'file');
    const rule = regex(/foo/, /fooba/, /fo/, /bar/);
    const cursor = {
      segment: 0,
      start: 0,
    };

    const match = context.rule(cursor, rule);
    expect(match?.cursor).toEqual({
      segment: 0,
      start: 5,
    });
    expect(match?.token?.toObject()).toEqual({
      text: 'fooba',
      source: '0:0:file',
    });
  });
});

describe('sequence', () => {
  test('matches sequence', () => {
    const context = Context.from('quick brown fox jumps', 'file');
    const rule = sequence('quick', 'brown', 'fox');
    const cursor = {
      segment: 0,
      start: 0,
    };

    const match = context.rule(cursor, rule);
    expect(match?.cursor).toEqual({
      segment: 3,
      start: 0,
    });
    expect(match?.token?.toObject()).toEqual({
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
    });
  });

  test('fails sequence', () => {
    const context = Context.from('quick brown fox jumps', 'file');
    const rule = sequence('quick', 'brown', 'box');
    const cursor = {
      segment: 0,
      start: 0,
    };

    const match = context.rule(cursor, rule);
    expect(match).toBe(null);
  });
});

describe('maybe', () => {
  test('matches single positive', () => {
    const context = Context.from('quick brown fox jumps', 'file');
    const rule = maybe('quick');
    const cursor = {
      segment: 0,
      start: 0,
    };

    const match = context.rule(cursor, rule);
    expect(match?.cursor).toEqual({
      segment: 1,
      start: 0,
    });
    expect(match?.token?.toObject()).toEqual({
      // symbol: '?',
      text: 'quick',
      source: '0:0:file',
    });
  });

  test('matches multiple positive', () => {
    const context = Context.from('quick brown fox jumps', 'file');
    const rule = maybe('quick', 'brown');
    const cursor = {
      segment: 0,
      start: 0,
    };

    const match = context.rule(cursor, rule);
    expect(match?.cursor).toEqual({
      segment: 2,
      start: 0,
    });
    expect(match?.token?.toObject()).toEqual({
      // symbol: '?',
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
    });
  });

  test('matches negative', () => {
    const context = Context.from('quick brown fox jumps', 'file');
    const rule = maybe('slow');
    const cursor = {
      segment: 0,
      start: 0,
    };

    const match = context.rule(cursor, rule);
    expect(match?.cursor).toEqual({
      segment: 0,
      start: 0,
    });
    expect(match?.token).toBe(undefined);
  });
});
describe('star', () => {
  test('matches zero', () => {
    const context = Context.from('quick brown fox jumps', 'file');
    const rule = star('slow');
    const cursor = {
      segment: 0,
      start: 0,
    };

    const match = context.rule(cursor, rule);
    expect(match?.cursor).toEqual({
      segment: 0,
      start: 0,
    });
    expect(match?.token?.toObject()).toBe(undefined);
  });

  test('matches single positive', () => {
    const context = Context.from('quick brown fox jumps', 'file');
    const rule = star('quick');
    const cursor = {
      segment: 0,
      start: 0,
    };

    const match = context.rule(cursor, rule);
    expect(match?.cursor).toEqual({
      segment: 1,
      start: 0,
    });
    expect(match?.token?.toObject()).toEqual({
      // symbol: '*',
      children: [
        {
          text: 'quick',
          source: '0:0:file',
        },
      ],
    });
  });

  test('matches multiple positives', () => {
    const context = Context.from('quick quick quick jumps', 'file');
    const rule = star('quick');
    const cursor = {
      segment: 0,
      start: 0,
    };

    const match = context.rule(cursor, rule);
    expect(match?.cursor).toEqual({
      segment: 3,
      start: 0,
    });
    expect(match?.token?.toObject()).toEqual({
      // symbol: '*',
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
    });
  });
});

describe('union', () => {
  test('matches longest rule', () => {
    const context = Context.from('foobar', 'file');
    const rule = union('foo', /fooba/, 'fo', 'bar');
    const cursor = {
      segment: 0,
      start: 0,
    };

    const match = context.rule(cursor, rule);
    expect(match?.cursor).toEqual({
      segment: 0,
      start: 5,
    });
    expect(match?.token?.toObject()).toEqual({
      text: 'fooba',
      source: '0:0:file',
    });
  });
});
