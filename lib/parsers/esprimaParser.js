'use strict';
var eol = require('eol');
var extract = require('esprima-extract-comments');
var commentsUtil = require('../utils/comments');

var rBlockComment = /\/\*(?:[\s\S]*?)\*\//gmi;

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

module.exports = function (params) {
    params = params || {};
    var regex = commentsUtil.getRegex(params.customTags);

    return function parse(contents, file) {

        return extract(contents).map(function (comment) {
            var match = regex.match(comment.value);
            var line = comment.loc.start.line;
            var comment = commentsUtil.prepareComment(match, index + 1, file);
            return comment;
        });
        return comments;
    };
};
