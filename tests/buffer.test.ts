import { Buffer } from '../src/buffer';

describe('buffer', () => {
    test('empty string should result in zero', () => {
        const sequence = Buffer.from('a b c \r\n d e f', 'file');
        console.log(sequence);
        expect(sequence.sequences.length).toBe(6);
        expect(sequence.sequences[0]).toEqual({
            text: 'a',
            line: 0,
            column: 0,
            file: 'file'
        });
        expect(sequence.sequences[1]).toEqual({
            text: 'b',
            line: 0,
            column: 2,
            file: 'file'
        });
        expect(sequence.sequences[2]).toEqual({
            text: 'd',
            line: 1,
            column: 4,
            file: 'file'
        });
        expect(sequence.sequences[3]).toEqual({
            text: 'e',
            line: 1,
            column: 1,
            file: 'file'
        });
        expect(sequence.sequences[4]).toEqual({
            text: 'f',
            line: 1,
            column: 3,
            file: 'file'
        });
        expect(sequence.sequences[5]).toEqual({
            text: 'c',
            line: 0,
            column: 5,
            file: 'file'
        });
    });
});