/* globals loud */
'use strict';

describe('loud', () => {
    let data = {
        '<div role="button" style="display:none">Content</div>': [],
        '<div role="button" aria-hidden="true">Content</div>': [],
        '<div role="button" style="visibility:hidden">Content</div>': [],
        '<div role="button" hidden>Content</div>': [],
        '<div style="display:none"><div role="button">Content</div></div>': [],

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

        '<div role="list" aria-setsize="1"><div role="listitem">Content</div></div>': ['list', 'Content', 'listitem', 'list end'],
        '<div role="list"><div role="listitem" aria-posinset="1" aria-setsize="1">Content</div></div>': ['list', 'Content', 'listitem', '1', 'of', '1', 'list end'],
        '<div role="list"><div role="listitem" aria-posinset="1">Content</div></div>': ['list', 'Content', 'listitem', 'list end'],
        '<div role="list"><div role="listitem" aria-setsize="1">Content</div></div>': ['list', 'Content', 'listitem', 'list end'],

        '<div role="separator" aria-orientation="vertical">Content</div>': ['vertical', 'separator'],
        '<div role="separator" aria-orientation="horizontal">Content</div>': ['horizontal', 'separator'],
        '<div role="separator" aria-orientation="none">Content</div>': ['separator'],
        '<div role="separator" aria-orientation="unknown">Content</div>': ['separator'],
        '<div role="separator" aria-orientation="">Content</div>': ['separator'],

        '<div role="textbox" aria-multiline="true">Content</div>': ['multiline', 'textbox', 'Content'],

        '<div role="progressbar" aria-orientation="vertical">Content</div>': ['progressbar'],
        '<div role="progressbar" aria-valuenow="10">Content</div>': ['progressbar', '10'],
        '<div role="progressbar" aria-valuenow="10" aria-valuemin="0">Content</div>': ['progressbar', '10'],
        '<div role="progressbar" aria-valuenow="10" aria-valuemax="4">Content</div>': ['progressbar', '10'],
        '<div role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="4">Content</div>': ['progressbar', '25', 'percent'],
        '<div role="progressbar" aria-valuenow="1" aria-valuemin="4" aria-valuemax="0">Content</div>': ['progressbar', '1'],
        '<div role="progressbar" aria-valuetext="Value">Content</div>': ['progressbar', 'Value'],
        '<div role="progressbar" aria-valuetext="Value" aria-valuenow="10">Content</div>': ['progressbar', 'Value'],
        '<div role="progressbar" aria-valuetext="Value" aria-valuenow="1" aria-valuemin="0">Content</div>': ['progressbar', 'Value'],
        '<div role="progressbar" aria-valuetext="Value" aria-valuenow="1" aria-valuemax="4">Content</div>': ['progressbar', 'Value'],
        '<div role="progressbar" aria-valuetext="Value" aria-valuenow="1" aria-valuemin="0" aria-valuemax="4">Content</div>': ['progressbar', 'Value'],

        '<div role="slider" aria-orientation="vertical">Content</div>': ['vertical', 'slider'],
        '<div role="slider" aria-orientation="horizontal">Content</div>': ['horizontal', 'slider'],
        '<div role="slider" aria-orientation="none">Content</div>': ['slider'],
        '<div role="slider" aria-orientation="unknown">Content</div>': ['slider'],
        '<div role="slider" aria-orientation="">Content</div>': ['slider'],
        '<div role="slider" aria-valuenow="10">Content</div>': ['slider', '10'],
        '<div role="slider" aria-valuenow="10" aria-valuemin="0">Content</div>': ['slider', '10'],
        '<div role="slider" aria-valuenow="10" aria-valuemax="4">Content</div>': ['slider', '10'],
        '<div role="slider" aria-valuenow="1" aria-valuemin="0" aria-valuemax="4">Content</div>': ['slider', '1'],
        '<div role="slider" aria-valuenow="1" aria-valuemin="4" aria-valuemax="0">Content</div>': ['slider', '1'],
        '<div role="slider" aria-valuetext="Value">Content</div>': ['slider', 'Value'],
        '<div role="slider" aria-valuetext="Value" aria-valuenow="10">Content</div>': ['slider', 'Value'],
        '<div role="slider" aria-valuetext="Value" aria-valuenow="1" aria-valuemin="0">Content</div>': ['slider', 'Value'],
        '<div role="slider" aria-valuetext="Value" aria-valuenow="1" aria-valuemax="4">Content</div>': ['slider', 'Value'],
        '<div role="slider" aria-valuetext="Value" aria-valuenow="1" aria-valuemin="0" aria-valuemax="4">Content</div>': ['slider', 'Value'],

        '<div role="spinbutton" aria-orientation="vertical">Content</div>': ['spinbutton'],
        '<div role="spinbutton" aria-valuenow="10">Content</div>': ['spinbutton', '10'],
        '<div role="spinbutton" aria-valuenow="10" aria-valuemin="0">Content</div>': ['spinbutton', '10'],
        '<div role="spinbutton" aria-valuenow="10" aria-valuemax="4">Content</div>': ['spinbutton', '10'],
        '<div role="spinbutton" aria-valuenow="1" aria-valuemin="0" aria-valuemax="4">Content</div>': ['spinbutton', '1'],
        '<div role="spinbutton" aria-valuenow="1" aria-valuemin="4" aria-valuemax="0">Content</div>': ['spinbutton', '1'],
        '<div role="spinbutton" aria-valuetext="Value">Content</div>': ['spinbutton', 'Value'],
        '<div role="spinbutton" aria-valuetext="Value" aria-valuenow="10">Content</div>': ['spinbutton', 'Value'],
        '<div role="spinbutton" aria-valuetext="Value" aria-valuenow="1" aria-valuemin="0">Content</div>': ['spinbutton', 'Value'],
        '<div role="spinbutton" aria-valuetext="Value" aria-valuenow="1" aria-valuemax="4">Content</div>': ['spinbutton', 'Value'],
        '<div role="spinbutton" aria-valuetext="Value" aria-valuenow="1" aria-valuemin="0" aria-valuemax="4">Content</div>': ['spinbutton', 'Value'],

        '<div role="scrollbar" aria-orientation="horizontal">Content</div>': ['horizontal', 'scrollbar'],
        '<div role="scrollbar" aria-orientation="none">Content</div>': ['scrollbar'],
        '<div role="scrollbar" aria-orientation="unknown">Content</div>': ['vertical', 'scrollbar'],
        '<div role="scrollbar" aria-orientation="">Content</div>': ['vertical', 'scrollbar'],
        '<div role="scrollbar" aria-valuenow="10">Content</div>': ['vertical', 'scrollbar', '10'],
        '<div role="scrollbar" aria-valuenow="10" aria-valuemin="0">Content</div>': ['vertical', 'scrollbar', '10'],
        '<div role="scrollbar" aria-valuenow="10" aria-valuemax="4">Content</div>': ['vertical', 'scrollbar', '10'],
        '<div role="scrollbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="4">Content</div>': ['vertical', 'scrollbar', '25', 'percent'],
        '<div role="scrollbar" aria-valuenow="1" aria-valuemin="4" aria-valuemax="0">Content</div>': ['vertical', 'scrollbar', '1'],
        '<div role="scrollbar" aria-valuetext="Value">Content</div>': ['vertical', 'scrollbar', 'Value'],
        '<div role="scrollbar" aria-valuetext="Value" aria-valuenow="10">Content</div>': ['vertical', 'scrollbar', 'Value'],
        '<div role="scrollbar" aria-valuetext="Value" aria-valuenow="1" aria-valuemin="0">Content</div>': ['vertical', 'scrollbar', 'Value'],
        '<div role="scrollbar" aria-valuetext="Value" aria-valuenow="1" aria-valuemax="4">Content</div>': ['vertical', 'scrollbar', 'Value'],
        '<div role="scrollbar" aria-valuetext="Value" aria-valuenow="1" aria-valuemin="0" aria-valuemax="4">Content</div>': ['vertical', 'scrollbar', 'Value'],

        '<div role="textbox" aria-invalid="true">Content</div>': ['textbox', 'invalid', 'Content'],
        '<div role="textbox" aria-disabled="true">Content</div>': ['textbox', 'disabled', 'Content'],

        '<div role="heading" aria-level="7">Content</div>': ['Content', 'heading', 'level', '7'],
        '<div role="heading" aria-level="A">Content</div>': ['Content', 'heading', 'level', 'A'],

        '<div role="grid"><div role="row"><div role="columnheader" aria-sort="ascending">Content</div></div></div>': ['grid', 'row', 'Content', 'columnheader', 'ascending', 'sort order', 'grid end'],
        '<div role="grid"><div role="row"><div role="columnheader" aria-sort="descending">Content</div></div></div>': ['grid', 'row', 'Content', 'columnheader', 'descending', 'sort order', 'grid end'],
        '<div role="grid"><div role="row"><div role="columnheader" aria-sort="other">Content</div></div></div>': ['grid', 'row', 'Content', 'columnheader', 'other', 'sort order', 'grid end'],
        '<div role="grid"><div role="row"><div role="columnheader" aria-sort="none">Content</div></div></div>': ['grid', 'row', 'Content', 'columnheader', 'grid end'],
        '<div role="grid"><div role="row"><div role="columnheader" aria-sort="unknown">Content</div></div></div>': ['grid', 'row', 'Content', 'columnheader', 'grid end'],
        '<div role="grid"><div role="row"><div role="columnheader" aria-sort="">Content</div></div></div>': ['grid', 'row', 'Content', 'columnheader', 'grid end'],

        '<div role="grid"><div role="row"><div role="rowheader" aria-sort="ascending">Content</div></div></div>': ['grid', 'row', 'Content', 'rowheader', 'ascending', 'sort order', 'grid end'],
        '<div role="grid"><div role="row"><div role="rowheader" aria-sort="descending">Content</div></div></div>': ['grid', 'row', 'Content', 'rowheader', 'descending', 'sort order', 'grid end'],
        '<div role="grid"><div role="row"><div role="rowheader" aria-sort="other">Content</div></div></div>': ['grid', 'row', 'Content', 'rowheader', 'other', 'sort order', 'grid end'],
        '<div role="grid"><div role="row"><div role="rowheader" aria-sort="none">Content</div></div></div>': ['grid', 'row', 'Content', 'rowheader', 'grid end'],
        '<div role="grid"><div role="row"><div role="rowheader" aria-sort="unknown">Content</div></div></div>': ['grid', 'row', 'Content', 'rowheader', 'grid end'],
        '<div role="grid"><div role="row"><div role="rowheader" aria-sort="">Content</div></div></div>': ['grid', 'row', 'Content', 'rowheader', 'grid end'],

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
        '<div role="img" aria-grabbed="false"></div>': ['img', 'grabbable'],
        '<div role="img" aria-grabbed="unknown"></div>': ['img'],
        '<div role="img" aria-grabbed=""></div>': ['img'],

        '<div role="main" aria-busy="true">Content</div>': ['main', 'busy', 'Content', 'main end'],
        '<div role="main" aria-busy="false">Content</div>': ['main', 'Content', 'main end'],
        '<div role="main" aria-busy="unknown">Content</div>': ['main', 'Content', 'main end'],
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

        '<div role="region" aria-dropeffect="copy">Content</div>': ['region', 'dropeffect', 'copy', 'Content', 'region end'],
        '<div role="region" aria-dropeffect="move">Content</div>': ['region', 'dropeffect', 'move', 'Content', 'region end'],
        '<div role="region" aria-dropeffect="link">Content</div>': ['region', 'dropeffect', 'link', 'Content', 'region end'],
        '<div role="region" aria-dropeffect="execute">Content</div>': ['region', 'dropeffect', 'execute', 'Content', 'region end'],
        '<div role="region" aria-dropeffect="popup">Content</div>': ['region', 'dropeffect', 'popup', 'Content', 'region end'],
        '<div role="region" aria-dropeffect="none">Content</div>': ['region', 'Content', 'region end'],
        '<div role="region" aria-dropeffect="copy move">Content</div>': ['region', 'dropeffect', 'copy move', 'Content', 'region end'],
        '<div role="region" aria-dropeffect="none copy">Content</div>': ['region', 'dropeffect', 'copy', 'Content', 'region end'],
        '<div role="region" aria-dropeffect="unknown copy">Content</div>': ['region', 'dropeffect', 'copy', 'Content', 'region end'],
        '<div role="region" aria-dropeffect="unknown">Content</div>': ['region', 'Content', 'region end'],
        '<div role="region" aria-dropeffect="">Content</div>': ['region', 'Content', 'region end'],

        '<div role="region" aria-live="polite">Content</div>': ['region', 'live', 'polite', 'Content', 'region end'],
        '<div role="region" aria-live="assertive">Content</div>': ['region', 'live', 'assertive', 'Content', 'region end'],
        '<div role="region" aria-live="off">Content</div>': ['region', 'Content', 'region end'],
        '<div role="region" aria-live="unknown">Content</div>': ['region', 'Content', 'region end'],
        '<div role="region" aria-live="">Content</div>': ['region', 'Content', 'region end'],
        '<div role="alert" aria-live="polite">Content</div>': ['alert', 'live', 'polite', 'atomic', 'Content', 'alert end'],
        '<div role="log" aria-live="assertive">Content</div>': ['log', 'live', 'assertive', 'Content', 'log end'],
        '<div role="status" aria-live="assertive">Content</div>': ['status', 'live', 'assertive', 'atomic', 'Content', 'status end'],

        '<div role="region" aria-relevant="additions">Content</div>': ['region', 'relevant', 'additions', 'Content', 'region end'],
        '<div role="region" aria-relevant="removals">Content</div>': ['region', 'relevant', 'removals', 'Content', 'region end'],
        '<div role="region" aria-relevant="text">Content</div>': ['region', 'relevant', 'text', 'Content', 'region end'],
        '<div role="region" aria-relevant="all">Content</div>': ['region', 'relevant', 'all', 'Content', 'region end'],
        '<div role="region" aria-relevant="additions text">Content</div>': ['region', 'relevant', 'additions text', 'Content', 'region end'],
        '<div role="region" aria-relevant=" unknown  text ">Content</div>': ['region', 'relevant', 'text', 'Content', 'region end'],
        '<div role="region" aria-relevant="unknown">Content</div>': ['region', 'Content', 'region end'],
        '<div role="region" aria-relevant="">Content</div>': ['region', 'Content', 'region end'],

        '<div role="region" aria-atomic="true">Content</div>': ['region', 'atomic', 'Content', 'region end'],
        '<div role="region" aria-atomic="false">Content</div>': ['region', 'Content', 'region end'],
        '<div role="region" aria-atomic="unknown">Content</div>': ['region', 'Content', 'region end'],
        '<div role="region" aria-atomic="">Content</div>': ['region', 'Content', 'region end'],

        '<div role="textbox" aria-activedescendant="text">Content</div><div id="text">Text</div>': ['textbox', 'Text', 'Content', 'Text'],
        '<div role="textbox" aria-activedescendant="unknown">Content</div><div id="text">Text</div>': ['textbox', 'Content', 'Text'],
        '<div role="textbox" aria-activedescendant="">Content</div><div id="text">Text</div>': ['textbox', 'Content', 'Text'],
        '<div role="textbox" aria-activedescendant="text">Content</div><div id="text"></div>': ['textbox', 'Content'],

        '<div role="slider" aria-controls="id">Content</div><div id="id"></div>': ['slider', 'controls', 'id'],
        '<div role="slider" aria-controls="id1 id2">Content</div><div id="id1"></div><div id="id2"></div>': ['slider', 'controls', 'id1', 'id2'],
        '<div role="slider" aria-controls="unknown">Content</div><div id="id"></div>': ['slider'],
        '<div role="slider" aria-controls="">Content</div><div id="id"></div>': ['slider'],

        '<div role="button" aria-owns="id">Content</div><div id="id"></div>': ['Content', 'button', 'owns', 'id'],
        '<div role="button" aria-owns="id1 id2">Content</div><div id="id1"></div><div id="id2"></div>': ['Content', 'button', 'owns', 'id1', 'id2'],
        '<div role="button" aria-owns="unknown">Content</div><div id="id"></div>': ['Content', 'button'],
        '<div role="button" aria-owns="">Content</div><div id="id"></div>': ['Content', 'button'],

        '<div role="button" aria-flowto="id">Content</div><div id="id"></div>': ['Content', 'button', 'flowto', 'id'],
        '<div role="button" aria-flowto="id1 id2">Content</div><div id="id1"></div><div id="id2"></div>': ['Content', 'button', 'flowto', 'id1', 'id2'],
        '<div role="button" aria-flowto="unknown">Content</div><div id="id"></div>': ['Content', 'button'],
        '<div role="button" aria-flowto="">Content</div><div id="id"></div>': ['Content', 'button'],

        '<div role="button" aria-describedby="id">Content</div><div id="id">Text</div>': ['Content', 'button', 'Text', 'Text'],
        '<div role="button" aria-describedby="id1 id2">Content</div><div id="id1">Text1</div><div id="id2">Text2</div>': ['Content', 'button', 'Text1 Text2', 'Text1', 'Text2'],
        '<div role="button" aria-describedby="unknown">Content</div><div id="id">Text</div>': ['Content', 'button', 'Text'],
        '<div role="button" aria-describedby="">Content</div><div id="id">Text</div>': ['Content', 'button', 'Text']
    };

    afterEach(function() {
        document.body.removeChild(this.elem);
        this.elem = null;
    });

    Object.keys(data).forEach(key => {
        it(`handles ${key}`, function() {
            this.elem = document.createElement('div');
            this.elem.innerHTML = key;
            document.body.appendChild(this.elem);
            expect(loud.say(this.elem)).toEqual(data[key]);
        });
    });
});
