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

var ROLE_FROM_TAG = require('./role-from-tag'),
    UTIL = require('./util');

var extend = UTIL.extend,
    flatten = UTIL.flatten,
    toArray = UTIL.toArray,
    toCamelCase = UTIL.toCamelCase;

var TAG_NO_ROLE = {
    base: 1,
    head: 1,
    html: 1,
    keygen: 1,
    label: 1,
    meta: 1,
    meter: 1,
    noscript: 1,
    optgroup: 1,
    param: 1,
    script: 1,
    source: 1,
    style: 1,
    template: 1,
    title: 1
};

var TAG_STRONG_ROLE = {
    area: 1,
    datalist: 1,
    fieldset: 1,
    footer: 1
};

var TAG_CAN_BE_PRESENTATION = {
    aside: 1,
    fieldset: 1,
    footer: 1,
    h1: 1,
    h2: 1,
    h3: 1,
    h4: 1,
    h5: 1,
    h6: 1,
    header: 1,
    hr: 1,
    iframe: 1,
    li: 1,
    main: 1,
    menu: 1,
    nav: 1,
    object: 1,
    ol: 1,
    ul: 1,
    div: 1,
    span: 1
};

var TAG_NO_CLOSING = {
    input: 1,
    img: 1,
    hr: 1,
    progress: 1
};

var INPUT_TYPE_NO_ROLE = {
    color: 1,
    date: 1,
    datetime: 1,
    file: 1,
    hidden: 1,
    month: 1,
    time: 1,
    week: 1
};

var TAG_TO_ROLE_RESTRICTIONS = {
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

var ROLE_CONTEXT = {
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

var ROLE_GROUP_CONTEXT = {
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

var ROLE_DESCENDANTS = {
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

var ROLE_INLINE_VALUE = {
    textbox: 1,
    combobox: 1,
    menuitem: 1,
    listbox: 1,
    slider: 1
};

var TAG_HAS_ALT = {
    applet: 1,
    area: 1,
    img: 1,
    input: 1
};

var TAG_HAS_HREF = {
    a: 1,
    link: 1
};

var HYPERLINK_TYPES = {
    alternative: 1,
    author: 1,
    help: 1,
    license: 1,
    next: 1,
    prev: 1,
    search: 1
};

var ACCESSIBLE_NAME_FROM_CONTENTS = {
    button: 1,
    checkbox: 1,
    columnheader: 1,
    /*directory: 1,*/
    gridcell: 1,
    heading: 1,
    link: 1,
    listitem: 1,
    menuitem: 1,
    menuitemcheckbox: 1,
    menuitemradio: 1,
    option: 1,
    radio: 1,
    /*row: 1,*/
    /*rowgroup: 1,*/
    rowheader: 1,
    tab: 1,
    tooltip: 1,
    treeitem: 1,
    presentation: 1
};

var ABSTRACT_ROLES = {
    command: 1,
    composite: 1,
    input: 1,
    landmark: 1,
    range: 1,
    roletype: 1,
    section: 1,
    sectionhead: 1,
    select: 1,
    structure: 1,
    widget: 1,
    window: 1
};

var ATTR_VALUES = {
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
        popup: 1,
        none: 1
    },
    live: {
        off: 1,
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

    this.childs = [];

    this.nodeType = node.nodeType;
    this.nodeValue = node.nodeValue;
    this.value = node.value;
    this.textContent = node.textContent;
    this.tag = node.nodeName.toLowerCase();

    return this;
}

WrapNode.prototype.parse = function wrapNodeParse() {
    var node = this.node.firstChild,
        wrapNode;

    this.childs = [];
    while (node) {
        wrapNode = new WrapNode(node, this.ctx).parse();
        wrapNode.parentNode = this;

        this.childs.push(wrapNode);

        node = node.nextSibling;
    }

    var that = this;

    this.childs.forEach(function(child, idx) {
        child.nextSibling = that.childs[idx + 1];
        child.prevSibling = that.childs[idx - 1];
    });

    this.firstChild = this.childs[0];

    return this;
};

WrapNode.prototype.free = function wrapNodeFree() {
    delete this.node;
    delete this.ctx;

    delete this.parentNode;
    delete this.firstChild;
    delete this.nextSibling;
    delete this.prevSibling;

    this.childs.forEach(function(child) {
        child.free();
    });

    delete this.childs;
};

[
    'setRole',
    'fixRole'
].forEach(function(item) {
    WrapNode.prototype[item] = function() {
        ROLE_FROM_TAG[item](this);

        var node = this.firstChild;
        while (node) {
            node[item]();
            node = node.nextSibling;
        }

        return this;
    };
});

WrapNode.prototype.setIds = function wrapNodeSetIds() {
    if (this.nodeType === 1) {
        var id = this.getAttribute('id');
        if (id) {
            this.ctx.setElementId(id, this);
        }
    }

    var node = this.firstChild;
    while (node) {
        node.setIds();
        node = node.nextSibling;
    }

    return this;
};

WrapNode.prototype.getElementsByTagName = function wrapNodeGetElementsByTagName(name) {
    var node = this.firstChild,
        nodes = [];

    if (this.tag === name) {
        nodes.push(this);
    }

    while (node) {
        nodes.push(node.getElementsByTagName(name));
        node = node.nextSibling;
    }

    return flatten(nodes);
};

/* proxy */
extend(WrapNode.prototype, {
    hasAttribute: function wrapNodeHasAttribute() {
        return this.node.hasAttribute.apply(this.node, arguments);
    },

    getAttribute: function wrapNodeGetAttribute() {
        return this.node.getAttribute.apply(this.node, arguments);
    }
});

/* utils */
extend(WrapNode.prototype, {
    isEmbeddedControl: function() {
        return !!ROLE_INLINE_VALUE[this.role];
    },

    isHyperlink: function wrapNodeIsHyperlinkType() {
        var rel = this.getAttribute('rel') || '';
        rel = rel.toLowerCase();
        return !!HYPERLINK_TYPES[rel];
    },

    isNodeNonEmpty: function(node) {
        node = node.firstChild;
        for (; node; node = node.nextSibling) {
            if (node.nodeType === 1) {
                if (node.hidden) {
                    continue;
                }

                if (TAG_NO_CLOSING[node.tag]) {
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
        return !this.isNodeNonEmpty(this);
    },

    isPresentation: function wrapNodeIsPresentation() {
        return this.role === 'presentation';
    },

    isStrongRole: function wrapNodeIsStrongRole() {
        return !!TAG_STRONG_ROLE[this.tag];
    },

    hasParent: function wrapNodeHasParent(parentName) {
        var node = this.parentNode;
        while (node) {
            if (node.nodeType !== 1) {
                break;
            }

            if (node.tag === parentName) {
                return node;
            }

            node = node.parentNode;
        }

        return false;
    },

    mustNoRole: function wrapNodeMustNoRole() {
        if (this.tag === 'input') {
            var type = this.getAttribute('type') || 'text';
            type = type.toLowerCase();
            return !!INPUT_TYPE_NO_ROLE[type];
        }
        return !!TAG_NO_ROLE[this.tag];
    },

    mayBePresentation: function wrapNodeMayBePresentation() {
        return !!TAG_CAN_BE_PRESENTATION[this.tag];
    },

    mayTransitionToRole: function wrapNodeMayTransitionToRole(role) {
        var allowed = TAG_TO_ROLE_RESTRICTIONS[this.tag];
        if (!allowed) {
            return true;
        }
        return allowed && allowed[role];
    },

    mayAccessibleNameFromContents: function wrapNodeMayAccessibleNameFromContents() {
        var role = this.role;
        return (!role ||
                ACCESSIBLE_NAME_FROM_CONTENTS[role]);
    },

    mayHaveAlt: function wrapNodeHasAlt() {
        return !!TAG_HAS_ALT[this.tag];
    },

    mayHaveHref: function wrapNodeHasHref() {
        return !!TAG_HAS_HREF[this.tag];
    },

    getRoleFromAttr: function() {
        if (this.nodeType !== 1) {
            return '';
        }

        var roles = this.getAttribute('role');
        if (!roles) {
            return '';
        }

        return roles.split(/\s+/).filter(function(role) {
            return !ABSTRACT_ROLES[role];
        }).filter(function(str) {
            return str;
        }).shift();
    },

    hasOnlyTextChilds: function() {
        var node = this.firstChild;
        while (node) {
            if (node.nodeType !== 3) {
                return false;
            }

            node = node.nextSibling;
        }

        return true;
    },

    getTextContentFromDirectChild: function(childName) {
        var node = this.firstChild,
            iter;
        for (; node; node = node.nextSibling) {
            if (node.nodeType !== 1) {
                continue;
            }

            if (node.tag === childName) {
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

        if (!this.parentNode ||
            this.parentNode.nodeType !== 1) {
            return false;
        }

        var node = this.parentNode,
            parentRole;
        while (node) {
            if (node.nodeType !== 1) {
                break;
            }

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
        var node = this.firstChild,
            nodeCount = 0,
            role, lim;
        while (node) {
            if (node.nodeType !== 1) {
                return false;
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
            if (ATTR_VALUES[item][data]) {
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
                var elems = this.ctx.getElementsByTagName('input');
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
        return this.getAttribute('aria-invalid') === 'true';
    }
});

module.exports = WrapNode;
