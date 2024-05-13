// Template discovery
// https://www.w3.org/TR/WGSL/#template-lists-sec
//
// In our implementation of the parser, we preprocess code to deliminate template brackets from 
// greater than and less than characters. We replace them with double angle quotation marks
// U+00AB «, and U+00BB ». As this is done per file, templates opening and closing can not cross
// file boundaries.

import { IDENT_PATTERN_TOKEN_REGEX, matchBlankspace, matchBlockComment, matchIdentPatternToken, matchLineEndingComment, matchLiteral } from "./patterns";

const TEMPLATE_START = '\u00ab';
const TEMPLATE_END = '\u00bb';

interface UnclosedCandidate {
    position: number;
    depth: number;
}

interface TemplateList {
    startPosition: number;
    endPosition: number;
}

export function preprocess(text: string) {
    const discoveredTemplateLists: TemplateList[] = [];
    const pendingCandidatesStack: UnclosedCandidate[] = [];
    let currentPosition = 0;
    let nestingDepth = 0;

    function matchAdvance(...matchers: Array<(text: string, position: number) => string>) {
        const startPosition = currentPosition;
        let matched = false;
        do {
            for (let matcher of matchers) {
                const match = matcher(text, currentPosition);
                if (match) {
                    currentPosition += match.length;
                    matched = true;
                    break;
                }
            }
        } while (matched === true);

        return (startPosition === currentPosition)
            ? undefined
            : text.substring(startPosition, currentPosition);
    }

    function startsWithAdvance(...consts: string[]) {
        const rest = text.substring(currentPosition);

        return consts.some(c => rest.startsWith(c));
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
            if (pendingCandidatesStack.length &&
                pendingCandidatesStack[pendingCandidatesStack.length - 1].depth === nestingDepth) {

                const pending = pendingCandidatesStack.pop();
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
    }

}