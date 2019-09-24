require('../snippets/product-form.js');
require('../snippets/product-gallery.js');
require('../snippets/product-gallery-mobile.js');


// EVENTS EMITTER SETUP
var Events = new EventEmitter3();
Events.trigger = Events.emit; // trigger alias


// PRODUCT COMPONENT
theme.Product = (function () {
  function Product(container) {
    var events = new EventEmitter3();
    events.trigger = events.emit; // alias

    const ui = {
       sizeChartPopup: $( '#size-chart--popup' ),
       freeShippingAccordionHeader: $( '#free-shipping--accordion-header' ),
       freeShippingAccordionContent: $( '#free-shipping--accordion-content'),
       descriptionMobileTrigger: $( '#product-description--mobile-dropdown-trigger' ),
       descriptionMobileContent: $( '#product-description--mobile-dropdown' ),
       campaignVideoTrigger: $( '.campaign-video--trigger' )
    }

    theme.ProductGalleryMobile(events);

    container.querySelectorAll("[data-product-gallery]").forEach(function (context) {
      theme.ProductGallery(context, events);
    });

    container.querySelectorAll("[data-product-form]").forEach(function (context) {
      theme.ProductForm(context, events);
    });

    // BADGES : BUILD : Method to build react-badges component on collection updates (rebuilt in JS)
    const buildBadges = require( '../react-components/badges/BadgeParent.js' );

    $(document).ready( () => {
      // BADGES : Generate badge in div slot if present
      buildBadges();

      // FREE SHIPPING : Accordion
      if ( ui.freeShippingAccordionContent.length > 0 ) {
        ui.freeShippingAccordionHeader.click( () => {
          ui.freeShippingAccordionHeader.toggleClass( 'open' );
          ui.freeShippingAccordionContent.slideToggle(250);
        });
      }

      // DESCRIPTION : Accordion
      if ( ui.descriptionMobileContent.length > 0 ) {
        ui.descriptionMobileTrigger.click( () => {
          ui.descriptionMobileTrigger.toggleClass( 'open' );
          ui.descriptionMobileContent.slideToggle(350);
        });
      }

      // CAMPAIGN VIDEO
      if ( ui.campaignVideoTrigger.length > 0 ) {
        ui.campaignVideoTrigger.fancybox({
          width: 900,
          height: 506,
          padding: 0,
          aspectRatio: true,
          helpers: {
            media: true,
            overlay: {
              locked: false
            }
          }
        });
      }

      // SIZE CHART
      if ( ui.sizeChartPopup.length > 0 ) {
        var size_chart_type = ui.sizeChartPopup.data('size-chart-type');
        if ( size_chart_type != 'all' ) {
          ui.sizeChartPopup.find('.size-chart--wrapper').hide();
          ui.sizeChartPopup.find('#size-chart--' + size_chart_type).show();
        }
      }
    });
  }

  Product.prototype = _.assignIn({}, Product.prototype, {});
  return Product;
})();

Events.on("quickview:load", function (container) {
  theme.Product(container);
});

/*============================================================================
    QUICK VIEW MODAL : Use Fancybox to Ajax in product quick view template
==============================================================================*/
$(document).ready(function () {
    
  // Call Fancybox for product modal + stop scroll to top
  $('.product-modal').fancybox({
      padding: 0,
      margin: 0,
      transitionIn: 'fade',
      afterShow: function () {
          var container = document.querySelector("#product-quick-view");
          Events.trigger( "quickview:load", container );
      },
      wrapCSS: 'fancybox-quickview',
      helpers: {
          overlay: {
              locked: false
          }
      }
  });
});
