import {join} from 'path';
import {readFileSync} from 'fs';

import {Syntax, postprocess, preprocess} from '../src';

function testFile(inPath: string, outPath: string) {
  const inFullPath = join(__dirname, inPath);
  const outFullPath = join(__dirname, outPath);

  const input = readFileSync(inFullPath, 'utf-8');
  const output = readFileSync(outFullPath, 'utf-8');

  const processed = preprocess(input);
  const token = Syntax.translationUnitExtended.matchAll(processed, 'file');
  expect(token).toBeTruthy();
  const text = token!.toString();
  const resolvedText = postprocess(token!);
  expect(resolvedText).toEqual(output);
}

describe('data', () => {
  test('placeholder', () => {
    testFile('data/basic.wgsl', 'data/basic-out.wgsl');
  });
});
