/*
 *	Name:		Ok Tab Switcher
 *	Author: 	Mitchell Petty <https://github.com/mpetty/ok-tab>
 *	Version: 	v1.2
 */
(function($) {
"use strict";

	var OkTab = function(selector,settings) {

		// Set properties
		this.selector = $(selector);
		this.settings = settings;
		this.$tabNav = $('.' + this.settings.tabNavClass, this.selector);
		this.$tabContent = $('.' + this.settings.tabContentClass, this.selector);

		// Initialize
		this.Initialize.call(this);

	};

	OkTab.prototype = {

		/*
		 *	Initialize
		 */
		Initialize : function() {

			// Event listeners
			$('a', this.$tabNav).off('.okTab').on('click.okTab', $.proxy(this.activate,this));

			// Build it
			this.build.call(this);

		},

		/*
		 *	Build
		 */
		build : function() {

			// Set active tab
			if( ! $('.'+this.settings.activeClass, this.$tabNav).length ) {
				$('li:first', this.$tabNav).addClass(this.settings.activeClass);
			}

			if( $('.'+this.settings.activeClass, this.$tabContent).length ) {
				$('> div, > .tab', this.$tabContent).not($('.'+this.settings.activeClass, this.$tabContent)).hide();
			} else {
				$('> div:first, > .tab:first', this.$tabContent).addClass(this.settings.activeClass);
				$('> div, > .tab', this.$tabContent).not(':first').hide();
			}

			// Set tab nav names
			$('a', this.$tabNav).each(function(i) {
				var url = $(this).attr('href');

				if( url.indexOf("#") != -1 ) {
					$(this).attr( "data-tabname", $(this).attr('href').replace('#', ''));
				} else {
					$(this).attr( "data-tabname", i + 1);
				}
			});

			// Set tab names
			$('> div, > .tab', this.$tabContent).each(function(i) {
				var id = $(this).attr('id');

				if( id.length ) {
					$(this).attr( "data-tabname", $(this).attr('id'));
				} else {
					$(this).attr("data-tabname", i + 1);
				}
			});

		},

		/*
		 *	Events
		 *
		 *	@param {object} - e
		 */
		activate : function(e) {

			// Reference to 'this'
			var self = this;

			// Define vars
			var $this = $(e.currentTarget);
			var $curTab = $('.'+self.settings.activeClass, self.$tabNav).children().attr('data-tabname');
			var $curTabHeight = self.$tabContent.height();
			var $tabName = $this.attr('data-tabname');
			var $newHeight = false;

			// Prevent default
			e.preventDefault();
			e.stopPropagation();

			// Continue only if not animating
			if( self.$tabContent.find(":animated").length == 0 && $curTab != $tabName ) {

				// Toggle active tab
				$('li', self.$tabNav).removeClass(self.settings.activeClass);
				$('> div', self.$tabContent).removeClass(self.settings.activeClass);
				$this.parent().addClass(self.settings.activeClass);

				// Animate
				$('[data-tabname='+$curTab+']', self.$tabContent).animate({'opacity':'hide'}, self.settings.animSpeed, function() {

					$newHeight = $('> div[data-tabname='+$tabName+']', self.$tabContent).outerHeight(true);

					$('> div[data-tabname='+$tabName+']', self.$tabContent).animate({'opacity':'show'}, self.settings.animSpeed).addClass(self.settings.activeClass);

					self.$tabContent.height($curTabHeight);

					self.$tabContent.animate({'height':$newHeight}, self.settings.animSpeed, function() {
						self.$tabContent.css({'height':'auto'});
					});

				});

			}

		}
	};

	/*
	 *	Initialize Plugin
	 */
	$.fn.okTab = function(options) {
		return this.each(function() {

			// Set vars
			var settings = $.extend(true, {}, $.fn.okTab.defaults, options),
				okTab;

			// If called on document, intialize using data attr
			if(this === document) {
				$('['+settings.tabDataAttr+']').each(function() {
					okTab = new OkTab(this, settings);
				});

			// Else call on element
			} else {
				okTab = new OkTab(this, settings);
			}

			// Return for chaining
			return this;

		});
	};

	/*
	 *	Plugin Defaults
	 */
	$.fn.okTab.defaults = {
		tabDataAttr				: 'data-tabs',		// Used to init tabs when initialized on document
		tabNavClass 			: 'tabs',			// Tab Nav ID/Class
		tabContentClass 		: 'tabs-content',	// Tab Content ID / Class
		activeClass 			: 'active',			// Tab Active Class
		animSpeed 				: 200				// Animation Speed
	};

})(jQuery);