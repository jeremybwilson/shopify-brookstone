/*============================================================================
  Columns Carousel on index
==============================================================================*/
theme.ColumnsCarousel = (function() {
  function ColumnsCarousel(container) {

    const $container = this.$container = $(container);
    const ui = {
          carousel: $container.find('.columns-carousel--columns'),
               nav: $container.find('.columns-carousel--nav'),
              prev: $container.find('.columns-carousel--prev'),
              next: $container.find('.columns-carousel--next'),
      currentSlide: $container.find('.columns-carousel--current-slide'),
       totalSlides: $container.find('.columns-carousel--total-slides'),
              item: $container.find('.column-item')
    };

    // CAROUSEL INIT
    var initColumnsCarousel = function(Columnscarousel) {

      var current = 0;
      var cols = Columnscarousel.owlCarousel({
        lazyLoad: true,
        responsive : {
          0 : {
            items: 1
          },
          767 : {
            items: 3
          },
          1024 : {
            items: 4
          }
        },
        onInitialized: function(event) {
          current = event.item.index+1;
          ui.currentSlide.text(current);
          ui.totalSlides.text(event.item.count);
        },
        onChanged: function(event) {
          current = event.item.index+1;

          // iOS - Library wasn't updated for swipes
          if ( ui.currentSlide.length > 0 ) {
            ui.currentSlide.text(current);
          }
        }
      });

      // NAVIGATION CONTROLS

      ui.prev.on('click', function(e) {
        cols.trigger('prev.owl.carousel');
      });

      ui.next.on('click', function(e) {
        cols.trigger('next.owl.carousel');
      });

      // ITEM HOVER

      ui.item.on('mouseenter', this, function() {
        ui.item.removeClass('hovered');
        $(this).addClass('hovered');

        // get the index of the currently hovered item
        ui.currentSlide.text($('.column-item').index(this)+1);
      }).on('mouseleave', function() {

        // restore the current slide from the carousel index
        //ui.currentSlide.text(current);
      });
    };

    // Run the carousel

    initColumnsCarousel(ui.carousel);

    // Shopify section load / unload functions

    $(document).on('shopify:section:unload', function(event) {
      var target = $(event.target);
      target.find('.columns-carousel--columns').owlCarousel("destroy");
      $(document).off('.columns-carousel--columns');
    });

    $(document).on('shopify:section:load', function(event) {
      initColumnsCarousel($(event.target).find('.columns-carousel--columns'));
    });
  }

  ColumnsCarousel.prototype = _.assignIn({}, ColumnsCarousel.prototype, {});

  return ColumnsCarousel;
})();
