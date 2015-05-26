/* global describe, it */
'use strict';

var assert = require('assert'),
    Loud = require('../lib/loud'),
    jsdom = require('./jsdom');

describe('loud', function() {
    var loud = new Loud();

    var data = {
        '<div role="alert">Content</div>': ['alert', 'Content', 'alert end'],
        '<div role="alertdialog">Content</div>': ['alertdialog', 'Content', 'alertdialog end'],
        '<div role="application">Content</div>': ['application', 'Content', 'application end'],
        '<div role="button">Content</div>': ['Content', 'button'],
        '<div role="checkbox">Content</div>': ['Content', 'checkbox', 'not checked'],
        '<div role="columnheader">Content</div>': ['Content'],
        '<div role="combobox">Content</div>': ['combobox', 'collapsed', 'haspopup', 'Content'],
        '<div role="definition">Content</div>': ['definition', 'Content', 'definition end'],
        '<div role="dialog">Content</div>': ['dialog', 'Content', 'dialog end'],
        '<div role="directory">Content</div>': ['directory', 'Content', 'directory end'],
        '<div role="grid">Content</div>': ['Content'],
        '<div role="gridcell">Content</div>': ['Content'],
        '<div role="group">Content</div>': ['group', 'Content', 'group end'],
        '<div role="group"></div>': [],
        '<div role="heading">Content</div>': ['Content', 'heading'],
        '<div role="img">Content</div>': ['img'],
        '<div role="link">Content</div>': ['Content', 'link'],
        '<div role="list">Content</div>': ['Content'],
        '<div role="list"><div role="listitem">Content</div></div>': ['list', 'Content', 'listitem', 'list end'],
        '<div role="listbox">Content</div>': ['Content'],
        '<div role="listitem">Content</div>': ['Content'],
        '<div role="log">Content</div>': ['log', 'Content', 'log end'],
        '<div role="marquee">Content</div>': ['marquee', 'Content', 'marquee end'],
        '<div role="math">Content</div>': ['math'],
        '<div role="menu">Content</div>': ['Content'],
        '<div role="menu"><div role="menuitem">Content</div></div>': ['menu', 'Content', 'menuitem'],
        '<div role="menubar">Content</div>': ['menubar', 'Content'],
        '<div role="menuitem">Content</div>': ['Content'],
        '<div role="menu"><div role="menuitemcheckbox">Content</div></div>': ['menu', 'Content', 'menuitemcheckbox', 'not checked'],
        '<div role="menu"><div role="menuitemradio">Content</div></div>': ['menu', 'Content', 'menuitemradio', 'not checked'],
        '<div role="note">Content</div>': ['note', 'Content', 'note end'],
        '<div role="option">Content</div>': ['Content'],
        '<div role="presentation">Content</div>': ['Content'],
        '<div role="progressbar">Content</div>': ['progressbar'],
        '<div role="radio">Content</div>': ['Content', 'radio', 'not checked'],
        '<div role="radiogroup">Content</div>': ['Content'],
        '<div role="row">Content</div>': ['Content'],
        '<div role="rowgroup">Content</div>': ['Content'],
        '<div role="rowheader">Content</div>': ['Content'],
        '<div role="scrollbar">Content</div>': ['vertical', 'scrollbar'],
        '<div role="separator">Content</div>': ['separator'],
        '<div role="slider">Content</div>': ['slider'],
        '<div role="spinbutton">Content</div>': ['spinbutton'],
        '<div role="status">Content</div>': ['status', 'Content', 'status end'],
        '<div role="tab">Content</div>': ['Content'],
        '<div role="tablist">Content</div>': ['Content'],
        '<div role="tablist"><div role="tab">Content</div></div>': ['tablist', 'Content', 'tab'],
        '<div role="tabpanel">Content</div>': ['tabpanel', 'Content', 'tabpanel end'],
        '<div role="textbox">Content</div>': ['textbox', 'Content'],
        '<div role="timer">Content</div>': ['timer', 'Content', 'timer end'],
        '<div role="toolbar">Content</div>': ['toolbar', 'Content', 'toolbar end'],
        '<div role="tooltip">Content</div>': ['Content', 'tooltip'],
        '<div role="tree">Content</div>': ['Content'],
        '<div role="tree"><div role="treeitem">Content</div></div>': ['tree', 'Content', 'treeitem'],
        '<div role="treegrid">Content</div>': ['Content'],
        '<div role="treegrid"><div role="row"><div role="gridcell">Content</div></div></div>': ['treegrid', 'row', 'Content', 'gridcell', 'treegrid end'],
        '<div role="treeitem">Content</div>': ['Content'],

        '<div role="article">Content</div>': ['article', 'Content', 'article end'],
        '<div role="article"></div>': [],
        '<div role="banner">Content</div>': ['banner', 'Content', 'banner end'],
        '<div role="banner"></div>': [],
        '<div role="complementary">Content</div>': ['complementary', 'Content', 'complementary end'],
        '<div role="complementary"></div>': [],
        '<div role="contentinfo">Content</div>': ['contentinfo', 'Content', 'contentinfo end'],
        '<div role="contentinfo"></div>': [],
        '<div role="document">Content</div>': ['document', 'Content', 'document end'],
        '<div role="document"></div>': [],
        '<div role="form">Content</div>': ['form', 'Content', 'form end'],
        '<div role="form"></div>': [],
        '<div role="main">Content</div>': ['main', 'Content', 'main end'],
        '<div role="main"></div>': [],
        '<div role="navigation">Content</div>': ['navigation', 'Content', 'navigation end'],
        '<div role="navigation"></div>': [],
        '<div role="region">Content</div>': ['region', 'Content', 'region end'],
        '<div role="region"></div>': [],
        '<div role="search">Content</div>': ['search', 'Content', 'search end'],
        '<div role="search"></div>': [],

        '<div role="grid"><div role="row"><div role="columnheader">Content</div></div></div>': ['grid', 'row', 'Content', 'columnheader', 'grid end'],
        '<div role="grid"><div role="row"><div role="rowheader">Content</div></div></div>': ['grid', 'row', 'Content', 'rowheader', 'grid end'],

        '<div role="list"><div role="group"><div role="listitem">Content</div></div></div>': ['list', 'group', 'Content', 'listitem', 'group end', 'list end'],
        '<div role="group"><div role="listitem">Content</div></div>': ['group', 'Content', 'group end'],
        '<div role="group"><div role="menuitem">Content</div></div>': ['group', 'Content', 'group end'],
        '<div role="group"><div role="treeitem">Content</div></div>': ['group', 'Content', 'group end'],

        '<div role="list"><div role="button">Content</div></div>': ['Content', 'button'],
        '<div role="list"><div role="group"><div role="button">Content</div></div></div></div>': ['group', 'Content', 'button', 'group end']
    };

    Object.keys(data).forEach(function(key) {
        it('handles ' + key, function() {
            assert.deepEqual(loud.say(jsdom(key)), data[key]);
        });
    });
});
