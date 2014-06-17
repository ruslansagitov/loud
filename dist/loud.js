!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Loud=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

var WrapNode = _dereq_('./wrap-node'),
    UTIL = _dereq_('./util'),
    toArray = UTIL.toArray;

var getAccessibleName;

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
                return;
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

},{"./util":4,"./wrap-node":6}],2:[function(_dereq_,module,exports){
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

/**
 * @module loud
 */

var WORDS_FROM_ROLE = _dereq_('./words-from-role'),
    WrapNode = _dereq_('./wrap-node'),
    UTIL = _dereq_('./util'),
    isString = UTIL.isString,
    isFunction = UTIL.isFunction,
    flatten = UTIL.flatten,
    jsdom;

/* istanbul ignore next */
if (typeof window !== 'undefined') {
    jsdom = function jsdom(data) {
        var elem = this.document.createElement('div');
        elem.innerHTML = data;

        return elem;
    };
} else {
    jsdom = _dereq_('jsdom').jsdom;
}

/**
 * @constructor
 */
function Loud() {
    this.expando = (Math.random() + '').replace(/^0?\./, '');
    return this;
}

/**
 * @type {String}
 */
Loud.VERSION = '0.7.1';

/**
 * Transform HTML into words.
 *
 * @param {(String|Object)} data - HTML string or DOM element
 * @return {String[]} Words
 */
Loud.prototype.say = function loudSay(data) {
    var node = isString(data) ? jsdom(data) : data;

    this.doc = node.ownerDocument || node;

    return this._handleNode(new WrapNode(node, this));
};

Loud.prototype.traverse = function loudTraverse(wrapNode) {
    var iter = wrapNode.node.firstChild,
        value = [],
        val;
    while (iter) {
        val = this._handleNode(new WrapNode(iter, this));
        if (val) {
            value.push(val);
        }

        iter = iter.nextSibling;
    }

    return flatten(value);
};

Loud.prototype._handleNode = function loudHandleNode(wrapNode) {
    switch (wrapNode.nodeType) {
        case 1: /* ELEMENT */
            break;
        case 3: /* TEXTNODE */
            return wrapNode.nodeValue.trim();
        case 9: /* DOCUMENT */
            return this.traverse(wrapNode);
        default:
            return;
    }

    var roleData = wrapNode.findRoleData().roleData;
    if (!roleData || wrapNode.isPresentation()) {
        return this.traverse(wrapNode);
    }

    if (roleData.hidden) {
        return;
    }

    var handler = WORDS_FROM_ROLE.getHandler(roleData.role);
    if (!isFunction(handler)) {
        return this.traverse(wrapNode);
    }

    var value = flatten(handler.call(this, wrapNode));

    return value.filter(function(str) {
        return str;
    });
};

module.exports = Loud;

},{"./util":4,"./words-from-role":5,"./wrap-node":6,"jsdom":"HjAHqF"}],3:[function(_dereq_,module,exports){
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

var UTIL = _dereq_('./util'),
    isString = UTIL.isString,
    isFunction = UTIL.isFunction,
    extend = UTIL.extend,
    toCamelCase = UTIL.toCamelCase;

var ROLE_LOCAL_ATTRS = {
    alert: ['expanded'],
    alertdialog: ['expanded'],
    application: ['expanded'],
    article: ['expanded'],
    banner: ['expanded'],
    button: ['expanded', 'pressed'],
    checkbox: ['checked'],
    columnheader: ['expanded', 'required', 'readonly', 'selected', 'sort'],
    combobox: ['expanded', 'autocomplete', 'required'],
    complementary: ['expanded'],
    contentinfo: ['expanded'],
    definition: ['expanded'],
    dialog: ['expanded'],
    directory: ['expanded'],
    document: ['expanded'],
    form: ['expanded'],
    grid: ['expanded', 'activedescendant', 'level', 'multiselectable', 'readonly'],
    gridcell: ['expanded', 'readonly', 'required', 'selected'],
    group: ['expanded', 'activedescendant'],
    heading: ['expanded', 'level'],
    img: ['expanded'],
    link: ['expanded'],
    list: ['expanded'],
    listbox: ['expanded', 'required', 'activedescendant', 'multiselectable'],
    listitem: ['expanded', 'level', 'posinset', 'setsize'],
    log: ['expanded'],
    main: ['expanded'],
    marquee: ['expanded'],
    math: ['expanded'],
    menu: ['expanded', 'activedescendant'],
    menubar: ['expanded', 'activedescendant'],
    menuitem: [],
    menuitemcheckbox: ['checked'],
    menuitemradio: ['checked', 'posinset', 'setsize'],
    navigation: ['expanded'],
    note: ['expanded'],
    option: ['checked', 'selected', 'posinset', 'setsize'],
    progressbar: ['valuetext', 'valuenow', 'valuemin', 'valuemax'],
    radio: ['checked', 'posinset', 'setsize'],
    radiogroup: ['expanded', 'required', 'activedescendant'],
    region: ['expanded'],
    row: ['expanded', 'activedescendant', 'level', 'selected'],
    rowgroup: ['expanded', 'activedescendant'],
    rowheader: ['expanded', 'required', 'selected', 'readonly', 'sort'],
    search: ['expanded'],
    separator: ['expanded', 'orientation'],
    scrollbar: ['valuetext', 'valuenow', 'valuemin', 'valuemax', 'orientation', 'controls'],
    slider: ['valuetext', 'valuenow', 'valuemin', 'valuemax', 'orientation'],
    spinbutton: ['valuetext', 'valuenow', 'valuemin', 'valuemax', 'required'],
    status: ['expanded'],
    tab: ['expanded', 'selected'],
    tablist: ['expanded', 'level', 'multiselectable', 'activedescendant'],
    tabpanel: ['expanded'],
    textbox: ['required', 'readonly', 'activedescendant', 'autocomplete', 'multiline'],
    timer: ['expanded'],
    toolbar: ['expanded', 'activedescendant'],
    tooltip: ['expanded'],
    tree: ['expanded', 'required', 'activedescendant', 'multiselectable'],
    treegrid: ['expanded', 'required', 'readonly', 'activedescendant', 'multiselectable'],
    treeitem: ['expanded', 'selected', 'posinset', 'setsize']
};

var DEFAULT_FOR = {
    alert: {
        live: 'assertive',
        atomic: true
    },
    checkbox: {
        checked: false
    },
    combobox: {
        haspopup: true,
        expanded: 'false'
    },
    log: {
        live: 'polite'
    },
    menuitemcheckbox: {
        checked: false
    },
    menuitemradio: {
        checked: false
    },
    /*progressbar: {
        readonly: true
    },*/
    radio: {
        checked: false
    },
    scrollbar: {
        orientation: 'vertical'
    },
    status: {
        live: 'polite',
        atomic: true
    }
};

function roleToObject(roleData) {
    if (isString(roleData)) {
        return { role: roleData };
    }

    return extend({}, roleData || {});
}

function getTextboxRole(wrapNode) {
    var listId = wrapNode.getAttribute('list'),
        datalist;

    if (listId) {
        datalist = wrapNode.getElementById(listId);
    }

    if (datalist && datalist.tagName.toLowerCase() === 'datalist') {
        return {
            role: 'combobox',
            owns: listId
        };
    }

    return 'textbox';
}

function range(role) {
    return function(wrapNode) {
        return {
            role: role,
            valuenow: wrapNode.getAttribute('value'),
            valuemin: wrapNode.getAttribute('min'),
            valuemax: wrapNode.getAttribute('max')
        };
    };
}

var TAG_INPUT_GET_ROLE = {
    checkbox: 'checkbox',
    email: getTextboxRole,
    image: 'button',
    number: range('spinbutton'),
    password: { role: 'textbox', password: true },
    radio: 'radio',
    range: range('slider'),
    reset: 'button',
    search: getTextboxRole,
    submit: 'button',
    tel: getTextboxRole,
    text: getTextboxRole,
    url: getTextboxRole
};

var TAG_TO_ROLE = {
    a: 'link',
    address: 'contentinfo',
    area: 'link',
    article: 'article',
    aside: 'complementary',
    body: 'document',
    button: 'button',
    caption: function roleFromTagCaptionHandler(wrapNode) {
        if (wrapNode.hasParent('table')) {
            return {
                part: true,
                hidden: wrapNode.hasOnlyTextChilds()
            };
        }
    },
    colgroup: function roleFromTagColgroupHandler(wrapNode) {
        if (wrapNode.hasParent('table')) {
            return { part: true };
        }
    },
    datalist: { role: 'listbox', multiselectable: false },
    dialog: 'dialog',
    dd: 'listitem',
    dl: 'list',
    dt: 'listitem',
    fieldset: 'group',
    figcaption: function roleFromTagFigcaptionHandler(wrapNode) {
        if (wrapNode.hasParent('figure') &&
            wrapNode.hasOnlyTextChilds()) {
            return { hidden: true };
        }
    },
    footer: function roleFromTagFooterHandler(wrapNode) {
        if (!wrapNode.hasParent('article') &&
            !wrapNode.hasParent('section')) {
            return 'contentinfo';
        }
        return '';
    },
    h1: 'heading',
    h2: 'heading',
    h3: 'heading',
    h4: 'heading',
    h5: 'heading',
    h6: 'heading',
    header: function roleFromTagHeaderHandler(wrapNode) {
        if (!wrapNode.hasParent('article') &&
            !wrapNode.hasParent('section')) {
            return 'banner';
        }
        return '';
    },
    hr: 'separator',
    img: function roleFromTagImgHandler(wrapNode) {
        var alt = wrapNode.getAttribute('alt');
        if (alt === '') {
            return 'presentation';
        }
        return 'img';
    },
    input: function roleFromTagInputHandler(wrapNode) {
        if (wrapNode.mustNoRole()) {
            return '';
        }

        var type = wrapNode.getAttribute('type') || 'text',
            getRole = TAG_INPUT_GET_ROLE[type],
            roleData = isFunction(getRole) ?
                       getRole(wrapNode) : getRole;

        return roleToObject(roleData);
    },
    legend: function roleFromTagLegendHandler(wrapNode) {
        if (wrapNode.hasParent('fieldset') &&
            wrapNode.hasOnlyTextChilds()) {
            return { hidden: true };
        }
    },
    li: 'listitem',
    link: function roleFromTagLinkHandler(wrapNode) {
        if (wrapNode.isHyperlink()) {
            return 'link';
        }

        return '';
    },
    main: 'main',
    menu: function roleFromTagMenuHandler(wrapNode) {
        var type = wrapNode.getAttribute('type');
        return type === 'toolbar' ? 'toolbar' : 'menu';
    },
    menuitem: 'menuitem',
    nav: 'navigation',
    ol: 'list',
    optgroup: function roleFromTagOptGroupHandler(wrapNode) {
        if (wrapNode.hasParent('select')) {
            return 'group';
        }

        return '';
    },
    option: function roleFromTagOptionHandler(wrapNode) {
        return {
            role: 'option',
            selected: wrapNode.hasAttribute('selected')
        };
    },
    progress: range('progressbar'),
    section: 'region',
    select: function roleFromTagSelectHandler(wrapNode) {
        return {
            role: 'listbox',
            multiselectable: wrapNode.hasAttribute('multiple')
        };
    },
    summary: function roleFromTagSummaryHandler(wrapNode) {
        if (wrapNode.hasParent('details') &&
            wrapNode.hasOnlyTextChilds()) {
            return { hidden: true };
        }
    },
    table: { role: 'grid', table: true },
    tbody: 'rowgroup',
    td: 'gridcell',
    textarea: { role: 'textbox', multiline: true },
    tfoot: 'rowgroup',
    th: function roleFromTagThHandler(wrapNode) {
        if (wrapNode.getAttribute('scope') === 'row') {
            return 'rowheader';
        }

        return 'columnheader';
    },
    thead: 'rowgroup',
    tr: 'row',
    ul: { role: 'list', numbered: true }
};

function setGlobalAttrs(roleData, wrapNode) {
    extend(roleData, {
        describedby: wrapNode.getAttribute('aria-describedby'),

        controls: wrapNode.getAttribute('aria-controls'),
        owns: wrapNode.getAttribute('aria-owns'),
        flowto: wrapNode.getAttribute('aria-flowto'),
        haspopup: wrapNode.getAttribute('aria-haspopup') === 'true',
        dropeffect: wrapNode.getDropeffect(),
        grabbed: wrapNode.getAttribute('aria-grabbed'),

        busy: wrapNode.getAttribute('aria-busy') === 'true',
        atomic: wrapNode.getAttribute('aria-atomic') === 'true',
        live: wrapNode.getLive(),
        relevant: wrapNode.getRelevant(),

        disabled: wrapNode.isDisabled(),
        hidden: roleData.hidden || wrapNode.isHidden(),
        invalid: wrapNode.isInvalid()
    });
}

function setLocalAttrs(roleData, wrapNode) {
    var role = roleData.role,
        attrs = ROLE_LOCAL_ATTRS[role] || [];

    attrs.forEach(function(attr) {
        if (typeof roleData[attr] !== 'undefined') {
            return;
        }

        var funcName = toCamelCase('get-' + attr),
            value;
        if (isFunction(wrapNode[funcName])) {
            value = wrapNode[funcName]();
            roleData[attr] = value;
        } else {
            if (wrapNode.hasAttribute('aria-' + attr)) {
                roleData[attr] = wrapNode.getAttribute('aria-' + attr);
            }
        }
    });
}

function setDefaults(roleData) {
    var role = roleData.role,
        data = DEFAULT_FOR[role];

    if (!data) {
        return;
    }

    Object.keys(data).forEach(function(key) {
        if (roleData[key]) {
            return;
        }

        roleData[key] = data[key];
    });
}

function getRoleFromTag(wrapNode) {
    var getRole = TAG_TO_ROLE[wrapNode.tag] || '',
        roleAttr = 'data-role-' + wrapNode.ctx.expando,
        roleData, role;

    roleData = isFunction(getRole) ? getRole(wrapNode) : getRole;
    roleData = roleToObject(roleData);

    if (!wrapNode.mustNoRole()) {
        role = wrapNode.getRoleFromAttr();
        if (role === 'presentation') {
            if (wrapNode.mayBePresentation()) {
                roleData.role = role;
            }
        } else if (role) {
            if (!wrapNode.isStrongRole()) {
                if (wrapNode.mayTransitionToRole(role)) {
                    roleData.role = role;
                }
            }
        }
    }

    role = roleData.role;
    if (role && role !== 'presentation') {
        wrapNode.setAttribute(roleAttr, role);

        if (!wrapNode.ownsValidRolesFor(role) ||
            !wrapNode.ownedByValidRolesFor(role)) {
            roleData.role = '';
            wrapNode.removeAttribute(roleAttr);
        }

        setGlobalAttrs(roleData, wrapNode);
        setLocalAttrs(roleData, wrapNode);
        setDefaults(roleData);
    }

    return roleData;
}

exports.get = getRoleFromTag;

},{"./util":4}],4:[function(_dereq_,module,exports){
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

exports.extend = function extend(obj, src) {
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

exports.isString = function isString(val) {
    return typeof val === 'string' ||
           val && typeof val === 'object' &&
           Object.prototype.toString.call(val) === '[object String]';
};

exports.isFunction = function isFunction(val) {
    return typeof val === 'function';
};

exports.toArray = Array.prototype.slice;

exports.flatten = function flatten(array) {
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

exports.toCamelCase = function(str) {
    return str.replace(/-([a-z])/g, function(m) {
        return m[1].toUpperCase();
    });
};

},{}],5:[function(_dereq_,module,exports){
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

var ACCESSIBLE_NAME = _dereq_('./accessible-name'),
    getAccessibleName = ACCESSIBLE_NAME.get,
    WrapNode = _dereq_('./wrap-node');

var ROLE_USE_PROCENT = [
    'progressbar', 'scrollbar'
];

function getAttrs(wrapNode) {
    var result = [],
        roleData = wrapNode.roleData,
        elem, name, ids;

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

    if (roleData.activedescendant) {
        elem = wrapNode.getElementById(roleData.activedescendant);
        if (elem) {
            elem = new WrapNode(elem, wrapNode.ctx);
            name = getAccessibleName(elem);
            if (name) {
                result.push(name);
            }
        }
    }

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

    if (roleData.describedby) {
        name = roleData.describedby.split(/\s+/).map(function(id) {
            var elem = wrapNode.getElementById(id);
            if (elem) {
                return elem.textContent;
            }

            return '';
        }).filter(function(str) {
            return str;
        });

        if (name.length) {
            result.push(name.join(' '));
        }
    }

    return result;
}

var deep = function wordsFromRoleDeep(roleName) {
    return function wordsFromRoleDeepHandler(wrapNode) {
        return [
            getAccessibleName(wrapNode),
            roleName,
            getAttrs(wrapNode),
            this.traverse(wrapNode)
        ];
    };
};

var flat = function wordsFromRoleFlat(roleName) {
    return function wordsFromRoleFlatHandler(wrapNode) {
        return [
            getAccessibleName(wrapNode),
            roleName,
            getAttrs(wrapNode)
        ];
    };
};

var range = function wordsFromRoleRange(roleName) {
    return function wordsFromRoleRangeHandler(wrapNode) {
        var roleData = wrapNode.roleData,
            role = roleData.role,
            valuetext = roleData.valuetext,
            valuenow = roleData.valuenow,
            valuemin = roleData.valuemin,
            valuemax = roleData.valuemax,
            value = roleData.value || '',
            orientation = roleData.orientation;

        if (valuetext) {
            value = valuetext;
        } else if (valuenow && valuemin && valuemax) {
            valuenow = parseInt(valuenow, 10);
            valuemin = parseInt(valuemin, 10);
            valuemax = parseInt(valuemax, 10);

            if (ROLE_USE_PROCENT.indexOf(role) !== -1) {
                if (valuemin < valuemax &&
                    value >= valuemin && value <= valuemax) {
                    value = valuenow / (valuemax - valuemin) * 100;
                    value = [Math.round(value), 'percent'];
                } else {
                    value = valuenow;
                }
            } else {
                value = valuenow;
            }
        } else if (valuenow) {
            value = parseInt(valuenow, 10);
        }

        return [
            getAccessibleName(wrapNode),
            orientation && orientation !== 'none' ? orientation : '',
            roleName,
            value,
            getAttrs(wrapNode)
        ];
    };
};

var region = function wordsFromRoleRegion(before, after) {
    return function wordsFromRoleRegionHandler(wrapNode) {
        if (wrapNode.isEmpty()) {
            return [];
        }

        var name = getAccessibleName(wrapNode);

        return [
            name, before,
            getAttrs(wrapNode),
            this.traverse(wrapNode),
            after
        ];
    };
};

var HANDLERS = {
    alert: region('alert', 'alert end'),
    alertdialog: region('alertdialog', 'alertdialog end'),
    application: region('application', 'application end'),
    article: region('article', 'article end'),
    banner: region('banner', 'banner end'),
    button: function wordsFromRoleButtonHandler(wrapNode) {
        var roleData = wrapNode.roleData;

        return [
            getAccessibleName(wrapNode),
            (roleData.expanded === 'true' ||
             roleData.expanded === 'false' ?
                'button menu' :
                (roleData.pressed === 'true' ||
                 roleData.pressed === 'false' ?
                    'toggle button' : 'button')),
            getAttrs(wrapNode)
        ];
    },
    checkbox: flat('checkbox'),
    columnheader: flat('columnheader'),
    combobox: deep('combobox'),
    complementary: region('complementary', 'complementary end'),
    contentinfo: region('contentinfo', 'contentinfo end'),
    definition: region('definition', 'definition end'),
    dialog: region('dialog', 'dialog end'),
    directory: region('directory', 'directory end'),
    document: region('document', 'document end'),
    group: region('group', 'group end'),
    grid: function wordsFromRoleGridHandler(wrapNode) {
        var roleData = wrapNode.roleData,
            table = roleData.table;
        return [
            getAccessibleName(wrapNode),
            table ? 'table' : 'grid',
            getAttrs(wrapNode),
            this.traverse(wrapNode),
            table ? 'table end' : 'grid end'
        ];
    },
    gridcell: flat('gridcell'),
    form: region('form', 'form end'),
    heading: flat('heading'),
    img: flat('img'),
    link: flat('link'),
    list: region('list', 'list end'),
    listbox: deep('listbox'),
    listitem: flat('listitem'),
    log: region('log', 'log end'),
    marquee: region('marquee', 'marquee end'),
    main: region('main', 'main end'),
    math: flat('math'),
    menu: deep('menu'),
    menubar: deep('menubar'),
    menuitem: flat('menuitem'),
    menuitemcheckbox: flat('menuitemcheckbox'),
    menuitemradio: flat('menuitemradio'),
    navigation: region('navigation', 'navigation end'),
    note: region('note', 'note end'),
    region: region('region', 'region end'),
    option: flat('option'),
    progressbar: range('progressbar'),
    radio: flat('radio'),
    radiogroup: deep('radiogroup'),
    row: deep('row'),
    rowgroup: deep('rowgroup'),
    rowheader: flat('rowheader'),
    search: region('search', 'search end'),
    separator: function wordsFromRoleSeparator(wrapNode) {
        var roleData = wrapNode.roleData,
            orientation = roleData.orientation;
        return [
            orientation && orientation !== 'none' ? orientation : '',
            'separator',
            getAttrs(wrapNode)
        ];
    },
    scrollbar: range('scrollbar'),
    slider: range('slider'),
    spinbutton: range('spinbutton'),
    status: region('status', 'status end'),
    tab: flat('tab'),
    tablist: deep('tablist'),
    tabpanel: region('tabpanel', 'tabpanel end'),
    textbox: function wordsFromRoleLinkHandler(wrapNode) {
        var roleData = wrapNode.roleData,
            multiline = roleData.multiline,
            password = roleData.password;
        return [
            getAccessibleName(wrapNode),
            multiline ? 'multiline' : '',
            password ? 'password' : '',
            'textbox',
            getAttrs(wrapNode),
            this.traverse(wrapNode)
        ];
    },
    timer: region('timer', 'timer end'),
    toolbar: region('toolbar', 'toolbar end'),
    tooltip: flat('tooltip'),
    tree: deep('tree'),
    treegrid: region('treegrid', 'treegrid end'),
    treeitem: flat('treeitem')
};

function getWordsFromRoleHandler(role) {
    return HANDLERS[role];
}

exports.getHandler = getWordsFromRoleHandler;

},{"./accessible-name":1,"./wrap-node":6}],6:[function(_dereq_,module,exports){
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

var ROLE_FROM_TAG = _dereq_('./role-from-tag'),
    UTIL = _dereq_('./util'),
    extend = UTIL.extend,
    toArray = UTIL.toArray,
    toCamelCase = UTIL.toCamelCase;

var TAG_NO_ROLE = [
    'base', 'head', 'html', 'keygen', 'label', 'meta', 'meter',
    'noscript', 'optgroup', 'param', 'script', 'source', 'style',
    'template', 'title'
];

var TAG_STRONG_ROLE = [
    'area', 'datalist', 'fieldset', 'footer'
];

var TAG_CAN_BE_PRESENTATION = [
    'aside', 'fieldset', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'header', 'hr', 'iframe', 'li', 'main', 'menu', 'nav', 'object',
    'ol', 'ul',
    'div', 'span'
];

var TAG_NO_CLOSING = [
    'input', 'img', 'hr', 'progress'
];

var INPUT_TYPE_NO_ROLE = [
    'color', 'date', 'datetime', 'file', 'hidden', 'month', 'time',
    'week'
];

var TAG_TO_ROLE_RESTRICTIONS = {
    address: [
        'contentinfo'
    ],
    a: [
        'link', 'button', 'checkbox', 'menuitem', 'menuitemcheckbox',
        'menuitemradio', 'tab', 'treeitem'
    ],
    article: [
        'article', 'document', 'application', 'main'
    ],
    aside: [
        'complementary', 'note', 'search'
    ],
    audio: [
        'application'
    ],
    body: [
        'application'
    ],
    button: [
        'button', 'link', 'menuitem', 'menuitemcheckbox',
        'menuitemradio', 'radio'
    ],
    embed: [
        'application', 'document', 'img'
    ],
    h1: [
        'heading', 'tab'
    ],
    h2: [
        'heading', 'tab'
    ],
    h3: [
        'heading', 'tab'
    ],
    h4: [
        'heading', 'tab'
    ],
    h5: [
        'heading', 'tab'
    ],
    h6: [
        'heading', 'tab'
    ],
    iframe: [
        'application', 'document', 'img'
    ],
    li: [
        'listitem', 'menuitem', 'menuitemcheckbox', 'menuitemradio',
        'option', 'tab', 'treeitem'
    ],
    menu: [
        'directory', 'list', 'listbox', 'menu', 'menubar', 'tablist',
        'toolbar', 'tree'
    ],
    object: [
        'application', 'document', 'img'
    ],
    ol: [
        'directory', 'list', 'listbox', 'menu', 'menubar', 'tablist',
        'toolbar', 'tree'
    ],
    ul: [
        'directory', 'group', 'list', 'listbox', 'menu', 'menubar',
        'tablist', 'toolbar', 'tree'
    ],
    video: [
        'application'
    ]
};

var ROLE_CONTEXT = {
    columnheader: ['row'],
    gridcell: ['row'],
    listitem: ['group', 'list'],
    menuitem: ['group', 'menu', 'menubar'],
    menuitemcheckbox: ['menu', 'menubar'],
    menuitemradio: ['group', 'menu', 'menubar'],
    option: ['listbox', 'group'],
    row: ['table', 'grid', 'rowgroup', 'treegrid'],
    rowgroup: ['table', 'grid'],
    rowheader: ['row'],
    tab: ['tablist'],
    treeitem: ['group', 'tree']
};

var ROLE_GROUP_CONTEXT = {
    group: {
        listitem: ['list'],
        menuitem: ['menu'],
        treeitem: ['tree']
    },
    rowgroup: {
        row: ['grid']
    }
};

var ROLE_DESCENDANTS = {
    /*combobox: {
        listbox: true,
        textbox: true
    },*/
    grid: {
        row: true,
        rowgroup: {
            row: true
        }
    },
    list: {
        group: {
            listitem: true
        },
        listitem: true
    },
    listbox: {
        group: {
            option: true
        },
        option: true
    },
    menu: {
        group: {
            menuitemradio: true
        },
        menuitem: true,
        menuitemcheckbox: true,
        menuitemradio: true
    },
    radiogroup: {
        radio: true
    },
    row: {
        columnheader: true,
        gridcell: true,
        rowheader: true
    },
    rowgroup: {
        row: true
    },
    table: {
        row: true,
        rowgroup: {
            row: true
        }
    },
    tablist: {
        tab: true
    },
    tree: {
        group: {
            treeitem: true
        },
        treeitem: true
    },
    treegrid: {
        row: true
    }
};

var ROLE_INLINE_VALUE = [
    'textbox', 'combobox', 'menuitem', 'listbox', 'slider'
];

var TAG_HAS_ALT = [
    'applet', 'area', 'img', 'input'
];

var TAG_HAS_HREF = [
    'a', 'link'
];

var HYPERLINK_TYPES = [
    'alternative', 'author', 'help', 'license', 'next', 'prev', 'search'
];

var ACCESSIBLE_NAME_FROM_CONTENTS = [
    'button', 'checkbox', 'columnheader', /*'directory',*/ 'gridcell',
    'heading', 'link', 'listitem', 'menuitem', 'menuitemcheckbox',
    'menuitemradio', 'option', 'radio', /*'row', 'rowgroup',*/
    'rowheader', 'tab', 'tooltip', 'treeitem',
    'presentation'
];

var ABSTRACT_ROLES = [
    'command', 'composite', 'input', 'landmark', 'range', 'roletype',
    'section', 'sectionhead', 'select', 'structure', 'widget', 'window'
];

var ATTR_VALUES = {
    autocomplete: ['inline', 'list', 'both', 'none'],
    orientation: ['vertical', 'horizontal', 'none'],
    sort: ['ascending', 'descending', 'none', 'other'],
    dropeffect: ['copy', 'move', 'link', 'execute', 'popup', 'none'],
    live: ['off', 'polite', 'assertive'],
    relevant: ['additions', 'removals', 'text', 'all']
};

var TAG_HEADING_LEVEL = {
    h1: 1,
    h2: 2,
    h3: 3,
    h4: 4,
    h5: 5,
    h6: 6
};

function WrapNode(node, ctx) {
    this.node = node;
    this.ctx = ctx;

    this.nodeType = node.nodeType;
    this.nodeValue = node.nodeValue;
    this.tag = node.nodeName.toLowerCase();

    this.roleData = null;

    return this;
}

WrapNode.prototype.findRoleData = function wrapNodeFindRoleData() {
    if (!this.roleData) {
        this.roleData = ROLE_FROM_TAG.get(this);
    }
    return this;
};

/* proxy */
extend(WrapNode.prototype, {
    hasAttribute: function wrapNodeHasAttribute() {
        return this.node.hasAttribute.apply(this.node, arguments);
    },

    getAttribute: function wrapNodeGetAttribute() {
        return this.node.getAttribute.apply(this.node, arguments);
    },

    setAttribute: function wrapNodeSetAttribute() {
        return this.node.setAttribute.apply(this.node, arguments);
    },

    removeAttribute: function wrapNodeRemoveAttribute() {
        return this.node.removeAttribute.apply(this.node, arguments);
    },

    getElementById: function wrapNodeGetElementById() {
        return this.ctx.doc.getElementById.apply(this.ctx.doc, arguments);
    },

    getElementsByTagName: function wrapNodeGetElementsByTagName() {
        return this.ctx.doc.getElementsByTagName.apply(this.ctx.doc, arguments);
    }
});

/* utils */
extend(WrapNode.prototype, {
    isEmbeddedControl: function() {
        return ROLE_INLINE_VALUE.indexOf(this.roleData.role) !== -1;
    },

    isHyperlink: function wrapNodeIsHyperlinkType() {
        var rel = this.getAttribute('rel') || '';
        rel = rel.toLowerCase();
        return HYPERLINK_TYPES.indexOf(rel) !== -1;
    },

    isNodeNonEmpty: function(node) {
        var name, wrapNode;
        node = node.firstChild;
        for (; node; node = node.nextSibling) {
            if (node.nodeType === 1) {
                wrapNode = new WrapNode(node, this.ctx);
                wrapNode.findRoleData();
                if (wrapNode.roleData.hidden) {
                    continue;
                }

                name = node.nodeName.toLowerCase();
                if (TAG_NO_CLOSING.indexOf(name) !== -1) {
                    return true;
                }

                if (this.isNodeNonEmpty(node)) {
                    return true;
                }
            } else if (node.nodeType === 3 &&
                       node.nodeValue !== '') {
                return true;
            }
        }

        return false;
    },

    isEmpty: function wrapNodeIsEmpty() {
        return !this.isNodeNonEmpty(this.node);
    },

    isPresentation: function wrapNodeIsPresentation() {
        return this.roleData.role === 'presentation';
    },

    isStrongRole: function wrapNodeIsStrongRole() {
        return TAG_STRONG_ROLE.indexOf(this.tag) !== -1;
    },

    hasParent: function wrapNodeHasParent(parentName) {
        var node = this.node.parentNode;
        parentName = parentName.toLowerCase();
        while (node) {
            if (node.nodeType !== 1) {
                break;
            }

            if (node.nodeName.toLowerCase() === parentName) {
                return new WrapNode(node, this.ctx);
            }

            node = node.parentNode;
        }

        return false;
    },

    mustNoRole: function wrapNodeMustNoRole() {
        if (this.tag === 'input') {
            var type = this.getAttribute('type') || 'text';
            type = type.toLowerCase();
            return INPUT_TYPE_NO_ROLE.indexOf(type) !== -1;
        }
        return TAG_NO_ROLE.indexOf(this.tag) !== -1;
    },

    mayBePresentation: function wrapNodeMayBePresentation() {
        return TAG_CAN_BE_PRESENTATION.indexOf(this.tag) !== -1;
    },

    mayTransitionToRole: function wrapNodeMayTransitionToRole(role) {
        var allowed = TAG_TO_ROLE_RESTRICTIONS[this.tag];
        if (!allowed) {
            return true;
        }
        return allowed && allowed.indexOf(role) !== -1;
    },

    mayAccessibleNameFromContents: function wrapNodeMayAccessibleNameFromContents() {
        var role = this.roleData.role;
        return (!role ||
                ACCESSIBLE_NAME_FROM_CONTENTS.indexOf(role) !== -1);
    },

    mayHaveAlt: function wrapNodeHasAlt() {
        return TAG_HAS_ALT.indexOf(this.tag) !== -1;
    },

    mayHaveHref: function wrapNodeHasHref() {
        return TAG_HAS_HREF.indexOf(this.tag) !== -1;
    },

    getRoleFromAttr: function() {
        var roles = this.getAttribute('role');
        if (!roles) {
            return '';
        }

        return roles.split(/\s+/).filter(function(role) {
            return ABSTRACT_ROLES.indexOf(role) === -1;
        }).filter(function(str) {
            return str;
        }).shift();
    },

    hasOnlyTextChilds: function() {
        var node = this.node.firstChild;
        while (node) {
            if (node.nodeType !== 3) {
                return false;
            }

            node = node.nextSibling;
        }

        return true;
    },

    getTextContentFromDirectChild: function(childName) {
        var node = this.node.firstChild,
            iter;
        childName = childName.toLowerCase();
        for (; node; node = node.nextSibling) {
            if (node.nodeType !== 1) {
                continue;
            }

            if (node.nodeName.toLowerCase() === childName) {
                iter = node.firstChild;
                while (iter) {
                    if (iter.nodeType !== 3) {
                        return '';
                    }
                    iter = iter.nextSibling;
                }

                return node.textContent;
            }
        }
    }
});

/* relationship */
extend(WrapNode.prototype, {
    ownedByValidRolesFor: function wrapNodeOwnedByRoles(role) {
        var context = ROLE_CONTEXT[role];
        if (!context) {
            return true;
        }

        if (!this.node.parentNode ||
            this.node.parentNode.nodeType !== 1) {
            return false;
        }

        var node = this.node.parentNode,
            roleAttr = 'data-role-' + this.ctx.expando,
            parentRole;
        while (node) {
            if (node.nodeType !== 1) {
                break;
            }

            if (node.hasAttribute(roleAttr)) {
                parentRole = node.getAttribute(roleAttr);
                if (context.indexOf(parentRole) !== -1) {
                    context = ROLE_GROUP_CONTEXT[parentRole];
                    if (!context) {
                        return true;
                    }

                    context = context[role];
                    if (!context) {
                        return true;
                    }
                } else {
                    break;
                }
            }

            node = node.parentNode;
        }

        return false;
    },

    ownsValidRolesFor: function wrapNodeOwnsRoles(role) {
        var limits = ROLE_DESCENDANTS[role];
        if (!limits) {
            return true;
        }

        return this.isDescendantsValid(limits);
    },

    isDescendantsValid: function wrapNodeIsDescendantsValid(limits) {
        var node = this.node.firstChild,
            nodeCount = 0,
            wrapNode, role, lim;
        while (node) {
            if (node.nodeType !== 1) {
                return false;
            }

            wrapNode = new WrapNode(node, this.ctx);
            wrapNode.findRoleData();

            if (!wrapNode.roleData.part) {
                role = wrapNode.roleData.role;
                if (!role || role === 'presentation') {
                    if (!wrapNode.isEmpty() &&
                        !wrapNode.isDescendantsValid(limits)) {
                        return false;
                    }
                } else {
                    lim = limits[role];
                    if (!lim) {
                        return false;
                    }

                    if (lim !== true) {
                        if (!wrapNode.isDescendantsValid(lim)) {
                            return false;
                        }
                    }
                }
            }

            nodeCount++;
            node = node.nextSibling;
        }

        return nodeCount !== 0;
    }
});

/* attributes */
[
    'autocomplete',
    'orientation',
    'sort',
    'dropeffect',
    'live',
    'relevant'
].forEach(function(item) {
    var funcName = toCamelCase('get-' + item);

    WrapNode.prototype[funcName] = function() {
        var data = this.getAttribute('aria-' + item);
        if (data) {
            data = data.toLowerCase();
            if (ATTR_VALUES[item].indexOf(data) !== -1) {
                return data;
            }
        }
    };
});

[
    'selected',
    'grabbed',
    'busy',
    'haspopup'
].forEach(function(item) {
    var funcName = toCamelCase('get-' + item);

    WrapNode.prototype[funcName] = function() {
        if (this.hasAttribute('aria-' + item)) {
            return this.getAttribute('aria-' + item) === 'true';
        }
    };
});

extend(WrapNode.prototype, {
    getExpanded: function() {
        if (this.hasAttribute('aria-expanded')) {
            return this.getAttribute('aria-expanded');
        }
    },

    getPressed: function() {
        if (this.hasAttribute('aria-pressed')) {
            return this.getAttribute('aria-pressed');
        }
    },

    getChecked: function() {
        /* Firefox defines node.checked on <menuitem>. */
        if (this.tag === 'menuitem') {
            return;
        }

        if (this.tag === 'input' &&
            this.getAttribute('type') === 'checkbox' &&
            this.node.indeterminate) {
            return 'mixed';
        }

        if (this.hasAttribute('aria-checked')) {
            return this.getAttribute('aria-checked') === 'true';
        }

        return this.node.checked;
    },

    getReadonly: function() {
        return (this.hasAttribute('readonly') ||
                this.getAttribute('aria-readonly') === 'true');
    },

    getRequired: function() {
        return this.hasAttribute('required') ||
               this.getAttribute('aria-required') === 'true';
    },

    getMultiselectable: function() {
        return this.hasAttribute('multiple') ||
               this.getAttribute('aria-multiselectable') === 'true';
    },

    getLevel: function() {
        if (this.hasAttribute('aria-level')) {
            return this.getAttribute('aria-level');
        }

        return TAG_HEADING_LEVEL[this.tag];
    }
});

/* states */
extend(WrapNode.prototype, {
    isDisabled: function() {
        var fieldset = this.hasParent('fieldset');

        return (this.node.disabled ||
                this.getAttribute('aria-disabled') === 'true' ||

                this.tag === 'fieldset' &&
                this.hasAttribute('disabled') ||

                fieldset &&
                (fieldset.node.disabled ||
                 fieldset.hasAttribute('disabled')) &&
                !this.hasParent('legend'));
    },

    isHidden: function() {
        if (this.tag === 'datalist') {
            var id = this.getAttribute('id');
            if (id) {
                var elems = this.getElementsByTagName('input');
                elems = toArray.call(elems).filter(function(input) {
                    return input.getAttribute('list') === id;
                });
                if (elems.length) {
                    return true;
                }
            }
        }

        return (this.hasAttribute('hidden') ||
                this.getAttribute('aria-hidden') === 'true' ||
                this.tag === 'input' &&
                this.getAttribute('type') === 'hidden' ||
                this.node.style.visibility === 'hidden' ||
                this.node.style.display === 'none');
    },

    isInvalid: function() {
        return (this.getAttribute('aria-invalid') === 'true' /*||
                this.node.validity && !this.node.validity.valid*/);
    }
});

module.exports = WrapNode;

},{"./role-from-tag":3,"./util":4}]},{},[2])
(2)
});