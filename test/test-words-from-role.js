/* global describe, it, beforeEach, afterEach, window, document */
'use strict';

var assert = require('assert'),
    Loud = require('../lib/loud');

var browser = typeof window !== 'undefined';

describe('loud', function() {
    var loud, elem;

    var data = {
        '<div role="alert">Content</div>': ['alert', 'Content', 'alert end'],
        '<div role="alertdialog">Content</div>': ['alertdialog', 'Content', 'alertdialog end'],
        '<div role="application">Content</div>': ['application', 'Content', 'application end'],
        '<div role="columnheader">Content</div>': ['Content'],
        '<div role="combobox">Content</div>': ['combobox', 'collapsed', 'haspopup', 'Content'],
        '<div role="definition">Content</div>': ['definition', 'Content', 'definition end'],
        '<div role="dialog">Content</div>': ['dialog', 'Content', 'dialog end'],
        '<div role="directory">Content</div>': ['directory', 'Content', 'directory end'],
        '<div role="grid">Content</div>': ['Content'],
        '<div role="gridcell">Content</div>': ['Content'],
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
        '<div role="radio">Content</div>': ['Content', 'radio', 'not checked'],
        '<div role="radiogroup">Content</div>': ['Content'],
        '<div role="row">Content</div>': ['Content'],
        '<div role="rowgroup">Content</div>': ['Content'],
        '<div role="rowheader">Content</div>': ['Content'],
        '<div role="status">Content</div>': ['status', 'Content', 'status end'],
        '<div role="tab">Content</div>': ['Content'],
        '<div role="tablist">Content</div>': ['Content'],
        '<div role="tablist"><div role="tab">Content</div></div>': ['tablist', 'Content', 'tab'],
        '<div role="tabpanel">Content</div>': ['tabpanel', 'Content', 'tabpanel end'],
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

        '<div role="button">Content</div>': ['Content', 'button'],
        '<div role="button" aria-pressed="unknown">Content</div>': ['Content', 'button'],
        '<div role="button" aria-pressed="true">Content</div>': ['Content', 'toggle button', 'pressed'],
        '<div role="button" aria-pressed="false">Content</div>': ['Content', 'toggle button', 'not pressed'],
        '<div role="button" aria-expanded="unknown">Content</div>': ['Content', 'button'],
        '<div role="button" aria-expanded="true">Content</div>': ['Content', 'button menu', 'expanded'],
        '<div role="button" aria-expanded="false">Content</div>': ['Content', 'button menu', 'collapsed'],
        '<div role="button" aria-expanded="true" aria-pressed="true">Content</div>': ['Content', 'button menu', 'expanded', 'pressed'],
        '<div role="button" aria-expanded="false" aria-pressed="true">Content</div>': ['Content', 'button menu', 'collapsed', 'pressed'],
        '<div role="button" aria-expanded="true" aria-pressed="false">Content</div>': ['Content', 'button menu', 'expanded', 'not pressed'],
        '<div role="button" aria-expanded="false" aria-pressed="false">Content</div>': ['Content', 'button menu', 'collapsed', 'not pressed'],

        '<div role="group">Content</div>': ['group', 'Content', 'group end'],
        '<div role="group"></div>': [],

        '<div role="list" aria-setsize="1"><div role="listitem">Content</div></div>': ['list', 'Content', 'listitem', 'list end'],
        '<div role="list"><div role="listitem" aria-posinset="1" aria-setsize="1">Content</div></div>': ['list', 'Content', 'listitem', 1, 'of', 1, 'list end'],
        '<div role="list"><div role="listitem" aria-posinset="1">Content</div></div>': ['list', 'Content', 'listitem', 'list end'],
        '<div role="list"><div role="listitem" aria-setsize="1">Content</div></div>': ['list', 'Content', 'listitem', 'list end'],

        '<div role="separator">Content</div>': ['separator'],
        '<div role="separator" aria-orientation="vertical">Content</div>': ['vertical', 'separator'],
        '<div role="separator" aria-orientation="horizontal">Content</div>': ['horizontal', 'separator'],
        '<div role="separator" aria-orientation="none">Content</div>': ['separator'],
        '<div role="separator" aria-orientation="unknown">Content</div>': ['separator'],
        '<div role="separator" aria-orientation="">Content</div>': ['separator'],

        '<div role="textbox">Content</div>': ['textbox', 'Content'],
        '<div role="textbox" aria-multiline="true">Content</div>': ['multiline', 'textbox', 'Content'],

        '<div role="progressbar">Content</div>': ['progressbar'],
        '<div role="progressbar" aria-orientation="vertical">Content</div>': ['progressbar'],
        '<div role="progressbar" aria-valuenow="10">Content</div>': ['progressbar', 10],
        '<div role="progressbar" aria-valuenow="10" aria-valuemin="0">Content</div>': ['progressbar', 10],
        '<div role="progressbar" aria-valuenow="10" aria-valuemax="4">Content</div>': ['progressbar', 10],
        '<div role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="4">Content</div>': ['progressbar', 25, 'percent'],
        '<div role="progressbar" aria-valuenow="1" aria-valuemin="4" aria-valuemax="0">Content</div>': ['progressbar', 1],
        '<div role="progressbar" aria-valuetext="Value">Content</div>': ['progressbar', 'Value'],
        '<div role="progressbar" aria-valuetext="Value" aria-valuenow="10">Content</div>': ['progressbar', 'Value'],
        '<div role="progressbar" aria-valuetext="Value" aria-valuenow="1" aria-valuemin="0">Content</div>': ['progressbar', 'Value'],
        '<div role="progressbar" aria-valuetext="Value" aria-valuenow="1" aria-valuemax="4">Content</div>': ['progressbar', 'Value'],
        '<div role="progressbar" aria-valuetext="Value" aria-valuenow="1" aria-valuemin="0" aria-valuemax="4">Content</div>': ['progressbar', 'Value'],

        '<div role="slider">Content</div>': ['slider'],
        '<div role="slider" aria-orientation="vertical">Content</div>': ['vertical', 'slider'],
        '<div role="slider" aria-orientation="horizontal">Content</div>': ['horizontal', 'slider'],
        '<div role="slider" aria-orientation="none">Content</div>': ['slider'],
        '<div role="slider" aria-orientation="unknown">Content</div>': ['slider'],
        '<div role="slider" aria-orientation="">Content</div>': ['slider'],
        '<div role="slider" aria-valuenow="10">Content</div>': ['slider', 10],
        '<div role="slider" aria-valuenow="10" aria-valuemin="0">Content</div>': ['slider', 10],
        '<div role="slider" aria-valuenow="10" aria-valuemax="4">Content</div>': ['slider', 10],
        '<div role="slider" aria-valuenow="1" aria-valuemin="0" aria-valuemax="4">Content</div>': ['slider', 1],
        '<div role="slider" aria-valuenow="1" aria-valuemin="4" aria-valuemax="0">Content</div>': ['slider', 1],
        '<div role="slider" aria-valuetext="Value">Content</div>': ['slider', 'Value'],
        '<div role="slider" aria-valuetext="Value" aria-valuenow="10">Content</div>': ['slider', 'Value'],
        '<div role="slider" aria-valuetext="Value" aria-valuenow="1" aria-valuemin="0">Content</div>': ['slider', 'Value'],
        '<div role="slider" aria-valuetext="Value" aria-valuenow="1" aria-valuemax="4">Content</div>': ['slider', 'Value'],
        '<div role="slider" aria-valuetext="Value" aria-valuenow="1" aria-valuemin="0" aria-valuemax="4">Content</div>': ['slider', 'Value'],

        '<div role="spinbutton">Content</div>': ['spinbutton'],
        '<div role="spinbutton" aria-orientation="vertical">Content</div>': ['spinbutton'],
        '<div role="spinbutton" aria-valuenow="10">Content</div>': ['spinbutton', 10],
        '<div role="spinbutton" aria-valuenow="10" aria-valuemin="0">Content</div>': ['spinbutton', 10],
        '<div role="spinbutton" aria-valuenow="10" aria-valuemax="4">Content</div>': ['spinbutton', 10],
        '<div role="spinbutton" aria-valuenow="1" aria-valuemin="0" aria-valuemax="4">Content</div>': ['spinbutton', 1],
        '<div role="spinbutton" aria-valuenow="1" aria-valuemin="4" aria-valuemax="0">Content</div>': ['spinbutton', 1],
        '<div role="spinbutton" aria-valuetext="Value">Content</div>': ['spinbutton', 'Value'],
        '<div role="spinbutton" aria-valuetext="Value" aria-valuenow="10">Content</div>': ['spinbutton', 'Value'],
        '<div role="spinbutton" aria-valuetext="Value" aria-valuenow="1" aria-valuemin="0">Content</div>': ['spinbutton', 'Value'],
        '<div role="spinbutton" aria-valuetext="Value" aria-valuenow="1" aria-valuemax="4">Content</div>': ['spinbutton', 'Value'],
        '<div role="spinbutton" aria-valuetext="Value" aria-valuenow="1" aria-valuemin="0" aria-valuemax="4">Content</div>': ['spinbutton', 'Value'],

        '<div role="scrollbar">Content</div>': ['vertical', 'scrollbar'],
        '<div role="scrollbar" aria-orientation="horizontal">Content</div>': ['horizontal', 'scrollbar'],
        '<div role="scrollbar" aria-orientation="none">Content</div>': ['scrollbar'],
        '<div role="scrollbar" aria-orientation="unknown">Content</div>': ['vertical', 'scrollbar'],
        '<div role="scrollbar" aria-orientation="">Content</div>': ['vertical', 'scrollbar'],
        '<div role="scrollbar" aria-valuenow="10">Content</div>': ['vertical', 'scrollbar', 10],
        '<div role="scrollbar" aria-valuenow="10" aria-valuemin="0">Content</div>': ['vertical', 'scrollbar', 10],
        '<div role="scrollbar" aria-valuenow="10" aria-valuemax="4">Content</div>': ['vertical', 'scrollbar', 10],
        '<div role="scrollbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="4">Content</div>': ['vertical', 'scrollbar', 25, 'percent'],
        '<div role="scrollbar" aria-valuenow="1" aria-valuemin="4" aria-valuemax="0">Content</div>': ['vertical', 'scrollbar', 1],
        '<div role="scrollbar" aria-valuetext="Value">Content</div>': ['vertical', 'scrollbar', 'Value'],
        '<div role="scrollbar" aria-valuetext="Value" aria-valuenow="10">Content</div>': ['vertical', 'scrollbar', 'Value'],
        '<div role="scrollbar" aria-valuetext="Value" aria-valuenow="1" aria-valuemin="0">Content</div>': ['vertical', 'scrollbar', 'Value'],
        '<div role="scrollbar" aria-valuetext="Value" aria-valuenow="1" aria-valuemax="4">Content</div>': ['vertical', 'scrollbar', 'Value'],
        '<div role="scrollbar" aria-valuetext="Value" aria-valuenow="1" aria-valuemin="0" aria-valuemax="4">Content</div>': ['vertical', 'scrollbar', 'Value'],

        '<div role="textbox" aria-invalid="true">Content</div>': ['textbox', 'invalid', 'Content'],
        '<div role="textbox" aria-disabled="true">Content</div>': ['textbox', 'disabled', 'Content'],

        '<div role="heading">Content</div>': ['Content', 'heading'],
        '<div role="heading" aria-level="7">Content</div>': ['Content', 'heading', 'level', '7'],
        '<div role="heading" aria-level="A">Content</div>': ['Content', 'heading', 'level', 'A'],

        '<div role="grid"><div role="row"><div role="columnheader">Content</div></div></div>': ['grid', 'row', 'Content', 'columnheader', 'grid end'],
        '<div role="grid"><div role="row"><div role="columnheader" aria-sort="ascending">Content</div></div></div>': ['grid', 'row', 'Content', 'columnheader', 'ascending', 'sort order', 'grid end'],
        '<div role="grid"><div role="row"><div role="columnheader" aria-sort="descending">Content</div></div></div>': ['grid', 'row', 'Content', 'columnheader', 'descending', 'sort order', 'grid end'],
        '<div role="grid"><div role="row"><div role="columnheader" aria-sort="other">Content</div></div></div>': ['grid', 'row', 'Content', 'columnheader', 'other', 'sort order', 'grid end'],
        '<div role="grid"><div role="row"><div role="columnheader" aria-sort="none">Content</div></div></div>': ['grid', 'row', 'Content', 'columnheader', 'grid end'],
        '<div role="grid"><div role="row"><div role="columnheader" aria-sort="unknown">Content</div></div></div>': ['grid', 'row', 'Content', 'columnheader', 'grid end'],
        '<div role="grid"><div role="row"><div role="columnheader" aria-sort="">Content</div></div></div>': ['grid', 'row', 'Content', 'columnheader', 'grid end'],

        '<div role="grid"><div role="row"><div role="rowheader">Content</div></div></div>': ['grid', 'row', 'Content', 'rowheader', 'grid end'],
        '<div role="grid"><div role="row"><div role="rowheader" aria-sort="ascending">Content</div></div></div>': ['grid', 'row', 'Content', 'rowheader', 'ascending', 'sort order', 'grid end'],
        '<div role="grid"><div role="row"><div role="rowheader" aria-sort="descending">Content</div></div></div>': ['grid', 'row', 'Content', 'rowheader', 'descending', 'sort order', 'grid end'],
        '<div role="grid"><div role="row"><div role="rowheader" aria-sort="other">Content</div></div></div>': ['grid', 'row', 'Content', 'rowheader', 'other', 'sort order', 'grid end'],
        '<div role="grid"><div role="row"><div role="rowheader" aria-sort="none">Content</div></div></div>': ['grid', 'row', 'Content', 'rowheader', 'grid end'],
        '<div role="grid"><div role="row"><div role="rowheader" aria-sort="unknown">Content</div></div></div>': ['grid', 'row', 'Content', 'rowheader', 'grid end'],
        '<div role="grid"><div role="row"><div role="rowheader" aria-sort="">Content</div></div></div>': ['grid', 'row', 'Content', 'rowheader', 'grid end'],

        '<div role="checkbox">Content</div>': ['Content', 'checkbox', 'not checked'],
        '<div role="checkbox" aria-checked="true">Content</div>': ['Content', 'checkbox', 'checked'],
        '<div role="checkbox" aria-checked="false">Content</div>': ['Content', 'checkbox', 'not checked'],
        '<div role="checkbox" aria-checked="unknown">Content</div>': ['Content', 'checkbox', 'not checked'],
        '<div role="checkbox" aria-checked="">Content</div>': ['Content', 'checkbox', 'not checked'],

        '<div role="link" aria-expanded="true">Content</div>': ['Content', 'link', 'expanded'],
        '<div role="link" aria-expanded="false">Content</div>': ['Content', 'link', 'collapsed'],
        '<div role="link" aria-expanded="unknown">Content</div>': ['Content', 'link'],
        '<div role="link" aria-expanded="">Content</div>': ['Content', 'link'],

        '<div role="listbox"><div role="option">Content</div></div>': ['listbox', 'Content', 'option'],
        '<div role="listbox"><div role="option" aria-selected="true">Content</div></div>': ['listbox', 'Content', 'option', 'selected'],
        '<div role="listbox"><div role="option" aria-selected="false">Content</div></div>': ['listbox', 'Content', 'option'],
        '<div role="listbox"><div role="option" aria-selected="unknown">Content</div></div>': ['listbox', 'Content', 'option'],
        '<div role="listbox"><div role="option" aria-selected="">Content</div></div>': ['listbox', 'Content', 'option'],

        '<div role="grid"><div role="row"><div role="gridcell" aria-selected="true">Content</div></div></div>': ['grid', 'row', 'Content', 'gridcell', 'selected', 'grid end'],
        '<div role="grid"><div role="row" aria-selected="true"><div role="gridcell">Content</div></div></div>': ['grid', 'row', 'selected', 'Content', 'gridcell', 'grid end'],
        '<div role="grid"><div role="row"><div role="rowheader" aria-selected="true">Content</div></div></div>': ['grid', 'row', 'Content', 'rowheader', 'selected', 'grid end'],
        '<div role="tablist"><div role="tab" aria-selected="true">Content</div></div>': ['tablist', 'Content', 'tab', 'selected'],
        '<div role="tree"><div role="treeitem" aria-selected="true">Content</div></div>': ['tree', 'Content', 'treeitem', 'selected'],

        '<div role="img" aria-grabbed="true"></div>': ['img', 'grabbed'],
        '<div role="img" aria-grabbed="false"></div>': ['img', 'can be grabbed'],
        '<div role="img" aria-grabbed="unknown"></div>': ['img'],
        '<div role="img" aria-grabbed=""></div>': ['img'],

        '<div role="main" aria-busy="true">Content</div>': ['main', 'busy', 'Content', 'main end'],
        '<div role="main" aria-busy="false">Content</div>': ['main', 'Content', 'main end'],
        '<div role="main" aria-busy="unknown">Content</div>':  ['main', 'Content', 'main end'],
        '<div role="main" aria-busy="">Content</div>': ['main', 'Content', 'main end'],

        '<div role="textbox" aria-required="true">Content</div>': ['textbox', 'required', 'Content'],

        '<div role="textbox" aria-readonly="true">Content</div>': ['textbox', 'readonly', 'Content'],
        '<div role="grid" aria-readonly="true"><div role="row"><div role="gridcell">Content</div></div></div>': ['grid', 'readonly', 'row', 'Content', 'gridcell', 'grid end'],
        '<div role="grid"><div role="row"><div role="gridcell" aria-readonly="true">Content</div></div></div>': ['grid', 'row', 'Content', 'gridcell', 'readonly', 'grid end'],
        '<div role="button" aria-readonly="true">Content</div>': ['Content', 'button'],

        '<div role="grid" aria-multiselectable="true"><div role="row"><div role="gridcell">Content</div></div></div>': ['grid', 'multiselectable', 'row', 'Content', 'gridcell', 'grid end'],
        '<div role="listbox" aria-multiselectable="true"><div role="option">Content</div></div>': ['listbox', 'multiselectable', 'Content', 'option'],
        '<div role="tablist" aria-multiselectable="true"><div role="tab">Content</div></div>': ['tablist', 'multiselectable', 'Content', 'tab'],
        '<div role="tree" aria-multiselectable="true"><div role="treeitem">Content</div></div>': ['tree', 'multiselectable', 'Content', 'treeitem'],
        '<div role="treegrid" aria-multiselectable="true"><div role="row"><div role="gridcell">Content</div></div></div>': ['treegrid', 'multiselectable', 'row', 'Content', 'gridcell', 'treegrid end'],

        '<div role="button" aria-haspopup="true">Content</div>': ['Content', 'button', 'haspopup'],

        '<div role="textbox" aria-autocomplete="inline">Content</div>': ['textbox', 'autocomplete', 'inline', 'Content'],
        '<div role="textbox" aria-autocomplete="list">Content</div>': ['textbox', 'autocomplete', 'list', 'Content'],
        '<div role="textbox" aria-autocomplete="both">Content</div>': ['textbox', 'autocomplete', 'both', 'Content'],
        '<div role="textbox" aria-autocomplete="none">Content</div>': ['textbox', 'Content'],
        '<div role="textbox" aria-autocomplete="unknown">Content</div>': ['textbox', 'Content'],
        '<div role="textbox" aria-autocomplete="">Content</div>': ['textbox', 'Content'],

        '<div role="textbox" aria-activedescendant="text">Content</div><div id="text">Text</div>': ['textbox', 'Text', 'Content', 'Text'],
        '<div role="textbox" aria-activedescendant="unknown">Content</div><div id="text">Text</div>': ['textbox', 'Content', 'Text'],
        '<div role="textbox" aria-activedescendant="">Content</div><div id="text">Text</div>': ['textbox', 'Content', 'Text'],
        '<div role="textbox" aria-activedescendant="text">Content</div><div id="text"></div>': ['textbox', 'Content'],

        '<div role="slider" aria-controls="id">Content</div><div id="id"></div>': ['slider', 'controls', 'id'],
        '<div role="slider" aria-controls="id1 id2">Content</div><div id="id1"></div><div id="id2"></div>': ['slider', 'controls', 'id1', 'id2'],
        '<div role="slider" aria-controls="unknown">Content</div><div id="id"></div>': ['slider'],
        '<div role="slider" aria-controls="">Content</div><div id="id"></div>': ['slider'],

        '<div role="button" aria-flowto="id">Content</div><div id="id"></div>': ['Content', 'button', 'flowto', 'id'],
        '<div role="button" aria-flowto="id1 id2">Content</div><div id="id1"></div><div id="id2"></div>': ['Content', 'button', 'flowto', 'id1', 'id2'],
        '<div role="button" aria-flowto="unknown">Content</div><div id="id"></div>': ['Content', 'button'],
        '<div role="button" aria-flowto="">Content</div><div id="id"></div>': ['Content', 'button'],

        '<div role="button" aria-describedby="id">Content</div><div id="id">Text</div>': ['Content', 'button', 'Text', 'Text'],
        '<div role="button" aria-describedby="id1 id2">Content</div><div id="id1">Text1</div><div id="id2">Text2</div>': ['Content', 'button', 'Text1 Text2', 'Text1', 'Text2'],
        '<div role="button" aria-describedby="unknown">Content</div><div id="id">Text</div>': ['Content', 'button', 'Text'],
        '<div role="button" aria-describedby="">Content</div><div id="id">Text</div>': ['Content', 'button', 'Text'],

        '<div role="list"><div role="group"><div role="listitem">Content</div></div></div>': ['list', 'group', 'Content', 'listitem', 'group end', 'list end'],
        '<div role="group"><div role="listitem">Content</div></div>': ['group', 'Content', 'group end'],
        '<div role="group"><div role="menuitem">Content</div></div>': ['group', 'Content', 'group end'],
        '<div role="group"><div role="treeitem">Content</div></div>': ['group', 'Content', 'group end'],

        '<div role="list"><div role="button">Content</div></div>': ['Content', 'button'],
        '<div role="list"><div role="group"><div role="button">Content</div></div></div></div>': ['group', 'Content', 'button', 'group end']
    };

    beforeEach(function() {
        loud = new Loud();

        if (browser) {
            elem = document.createElement('div');
            document.body.appendChild(elem);
        }
    });

    afterEach(function() {
        if (browser) {
            document.body.removeChild(elem);
        }

        loud = null;
    });

    Object.keys(data).forEach(function(key) {
        it('handles ' + key, function() {
            if (browser) {
                elem.innerHTML = key;
                assert.deepEqual(loud.say(elem), data[key]);
            } else {
                assert.deepEqual(loud.say(key), data[key]);
            }
        });
    });
});
