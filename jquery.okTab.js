/*
 *	Ok Tab Switcher
 *
 *	@author		Mitchell Petty <https://github.com/mpetty/ok-tab>
 *	@version	v1.4
 */
(function($) {
"use strict";

	var OkTab = function(selector, settings) {

		var self = this;

		// Set properties
		this.selector = $(selector);
		this.settings = settings;
		this.tabName = null;
		this.tabsViewed = [];

		// Store elements
		this.el = {};
		this.el.tabContent = $('.' + this.settings.tabContentClass, this.selector);
		this.el.primaryNav = $('.' + this.settings.tabNavClass, this.selector);
		this.el.secondaryNav = $(this.settings.connectedTabNav);
		this.el.tabs = $("> div, > .tab", this.el.tabContent);
		this.el.curTab = null;
		this.el.prevTab = null;
		this.el.nextTab = null;
		this.el.tabNav = [];

		// Build array of all primaryNav navs
		if(this.el.primaryNav.length) {
			this.el.primaryNav.each(function() {
				self.el.tabNav.push($(this));
			});
		}

		// Build array of all secondary navs
		if(this.el.secondaryNav.length) {
			this.el.secondaryNav.each(function() {
				self.el.tabNav.push($(this));
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

			var self = this;

			// Tab nav
			for(var value in this.el.tabNav) {
				$('a', this.el.tabNav[value]).off('.okTab').on('click.okTab', function(e) {
					var tabName = $(this).attr('data-tabname');
					e.preventDefault();
					self.activate(tabName);
				});
			}

			// Next/Prev links
			$("[" + this.settings.tabDataLink + "]", this.el.tabContent).off(".okTab").on("click.okTab", function(e) {
				var tabName = $(this).attr('data-tabname');
				e.preventDefault();
				self.activate(tabName);
			});

			// Build it
			this.build.call(this);

			// Load tab
			if(this.settings.saveTab) {
				this.activate(window.location.hash.replace('#tab-',''), true);
			}

		},

		/**
		 *	Build
		 */
		build : function() {

			var self = this;

			// Set active tab
			if( $('.'+this.settings.activeClass, this.el.tabContent).length ) {
				this.el.curTab = this.el.tabs.filter("." + this.settings.activeClass);
				this.el.tabs.not(this.el.curTab).hide();
			} else {
				this.el.curTab = this.el.tabs.first();
				this.el.curTab.addClass(this.settings.activeClass);
				this.el.tabs.not(":first").hide();
			}

			// Set tab nav names
			for(var value in this.el.tabNav) {
				if( ! $('.'+this.settings.activeClass, this.el.tabNav[value]).length ) {
					$('li:first', this.el.tabNav[value]).addClass(this.settings.activeClass);
				}

				$('a', this.el.tabNav[value]).each(function(i) {
					var url = $(this).attr('href');

					if( url.indexOf("#") != -1 && url.length >= 2 ) {
						$(this).attr("data-tabname", $(this).attr('href').replace('#', ''));

						if ($(this).parent().hasClass(self.settings.activeClass)) {
							self.tabName = $(this).attr("href").replace("#", "");
						}
					} else {
						$(this).attr("data-tabname", i + 1);

						if ($(this).parent().hasClass(self.settings.activeClass)) {
							self.tabName = i + 1
						}
					}
				});
			}

			// Set tab names
			$('> div, > .tab', this.el.tabContent).each(function(i) {
				var id = $(this).attr('id');

				if( typeof id !== 'undefined' && id.length ) {
					$(this).attr("data-tabname", $(this).attr('id'));
				} else {
					$(this).attr("data-tabname", i + 1);
				}
			});

			// Buttons
			this.el.tabs.each(function (j) {
				var tabLink = $("[" + self.settings.tabDataLink + "]", $(this)),
					nextLink = $(this).next(),
					prevLink = $(this).prev();

				if(!tabLink.length) return;

				for (var i = tabLink.length - 1; i >= 0; i--) {
					var url = $(tabLink[i]).attr("href");

					if (url.indexOf("#") != -1) {
						$(tabLink[i]).attr("data-tabname", $(tabLink[i]).attr("href").replace("#", ""))
					} else {
						if ($(tabLink[i]).attr(self.settings.tabDataLink) === "next") {
							if (nextLink.length) {
								$(tabLink[i]).attr("data-tabname", nextLink.attr("data-tabname"))
							} else {
								$(tabLink[i]).attr("data-tabname", self.el.tabs.first())
							}
						} else {
							if ($(tabLink[i]).attr(self.settings.tabDataLink) === "prev") {
								if (prevLink.length) {
									$(tabLink[i]).attr("data-tabname", prevLink.attr("data-tabname"))
								} else {
									$(tabLink[i]).attr("data-tabname", self.el.tabs.last())
								}
							}
						}
					}
				}
			});

		},

		/**
		 *	Events
		 *
		 *	@param {object} - e
		 */
		activate : function(tabName, isOnLoad) {

			// Define vars
			var self = this,
				curTab = $('.'+self.settings.activeClass, self.el.tabNav[0]).children().attr('data-tabname'),
				curTabHeight = self.el.tabContent.height(),
				prevTab = $("> [data-tabname=" + curTab + "]", self.el.tabContent),
				nextTab = $("> [data-tabname=" + tabName + "]", self.el.tabContent),
				newHeight = null;

			// quit if no tab to switch to
			if(!nextTab.length) return;

			// Save tab name as hash
			if(this.settings.saveTab) window.location.hash = encodeURIComponent('tab-'+tabName);

			// Continue only if not animating
			if( self.el.tabContent.find(":animated").length == 0 && curTab != tabName ) {

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
				for(var value in this.el.tabNav) {
					$('li', this.el.tabNav[value]).removeClass(self.settings.activeClass);
					this.el.tabNav[value].find('[data-tabname="'+tabName+'"]').parent().addClass(self.settings.activeClass);
				}

				// Animate
				if(isOnLoad) {
					prevTab.hide(0, function() {
						nextTab.show(0, function() {
							$(this).addClass(self.settings.activeClass);
							self.tabsViewed.push(tabName);
							self.el.curTab = $(this);
						});
					});
				} else {
					prevTab.animate({'opacity':'hide'}, self.settings.animSpeed, function() {

						newHeight = $('> div[data-tabname='+tabName+']', self.el.tabContent).outerHeight(true);

						self.el.tabContent.height(curTabHeight);

						nextTab.animate({'opacity':'show'}, self.settings.animSpeed, function() {
							$(this).addClass(self.settings.activeClass);
							self.settings.afterTabSwitch.call(self);
							self.tabsViewed.push(tabName);
							self.el.curTab = $(this);
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
		tabDataLink 			: "data-tabs-link",	// Tab link
		tabDataAttr				: 'data-tabs',		// Used to init tabs when initialized on document
		tabNavClass 			: 'tabs',			// Tab Nav ID/Class
		tabContentClass 		: 'tabs-content',	// Tab Content ID / Class
		activeClass 			: 'active',			// Tab Active Class
		animSpeed 				: 200,				// Animation Speed
		connectedTabNav			: '.tab-nav',		// Used to place tab nav outside of container
		saveTab					: true,				// Save tab on page refresh by using hashes
		beforeTabSwitch			: $.noop,
		afterTabSwitch			: $.noop
	};

})(jQuery);