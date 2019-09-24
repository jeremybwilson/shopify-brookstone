/*============================================================================
  Featured Products
==============================================================================*/
theme.FeaturedProducts = (function() {
  function FeaturedProducts(container) {

    var initHomepageCarousel = function(productCarousel) {
      productCarousel.owlCarousel({
        responsive: {
          0 : {
            items: 1
          },
          767 : {
            items: 3
          }
        },
        nav: true,
        navText: [$('.product-carousel--prev'),$('.product-carousel--next')],
        lazyLoad : true
      });


    };

    initHomepageCarousel($('.product-collection-carousel'));

    $(document).on('shopify:section:unload', function(event) {
      var target = $(event.target);
      target.find('.product-collection-carousel').owlCarousel("destroy");
      $(document).off('.product-collection-carousel');
    });

    $(document).on('shopify:section:load', function(event) {
      initHomepageCarousel($(event.target).find('.product-collection-carousel'));
    });

  }

  FeaturedProducts.prototype = _.assignIn({}, FeaturedProducts.prototype, {});

  return FeaturedProducts;
})();
