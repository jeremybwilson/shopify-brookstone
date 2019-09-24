/*============================================================================
  Instagram on index
==============================================================================*/
theme.Instagram = (function() {
  function Instagram(container) {
    var $container = this.$container = $(container);
    var id = $container.attr('data-section-id');
    var instafeedEl = this.instagram = $('#instafeed-' + id);
    var instafeedId = this.instagram = 'instafeed-' + id;
    var template = $("#instagram-template").html();
    var userFeed = new Instafeed({
      get: 'user',
      limit: 4,
      userId: 'self',
      target: instafeedId,
      accessToken: instafeedEl.attr('data-access-token'),
      resolution: 'standard_resolution',
      template: template
    });
    if( !_.isUndefined( userFeed.options.accessToken) ){
      userFeed.run();
    }
  }
  Instagram.prototype = _.assignIn({}, Instagram.prototype, {});
  return Instagram;
})();
