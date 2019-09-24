/*============================================================================
  Search template
==============================================================================*/
theme.Search = (function() {
  function Search(container) {
    const ui = {
      mobileFilterBtn: '#filter-button-mobile',
      desktopFilterBtn: '#filter-button-desktop',
      searchWrap: '#search-template'
    }

    // EVENTS : Bind DOM events when ready
    $(document).ready( () => {

      // FILTER MENU : OPEN / CLOSE : Indicator for the whole filter menu (mobile)
      $( ui.mobileFilterBtn ).click( () => {
        $( ui.searchWrap ).toggleClass( 'filter-open' );
      });

      $(ui.desktopFilterBtn).on('click', function () {
        $(ui.searchWrap).toggleClass('filter-open');
      });

      // ATTACH : Apply All event
      theme.utils.filterUtils.init( '#shopify-section-search-template' );
    });
  }

  Search.prototype = _.assignIn({}, Search.prototype, {});
  return Search;
})();
