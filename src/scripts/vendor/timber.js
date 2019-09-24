// Timber functions
window.timber = window.timber || {};

timber.cacheSelectors = function () {
    timber.cache = {
        // General
        $html: $('html'),
        $body: $('body')
    };
};

timber.drawersInit = function () {
    timber.RightDrawer = new timber.Drawers('CartDrawer', 'right', {
        'onDrawerOpen': ajaxCart.load
    });
};

timber.getHash = function () {
    return window.location.hash;
};


timber.init = function () {
    timber.cacheSelectors();
    timber.drawersInit();
};

/*============================================================================
  Drawer modules
  - Docs http://shopify.github.io/Timber/#drawers
==============================================================================*/
timber.Drawers = (function () {
    var Drawer = function (id, position, options) {
        var defaults = {
            close: '.js-drawer-close',
            open: '.js-drawer-open-' + position,
            openClass: 'js-drawer-open',
            dirOpenClass: 'js-drawer-open-' + position
        };

        this.$nodes = {
            parent: $('body, html'),
            page: $('#PageContainer'),
            moved: $('.is-moved-by-drawer')
        };

        this.config = $.extend(defaults, options);
        this.position = position;

        this.$drawer = $('#' + id);

        if (!this.$drawer.length) {
            return false;
        }

        this.drawerIsOpen = false;
        this.init();
    };

    Drawer.prototype.init = function () {
        $(this.config.open).on('click', $.proxy(this.open, this));
        this.$drawer.find(this.config.close).on('click', $.proxy(this.close, this));
    };

    Drawer.prototype.open = function (evt) {
        // Keep track if drawer was opened from a click, or called by another function
        var externalCall = false;

        // Prevent following href if link is clicked
        if (evt) {
            evt.preventDefault();
        } else {
            externalCall = true;
        }

        // Without this, the drawer opens, the click event bubbles up to $nodes.page
        // which closes the drawer.
        if (evt && evt.stopPropagation) {
            evt.stopPropagation();
            // save the source of the click, we'll focus to this on close
            this.$activeSource = $(evt.currentTarget);
        }

        // CHECK : see if we are already on cart page, and therefore don't need to open the drawer
        var onCartPage = window.location.pathname.indexOf('/cart') !== -1;
        if (onCartPage || (this.drawerIsOpen && !externalCall)) {
            return this.close();
        }

        // Add is-transitioning class to moved elements on open so drawer can have
        // transition for close animation
        this.$nodes.moved.addClass('is-transitioning');
        this.$drawer.prepareTransition();

        this.$nodes.parent.addClass(this.config.openClass + ' ' + this.config.dirOpenClass);
        this.drawerIsOpen = true;

        // Set focus on drawer
        this.trapFocus(this.$drawer, 'drawer_focus');

        // Run function when draw opens if set
        if (this.config.onDrawerOpen && typeof (this.config.onDrawerOpen) == 'function') {
            if (!externalCall) {
                this.config.onDrawerOpen();
            }
        }

        if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
            this.$activeSource.attr('aria-expanded', 'true');
        }

        // Lock scrolling on mobile
        this.$nodes.page.on('touchmove.drawer', function () {
            return false;
        });

        this.$nodes.page.on('click.drawer', $.proxy(function () {
            this.close();
            return false;
        }, this));
    };

    Drawer.prototype.close = function () {
        if (!this.drawerIsOpen) { // don't close a closed drawer
            return;
        }

        // deselect any focused form elements
        $(document.activeElement).trigger('blur');

        // Ensure closing transition is applied to moved elements, like the nav
        this.$nodes.moved.prepareTransition({ disableExisting: true });
        this.$drawer.prepareTransition({ disableExisting: true });

        this.$nodes.parent.removeClass(this.config.dirOpenClass + ' ' + this.config.openClass);

        this.drawerIsOpen = false;

        // Remove focus on drawer
        this.removeTrapFocus(this.$drawer, 'drawer_focus');

        this.$nodes.page.off('.drawer');
    };

    Drawer.prototype.trapFocus = function ($container, eventNamespace) {
        var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

        $container.attr('tabindex', '-1');

        $container.focus();

        $(document).on(eventName, function (evt) {
            if ($container[0] !== evt.target && !$container.has(evt.target).length) {
                $container.focus();
            }
        });
    };

    Drawer.prototype.removeTrapFocus = function ($container, eventNamespace) {
        var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

        $container.removeAttr('tabindex');
        $(document).off(eventName);
    };

    return Drawer;
})();

// Initialize Timber's JS on docready
$(timber.init);