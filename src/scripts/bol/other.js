theme.clickEvent = function(){
	$(".customer-navigation-title").click(function(){
		$(this).parent().toggleClass("active");
	});
};

theme.contactMessage = function(){
	setInterval(function(){
		debugger;
		$(".successForm").hide();
	}, 10000);
};

theme.init = function(){
	theme.clickEvent();
	theme.contactMessage();
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