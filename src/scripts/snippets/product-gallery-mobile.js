theme.ProductGalleryMobile = function (events) {
  var $slideshow = $("#mobile-product-photos");
  const dominantOptions = theme.utils.productUtils.getDominantOptions();

  if ( !$slideshow ){
    return false;
  }

  $slideshow.owlCarousel({
    items: 1,
    margin: 20,
    nav: true,
    navText: [$('.mobile-product-carousel--prev'),$('.mobile-product-carousel--next')],
    lazyLoad : true,
    dots: false,
    center: true

     // EXTRA PROPERTIES AVAILABLE:
     //  navigation : true, // Show next and prev buttons
     //  navigationText: ["",""],
     //  slideSpeed : 300,
     //  paginationSpeed : 400,
     //  singleItem: true,
     //  pagination: false,
     //  addClassActive: false
  });
  $slideshow.on('changed.owl.carousel', function(event) {
    events.trigger( 'productVideo:pauseAll' );
  });

  // INITALIZE : SLIDE SELECTION + LISTENERS:
  dominantOptions.forEach( optionName => {
    const element = $( `.swatch-element.${optionName} input[checked]` );

    // INITIALIZE : SLIDE SELECTION : trigger the filtering of images based on what dominant options are currently selected
    if ( element.length > 0 ) {
      const initValue = element.closest( '.swatch-element' ).data( 'swatch-value' );
      if ( initValue ) selectByOption( optionName, initValue );
    }

    // INITALIZE : EVENTS : Setup event listeners, updates set of images based on color swatch selected
    events.on( `variantchange:${optionName}`, function( optionValue ) {
      selectByOption( optionName, optionValue );
    });
  });



  // UTIL : SELECT SLIDE BY COLOR NAME : Respond to color variant selections to show user that color's images
  function selectByOption( optionName, optionValue ) {

    // FIND + SELECT : First image with that optionValue name & go to that image slide
    const firstImg = document.querySelector( `.mthumb[data-${optionName}="${optionValue}"]` );
    if ( firstImg ) {
      const id = firstImg.getAttribute( 'data-image-id' );

      if ( id ) {
        goToImage( id );
      } else {
        console.log( 'ERROR : [ ProductMobileGallery - selectByOption() ] -- "data-image-id" is missing on the slide item template, unable to parse Image Slide ID.' );
      }
    }
  }

  // UTIL : GO TO IMAGE : Util to move user to first image with that matching dominant option they selected
  function goToImage(id) {
    var slides = $slideshow.find( '[data-image-id]' );
    var slide = slides.filter( '[data-image-id="' + id + '"]' );
    var index = slides.index(slide);

    $slideshow.trigger('to.owl.carousel', index);
  };
};
