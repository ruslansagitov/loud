#!/usr/bin/env node
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Ruslan Sagitov
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

var FS = require('fs'),
    Loud = require('./loud'),

    optimist = require('optimist')
        .usage('Usage: $0 [-o filename] [input…]')
        .string('o')
        .boolean('h')
        .alias('o', 'output')
        .alias('h', 'help')
        .describe('o', 'Output file name')
        .describe('h', 'Show this help'),

    argv = optimist.argv,

    input = argv._,
    outputFilename = argv.output;

if (argv.help) {
    optimist.showHelp();
    process.exit(0);
}

function output(inputData) {
    var outputData = new Loud().say(inputData).join('\n');

    if (outputData) {
        outputData += '\n';
    }

    if (outputFilename && outputFilename !== '-') {
        FS.writeFile(outputFilename, outputData);
    } else {
        process.stdout.write(outputData);
    }
}

function main() {
    if (!input || input.length === 0 || input[0] === '-') {
        var data = '';
        process.stdin
            .on('data', function(chunk) {
                data += chunk;
            })
            .on('end', function() {
                output(data);
            })
            .on('error', function(err) {
                throw err;
            });
        process.stdin.resume();
    } else {
        input.forEach(function(filename) {
            FS.readFile(filename, function(err, data) {
                if (err) {
                    throw err;
                }

                output(data + '');
            });
        });
    }
}

main();
