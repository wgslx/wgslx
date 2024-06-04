import {join, resolve, dirname} from 'path';
import {readFileSync} from 'fs';

import {Context, postprocess, preprocess} from '../src';
import {ImportResolver, compileWgslx} from '../src';
import {translationUnitExtended} from '../src/syntax';

function testFile(inPath: string, outPath: string) {
  const inFullPath = join(__dirname, inPath);
  const outFullPath = join(__dirname, outPath);

  const input = readFileSync(inFullPath, 'utf-8');
  const output = readFileSync(outFullPath, 'utf-8');

  const processed = preprocess(input);
  const result = Context.matchSource(
    processed,
    'file',
    translationUnitExtended
  );
  expect(result.match).toBeTruthy();
  const text = result!.toString();
  const resolvedText = postprocess(result.match!.token);
  expect(resolvedText).toEqual(output);
}

const TEST_RESOLVER: ImportResolver = {
  resolveFilePath: (baseFilePath: string, importStatementPath: string) => {
    const baseDirectory = dirname(baseFilePath);
    return resolve(baseDirectory, importStatementPath);
  },

  readSource: (filePath: string) => {
    const fullPath = resolve(__dirname, filePath);
    const input = readFileSync(fullPath, 'utf-8');
    return input;
  },
};

function testWgslx(inPath: string, outPath: string) {
  const inFullPath = join(__dirname, inPath);
  const outFullPath = join(__dirname, outPath);

  const input = readFileSync(inFullPath, 'utf-8');
  const output = readFileSync(outFullPath, 'utf-8');

  const generated = compileWgslx(input, inFullPath, {
    mode: 'wgslx',
    importResolver: TEST_RESOLVER,
  });
  expect(generated).toEqual(output);
}

describe('data', () => {
  test('basic', () => {
    testFile('data/basic.wgsl', 'data/basic-out.wgsl');
  });
  test('multifile', () => {
    testWgslx('data/multifile.wgslx', 'data/multifile-out.wgsl');
  });
});
