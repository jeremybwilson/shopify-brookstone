/*============================================================================
  Map Section
==============================================================================*/
theme.Maps = (function() {

  var errors = {
     address_no_results: "translation missing: en.general.map_errors.address_no_results",
     address_query_limit: "translation missing: en.general.map_errors.address_query_limit",
     address_error: "translation missing: en.general.map_errors.address_error",
     auth_error: "translation missing: en.general.map_errors.auth_error"
  };

  var google_api_loaded = false;

  function Map(container) {

    var events = new EventEmitter3();
    events.trigger = events.emit; // alias

    window.gm_authFailure = function () {
      google_api_loaded = false;

      if ( Shopify.designMode ) {
        events.trigger("gmauthfailure:themeeditor");
      } else {
        events.trigger("gmauthfailure");
      }
    };

    var config = container.querySelector("[data-map-config]").innerHTML,
        config = JSON.parse(config);

    if ( !config.api_key ) {
      return false;
    }

    (function section_container() {
      var element = container;

      events.on("gmauthfailure:themeeditor", error);
      events.on("map:error", error);

      function error() {
        element.classList.add("map-section-load-error");
      }
    })();

    (function background_image() {
      var element = container.querySelector("[data-bg-image]");

      events.on("gmauthfailure", show);

      function show() {
        element.classList.add("show-image");
      }
    })();

    (function overlay() {
      var element = container.querySelector("[data-map-overlay]");

      events.on("gmauthfailure:themeeditor", error);
      events.on("map:error", error);

      function error(message) {
        message = message || errors.auth_error;
        element.innerHTML = '<div class="map-section-error errors text-center">' + message + '</div>';
      }
    })();

    (function map() {
      var element = container.querySelector("[data-map]");

      events.on("ready", geolocate);

      function geolocate() {

        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address: config.address }, function(results, status) {

          if ( status == google.maps.GeocoderStatus.OK ) {
            render(results);
          } else {
            error(status);
          }
        });
      }

      function render(results) {
        element.innerHTML = "";

        var map = new google.maps.Map(element, {
          zoom: config.zoom,
          center: results[0].geometry.location,
          draggable: false,
          clickableIcons: false,
          scrollwheel: false,
          disableDoubleClickZoom: true,
          styles: config.styles,
          disableDefaultUI: true
        });

        var center = map.getCenter();

        new google.maps.Marker({
          map: map,
          position: center
        });

        google.maps.event.addDomListener(window, "resize", $.debounce(250, function () {
          google.maps.event.trigger(map, "resize");
          map.setCenter(center);
        }));

        $(document).on("shopify:section:unload", function () {
          google.maps.event.clearListeners(map, "resize");
        });
      }

      function error(status) {
        var message = errors.address_error;

        switch (status) {
          case 'ZERO_RESULTS':
            message = errors.address_no_results;
            break;
          case 'OVER_QUERY_LIMIT':
            message = errors.address_query_limit;
            break;
          case 'REQUEST_DENIED':
            message = errors.auth_error;
            break;
        }

        if ( Shopify.designMode ) {
          events.trigger("map:error", message);
        }
      }
    })();

    if ( google_api_loaded ) {
      events.trigger("ready");
    } else {
      $.getScript("https://maps.googleapis.com/maps/api/js?key=" + config.api_key, function () {
        google_api_loaded = true;
        events.trigger("ready");
      });
    }
  }

  Map.prototype = _.assignIn({}, Map.prototype, {});

  return Map;
})();
