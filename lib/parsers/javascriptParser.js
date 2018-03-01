'use strict';
var eol = require('eol');
var extract = require('extract-comments');
var commentsUtil = require('../utils/comments');

module.exports = function (params) {
    params = params || {};
    var regex = new RegExp(commentsUtil.getRegex(params.customTags) + '$', 'mig');

    return function parse(contents, file) {

        var comments = [];
        extract(contents, params.parserOpts || {}).forEach(function (comment) {
            var match = regex.exec(comment.raw);
            while (match) {
                var line = comment.loc.start.line + commentsUtil.getLineFromPos(comment.raw, match.index) - 1;
                var comment = commentsUtil.prepareComment(match, line, file);
                if (!comment) {
                    break;
                }
                comments.push(comment);
                var match = regex.exec(comment.raw);
            }
        });
        return comments;
    };
};
