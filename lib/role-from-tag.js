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
'use strict';

const UTIL = require('./util');

const isFunction = UTIL.isFunction,
    extend = UTIL.extend,
    capitalize = UTIL.capitalize;

/* eslint-disable max-len */
const ROLE_LOCAL_ATTRS = {
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
/* eslint-enable max-len */

const DEFAULT_FOR = {
    alert: {
        live: 'assertive',
        atomic: true
    },
    checkbox: {
        checked: false
    },
    combobox: {
        haspopup: true,
        expanded: false
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

const roleToObject = function(roleData) {
    if (typeof roleData === 'string') {
        return {role: roleData};
    }

    return extend({}, roleData || {});
};

const getTextboxRole = function(node) {
    let listId = node.getAttribute('list'),
        datalist;

    /* istanbul ignore if */
    if (listId) {
        datalist = this.getElementById(listId);
    }

    /* istanbul ignore next */
    if (datalist && datalist.tag === 'datalist') {
        return {
            role: 'combobox',
            owns: listId
        };
    }

    return 'textbox';
};

const range = function(role) {
    return function(node) {
        return {
            role,
            valuenow: node.getAttribute('value'),
            valuemin: node.getAttribute('min'),
            valuemax: node.getAttribute('max')
        };
    };
};

const TAG_INPUT_GET_ROLE = {
    checkbox: 'checkbox',
    email: getTextboxRole,
    image: 'button',
    number: range('spinbutton'),
    password: {role: 'textbox', password: true},
    radio: 'radio',
    range: range('slider'),
    reset: 'button',
    search: getTextboxRole,
    submit: 'button',
    tel: getTextboxRole,
    text: getTextboxRole,
    url: getTextboxRole
};

const TAG_TO_ROLE = {
    a: 'link',
    address: 'contentinfo',
    area: 'link',
    article: 'article',
    aside: 'complementary',
    body: 'document',
    button: 'button',
    caption(node) {
        /* istanbul ignore else */
        if (node.hasParent('table')) {
            return {
                part: true,
                hidden: node.hasOnlyTextChilds()
            };
        }
    },
    colgroup(node) {
        /* istanbul ignore else */
        if (node.hasParent('table')) {
            return {part: true};
        }
    },
    datalist: {role: 'listbox', multiselectable: false},
    dialog: 'dialog',
    dd: 'listitem',
    dl: 'list',
    dt: 'listitem',
    fieldset: 'group',
    figcaption(node) {
        if (node.hasParent('figure') &&
            node.hasOnlyTextChilds()) {
            return {hidden: true};
        }
    },
    footer(node) {
        if (!node.hasParent('article') &&
            !node.hasParent('section')) {
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
    header(node) {
        if (!node.hasParent('article') &&
            !node.hasParent('section')) {
            return 'banner';
        }
        return '';
    },
    hr: 'separator',
    img(node) {
        let alt = node.getAttribute('alt');
        if (alt === '') {
            return 'presentation';
        }
        return 'img';
    },
    input(node) {
        if (node.mustNoRole()) {
            return '';
        }

        let type = node.getAttribute('type') || 'text',
            getRole = TAG_INPUT_GET_ROLE[type],
            roleData = isFunction(getRole) ?
                getRole.call(this, node) : getRole;

        return roleToObject(roleData);
    },
    legend(node) {
        if (node.hasParent('fieldset') &&
            node.hasOnlyTextChilds()) {
            return {hidden: true};
        }
    },
    li: 'listitem',
    /* istanbul ignore next */ link(node) {
        if (node.isHyperlink()) {
            return 'link';
        }

        return '';
    },
    main: 'main',
    menu(node) {
        let type = node.getAttribute('type');
        return type === 'toolbar' ? 'toolbar' : 'menu';
    },
    menuitem: 'menuitem',
    nav: 'navigation',
    ol: 'list',
    /* istanbul ignore next */ optgroup(node) {
        if (node.hasParent('select')) {
            return 'group';
        }

        return '';
    },
    option(node) {
        return {
            role: 'option',
            selected: node.isSelected()
        };
    },
    progress: range('progressbar'),
    section: 'region',
    select(node) {
        return {
            role: 'listbox',
            multiselectable: node.hasAttribute('multiple')
        };
    },
    summary(node) {
        if (node.hasParent('details') &&
            node.hasOnlyTextChilds()) {
            return {hidden: true};
        }
    },
    table: {role: 'grid', table: true},
    tbody: 'rowgroup',
    td: 'gridcell',
    textarea: {role: 'textbox', multiline: true},
    tfoot: 'rowgroup',
    th(node) {
        if (node.getAttribute('scope') === 'row') {
            return 'rowheader';
        }

        return 'columnheader';
    },
    thead: 'rowgroup',
    tr: 'row',
    ul: {role: 'list', numbered: true}
};

const setGlobalAttrs = function(node) {
    extend(node, {
        describedby: node.getAttribute('aria-describedby'),

        controls: node.getAttribute('aria-controls'),
        owns: node.getAttribute('aria-owns'),
        flowto: node.getAttribute('aria-flowto'),
        haspopup: node.getAttribute('aria-haspopup') === 'true',
        dropeffect: node.getDropeffect(),
        grabbed: node.getGrabbed(),

        busy: node.getAttribute('aria-busy') === 'true',
        atomic: node.getAttribute('aria-atomic') === 'true',
        live: node.getLive(),
        relevant: node.getRelevant(),

        disabled: node.isDisabled(),
        invalid: node.isInvalid()
    });
};

const setLocalAttrs = function(node) {
    let role = node.role,
        attrs = ROLE_LOCAL_ATTRS[role] || [];

    attrs.forEach(attr => {
        if (typeof node[attr] !== 'undefined') {
            return;
        }

        let funcName = `get${capitalize(attr)}`,
            value;
        if (isFunction(node[funcName])) {
            value = node[funcName]();
            if (value !== null) {
                node[attr] = value;
            }
        } else {
            if (node.hasAttribute(`aria-${attr}`)) {
                node[attr] = node.getAttribute(`aria-${attr}`);
            }
        }
    });
};

const setDefaults = function(node) {
    let role = node.role,
        data = DEFAULT_FOR[role];

    if (data) {
        Object.keys(data).forEach(key => {
            if (!node[key]) {
                node[key] = data[key];
            }
        });
    }
};

const setRole = function(node) {
    let getRole = TAG_TO_ROLE[node.tag] || '',
        roleData, role;

    roleData = isFunction(getRole) ? getRole.call(this, node) : getRole;
    roleData = roleToObject(roleData);

    if (!node.mustNoRole()) {
        role = node.getRoleFromAttr();
        if (role === 'presentation') {
            if (node.mayBePresentation()) {
                roleData.role = role;
            }
        } else if (role) {
            if (!node.isStrongRole()) {
                if (node.mayTransitionToRole(role)) {
                    roleData.role = role;
                }
            }
        }
    }

    role = roleData.role;

    node.part = roleData.part;
    node.hidden = roleData.hidden || node.isHidden();

    if (role && role !== 'presentation') {
        extend(node, roleData);
        node.role = role;
        setGlobalAttrs.call(this, node);
    }
};

const fixRole = function(node) {
    let role = node.role;
    if (role && role !== 'presentation') {
        if (!node.ownsValidRolesFor(role)) {
            this.warn(`Element with role "${role
            }" does not own elements with valid roles`);
            if (this.forceValidMarkup) {
                delete node.role;
            }
        } else if (!node.ownedByValidRolesFor(role)) {
            this.warn(`Element with role "${role
            }" is not owned by elements with valid roles`);
            if (this.forceValidMarkup) {
                delete node.role;
            }
        }

        setLocalAttrs.call(this, node);
        setDefaults.call(this, node);
    }
};

exports.setRole = setRole;
exports.fixRole = fixRole;
