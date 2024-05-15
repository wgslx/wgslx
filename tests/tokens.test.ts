import { Context, flatten, stringify } from '../src/rules';
import { Cursor } from '../src/sequence';
import { expression, statement, variableDecl, structDecl, functionDecl } from '../src/tokens';

describe('syntax', () => {
    describe('expression', () => {
        test('additive, indexing, swizzle', () => {
            const context = Context.from('a[4] + b.xyz', 'file');
            const cursor = Cursor(0);

            const match = expression.match(cursor, context);
            expect(match.cursor).toEqual(Cursor(3));
            expect(stringify(match)).toEqual('a [ 4 ] + b . xyz');
        });
    });

    describe('statement', () => {
        test('assignment, increment', () => {
            const context = Context.from('a = 3;', 'file');
            const cursor = Cursor(0);

            const match = statement.match(cursor, context);
            expect(match.cursor).toEqual(Cursor(3));
            expect(stringify(match)).toEqual('a = 3 ;');
        });
    });

    describe('variableDecl', () => {
        test('var template, type template', () => {
            const context = Context.from('var<storage> input_data: array<i32>', 'file');
            const cursor = Cursor(0);

            const match = variableDecl.match(cursor, context);
            expect(match.cursor).toEqual(Cursor(3));
            expect(stringify(match)).toEqual('var ❬ storage ❭ input_data : array ❬ i32 ❭');
        });
    });

    describe('structDecl', () => {
        test('struct with fields', () => {
            const context = Context.from('struct Vehicle { num_wheels: u32, mass_kg: f32, }', 'file');
            const cursor = Cursor(0);

            const match = structDecl.match(cursor, context);
            expect(match.cursor).toEqual(Cursor(8));
            expect(stringify(match)).toEqual('struct Vehicle { num_wheels : u32 , mass_kg : f32 , }');
        });
    });

    describe('functionDecl', () => {
        test('segments multiple lines', () => {
            const context = Context.from('fn average(a : f32, b : f32) -> f32 { return (a + b) / 2; }', 'file');
            const cursor = Cursor(0);

            const match = functionDecl.match(cursor, context);
            expect(match.cursor).toEqual(Cursor(17));
            expect(stringify(match)).toEqual('fn average ( a : f32 , b : f32 ) -> f32 { return ( a + b ) / 2 ; }');
        });
    });
});