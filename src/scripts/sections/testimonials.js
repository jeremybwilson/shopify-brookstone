/*============================================================================
  Testimonials on index
==============================================================================*/
theme.Testimonials = (function() {
  function Testimonials(container) {

    var initTestimonials = function(Testimonialcarousel) {
      Testimonialcarousel.owlCarousel({
        itemsCustom : [
          [0, 1],
          [450, 1],
          [600, 1],
          [700, 1],
          [1000, 2],
          [1200, 3],
          [1400, 3],
          [1600, 3]
        ],
        navigation : false,
        pagination: true
      });

      // Custom Navigation Events
      $(".next").click(function(){
        owl.trigger('owl.next');
      })
      $(".prev").click(function(){
        owl.trigger('owl.prev');
      })
    };

    initTestimonials($('.testimonial-container'));

    $(document).on('shopify:section:unload', function(event) {
      var target = $(event.target);
      target.find('.testimonial-container').owlCarousel("destroy");
      $(document).off('.testimonial-container');
    });

    $(document).on('shopify:section:load', function(event) {
      initTestimonials($(event.target).find('.testimonial-container'));
    });

  }

  Testimonials.prototype = _.assignIn({}, Testimonials.prototype, {});

  return Testimonials;
})();
