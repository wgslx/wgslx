"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discoverTemplates = exports.stripComments = exports.preprocess = void 0;
const patterns_1 = require("./patterns");
const util_1 = require("./util");
function preprocess(text) {
    const strippedText = stripComments(text);
    const templateLists = discoverTemplates(strippedText);
    text = text.replaceAll(/[<>]/g, (character, offset) => {
        switch (character) {
            case '<':
                return templateLists.some((t) => t.startPosition === offset)
                    ? util_1.TEMPLATE_START
                    : '<';
            case '>':
                return templateLists.some((t) => t.endPosition === offset)
                    ? util_1.TEMPLATE_END
                    : '>';
        }
        throw new Error('Unidentified character.');
    });
    return text;
}
exports.preprocess = preprocess;
function firstIndexOf(text, position, ...values) {
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
function stripComments(text) {
    const lines = text.split(patterns_1.LINE_BREAK_REGEX);
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const [firstCommentIndex, firstCommentType] = firstIndexOf(lines[lineIndex], 0, '//', '/*', '*/');
        if (firstCommentIndex === -1) {
            lines[lineIndex] = lines[lineIndex].trimEnd();
            continue;
        }
        if (firstCommentType === '*/') {
            throw new Error(`Line ${lineIndex + 1}: Unexpected block comment close.`);
        }
        if (firstCommentType === '//') {
            lines[lineIndex] = lines[lineIndex].substring(0, firstCommentIndex);
            continue;
        }
        let depth = 1;
        let startLine = lineIndex;
        let column = firstCommentIndex + 2;
        while (depth !== 0) {
            const [nextBlockIndex, nextBlockType] = firstIndexOf(lines[lineIndex], column, '/*', '*/');
            if (nextBlockIndex === -1) {
                if (lineIndex === lines.length - 1) {
                    throw new Error(`Line ${startLine}: Unclosed block comment.`);
                }
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
            lines[lineIndex] =
                lines[lineIndex].substring(0, firstCommentIndex) +
                    ' '.repeat(column - firstCommentIndex) +
                    lines[lineIndex].substring(column);
            lineIndex -= 1;
            continue;
        }
        lines[startLine] = lines[startLine].substring(0, firstCommentIndex);
        for (let j = startLine + 1; j < lineIndex; j++) {
            lines[j] = '';
        }
        lines[lineIndex] = ' '.repeat(column) + lines[lineIndex].substring(column);
        lineIndex -= 1;
    }
    return lines.join('\n');
}
exports.stripComments = stripComments;
function discoverTemplates(text) {
    const discoveredTemplateLists = [];
    const pendingCandidatesStack = [];
    let currentPosition = 0;
    let nestingDepth = 0;
    function matchAdvance(...matchers) {
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
    function startsWithAdvance(...consts) {
        const rest = text.substring(currentPosition);
        for (const str of consts) {
            if (rest.startsWith(str)) {
                currentPosition += str.length;
                return true;
            }
        }
        return false;
    }
    while (currentPosition < text.length) {
        matchAdvance(patterns_1.matchBlankspace, patterns_1.matchLiteral, patterns_1.matchLineEndingComment, patterns_1.matchBlockComment);
        if (matchAdvance(patterns_1.matchIdentPatternToken)) {
            matchAdvance(patterns_1.matchBlankspace, patterns_1.matchLineEndingComment, patterns_1.matchBlockComment);
            if (startsWithAdvance('<')) {
                pendingCandidatesStack.push({
                    position: currentPosition - 1,
                    depth: nestingDepth,
                });
                if (startsWithAdvance('<') || startsWithAdvance('=')) {
                    pendingCandidatesStack.pop();
                }
            }
            continue;
        }
        if (startsWithAdvance('>')) {
            if (pendingCandidatesStack.length > 0 &&
                pendingCandidatesStack[pendingCandidatesStack.length - 1].depth ===
                    nestingDepth) {
                const pending = pendingCandidatesStack.pop();
                discoveredTemplateLists.push({
                    startPosition: pending.position,
                    endPosition: currentPosition - 1,
                });
            }
            else {
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
            while (pendingCandidatesStack.length &&
                pendingCandidatesStack[pendingCandidatesStack.length - 1].depth >=
                    nestingDepth) {
                pendingCandidatesStack.pop();
            }
            continue;
        }
        currentPosition += 1;
    }
    return discoveredTemplateLists;
}
exports.discoverTemplates = discoverTemplates;
