/* global describe, it, beforeEach, afterEach, document */
'use strict';

var assert = require('assert'),
    Loud = require('../lib/loud'),
    browser = typeof window !== 'undefined',
    jsdom = browser ? null : require('jsdom').jsdom;

describe('loud', function() {
    var loud, elem;

    var data = {
        '<a>Content</a>': ['Content', 'link'],
        '<address>Content</address>': ['contentinfo', 'Content', 'contentinfo end'],
        '<area alt="Content">': ['Content', 'link' ],
        '<article>Content</area>': ['article', 'Content', 'article end'],
        '<aside>Content</aside>': ['complementary', 'Content', 'complementary end'],
        // In browser, it does not work
        // '<body>Content</body>': ['document', 'Content', 'document end'],
        '<button>Content</button>': ['Content', 'button'],
        '<caption>Content</caption>': ['Content'],
        '<colgroup>Content</colgroup>': ['Content'],
        '<dialog>Content</dialog>': ['dialog', 'Content', 'dialog end'],
        '<fieldset>Content</fieldset>': ['group', 'Content', 'group end'],
        '<figcaption>Content</figcaption>': ['Content'],
        '<h1>Content</h1>': ['Content', 'heading', 'level', '1'],
        '<h2>Content</h2>': ['Content', 'heading', 'level', '2'],
        '<h3>Content</h3>': ['Content', 'heading', 'level', '3'],
        '<h4>Content</h4>': ['Content', 'heading', 'level', '4'],
        '<h5>Content</h5>': ['Content', 'heading', 'level', '5'],
        '<h6>Content</h6>': ['Content', 'heading', 'level', '6'],
        '<hr>': ['separator'],
        '<img alt="Alt">': ['Alt', 'img'],
        '<img alt="">': [],
        '<img>': ['img'],
        '<input>': ['textbox'],
        '<input type="checkbox">': ['checkbox', 'not checked'],
        '<input type="color">': [],
        '<input type="date">': [],
        '<input type="datetime">': [],
        '<input type="email">': ['textbox'],
        '<input type="file">': [],
        '<input type="hidden">': [],
        '<input type="image">': ['button'],
        '<input type="month">': [],
        '<input type="password">': ['password', 'textbox'],
        '<input type="radio">': ['radio', 'not checked'],
        '<input type="reset">': ['button'],
        '<input type="search">': ['textbox'],
        '<input type="submit">': ['button'],
        '<input type="tel">': ['textbox'],
        '<input type="text">': ['textbox'],
        '<input type="time">': [],
        '<input type="unknown">': [],
        '<input type="url">': ['textbox'],
        '<input type="week">': [],
        '<label>Content</label>': ['Content'],
        '<link>': [],
        '<link rel="alternative" title="Content">': ['Content', 'link'],
        '<link rel="author" title="Content">': ['Content', 'link'],
        '<link rel="help" title="Content">': ['Content', 'link'],
        '<link rel="license" title="Content">': ['Content', 'link'],
        '<link rel="next" title="Content">': ['Content', 'link'],
        '<link rel="prev" title="Content">': ['Content', 'link'],
        '<link rel="search" title="Content">': ['Content', 'link'],
        '<main>Content</main>': ['main', 'Content', 'main end'],
        '<nav>Content</nav>': ['navigation', 'Content', 'navigation end'],
        '<section>Content</section>': ['region', 'Content', 'region end'],
        '<table>Content</table>': ['Content'],
        '<textarea>Content</textarea>': ['multiline', 'textbox', 'Content'],

        '<footer>Content</footer>': ['contentinfo', 'Content', 'contentinfo end'],
        '<article><footer>Content</footer></article>': ['article', 'Content', 'article end'],
        '<article><div><footer>Content</footer></div></article>': ['article', 'Content', 'article end'],
        '<section><footer>Content</footer></section>': ['region', 'Content', 'region end'],
        '<section><div><footer>Content</footer></div></section>': ['region', 'Content', 'region end'],

        '<header>Content</header>': ['banner', 'Content', 'banner end'],
        '<article><header>Content</header></article>': ['article', 'Content', 'article end'],
        '<article><div><header>Content</header></div></article>': ['article', 'Content', 'article end'],
        '<section><header>Content</header></section>': ['region', 'Content', 'region end'],
        '<section><div><header>Content</header></div></section>': ['region', 'Content', 'region end'],

        '<input list="datalist"><datalist id="datalist"><option>Option</option></datalist>': ['combobox', 'collapsed', 'haspopup'],
        '<input type="email" list="datalist"><datalist id="datalist"><option>Option</option></datalist>': ['combobox', 'collapsed', 'haspopup'],
        '<input type="search" list="datalist"><datalist id="datalist"><option>Option</option></datalist>': ['combobox', 'collapsed', 'haspopup'],
        '<input type="tel" list="datalist"><datalist id="datalist"><option>Option</option></datalist>': ['combobox', 'collapsed', 'haspopup'],
        '<input type="text" list="datalist"><datalist id="datalist"><option>Option</option></datalist>': ['combobox', 'collapsed', 'haspopup'],
        '<input type="url" list="datalist"><datalist id="datalist"><option>Option</option></datalist>': ['combobox', 'collapsed', 'haspopup'],
        '<input list="datalist1"><datalist id="datalist"><option>Option</option></datalist>': ['textbox', 'listbox', 'Option', 'option'],
        '<input list=""><datalist id="datalist"><option>Option</option></datalist>': ['textbox', 'listbox', 'Option', 'option'],

        '<select>Content</select>': ['Content'],
        '<select></select>': [],
        '<select><option>Content</option></select>': ['listbox', 'Content', 'option'],
        '<select><option selected>Content</option></select>': ['listbox', 'Content', 'option', 'selected'],
        '<select multiple><option>Content</option></select>': ['listbox', 'multiselectable', 'Content', 'option'],
        '<option>Content</option>': ['Content'],
        '<optgroup>Content</optgroup>': ['Content'],
        '<select><optgroup><option>Content</option></optgroup></select>': ['listbox', 'group', 'Content', 'option', 'group end'],
        '<optgroup><option>Content</option></optgroup>': ['Content'],

        '<summary>Content</summary>': ['Content'],

        '<datalist></datalist>': [],
        '<datalist><option>Content</option></datalist>': ['listbox', 'Content', 'option'],

        '<input type="range">': ['slider'],
        '<input type="range" value="10">': ['slider', 10],
        '<input type="range" min="0" value="1" max="4">': ['slider', 1],

        '<input type="number">': ['spinbutton'],
        '<input type="number" value="10">': ['spinbutton', 10],
        '<input type="number" min="0" value="1" max="4">': ['spinbutton', 1],

        '<progress>': ['progressbar'],
        '<progress value="10">': ['progressbar', 10],
        '<progress min="0" value="1" max="4">': ['progressbar', 25, 'percent'],

        '<dd>Content</dd>': ['Content'],
        '<dl>Content</dd>': ['Content'],
        '<dt>Content</dt>': ['Content'],
        '<dl><dt>Term</dt><dd>Content</dd></dl>': ['list', 'Term', 'listitem', 'Content', 'listitem', 'list end'],
        '<dl><dt>Term</dt></dl>': ['list', 'Term', 'listitem', 'list end'],
        '<dl><dd>Content</dd></dl>': ['list', 'Content', 'listitem', 'list end'],
        '<dl></dl>': [],

        '<menu>Content</menu>': ['Content'],
        '<menu type="toolbar">Content</menu>': ['toolbar', 'Content', 'toolbar end'],
        '<menuitem>Content</menuitem>': ['Content'],
        '<menu><menuitem>Content</menuitem></menu>': ['menu', 'Content', 'menuitem'],

        '<ol>Content</ol>': ['Content'],
        '<ul>Content</ul>': ['Content'],
        '<li>Content</li>': ['Content'],

        '<ol><li>Content</li></ol>': ['list', 'Content', 'listitem', 'list end'],
        '<ol><li role="presentation">Content</li></ol>': ['Content'],
        '<ol><li>Item1</li><li role="presentation">Item2</li></ol>': ['Item1', 'Item2'],
        '<ol><li>Item1</li><div><li>Item2</li></div></ol>': ['list', 'Item1', 'listitem', 'Item2', 'listitem', 'list end'],
        '<ol role="presentation"><li>Content</li></ol>': ['Content'],

        '<ul><li>Content</li></ul>': ['list', 'Content', 'listitem', 'list end'],
        '<ul><li role="presentation">Content</li></ul>': ['Content'],
        '<ul><li>Item1</li><li role="presentation">Item2</li></ul>': ['Item1', 'Item2'],
        '<ul><li>Item1</li><div><li>Item2</li></div></ul>': ['list', 'Item1', 'listitem', 'Item2', 'listitem', 'list end'],
        '<ul role="presentation"><li>Content</li></ul>': ['Content'],

        '<table><tbody><tr><td>Content</td></tr></tbody></table>': ['table', 'rowgroup', 'row', 'Content', 'gridcell', 'table end'],
        '<table><tbody><tr><th>Content</th></tr></tbody></table>': ['table', 'rowgroup', 'row', 'Content', 'columnheader', 'table end'],
        '<table><tbody><tr><th scope="row">Content</th></tr></tbody></table>': ['table', 'rowgroup', 'row', 'Content', 'rowheader', 'table end'],

        '<table><thead><tr><td>Content</td></tr></thead></table>': ['table', 'rowgroup', 'row', 'Content', 'gridcell', 'table end'],
        '<table><tfoot><tr><td>Content</td></tr></tfoot></table>': ['table', 'rowgroup', 'row', 'Content', 'gridcell', 'table end'],
        '<table><colgroup><col></colgroup><tbody><tr><td>Content</td></tr></tbody></table>': ['table', 'rowgroup', 'row', 'Content', 'gridcell', 'table end'],

        '<tbody>Content</tbody>': ['Content'],
        '<thead>Content</thead>': ['Content'],
        '<tfoot>Content</tfoot>': ['Content'],
        '<tr>Content</tr>': ['Content'],
        '<td>Content</td>': ['Content'],
        '<th>Content</th>': ['Content'],

        '<input disabled>': ['textbox', 'disabled'],
        '<fieldset disabled><input type="checkbox"></fieldset>': ['group', 'disabled', 'checkbox', 'disabled', 'not checked', 'group end'],
        '<fieldset disabled><legend><input type="checkbox"></legend></fieldset>': ['group', 'disabled', 'checkbox', 'not checked', 'group end'],

        '<input required>': ['textbox', 'required'],
        '<input type="checkbox" checked>': ['checkbox', 'checked'],

        /* Has readonly */
        '<input readonly>': ['textbox', 'readonly'],
        '<input type="range" readonly>': ['slider'],

        /* Cannot be presentation */
        '<aside role="presentation">Content</aside>': ['Content'],
        '<fieldset role="presentation">Content</fieldset>': ['Content'],
        '<footer role="presentation">Content</footer>': ['Content'],
        '<h1 role="presentation">Content</h1>': ['Content'],
        '<h2 role="presentation">Content</h2>': ['Content'],
        '<h3 role="presentation">Content</h3>': ['Content'],
        '<h4 role="presentation">Content</h4>': ['Content'],
        '<h5 role="presentation">Content</h5>': ['Content'],
        '<h6 role="presentation">Content</h6>': ['Content'],
        '<header role="presentation">Content</header>': ['Content'],
        '<hr role="presentation">': [],
        '<iframe role="presentation">Content</iframe>': ['Content'],
        '<li role="presentation">Content</li>': ['Content'],
        '<main role="presentation">Content</main>': ['Content'],
        '<menu role="presentation">Content</menu>': ['Content'],
        '<nav role="presentation">Content</nav>': ['Content'],
        '<object role="presentation">Content</object>': ['Content'],
        '<ol role="presentation">Content</ol>': ['Content'],
        '<ul role="presentation">Content</ul>': ['Content'],

        /* Can be presentation */
        '<a role="presentation">Content</a>': ['Content', 'link'],
        '<address role="presentation">Content</address>': ['contentinfo', 'Content', 'contentinfo end'],
        '<area role="presentation">': ['link'],
        '<article role="presentation">Content</article>': ['article', 'Content', 'article end'],
        '<audio role="presentation">Content</audio>': ['Content'],
        '<button role="presentation">Content</button>': ['Content', 'button'],
        '<input role="presentation">': ['textbox'],
        '<select><option role="presentation">Content</option></select>': ['listbox', 'Content', 'option'],
        '<select role="presentation"><option>Content</option></select>': ['listbox', 'Content', 'option'],
        '<progress role="presentation">': ['progressbar'],
        '<textarea role="presentation">Content</textarea>': ['multiline', 'textbox', 'Content'],
        '<video role="presentation">Content</video>': ['Content'],

        '<div>Content</div>': ['Content'],
        '<span>Content</span>': ['Content'],
        '<div role="presentation">Content</div>': ['Content'],
        '<span role="presentation">Content</span>': ['Content'],

        /* No role */
        '<a role="button">Content</a>': ['Content', 'button'],

        '<base role="region">Content</base>': ['Content'],
        '<head role="region">Content</base>': ['Content'],
        '<html role="region">Content</html>': ['Content'],
        // Firefox thinks that it's an <option>
        // '<keygen role="region">Content</keygen>': ['Content'],
        '<label role="region">Content</label>': ['Content'],
        '<meta role="region">Content</meta>': ['Content'],
        '<meter role="region">Content</meter>': ['Content'],
        '<noscript role="region">Content</noscript>': ['Content'],
        '<optgroup role="region">Content</optgroup>': ['Content'],
        '<param role="region">Content</param>': ['Content'],
        '<script role="region">Content</script>': ['Content'],
        '<source role="region">Content</source>': ['Content'],
        '<style role="region">Content</style>': ['Content'],
        // In browser, it does not work
        // '<template role="region">Content</template>': ['Content'],
        '<title role="region">Content</title>': ['Content'],

        '<html><head><title>Content</title></head></html>': ['Content'],

        '<input type="color" role="textbox">': [],
        '<input type="date" role="textbox">': [],
        '<input type="datetime" role="textbox">': [],
        '<input type="file" role="textbox">': [],
        '<input type="hidden" role="textbox">': [],
        '<input type="month" role="textbox">': [],
        '<input type="time" role="textbox">': [],
        '<input type="week" role="textbox">': [],

        /* Strong role */
        '<area role="region" alt="Content">': ['Content', 'link'],
        '<datalist role="region"><option>Content</option></datalist>': ['listbox', 'Content', 'option'],
        '<fieldset role="region">Content</fieldset>': ['group', 'Content', 'group end'],
        '<footer role="region">Content</footer>': ['contentinfo', 'Content', 'contentinfo end'],

        /* Tag to role restrictions */
        '<address role="region">Content</address>': ['contentinfo', 'Content', 'contentinfo end'],
        '<address role="contentinfo">Content</address>': ['contentinfo', 'Content', 'contentinfo end'],
        '<a role="region">Content</a>': ['Content', 'link'],
        '<a role="link">Content</a>': ['Content', 'link'],
        /* already '<a role="button">Content</a>': ['Content', 'button'], */
        '<a role="checkbox">Content</a>': ['Content', 'checkbox', 'not checked'],
        '<menu><a role="menuitem">Content</a></menu>': ['menu', 'Content', 'menuitem'],
        '<menu><a role="menuitemcheckbox">Content</a></menu>': ['menu', 'Content', 'menuitemcheckbox', 'not checked'],
        '<menu><a role="menuitemradio">Content</a></menu>': ['menu', 'Content', 'menuitemradio', 'not checked'],
        '<div role="tablist"><a role="tab">Content</a></div>': ['tablist', 'Content', 'tab'],
        '<div role="tree"><a role="treeitem">Content</a></div>': ['tree', 'Content', 'treeitem'],
        '<article role="region">Content</article>': ['article', 'Content', 'article end'],
        '<article role="article">Content</article>': ['article', 'Content', 'article end'],
        '<article role="document">Content</article>': ['document', 'Content', 'document end'],
        '<article role="application">Content</article>': ['application', 'Content', 'application end'],
        '<article role="main">Content</article>': ['main', 'Content', 'main end'],
        '<aside role="region">Content</aside>': ['complementary', 'Content', 'complementary end'],
        '<aside role="complementary">Content</aside>': ['complementary', 'Content', 'complementary end'],
        '<aside role="note">Content</aside>': ['note', 'Content', 'note end'],
        '<aside role="search">Content</aside>': ['search', 'Content', 'search end'],
        '<audio role="region">Content</audio>': ['Content'],
        '<audio role="application">Content</audio>': ['application', 'Content', 'application end'],
        // In browser, it does not work
        // '<body role="region">Content</body>': ['document', 'Content', 'document end'],
        // '<body role="application">Content</body>': ['application', 'Content', 'application end'],
        '<button role="region">Content</button>': ['Content', 'button'],
        '<button role="button">Content</button>': ['Content', 'button'],
        '<button role="link">Content</button>': ['Content', 'link'],
        '<menu><button role="menuitem">Content</button></menu>': ['menu', 'Content', 'menuitem'],
        '<menu><button role="menuitemcheckbox">Content</button></menu>': ['menu', 'Content', 'menuitemcheckbox', 'not checked'],
        '<menu><button role="menuitemradio">Content</button></menu>': ['menu', 'Content', 'menuitemradio', 'not checked'],
        '<button role="radio">Content</button>': ['Content', 'radio', 'not checked'],
        '<embed role="region">Content</embed>': ['Content'],
        // In browser, it does not work
        // '<embed role="application">Content</embed>': ['application', 'Content', 'application'],
        // '<embed role="document">Content</embed>': ['document', 'Content', 'document end'],
        '<embed role="img">Content</embed>': ['img', 'Content'],
        '<h1 role="region">Content</h1>': ['Content', 'heading', 'level', '1'],
        '<h2 role="region">Content</h2>': ['Content', 'heading', 'level', '2'],
        '<h3 role="region">Content</h3>': ['Content', 'heading', 'level', '3'],
        '<h4 role="region">Content</h4>': ['Content', 'heading', 'level', '4'],
        '<h5 role="region">Content</h5>': ['Content', 'heading', 'level', '5'],
        '<h6 role="region">Content</h6>': ['Content', 'heading', 'level', '6'],
        '<h1 role="heading">Content</h1>': ['Content', 'heading', 'level', '1'],
        '<h2 role="heading">Content</h2>': ['Content', 'heading', 'level', '2'],
        '<h3 role="heading">Content</h3>': ['Content', 'heading', 'level', '3'],
        '<h4 role="heading">Content</h4>': ['Content', 'heading', 'level', '4'],
        '<h5 role="heading">Content</h5>': ['Content', 'heading', 'level', '5'],
        '<h6 role="heading">Content</h6>': ['Content', 'heading', 'level', '6'],
        '<div role="tablist"><h1 role="tab">Content</h1></div>': ['tablist', 'Content', 'tab'],
        '<div role="tablist"><h2 role="tab">Content</h2></div>': ['tablist', 'Content', 'tab'],
        '<div role="tablist"><h3 role="tab">Content</h3></div>': ['tablist', 'Content', 'tab'],
        '<div role="tablist"><h4 role="tab">Content</h4></div>': ['tablist', 'Content', 'tab'],
        '<div role="tablist"><h5 role="tab">Content</h5></div>': ['tablist', 'Content', 'tab'],
        '<div role="tablist"><h6 role="tab">Content</h6></div>': ['tablist', 'Content', 'tab'],
        '<iframe role="region">Content</iframe>': ['Content'],
        '<iframe role="application">Content</iframe>': ['application', 'Content', 'application end'],
        '<iframe role="document">Content</iframe>': ['document', 'Content', 'document end'],
        '<iframe role="img">Content</iframe>': ['img'],
        '<ul><li role="region">Content</li></ul>': ['list', 'Content', 'listitem', 'list end'],
        '<ul><li role="listitem">Content</li></ul>': ['list', 'Content', 'listitem', 'list end'],
        '<ul role="menu"><li role="menuitem">Content</li></ul>': ['menu', 'Content', 'menuitem'],
        '<ul role="menu"><li role="menuitemcheckbox">Content</li></ul>': ['menu', 'Content', 'menuitemcheckbox', 'not checked'],
        '<ul role="menu"><li role="menuitemradio">Content</li></ul>': ['menu', 'Content', 'menuitemradio', 'not checked'],
        '<ul role="listbox"><li role="option">Content</li></ul>': ['listbox', 'Content', 'option'],
        '<ul role="tablist"><li role="tab">Content</li></ul>': ['tablist', 'Content', 'tab'],
        '<ul role="tree"><li role="treeitem">Content</li></ul>': ['tree', 'Content', 'treeitem'],
        '<menu role="region"><menuitem>Content</menuitem></menu>': ['menu', 'Content', 'menuitem'],
        '<menu role="directory"><menuitem>Content</menuitem></menu>': ['directory', 'Content', 'directory end'],
        '<menu role="list"><menuitem role="listitem">Content</menuitem></menu>': ['list', 'Content', 'listitem', 'list end'],
        '<menu role="listbox"><menuitem role="option">Content</menuitem></menu>': ['listbox', 'Content', 'option'],
        '<menu role="menu"><menuitem>Content</menuitem></menu>': ['menu', 'Content', 'menuitem'],
        '<menu role="menubar"><menuitem>Content</menuitem></menu>': ['menubar', 'Content', 'menuitem'],
        '<menu role="tablist"><menuitem role="tab">Content</menuitem></menu>': ['tablist', 'Content', 'tab'],
        '<menu role="toolbar">Content</menu>': ['toolbar', 'Content', 'toolbar end'],
        '<menu role="tree"><menuitem role="treeitem">Content</menuitem></menu>': ['tree', 'Content', 'treeitem'],
        '<object role="region">Content</object>': ['Content'],
        '<object role="application">Content</object>': ['application', 'Content', 'application end'],
        '<object role="document">Content</object>': ['document', 'Content', 'document end'],
        '<object role="img">Content</object>': ['img'],
        '<ol role="region"><li>Content</li></ol>': ['list', 'Content', 'listitem', 'list end'],
        '<ol role="directory"><li>Content</li></ol>': ['directory', 'Content', 'directory end'],
        '<ol role="list"><li>Content</li></ol>': ['list', 'Content', 'listitem', 'list end'],
        '<ol role="listbox"><li role="option">Content</li></ol>': ['listbox', 'Content', 'option'],
        '<ol role="menu"><li role="menuitem">Content</li></ol>': ['menu', 'Content', 'menuitem'],
        '<ol role="menubar"><li role="menuitem">Content</li></ol>': ['menubar', 'Content', 'menuitem'],
        '<ol role="tablist"><li role="tab">Content</li></ol>': ['tablist', 'Content', 'tab'],
        '<ol role="toolbar"><li>Content</li></ol>': ['toolbar', 'Content', 'toolbar end'],
        '<ol role="tree"><li role="treeitem">Content</li></ol>': ['tree', 'Content', 'treeitem'],
        '<ul role="region"><li>Content</li></ul>': ['list', 'Content', 'listitem', 'list end'],
        '<ul role="directory"><li>Content</li></ul>': ['directory', 'Content', 'directory end'],
        '<ul role="group"><li>Content</li></ul>': ['group', 'Content', 'group end'],
        '<ul role="group">Content</ul>': ['group', 'Content', 'group end'],
        '<ul role="list"><li>Content</li></ul>': ['list', 'Content', 'listitem', 'list end'],
        /* already '<ul role="listbox"><li role="option">Content</li></ul>': ['listbox', 'Content', 'option'], */
        /* already '<ul role="menu"><li role="menuitem">Content</li></ul>': ['menu', 'Content', 'menuitem'], */
        '<ul role="menubar"><li role="menuitem">Content</li></ul>': ['menubar', 'Content', 'menuitem'],
        /* already '<ul role="tablist"><li role="tab">Content</li></ul>': ['tablist', 'Content', 'tab'], */
        '<ul role="toolbar"><li>Content</li></ul>': ['toolbar', 'Content', 'toolbar end'],
        /* already '<ul role="tree"><li role="treeitem">Content</li></ul>': ['tree', 'Content', 'treeitem'], */
        '<video role="region">Content</video>': ['Content'],
        '<video role="application">Content</video>': ['application', 'Content', 'application end']
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

    it('handles indeterminate', function() {
        var key = '<input type="checkbox">',
            value = ['checkbox', 'mixed'];

        if (browser) {
            elem.innerHTML = key;
        } else {
            elem = jsdom(key);
        }

        elem.firstChild.indeterminate = true;
        assert.deepEqual(loud.say(elem), value);
    });
});
