/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 Ruslan Sagitov
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

var getAccessibleName;

var getFrom = [
    function(node, recurse) {
        var ids = node.getAttribute('aria-labelledby');
        if (!recurse && ids) {
            var that = this;
            return ids.split(/\s+/).map(function(id) {
                var elem = that.getElementById(id);
                if (elem) {
                    var val = that.getAccessibleName(elem, true);
                    return val && val.trim();
                }
            }).filter(function(str) {
                return str;
            }).join(' ');
        }
    },

    function(node, recurse) {
        if (!recurse || !node.isEmbeddedControl()) {
            return node.getAttribute('aria-label');
        }
    },

    function(node, recurse) {
        if ((!recurse || !node.isEmbeddedControl()) &&
            !node.isPresentation() && node.mayHaveAlt()) {
            return node.getAttribute('alt');
        }
    },

    function(node, recurse) {
        if ((!recurse || !node.isEmbeddedControl()) &&
            !node.isPresentation()) {
            var label = TAG_LABEL_TAG[node.tag];
            if (label) {
                return node.getTextContentFromDirectChild(label);
            }
        }
    },

    function(node, recurse) {
        if ((!recurse || !node.isEmbeddedControl()) &&
            !node.isPresentation()) {
            var id = node.getAttribute('id');
            if (id) {
                var elems = this.getElementsByTagName('label');
                elems = toArray.call(elems).filter(function(label) {
                    return label.getAttribute('for') === id;
                });

                if (elems.length) {
                    return getAccessibleName.call(this, elems[0], recurse);
                }
            }
        }
    },

    function(node, recurse) {
        if (!node.mayAccessibleNameFromContents()) {
            return null;
        }

        node = node.firstChild;

        var name = [],
            value;
        for (; node; node = node.nextSibling) {
            switch (node.nodeType) {
                case 1:
                    if (!node.isEmbeddedControl()) {
                        value = getAccessibleName.call(this, node, recurse);
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
        }

        return name.join(' ');
    },

    function(node) {
        return node.getAttribute('title');
    },

    function(node) {
        if (node.mayHaveHref()) {
            return node.getAttribute('href');
        }
    }
];

var getFromNode = function(node, recurse) {
    var that = this,
        name;

    getFrom.some(function(callback) {
        name = callback.call(that, node, recurse);
        return name;
    });

    return name || '';
};

getAccessibleName = function(node, recurse) {
    var name = node.accessibleName;
    if (typeof name !== 'undefined') {
        return name;
    }

    name = getFromNode.call(this, node, recurse);
    node.accessibleName = name;

    return name;
};

exports.get = getAccessibleName;
