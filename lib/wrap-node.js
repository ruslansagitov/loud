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
    UTIL = require('./util'),
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
