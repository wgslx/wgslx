import {createStringTextMatcher} from '../src/patterns';
import {Cursor, Segment, Sequence} from '../src/sequence';

function segment(
  text: string,
  line: number,
  column: number,
  file: string
): Segment {
  return {text, line, column, file};
}

describe('sequence', () => {
  describe('from', () => {
    test('segments multiple lines', () => {
      const sequence = Sequence.from('a b c \n d e f', 'file');
      expect(sequence.segments).toEqual([
        segment('a', 0, 0, 'file'),
        segment('b', 0, 2, 'file'),
        segment('c', 0, 4, 'file'),
        segment('d', 1, 1, 'file'),
        segment('e', 1, 3, 'file'),
        segment('f', 1, 5, 'file'),
      ]);
    });

    test('segments multiple lines', () => {
      const sequence = Sequence.from('\n    a b c \n d e f', 'file');
      expect(sequence.segments).toEqual([
        segment('a', 1, 4, 'file'),
        segment('b', 1, 6, 'file'),
        segment('c', 1, 8, 'file'),
        segment('d', 2, 1, 'file'),
        segment('e', 2, 3, 'file'),
        segment('f', 2, 5, 'file'),
      ]);
    });
  });

  describe('match', () => {
    test('matches ending in same segment', () => {
      const sequence = Sequence.from('abrakadabra alakazam', 'file');
      const matcher = createStringTextMatcher('abra');
      const cursor: Cursor = {
        segment: 0,
        start: 0,
      };

      expect(sequence.match(cursor, matcher)).toEqual({
        text: 'abra',
        segment: 0,
        start: 0,
        end: 4,

        cursor: {
          segment: 0,
          start: 4,
        },
      });
    });

    test('matches ending in new segment', () => {
      const sequence = Sequence.from('abrakadabra alakazam', 'file');
      const matcher = createStringTextMatcher('kadabra');
      const cursor: Cursor = {
        segment: 0,
        start: 4,
      };

      expect(sequence.match(cursor, matcher)).toEqual({
        text: 'kadabra',
        segment: 0,
        start: 4,
        end: 11,

        cursor: {
          segment: 1,
          start: 0,
        },
      });
    });
  });
});
