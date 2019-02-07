"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function removeSpacesFromString(text) {
    return text.replace(/(\r\n\t?|\n|\r\n)/g, ' ');
    // return text.replace(/[\r\n\t]+|[\r\n\t\t]+|[\r\n]?/g, '');
    // return _.trim(text);
}
exports.removeSpacesFromString = removeSpacesFromString;
