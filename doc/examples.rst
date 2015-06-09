Examples
========

Document Structure
------------------

.. code-block:: html

   <body>
     <header>
       <img src="/logo.png" alt="My Company"/>

       <form>
         <input type="search" aria-label="Query">
         <button>Search</button>
       </form>
     </header>

     <main>
       <h1>Main Theme</h1>

       <p>Main Content.</p>
     </main>

     <footer>
       Copyright
     </footer>
   </body>

.. code-block:: js

   describe('everything', function() {
       it('works', function() {
           var page = document.getElementsByTagName('body')[0];

           expect(loud.say(page)).toEqual([
               'banner',
               'My Company', 'img',
               'Query', 'textbox',
               'Search', 'button',
               'banner end',

               'main',
               'Main Theme', 'heading', 'level', '1',
               'Main Content.',
               'main end',

               'contentinfo',
               'Copyright',
               'contentinfo end'
           ]);
       });
   });

Controls
--------

.. code-block:: html

   <input type="checkbox" id="c1"/>

.. code-block:: js

   describe('checkbox', function() {
       beforeEach(function() {
           this.checkbox = document.createElement('input');
           this.checkbox.type = 'checkbox';
       });

       it('not checked', function() {
           expect(loud.say(this.checkbox)).toEqual([
               'checkbox', 'not checked'
           ]);
       });

       it('checked', function() {
           this.checkbox.click();

           expect(loud.say(this.checkbox)).toEqual([
               'checkbox', 'checked'
           ]);
       });
   });
