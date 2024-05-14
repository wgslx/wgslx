import { Context } from '../src/rules';
import { Cursor } from '../src/sequence';
import { expression, statement, variableDecl, structDecl, functionDecl } from '../src/syntax';

describe('syntax', () => {
    describe('expression', () => {
        test('segments multiple lines', () => {
            const context = Context.from('a[4] + b.xyz', 'file');
            const cursor = Cursor(0);

            const match = expression.match(cursor, context);
            expect(match).toEqual({})
        });
    });

    describe('statement', () => {
        test('segments multiple lines', () => {
            const context = Context.from('a = b++', 'file');
            const cursor = Cursor(0);

            const match = expression.match(cursor, context);
            expect(match).toEqual({})
        });
    });

    describe('variableDecl', () => {
        test('segments multiple lines', () => {
            const context = Context.from('var<storage, read> input_data: array<u32>', 'file');
            const cursor = Cursor(0);

            const match = expression.match(cursor, context);
            expect(match).toEqual({})
        });
    });

    describe('structDecl', () => {
        test('segments multiple lines', () => {
            const context = Context.from('struct Vehicle { num_wheels: u32, mass_kg: f32, }', 'file');
            const cursor = Cursor(0);

            const match = expression.match(cursor, context);
            expect(match).toEqual({})
        });
    });

    describe('functionDecl', () => {
        test('segments multiple lines', () => {
            const context = Context.from('fn average(a : f32, b : f32) -> f32 { return (a + b) / 2; }', 'file');
            const cursor = Cursor(0);

            const match = expression.match(cursor, context);
            expect(match).toEqual({})
        });
    });
});