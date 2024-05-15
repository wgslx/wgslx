import * as fs from 'fs';
import * as path from 'path'

const inputPath = path.resolve(__dirname, './syntax.bnf');
const outputPath = path.resolve(__dirname, '../src/tokens.ts');

const syntax = fs.readFileSync(inputPath, { encoding: 'utf8' });

function camel(underscore: string): string {
    if (underscore.startsWith('_')) {
        return underscore.substring(1).toUpperCase();
    }

    return underscore.replace(/_[a-z]/g, c => c.substring(1).toUpperCase());
}

const RULE_REGEX = /([a-z_]+) :(.+?)\n;/gms;

const declaration: string[] = [];
const implementation: string[] = [];


function line(tokens: string[], start = 0): string {
    const out: string[] = [];

    let i: number;
    for (i = start; i < tokens.length && tokens[i] != ')'; i++) {
        const token = tokens[i];

        if (token.startsWith('\'')) {
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

let ruleMatch = RULE_REGEX.exec(syntax);
while (ruleMatch) {
    const identifier = ruleMatch[1];
    const variable = camel(identifier);

    declaration.push(`export const ${variable} = name('${identifier}');`);

    const lines = ruleMatch[2].split('\n|').map(s => s.trim());
    const rules = lines
        .map(l => {
            const r = l.split(/\s/);
            return line(r);
        })


    implementation.push(`${variable}.set(union(\n\t${rules.join(',\n\t')},\n));`)

    ruleMatch = RULE_REGEX.exec(syntax);
};

// Write output.
const data = `// GENREATED FILE. DO NOT EDIT. RUN \`npm run generate\`

import { maybe, name, sequence, star, union } from "./rules";

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

// DECLARATIONS
${declaration.join('\n')}

// IMPLEMENTATIONS
${implementation.join('\n\n')}`
fs.writeFileSync(outputPath, data);