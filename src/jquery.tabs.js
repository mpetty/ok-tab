/*!
 *	Tab Switcher
 *
 *	@author		Mitchell Petty <https://github.com/mpetty/tabs>
 *	@version	v1.4.6
 */
(function($) {
"use strict";

	var Tabs = function(selector, settings) {

		// Set properties
		this.selector = $(selector);
		this.settings = settings;
		this.tabName = null;

		// Store elements
		this.el 				= {};
		this.el.tabContent 		= $('.' + this.settings.tabContentClass, this.selector);
		this.el.primaryNav 		= $('.' + this.settings.tabNavClass, this.selector);
		this.el.secondaryNav 	= $(this.settings.connectedTabNav);
		this.el.tabs 			= $("> ."+this.settings.tabClass+"", this.el.tabContent);
		this.el.tabNav 			= this.el.primaryNav.add(this.el.secondaryNav);
		this.el.tabLinks 		= $('a', this.el.tabNav).add($("[" + this.settings.tabDataLink + "]", this.el.tabContent));
		this.el.curTab 			= null;
		this.el.prevTab 		= null;
		this.el.nextTab 		= null;

		// Check for history
		if (!window.history || !window.history.pushState) this.settings.saveTab = false;

		// Initialize
		this.build();
		this.events();

		// Return selector
		return selector;

	};

	Tabs.prototype = {
		/**
		 *	Events
		 */
		events : function() {
			this.el.tabLinks.off('.tabs').on('click.tabs', $.proxy(this.onLinkClick, this));

			if(this.settings.saveTab) {
				$(window).off('popstate.tabs').on('popstate.tabs', $.proxy(this.onHashChange, this));
				if(window.location.hash !== '') this.activate(window.location.hash.replace('#',''), true);
			}
		},

		/**
		 *	Build
		 */
		build : function() {

			var self = this;

			// Set active tab
			if( $('.'+this.settings.tabClass+'.'+this.settings.activeClass, this.el.tabContent).length ) {
				this.el.curTab = this.el.tabs.filter('.'+this.settings.tabClass+'.' + this.settings.activeClass);
				this.el.tabs.not(this.el.curTab).hide();
			} else {
				this.el.curTab = this.el.tabs.first();
				this.el.curTab.addClass(this.settings.activeClass);
				this.el.tabs.not(":first").hide();
			}

			if( ! $('li.'+this.settings.activeClass, this.el.tabNav).length ) {
				$('li:first', this.el.tabNav).addClass(this.settings.activeClass);
			}

			// Set tab nav names
			this.el.tabNav.each(function() {
				$('a', $(this)).each(function(i) {
					var url = $(this).attr('href');

					if( url.indexOf("#") !== -1 && url.length >= 2 ) {
						$(this).attr("data-tabname", $(this).attr('href').replace('#', ''));

						if ($(this).parent().hasClass(self.settings.activeClass)) {
							self.tabName = $(this).attr("href").replace("#", "");
						}
					} else {
						$(this).attr("data-tabname", i + 1);

						if ($(this).parent().hasClass(self.settings.activeClass)) {
							self.tabName = i + 1;
						}
					}
				});
			});

			// Set tab names
			this.el.tabs.each(function(i) {
				var id = $(this).attr('id');

				if( typeof id !== 'undefined' && id.length ) {
					$(this).attr("data-tabname", $(this).attr('id'));
				} else {
					$(this).attr("data-tabname", i + 1);
				}
			});

			// Buttons
			this.el.tabs.each(function () {
				var tabLink = $("[" + self.settings.tabDataLink + "]", $(this)),
					nextLink = $(this).next(),
					prevLink = $(this).prev();

				if(!tabLink.length) return;

				for (var i = tabLink.length - 1; i >= 0; i--) {
					var url = $(tabLink[i]).attr("href");

					if (url.indexOf("#") !== -1) {
						$(tabLink[i]).attr("data-tabname", $(tabLink[i]).attr("href").replace("#", ""));
					} else {
						if ($(tabLink[i]).attr(self.settings.tabDataLink) === "next") {
							if (nextLink.length) {
								$(tabLink[i]).attr("data-tabname", nextLink.attr("data-tabname"));
							} else {
								$(tabLink[i]).attr("data-tabname", self.el.tabs.first());
							}
						} else {
							if ($(tabLink[i]).attr(self.settings.tabDataLink) === "prev") {
								if (prevLink.length) {
									$(tabLink[i]).attr("data-tabname", prevLink.attr("data-tabname"));
								} else {
									$(tabLink[i]).attr("data-tabname", self.el.tabs.last());
								}
							}
						}
					}
				}
			});

		},

		/**
		 *	Hash Change
		 */
		onHashChange : function(e) {
			if(window.location.hash !== '') this.activate(window.location.hash.replace('#',''), true);
		},

		/**
		 *	Link Click
		 *
		 *	@param {object} - e
		 */
		onLinkClick : function(e) {
			var tabName = $(e.currentTarget).attr('data-tabname');
			e.preventDefault();
			e.stopPropagation();
			this.activate(tabName);
		},

		/**
		 *	Activate
		 *
		 *	@param {string} - tabName
		 *	@param {boolean} - isOnLoad
		 */
		activate : function(tabName, isOnLoad) {
			// Define vars
			var self = this,
				curTab = $('.'+self.settings.tabClass+'.'+self.settings.activeClass, self.el.tabContent).attr('data-tabname'),
				curTabHeight = self.el.tabContent.height(),
				prevTab = $("> [data-tabname=" + curTab + "]", self.el.tabContent),
				nextTab = $("> [data-tabname=" + tabName + "]", self.el.tabContent),
				newHeight = null;

			// quit if no tab to switch to
			if(!nextTab.length) return;

			// Save tab name as hash
			if(this.settings.saveTab && !isOnLoad) history.pushState({id: 'tabs'}, null, '#'+encodeURIComponent(tabName));

			// Continue only if not animating
			if( self.el.tabContent.find("."+this.settings.tabClass+":animated").length === 0 && curTab !== tabName ) {

				// Set next tab
				self.el.nextTab = nextTab;

				// Before callback
				if(!isOnLoad) self.settings.beforeTabSwitch.call(self);

				// Set tab name
				self.tabName = tabName;

				// Toggle active tab
				$("li", self.el.tabNav).removeClass(self.settings.activeClass);
				self.el.tabs.removeClass(self.settings.activeClass);
				self.el.prevTab = prevTab;

				// Loop each tab nav
				$('li', self.el.tabNav).removeClass(self.settings.activeClass);
				self.el.tabNav.find('[data-tabname="'+tabName+'"]').parent().addClass(self.settings.activeClass);

				// Animate
				if(isOnLoad) {
					prevTab.hide(0, function() {
						nextTab.show(0, function() {
							$(this).addClass(self.settings.activeClass);
							self.el.curTab = $(this);
							self.settings.afterTabSwitch.call(self);
						});
					});
				} else {
					newHeight = $('> div[data-tabname='+tabName+']', self.el.tabContent).outerHeight(true);
					self.el.tabContent.height(curTabHeight);

					if( self.settings.scrollTop && $(window).scrollTop() > self.el.tabContent.offset().top ) {
						$('html, body').animate({
							scrollTop: self.el.tabContent.offset().top - self.settings.scrollOffset
						}, 200);
					}

					prevTab.animate({'opacity':'hide'}, self.settings.animSpeed, function() {

						nextTab.animate({'opacity':'show'}, self.settings.animSpeed, function() {
							$(this).addClass(self.settings.activeClass);
							self.el.curTab = $(this);
							self.settings.afterTabSwitch.call(self);
						});

						self.el.tabContent.animate({'height':newHeight}, self.settings.animSpeed, function() {
							self.el.tabContent.css({'height':'auto'});
						});

					});
				}

			}
		}
	};

	/**
	 *	Initialize Plugin
	 */
	$.tabs = function(options) {
		var settings = $.extend(true, {}, $.fn.tabs.defaults, options);

		$('['+settings.tabDataAttr+']').each(function() {
			settings.connectedTabNav = '[data-tabnav="'+$(this).attr(settings.tabDataAttr)+'"]';
			new Tabs(this, settings);
		});
	};

	$.fn.tabs = function(options) {
		return this.each(function() {
			var settings = $.extend(true, {}, $.fn.tabs.defaults, options);

			// If called on document, intialize using data attr
			if(this === document) {
				$.tabs(options);

			// Else call on element
			} else {
				new Tabs(this, settings);
			}

			// Return for chaining
			return this;

		});
	};

	/**
	 *	Plugin Defaults
	 */
	$.fn.tabs.defaults = {
		tabDataLink 			: "data-tabs-link",	// Tab link
		tabDataAttr				: 'data-tabs',		// Used to init tabs when initialized on document
		tabClass 				: 'tab',			// Tab Class
		tabNavClass 			: 'tabs',			// Tab Nav ID/Class
		tabContentClass 		: 'tabs-content',	// Tab Content ID / Class
		activeClass 			: 'active',			// Tab Active Class
		connectedTabNav			: '.tab-nav',		// Used to place tab nav outside of container
		saveTab					: true,				// Save tab on page refresh by using hashes
		animSpeed 				: 200,				// Animation Speed
		scrollTop	 			: true,				// Scroll to tab
		scrollOffset 			: 0,				// Scroll Offset
		beforeTabSwitch			: $.noop,
		afterTabSwitch			: $.noop
	};

})(jQuery);