API
===

.. js:data:: loud

   :type: Object

.. js:attribute:: loud.VERSION

   :type: String

.. js:attribute:: loud.FORCE_VALID_MARKUP

   :type: Boolean
   :default: true
   :since: 0.9.0

   Force markup to be valid. Set to :code:`false`, to handle invalid markup as
   valid.

.. js:function:: loud.say(node)

   :param Object|Object[] node: DOM element or array of DOM elements
   :rtype: Array of Strings
   :returns: Words

   Transform a DOM element to words.

.. js:function:: loud.warn(message)

   :param String message: Error message
   :since: 0.9.0

   Warn about failed validation.

.. js:function:: loud.error(message)

   :param String message: Error message
   :throws: loud.ValidationError
   :since: 0.9.0

   Throw validation error.

.. js:function:: loud.ValidationError(message)

   :param String message: Error message
   :type: Function
   :since: 0.9.0

   Validation error.
