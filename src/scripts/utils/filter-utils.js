module.exports = (function() {
  const Entities = require( 'html-entities' ).AllHtmlEntities;
  const entities = new Entities();

  // BUILD : Imported components that are rebuilt on each js re-render triggered by bc-sf-filter.js app
  const buildSwatches = require('../react-components/swatches/SwatchParent.js');
  const buildBadges = require('../react-components/badges/BadgeParent.js');
  const buildWishlistButtons = require('../third-party-apps/wishlist-king/WishlistParent.js');

  // UPDATE : FIRE : Fires all build functions on subscribed event trigger
  const updateTemplate = function() {
    buildSwatches();
    buildBadges();
    buildWishlistButtons();
  }


  // UI : DOM nodes congruent across filter implementations
  const ui = {
    desktopApplyBtn: '#filter-apply-button-desktop',
    desktopFilterSet: '.filter-list-desktop'
  };

  // CLOSE PANEL
  const closeAndApply = ( wrapperId, queryParams = '' ) => { // location.search = '' when none present
    const wrapEl = $( wrapperId );

    // APPLY : Close Panel
    wrapEl.removeClass( 'filter-open' );

    // APPLY : If selectiosn have changed, wait for panel close then apply new filters
    if ( location && location.search !== queryParams ) {

      // LOADING : Show user filters are applying
      wrapEl.addClass( 'applying-filters' );

      // APPLY : Filter application via query params
      setTimeout( () => {
        location.search = queryParams; // Triggers reload
      }, 250 ); // 0.25s is close animation time
    }
  }


  // FILTER APPLY : DESKTOP : Filter app can't do multi-column apply, had to make one
  const attachApplyAll = function( wrapperId ) {
    $( ui.desktopApplyBtn ).click( () => {
      const selected = $( ui.desktopFilterSet ).find( '.bc-sf-filter-option-item.selected' );

      // SELECTIONS MADE? : If we have selections, lets build the query params that will apply them!
      if ( selected && selected.length > 0 ) {
        var queryParams = '?_=pf'; // This basically says "hey, I'm filtering products"

        // QUERY PARAMS : Parse through selections and build the query params for filter app
        for ( var i=0; i < selected.length; i++ ) {
          const id = selected[i].getAttribute( 'data-id' );
          const value = selected[i].getAttribute( 'data-value' );
          const cleanValue = value ? entities.encode( value ) : 'NO_VALUE_ERROR';

          // Safety first
          if ( id && cleanValue ) {
            queryParams += `&${id}=${cleanValue}`;
          }
        }

        // SEARCH : KEEP LIST : List of query params to keep (search needs this but others might arise)
        const currentParams = window.location.search.replace( '?', '' );
        const keepRgx = new RegExp( /q=|type=/, "gi" );

        // SEARCH : APPEND : If any params match the keep regex, grab and append them to our built url (order wont matter)
        if ( currentParams.search( keepRgx ) > -1 ) {
          const params = currentParams.split( '&' );
          const paramsToKeep = params.forEach( function (param) {
             if ( param.search( keepRgx ) > -1 ) {
                queryParams += `&${param}`;
             }
          });
        }

        // APPLY : Apply the new selections via the url query params
        closeAndApply( wrapperId, queryParams );


      // SELECTIONS EMPTY : Trigger closeAndApply(), if user emptied selections manually will trigger update
      } else {
        closeAndApply( wrapperId );
      }
    });
  };

  // INITALIZER : Attaches events and subscribes the component collections to updates via the filter app
  const init = function( wrapperId ) {

    // ATTACH : Bind event handlers for "Apply All" button in desktop filter sets
    attachApplyAll( wrapperId );

    // UPDATES : SUB : Subscribe to collection updates to re-render react-components
    $(document).on( "collectionUpdated", updateTemplate );
  }


  // PUBLIC METHODS
  return { init };
})();
