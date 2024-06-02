"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValued = exports.TEMPLATE_END = exports.TEMPLATE_START = void 0;
exports.TEMPLATE_START = '\u276c';
exports.TEMPLATE_END = '\u276d';
function isValued(value) {
    return value !== null && value !== undefined;
}
exports.isValued = isValued;
