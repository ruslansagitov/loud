/* global window, document */
'use strict';

var jsdom;

if (typeof window !== 'undefined') {
    jsdom = function(data) {
        var elem = document.createElement('div');
        elem.innerHTML = data;

        return elem;
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
}

module.exports = jsdom;
