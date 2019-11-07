theme.clickEvent = function(){
    // cms pages navbar collapse (mobile)
	$(".customer-navigation-title").click(function(){
		$(this).parent().toggleClass("active");
    });
    
    // collapse toggle for footer menu links
    $(".nav-sub-header").click(function(){
        $(this).parent().toggleClass('active').siblings().removeClass('active');
    });

    // faq page sidenav opener
    $(".left-nav .opener").click(function() {
        $(this).siblings('.dropdown').slideToggle();
    });
};

// filter button mobile sorting function
theme.collectionProductSoting = function(){
    if($(window).width() < 1024  ){
        var filterProductMobile = $("#sortme").html();
        $(".mobile-sortby").append(filterProductMobile);
        $("#sortme").html('');
    }
};

// product page tabs toggle function
theme.productTabs = function(){
	var tab = $(".product-page .product-description--area .tab-content");
	tab.click(function(event) {
		$(this).find(".toggle-icon").toggleClass('active');
		$(this).find(".toggle-content").stop().slideToggle();
	});
	$(".product-page .product-description--area .tab-header .tab-item").click(function(event) {
		var target = $(this).attr('data-tab');
		$(".product-page .product-description--area .tab-description-wrapper").find("#"+target+" .toggle-content").slideDown();
	});
};

// product page description read more function
theme.readMore = function(){
	$(".product-page #product-description #read-more").click(function(event) {
		$(".product-description--area #description-guide").find(".toggle-content").slideDown();
	});
};

// contact page message hide function
theme.contactMessage = function(){
	setTimeout(function(){
		$(".successForm").hide();
	}, 10000);
};

// cart page related items slider function
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
	theme.productTabs();
	theme.readMore();
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