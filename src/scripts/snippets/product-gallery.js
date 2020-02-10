theme.ProductGallery = function (context, events) {

  // VIDEOS : Product Video Module, init( events ) inside a gallery component and it does rest
  const ProductVideos = require( './product-videos.js' );
  ProductVideos.init( events );


  (function thumbnails() {
    var $elements = $(".product-thumbnail", context);
    if ( !$elements.length > 0 ) {
      return false;
    }

    $elements.on("click", function(event) {
      event.preventDefault();
      var id = this.dataset.imageId;
      selectThumb(id);
      events.trigger( "thumbnail:click", id );
    });


    function selectThumb(id) {
      var image = $elements.filter("[data-image-id=" + id + "]");

      if ( !image.length > 0 ) {
        return false;
      }

      $elements
      .removeClass("selected")
      .filter(image)
      .addClass("selected");
    }
  })();

  (function controls() {
    var thumbs = $('.product-thumbnail'); // find other thumbs

    $('.next-image').click(function() {
      var current = thumbs.filter('.selected'); // active thumb
      var next = thumbs.eq(thumbs.index(current) + 1); // next thumb
      $(next).trigger('click');
    });

    $('.prev-image').click(function() {
      var current = thumbs.filter('.selected'); // active thumb
      var previous = thumbs.eq(thumbs.index(current) - 1); // prev thumb
      $(previous).trigger('click');
    });
  })();

  (function main_images() {
    var $elements = $(".product-main-image", context);
    if ( !$elements.length ) { // None Found = 0 length, thus false
      return false;
    }

    events.on( "thumbnail:click", selectMainImg );

    function selectMainImg (id) {
      var image = $elements.filter("[data-image-id=" + id + "]");

      if ( !image.length ) {
        return false;
      }

      $elements
      .removeClass("selected")
      .hide()
      .filter(image)
      .addClass("selected")
      .show();
    };
  })();

  (function zoom() {
    var elements = context.querySelectorAll(".product-main-image");

    if ( !elements ) {
      return false;
    }

    /* check to see if the settings for Zoom is on */
    var productMainImages = document.querySelector('.product-main-images');
    if ( productMainImages && productMainImages.classList.contains('no-zoom') ) {
      return false;
    }
    if ( window.matchMedia("(max-width: 740px)").matches ) {
      return false;
    }

    /* elemental loop */
    elements.forEach(function (element) {

      /* check to see if element is a video */
      if ( element.classList.contains('product-video') ) {
        return false;
      }
      if ( !element.querySelector('img').getAttribute('data-zoom-src') ) {
        return false;
      }

      var src = element.querySelector("img"),
      src = src.getAttribute("data-zoom-src"),
      src = src.replace("{width}", "1000");

      $(element).zoom({
        magnify: 2,
        target: '.zoom-box',
        url: src
      });

      $(element).hover(function () {
        $('.product-gallery-controls').show();
        $('.product-gallery-controls').hide();
      });

      $(element).mouseover(function () {
        $('.zoom-box').show();
      });

      $(element).mouseout(function () {
        $('.zoom-box').hide();
      });
    });
  })();

  (function thumbnail_slider() {

    // UTIL : Creates thumbnail slider with proper event listeners attached
    var initThumbSlider = function(prodSlideshow) {
      var slider_type = $('#thumbnail-gallery').attr("data-slider-type");
      var $slideshow = $(prodSlideshow);
      const dominantOptions = theme.utils.productUtils.getDominantOptions(); // Option Names to update image filtering for when user selects a different one

       // INITALIZE : Declare initial config / start image gallery
       $('.product-main-images .product-image-container').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        asNavFor: '.thumbnail-slider',
        adaptiveHeight: true,
        infinite: true,
        speed: 1000
      });

      // INITALIZE : Declare initial config / start image gallery
      $('#product-photos .thumbnail-slider').slick({
        vertical: false,
        arrows: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.product-image-container',
        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-chevron-right"></i></button>',
        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-chevron-left"></i></button>',
        //  centerMode: true
      });

      $( '.thumbnail-slider .slick-slide' ).on( 'click', function () {
        $( '.product-main-images .product-image-container' ).slick( 'slickGoTo', $( this ).data( 'slick-index') );
      });
      // INITALIZE : FILTER + LISTENERS : Iterate Dominant Options & initialize
      dominantOptions.forEach( optionName => {
        const element = $( `.swatch-element.${optionName} input[checked]` );

        // INITIALIZE : FILTER : trigger the filtering of images based on what dominant options are currently selected
        if ( element.length > 0 ) {
          const initValue = element.closest( '.swatch-element' ).data( 'swatch-value' );
          if ( initValue ) filterImages( optionName, initValue );
        }

        // INITALIZE : EVENTS : Setup event listeners, updates set of images based on color swatch selected
        events.on( `variantchange:${optionName}`, function( value ) {
          filterImages( optionName, value );
        });
      });



      // UTIL : FILTER IMAGES : Show images with matching "image.alt" property to selected color (EX: image.alt = 'Red' shows those images when Red swatch selected)
      function filterImages( optionName, optionValue ) {

        // FILTER : Update set of slide images
        $slideshow.slick('slickUnfilter');
        $slideshow.find('.product-thumbnail').removeClass('active');
        $slideshow.find('.product-video-thumbnail').addClass('active'); // Always show video tiles
        $slideshow.find(`[data-${optionName}="${optionValue}"]`).addClass('active');
        $slideshow.slick('slickFilter', '.active' );

        // MAIN IMAGE : Update main image after completing filter on thumbnails
        const activeImages = document.querySelectorAll( `.product-thumbnail[data-${optionName}="${optionValue}"]` );
        if ( activeImages.length > 0 ) {

          // SELECTED THUMB STATE : Reset selection state on thumbnails and apply to first thumb
          activeImages.forEach( img => {
            img.classList.remove( 'selected' );
          });

          // SHOW FIRST IMG : Set the first image as the new active one in the big image space
          const img = activeImages[0];
          const id = img.dataset.imageId;
          img.classList.add( 'selected' );         // Mark first image as selected state
          events.trigger( 'thumbnail:click', id ); // Render first image to main viewer
        }
      }
    };

    // START : Create thumbnail slider on given element
    initThumbSlider( $('.thumbnail-slider') );


    // SECTION : UNLOAD : Remove event listeners on components when exiting section
    $(document).on('shopify:section:unload', function(event) {
      var target = $(event.target);

      // REMOVE : Gallery + Main Image Zoom
      // target.find('.thumbnail-slider').slick("unslick");
      target.find('.product-main-image').zoom('destroy');

      // REMOVE : Listeners from these nodes
      $(document).off('.thumbnail-slider');
      // $(document).off('.product-main-image');
    });

    // SECTION : LOAD : Re-Initalize gallery should a subsequent section load event occur
    $(document).on('shopify:section:load', function(event) {
      initThumbSlider($(event.target).find('.thumbnail-slider'));
    });

  })();
};
