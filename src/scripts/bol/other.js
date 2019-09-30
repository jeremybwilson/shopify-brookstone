
$(document).ready(function () {
    (function () {
        $(document).on('shopify:section:load', function (event) {
            $('.no-fouc').removeClass('no-fouc');
            $('.load-wait').addClass('hide');
        });
    }());
    $('.no-fouc').removeClass('no-fouc');
    $('.load-wait').addClass('hide'); 
});