import {
  createRegExpTextMatcher,
  createStringTextMatcher,
  matchBlockComment,
  matchIdentPatternToken,
} from '../src/patterns';

describe('patterns', () => {
  describe('createRegExpTextMatcher', () => {
    test('matches RegExp', () => {
      const matcher = createRegExpTextMatcher(/foo/);
      expect(matcher('football')).toEqual('foo');
    });

    test('matches longest RegExp', () => {
      const matcher = createRegExpTextMatcher(/foo/, /foot/);
      expect(matcher('football')).toEqual('foot');
    });

    test('matches RegExp at offset', () => {
      const matcher = createRegExpTextMatcher(/foo/);
      expect(matcher('play football', 5)).toEqual('foo');
    });

    test('matches longest RegExp at offset', () => {
      const matcher = createRegExpTextMatcher(/foo/, /foot/);
      expect(matcher('play football', 5)).toEqual('foot');
    });
  });

  describe('createStringTextMatcher', () => {
    test('matches RegExp', () => {
      const matcher = createStringTextMatcher('foo');
      expect(matcher('football')).toEqual('foo');
    });

    test('matches longest RegExp', () => {
      const matcher = createStringTextMatcher('foo', 'foot');
      expect(matcher('football')).toEqual('foot');
    });

    test('matches RegExp at offset', () => {
      const matcher = createStringTextMatcher('foo');
      expect(matcher('play football', 5)).toEqual('foo');
    });

    test('matches longest RegExp at offset', () => {
      const matcher = createStringTextMatcher('foo', 'foot');
      expect(matcher('play football', 5)).toEqual('foot');
    });
  });

  describe('matchIdentPatternToken', () => {
    test('matches token', () => {
      expect(matchIdentPatternToken('abc ')).toBe('abc');
    });

    test('matches token at offset', () => {
      expect(matchIdentPatternToken('xyz abc ', 4)).toBe('abc');
    });
  });

  describe('matchBlockComment', () => {
    test('matches block comment', () => {
      const text = '/* a block comment */';
      expect(matchBlockComment(text)).toBe('/* a block comment */');
    });

    test('matches block comment at offset', () => {
      const text = 'not/* a block comment */';
      expect(matchBlockComment(text, 3)).toBe('/* a block comment */');
    });

    test('matches multiline block comment', () => {
      const text = '/* a multiline\r\nblock comment */';
      expect(matchBlockComment(text)).toBe(
        '/* a multiline\r\nblock comment */'
      );
    });

    test('matches nested block comment', () => {
      const text = '/* a /* nested block */ comment */';
      expect(matchBlockComment(text)).toBe(
        '/* a /* nested block */ comment */'
      );
    });
  });
});
