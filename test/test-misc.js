/* global describe, it */
'use strict';

var assert = require('assert'),
    loud = require('../lib/loud'),
    jsdom = require('./jsdom');

describe('loud', function() {
    var data = {
        Text: ['Text'],
        '<!-- comment -->': [],
        '<?xml-stylesheet?>': [],

        /* abstract roles */
        '<div role="command">Content</div>': ['Content'],
        '<div role="composite">Content</div>': ['Content'],
        '<div role="input">Content</div>': ['Content'],
        '<div role="landmark">Content</div>': ['Content'],
        '<div role="range">Content</div>': ['Content'],
        '<div role="roletype">Content</div>': ['Content'],
        '<div role="section">Content</div>': ['Content'],
        '<div role="sectionhead">Content</div>': ['Content'],
        '<div role="select">Content</div>': ['Content'],
        '<div role="structure">Content</div>': ['Content'],
        '<div role="widget">Content</div>': ['Content'],
        '<div role="window">Content</div>': ['Content'],

        '<div role="command button">Content</div>': ['Content', 'button'],
        '<div role="button command">Content</div>': ['Content', 'button'],
        '<div role="button textbox">Content</div>': ['Content', 'button'],
        '<div role="  button  ">Content</div>': ['Content', 'button'],
        '<div role="">Content</div>': ['Content'],

        '<div>Content</div>': ['Content']
    };

    Object.keys(data).forEach(function(key) {
        it('handles ' + key, function() {
            assert.deepEqual(loud.say(jsdom(key)), data[key]);
        });
    });

    it('provides VERSION as String', function() {
        assert(typeof loud.VERSION === 'string');
    });
});
