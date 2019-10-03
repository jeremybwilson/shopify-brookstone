/*============================================================================
  Header on Index
==============================================================================*/
theme.Header = (function() {
  function Header(container) {
    const $container = this.$container = $(container);
    const ui = {
      arrows: $( '#promo-arrow-left, #promo-arrow-right' ),
      body: $( 'body' ),
      borderFreeLink: $( '#nav-item-borderfree' ),
      borderFreeClose: $( '#nav-modal-borderfree-close' ),
      desktopNavWrap: $( '#nav-bar-wrapper' ),
      desktopNavItem: $( '.nav-primary-link' ),
      html: $( 'html' ),
      mobileNavButton: $( '#icon-nav-mobile-menu-btn' ),
      mobileNavMenu: $( '#nav-menu-mobile' ),
      mobileHeaders: $('#accordion').find('.accordion-header'),
      mobileSitesPicker: $( '#nav-sites-picker-mobile' ),
      mobileSubHeaders: $('#accordion').find('.accordion-sub-header'),
      promoWrap: $( '#double-promo-wrapper' ),
      searchIcon: $( '.nav-search' ),
      searchBar: $( '#nav-search-bar-wrapper' ),
      searchClose: $( '.nav-search-bar-close' ),
      subMenuHeader: $( '.has_sub_menu' ),
      swapRate: $container.attr( 'data-swap-rate' )
    }

    this.initStickyNav();
    const self = this;

    // BORDER-FREE : Extra toggle event so we can also tell when the borderfree panel is open on nav
    if ( ui.borderFreeLink.length > -1 ) {
      ui.borderFreeLink.on( 'click', () => {
        ui.desktopNavWrap.toggleClass( 'borderfree-open' );
      });

      ui.borderFreeClose.on( 'click', () => {
        ui.desktopNavWrap.toggleClass( 'borderfree-open' );
      });
    }

    // MOBILE NAV : Attach menu toggle event
    // if ( ui.mobileNavButton && ui.mobileNavMenu ) {
    //   ui.mobileNavButton.on( 'click', () => {
    //     ui.mobileNavMenu.toggleClass( 'mobile-nav-open' ); // TOGGLE : Menu itself
    //     ui.desktopNavWrap.toggleClass( 'mobile-nav-open' ); // TOGGLE : Transparent landing mode needs an extra flag to color right
    //     ui.body.toggleClass( 'js-drawer-open' ); // TOGGLE : Page scrolling (built in to a lib so tied to this classname)
    //     ui.html.toggleClass( 'menu-open' ); // TOGGLE : Html has some oddness from the theme, this clears it so iPoos can render right
    //   })
    // }

    // MOBILE NAV : Attach Sites-Picker toggle event
    if ( ui.mobileSitesPicker ){
      ui.mobileSitesPicker.on( 'click', () => {
        ui.mobileSitesPicker.toggleClass( 'open' );
      })
    }


    // MOBILE NAV : LEVEL 1 HEADER ACCORDION : Accordion Functionality
    ui.mobileHeaders.click( function(){
      const header = $(this);

      //Expand or collapse this panel
      if ( !header.hasClass('open') ) {
        $('.accordion-header').removeClass('open'); // Clear other major sections that are open
      }
      header.toggleClass('open');         // Add open class to the requested header
      header.next().slideToggle('fast');  // Reveal accordion content for requested header

      //Hide the other panels
      $(".accordion-content").not(header.next()).slideUp('fast');
    });

    // MOBILE NAV : LEVEL 2 - SUB-HEADER ACCORDION : Accordion Functionality
    ui.mobileSubHeaders.click( function(){
      const subHead = $(this);

      //Expand or collapse this panel
      if ( !subHead.hasClass('open') ) {
        $('.accordion-sub-header').removeClass('open'); // Clear other major sections that are open
      }
      subHead.toggleClass('open');             // Open this header
      subHead.next().slideToggle('fast');     // Reveal requested panel

      //Hide the other panels
      $(".accordion-content2").not(subHead.next()).slideUp('fast');
    });

    // ARIA-LABEL (NAV) : Marks expanded attribute on nav menu when open / closed via hover
    ui.subMenuHeader.hover(function () {
        $(this).attr('aria-expanded', function (index, attr) {
            return attr == 'false' ? true : 'false';
        });
    });


    // SEARCH BAR : When user clicks search icon, a new search bar will reveal itself
    // NOTE : This is also used by the transparent setup..
    if ( ui.searchIcon && ui.searchIcon.length > 0 ) {
      ui.searchIcon.on( 'click', () => {
        ui.desktopNavWrap.toggleClass( 'show-search-bar' );

      });

      ui.searchClose.on( 'click', () => {
        ui.desktopNavWrap.removeClass( 'show-search-bar' );
      });
    }


    // PROMO BANNER : If 2+ Promos enabled, connect swapping and arrow functionality
    if ( ui.promoWrap && ui.arrows && ui.swapRate ) {

      // METHOD : SWAP : Swap promo functionality
      const swapPromos = () => {
        ui.promoWrap.toggleClass( 'show-promo-two' );
      }

      // METHOD : TOGGLE : Swap promos every 5 seconds
      var start = () => {
        this.autoToggle = setInterval( function() {
          swapPromos();
        }, ui.swapRate * 1000 );
      };

      // METHOD : RESUME : Resume toggle after 25 secs of no user activity
      const resume = () => {
        if ( this.resumeTimer ) {
          clearTimeout( this.resumeTimer );
        }
        this.resumeTimer = setTimeout( function() {
          start();
        }, 25000 );
      };


      // EVENT : CLICK : User clicks either arrow, banner toggles and pauses swapping for ~30 secs
      ui.arrows.on( 'click', () => {
        swapPromos();

        // DISABLE : Pause auto-toggle, user is focusing on banner
        if ( this.autoToggle ) {
          clearInterval( this.autoToggle );
        }

        // RESUME : Begin 30 sec countdown timer to resume swapping (25 + 'ui.swapToggle' in sec )
        resume();
      });


      // START : Begin auto-toggle until user interaction
      start();
    }
  }

  Header.prototype = _.assignIn({}, Header.prototype, {
    initStickyNav: function () {
      this.navState = {
        offsetY: 0,
        height: 0,
        shouldPhantom: false,
        isSticky: false,
      }

      this.cache = this.cache || {}
      this.cache.$topBar = $('#top-bar')
      this.cache.$navContainer = $('#header-section')
      this.cache.$nav = $('#nav-bar-wrapper')
      this.cache.$window = $(window)

      this.initNavState()
      this.handleNavResize()
      this.handleNavScroll()
      this.bindNavEvents()
    },

    initNavState: function () {
      const initPosition = this.cache.$nav.css('position')
      this.navState.shouldPhantom = initPosition !== 'fixed' && initPosition !== 'absolute'
      this.navState.offsetY = this.cache.$topBar.outerHeight()
    },

    setNavSticky: function () {
      this.cache.$nav
        .addClass('isStuck')
        .css({ position: 'fixed', top: '0' })
      this.navState.isSticky = true
    },

    phantomNav: function () {
      this.cache.$navContainer.css({
        paddingBottom: this.navState.height + 'px'
      })
      this.setNavSticky()
    },

    unphantomNav: function () {
      this.cache.$navContainer.removeAttr('style')
      this.cache.$nav
        .removeAttr('style')
        .removeClass('isStuck')
      this.navState.isSticky = false
    },

    handleNavResize: function () {
      const nextHeight = this.cache.$nav.outerHeight()
      const nextOffsetY = this.cache.$topBar.outerHeight()

      if (this.navState.height !== nextHeight) {
        this.navState.height = nextHeight
      }

      if (this.navState.offsetY !== nextOffsetY) {
        this.navState.offsetY = nextOffsetY
      }
    },

    handleNavScroll: function () {
      const windowY = this.cache.$window.scrollTop()
      const isBelow = windowY > this.navState.offsetY && !this.navState.isSticky
      const isAbove = windowY <= this.navState.offsetY && this.navState.isSticky
      if (isBelow) {
        if (this.navState.shouldPhantom) {
          this.phantomNav()
        } else {
          this.setNavSticky()
        }
      } else if (isAbove) {
        this.unphantomNav()
      }
    },

    bindNavEvents: function () {
      this.cache.$window
        .on('resize', $.proxy(this.handleNavResize, this))
        .on('scroll touchmove', $.proxy(this.handleNavScroll, this))
        .on('modal-close', $.proxy(this.handleNavScroll, this))
    },
  });

  return Header;
})();
