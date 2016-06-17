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

var pushStates = function(result, node) {
    if (typeof node.checked !== 'undefined') {
        result.push(node.checked === 'mixed' ? 'mixed' :
                    node.checked ? 'checked' : 'not checked');
    }

    if (node.expanded === true) {
        result.push('expanded');
    } else if (node.expanded === false) {
        result.push('collapsed');
    }

    if (node.pressed === true) {
        result.push('pressed');
    } else if (node.pressed === false) {
        result.push('not pressed');
    }

    if (node.selected) {
        result.push('selected');
    }

    if (node.grabbed === true) {
        result.push('grabbed');
    } else if (node.grabbed === false) {
        result.push('grabbable');
    }

    if (node.busy) {
        result.push('busy');
    }
};

var pushProperties = function(result, node) {
    if (node.required) {
        result.push('required');
    }

    if (node.readonly) {
        result.push('readonly');
    }

    if (node.multiselectable) {
        result.push('multiselectable');
    }

    if (node.haspopup) {
        result.push('haspopup');
    }

    if (node.autocomplete && node.autocomplete !== 'none') {
        result.push('autocomplete', node.autocomplete);
    }

    [
        'dropeffect'
    ].forEach(function(item) {
        if (node[item]) {
            result.push(item, node[item]);
        }
    });
};

var pushActiveDescendant = function(result, node) {
    if (node.activedescendant) {
        var elem = this.getElementById(node.activedescendant);
        if (elem) {
            var name = this.getAccessibleName(elem);
            if (name) {
                result.push(name);
            }
        }
    }
};

var pushDescribedBy = function(result, node) {
    if (node.describedby) {
        var that = this;
        var desc = node.describedby
            .split(/\s+/)
            .map(function(id) {
                var elem = that.getElementById(id);
                if (elem) {
                    return elem.textContent;
                }
            })
            .filter(function(str) {
                return str;
            });

        if (desc.length) {
            result.push(desc.join(' '));
        }
    }
};

module.exports = function(node) {
    var that = this,
        result = [],
        ids;

    if (node.posinset && node.setsize) {
        result.push(node.posinset, 'of', node.setsize);
    }

    if (node.invalid) {
        result.push('invalid');
    }

    if (node.disabled) {
        result.push('disabled');
    }

    if (node.level) {
        result.push('level', node.level);
    }

    if (node.sort && node.sort !== 'none') {
        result.push(node.sort, 'sort order');
    }

    pushStates.call(this, result, node);
    pushProperties.call(this, result, node);

    [
        'controls',
        'owns',
        'flowto'
    ].forEach(function(item) {
        if (node[item]) {
            ids = node[item]
                .split(/\s+/)
                .map(function(id) {
                    return that.getElementById(id) ? id : '';
                })
                .filter(function(str) {
                    return str;
                });

            if (ids.length) {
                result.push(item, ids);
            }
        }
    });

    pushDescribedBy.call(this, result, node);

    pushActiveDescendant.call(this, result, node);

    return result;
};
