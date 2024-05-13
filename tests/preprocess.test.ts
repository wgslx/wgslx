import { discoverTemplates, preprocess } from '../src/preprocess';

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
    describe('discoverTemplates', () => {
        test('does not discover templates', () => {
            expect(discoverTemplates('const a = 1;')).toEqual([]);
        });

        test('discovers simple template', () => {
            expect(discoverTemplates('vec4<i32>')).toEqual([{
                startPosition: 4,
                endPosition: 8,
            }]);
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
                }
            ]);
        });
    });
});