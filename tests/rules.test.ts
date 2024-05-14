import { Context, Rule, name, literal, regex, union, sequence, maybe, star } from '../src/rules';
import { Cursor } from '../src/sequence';

describe('rules', () => {
    describe('Context', () => {
        test('caches', () => {
            const context = Context.from('foobar', 'file');
            let times = 0;
            const rule: Rule = {
                match: (cursor: Cursor, context: Context) => {
                    times++;
                    return null;
                }
            };

            const cursor = {
                segment: 0,
                start: 0,
            }

            context.rule(cursor, rule);
            context.rule(cursor, rule);

            expect(times).toBe(1);
        });
    });

    describe('literal', () => {
        test('matches literal', () => {
            const context = Context.from('foobar', 'file');
            const rule = literal('foo');
            const cursor = {
                segment: 0,
                start: 0,
            }

            expect(context.rule(cursor, rule)).toEqual({
                cursor: {
                    segment: 0,
                    start: 3,
                },
                tokens: {
                    text: 'foo',
                    src: '0:0:file',
                },
            });
        });

        test('matches longest literal', () => {
            const context = Context.from('foobar', 'file');
            const rule = literal('foo', 'fooba', 'fo', 'bar');
            const cursor = {
                segment: 0,
                start: 0,
            }

            expect(context.rule(cursor, rule)).toEqual({
                cursor: {
                    segment: 0,
                    start: 5,
                },
                tokens: {
                    text: 'fooba',
                    src: '0:0:file',
                },
            });
        });
    });

    describe('regex', () => {
        test('matches regex', () => {
            const context = Context.from('foobar', 'file');
            const rule = regex(/foo/);
            const cursor = {
                segment: 0,
                start: 0,
            }

            expect(context.rule(cursor, rule)).toEqual({
                cursor: {
                    segment: 0,
                    start: 3,
                },
                tokens: {
                    text: 'foo',
                    src: '0:0:file',
                },
            });
        });

        test('matches longest regex', () => {
            const context = Context.from('foobar', 'file');
            const rule = regex(/foo/, /fooba/, /fo/, /bar/);
            const cursor = {
                segment: 0,
                start: 0,
            }

            expect(context.rule(cursor, rule)).toEqual({
                cursor: {
                    segment: 0,
                    start: 5,
                },
                tokens: {
                    text: 'fooba',
                    src: '0:0:file',
                },
            });
        });
    });

    describe('sequence', () => {
        test('matches sequence', () => {
            const context = Context.from('quick brown fox jumps', 'file');
            const rule = sequence('quick', 'brown', 'fox');
            const cursor = {
                segment: 0,
                start: 0,
            }

            expect(context.rule(cursor, rule)).toEqual({
                cursor: {
                    segment: 3,
                    start: 0,
                },
                tokens: [
                    {
                        tokens: {
                            text: 'quick',
                            src: '0:0:file',
                        },
                    },
                    {
                        tokens: {
                            text: 'brown',
                            src: '0:6:file',
                        },
                    },
                    {
                        tokens: {
                            text: 'fox',
                            src: '0:12:file',
                        },
                    },
                ],
            });
        });

        test('fails sequence', () => {
            const context = Context.from('quick brown fox jumps', 'file');
            const rule = sequence('quick', 'brown', 'box');
            const cursor = {
                segment: 0,
                start: 0,
            };

            expect(context.rule(cursor, rule)).toBe(null);
        });
    });

    describe('maybe', () => {
        test('matches single positive', () => {
            const context = Context.from('quick brown fox jumps', 'file');
            const rule = maybe('quick');
            const cursor = {
                segment: 0,
                start: 0,
            };

            expect(context.rule(cursor, rule)).toEqual({
                cursor: {
                    segment: 1,
                    start: 0,
                },
                tokens: {
                    text: 'quick',
                    src: '0:0:file',
                },
            });
        });

        test('matches multiple positive', () => {
            const context = Context.from('quick brown fox jumps', 'file');
            const rule = maybe('quick', 'brown');
            const cursor = {
                segment: 0,
                start: 0,
            };

            expect(context.rule(cursor, rule)).toEqual({
                cursor: {
                    segment: 2,
                    start: 0,
                },
                tokens: [
                    {
                        tokens: {
                            text: 'quick',
                            src: '0:0:file',
                        },
                    },
                    {
                        tokens: {
                            text: 'brown',
                            src: '0:6:file',
                        },
                    },
                ],
            });
        });

        test('matches negative', () => {
            const context = Context.from('quick brown fox jumps', 'file');
            const rule = maybe('slow');
            const cursor = {
                segment: 0,
                start: 0,
            };

            expect(context.rule(cursor, rule)).toEqual({
                cursor: {
                    segment: 0,
                    start: 0,
                },
            });
        });
    });
    describe('star', () => {
        test('matches RegExp', () => {
        });
    });
    describe('union', () => {
        test('matches RegExp', () => {
        });
    });
});