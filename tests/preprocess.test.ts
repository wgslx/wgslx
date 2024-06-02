import {discoverTemplates, preprocess, stripComments} from '../src/preprocess';

describe('preprocess', () => {
  describe('preprocess', () => {
    test('does not discover templates', () => {
      expect(preprocess('const a = 1;')).toEqual('const a = 1;');
    });

    test('preprocesses simple template', () => {
      expect(preprocess('vec4<i32>')).toEqual('vec4❬i32❭');
    });

    test('preprocesses nested template', () => {
      expect(preprocess('array<vec4<i32>>')).toEqual('array❬vec4❬i32❭❭');
    });
  });

  describe('stripComments', () => {
    test('strips single line comments', () => {
      expect(stripComments('const a = 1; // comment')).toEqual('const a = 1; ');
    });

    test('strips single-line block comments', () => {
      const text = 'const a = /* comment */ 1;';
      const expt = 'const a =               1;';
      expect(stripComments(text)).toEqual(expt);
    });

    test('strips single-line block comments with line ending comment', () => {
      const text = 'const a = /* comment */ 2;// additional comment';
      const expt = 'const a =               2;';
      expect(stripComments(text)).toEqual(expt);
    });

    test('strips multi-line block comments', () => {
      const text = [
        'const a = 3; /* comment',
        '  comment',
        '  comment */',
        'const b = 2;',
      ].join('\n');

      expect(stripComments(text)).toEqual('const a = 3; \n\n\nconst b = 2;');
    });

    test('strips multi-line block nested comments', () => {
      const text = [
        'const a = 4; /* comment',
        '  /* nested */ ',
        '  comment */',
        'const b = 2;',
      ].join('\n');

      expect(stripComments(text)).toEqual('const a = 4; \n\n\nconst b = 2;');
    });
  });

  describe('discoverTemplates', () => {
    test('does not discover templates', () => {
      expect(discoverTemplates('const a = 1;')).toEqual([]);
    });

    test('discovers simple template', () => {
      expect(discoverTemplates('vec4<i32>')).toEqual([
        {
          startPosition: 4,
          endPosition: 8,
        },
      ]);
    });

    test('discovers nested template', () => {
      // Order doesn't matter here.
      expect(discoverTemplates('array<vec4<i32>>')).toEqual([
        {
          startPosition: 10,
          endPosition: 14,
        },
        {
          startPosition: 5,
          endPosition: 15,
        },
      ]);
    });
  });
});
