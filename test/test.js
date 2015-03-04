/* global window, document */
'use strict';

if (typeof window !== 'undefined') {
    var html5 = window.html5;
    if (html5) {
        html5.addElements(['menu', 'menuitem', document]);
    }
}

require('./test-accessible-name');
require('./test-role-from-tag');
require('./test-words-from-role');
require('./test-words-from-attributes');
require('./test-misc');
