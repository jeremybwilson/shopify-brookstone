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
};

theme.init = function(){
	theme.clickEvent();
	theme.productTabs();
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