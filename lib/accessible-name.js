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

var WrapNode = require('./wrap-node'),
    UTIL = require('./util');

var toArray = UTIL.toArray,
    getAccessibleName;

var TAG_LABEL_TAG = {
    table: 'caption',
    fieldset: 'legend',
    figure: 'figcaption',
    details: 'summary'
};

function getFromNode(wrapNode, recurse) {
    var name, node, n, value;

    name = wrapNode.getAttribute('aria-labelledby');
    if (!recurse && name) {
        name = name.split(/\s+/).map(function(id) {
            var elem = wrapNode.getElementById(id);
            if (!elem) {
                return '';
            }

            var n = new WrapNode(elem, wrapNode.ctx),
                val = getAccessibleName(n, true);
            return val && val.trim();
        }).filter(function(str) {
            return str;
        });

        if (name.length) {
            return name.join(' ');
        }
    }

    if (!recurse || !wrapNode.isEmbeddedControl()) {
        name = wrapNode.getAttribute('aria-label');
        if (name) {
            return name;
        }

        if (!wrapNode.isPresentation()) {
            if (wrapNode.mayHaveAlt()) {
                var alt = wrapNode.getAttribute('alt');
                if (alt) {
                    return alt;
                }
            }

            var label = TAG_LABEL_TAG[wrapNode.tag],
                content;

            if (label) {
                content = wrapNode.getTextContentFromDirectChild(label);
                if (content) {
                    return content;
                }
            }

            var id = wrapNode.getAttribute('id');
            if (id) {
                var elems = wrapNode.getElementsByTagName('label');
                elems = toArray.call(elems).filter(function(label) {
                    return label.getAttribute('for') === id;
                });
                if (elems.length) {
                    n = new WrapNode(elems[0], wrapNode.ctx);
                    return getAccessibleName(n, recurse);
                }
            }
        }
    }

    if (wrapNode.mayAccessibleNameFromContents()) {
        node = wrapNode.node.firstChild;
        name = [];
        while (node) {
            switch (node.nodeType) {
                case 1:
                    n = new WrapNode(node, wrapNode.ctx).findRoleData();
                    if (!n.isEmbeddedControl()) {
                        value = getAccessibleName(n, recurse);
                    } else if (n.roleData.valuetext) {
                        value = n.roleData.valuetext;
                    } else if (typeof n.roleData.valuenow !== 'undefined') {
                        value = n.roleData.valuenow;
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

        if (name.length) {
            return name.join(' ');
        }
    }

    var title = wrapNode.getAttribute('title');
    if (title) {
        return title;
    }

    if (wrapNode.mayHaveHref()) {
        var href = wrapNode.getAttribute('href');
        if (href) {
            return href;
        }
    }

    return '';
}

function getAccessibleName(wrapNode, recurse) {
    var nameAttr = 'data-name-' + wrapNode.ctx.expando,
        name = wrapNode.getAttribute(nameAttr);
    if (name) {
        return name;
    }

    name = getFromNode(wrapNode.findRoleData(), recurse);
    wrapNode.setAttribute(nameAttr, name);

    return name;
}

exports.get = getAccessibleName;
