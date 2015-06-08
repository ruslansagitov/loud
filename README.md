# Loud [![Build Status](https://travis-ci.org/ruslansagitov/loud.svg?branch=master)](https://travis-ci.org/ruslansagitov/loud) [![Coverage Status](https://coveralls.io/repos/ruslansagitov/loud/badge.svg)](https://coveralls.io/r/ruslansagitov/loud) [![Code Climate](https://codeclimate.com/github/ruslansagitov/loud/badges/gpa.svg)](https://codeclimate.com/github/ruslansagitov/loud)

Web accessibility testing helper

## What is it?

Loud is a JavaScript library for browser, which helps track regression
of accessibility.

Loud ships under terms of the MIT License.

## Why do I need it?

You break HTML pages on elements and each element you can create in
different ways. For example, you can create a button like this (with
a little bit of JavaScript):

```html
<i role="button" aria-label="Join"></i>
```

From accessibility point of view, this is a button. Later, you decide to
change the button to something like this:

```html
<button>Join</button>
```

From accessibility point of view, this is also a button and both buttons
are the same.

Loud knows how elements look like from the accessibility point of view.
You can use this information to track accessibility regression of your
web pages.

## Getting Started

Get a release tarball, or clone the repository, or use [npm][] and
[browserify][], or [bower][]:

```
bower install loud --save-dev
```

Add `./dist/loud.js` to a testing page:

```html
<script src="/path/to/loud/dist/loud.js"></script>
```

Test with Loud (using [Jasmine][], for example):

```js
describe('loud', function() {
    beforeEach(function() {
        this.button = document.createElement('button');
        this.button.innerHTML = 'Join';
    });

    it('works', function() {
        expect(loud.say(this.button)).toEqual(['Join', 'button']);
    });
});
```

 [npm]: <https://github.com/npm/npm> "npm — A package manager for JavaScript"
 [browserify]: <https://github.com/substack/node-browserify> "browserify — Browser-side require() the Node.js way"
 [bower]: <https://github.com/bower/bower> "Bower — A package manager for the web"
 [Jasmine]: <http://jasmine.github.io/> "Jasmine — Behavior-Driven JavaScript"
