/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2025 Ruslan Sagitov
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

const {toArray} = require('./util');

const TAG_LABEL_TAG = {
    table: 'caption',
    fieldset: 'legend',
    figure: 'figcaption',
    details: 'summary'
};

const getFrom = [
    function(node, recurse) {
        let ids = node.getAttribute('aria-labelledby');
        if (!recurse && ids) {
            let that = this;
            return ids
                .split(/\s+/)
                .map(id => {
                    let elem = that.getElementById(id);
                    if (elem) {
                        let val = that.getAccessibleName(elem, true);
                        return val && val.trim();
                    }

                    return '';
                })
                .filter(str => str)
                .join(' ');
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
            let label = TAG_LABEL_TAG[node.tag];
            if (label) {
                return node.getTextContentFromDirectChild(label);
            }
        }
    },

    function(node, recurse) {
        if ((!recurse || !node.isEmbeddedControl()) &&
            !node.isPresentation()) {
            let id = node.getAttribute('id');
            if (id) {
                let elems = this.getElementsByTagName('label');
                elems = toArray.call(elems)
                    .filter(label => label.getAttribute('for') === id);

                if (elems.length) {
                    return this.getAccessibleName(elems[0], recurse);
                }
            }
        }
    },

    function(node, recurse) {
        if (!node.mayAccessibleNameFromContents()) {
            return null;
        }

        node = node.firstChild;

        let name = [],
            value;
        for (; node; node = node.nextSibling) {
            switch (node.nodeType) {
                case 1:
                    if (node.isInputInsideLabel()) {
                        value = '';
                    } else if (!node.isEmbeddedControl()) {
                        value = this.getAccessibleName(node, recurse);
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

module.exports = function(node, recurse) {
    let name = node.accessibleName,
        that = this;
    if (typeof name !== 'undefined') {
        return name;
    }

    getFrom.some(callback => {
        name = callback.call(that, node, recurse);
        return name;
    });

    node.accessibleName = name || '';

    return name;
};
