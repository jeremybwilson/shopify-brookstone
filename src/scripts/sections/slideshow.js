/*============================================================================
  Slideshow on index
==============================================================================*/
theme.Slideshow = (function() {
  function Slideshow(container) {

    var $container = this.$container = $(container),
         sectionId = $container.attr('data-section-id'),
       $flexslider = $container.find('.flexslider'),
        $sliderNav = $flexslider.next('.slider--nav'),
             speed = $flexslider.data('speed');

    $flexslider.flexslider({
      animation: 'fade',
      slideshowSpeed: speed,
      animationSpeed: 600,
      controlNav: false,
      pauseOnHover: true,
      pauseOnAction: true,
      nextText: '',
      prevText: '',
      customDirectionNav: $('.slider--nav > a'),

      /* adds a custom pagination */

      start: function(slider) {
        $sliderNav.find('.flexslider--current-slide').text(slider.currentSlide+1);
        $sliderNav.find('.flexslider--total-slides').text(slider.count);
      },
      before: function(slider) {
        $sliderNav.find('.flexslider--current-slide').text(slider.animatingTo+1);
      }
    });
  }

  return Slideshow;
})();

theme.Slideshow.prototype = _.assignIn({}, theme.Slideshow.prototype, {

  onBlockSelect: function(event) {

    // Ignore the cloned version
    var Slider = $(event.target).closest('.flexslider').data('flexslider');
    var $slide =  $(event.target);
    var slideIndex = $slide.data('flexslider-index');
    // Go to selected slide, pause autoplay

    Slider.flexslider(slideIndex);
    Slider.flexslider("pause");

  },
  onBlockDeselect: function() {
    var Slider = $(event.target).closest('.flexslider').data('flexslider');
    // Resume autoplay
    Slider.flexslider("play");

  }
});
