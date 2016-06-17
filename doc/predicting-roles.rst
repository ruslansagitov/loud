Predicting Roles
================

Widgets
-------

Widgets does not have content.

================== ======================== ====
Role               Output                   HTML
================== ======================== ====
alertdialog        ``['alertdialog']``
button             ``['button']``           ``<button>``, ``<input type=button>``
checkbox           ``['checkbox']``         ``<input type=checkbox>``
dialog             ``['dialog']``
gridcell           ``['gridcell']``         ``<td>``
link               ``['link']``             ``<a>``
menuitem           ``['menuitem']``
menuitemcheckbox   ``['menuitemcheckbox']``
menuitemradio      ``['menuitemradio']``
option             ``['option']``           ``<option>``
progressbar        ``['progressbar']``      ``<progress>``
radio              ``['radio']``            ``<input type=radio>``
scrollbar          ``['scrollbar']``
slider             ``['slider']``           ``<input type=range>``
spinbutton         ``['spinbutton']``
tab                ``['tab']``
tabpanel           ``['tabpanel']``
textbox            ``['textbox']``          ``<input type=text>``
tooltip            ``['tooltip']``
treeitem           ``['treeitem']``
================== ======================== ====

Composite widgets
-----------------

Composite widgets have content.

Tables are special.

================== ================================== ====
Role               Output                             HTML
================== ================================== ====
combobox           ``['combobox', …]``
grid               ``['grid', …]``
listbox            ``['listbox', …]``                 ``<select>``
menu               ``['menu', …]``
menubar            ``['menubar', …]``
radiogroup         ``['radiogroup', …]``
tablist            ``['tablist', …]``
tree               ``['tree', …]``
treegrid           ``['treegrid', … 'treegrid end']``
================== ================================== ====

Document Structure
------------------

================== =========================================== ====
Role               Output                                      HTML
================== =========================================== ====
article            ``['article', … 'article end']``            ``<article>``
columnheader       ``['columnheader', …, 'columnheader end']`` ``<th>``
definition         ``['difinition', …, 'definition end']``
directory          ``['directory', … 'directory end']``
document           ``['document', …, 'document end']``         ``<body>``
group              ``['group', …, 'group end']``
heading            ``['heading']``                             ``<h1>—<h6>``
img                ``['img']``                                 ``<img>``
list               ``['list', …, 'list end']``                 ``<ul>, <ol>``
listitem           ``['listitem']``                            ``<li>``
math               ``['math']``
note               ``['note', …, 'note end']``
region             ``['region', …, 'region end']``
row                ``['row', …]``                              ``<tr>``
rowgroup           ``['rowgroup', …]``                         ``<thead>, <tfoot>, <tbody>``
rowheader          ``['rowheader', …]``                        ``<th scope=row>``
separator          ``['separator']``                           ``<hr>``
toolbar            ``['toolbar', …, 'toolbar end']``
================== =========================================== ====

Landmarks
---------

============= ============================================= ========
Role          Output                                        HTML
============= ============================================= ========
application   ``['application',   …, 'application end']``
banner        ``['banner',        …, 'banner end']``        ``<header>``
complementary ``['complementary', …, 'complementary end']`` ``<aside>``
contentinfo   ``['contentinfo',   …, 'contentinfo end']``   ``<footer>``
form          ``['form',          …, 'form end']``
main          ``['main',          …, 'main end']``          ``<main>``
navigation    ``['navigation',    …, 'navigation end']``    ``<nav>``
search        ``['search',        …, 'search end']``
============= ============================================= ========

Live regions
------------

======= ======
Role    Output
======= ======
alert   ``['alert',  …, 'alert end']``
log     ``['log',    …, 'log end']``
marquee ``['marque', …, 'marque end']``
status  ``['status', …, 'status end']``
timer   ``['timer',  …, 'timer end']``
======= ======

Abstract Roles
--------------

No output for abstract roles.

============= ======
Role          Output
============= ======
command       ``[…]``
composite     ``[…]``
input         ``[…]``
landmark      ``[…]``
range         ``[…]``
roletype      ``[…]``
section       ``[…]``
sectionhead   ``[…]``
select        ``[…]``
structure     ``[…]``
widget        ``[…]``
window        ``[…]``
============= ======

Presentation
------------

============ ======
Role         Output
============ ======
presentation ``[…]``
============ ======
