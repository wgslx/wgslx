// Template discovery
// https://www.w3.org/TR/WGSL/#template-lists-sec
//
// In our implementation of the parser, we preprocess code to deliminate template brackets from
// greater than and less than characters. We replace them with double angle quotation marks
// U+00AB «, and U+00BB ». As this is done per file, templates opening and closing can not cross
// file boundaries.

import {
  LINE_BREAK_REGEX,
  matchBlankspace,
  matchBlockComment,
  matchIdentPatternToken,
  matchLineEndingComment,
  matchLiteral,
} from './patterns';
import {TEMPLATE_END, TEMPLATE_START} from './util';

interface UnclosedCandidate {
  position: number;
  depth: number;
}

interface TemplateList {
  startPosition: number;
  endPosition: number;
}

export function preprocess(text: string) {
  const strippedText = stripComments(text);
  const templateLists = discoverTemplates(strippedText);

  text = text.replaceAll(/[<>]/g, (character, offset) => {
    switch (character) {
      case '<':
        return templateLists.some((t) => t.startPosition === offset)
          ? TEMPLATE_START
          : '<';
      case '>':
        return templateLists.some((t) => t.endPosition === offset)
          ? TEMPLATE_END
          : '>';
    }

    throw new Error('Unidentified character.');
  });

  return text;
}

function firstIndexOf(
  text: string,
  position: number,
  ...values: string[]
): [number, string] {
  let minIndex = Number.MAX_SAFE_INTEGER;
  let minChar = '';

  for (let value of values) {
    const index = text.indexOf(value, position);
    if (index !== -1 && index < minIndex) {
      minIndex = index;
      minChar = value;
    }
  }

  if (minIndex === Number.MAX_SAFE_INTEGER) {
    return [-1, ''];
  }

  return [minIndex, minChar];
}

export function stripComments(text: string) {
  const lines = text.split(LINE_BREAK_REGEX);

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const [firstCommentIndex, firstCommentType] = firstIndexOf(
      lines[lineIndex],
      0,
      '//',
      '/*',
      '*/'
    );

    if (firstCommentIndex === -1) {
      lines[lineIndex] = lines[lineIndex].trimEnd();
      continue;
    }

    if (firstCommentType === '*/') {
      throw new Error(`Line ${lineIndex + 1}: Unexpected block comment close.`);
    }

    if (firstCommentType === '//') {
      // Trim the end as no tokens will reference it anymore.
      lines[lineIndex] = lines[lineIndex].substring(0, firstCommentIndex);
      continue;
    }

    let depth = 1;
    let startLine = lineIndex;
    let column = firstCommentIndex + 2;
    while (depth !== 0) {
      const [nextBlockIndex, nextBlockType] = firstIndexOf(
        lines[lineIndex],
        column,
        '/*',
        '*/'
      );

      if (nextBlockIndex === -1) {
        if (lineIndex === lines.length - 1) {
          throw new Error(`Line ${startLine}: Unclosed block comment.`);
        }
        // Try the next line.
        lineIndex += 1;
        column = 0;
        continue;
      }

      if (nextBlockType === '/*') {
        depth += 1;
        column = nextBlockIndex + 2;
        continue;
      }

      if (nextBlockType === '*/') {
        depth -= 1;
        column = nextBlockIndex + 2;
        continue;
      }

      throw new Error('Unreachable code.');
    }

    if (startLine == lineIndex) {
      // Same line block comment, replace with whitespace since it can affect token positioning.
      lines[lineIndex] =
        lines[lineIndex].substring(0, firstCommentIndex) +
        ' '.repeat(column - firstCommentIndex) +
        lines[lineIndex].substring(column);
      lineIndex -= 1; // Revisit the line for any other comments.
      continue;
    }

    lines[startLine] = lines[startLine].substring(0, firstCommentIndex);

    for (let j = startLine + 1; j < lineIndex; j++) {
      lines[j] = '';
    }

    lines[lineIndex] = ' '.repeat(column) + lines[lineIndex].substring(column);
    lineIndex -= 1; // Revisit the line for any other comments.
  }

  return lines.join('\n');
}

export function discoverTemplates(text: string) {
  const discoveredTemplateLists: TemplateList[] = [];
  const pendingCandidatesStack: UnclosedCandidate[] = [];
  let currentPosition = 0;
  let nestingDepth = 0;

  function matchAdvance(
    ...matchers: Array<(text: string, position: number) => string | undefined>
  ) {
    const startPosition = currentPosition;
    let matched = false;

    rematch: do {
      for (let matcher of matchers) {
        const match = matcher(text, currentPosition);
        if (match) {
          currentPosition += match.length;
          matched = true;
          continue rematch;
        }
      }
      matched = false;
    } while (matched === true && matchers.length > 1);

    return startPosition === currentPosition
      ? undefined
      : text.substring(startPosition, currentPosition);
  }

  function startsWithAdvance(...consts: string[]) {
    const rest = text.substring(currentPosition);

    for (const str of consts) {
      if (rest.startsWith(str)) {
        currentPosition += str.length;
        return true;
      }
    }

    return false;
  }

  // Advance CurrentPosition past blankspace, comments, and literals.
  while (currentPosition < text.length) {
    // Advance currentPosition past blankspace.
    matchAdvance(
      matchBlankspace,
      matchLiteral,
      matchLineEndingComment,
      matchBlockComment
    );

    if (matchAdvance(matchIdentPatternToken)) {
      // Advance CurrentPosition past blankspace and comments, if present.
      matchAdvance(matchBlankspace, matchLineEndingComment, matchBlockComment);

      if (startsWithAdvance('<')) {
        pendingCandidatesStack.push({
          position: currentPosition - 1,
          depth: nestingDepth,
        });

        if (startsWithAdvance('<') || startsWithAdvance('=')) {
          // From assumption 1, no template parameter starts with '<' (U+003C), so the
          // previous code point cannot be the start of a template list. Therefore the
          // current and previous code point must be '<<' operator.

          pendingCandidatesStack.pop();
        }
      }

      continue;
    }

    if (startsWithAdvance('>')) {
      if (
        pendingCandidatesStack.length > 0 &&
        pendingCandidatesStack[pendingCandidatesStack.length - 1].depth ===
          nestingDepth
      ) {
        const pending = pendingCandidatesStack.pop()!; // Asserted due to array length check.
        discoveredTemplateLists.push({
          startPosition: pending.position,
          endPosition: currentPosition - 1,
        });
      } else {
        startsWithAdvance('=');
      }

      continue;
    }

    if (startsWithAdvance('(', '[')) {
      nestingDepth++;
      continue;
    }

    if (startsWithAdvance(')', ']')) {
      nestingDepth--;
      continue;
    }

    if (startsWithAdvance('!')) {
      startsWithAdvance('=');
      continue;
    }

    if (startsWithAdvance('=')) {
      if (startsWithAdvance('=')) {
        continue;
      }

      nestingDepth = 0;
      pendingCandidatesStack.length = 0;
      continue;
    }

    if (startsWithAdvance(';', '{', ':')) {
      nestingDepth = 0;
      pendingCandidatesStack.length = 0;
      continue;
    }

    if (startsWithAdvance('&&', '||')) {
      while (
        pendingCandidatesStack.length &&
        pendingCandidatesStack[pendingCandidatesStack.length - 1].depth >=
          nestingDepth
      ) {
        pendingCandidatesStack.pop();
      }
      continue;
    }

    currentPosition += 1;
  }

  return discoveredTemplateLists;
}
