Predicting States and Properties
================================

Widget States
-------------

=============== ======== ====================== ========
State           HTML     Positive               Negative
=============== ======== ====================== ========
aria-checked    checked  ``[role, 'checked']``  ``[role, 'not checked']``
aria-disabled   disabled ``[role, 'disabled']``
aria-expanded            ``[role, 'expanded']`` ``[role, 'collapsed']``
aria-hidden     hidden   ``[role, 'hidden']``
aria-invalid             ``[role, 'invalid']``
aria-pressed             ``[role, 'pressed']``  ``[role, 'not pressed']``
aria-selected   selected ``[role, 'selected']``
=============== ======== ====================== ========

Widget Properties
-----------------

==================== ======
Property             Output
==================== ======
aria-autocomplete    ``[role, 'autocomplete', value]``
aria-haspopup        ``[role, 'haspopup']``
aria-label           See accessible name
aria-level           ``[role, 'level', value]``
aria-multiline       ``[role, 'multiline']``
aria-multiselectable ``[role, 'multiselectable']``
aria-orientation     ``[role, 'orientation', value]``
aria-readonly        ``[role, 'readonly']``
aria-required        ``[role, 'required']``
aria-sort            ``[role, 'sort order', value]``
aria-valuemax        See ranges
aria-valuemin        See ranges
aria-valuenow        See ranges
aria-valuetext       See ranges
==================== ======

Live Region States
------------------

========= ================== ========
State     Positive             Negative
========= ================== ========
aria-busy ``[role, 'busy']``
========= ================== ========

Live Region Properties
----------------------

============= ======
Property      Output
============= ======
aria-atomic   ``[role, 'atomic']``
aria-live     ``[role, 'live', value]``
aria-relevant ``[role, 'relevant', value]``
============= ======

Drag-and-Drop States
--------------------

============ ======
State        Output
============ ======
aria-grabbed ``[role, 'grabbed']``
             ``[role, 'grabbable']``
============ ======

Drag-and-Drop Properties
------------------------

=============== ======
Property        Output
=============== ======
aria-dropeffect ``[role, 'dropeffect', value]``
=============== ======

Relationship Properties
-----------------------

===================== ======
Property              Output
===================== ======
aria-activedescendant See active descendant
aria-controls         ``[role, 'controls', value]``
aria-describedby      Accessible name of the linked elements
aria-flowto           ``[role, 'flowto', value]``
aria-labelledby       See accessible name
aria-owns             ``[role, 'owns', value]``
aria-posinset         ``[role, value, 'of', setsize]``
aria-setsize          ``[role, 'of', setsize, 'items']``
===================== ======

Order of States and Properties
------------------------------

#. multiline
#. orientation
#. posinset
#. setsize
#. invalid
#. disabled
#. level
#. sort order
#. checked
#. not checked
#. expanded
#. collapsed
#. pressed
#. not pressed
#. selected
#. grabbed
#. grabbable
#. busy
#. required
#. readonly
#. multiselectable
#. haspopup
#. autocomplete
#. dropeffect
#. live
#. relevant
#. atomic
#. controls
#. owns
#. flowto
#. described by
#. active descendant

The order is public API.
