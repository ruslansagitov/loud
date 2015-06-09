Getting Started
===============

Get a release tarball, or clone the `repository`_, or use `npm`_ and
`browserify`_, or `bower`_:

::

   bower install loud --save-dev

Add :file:`./dist/loud.js` to a testing page:

.. code-block:: html

   <script src="/path/to/loud/dist/loud.js"></script>

.. note::

   You should use `es5-shim`_ in old browsers.

Test with Loud (using `Jasmine`_, for example):

.. code-block:: js

   describe('loud', function() {
       beforeEach(function() {
           this.button = document.createElement('button');
           this.button.innerHTML = 'Join';
       });

       it('works', function() {
           expect(loud.say(this.button)).toEqual([
               'Join', 'button'
           ]);
       });
   });

.. warning::

   If you don’t add the elements to DOM, style data from the external
   stylesheets won’t be properly handled. Adding to DOM is important if
   you use :code:`display:none` or :code:`visibility:hidden` in your
   stylesheets.

.. _repository: https://github.com/ruslansagitov/loud
.. _npm: https://github.com/npm/npm
.. _browserify: https://github.com/substack/node-browserify
.. _bower: http://bower.io
.. _es5-shim: https://github.com/es-shims/es5-shim
.. _Jasmine: http://jasmine.github.io/
