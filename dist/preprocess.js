"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discoverTemplates = exports.discoverComments = exports.preprocess = void 0;
const patterns_1 = require("./patterns");
const TEMPLATE_START = '\u276c';
const TEMPLATE_END = '\u276d';
function preprocess(text) {
    const templateLists = discoverTemplates(text);
    text = text.replaceAll(/[<>]/g, (character, offset) => {
        switch (character) {
            case '<':
                return templateLists.some(t => t.startPosition === offset)
                    ? TEMPLATE_START
                    : '<';
            case '>':
                return templateLists.some(t => t.endPosition === offset)
                    ? TEMPLATE_END
                    : '>';
        }
        throw new Error('Unidentified character.');
    });
    return text;
}
exports.preprocess = preprocess;
function discoverComments(text) {
}
exports.discoverComments = discoverComments;
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
        return (startPosition === currentPosition)
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
                ;
            }
            continue;
        }
        if (startsWithAdvance('>')) {
            if (pendingCandidatesStack.length > 0 &&
                pendingCandidatesStack[pendingCandidatesStack.length - 1].depth === nestingDepth) {
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
            while (pendingCandidatesStack.length
                && pendingCandidatesStack[pendingCandidatesStack.length - 1].depth >= nestingDepth) {
                pendingCandidatesStack.pop();
            }
            continue;
        }
        currentPosition += 1;
    }
    return discoveredTemplateLists;
}
exports.discoverTemplates = discoverTemplates;
