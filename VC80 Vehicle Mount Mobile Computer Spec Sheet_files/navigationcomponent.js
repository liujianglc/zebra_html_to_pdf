/*

	FILE: nav.js
	DESCRIPTION: Pramary site navigation
	AUTHOR(S): Jesse Weed, Frankie Ramirez

*/

var $ = jQuery;

$(function() {

	var Zebra = window.Zebra || {}, scrollPosition = 0;

	Zebra.Nav = {

	/* - - - - - - - - - - - - - - - - - >

		CONFIGURATION & INITILIZATION

	< - - - - - - - - - - - - - - - - - */

	// HTML ELEMENTS
	html: {
		breadcrumbs: '.breadcrumbs',
		cover: '.bg-cover',
		dropdown: '.dropdown',
		footer: 'footer',
		header: '.header-center',
		headerRight: '.header-right',
		mainContent: '.content',
		menu: '.menu-icon',
		primary: '.nav-primary',
		quaternary: '.nav-quaternary',
		search: '.header-search-container',
		searchIcon: '.search-icon',
		secondary: '.nav-secondary',
		tertiary: '.nav-tertiary'
	},


	// SET ELEMENT POSITIONS
	pos: {
		breadcrumbs: 129,
		content: 120,
		nav: 190,
		negative: -500
	},


	// MISC VARIABLES
	currentMenu: {
		primary: false,
		secondary: false,
		tertiary: false
	},

	menuIsOpen: false,
	navIsOpen: false,
	level: 2,
	timeout: {},
	timeout2: {},

	init: function() { // INITIALIZE NAVIGATION
		var self = this;

		if( !$('body').hasClass('cq-wcm-edit') ) {
			$('body').addClass('sticky'); // DELETE THIS TO REMOVE STICKY NAV FUNCTIONALITY
		}

		if( $('body').hasClass('sticky') ) {
			$('.languagedropdown').before('<i class="icon-search search-icon"></i>');
		}

        var secondaryNav = $('.sec-nav');
        if (secondaryNav.length) {
            $('body').addClass('has-secondary-nav');
        }

		// TRIGGER NAV OPEN ON CLICK
		$('.nav-primary-title').on('mouseenter', 'a', self.showMenu);
		$('.nav-primary-title').on('click', 'a', self.showMobileSubMenu);
		$('.mega-menu').on('mouseenter', self.showMenu);
		$('header.main').on('mouseleave', self.hideMenu);
		$('.nav-anchor-terminal-link').on('click', self.showSubMenu);
		$('.breadcrumb-back').on('click', self.hideSubMenu);
		$(self.html.menu).on('click', self.toggleMobileMenu);
		$(self.html.searchIcon).on('click', self.toggleMobileSearch);
		$(window).on('scroll', self.scrollWindow);

        // secondary nav functionality
        secondaryNav.on('mouseenter', '.sec-nav-item', self.hoverSecMenu)
            .on('mouseleave', '.sec-nav-item', self.leaveSecMenu)
            .on('click', '.sec-nav-link', self.toggleSecMenu);

	}, // END: INIT

	/* - - - - - - - - - - - - - - - - - >

		  MODULE FUNCTIONS

	< - - - - - - - - - - - - - - - - - */

	scrollWindow: function() {
		if($('body').hasClass('sticky')) {
			if($(document).scrollTop() > 35) {
				$('body').addClass('mini');
			}else {
				$('body').removeClass('mini');
			}
		}
	},

	showMenu: function() {
		if(window.innerWidth > 834) {
			clearTimeout(self.timeout);

			if($(this).parent().hasClass('nav-primary-title')) {
				$('.breadcrumbs')
					.removeClass('open')
					.find('li')
					.addClass('hide')
					.find('a')
					.empty();
			}

			// if more than 0 levels of menu
			if($(this).data('levels') > 0) {
				// clear menu hide timeout
				$('.nav-primary-title').removeClass('selected');
				$(this).parent().addClass('selected');
				$('.mega-menu').addClass('open');

				// select nav-group index
				var index = $(this).data('nav-group');
				// open nav-group by index
				$('.nav-secondary').removeClass('open');
				$('.nav-child-' + index).find('.nav-secondary').addClass('open');
			}else if($(this).data('levels') == 0) {
				$('.nav-primary-title').removeClass('selected');
				$('.mega-menu').removeClass('open');
				$('.nav-secondary').removeClass('open');
			}
		}
	},

	hideMenu: function() {
		if( window.innerWidth > 834 ) {
			self.timeout = setTimeout(function() {
				$('.nav-primary-title').removeClass('selected');
				$('.mega-menu').removeClass('open');

				$('.subnav-primary')
					.find('.open')
					.removeClass('open');

				$('.subnav-primary')
					.find('.hide')
					.removeClass('hide');

				$('.subnav-primary')
					.find('.full')
					.removeClass('full');

				$('.breadcrumbs')
					.removeClass('open')
					.find('li')
					.addClass('hide')
					.find('a')
					.empty();
			}, 1000);
		}
	},

	showSubMenu: function() {
		$(this)
			.addClass('hide') // hide link
			.next()
			.addClass('open') // open next sub-menu
			.parent()
			.addClass('full')
			.siblings()
			.addClass('hide'); // hide all previous links

		var level = $(this).data('level');

		if(window.innerWidth < 835) {
			level = $(this).data('level') + 1;
		}

		$('.breadcrumbs')
			.children('ul')
			.find('li[data-back="' + level + '"]')
			.removeClass('hide')
			.children('a')
			.attr('href', $(this).attr('href'))
			.append($(this).text());

		$('.breadcrumb-back').data('level', level);

		if(!$('.mega-menu .breadcrumbs').hasClass('open')) {
			$('.mega-menu .breadcrumbs').addClass('open')
		}

		return false;
	},

	hideSubMenu: function() {
		var level = $(this).data('level');

		if(window.innerWidth < 835) {
			level = $(this).data('level') + 1;
		}

		$('.breadcrumbs')
			.find('li[data-back="' + $(this).data('level') + '"]')
			.last()
			.addClass('hide')
			.find('a')
			.empty();

		var menu = $('.nav-secondary.open');

		if( window.innerWidth > 834 ) {
			if( $(this).data('level') == 2 ) {
				$(this).parent().removeClass('open');
			}else if( $(this).data('level') == 3 ) {
				menu = $('.nav-tertiary.open');
				$(this).data('level', 2);
			}else {
				menu = $('.nav-quaternary.open');
				$(this).data('level', 3);
			}

			menu.find('.open').removeClass('open');
			menu.find('.hide').removeClass('hide');
			menu.find('.full').removeClass('full');
		}else {
			if( $('.nav-quaternary').hasClass('open') ) {
				menu = $('.nav-tertiary.open');
				$(this).data('level', 3);
			}else if( $('.nav-tertiary').hasClass('open') ) {
				menu = $('.nav-secondary.open');
				$(this).data('level', 2);
			}else {
				menu = $('.subnav-primary');
				$('.breadcrumbs').removeClass('open');
				$('.header-center').addClass('open');
			}

			menu.find('.open').removeClass('open');
			menu.find('.hide').removeClass('hide');
			menu.find('.full').removeClass('full');
		}

		return false;
	},

	showMobileSubMenu: function() {
		if(window.innerWidth < 835 && $(this).data('levels') > 0) {
			$('.breadcrumbs')
				.children('ul')
				.find('li[data-back="2"]')
				.removeClass('hide')
				.children('a')
				.attr('href', $(this).attr('href'))
				.append( $(this).text() );

			Zebra.Nav.level++;

			$('.header-center').removeClass('open');
			$('.mega-menu').addClass('open');
			$('.breadcrumbs').addClass('open');

			var index = $(this).data('nav-group');
			// open nav-group by index
			$('.nav-secondary').removeClass('open');
			$('.nav-child-' + index).find('.nav-secondary').addClass('open');

			return false;
		}
	},

	/*
	*
	* Toggle mobile display of navigation menu
	*
	*/

	toggleMobileMenu : function() {
		$('.mega-menu').removeClass('open').find('.open').removeClass('open');
		$('.search-icon').removeClass('open');
		$('.header-search-container').removeClass('open');
		$('.dropdown').removeClass('open');
		$('.breadcrumbs').removeClass('open');
		$('.header-center').toggleClass('open');

		return false;
	},

	/*
	*
	* Toggle mobile display of search input
	*
	*/

	toggleMobileSearch : function() {
		var self = this;
		$(this).toggleClass('open');
		$('.mega-menu').removeClass('open').find('.open').removeClass('open');
		$('.header-center').removeClass('open');
		$('.dropdown').removeClass('open');
		$('.breadcrumbs').removeClass('open');
		$('.header-search-container').toggleClass('open');

		if( $('.header-search-container').hasClass('open') ) {
			setTimeout("$('.header-search-container').find('.search-input-container--input.tt-input').focus();", 0)
		}

		return false;
	},

    hoverSecMenu: function(e) {
        clearTimeout(self.timeout2);

        if (window.innerWidth > 834) {
            var target = $(e.target);
            if (!target.hasClass('sec-nav-item')) {
                target = target.closest('.sec-nav-item');
            }
            target.siblings('.selected').removeClass('selected');
            target.addClass('selected');
        }

        return false;
    },

    leaveSecMenu: function(e) {
        if (window.innerWidth > 834) {
            var target = $(e.target);
            if (!target.hasClass('sec-nav-item')) {
                target = target.closest('.sec-nav-item');
            }
            if (target.find('ul').length == 0) {
                target.removeClass('selected');
                return false;
            }
            self.timeout2 = setTimeout(function() {
                target.removeClass('selected');
            }, 1000);
        }

        return false;
    },

    toggleSecMenu: function() {
    /*
    secondary nav menu fix for mobile KVARADI
    */
             var menuItem = $(this);
             if (menuItem.attr('href') == '#') {
                 if (!menuItem.parent().hasClass('selected')) {
                	$('.sec-nav-item.selected').removeClass('selected')
                		.find('arrow')
                		.removeClass('icon-up-arrow')
                		.addClass('icon-down-arrow');

					menuItem.parent().addClass('selected');

					menuItem.find('arrow')
						.removeClass('icon-down-arrow')
						.addClass('icon-up-arrow');
                 }
                 else{
     				$('.sec-nav-item.selected').removeClass('selected').find('arrow').removeClass('icon-up-arrow').addClass('icon-down-arrow');
                 }
                 return false;
             }
         }
   };

  Zebra.Nav.init();
  // END FILE: Zebra.Nav

});

