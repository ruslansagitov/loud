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

    /* istanbul ignore next */ isHyperlink() {
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
                 fieldset.hasAttribute('disabled')) &&
                !this.hasParent('legend'));
    }

    isHidden(inst) {
        let node = this.node;

        if (this.nodeType !== 1) {
            return false;
        }

        /* istanbul ignore next */
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
