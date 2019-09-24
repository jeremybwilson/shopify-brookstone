/*============================================================================
  Collection template
==============================================================================*/
theme.Collection = (function() {
  function Collection(container) {

    const ui = {
      backingShadow: $( '#filter-bg-shadow' ),
      collectionWrap: $( '#shopify-section-collection-template' ), //Can store these b/c they are unaffected by the filter app JS re-renders
      collectionInner: $( '#shopify-section-collection-template .collection-template' ),
      desktopApplyBtn: $( '#filter-apply-button-desktop' ),
      desktopClearBtn: $( '#filter-clear-button-desktop' ),
      desktopFilterBtn: $( '#filter-button-desktop' ),
      desktopFilterSet: $( '.filter-list-desktop' ),
      mobileFilterBtn: $( '#filter-button-mobile' ),
      seoBlockWrap: $( '#collection-seo-wrap' ),
      seoReadMoreBtn: $( '#collection-seo-read-more' )
    }

    // TRANSPARENT LANDING : When a banner is present, add the transparent landing class to body so header goes transparent
    const config = ui.collectionInner.data();
    if ( config.transparentLanding ) {

      // MOBILE : If banner present, set mobile transparent class
      if ( config.hasBannerMobile ) {
        $( 'body' ).addClass( 'show-transparent-landing-mobile' );
      }

      // DESKTOP : If banner present, set desktop transparent class
      if ( config.hasBannerDesktop ) {
        $( 'body' ).addClass( 'show-transparent-landing-desktop' );
      }
    }


    // EVENTS : Bind DOM events when ready
    $(document).ready( () => {

      // FILTER MENU : STATE : Open state indicator for filters
      const toggleFilterOpen = () => {
        ui.collectionWrap.toggleClass( 'filter-open' );
      };

      // FILTER MENU : EVENT BINDING : Attach open/close handles
      ui.mobileFilterBtn.click( () => {
        toggleFilterOpen();
      });

      // DESKTOP - IF desktop filter is mocked as hidden panel that opens, use these to show whole panel + copy filters.scss.liquid from aqua
      // ui.desktopFilterBtn.click( () => {
      //   toggleFilterOpen();
      // });
      // ui.backingShadow.click( () => {
      //   toggleFilterOpen();
      // });

      // ATTACH : Apply All event
      theme.utils.filterUtils.init( '#shopify-section-collection-template' );


      // SEO PARAGRAPH : OPEN / CLOSE : Reveals the rest of the SEO Paragraph text on click
      var seoExpanded = false;
      ui.seoReadMoreBtn.click( () => {
        if ( !seoExpanded ) {
          seoExpanded = true;
          ui.seoBlockWrap.addClass( 'seo-open' ).delay( 250 ).queue(function(){
              $(this).addClass( 'seo-visible' ).dequeue();
          });

        } else {
          seoExpanded = false;
          ui.seoBlockWrap.removeClass( 'seo-visible' ).delay( 250 ).queue( function() {
            $(this).removeClass( 'seo-open' ).dequeue();
          });
        }
      });
    });
  }

  Collection.prototype = _.assignIn({}, Collection.prototype, {});
  return Collection;
})();
