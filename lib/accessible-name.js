/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Ruslan Sagitov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
'use strict';

var UTIL = require('./util');

var toArray = UTIL.toArray;

var TAG_LABEL_TAG = {
    table: 'caption',
    fieldset: 'legend',
    figure: 'figcaption',
    details: 'summary'
};

var getFrom = [
    function(wrapNode, recurse) {
        var ids = wrapNode.getAttribute('aria-labelledby');
        if (!recurse && ids) {
            return ids.split(/\s+/).map(function(id) {
                var node = wrapNode.ctx.getElementById(id);
                if (!node) {
                    return null;
                }

                var val = getAccessibleName(node, true);
                return val && val.trim();
            }).filter(function(str) {
                return str;
            }).join(' ');
        }
    },

    function(wrapNode, recurse) {
        if (!recurse || !wrapNode.isEmbeddedControl()) {
            return wrapNode.getAttribute('aria-label');
        }
    },

    function(wrapNode, recurse) {
        if ((!recurse || !wrapNode.isEmbeddedControl()) &&
            !wrapNode.isPresentation() && wrapNode.mayHaveAlt()) {
            return wrapNode.getAttribute('alt');
        }
    },

    function(wrapNode, recurse) {
        if ((!recurse || !wrapNode.isEmbeddedControl()) &&
            !wrapNode.isPresentation()) {
            var label = TAG_LABEL_TAG[wrapNode.tag];
            if (label) {
                return wrapNode.getTextContentFromDirectChild(label);
            }
        }
    },

    function(wrapNode, recurse) {
        if ((!recurse || !wrapNode.isEmbeddedControl()) &&
            !wrapNode.isPresentation()) {
            var id = wrapNode.getAttribute('id');
            if (!id) {
                return null;
            }

            var elems = wrapNode.ctx.getElementsByTagName('label');
            elems = toArray.call(elems).filter(function(label) {
                return label.getAttribute('for') === id;
            });

            if (elems.length) {
                return getAccessibleName(elems[0], recurse);
            }
        }
    },

    function(wrapNode, recurse) {
        if (!wrapNode.mayAccessibleNameFromContents()) {
            return null;
        }

        var node = wrapNode.firstChild,
            name = [],
            value;
        while (node) {
            switch (node.nodeType) {
                case 1:
                    if (!node.isEmbeddedControl()) {
                        value = getAccessibleName(node, recurse);
                    } else if (node.valuetext) {
                        value = node.valuetext;
                    } else if (typeof node.valuenow !== 'undefined') {
                        value = node.valuenow;
                    } else {
                        value = node.value;
                    }
                    break;
                case 3:
                    value = node.nodeValue.trim();
                    break;
            }

            if (value) {
                name.push(value);
            }

            node = node.nextSibling;
        }

        return name.join(' ');
    },

    function(wrapNode) {
        return wrapNode.getAttribute('title');
    },

    function(wrapNode) {
        if (wrapNode.mayHaveHref()) {
            return wrapNode.getAttribute('href');
        }
    }
];

function getFromNode(wrapNode, recurse) {
    var name;

    getFrom.some(function(callback) {
        name = callback(wrapNode, recurse);
        return name;
    });

    return name || '';
}

function getAccessibleName(wrapNode, recurse) {
    var name = wrapNode.accessibleName;
    if (typeof name !== 'undefined') {
        return name;
    }

    name = getFromNode(wrapNode, recurse);
    wrapNode.accessibleName = name;

    return name;
}

exports.get = getAccessibleName;
