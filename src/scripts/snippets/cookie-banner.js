/*============================================================================
 Cookie Banner
==============================================================================*/

$(document).ready(function () {
(function cookie_banner() {

  // check the cookie

  var check_banner_cookie = $.cookie('gdpr_banner_read');
  if(check_banner_cookie == null) {
    $.fancybox({
      href: "#cookie-banner--popup",
      tpl: {
        wrap : '<div class="fancybox-wrap" tabIndex="-1" id="cookie-banner--popup-wrapper"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
      },
      helpers: {
        overlay: null
      },
      openEffect: 'elastic',
      closeEffect: 'fade'
    });

    // close the button

    $('.button-close').click(function() {
      $.cookie('gdpr_banner_read','true', { expires: 180 }); // make the cookie, expires in 180 days
      parent.$.fancybox.close();

      setTimeout(function(){
        theme.utils.emailUtils.email_popup_load();
      }, 5000);

    });
  }

})();
});
