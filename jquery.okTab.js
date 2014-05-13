/*
 *	Ok Tab Switcher
 *
 *	@author		Mitchell Petty <https://github.com/mpetty/ok-tab>
 *	@version	v1.3
 */
(function($) {
"use strict";

	var OkTab = function(selector, settings) {

		var self = this;

		// Set properties
		this.selector = $(selector);
		this.settings = settings;
		this.$tabContent = $('.' + this.settings.tabContentClass, this.selector);
		this.$tabNav = [$('.' + this.settings.tabNavClass, this.selector)];
		this.$secondaryNav = $(this.settings.connectedTabNav);

		// Build array of all secondary navs
		if(this.$secondaryNav.length) {
			this.$secondaryNav.each(function() {
				self.$tabNav.push($(this));
			});
		}

		// Initialize
		this.Initialize.call(this);

	};

	OkTab.prototype = {

		/**
		 *	Initialize
		 */
		Initialize : function() {

			// Event listeners
			for(var value in this.$tabNav) {
				$('a', this.$tabNav[value]).off('.okTab').on('click.okTab', $.proxy(this.activate,this));
			}

			// Build it
			this.build.call(this);

		},

		/**
		 *	Build
		 */
		build : function() {

			// Set active tab
			if( $('.'+this.settings.activeClass, this.$tabContent).length ) {
				$('> div, > .tab', this.$tabContent).not($('.'+this.settings.activeClass, this.$tabContent)).hide();
			} else {
				$('> div:first, > .tab:first', this.$tabContent).addClass(this.settings.activeClass);
				$('> div, > .tab', this.$tabContent).not(':first').hide();
			}

			// Set tab nav names
			for(var value in this.$tabNav) {
				if( ! $('.'+this.settings.activeClass, this.$tabNav[value]).length ) {
					$('li:first', this.$tabNav[value]).addClass(this.settings.activeClass);
				}

				$('a', this.$tabNav[value]).each(function(i) {
					var url = $(this).attr('href');

					if( url.indexOf("#") != -1 && url.length >= 2 ) {
						$(this).attr("data-tabname", $(this).attr('href').replace('#', ''));
					} else {
						$(this).attr("data-tabname", i + 1);
					}
				});
			}

			// Set tab names
			$('> div, > .tab', this.$tabContent).each(function(i) {
				var id = $(this).attr('id');

				if( typeof id !== 'undefined' && id.length ) {
					$(this).attr("data-tabname", $(this).attr('id'));
				} else {
					$(this).attr("data-tabname", i + 1);
				}
			});

		},

		/**
		 *	Events
		 *
		 *	@param {object} - e
		 */
		activate : function(e) {

			// Define vars
			var self = this,
				$this = $(e.currentTarget),
				$curTab = $('.'+self.settings.activeClass, self.$tabNav[0]).children().attr('data-tabname'),
				curTabHeight = self.$tabContent.height(),
				tabName = $this.attr('data-tabname'),
				newHeight = false;

			// Prevent default
			e.preventDefault();
			e.stopPropagation();

			// Continue only if not animating
			if( self.$tabContent.find(":animated").length == 0 && $curTab != tabName ) {

				// Loop each tab nav
				for(var value in this.$tabNav) {
					$('li', this.$tabNav[value]).removeClass(self.settings.activeClass);
					this.$tabNav[value].find('[data-tabname="'+tabName+'"]').parent().addClass(self.settings.activeClass);
				}

				// Toggle active tab
				$('> div', self.$tabContent).removeClass(self.settings.activeClass);

				// Animate
				$('[data-tabname='+$curTab+']', self.$tabContent).animate({'opacity':'hide'}, self.settings.animSpeed, function() {

					newHeight = $('> div[data-tabname='+tabName+']', self.$tabContent).outerHeight(true);

					$('> div[data-tabname='+tabName+']', self.$tabContent).animate({'opacity':'show'}, self.settings.animSpeed).addClass(self.settings.activeClass);

					self.$tabContent.height(curTabHeight);

					self.$tabContent.animate({'height':newHeight}, self.settings.animSpeed, function() {
						self.$tabContent.css({'height':'auto'});
					});

				});

			}

		}
	};

	/**
	 *	Initialize Plugin
	 */
	$.fn.okTab = function(options) {
		return this.each(function() {

			// Set vars
			var settings = $.extend(true, {}, $.fn.okTab.defaults, options), okTab;

			// If called on document, intialize using data attr
			if(this === document) {
				$('['+settings.tabDataAttr+']').each(function() {
					settings.connectedTabNav = '[data-tabnav="'+$(this).attr(settings.tabDataAttr)+'"]';
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

	/**
	 *	Plugin Defaults
	 */
	$.fn.okTab.defaults = {
		tabDataAttr				: 'data-tabs',		// Used to init tabs when initialized on document
		tabNavClass 			: 'tabs',			// Tab Nav ID/Class
		tabContentClass 		: 'tabs-content',	// Tab Content ID / Class
		activeClass 			: 'active',			// Tab Active Class
		animSpeed 				: 200,				// Animation Speed
		connectedTabNav			: '.tab-nav'			// Used to place tab nav outside of container
	};

})(jQuery);