// Template discovery
// https://www.w3.org/TR/WGSL/#template-lists-sec
//
// In our implementation of the parser, we preprocess code to deliminate template brackets from 
// greater than and less than characters. We replace them with double angle quotation marks
// U+00AB «, and U+00BB ». As this is done per file, templates opening and closing can not cross
// file boundaries.

import { matchBlankspace, matchBlockComment, matchIdentPatternToken, matchLineEndingComment, matchLiteral } from "./patterns";

const TEMPLATE_START = '\u276c';
const TEMPLATE_END = '\u276d';

interface UnclosedCandidate {
    position: number;
    depth: number;
}

interface TemplateList {
    startPosition: number;
    endPosition: number;
}

export function preprocess(text: string) {
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

export function discoverComments(text: string) {

}

export function discoverTemplates(text: string) {
    const discoveredTemplateLists: TemplateList[] = [];
    const pendingCandidatesStack: UnclosedCandidate[] = [];
    let currentPosition = 0;
    let nestingDepth = 0;

    function matchAdvance(...matchers: Array<(text: string, position: number) => string | undefined>) {
        const startPosition = currentPosition;
        let matched = false;

        rematch:
        do {
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
            matchBlockComment,
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
                };
            }

            continue;
        }

        if (startsWithAdvance('>')) {
            if (pendingCandidatesStack.length > 0 &&
                pendingCandidatesStack[pendingCandidatesStack.length - 1].depth === nestingDepth) {

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