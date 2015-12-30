(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.loud = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 Ruslan Sagitov
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
    capitalize = UTIL.capitalize;

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
    hr: 1,
    img: 1,
    input: 1,
    menuitem: 1,
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

function A11yNode(node) {
    this.node = node;

    this.childs = [];

    this.nodeType = node.nodeType;
    this.nodeValue = node.nodeValue;
    this.value = node.value;
    this.textContent = node.textContent || node.innerText;
    this.tag = node.nodeName.toLowerCase();

    return this;
}

A11yNode.prototype.parse = function() {
    var node = this.node.firstChild,
        newNode;

    this.childs = [];
    for (; node; node = node.nextSibling) {
        newNode = new A11yNode(node).parse();
        newNode.parentNode = this;

        this.childs.push(newNode);
    }

    var that = this;

    this.childs.forEach(function(child, idx) {
        child.nextSibling = that.childs[idx + 1];
    });

    this.firstChild = this.childs[0];

    return this;
};

A11yNode.prototype.free = function() {
    delete this.node;

    delete this.parentNode;
    delete this.firstChild;
    delete this.nextSibling;

    this.childs.forEach(function(child) {
        child.free();
    });

    delete this.childs;
};

[
    'setRole',
    'fixRole'
].forEach(function(item) {
    A11yNode.prototype[item] = function(inst) {
        ROLE_FROM_TAG[item].call(inst, this);

        var node = this.firstChild;
        for (; node; node = node.nextSibling) {
            if (node.nodeType === 1) {
                node[item](inst);
            }
        }

        return this;
    };
});

A11yNode.prototype.setIds = function(inst) {
    if (this.nodeType === 1) {
        var id = this.getAttribute('id');
        if (id) {
            inst.setElementId(id, this);
        }
    }

    var node = this.firstChild;
    for (; node; node = node.nextSibling) {
        node.setIds(inst);
    }

    return this;
};

A11yNode.prototype.getElementsByTagName = function(name) {
    var node = this.firstChild,
        nodes = [];

    if (this.tag === name) {
        nodes.push(this);
    }

    for (; node; node = node.nextSibling) {
        nodes.push(node.getElementsByTagName(name));
    }

    return flatten(nodes);
};

/* proxy */
extend(A11yNode.prototype, {
    hasAttribute: function() {
        return this.node.hasAttribute.apply(this.node, arguments);
    },

    getAttribute: function() {
        return this.node.getAttribute.apply(this.node, arguments);
    }
});

/* utils */
extend(A11yNode.prototype, {
    isEmbeddedControl: function() {
        return !!ROLE_INLINE_VALUE[this.role];
    },

    isHyperlink: /* istanbul ignore next */ function() {
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

    isEmpty: function() {
        return !this.isNodeNonEmpty(this);
    },

    isPresentation: function() {
        return this.role === 'presentation';
    },

    isStrongRole: function() {
        return !!TAG_STRONG_ROLE[this.tag];
    },

    hasParent: function(parentName) {
        var node = this.parentNode;
        for (; node; node = node.parentNode) {
            if (node.tag === parentName) {
                return node;
            }
        }

        return false;
    },

    mustNoRole: function() {
        if (this.tag === 'input') {
            var type = this.getAttribute('type') || 'text';
            type = type.toLowerCase();
            return !!INPUT_TYPE_NO_ROLE[type];
        }
        return !!TAG_NO_ROLE[this.tag];
    },

    mayBePresentation: function() {
        return !!TAG_CAN_BE_PRESENTATION[this.tag];
    },

    mayTransitionToRole: function(role) {
        var allowed = TAG_TO_ROLE_RESTRICTIONS[this.tag];
        if (!allowed) {
            return true;
        }
        return allowed && allowed[role];
    },

    mayAccessibleNameFromContents: function() {
        var role = this.role;
        return (!role || ACCESSIBLE_NAME_FROM_CONTENTS[role]);
    },

    isInputInsideLabel: function() {
        var id = this.getAttribute('id');
        if (id && this.tag === 'input') {
            var node = this.parentNode;
            for (; node; node = node.parentNode) {
                if (node.tag === 'label' &&
                    node.getAttribute('for') === id) {
                    return true;
                }
            }
        }
    },

    mayHaveAlt: function() {
        return !!TAG_HAS_ALT[this.tag];
    },

    mayHaveHref: function() {
        return !!TAG_HAS_HREF[this.tag];
    },

    getRoleFromAttr: function() {
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
        for (; node; node = node.nextSibling) {
            if (node.nodeType !== 3) {
                return false;
            }
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
                for (; iter; iter = iter.nextSibling) {
                    if (iter.nodeType !== 3) {
                        return '';
                    }
                }

                return node.textContent;
            }
        }
    }
});

/* relationship */
extend(A11yNode.prototype, {
    ownedByValidRolesFor: function(role) {
        var context = ROLE_CONTEXT[role];
        if (!context) {
            return true;
        }

        var node = this.parentNode,
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
    },

    ownsValidRolesFor: function(role) {
        var limits = ROLE_DESCENDANTS[role];
        if (!limits) {
            return true;
        }

        return this.isDescendantsValid(limits);
    },

    isDescendantsValid: function(limits) {
        var node = this.firstChild,
            nodeCount = 0,
            role, lim;
        for (; node; node = node.nextSibling) {
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
    var funcName = 'get' + capitalize(item);

    A11yNode.prototype[funcName] = function() {
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
    'expanded',
    'pressed',
    'grabbed'
].forEach(function(item) {
    var funcName = 'get' + capitalize(item);

    A11yNode.prototype[funcName] = function() {
        var attr = 'aria-' + item;
        if (this.hasAttribute(attr)) {
            var a = this.getAttribute(attr);
            return a === 'true' ? true : (a === 'false' ? false : a);
        }
    };
});

extend(A11yNode.prototype, {
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

    getSelected: function() {
        if (this.hasAttribute('aria-selected')) {
            return this.getAttribute('aria-selected') === 'true';
        }
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
extend(A11yNode.prototype, {
    isSelected: function() {
        return this.node.selected;
    },

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

    isHidden: function(inst) {
        /* istanbul ignore next */
        if (this.tag === 'datalist') {
            var id = this.getAttribute('id');
            if (id) {
                var elems = inst.getElementsByTagName('input');
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

module.exports = A11yNode;

},{"./role-from-tag":4,"./util":5}],2:[function(require,module,exports){
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 Ruslan Sagitov
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

var toArray = UTIL.toArray;

var TAG_LABEL_TAG = {
    table: 'caption',
    fieldset: 'legend',
    figure: 'figcaption',
    details: 'summary'
};

var getFrom = [
    function(node, recurse) {
        var ids = node.getAttribute('aria-labelledby');
        if (!recurse && ids) {
            var that = this;
            return ids.split(/\s+/).map(function(id) {
                var elem = that.getElementById(id);
                if (elem) {
                    var val = that.getAccessibleName(elem, true);
                    return val && val.trim();
                }
            }).filter(function(str) {
                return str;
            }).join(' ');
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
            var label = TAG_LABEL_TAG[node.tag];
            if (label) {
                return node.getTextContentFromDirectChild(label);
            }
        }
    },

    function(node, recurse) {
        if ((!recurse || !node.isEmbeddedControl()) &&
            !node.isPresentation()) {
            var id = node.getAttribute('id');
            if (id) {
                var elems = this.getElementsByTagName('label');
                elems = toArray.call(elems).filter(function(label) {
                    return label.getAttribute('for') === id;
                });

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

        var name = [],
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
    var name = node.accessibleName,
        that = this;
    if (typeof name !== 'undefined') {
        return name;
    }

    getFrom.some(function(callback) {
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
 * Copyright (c) 2014-2015 Ruslan Sagitov
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

var getWordsFromRole = require('./words-from-role'),
    getWordsFromAttributes = require('./words-from-attributes'),
    getAccessibleName = require('./accessible-name'),
    A11yNode = require('./a11y-node'),
    UTIL = require('./util');

var flatten = UTIL.flatten;

function Loud() {
    return this;
}

Loud.prototype.say = function(node) {
    if (!node || !node.length) {
        node = [node];
    }

    var res = [];

    for (var i = 0; i < node.length; i++) {
        if (!node[i]) {
            continue;
        }

        this.elementById = {};

        this.root = new A11yNode(node[i], this);
        this.root.parse().setIds(this).setRole(this).fixRole(this);

        res.push(this.handleNode(this.root));

        this.root.free();
        delete this.root;
        delete this.elementById;
    }

    return flatten(res);
};

Loud.prototype.setElementId = function(id, node) {
    this.elementById[id] = node;
};

Loud.prototype.getElementById = function(id) {
    return this.elementById[id];
};

Loud.prototype.getElementsByTagName = function(name) {
    return this.root.getElementsByTagName(name);
};

Loud.prototype.traverse = function(node) {
    var iter = node.firstChild,
        value = [],
        val;
    for (; iter; iter = iter.nextSibling) {
        val = this.handleNode(iter);
        if (val) {
            value.push(val);
        }
    }

    return flatten(value);
};

Loud.prototype.handleNode = function(node) {
    switch (node.nodeType) {
        case 1: /* ELEMENT */
            break;
        case 3: /* TEXTNODE */
            return node.nodeValue.trim();
    }

    if (node.hidden) {
        return '';
    }

    return this.getWordsFromRole(node);
};

Loud.prototype.getAccessibleName = getAccessibleName;
Loud.prototype.getWordsFromRole = getWordsFromRole;
Loud.prototype.getWordsFromAttributes = getWordsFromAttributes;

module.exports = {
    /**
     * @type {String}
     */
    VERSION: '0.8.4',

    /**
     * Transform a DOM element to words.
     *
     * @param {Object|Object[]} node - DOM element or array of
     *                                 DOM elements
     * @returns {String[]} Words
     */
    say: function(node) {
        return (new Loud()).say(node);
    }
};

},{"./a11y-node":1,"./accessible-name":2,"./util":5,"./words-from-attributes":6,"./words-from-role":7}],4:[function(require,module,exports){
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 Ruslan Sagitov
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

var isFunction = UTIL.isFunction,
    extend = UTIL.extend,
    capitalize = UTIL.capitalize;

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

var roleToObject = function(roleData) {
    if (typeof roleData === 'string') {
        return {role: roleData};
    }

    return extend({}, roleData || {});
};

var getTextboxRole = function(node) {
    var listId = node.getAttribute('list'),
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

var range = function(role) {
    return function(node) {
        return {
            role: role,
            valuenow: node.getAttribute('value'),
            valuemin: node.getAttribute('min'),
            valuemax: node.getAttribute('max')
        };
    };
};

var TAG_INPUT_GET_ROLE = {
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

var TAG_TO_ROLE = {
    a: 'link',
    address: 'contentinfo',
    area: 'link',
    article: 'article',
    aside: 'complementary',
    body: 'document',
    button: 'button',
    caption: function(node) {
        /* istanbul ignore else */
        if (node.hasParent('table')) {
            return {
                part: true,
                hidden: node.hasOnlyTextChilds()
            };
        }
    },
    colgroup: function(node) {
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
    figcaption: function(node) {
        if (node.hasParent('figure') &&
            node.hasOnlyTextChilds()) {
            return {hidden: true};
        }
    },
    footer: function(node) {
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
    header: function(node) {
        if (!node.hasParent('article') &&
            !node.hasParent('section')) {
            return 'banner';
        }
        return '';
    },
    hr: 'separator',
    img: function(node) {
        var alt = node.getAttribute('alt');
        if (alt === '') {
            return 'presentation';
        }
        return 'img';
    },
    input: function(node) {
        if (node.mustNoRole()) {
            return '';
        }

        var type = node.getAttribute('type') || 'text',
            getRole = TAG_INPUT_GET_ROLE[type],
            roleData = isFunction(getRole) ?
                       getRole.call(this, node) : getRole;

        return roleToObject(roleData);
    },
    legend: function(node) {
        if (node.hasParent('fieldset') &&
            node.hasOnlyTextChilds()) {
            return {hidden: true};
        }
    },
    li: 'listitem',
    link: /* istanbul ignore next */ function(node) {
        if (node.isHyperlink()) {
            return 'link';
        }

        return '';
    },
    main: 'main',
    menu: function(node) {
        var type = node.getAttribute('type');
        return type === 'toolbar' ? 'toolbar' : 'menu';
    },
    menuitem: 'menuitem',
    nav: 'navigation',
    ol: 'list',
    optgroup: function(node) {
        if (node.hasParent('select')) {
            return 'group';
        }

        return '';
    },
    option: function(node) {
        return {
            role: 'option',
            selected: node.isSelected()
        };
    },
    progress: range('progressbar'),
    section: 'region',
    select: function(node) {
        return {
            role: 'listbox',
            multiselectable: node.hasAttribute('multiple')
        };
    },
    summary: function(node) {
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
    th: function(node) {
        if (node.getAttribute('scope') === 'row') {
            return 'rowheader';
        }

        return 'columnheader';
    },
    thead: 'rowgroup',
    tr: 'row',
    ul: {role: 'list', numbered: true}
};

var setGlobalAttrs = function(node) {
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
        hidden: node.hidden || node.isHidden(this),
        invalid: node.isInvalid()
    });
};

var setLocalAttrs = function(node) {
    var role = node.role,
        attrs = ROLE_LOCAL_ATTRS[role] || [];

    attrs.forEach(function(attr) {
        if (typeof node[attr] !== 'undefined') {
            return;
        }

        var funcName = 'get' + capitalize(attr),
            value;
        if (isFunction(node[funcName])) {
            value = node[funcName]();
            if (value !== null) {
                node[attr] = value;
            }
        } else {
            if (node.hasAttribute('aria-' + attr)) {
                node[attr] = node.getAttribute('aria-' + attr);
            }
        }
    });
};

var setDefaults = function(node) {
    var role = node.role,
        data = DEFAULT_FOR[role];

    if (data) {
        Object.keys(data).forEach(function(key) {
            if (!node[key]) {
                node[key] = data[key];
            }
        });
    }
};

var setRole = function(node) {
    var getRole = TAG_TO_ROLE[node.tag] || '',
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
    node.hidden = roleData.hidden;

    if (role && role !== 'presentation') {
        extend(node, roleData);
        node.role = role;
        setGlobalAttrs.call(this, node);
    }
};

var fixRole = function(node) {
    var role = node.role;
    if (role && role !== 'presentation') {
        if (!node.ownsValidRolesFor(role) ||
            !node.ownedByValidRolesFor(role)) {
            delete node.role;
        }

        setLocalAttrs.call(this, node);
        setDefaults.call(this, node);
    }
};

exports.setRole = setRole;
exports.fixRole = fixRole;

},{"./util":5}],5:[function(require,module,exports){
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 Ruslan Sagitov
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

exports.extend = function(obj, src) {
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

exports.isFunction = function(val) {
    return typeof val === 'function';
};

exports.toArray = Array.prototype.slice;

var flatten = exports.flatten = function(array) {
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

exports.capitalize = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

},{}],6:[function(require,module,exports){
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 Ruslan Sagitov
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
        var desc = node.describedby.split(/\s+/).map(function(id) {
            var elem = that.getElementById(id);
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
            ids = node[item].split(/\s+/).map(function(id) {
                return that.getElementById(id) ? id : '';
            }).filter(function(str) {
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

},{}],7:[function(require,module,exports){
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 Ruslan Sagitov
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

var flatten = UTIL.flatten;

var ROLE_USE_PROCENT = {
    progressbar: 1,
    scrollbar: 1
};

var deep = function(roleName) {
    return function(node) {
        return [
            this.getAccessibleName(node),
            roleName,
            this.getWordsFromAttributes(node),
            this.traverse(node)
        ];
    };
};

var flat = function(roleName) {
    return function(node) {
        return [
            this.getAccessibleName(node),
            roleName,
            this.getWordsFromAttributes(node)
        ];
    };
};

var range = function(roleName) {
    return function(node) {
        var role = node.role,
            valuetext = node.valuetext,
            valuenow = node.valuenow,
            valuemin = node.valuemin,
            valuemax = node.valuemax,
            value = node.value || '',
            orientation = node.orientation;

        if (valuetext) {
            value = valuetext;
        } else if (valuenow && valuemin && valuemax) {
            valuenow = parseInt(valuenow, 10);
            valuemin = parseInt(valuemin, 10);
            valuemax = parseInt(valuemax, 10);

            if (ROLE_USE_PROCENT[role]) {
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
            this.getAccessibleName(node),
            orientation && orientation !== 'none' ? orientation : '',
            roleName,
            value,
            this.getWordsFromAttributes(node)
        ];
    };
};

var region = function(before, after) {
    return function(node) {
        if (node.isEmpty()) {
            return [];
        }

        var name = this.getAccessibleName(node);

        return [
            name, before,
            this.getWordsFromAttributes(node),
            this.traverse(node),
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
    button: function(node) {
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
    grid: function(node) {
        var table = node.table;
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
    separator: function(node) {
        var orientation = node.orientation;
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
    textbox: function(node) {
        var multiline = node.multiline,
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
    var handler = HANDLERS[node.role];
    if (!handler) {
        return this.traverse(node);
    }

    var value = flatten(handler.call(this, node));

    return value.filter(function(str) {
        return str;
    });
};

},{"./util":5}]},{},[3])(3)
});