import * as fs from 'fs';
import * as path from 'path';

const syntaxPath = path.resolve(__dirname, './syntax.bnf');
const syntaxExtendedPath = path.resolve(__dirname, './syntax-extended.bnf');
const outputPath = path.resolve(__dirname, '../src/syntax.ts');

const syntax = fs.readFileSync(syntaxPath, {encoding: 'utf8'});
const syntaxExtended = fs.readFileSync(syntaxExtendedPath, {encoding: 'utf8'});

// Write output.
let data = `// GENERATED FILE. DO NOT EDIT. RUN \`npm run generate\`

import { maybe, sequence, star, symbol, union } from "./rules";

// CONSTANTS
const TEMPLATE_ARGS_START = '\u276c';
const TEMPLATE_ARGS_END = '\u276d';
const SHIFT_LEFT = '<<';
const SHIFT_RIGHT = '>>';
const LESS_THAN = '<';
const GREATER_THAN = '>';
const LESS_THAN_EQUAL = '<=';
const GREATER_THAN_EQUAL = '>=';
const SHIFT_LEFT_ASSIGN = '<<=';
const SHIFT_RIGHT_ASSIGN = '>>=';

`;

function camel(underscore: string): string {
  if (underscore.startsWith('_')) {
    return underscore.substring(1).toUpperCase();
  }

  return underscore.replace(/_[a-z]/g, (c) => c.substring(1).toUpperCase());
}

const RULE_REGEX = /([a-z_]+) :(.+?)\n;/gms;

function line(tokens: string[], start = 0): string {
  const out: string[] = [];

  let i: number;
  for (i = start; i < tokens.length && tokens[i] != ')'; i++) {
    const token = tokens[i];

    if (token.startsWith("'")) {
      out.push(token);
      continue;
    }

    if (token.startsWith('/')) {
      out.push(token);
      continue;
    }

    const identifier = token.match(/^[a-z_]+$/);
    if (identifier) {
      const variable = camel(token);
      if (variable !== 'DISAMBIGUATE_TEMPLATE') {
        out.push(camel(token));
      }
      continue;
    }

    if (token === '*') {
      out[out.length - 1] = `star(${out[out.length - 1]})`;
      continue;
    }

    if (token === '?') {
      out[out.length - 1] = `maybe(${out[out.length - 1]})`;
    }

    if (token === '(') {
      out.push(line(tokens, ++i));
      continue;
    }
  }
  tokens.splice(start, i - start);

  if (out.length === 1) {
    return out[0];
  }
  return `sequence(${out.join(', ')})`;
}

function process(syntax: string) {
  const declaration: string[] = [];
  const implementation: string[] = [];

  let ruleMatch = RULE_REGEX.exec(syntax);
  while (ruleMatch) {
    const identifier = ruleMatch[1];
    const variable = camel(identifier);

    declaration.push(`export const ${variable} = symbol('${identifier}');`);

    const lines = ruleMatch[2].split('\n|').map((s) => s.trim());
    const rules = lines.map((l) => {
      const r = l.split(/\s/);
      return line(r);
    });

    implementation.push(
      `${variable}.set(union(\n\t${rules.join(',\n\t')},\n));`
    );

    ruleMatch = RULE_REGEX.exec(syntax);
  }

  data += `
// DECLARATIONS
${declaration.join('\n')}

// IMPLEMENTATIONS
${implementation.join('\n\n')}
`;
}

process(syntax);
process(syntaxExtended);

fs.writeFileSync(outputPath, data);
