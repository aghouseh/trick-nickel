/*********************************************************************
 *   ______     _      __      _   ___      __        __
 *  /_  __/____(_)____/ /__   / | / (_)____/ /_____  / /
 *   / / / ___/ / ___/ //_/  /  |/ / / ___/ //_/ _ \/ / 
 *  / / / /  / / /__/ ,<    / /|  / / /__/ ,< /  __/ /  
 * /_/ /_/  /_/\___/_/|_|  /_/ |_/_/\___/_/|_|\___/_/   
 *                                                   
 * -------------------------------------------------------------------
 * A stupid jQuery plugin written because no browser does this right yet.
 * 
 * @author Andrew Householder <aghouseh@me.com>
 * @version 1.0.0
 * @date 2013-11-28
 * @copyright 2013 Andrew Householder
 * @license MIT 
 */

;(function(window, document, $) {
	'use strict';

	// Trick Nickel constructor
	var TrickNickel = function (element, options) {
		this.element = element;
		this.$element = $(element);
		this.options = options;
		this.metadata = this.$element.data('trick-nickel-options');
	};

	TrickNickel.prototype = {

		// default configuration options
		defaults: {
			// (int)
			// pixel value to allow for leniency in the plugin calculation
			tolerance: 10,

			// (string)
			// class added when the element has been stuck
			stuck_class: 'stuck',

			// (string)
			// class added when the element has been unstuck
			unstuck_class: 'unstuck',

			// (int | function | jQuery object)
			// Three available types:
			// - int: static height in pixels
			// - function: must return a value (the initializing element is passed as a function argument)
			// - jQuery element: outerHeight() will be used to calculate the elements height
			footer_height: function ($element) { 
				return $element.outerHeight();
			},

			// (function)
			// this is our proxy wrapper function that will call the plugin logic. this is provided to allow for the inclusion 
			// of a throttle/debounce function, if desired.
			proxy: function (check) { 
				check.call(this);
			}
		},

		// utility function that normalizes our height value
		getFooterHeight: function trickNickelGetFooterHeight () {
			var footer_height;

			// function type
			if ($.isFunction(this.config.footer_height)) {
				footer_height = this.config.footer_height.call(this, this.$element);

			// jquery element
			} else if (this.config.footer_height instanceof jQuery) {
				footer_height = this.config.footer_height.outerHeight();

			// plain int
			} else {
				footer_height = this.config.footer_height;
			}

			// sanitize it to an int
			return parseInt(footer_height, 10);
		},

		// return our dimension calculations
		getHeights: function trickNickelGetHeights () {
			return {
				document: $(document.body).outerHeight(),
				window: $(window).height(),
				footer: this.getFooterHeight()
			};
		},

		// our main check function that handles the height gathering and the 
		check: function trickNickelCheck () {
			// gather dimensions
			var heights = this.getHeights(), to_stick;

			// do the height calculations to determine our sticky foot
			to_stick = (heights.document < (heights.window - heights.footer - this.config.tolerance));

			// toggle classes as needed
			this.$element
				.toggleClass(this.config.stuck_class, to_stick)
				.toggleClass(this.config.unstuck_class, !to_stick);
		},

		// cleanup after ourselves
		destroy: function trickNickelDestroy () {
			// unbind resize event
			$(window).off('resize.trickNickel');

			// remove plugin classes
			this.$element.removeClass(this.config.stuck_class, this.config.unstuck_class);
		},

		// main init function that builds our config and starts up the plugin
		init: function trickNickelInit () {
			// save a contextual reference
			var Tricky = this;

			// save folded config
			this.config = $.extend({}, this.defaults, this.options, this.metadata);

			// save a reference to our proxy check function so we can run it on init
			var check = function () {
				Tricky.config.proxy.call(Tricky, Tricky.check);
			};

			// run the check instantly
			check();

			// bind the resize to our proxy function
			$(window).on('resize.trickNickel', check);

			// chain for fun
			return this;
		}
	};

	// jQuery plugin definition
	$.fn.trickNickel = function (options) {
		return this.each(function() {
			// inits the plugin, and stores an instance as a data attribute
			$(this).data('trick-nickel', new TrickNickel(this, options).init());
		});
	};

})(window, document, jQuery || Zepto);