theme.clickEvent = function(){
	$(".customer-navigation-title").click(function(){
		$(this).parent().toggleClass("active");
    });
    
    $(".nav-sub-header").click(function(){
        $(this).parent().toggleClass('active').siblings().removeClass('active');
    });

    $(".left-nav .opener").click(function() {
        $(this).siblings('.dropdown').slideToggle();
    });
};
theme.collectionProductSoting = function(){
    if($(window).width() < 1024  ){
        var filterProductMobile = $("#sortme").html();
        $(".mobile-sortby").append(filterProductMobile);
        $("#sortme").html('');
    }
};
theme.contactMessage = function(){
	setTimeout(function(){
		$(".successForm").hide();
	}, 10000);
};
theme.relatedItems = function() {
    $("#cart-related-collection").slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                slidesToShow: 1
                }
            }
        ]
    });
}
theme.init = function(){
	theme.clickEvent();
	theme.contactMessage();
	theme.collectionProductSoting();
    theme.relatedItems();
};
$(document).ready(function () {
	(function () {
		$(document).on('shopify:section:load', function (event) {
			$('.no-fouc').removeClass('no-fouc');
			$('.load-wait').addClass('hide');
		});
	}());
	$('.no-fouc').removeClass('no-fouc');
	$('.load-wait').addClass('hide'); 

	theme.init();
});