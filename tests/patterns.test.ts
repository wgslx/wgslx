import { matchBlockComment, matchIdentPatternToken } from '../src/patterns';

describe('patterns', () => {
    describe('match', () => {
        test('regex', () => {
            const regex = /foo/;

            regex.exec('foot')


        });


        test('matches at 0', () => {
            expect(matchIdentPatternToken('abc ')).toBe('abc');
        });

        test('matches at 2', () => {
            expect(matchIdentPatternToken('xyz abc ', 4)).toBe('abc');
        });
    });

    test('block comment matches', () => {
        const text = '/* a block comment */';
        expect(matchBlockComment(text)).toBe('/* a block comment */');
    });
});