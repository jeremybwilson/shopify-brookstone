/* ----------------------------------------------------------------------------------------------------
 * EMAIL POPUP LOADER UTIL (used by snippets cookie-banner.js & newsletter-popup.js)
 * ---------------------------------------------------------------------------------------------------- */
module.exports = (function() {

    // LOAD : Email signup form popup (thing from bottom right of page)
    function email_popup_load() {
        var $popup = $('#subscribe--popup');
        if (!$popup.length > 0) {
            return false;
        }

        $.cookie('mailing_list_delay_popup', 'expires_seven_days', { expires: 7 });
        $.fancybox({
            href: "#subscribe--popup",
            tpl: {
                wrap: '<div class="fancybox-wrap" tabIndex="-1" id="subscribe--popup-wrapper"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
            },
            helpers: {
                overlay: null
            },
            openEffect: 'elastic',
            closeEffect: 'fade'
        });

        $('#subscribe--close').click(function () {
            parent.$.fancybox.close();
        });
    };

    // PUBLIC UTIL METHODS
    return {
        email_popup_load
    };

})();
