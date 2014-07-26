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

var ACCESSIBLE_NAME = require('./accessible-name');

var getAccessibleName = ACCESSIBLE_NAME.get;

function pushStates(result, wrapNode) {
    if (typeof wrapNode.checked !== 'undefined') {
        result.push(wrapNode.checked === 'mixed' ? 'mixed' :
                    wrapNode.checked ? 'checked' : 'not checked');
    }

    if (wrapNode.expanded === 'true') {
        result.push('expanded');
    } else if (wrapNode.expanded === 'false') {
        result.push('collapsed');
    }

    if (wrapNode.pressed === 'true') {
        result.push('pressed');
    } else if (wrapNode.pressed === 'false') {
        result.push('not pressed');
    }

    if (wrapNode.selected) {
        result.push('selected');
    }

    if (wrapNode.grabbed === 'true') {
        result.push('grabbed');
    } else if (wrapNode.grabbed === 'false') {
        result.push('can be grabbed');
    }

    if (wrapNode.busy) {
        result.push('busy');
    }
}

function pushProperties(result, wrapNode) {
    if (wrapNode.required) {
        result.push('required');
    }

    if (wrapNode.readonly) {
        result.push('readonly');
    }

    if (wrapNode.multiselectable) {
        result.push('multiselectable');
    }

    if (wrapNode.haspopup) {
        result.push('haspopup');
    }

    if (wrapNode.autocomplete && wrapNode.autocomplete !== 'none') {
        result.push('autocomplete', wrapNode.autocomplete);
    }
}

function pushActiveDescendant(result, wrapNode) {
    if (wrapNode.activedescendant) {
        var elem = wrapNode.ctx.getElementById(wrapNode.activedescendant);
        if (elem) {
            var name = getAccessibleName(elem);
            if (name) {
                result.push(name);
            }
        }
    }
}

function pushDescribedBy(result, wrapNode) {
    if (wrapNode.describedby) {
        var desc = wrapNode.describedby.split(/\s+/).map(function(id) {
            var elem = wrapNode.ctx.getElementById(id);
            if (elem) {
                return elem.textContent;
            }
        }).filter(function(str) {
            return str;
        });

        if (desc.length) {
            result.push(desc.join(' '));
        }
    }
}

function getAttrs(wrapNode) {
    var result = [],
        ids;

    if (wrapNode.posinset && wrapNode.setsize) {
        result.push(wrapNode.posinset, 'of', wrapNode.setsize);
    }

    if (wrapNode.invalid) {
        result.push('invalid');
    }

    if (wrapNode.disabled) {
        result.push('disabled');
    }

    if (wrapNode.level) {
        result.push('level', wrapNode.level);
    }

    if (wrapNode.sort && wrapNode.sort !== 'none') {
        result.push(wrapNode.sort, 'sort order');
    }

    pushStates(result, wrapNode);
    pushProperties(result, wrapNode);

    pushActiveDescendant(result, wrapNode);

    [
        'controls',
        'flowto'
    ].forEach(function(item) {
        if (wrapNode[item]) {
            ids = wrapNode[item].split(/\s+/).map(function(id) {
                return wrapNode.ctx.getElementById(id) ? id : '';
            }).filter(function(str) {
                return str;
            });

            if (ids.length) {
                result.push(item, ids);
            }
        }
    });

    pushDescribedBy(result, wrapNode);

    return result;
}

exports.get = getAttrs;
