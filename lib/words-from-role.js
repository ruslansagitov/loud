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

const flatten = UTIL.flatten;

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
