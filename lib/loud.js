/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2016 Ruslan Sagitov
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

var getWordsFromRole = require('./words-from-role'),
    getWordsFromAttributes = require('./words-from-attributes'),
    getAccessibleName = require('./accessible-name'),
    A11yNode = require('./a11y-node'),
    UTIL = require('./util');

var flatten = UTIL.flatten;

function Loud() {
    var settings = module.exports;
    this.warn = settings.warn;
    this.forceValidMarkup = settings.FORCE_VALID_MARKUP;
    return this;
}

Loud.prototype.say = function(node) {
    if (!node || !node.length || node.nodeType === 3) {
        node = [node];
    }

    var res = [],
        val;

    for (var i = 0; i < node.length; i++) {
        if (!node[i]) {
            continue;
        }

        this.elementById = {};

        this.root = new A11yNode(node[i], this);
        this.root
            .parse()
            .setIds(this)
            .setRole(this)
            .fixRole(this);

        val = this.handleNode(this.root);
        if (val) {
            res.push(val);
        }

        this.root.free();
        delete this.root;
        delete this.elementById;
    }

    return flatten(res);
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
    if (node.nodeType === 3) {
        return node.nodeValue.trim();
    }

    if (node.hidden) {
        return '';
    }

    return this.getWordsFromRole(node);
};

Loud.prototype.getAccessibleName = getAccessibleName;
Loud.prototype.getWordsFromRole = getWordsFromRole;
Loud.prototype.getWordsFromAttributes = getWordsFromAttributes;

function LoudValidationError(message) {
    this.message = message;
}
LoudValidationError.prototype = Object.create(Error.prototype);
LoudValidationError.prototype.constructor = LoudValidationError;
LoudValidationError.prototype.name = 'LoudValidationError';

module.exports = {
    /**
     * @type {String}
     * @readonly
     */
    VERSION: '0.8.5',

    /**
     * Force markup to be valid.
     *
     * Set to false, to handle invalid markup as valid.
     *
     * @type {Boolean}
     * @default true
     * @since 0.9.0
     */
    FORCE_VALID_MARKUP: true,

    /**
     * Validation error.
     *
     * @param {String} message - Error message
     * @since 0.9.0
     */
    ValidationError: LoudValidationError,

    /**
     * Throw validation error.
     *
     * @param {String} message - Error message
     * @throws {loud.ValidationError}
     * @since 0.9.0
     */
    error: function(message) {
        throw new LoudValidationError(message);
    },

    /**
     * Warn about failed validation.
     *
     * @param {String} message - Error message
     * @since 0.9.0
     */
    warn: function() {},

    /**
     * Transform a DOM element to words.
     *
     * @param {Object|Object[]} node - DOM element or array of
     *                                 DOM elements
     * @returns {String[]} Words
     */
    say: function(node) {
        return (new Loud()).say(node);
    }
};
