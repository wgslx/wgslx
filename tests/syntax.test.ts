import { inspect } from 'util';

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
            //console.log(inspect(match?.token?.toObject(), { depth: null }));
            expect(match?.token?.toObject()).toEqual({
                symbols: [
                    'additive_expression',
                    'shift_expression',
                    'relational_expression',
                    'short_circuit_or_expression',
                    'short_circuit_and_expression',
                    'expression'
                ],
                children: [
                    {
                        symbols: [
                            'singular_expression',
                            'unary_expression',
                            'multiplicative_expression',
                            'additive_expression',
                            'binary_and_expression',
                            'binary_or_expression',
                            'binary_xor_expression'
                        ],
                        children: [
                            {
                                source: '0:0:file',
                                text: 'a',
                                symbols: [
                                    'ident_pattern_token',
                                    'ident',
                                    'template_elaborated_ident',
                                    'primary_expression'
                                ]
                            },
                            {
                                symbols: ['component_or_swizzle_specifier'],
                                children: [
                                    { source: '0:1:file', text: '[' },
                                    {
                                        source: '0:2:file',
                                        text: '4',
                                        symbols: [
                                            'decimal_int_literal',
                                            'int_literal',
                                            'literal',
                                            'primary_expression',
                                            'singular_expression',
                                            'unary_expression',
                                            'multiplicative_expression',
                                            'additive_expression',
                                            'shift_expression',
                                            'relational_expression',
                                            'short_circuit_or_expression',
                                            'short_circuit_and_expression',
                                            'binary_and_expression',
                                            'binary_or_expression',
                                            'binary_xor_expression',
                                            'expression'
                                        ]
                                    },
                                    { source: '0:3:file', text: ']' }
                                ]
                            }
                        ]
                    },
                    { source: '0:5:file', text: '+', symbols: ['additive_operator'] },
                    {
                        symbols: [
                            'singular_expression',
                            'unary_expression',
                            'multiplicative_expression'
                        ],
                        children: [
                            {
                                source: '0:7:file',
                                text: 'b',
                                symbols: [
                                    'ident_pattern_token',
                                    'ident',
                                    'template_elaborated_ident',
                                    'primary_expression'
                                ]
                            },
                            {
                                symbols: ['component_or_swizzle_specifier'],
                                children: [
                                    { source: '0:8:file', text: '.' },
                                    {
                                        source: '0:9:file',
                                        text: 'xyz',
                                        symbols: ['ident_pattern_token', 'member_ident']
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
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