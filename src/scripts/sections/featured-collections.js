/*============================================================================
  Featured Collections
==============================================================================*/
theme.FeaturedCollections = (function() {
  function FeaturedCollections(container) {


    var $container = this.$container = $(container);
    var sectionId = $container.data('section-id');


      $('ul#tabbed-collections-'+sectionId).each(function(){
        var active, content, links = $(this).find('a');
        active = links.first().addClass('active');
        content = $(active.attr('href'));
        links.not(':first').each(function () {
          $($(this).attr('href')).hide();
        });
        $(this).find('a').click(function(e){
          active.removeClass('active');
          content.hide();
          active = $(this);
          content = $($(this).attr('href'));
          active.addClass('active');
          content.show();
          return false;
        });
      });



    $(document).on('shopify:block:select', function(event) {
      var activeTab = $(event.target);
      var tabLink = $(event.target).children();
      $(tabLink).trigger('click');
    });

  }

  FeaturedCollections.prototype = _.assignIn({}, FeaturedCollections.prototype, {});

  return FeaturedCollections;
})();
