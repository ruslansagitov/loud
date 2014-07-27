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

var UTIL = require('./util');

var isString = UTIL.isString,
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
        datalist = wrapNode.ctx.getElementById(listId);
    }

    if (datalist && datalist.tag === 'datalist') {
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
    caption: function(wrapNode) {
        if (wrapNode.hasParent('table')) {
            return {
                part: true,
                hidden: wrapNode.hasOnlyTextChilds()
            };
        }
    },
    colgroup: function(wrapNode) {
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
    figcaption: function(wrapNode) {
        if (wrapNode.hasParent('figure') &&
            wrapNode.hasOnlyTextChilds()) {
            return { hidden: true };
        }
    },
    footer: function(wrapNode) {
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
    header: function(wrapNode) {
        if (!wrapNode.hasParent('article') &&
            !wrapNode.hasParent('section')) {
            return 'banner';
        }
        return '';
    },
    hr: 'separator',
    img: function imgHandler(wrapNode) {
        var alt = wrapNode.getAttribute('alt');
        if (alt === '') {
            return 'presentation';
        }
        return 'img';
    },
    input: function(wrapNode) {
        if (wrapNode.mustNoRole()) {
            return '';
        }

        var type = wrapNode.getAttribute('type') || 'text',
            getRole = TAG_INPUT_GET_ROLE[type],
            roleData = isFunction(getRole) ?
                       getRole(wrapNode) : getRole;

        return roleToObject(roleData);
    },
    legend: function(wrapNode) {
        if (wrapNode.hasParent('fieldset') &&
            wrapNode.hasOnlyTextChilds()) {
            return { hidden: true };
        }
    },
    li: 'listitem',
    link: function(wrapNode) {
        if (wrapNode.isHyperlink()) {
            return 'link';
        }

        return '';
    },
    main: 'main',
    menu: function(wrapNode) {
        var type = wrapNode.getAttribute('type');
        return type === 'toolbar' ? 'toolbar' : 'menu';
    },
    menuitem: 'menuitem',
    nav: 'navigation',
    ol: 'list',
    optgroup: function(wrapNode) {
        if (wrapNode.hasParent('select')) {
            return 'group';
        }

        return '';
    },
    option: function(wrapNode) {
        return {
            role: 'option',
            selected: wrapNode.hasAttribute('selected')
        };
    },
    progress: range('progressbar'),
    section: 'region',
    select: function(wrapNode) {
        return {
            role: 'listbox',
            multiselectable: wrapNode.hasAttribute('multiple')
        };
    },
    summary: function(wrapNode) {
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
    th: function(wrapNode) {
        if (wrapNode.getAttribute('scope') === 'row') {
            return 'rowheader';
        }

        return 'columnheader';
    },
    thead: 'rowgroup',
    tr: 'row',
    ul: { role: 'list', numbered: true }
};

function setGlobalAttrs(wrapNode) {
    extend(wrapNode, {
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
        hidden: wrapNode.hidden || wrapNode.isHidden(),
        invalid: wrapNode.isInvalid()
    });
}

function setLocalAttrs(wrapNode) {
    var role = wrapNode.role,
        attrs = ROLE_LOCAL_ATTRS[role] || [];

    attrs.forEach(function(attr) {
        if (typeof wrapNode[attr] !== 'undefined') {
            return;
        }

        var funcName = toCamelCase('get-' + attr),
            value;
        if (isFunction(wrapNode[funcName])) {
            value = wrapNode[funcName]();
            if (value !== null) {
                wrapNode[attr] = value;
            }
        } else {
            if (wrapNode.hasAttribute('aria-' + attr)) {
                wrapNode[attr] = wrapNode.getAttribute('aria-' + attr);
            }
        }
    });
}

function setDefaults(wrapNode) {
    var role = wrapNode.role,
        data = DEFAULT_FOR[role];

    if (data) {
        Object.keys(data).forEach(function(key) {
            if (!wrapNode[key]) {
                wrapNode[key] = data[key];
            }
        });
    }
}

function setRole(wrapNode) {
    var getRole = TAG_TO_ROLE[wrapNode.tag] || '',
        roleData, role;

    roleData = isFunction(getRole) ? getRole(wrapNode) : getRole;
    roleData = roleToObject(roleData);

    if (roleData.part) {
        wrapNode.part = roleData.part;
    }

    if (roleData.hidden) {
        wrapNode.hidden = roleData.hidden;
    }

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
        extend(wrapNode, roleData);
        wrapNode.role = role;
        setGlobalAttrs(wrapNode);
    }
}

function fixRole(wrapNode) {
    var role = wrapNode.role;
    if (role && role !== 'presentation') {
        if (!wrapNode.ownsValidRolesFor(role) ||
            !wrapNode.ownedByValidRolesFor(role)) {
            delete wrapNode.role;
        }

        setLocalAttrs(wrapNode);
        setDefaults(wrapNode);
    }
}

exports.setRole = setRole;
exports.fixRole = fixRole;
