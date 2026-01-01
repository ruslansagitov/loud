(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.loud = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2026 Ruslan Sagitov
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

const ROLE_FROM_TAG = require('./role-from-tag'),
    {flatten, toArray, capitalize, forEach} = require('./util');

const TAG_NO_ROLE = new Set([
    'base',
    'head',
    'html',
    'keygen',
    'label',
    'meta',
    'meter',
    'noscript',
    'optgroup',
    'param',
    'script',
    'source',
    'style',
    'template',
    'title',
]);

const TAG_STRONG_ROLE = new Set([
    'area',
    'datalist',
    'fieldset',
    'footer',
]);

const TAG_CAN_BE_PRESENTATION = new Set([
    'aside',
    'fieldset',
    'footer',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'header',
    'hr',
    'iframe',
    'li',
    'main',
    'menu',
    'nav',
    'object',
    'ol',
    'ul',
    'div',
    'span',
]);

const TAG_NO_CLOSING = new Set([
    'hr',
    'img',
    'input',
    'menuitem',
    'progress',
]);

const INPUT_TYPE_NO_ROLE = new Set([
    'color',
    'date',
    'datetime',
    'file',
    'hidden',
    'month',
    'time',
    'week',
]);

const TAG_TO_ROLE_RESTRICTIONS = {
    address: {
        contentinfo: 1
    },
    a: {
        link: 1,
        button: 1,
        checkbox: 1,
        menuitem: 1,
        menuitemcheckbox: 1,
        menuitemradio: 1,
        tab: 1,
        treeitem: 1
    },
    article: {
        article: 1,
        document: 1,
        application: 1,
        main: 1
    },
    aside: {
        complementary: 1,
        note: 1,
        search: 1
    },
    audio: {
        application: 1
    },
    body: {
        application: 1
    },
    button: {
        button: 1,
        link: 1,
        menuitem: 1,
        menuitemcheckbox: 1,
        menuitemradio: 1,
        radio: 1
    },
    embed: {
        application: 1,
        document: 1,
        img: 1
    },
    h1: {
        heading: 1,
        tab: 1
    },
    h2: {
        heading: 1,
        tab: 1
    },
    h3: {
        heading: 1,
        tab: 1
    },
    h4: {
        heading: 1,
        tab: 1
    },
    h5: {
        heading: 1,
        tab: 1
    },
    h6: {
        heading: 1,
        tab: 1
    },
    iframe: {
        application: 1,
        document: 1,
        img: 1
    },
    li: {
        listitem: 1,
        menuitem: 1,
        menuitemcheckbox: 1,
        menuitemradio: 1,
        option: 1,
        tab: 1,
        treeitem: 1
    },
    menu: {
        directory: 1,
        list: 1,
        listbox: 1,
        menu: 1,
        menubar: 1,
        tablist: 1,
        toolbar: 1,
        tree: 1
    },
    object: {
        application: 1,
        document: 1,
        img: 1
    },
    ol: {
        directory: 1,
        list: 1,
        listbox: 1,
        menu: 1,
        menubar: 1,
        tablist: 1,
        toolbar: 1,
        tree: 1
    },
    ul: {
        directory: 1,
        group: 1,
        list: 1,
        listbox: 1,
        menu: 1,
        menubar: 1,
        tablist: 1,
        toolbar: 1,
        tree: 1
    },
    video: {
        application: 1
    }
};

const ROLE_CONTEXT = {
    columnheader: {
        row: 1
    },
    gridcell: {
        row: 1
    },
    listitem: {
        group: 1,
        list: 1
    },
    menuitem: {
        group: 1,
        menu: 1,
        menubar: 1
    },
    menuitemcheckbox: {
        menu: 1,
        menubar: 1
    },
    menuitemradio: {
        group: 1,
        menu: 1,
        menubar: 1
    },
    option: {
        listbox: 1,
        group: 1
    },
    row: {
        table: 1,
        grid: 1,
        rowgroup: 1,
        treegrid: 1
    },
    rowgroup: {
        table: 1,
        grid: 1
    },
    rowheader: {
        row: 1
    },
    tab: {
        tablist: 1
    },
    treeitem: {
        group: 1,
        tree: 1
    }
};

const ROLE_GROUP_CONTEXT = {
    group: {
        listitem: {
            list: 1
        },
        menuitem: {
            menu: 1
        },
        treeitem: {
            tree: 1
        }
    },
    rowgroup: {
        row: {
            grid: 1
        }
    }
};

const ROLE_DESCENDANTS = {
    /*combobox: {
        listbox: 1,
        textbox: 1
    },*/
    grid: {
        row: 1,
        rowgroup: {
            row: 1
        }
    },
    list: {
        group: {
            listitem: 1
        },
        listitem: 1
    },
    listbox: {
        group: {
            option: 1
        },
        option: 1
    },
    menu: {
        group: {
            menuitemradio: 1
        },
        menuitem: 1,
        menuitemcheckbox: 1,
        menuitemradio: 1
    },
    radiogroup: {
        radio: 1
    },
    row: {
        columnheader: 1,
        gridcell: 1,
        rowheader: 1
    },
    rowgroup: {
        row: 1
    },
    table: {
        row: 1,
        rowgroup: {
            row: 1
        }
    },
    tablist: {
        tab: 1
    },
    tree: {
        group: {
            treeitem: 1
        },
        treeitem: 1
    },
    treegrid: {
        row: 1
    }
};

const ROLE_INLINE_VALUE = new Set([
    'textbox',
    'combobox',
    'menuitem',
    'listbox',
    'slider',
]);

const TAG_HAS_ALT = new Set([
    'applet',
    'area',
    'img',
    'input',
]);

const TAG_HAS_HREF = new Set([
    'a',
    'link',
]);

const HYPERLINK_TYPES = new Set([
    'alternative',
    'author',
    'help',
    'license',
    'next',
    'prev',
    'search',
]);

const ACCESSIBLE_NAME_FROM_CONTENTS = new Set([
    'button',
    'checkbox',
    'columnheader',
    /*'directory',*/
    'gridcell',
    'heading',
    'link',
    'listitem',
    'menuitem',
    'menuitemcheckbox',
    'menuitemradio',
    'option',
    'radio',
    /*'row',*/
    /*'rowgroup',*/
    'rowheader',
    'tab',
    'tooltip',
    'treeitem',
    'presentation',
]);

const ABSTRACT_ROLES = new Set([
    'command',
    'composite',
    'input',
    'landmark',
    'range',
    'roletype',
    'section',
    'sectionhead',
    'select',
    'structure',
    'widget',
    'window',
]);

const ATTR_VALUES = {
    autocomplete: {
        inline: 1,
        list: 1,
        both: 1,
        none: 1
    },
    orientation: {
        vertical: 1,
        horizontal: 1,
        none: 1
    },
    sort: {
        ascending: 1,
        descending: 1,
        none: 1,
        other: 1
    },
    dropeffect: {
        copy: 1,
        move: 1,
        link: 1,
        execute: 1,
        popup: 1
    },
    live: {
        polite: 1,
        assertive: 1
    },
    relevant: {
        additions: 1,
        removals: 1,
        text: 1,
        all: 1
    }
};

const TAG_HEADING_LEVEL = {
    h1: '1',
    h2: '2',
    h3: '3',
    h4: '4',
    h5: '5',
    h6: '6'
};

class A11yNode {
    constructor(node) {
        this.node = node;

        this.childs = [];

        this.nodeType = node.nodeType;
        this.nodeValue = node.nodeValue;
        this.value = node.value;
        this.textContent = node.textContent || node.innerText;
        this.tag = node.nodeName.toLowerCase();

        return this;
    }

    parse() {
        let node = this.node.firstChild,
            newNode;

        this.childs = [];
        for (; node; node = node.nextSibling) {
            newNode = new A11yNode(node).parse();
            newNode.parentNode = this;

            this.childs.push(newNode);
        }

        let that = this;

        this.childs.forEach((child, idx) => {
            child.nextSibling = that.childs[idx + 1];
        });

        this.firstChild = this.childs[0];

        return this;
    }

    free() {
        delete this.node;

        delete this.parentNode;
        delete this.firstChild;
        delete this.nextSibling;

        this.childs.forEach(child => child.free());

        delete this.childs;
    }

    setIds(inst) {
        if (this.nodeType === 1) {
            let id = this.getAttribute('id');
            if (id) {
                inst.setElementId(id, this);
            }
        }

        let node = this.firstChild;
        for (; node; node = node.nextSibling) {
            node.setIds(inst);
        }

        return this;
    }

    getElementsByTagName(name) {
        let node = this.firstChild,
            nodes = [];

        if (this.tag === name) {
            nodes.push(this);
        }

        for (; node; node = node.nextSibling) {
            nodes.push(node.getElementsByTagName(name));
        }

        return flatten(nodes);
    }

    /* proxy */
    hasAttribute(...args) {
        return this.node.hasAttribute(...args);
    }

    getAttribute(...args) {
        return this.node.getAttribute(...args);
    }

    /* utils */
    isEmbeddedControl() {
        return ROLE_INLINE_VALUE.has(this.role);
    }

    /* istanbul ignore next: untestable */ isHyperlink() {
        let rel = this.getAttribute('rel') || '';
        rel = rel.toLowerCase();
        return HYPERLINK_TYPES.has(rel);
    }

    isNodeNonEmpty(node) {
        node = node.firstChild;
        for (; node; node = node.nextSibling) {
            if (node.nodeType === 1) {
                if (node.hidden) {
                    continue;
                }

                if (TAG_NO_CLOSING.has(node.tag)) {
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
    }

    isEmpty() {
        return !this.isNodeNonEmpty(this);
    }

    isPresentation() {
        return this.role === 'presentation';
    }

    isStrongRole() {
        return TAG_STRONG_ROLE.has(this.tag);
    }

    hasParent(parentName) {
        let node = this.parentNode;
        for (; node; node = node.parentNode) {
            if (node.tag === parentName) {
                return node;
            }
        }

        return false;
    }

    mustNoRole() {
        if (this.tag === 'input') {
            let type = this.getAttribute('type') || 'text';
            type = type.toLowerCase();
            return INPUT_TYPE_NO_ROLE.has(type);
        }
        return TAG_NO_ROLE.has(this.tag);
    }

    mayBePresentation() {
        return TAG_CAN_BE_PRESENTATION.has(this.tag);
    }

    mayTransitionToRole(role) {
        let allowed = TAG_TO_ROLE_RESTRICTIONS[this.tag];
        if (!allowed) {
            return true;
        }
        return allowed && allowed[role];
    }

    mayAccessibleNameFromContents() {
        let role = this.role;
        return (!role || ACCESSIBLE_NAME_FROM_CONTENTS.has(role));
    }

    isInputInsideLabel() {
        let id = this.getAttribute('id');
        if (id && this.tag === 'input') {
            let node = this.parentNode;
            for (; node; node = node.parentNode) {
                if (node.tag === 'label' &&
                    node.getAttribute('for') === id) {
                    return true;
                }
            }
        }
    }

    mayHaveAlt() {
        return TAG_HAS_ALT.has(this.tag);
    }

    mayHaveHref() {
        return TAG_HAS_HREF.has(this.tag);
    }

    getRoleFromAttr() {
        if (this.nodeType !== 1) {
            return;
        }

        let roles = this.getAttribute('role');
        if (!roles) {
            return;
        }

        return roles
            .split(/\s+/)
            .filter(role => !ABSTRACT_ROLES.has(role))
            .filter(str => str)
            .shift();
    }

    hasOnlyTextChilds() {
        let node = this.firstChild;
        for (; node; node = node.nextSibling) {
            if (node.nodeType !== 3) {
                return false;
            }
        }

        return true;
    }

    getTextContentFromDirectChild(childName) {
        let node = this.firstChild,
            iter;
        for (; node; node = node.nextSibling) {
            if (node.nodeType !== 1) {
                continue;
            }

            if (node.tag === childName) {
                iter = node.firstChild;
                for (; iter; iter = iter.nextSibling) {
                    if (iter.nodeType !== 3) {
                        return '';
                    }
                }

                return node.textContent;
            }
        }
    }

    /* relationship */
    ownedByValidRolesFor(role) {
        let context = ROLE_CONTEXT[role];
        if (!context) {
            return true;
        }

        let node = this.parentNode,
            parentRole;
        for (; node; node = node.parentNode) {
            if (typeof node.role !== 'undefined') {
                parentRole = node.role;
                if (context[parentRole]) {
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
        }

        return false;
    }

    ownsValidRolesFor(role) {
        let limits = ROLE_DESCENDANTS[role];
        if (!limits) {
            return true;
        }

        return this.isDescendantsValid(limits);
    }

    isDescendantsValid(limits) {
        let node = this.firstChild,
            nodeCount = 0,
            role, lim;
        for (; node; node = node.nextSibling) {
            if (node.nodeType !== 1) {
                continue;
            }

            if (!node.part) {
                role = node.role;
                if (!role || role === 'presentation') {
                    if (!node.isEmpty() &&
                        !node.isDescendantsValid(limits)) {
                        return false;
                    }
                } else {
                    lim = limits[role];
                    if (!lim) {
                        return false;
                    }

                    if (lim !== 1) {
                        if (!node.isDescendantsValid(lim)) {
                            return false;
                        }
                    }
                }
            }

            nodeCount++;
        }

        return nodeCount !== 0;
    }

    getChecked() {
        /* Firefox defines node.checked on <menuitem>. */
        if (this.tag === 'menuitem') {
            return null;
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
    }

    getSelected() {
        if (this.hasAttribute('aria-selected')) {
            return this.getAttribute('aria-selected') === 'true';
        }
    }

    getReadonly() {
        return (this.hasAttribute('readonly') ||
                this.getAttribute('aria-readonly') === 'true');
    }

    getRequired() {
        return this.hasAttribute('required') ||
               this.getAttribute('aria-required') === 'true';
    }

    getMultiselectable() {
        return this.hasAttribute('multiple') ||
               this.getAttribute('aria-multiselectable') === 'true';
    }

    getLevel() {
        if (this.hasAttribute('aria-level')) {
            return this.getAttribute('aria-level');
        }

        return TAG_HEADING_LEVEL[this.tag];
    }

    /* states */
    isSelected() {
        return this.node.selected;
    }

    isDisabled() {
        let fieldset = this.hasParent('fieldset');

        return (this.node.disabled ||
                this.getAttribute('aria-disabled') === 'true' ||

                this.tag === 'fieldset' &&
                this.hasAttribute('disabled') ||

                fieldset &&
                (fieldset.node.disabled ||
                 /* istanbul ignore next: untestable */
                 fieldset.hasAttribute('disabled')) &&
                !this.hasParent('legend'));
    }

    isHidden(inst) {
        let node = this.node;

        if (this.nodeType !== 1) {
            return false;
        }

        /* istanbul ignore next: untestable */
        if (this.tag === 'datalist') {
            let id = this.getAttribute('id');
            if (id) {
                let elems = inst.getElementsByTagName('input');
                elems = toArray.call(elems)
                    .filter(input => input.getAttribute('list') === id);
                if (elems.length) {
                    return true;
                }
            }
        } else if ((this.tag === 'option' || this.tag === 'optgroup') &&
                   this.hasParent('select')) {
            return false;
        }

        if (this.hasAttribute('hidden') ||
            this.getAttribute('aria-hidden') === 'true' ||
            this.tag === 'input' &&
            this.getAttribute('type') === 'hidden' ||
            node.style.visibility === 'hidden' ||
            node.style.display === 'none') {
            return true;
        }

        if (node.offsetWidth || node.offsetHeight ||
            node.getClientRects && node.getClientRects().length) {
            return false;
        }

        return true;
    }

    isInvalid() {
        return this.getAttribute('aria-invalid') === 'true';
    }
}

forEach([
    'setRole',
    'fixRole'
], item => {
    A11yNode.prototype[item] = function(inst) {
        ROLE_FROM_TAG[item].call(inst, this);

        let node = this.firstChild;
        for (; node; node = node.nextSibling) {
            if (node.nodeType === 1) {
                node[item](inst);
            }
        }

        return this;
    };
});


/* attributes */
forEach([
    'autocomplete',
    'orientation',
    'sort',
    'live'
], item => {
    let funcName = `get${capitalize(item)}`;

    A11yNode.prototype[funcName] = function() {
        let data = this.getAttribute(`aria-${item}`);
        if (data) {
            data = data.toLowerCase();
            if (ATTR_VALUES[item][data]) {
                return data;
            }
        }
    };
});

forEach([
    'dropeffect',
    'relevant'
], item => {
    let funcName = `get${capitalize(item)}`;

    A11yNode.prototype[funcName] = function() {
        let data = this.getAttribute(`aria-${item}`);
        if (data) {
            return data
                .toLowerCase()
                .split(/\s+/)
                .filter(value => ATTR_VALUES[item][value])
                .join(' ');
        }
    };
});

forEach([
    'expanded',
    'pressed',
    'grabbed'
], item => {
    let funcName = `get${capitalize(item)}`;

    A11yNode.prototype[funcName] = function() {
        let attr = `aria-${item}`;
        if (this.hasAttribute(attr)) {
            let a = this.getAttribute(attr);
            return a === 'true' ? true : (a === 'false' ? false : a);
        }
    };
});

module.exports = A11yNode;

},{"./role-from-tag":4,"./util":5}],2:[function(require,module,exports){
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2026 Ruslan Sagitov
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

const {toArray} = require('./util');

const TAG_LABEL_TAG = {
    table: 'caption',
    fieldset: 'legend',
    figure: 'figcaption',
    details: 'summary'
};

const getFrom = [
    function(node, recurse) {
        let ids = node.getAttribute('aria-labelledby');
        if (!recurse && ids) {
            let that = this;
            return ids
                .split(/\s+/)
                .map(id => {
                    let elem = that.getElementById(id);
                    if (elem) {
                        let val = that.getAccessibleName(elem, true);
                        return val && val.trim();
                    }

                    return '';
                })
                .filter(str => str)
                .join(' ');
        }
    },

    function(node, recurse) {
        if (!recurse || !node.isEmbeddedControl()) {
            return node.getAttribute('aria-label');
        }
    },

    function(node, recurse) {
        if ((!recurse || !node.isEmbeddedControl()) &&
            !node.isPresentation() && node.mayHaveAlt()) {
            return node.getAttribute('alt');
        }
    },

    function(node, recurse) {
        if ((!recurse || !node.isEmbeddedControl()) &&
            !node.isPresentation()) {
            let label = TAG_LABEL_TAG[node.tag];
            if (label) {
                return node.getTextContentFromDirectChild(label);
            }
        }
    },

    function(node, recurse) {
        if ((!recurse || !node.isEmbeddedControl()) &&
            !node.isPresentation()) {
            let id = node.getAttribute('id');
            if (id) {
                let elems = this.getElementsByTagName('label');
                elems = toArray.call(elems)
                    .filter(label => label.getAttribute('for') === id);

                if (elems.length) {
                    return this.getAccessibleName(elems[0], recurse);
                }
            }
        }
    },

    function(node, recurse) {
        if (!node.mayAccessibleNameFromContents()) {
            return null;
        }

        node = node.firstChild;

        let name = [],
            value;
        for (; node; node = node.nextSibling) {
            switch (node.nodeType) {
                case 1:
                    if (node.isInputInsideLabel()) {
                        value = '';
                    } else if (!node.isEmbeddedControl()) {
                        value = this.getAccessibleName(node, recurse);
                    } else if (node.valuetext) {
                        value = node.valuetext;
                    } else if (typeof node.valuenow !== 'undefined') {
                        value = node.valuenow;
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
        }

        return name.join(' ');
    },

    function(node) {
        return node.getAttribute('title');
    },

    function(node) {
        if (node.mayHaveHref()) {
            return node.getAttribute('href');
        }
    }
];

module.exports = function(node, recurse) {
    let name = node.accessibleName,
        that = this;
    if (typeof name !== 'undefined') {
        return name;
    }

    getFrom.some(callback => {
        name = callback.call(that, node, recurse);
        return name;
    });

    node.accessibleName = name || '';

    return name;
};

},{"./util":5}],3:[function(require,module,exports){
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2026 Ruslan Sagitov
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

const getWordsFromRole = require('./words-from-role'),
    getWordsFromAttributes = require('./words-from-attributes'),
    getAccessibleName = require('./accessible-name'),
    A11yNode = require('./a11y-node'),
    {flatten} = require('./util');

class Loud {
    constructor() {
        let settings = module.exports;
        this.warn = settings.warn;
        this.forceValidMarkup = settings.FORCE_VALID_MARKUP;
        return this;
    }

    say(node) {
        if (!node || !node.length || node.nodeType === 3) {
            node = [node];
        }

        let res = [],
            val;

        for (let i = 0; i < node.length; i++) {
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
    }

    setElementId(id, node) {
        this.elementById[id] = node;
    }

    getElementById(id) {
        return this.elementById[id];
    }

    getElementsByTagName(name) {
        return this.root.getElementsByTagName(name);
    }

    traverse(node) {
        let iter = node.firstChild,
            value = [],
            val;
        for (; iter; iter = iter.nextSibling) {
            val = this.handleNode(iter);
            if (val) {
                value.push(val);
            }
        }

        return flatten(value);
    }

    handleNode(node) {
        if (node.nodeType === 3) {
            return node.nodeValue.trim();
        }

        if (node.hidden) {
            return '';
        }

        return this.getWordsFromRole(node);
    }
}


Loud.prototype.getAccessibleName = getAccessibleName;
Loud.prototype.getWordsFromRole = getWordsFromRole;
Loud.prototype.getWordsFromAttributes = getWordsFromAttributes;

function LoudError() {
}
LoudError.prototype = Error.prototype;
function LoudValidationError(message) {
    this.message = message;
}
LoudValidationError.prototype = new LoudError();
LoudValidationError.prototype.constructor = LoudValidationError;
LoudValidationError.prototype.name = 'LoudValidationError';

module.exports = {
    /**
     * @type {String}
     * @readonly
     */
    VERSION: '0.9.2',

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
    error(message) {
        throw new LoudValidationError(message);
    },

    /**
     * Warn about failed validation.
     *
     * @param {String} message - Error message
     * @since 0.9.0
     */
    warn() {},

    /**
     * Transform a DOM element to words.
     *
     * @param {Object|Object[]} node - DOM element or array of
     *                                 DOM elements
     * @returns {String[]} Words
     */
    say(node) {
        return (new Loud()).say(node);
    }
};

},{"./a11y-node":1,"./accessible-name":2,"./util":5,"./words-from-attributes":6,"./words-from-role":7}],4:[function(require,module,exports){
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2026 Ruslan Sagitov
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

const {isFunction, capitalize} = require('./util');

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

function roleToObject(roleData) {
    if (typeof roleData === 'string') {
        return {role: roleData};
    }

    return {...roleData};
}

function getTextboxRole(node) {
    let listId = node.getAttribute('list'),
        datalist;

    /* istanbul ignore if: untestable */
    if (listId) {
        datalist = this.getElementById(listId);
    }

    /* istanbul ignore next: untestable */
    if (datalist && datalist.tag === 'datalist') {
        return {
            role: 'combobox',
            owns: listId
        };
    }

    return 'textbox';
}

function range(role) {
    return function(node) {
        return {
            role,
            valuenow: node.getAttribute('value'),
            valuemin: node.getAttribute('min'),
            valuemax: node.getAttribute('max')
        };
    };
}

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
    link(node) {
        /* istanbul ignore if: untestable */
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
    optgroup(node) {
        /* istanbul ignore else: untestable */
        if (node.hasParent('select')) {
            return 'group';
        }

        /* istanbul ignore next: untestable */
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

function setGlobalAttrs(node) {
    node.describedby = node.getAttribute('aria-describedby');

    node.controls = node.getAttribute('aria-controls');
    node.owns = node.getAttribute('aria-owns');
    node.flowto = node.getAttribute('aria-flowto');
    node.haspopup = node.getAttribute('aria-haspopup') === 'true';
    node.dropeffect = node.getDropeffect();
    node.grabbed = node.getGrabbed();

    node.busy = node.getAttribute('aria-busy') === 'true';
    node.atomic = node.getAttribute('aria-atomic') === 'true';
    node.live = node.getLive();
    node.relevant = node.getRelevant();

    node.disabled = node.isDisabled();
    node.invalid = node.isInvalid();
}

function setLocalAttrs(node) {
    let role = node.role,
        attrs = ROLE_LOCAL_ATTRS[role] || [];

    for (let attr of attrs) {
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
    }
}

function setDefaults(node) {
    let role = node.role,
        data = DEFAULT_FOR[role];

    if (data) {
        for (let key of Object.keys(data)) {
            if (!node[key]) {
                node[key] = data[key];
            }
        }
    }
}

function setRole(node) {
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
        Object.assign(node, roleData);
        node.role = role;
        setGlobalAttrs.call(this, node);
    }
}

function fixRole(node) {
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
}

exports.setRole = setRole;
exports.fixRole = fixRole;

},{"./util":5}],5:[function(require,module,exports){
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2026 Ruslan Sagitov
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

},{}],6:[function(require,module,exports){
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2026 Ruslan Sagitov
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

function pushStates(result, node) {
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
}

function pushProperties(result, node) {
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
        'dropeffect',
        'live',
        'relevant'
    ].forEach(item => {
        if (node[item]) {
            result.push(item, node[item]);
        }
    });

    if (node.atomic) {
        result.push('atomic');
    }
}

function pushActiveDescendant(result, node) {
    if (node.activedescendant) {
        let elem = this.getElementById(node.activedescendant);
        if (elem) {
            let name = this.getAccessibleName(elem);
            if (name) {
                result.push(name);
            }
        }
    }
}

function pushDescribedBy(result, node) {
    if (node.describedby) {
        let that = this;
        let desc = node.describedby
            .split(/\s+/)
            .map(id => {
                let elem = that.getElementById(id);
                if (elem) {
                    return elem.textContent;
                }

                return '';
            })
            .filter(str => str);

        if (desc.length) {
            result.push(desc.join(' '));
        }
    }
}

module.exports = function(node) {
    let that = this,
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
    ].forEach(item => {
        if (node[item]) {
            ids = node[item]
                .split(/\s+/)
                .map(id => {
                    return that.getElementById(id) ? id : '';
                })
                .filter(str => str);

            if (ids.length) {
                result.push(item, ids);
            }
        }
    });

    pushDescribedBy.call(this, result, node);

    pushActiveDescendant.call(this, result, node);

    return result;
};

},{}],7:[function(require,module,exports){
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2026 Ruslan Sagitov
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

const {flatten} = require('./util');

const ROLE_USE_PROCENT = {
    progressbar: 1,
    scrollbar: 1
};

function deep(roleName) {
    return function(node) {
        return [
            this.getAccessibleName(node),
            roleName,
            this.getWordsFromAttributes(node),
            this.traverse(node)
        ];
    };
}

function flat(roleName) {
    return function(node) {
        return [
            this.getAccessibleName(node),
            roleName,
            this.getWordsFromAttributes(node)
        ];
    };
}

function range(roleName) {
    return function(node) {
        let role = node.role,
            valuetext = node.valuetext,
            valuenow = node.valuenow,
            valuemin = node.valuemin,
            valuemax = node.valuemax,
            value = node.value || '',
            orientation = node.orientation;

        if (valuetext) {
            value = valuetext;
        } else if (valuenow && valuemin && valuemax) {
            valuenow = parseInt(valuenow);
            valuemin = parseInt(valuemin);
            valuemax = parseInt(valuemax);

            if (ROLE_USE_PROCENT[role]) {
                if (valuemin < valuemax &&
                    value >= valuemin && value <= valuemax) {
                    value = valuenow / (valuemax - valuemin) * 100;
                    value = [String(Math.round(value)), 'percent'];
                } else {
                    value = String(valuenow);
                }
            } else {
                value = String(valuenow);
            }
        } else if (valuenow) {
            value = valuenow;
        }

        return [
            this.getAccessibleName(node),
            orientation && orientation !== 'none' ? orientation : '',
            roleName,
            value,
            this.getWordsFromAttributes(node)
        ];
    };
}

function region(before, after) {
    return function(node) {
        if (node.isEmpty()) {
            return [];
        }

        let name = this.getAccessibleName(node);

        return [
            name, before,
            this.getWordsFromAttributes(node),
            this.traverse(node),
            after
        ];
    };
}

const HANDLERS = {
    alert: region('alert', 'alert end'),
    alertdialog: region('alertdialog', 'alertdialog end'),
    application: region('application', 'application end'),
    article: region('article', 'article end'),
    banner: region('banner', 'banner end'),
    button(node) {
        return [
            this.getAccessibleName(node),
            (node.expanded === true ||
             node.expanded === false ?
                'button menu' :
                (node.pressed === true ||
                 node.pressed === false ?
                    'toggle button' : 'button')),
            this.getWordsFromAttributes(node)
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
    grid(node) {
        let table = node.table;
        return [
            this.getAccessibleName(node),
            table ? 'table' : 'grid',
            this.getWordsFromAttributes(node),
            this.traverse(node),
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
    separator(node) {
        let orientation = node.orientation;
        return [
            orientation && orientation !== 'none' ? orientation : '',
            'separator',
            this.getWordsFromAttributes(node)
        ];
    },
    scrollbar: range('scrollbar'),
    slider: range('slider'),
    spinbutton: range('spinbutton'),
    status: region('status', 'status end'),
    tab: flat('tab'),
    tablist: deep('tablist'),
    tabpanel: region('tabpanel', 'tabpanel end'),
    textbox(node) {
        let multiline = node.multiline,
            password = node.password;
        return [
            this.getAccessibleName(node),
            multiline ? 'multiline' : '',
            password ? 'password' : '',
            'textbox',
            this.getWordsFromAttributes(node),
            this.traverse(node)
        ];
    },
    timer: region('timer', 'timer end'),
    toolbar: region('toolbar', 'toolbar end'),
    tooltip: flat('tooltip'),
    tree: deep('tree'),
    treegrid: region('treegrid', 'treegrid end'),
    treeitem: flat('treeitem')
};

module.exports = function(node) {
    let handler = HANDLERS[node.role];
    if (!handler) {
        return this.traverse(node);
    }

    let value = flatten(handler.call(this, node));

    return value.filter(str => str);
};

},{"./util":5}]},{},[3])(3)
});
