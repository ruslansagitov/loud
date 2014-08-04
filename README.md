# Loud [![Build Status](https://travis-ci.org/ruslansagitov/loud.svg?branch=master)](https://travis-ci.org/ruslansagitov/loud) [![Test Coverage](https://codeclimate.com/github/ruslansagitov/loud/badges/coverage.svg)](https://codeclimate.com/github/ruslansagitov/loud) [![Code Climate](https://codeclimate.com/github/ruslansagitov/loud.png)](https://codeclimate.com/github/ruslansagitov/loud)

Web accessibility unit-testing framework

## Installing

Get a release tarball or clone the repository, then include the
`./dist/loud.js` onto your pages:

```html
<script src="…/dist/loud.js"></script>
```

or use [bower][]:

```
bower install loud --save-dev
```

### Old browsers

You need to use [es5-shim][] when using Loud in old browsers.

## Getting Started

Transform a DOM element to array of words:

```javascript
> var loud = new Loud();
> loud.say(document.getElementById('join'))
['Join', 'button']
```

Use this in your unit-tests! For example, with [Jasmine][]:

```javascript
describe('something', function() {
    var loud = new Loud(),
        button;

    beforeEach(function() {
        button = document.createElement('button');
        button.innerHTML = 'Join';
        document.appendChild(button);
    });

    afterEach(function() {
        document.removeChild(button);
    });

    it('works', function() {
        expect(loud.say(button)).toEqual([
            'Join', 'button'
        ]);
    });
});
```

_Important!_ You need to add the elements to DOM! Otherwise,
the style data from external stylesheets won’t be properly handled.

## Modes of Operation

A screen reader application can work in different modes. Loud
currently works in just one mode. It’s oftenly called “Say All”.

Loud takes an HTML string or a DOM element and tries to “say”
everything as it would a screen reader. In general, Loud is based on
the [WAI-ARIA][] specification and [W3C HTML5][]. It tries to mimic the
popular JAWS screen reader where possible.

However, it’s impossible to say everything in one mode. Currently, the
live regions are not that “live” — it’s static but you still can test
them. In essence, Loud is a unit-testing framework, not a screen
reader.

In future, new modes can be added.

## API

### say(data)

Takes an HTML string or a DOM element and returns an array of words.

## Elements

Loud returns an array of “words”. Each word is a string. It has to
be constants though, it’s much easy to write tests in words as strings
than importing constants with names as words.

### Basics

Loud mimics WAI-ARIA for the role, state and property names. For
example, the resulting word for the button role is `'button'`.

### Accessible name

The elements with roles can have a name, so called _accessible name_.

WAI-ARIA describes a complicated algorithm for computation of this name.
In short, the accessible name are took from `aria-lebelledby`,
`aria-label`, `alt`, `title` or from element contents (for a few
elements).

Usually, the accessible name precedes the role name in the result.

### Regions

WAI-ARIA defines plenty of regions. For each region, Loud outputs
the region name, its contents and _the end marker_. For example, the end
marker for the banner region is `'banner end'` and the whole result is
`['banner', '…', 'banner end']`.

### Tables

Tables are special in Loud. In case of the `<table>` tag, the result
is `['table', '…']`. WAI-ARAI doesn’t have such role though.

### Other elements

All other elements are simple and have the following format: `[name,
role]`, where the `name` is accessible name and `role` is
the role name as string.

### States

WAI-ARIA has a lot of _states_, for example, checked, selected, pressed.
Those states are mapped to the result as is: `'checked'`, `'selected'`,
`'pressed'`.

The exceptions are: `checked`/`not checked`, `expanded`/`collased`,
`pressed`/`not pressed`, `grabbed`/`can be grabbed`.

### Properties

Properties are also a part of WAI-ARIA and the rules are almost the same
as for the states. The only exception is `sort` that is `sort order`.

The property can be followed by its value. The value names are also
mapped to WAI-ARIA.

The `aria-activedescendant` property takes an ID list. The value for
this property is the names of the elements from the ID list, not the ID
list itself! The result for `aria-controls` and `aria-flowto` is the ID
list, not the names of the elements.

Currently, Loud has weak support of `aria-posinset` and
`aria-setsize`. In case of both attributes are present, the result is
`[posinset, 'of', setsize]`. Loud are not trying to guess these
values from HTML markup. It can be added later.

## How it should be said?!

 1. Write a test with an empty expectation and run it
 2. The test will fail
 3. You will know the result

The result is in plain Engligh, so you should know if something went
wrong. I guess.

Also note that Loud is good for regression testing only.

 [bower]: <https://github.com/bower/bower> "Bower — A package manager for the web"
 [es5-shim]: <https://github.com/es-shims/es5-shim> "es5-shim"
 [Jasmine]: <http://jasmine.github.io/> "Jasmine — Behavior-Driven JavaScript"
 [WAI-ARIA]: <http://www.w3.org/TR/wai-aria/> "WAI-ARIA — Accessible Rich Internet Applications"
 [W3C HTML5]: <http://www.w3.org/TR/html/> "HTML5"
