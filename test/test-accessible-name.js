/* global describe, it */
'use strict';

var assert = require('assert'),
    loud = require('../lib/loud'),
    jsdom = require('./jsdom');

describe('loud', function() {
    var data = {
        /* aria-labelledby */
        '<button aria-labelledby="label"><span id="label">Label</span></button>': ['Label', 'button'],

        '<button aria-labelledby="label1 label2"><span id="label1">Label1</span><span id="label2">Label2</span></button>': ['Label1 Label2', 'button'],
        '<button aria-labelledby="label1 label2"><span id="label1">Label1</span></button>': ['Label1', 'button'],
        '<button aria-labelledby="label2"><span id="label1">Label1</span><span id="label2">Label2</span></button>': ['Label2', 'button'],

        '<button aria-labelledby="label3"><span id="label1">Label1</span></button>': ['Label1', 'button'],

        '<span id="label">Label<button aria-labelledby="label"></button>': ['Label', 'Label', 'button'],

        '<span role="button" id="label1" aria-labelledby="label2">Label1<button id="label2" aria-labelledby="label1">Label2</button></span>': ['Label2', 'button'],

        '<button id="label1" aria-labelledby="label1" aria-label="Label1">Label2</button>': ['Label1', 'button'],
        '<button id="label1" aria-labelledby="label1">Label1</button>': ['Label1', 'button'],

        /* aria-label */
        '<button aria-label="Label"></button>': ['Label', 'button'],
        '<button aria-label="Label1">Label2</button>': ['Label1', 'button'],
        '<button aria-label="Label2" aria-labelledby="label1"><span id="label1">Label1</span></button>': ['Label1', 'button'],

        '<button aria-labelledby="label"></button><menu><menuitem id="label" title="Label"></menu>': ['Label', 'button', 'menu', 'Label', 'menuitem'],

        '<button aria-labelledby="label"></button><input id="label" type="range" value="1">': ['button', 'slider', '1'],

        /* presentation */
        '<h1 role="presentation">Label</h1>': ['Label'],
        '<button aria-labelledby="label"></button><h1 id="label" role="presentation">Label</h1>': ['Label', 'button', 'Label'],

        /* alt */
        '<img alt="Label">': ['Label', 'img'],
        '<img aria-labelledby="label1" alt="Label2"><span id="label1">Label1</span>': ['Label1', 'img', 'Label1'],
        '<img aria-label="Label1" alt="Label2">': ['Label1', 'img'],

        /* Labels */
        '<input type="checkbox" id="checkbox"><label for="checkbox">Label</label>': ['Label', 'checkbox', 'not checked', 'Label'],
        '<input type="checkbox" id="checkbox"><label for="checkbox1">Label</label>': ['checkbox', 'not checked', 'Label'],
        '<input type="checkbox" id="checkbox1"><label for="checkbox">Label</label>': ['checkbox', 'not checked', 'Label'],
        '<fieldset><legend>Label</legend>Content</fieldset>': ['Label', 'group', 'Content', 'group end'],
        '<fieldset><legend>Label</legend></fieldset>': [],
        '<fieldset><legend></legend>Content</fieldset>': ['group', 'Content', 'group end'],
        '<figure role="group"><figcaption>Label</figcaption>Content</figure>': ['Label', 'group', 'Content', 'group end'],
        '<figure role="group"><figcaption>Label</figcaption></figure>': [],
        '<figure role="group"><figcaption></figcaption>Content</figure>': ['group', 'Content', 'group end'],
        '<details role="group"><summary>Label</summary>Content</details>': ['Label', 'group', 'Content', 'group end'],
        '<details role="group"><summary>Label</summary></details>': [],
        '<details role="group"><summary></summary>Content</details>': ['group', 'Content', 'group end'],
        '<table><caption>Label</caption><tbody><tr><td>Content</td></tr></tbody></table>': ['Label', 'table', 'rowgroup', 'row', 'Content', 'gridcell', 'table end'],
        '<table><caption></caption><tbody><tr><td>Content</td></tr></tbody></table>': ['table', 'rowgroup', 'row', 'Content', 'gridcell', 'table end'],

        '<fieldset><legend><div></div></legend></fieldset>': [],
        '<fieldset><legend><!-- comment --></legend></fieldset>': [],

        /* embedded controls */
        '<ul><li>One <input value="Two"> Three</li></ul>': ['list', 'One Two Three', 'listitem', 'list end'],

        /* contents */
        '<ul><li>One</li></ul>': ['list', 'One', 'listitem', 'list end'],
        '<ul><li><input type="range" value="1"></li></ul>': ['list', 1, 'listitem', 'list end'],
        '<ul><li><input type="range" aria-valuetext="Text"></li></ul>': ['list', 'Text', 'listitem', 'list end'],
        '<ul><li><input type="range" value="1" aria-valuetext="Text"></li></ul>': ['list', 'Text', 'listitem', 'list end'],

        /* rest */
        '<a title="Label"></a>': ['Label', 'link'],
        '<a href="/"></a>': ['/', 'link'],
        '<a></a>': ['link'],

        /* cache */
        '<img id="label" alt="Label"><button aria-labelledby="label"></button>': ['Label', 'img', 'Label', 'button']
    };

    Object.keys(data).forEach(function(key) {
        it('handles ' + key, function() {
            assert.deepEqual(loud.say(jsdom(key)), data[key]);
        });
    });
});
