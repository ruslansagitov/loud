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

/**
 * @module loud
 */

var WORDS_FROM_ROLE = require('./words-from-role'),
    ACCESSIBLE_NAME = require('./accessible-name'),
    A11yNode = require('./a11y-node'),
    UTIL = require('./util');

var isFunction = UTIL.isFunction,
    flatten = UTIL.flatten;

function Loud() {
    return this;
}

Loud.prototype.say = function(node) {
    this.elementById = {};

    this.root = new A11yNode(node, this);
    this.root.parse().setIds(this).setRole(this).fixRole(this);

    var result = this.handleNode(this.root);

    this.root.free();
    delete this.root;
    delete this.elementById;

    return result;
};

Loud.prototype.setElementId = function(id, node) {
    this.elementById[id] = node;
};

Loud.prototype.getElementById = function(id) {
    return this.elementById[id];
};

Loud.prototype.getElementsByTagName = function(name) {
    return this.root.getElementsByTagName(name);
};

Loud.prototype.traverse = function(node) {
    var iter = node.firstChild,
        value = [],
        val;
    for (; iter; iter = iter.nextSibling) {
        val = this.handleNode(iter);
        if (val) {
            value.push(val);
        }
    }

    return flatten(value);
};

Loud.prototype.handleNode = function(node) {
    switch (node.nodeType) {
        case 1: /* ELEMENT */
            break;
        case 3: /* TEXTNODE */
            return node.nodeValue.trim();
    }

    if (node.hidden) {
        return '';
    }

    var handler = WORDS_FROM_ROLE.getHandler(node.role);
    if (!isFunction(handler)) {
        return this.traverse(node);
    }

    var value = flatten(handler.call(this, node));

    return value.filter(function(str) {
        return str;
    });
};

Loud.prototype.getAccessibleName = ACCESSIBLE_NAME.get;

module.exports = {
    /**
     * @type {String}
     */
    VERSION: '0.7.3',

    /**
     * Transform a DOM element to words.
     *
     * @param {(Object)} node - DOM element
     * @returns {String[]} Words
     */
    say: function(node) {
        return (new Loud()).say(node);
    }
};
