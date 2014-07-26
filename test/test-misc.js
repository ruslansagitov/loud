/* global describe, it, beforeEach, afterEach */
'use strict';

var assert = require('assert'),
    Loud = require('../lib/loud');

describe('loud', function() {
    var loud;

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

    beforeEach(function() {
        loud = new Loud();
    });

    afterEach(function() {
        loud = null;
    });

    Object.keys(data).forEach(function(key) {
        it('handles ' + key, function() {
            assert.deepEqual(loud.say(key), data[key]);
        });
    });
});
