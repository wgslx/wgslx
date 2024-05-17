import { inspect } from 'util';

import { Context } from '../src/rules';
import { Cursor } from '../src/sequence';
import { expression, statement, variableDecl, structDecl, functionDecl, translationUnitExtended } from '../src/syntax';
import { Token, TokenObject } from '../src/token';

function node(symbol: string | string[], ...children: TokenObject[]): TokenObject {
    if (Array.isArray(symbol)) {
        if (symbol.length === 1) {
            return node(symbol[0], ...children);
        }

        const [first, ...rest] = symbol;
        return node(first, node(rest, ...children));
    }

    return {
        symbol,
        children: children,
    }
}

function leaf(text: string, source: string): TokenObject;
function leaf(symbol: string, text: string, source: string): TokenObject;
function leaf(first: string, second: string, third?: string): TokenObject {
    return third
        ? { symbol: first, text: second, source: third }
        : { text: first, source: second };
}

function stringify(token: Token | undefined, depth = 0): string {
    if (!token) {
        return '';
    }

    const line0 = `\n${'    '.repeat(depth)}`;
    const line = `\n${'    '.repeat(depth + 1)}`;
    const line2 = `\n${'    '.repeat(depth + 2)}`;

    const nested: Token[] = [];
    while (token.symbol && token.children?.length === 1 && !token.text && !token.source) {
        console.log(token.symbol);
        nested.push(token);
        token = token.children[0];
    }

    if (token.symbol && token.children && !token.text && !token.source) {
        //nested.push(token);
    } else if (nested.length) {
        token = nested.pop()!;
    }

    if (nested.length === 1) {
        return token.children!.length === 0
            ? `node ('${token.symbol}', [])`
            : [
                `node('${token.symbol}',`,
                ...token.children!.map((c: Token) => stringify(c, depth + 1) + ','),
            ].join(line) + line0 + ')';
    } else if (nested.length > 1) {
        //console.log(nested, token);
        return [
            'node(',
            '[',
            ...[...nested, token].map(n => `    '${n.symbol}',`),
            '],',
            ...token.children!.map((c: Token) => stringify(c, depth + 1) + ','),
        ].join(line) + line0 + ')';
    }

    if (token.text && token.source && !token.children) {
        return token.symbol
            ? `leaf('${token.symbol}', '${token.text}', '${token.source}')`
            : `leaf('${token.text}', '${token.source}')`;
    }

    const fields: string[] = [];

    if (token.symbol) fields.push(`symbol: '${token.symbol},'`);
    if (token.text) fields.push(`text: '${token.text}',`);
    if (token.source) fields.push(`source: '${token.source}',`);
    if (token.children) {
        fields.push([
            'children: [',
            ...token.children.map(c => stringify(c, depth + 1) + ','),
        ].join(line2) + line + '],');
    }

    return [
        '{',
        ...fields,
    ].join(line) + line0 + '}';
}

describe('tokens', () => {
    describe('expression', () => {
        test('additive, indexing, swizzle', () => {
            const context = Context.from('a[4] + b.xyz', 'file');
            const cursor = Cursor(0);

            const match = expression.match(cursor, context);
            expect(match?.cursor).toEqual(Cursor(3));
            expect(match?.token?.toString()).toEqual('a [ 4 ] + b . xyz');
            console.log(stringify(match?.token));
            console.log(inspect(match?.token?.toObject(), { depth: null }));
            expect(match?.token?.toObject()).toEqual(
                node(
                    [
                        'expression',
                        'relational_expression',
                        'shift_expression',
                        'additive_expression',
                    ],
                    node(
                        [
                            'additive_expression',
                            'multiplicative_expression',
                            'unary_expression',
                            'singular_expression',
                        ],
                        node(
                            [
                                'primary_expression',
                                'template_elaborated_ident',
                                'ident',
                            ],
                            leaf('ident_pattern_token', 'a', '0:0:file'),
                        ),
                        {
                            symbol: 'component_or_swizzle_specifier',
                            children: [
                                leaf('[', '0:1:file'),
                                node(
                                    [
                                        'expression',
                                        'relational_expression',
                                        'shift_expression',
                                        'additive_expression',
                                        'multiplicative_expression',
                                        'unary_expression',
                                        'singular_expression',
                                        'primary_expression',
                                        'literal',
                                        'int_literal',
                                    ],
                                    leaf('decimal_int_literal', '4', '0:2:file'),
                                ),
                                leaf(']', '0:3:file'),
                            ]
                        },
                    ),
                    leaf('additive_operator', '+', '0:5:file'),
                    node(
                        [
                            'multiplicative_expression',
                            'unary_expression',
                            'singular_expression',
                        ],
                        node(
                            [
                                'primary_expression',
                                'template_elaborated_ident',
                                'ident',
                            ],
                            leaf('ident_pattern_token', 'b', '0:7:file'),
                        ),
                        {
                            symbol: 'component_or_swizzle_specifier',
                            children: [
                                leaf('.', '0:8:file'),
                                {
                                    symbol: 'member_ident',
                                    children: [
                                        leaf('ident_pattern_token', 'xyz', '0:9:file'),
                                    ],
                                },
                            ]
                        },
                    ),
                )
            );
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

    describe('translationUnitExtended', () => {
        test('import external file', () => {
            const context = Context.from('import "f";', 'file');
            const cursor = Cursor(0);

            const match = translationUnitExtended.match(cursor, context);
            expect(match?.cursor).toEqual(Cursor(2));
            expect(match?.token?.toString()).toEqual('import "f" ;');
        });
    });
});