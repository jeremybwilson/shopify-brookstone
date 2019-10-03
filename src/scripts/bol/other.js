theme.clickEvent = function(){
	$(".customer-navigation-title").click(function(){
		$(this).parent().toggleClass("active");
	});
};

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

theme.readMore = function(){
	$(".product-page #product-description #read-more").click(function(event) {
		$(".product-description--area #description-guide").find(".toggle-content").slideDown();
	});
};

theme.init = function(){
	theme.clickEvent();
	theme.productTabs();
	theme.readMore();
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