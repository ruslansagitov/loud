'use strict';

var jsdom;

if (typeof window !== 'undefined') {
    jsdom = function(data) {
        var elem = document.createElement('div');
        elem.innerHTML = data;

        return elem;
    };

    jsdom.text = function(data) {
        return document.createTextNode(data);
    };

    jsdom.comment = function(data) {
        return document.createComment(data);
    };
} else {
    var realJSDom = require('jsdom').jsdom;
    jsdom = function() {
        var doc = realJSDom.apply(this, arguments),
            div = doc.createElement('div'),
            node = doc.body.firstChild,
            next;

        for (; node; node = next) {
            next = node.nextSibling;
            div.appendChild(node);
        }

        return div;
    };

    jsdom.text = function(data) {
        return realJSDom.apply(this, arguments);
    };

    jsdom.comment = function(data) {
        return realJSDom.apply(this, ['<!-- ' + data + '-->']);
    };
}

module.exports = jsdom;
