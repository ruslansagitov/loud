'use strict';

var Util = require('util'),
    Benchmark = require('benchmark'),
    Loud = require('../lib/loud');

var suite = new Benchmark.Suite(),
    loud = new Loud();

var data = [
    'Text',
    '<h1 role="presentation">Content</h1>',
    '<button>Button</button>',
    '<input type="range" min="0" value="1" max="4">',
    '<button aria-labelledby="label"></button><span id="label">Button</span>',
    '<ul><li>One <input value="Two"> Three</li></ul>',
    '<table><tbody><tr><td>Content</td></tr></tbody></table>'
];

data.forEach(function(item) {
    suite.add(item, function() {
        loud.say(item);
    });
});

suite.on('cycle', function(e) {
    Util.puts(e.target.toString());
}).run({
    async: true
});
