import { Context } from '../src/rules';
import { Cursor } from '../src/sequence';
import { expression, statement, variableDecl, structDecl, functionDecl } from '../src/syntax';

describe('tokens', () => {
    describe('expression', () => {
        test('additive, indexing, swizzle', () => {
            const context = Context.from('a[4] + b.xyz', 'file');
            const cursor = Cursor(0);

            const match = expression.match(cursor, context);
            expect(match?.cursor).toEqual(Cursor(3));
            expect(match?.token?.toString()).toEqual('a [ 4 ] + b . xyz');
        });
    });

    describe('statement', () => {
        test('assignment, increment', () => {
            const context = Context.from('a = 3;', 'file');
            const cursor = Cursor(0);

            const match = statement.match(cursor, context);
            expect(match?.cursor).toEqual(Cursor(3));
            expect(match?.token?.toString()).toEqual('a = 3 ;');
        });
    });

    describe('variableDecl', () => {
        test('var template, type template', () => {
            const context = Context.from('var<storage> input_data: array<i32>', 'file');
            const cursor = Cursor(0);

            const match = variableDecl.match(cursor, context);
            expect(match?.cursor).toEqual(Cursor(3));
            expect(match?.token?.toString()).toEqual('var ❬ storage ❭ input_data : array ❬ i32 ❭');
        });
    });

    describe('structDecl', () => {
        test('struct with fields', () => {
            const context = Context.from('struct Vehicle { num_wheels: u32, mass_kg: f32, }', 'file');
            const cursor = Cursor(0);

            const match = structDecl.match(cursor, context);
            expect(match?.cursor).toEqual(Cursor(8));
            expect(match?.token?.toString()).toEqual('struct Vehicle { num_wheels : u32 , mass_kg : f32 , }');
        });
    });

    describe('functionDecl', () => {
        test('function declaration', () => {
            const context = Context.from('fn average(a : f32, b : f32) -> f32 { return (a + b) / 2; }', 'file');
            const cursor = Cursor(0);

            const match = functionDecl.match(cursor, context);
            expect(match?.cursor).toEqual(Cursor(17));
            expect(match?.token?.toString()).toEqual('fn average ( a : f32 , b : f32 ) -> f32 { return ( a + b ) / 2 ; }');
        });

        test('vertex declaration', () => {
            const text =
                `
                @vertex
                fn main(@builtin(vertex_index) VertexIndex : u32)
                    -> @builtin(position) vec4f {

                    var pos = array<vec2f, 3>(
                        vec2(0.0, 0.5),
                        vec2(-0.5, -0.5),
                        vec2(0.5, -0.5)
                    );

                    return vec4f(pos[VertexIndex], 0.0, 1.0);
                }
                `;

            const context = Context.from(text, 'file');
            const cursor = Cursor(0);

            const match = functionDecl.match(cursor, context);
            expect(match?.token?.toString()).toEqual('@ vertex fn main ( @ builtin ( vertex_index ) VertexIndex : u32 ) -> @ builtin ( position ) vec4f { var pos = array ❬ vec2f , 3 ❭ ( vec2 ( 0.0 , 0.5 ) , vec2 ( - 0.5 , - 0.5 ) , vec2 ( 0.5 , - 0.5 ) ) ; return vec4f ( pos [ VertexIndex ] , 0.0 , 1.0 ) ; }');
        });
    });

    // describe('translationUnit', () => {
    //     test('translation unit', () => {
    //         const context = Context.from('fn average(a : f32, b : f32) -> f32 { return (a + b) / 2; }', 'file');
    //         const cursor = Cursor(0);

    //         const match = functionDecl.match(cursor, context);
    //         expect(match?.cursor).toEqual(Cursor(17));
    //         expect(match?.token?.toString()).toEqual('fn average ( a : f32 , b : f32 ) -> f32 { return ( a + b ) / 2 ; }');
    //     });
    // });
});