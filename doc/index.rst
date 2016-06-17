Loud
====

.. rubric:: Web accessibility testing helper

What is it?
-----------

Loud is a JavaScript library for browser, which helps track regression
of accessibility.

Loud ships under terms of the MIT License.

Why do I need it?
-----------------

You break HTML pages on elements. Each element you can create in
different ways. For example, you can create a button like this (with
a little bit of JavaScript):

.. code-block:: html

   <i role="button" aria-label="Join"></i>

From accessibility point of view, this is a button. Later, you decide to
change the button to something like this:

.. code-block:: html

   <button>Join</button>

From accessibility point of view, this is also a button and both buttons
are the same.

Loud knows how elements look like from the accessibility point of view.
You can use this information to track accessibility regression of your
web pages.

Table of Contents
-----------------

.. toctree::
   :maxdepth: 2

   getting-started
   api
   examples
   predicting-output
   developing
