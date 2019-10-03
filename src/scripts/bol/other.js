theme.clickEvent = function(){
	$(".customer-navigation-title").click(function(){
		$(this).parent().toggleClass("active");
	});
};

theme.relatedItems = function(){
	$("#cart-related-collection").slick();
}

theme.init = function(){
	theme.clickEvent();
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