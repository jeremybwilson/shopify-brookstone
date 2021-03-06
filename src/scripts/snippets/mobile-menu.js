// functions related to left navigation on mobile
theme.openMobileMenu = function() {
    $("#mobile_drawer").addClass("active");
    theme.blankBgOpen();
};
theme.closeMobileMenu = function() {
    $("#mobile_drawer").removeClass("active");
    theme.blankBgClose();
};
theme.blankBgOpen = function() {
    $("html").addClass("overflow-hidden");
    $("body").addClass("overflow-hidden");
};
theme.blankBgClose = function() {
    $("html").removeClass("overflow-hidden");
    $("body").removeClass("overflow-hidden");
};
$(document).ready(function() {
    $("body").append($("#mobile_drawer"));
    $("#icon-nav-mobile-menu-btn").click(function(e) {
        e.stopPropagation();
        theme.openMobileMenu();
    });
    $("#mobile_drawer .drawer-close").click(function() {
        theme.closeMobileMenu();
    });
    $(document).on("click", "#mobile_drawer .li .icon-wrap", function(e) {
        e.stopPropagation();
        $("i", $(this)).toggleClass("fa-minus");
        $(this).parent().next(".child-menu").slideToggle();
    });
    $(document).on("click", "#mobile_drawer .li a", function(e) {
        e.stopPropagation();
    });
    $(document).on("click", "#mobile_drawer .child-li", function(e) {
        e.stopPropagation();
        var li = $(this);
        $(".link-data", li).slideToggle();
    }); 
});
