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
    WORDS_FROM_ATTRIBUTES = require('./words-from-attributes');

var getAccessibleName = ACCESSIBLE_NAME.get,
    getAttrs = WORDS_FROM_ATTRIBUTES.get;

var ROLE_USE_PROCENT = {
    progressbar: 1,
    scrollbar: 1
};

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
