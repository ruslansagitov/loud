/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2022 Ruslan Sagitov
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
/* eslint-disable no-prototype-builtins */
'use strict';

exports.isFunction = function isFunction(val) {
    return typeof val === 'function';
};

exports.toArray = Array.prototype.slice;

exports.flatten = function flatten(array) {
    let i = -1,
        length = array.length,
        res = [];

    while (++i < length) {
        let value = array[i];

        if (Array.isArray(value)) {
            value = flatten(value);
            let valIdx = -1,
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

exports.capitalize = function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

exports.forEach = function forEach(items, func) {
    for (let i = 0; i < items.length; i++) {
        func(items[i]);
    }
};
