Developing Loud
===============

Clone the repository and install dependencies::

   git clone https://github.com/ruslansagitov/loud.git
   npm install

.. rubric:: Linters

Install linters globally::

   npm install --global eslint

Now you can run linters::

   npm run-script lint

.. note::

   If linting fails, try to install specific versions of linters.
   You can find version numbers in the Continues Integration
   configuration.

.. rubric:: Checking documentation

Install tools::

   npm install --global write-good

And check writing::

   npm run-script check-writing

.. rubric:: Testing in browsers

Install karma plugins for testing in specific browsers::

   npm install karma-firefox-launcher
   npm install karma-phantomjs-launcher
   export KARMA_BROWSERS=Firefox,PhantomJS

.. note::

   Karma launchers are not installing automatically. You should choose
   yourself in which browsers you will test.

After installing launchers, build the sources::

   mkdir build
   npm run-script build

Now you can test with karma::

   npm run-script karma-test

.. rubric:: Running all the tests

::

   npm test

.. warning::

   You should have already installed all the dependencies, linters and
   karma launchers at this point!

.. rubric:: Getting code coverage

::

   npm run-script coverage

The coverage is in the `coverage` directory.

.. warning::

   Code coverage should not drop below 100%.

.. rubric:: Generating JSDoc

::

   npm install --global jsdoc
   npm run-script jsdoc

The JavaScript documentation is in the `jsdoc` directory.

.. rubric:: Generating documentation

You need to install sphinx (a python-tool) to generate documentation::

   pip install sphinx

Now you can generate documentation::

   npm run-script doc

.. rubric:: Deploying

Just before release, generate distibution files::

   npm run-script build

.. important::

   Don’t forget to commit the generated files for bower.

.. rubric:: Releasing a new version

#. Find all the strings with the previous version and change it for
   the new version
#. Commit changes with the commit message: “Bump version”
#. Tag commit as 'vX.Y.Z'
#. Push changes with tags
