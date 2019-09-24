/*============================================================================
  Parallax on index
==============================================================================*/
theme.Parallax = (function() {
  function Parallax(container) {

    var $container = this.$container = $(container);

    // Parallax scrolling backgrounds edit to work with new theme editor, building bgset url based on data-bgset.
    var initParallaximage = function(ParallaxImages) {
      ParallaxImages.each(function () {
        var bgset = this.getAttribute("data-bgset").trim().split(",");

        var bgset_srcs = bgset.map(function (src) {
          return src.trim().split(" ")[0];
        });

        var bgset_widths = bgset.map(function (src) {
          return src.trim().split(" ")[1].replace("w","") + "px";
        });

        var src = null;

        bgset_widths.forEach(function (width, index) {
          if ( !src && matchMedia("(max-width: " + width + ")").matches ) {
            src = bgset_srcs[index];
          }
        });

        if ( !src ) {
          src = bgset_srcs[bgset_srcs.length - 1];
        }

        $(this).parallax({ imageSrc: src });
      });
    };

   // Intitate parallax, the reinitiate on resize of browser to update bgset url
    var parallax_images = $('.parallax-window');

    initParallaximage(parallax_images);

    window.addEventListener("resize", debounce(function () {
      parallax_images.parallax("destroy");
      initParallaximage(parallax_images);
    }, 100));

    $(document).on('shopify:section:unload', function(event) {
      var target = $(event.target);
      target.find('.parallax-window').parallax('destroy');
      $(document).off('.parallax-window');
    });

    $(document).on('shopify:section:load', function(event) {
      initParallaximage($(event.target).find('.parallax-window'));
    });

  }
  Parallax.prototype = _.assignIn({}, Parallax.prototype, {});

  return Parallax;
})();
