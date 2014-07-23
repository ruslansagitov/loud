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

var ACCESSIBLE_NAME = require('./accessible-name'),
    WrapNode = require('./wrap-node');

var getAccessibleName = ACCESSIBLE_NAME.get;

function pushStates(result, wrapNode) {
    var roleData = wrapNode.roleData;

    if (typeof roleData.checked !== 'undefined') {
        result.push(roleData.checked === 'mixed' ? 'mixed' :
                    roleData.checked ? 'checked' : 'not checked');
    }

    if (roleData.expanded === 'true') {
        result.push('expanded');
    } else if (roleData.expanded === 'false') {
        result.push('collapsed');
    }

    if (roleData.pressed === 'true') {
        result.push('pressed');
    } else if (roleData.pressed === 'false') {
        result.push('not pressed');
    }

    if (roleData.selected) {
        result.push('selected');
    }

    if (roleData.grabbed === 'true') {
        result.push('grabbed');
    } else if (roleData.grabbed === 'false') {
        result.push('can be grabbed');
    }

    if (roleData.busy) {
        result.push('busy');
    }
}

function pushProperties(result, wrapNode) {
    var roleData = wrapNode.roleData;

    if (roleData.required) {
        result.push('required');
    }

    if (roleData.readonly) {
        result.push('readonly');
    }

    if (roleData.multiselectable) {
        result.push('multiselectable');
    }

    if (roleData.haspopup) {
        result.push('haspopup');
    }

    if (roleData.autocomplete && roleData.autocomplete !== 'none') {
        result.push('autocomplete', roleData.autocomplete);
    }
}

function pushActiveDescendant(result, wrapNode) {
    var roleData = wrapNode.roleData;

    if (roleData.activedescendant) {
        var elem = wrapNode.getElementById(roleData.activedescendant);
        if (elem) {
            elem = new WrapNode(elem, wrapNode.ctx);
            var name = getAccessibleName(elem);
            if (name) {
                result.push(name);
            }
        }
    }
}

function pushDescribedBy(result, wrapNode) {
    var roleData = wrapNode.roleData;

    if (roleData.describedby) {
        var desc = roleData.describedby.split(/\s+/).map(function(id) {
            var elem = wrapNode.getElementById(id);
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
        roleData = wrapNode.roleData,
        ids;

    if (roleData.posinset && roleData.setsize) {
        result.push(roleData.posinset, 'of', roleData.setsize);
    }

    if (roleData.invalid) {
        result.push('invalid');
    }

    if (roleData.disabled) {
        result.push('disabled');
    }

    if (roleData.level) {
        result.push('level', roleData.level);
    }

    if (roleData.sort && roleData.sort !== 'none') {
        result.push(roleData.sort, 'sort order');
    }

    pushStates(result, wrapNode);
    pushProperties(result, wrapNode);

    pushActiveDescendant(result, wrapNode);

    [
        'controls',
        'flowto'
    ].forEach(function(item) {
        if (roleData[item]) {
            ids = roleData[item].split(/\s+/).map(function(id) {
                return wrapNode.getElementById(id) ? id : '';
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
