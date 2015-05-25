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

exports.extend = function(obj, src) {
    var props = Object.keys(src),
        length = props.length,
        i = -1,
        key;

    while (++i < length) {
        key = props[i];
        obj[key] = src[key];
    }

    return obj;
};

exports.isString = function(val) {
    return typeof val === 'string' ||
           val && typeof val === 'object' &&
           Object.prototype.toString.call(val) === '[object String]';
};

exports.isFunction = function(val) {
    return typeof val === 'function';
};

exports.toArray = Array.prototype.slice;

var flatten = exports.flatten = function(array) {
    var i = -1,
        length = array.length,
        res = [];

    while (++i < length) {
        var value = array[i];

        if (Array.isArray(value)) {
            value = flatten(value);
            var valIdx = -1,
                valLength = value.length,
                resIdx = res.length;

            res.length += valLength;
            while (++valIdx < valLength) {
                res[resIdx++] = value[valIdx];
            }
        } else {
            res.push(value);
        }
    }

    return res;
};

exports.capitalize = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
