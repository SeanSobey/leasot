'use strict';
var eol = require('eol');
var DEFAULT_TAGS = ['todo', 'fixme'];

function getRegex(customTags) {
    var tags = DEFAULT_TAGS;
    if (customTags && customTags.length) {
        tags = tags.concat(customTags);
    }

    return (
        // Optional space.
        '\\s*' +
        // Optional `@`.
        '@?' +
        // One of the keywords such as `TODO` and `FIXME`.
        '(' + tags.join('|') + ')' +
        // Optional space.
        '\\s*' +
        // Optional leading reference in parens.
        '(?:\\(([^)]*)\\))?' +
        // Optional space.
        '\\s*' +
        // Optional colon `:`.
        ':?' +
        // Optional space.
        '\\s*' +
        // Comment text.
        '(.*?)' +
        // Optional trailing reference after a space and a slash, followed by an optional space.
        '(?:\\s+/([^\\s]+)\\s*)?'
    );
}

function prepareComment(match, line, file) {
    // match = [<entire_match>, required <kind>, <reference>, <text>, <reference>]
    if (!match || !match[1]) {
        return null;
    }
    var ref = match[2] || match[4] || '';
    var text = match[3] || '';
    return {
        file: file || 'unknown file',
        kind: match[1].toUpperCase(),
        line: line,
        text: text.trim(),
        ref: ref.trim()
    };
}

// Bases on get-line-from-pos to support Windows as well
// See https://github.com/pgilad/get-line-from-pos/blob/master/index.js
function getLineFromPos(str, pos) {
    if (pos === 0) {
        return 1;
    }
    //adjust for negative pos
    if (pos < 0) {
        pos = str.length + pos;
    }
    var lines = eol.split(str.substr(0, pos));
    return lines.length;
}

exports.getRegex = getRegex;
exports.prepareComment = prepareComment;
exports.getLineFromPos = getLineFromPos;
