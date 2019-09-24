theme.ProductForm = function (context, events) {
  var $context = $(context);
  var config = JSON.parse(context.dataset.productForm || '{}');
  var product = window.Shopify.productObj || {};

  // SAFETY : If no variant object, skip generation of swatches
  if ( product && product.variants && product.variants.length == 1 || !config ) {
    return false;
  }

  // DISPLAY MODE : Swatches or Dropdowns?
  const optionDisplayMode = config.variant_display_type;
  if ( optionDisplayMode === 'swatches' ) {
    swatches();

  } else {
    dropdowns();
  }



  /* OPTION MODE : SWATCHES (color, size, etc)
   * -------------------------------------------- */
  function swatches() {

    // INIT : Seed Selected Options : Finds selected options for each option slot and stores into state
    function init() {
      var selections = document.querySelectorAll( '.swatch input:checked' );
      var selectedOptions = {};

      if ( selections && selections.length > 0 ) {
        selections.forEach( function( selection ) {
          const value = selection.getAttribute( 'value' );
          const optionPosition = selection.getAttribute( 'option-position' );

          if ( !value || !optionPosition ) {
            const missingProp = !value ? 'value' : 'option-position';
            console.log( `ERROR : [ ProductForm - swatches() ] -- Selected swatches are missing the attribute ${missingProp}, please add it (Note: Shouldn't have data- prefix).` );
          }

          // SET : Set the selected option value
          selectedOptions[ `option${optionPosition}` ] = value;
        });

        // STORE : Store the selected options to the util state
        theme.utils.productUtils.init( product, selectedOptions );
      }
    }


    // START! : Initalize productUtils states + each swatch via the 'Swatch' constructor
    init();
    var elements = context.querySelectorAll("[type=radio]") || []; //safety
    elements.forEach(Swatch);


    // UTIL : SWATCH EVENTS + FUNCTIONALITY
    function Swatch(element) {
      if ( !element ) { // SAFETY CHECK
        console.log( '* Error : [ProductForm -- Swatch()] : Element was not passed, cannot build swatch controls on non-existent elements' );
        return false;
      }

      // SETUP : Properties for swatch interaction
      const optionList = ['option1', 'option2', 'option3'];
      const optionName = element.getAttribute( 'name' ); // NOTE: Option name lowercased in liquid
      const optionPosition = element.getAttribute( 'option-position' );
      const otherOptions = optionList.filter( option => option !== `option${ optionPosition }` );

      // SAFETY : If values are missing, someone has pulled these from the template
      if ( !optionName || !optionPosition ) {
        const missingProp = optionName ? '"name"' : '"option-position"';
        console.log( 'ERROR : [Theme.js : Product Form - Swatch() ] -- Swatch elements are missing the property ' + missingProp + '\n    --> Unable to generate swatch controls.' )
      }

      // EVENT LISTENER : CHANGE : When swatch changes occur, update to reflect newly selected option data
      element.addEventListener( 'change', function (event) {

        // STATE : Update state with newly user-selected option
        theme.utils.productUtils.updateSelectedOption( optionPosition, element.value );

        // UPDATE : Reflect the new state within the form data
        updateFormData();
      });



      // SWATCH - UTIL : UPDATE FORM DATA : Updates swatch selection text, sets swatch as checked, and updates hidden Variant ID input when relevant.
      function updateFormData() {
        const ui = {
          optionDisplay: element.closest('.swatch').querySelector('.current-option'),
          selectedVariantInput: document.querySelector( '#selected-variant-id' )
        }

        // FIND : CURRENT VARIANT : Merged PDP templates can contain various combos of option data, ensures right variant being emitted
        const nearestVariant = theme.utils.productUtils.findNearestVariant();
        const exactVariant = theme.utils.productUtils.findExactVariant();


        // UPDATE : SELECTED OPTION TEXT : Show the name of which option is currently selected
        if ( ui.optionDisplay ) {
          ui.optionDisplay.innerHTML = element.value;
        }

        // UPDATE : CHECK SWATCH : Mark Swatch element as "checked" for submit action to scrape
        element.checked = true;

        // UPDATE : VARIANT ID : Update the hidden input that tells addToCart which variant ID is selected currently
        if ( ui.selectedVariantInput && exactVariant ) {
          ui.selectedVariantInput.value = exactVariant.id;
        }

        // UPDATE : AVAILABILITY : Reflect item availabilities when a user changes option selections
        updateAvailability();

        // UPDATE : BROADCAST CHANGE EVENTS : Broadcasts the event to various listener functions across the theme watching the product form (Most are the functions defined below though)
        events.trigger( 'variantchange', nearestVariant || {} );        // Uses NEAREST Variant - Feeds: price / sku handlers (so we don't show blank prices in merge templates)
        events.trigger( 'variantchange:precise', exactVariant );        // Uses EXACT Variant --- Feeds: 'add_to_cart', null if not found (Merge sees cases with size 6, but doesn't exist in chosen color)
        events.trigger( `variantchange:${optionName}`, element.value ); // Uses Selected Option - Feeds: Image filtering handler (only listens for color so we don't filter every time we change size)
      }

      // SWATCH - UTIL : SET AVAILABILITY : Iterate through swatches on DOMINANT OPTION CHANGES & update sold-out states
      function updateAvailability() {
        var available = false;

        // ITERATE : Go through each swatch and update availability based on selected dominant option availability
        elements.forEach( swatch => {

          // FIND : Gather data about each swatch to determine its availability
          const selectedOptions = theme.utils.productUtils.getSelectedOptions();
          const swatchValue = swatch.getAttribute( 'value' );
          const swatchOption = `option${ swatch.getAttribute( 'option-position' ) }`;

          // BUILD : Merge this swatch value with current other selections to do exact variant lookup
          let swatchData = {};
          swatchData[ swatchOption ] = swatchValue;
          const swatchObj = Object.assign( {}, selectedOptions, swatchData );

          // MATCH : Find Matching Variant with matching dominant option (Ex: Check for "size 7" on "Red" dresses)
          const variantMatch = theme.utils.productUtils.findExactVariant( swatchObj );

          // UPDATE : If matching exact variant found, set its availability
          const isAvailable = variantMatch && variantMatch.available;
          setAvailable( swatch, isAvailable );
        });
      }
    }
  };




  /* OPTION MODE : DROPDOWN SELECTORS
   *  - NOTE, this will probably need some work if a brand wants to use this, it wasn't refactored with the swatch setup
   * ---------------------------------- */
  function dropdowns() {
    var elements = context.querySelectorAll("[type=radio]") || []; //safety

    // DROPDOWN : Util - Unavailable Handler : 'variantunavailable' triggered when the variant object isn't found during a change
    function set_unavailable() {
      var selected = {};
      var selected_elements = $(elements).filter(":checked").toArray();

      selected_elements.forEach(function (element) {
        var option = "option" + element.getAttribute("option-position");
        var value = element.value;

        selected[option] = value;
      });

      elements.forEach(function (element) {
        var available = false;
        var current_option = "option" + element.getAttribute("option-position");
        var current_value = element.value;
        var other_options = ["option1", "option2", "option3"].filter(function (option) {
          return selected[option] && option != current_option;
        });

        product.variants.forEach(function (variant) {
          if ( !variant.available ) {
            return;
          }

          if ( variant[current_option] != current_value ) {
            return;
          }

          if ( variant[other_options[0]] == selected[other_options[0]] && variant[other_options[1]] == selected[other_options[1]] ) {
            available = true;
            return;
          }
        });

        if ( available ) {
          states.available(element);
        } else {
          states.sold_out(element);
        }
      });
    }
    events.on( 'variantunavailable', set_unavailable );

    // DROPDOWN : Constructor for selector (dropdown mode only, not used with swatches)
    new Shopify.OptionSelectors("product-select-" + product.id, {
      product: product,
      onVariantSelected: function(variant, selector) {

        if ( !variant ) {
          events.trigger("variantunavailable");
          return;
        }

        if ( product.variants.length == 1 ) {
          return;
        }

        console.log( 'onVaraintSelected -- Fired ' );

        // Investigate what this is truly doing..
        events.trigger( "variantchange", variant );
        events.trigger( "variantchange:option1:" + variant.option1 );
        events.trigger( "variantchange:option2:" + variant.option2 );
        events.trigger( "variantchange:option3:" + variant.option3 );

        if ( variant.featured_image ) {
          events.trigger("variantchange:image", variant.featured_image.id);
        }
      },
      enableHistoryState: config.enable_history
    });

    // DROPDOWN : Option selection handler
    (function single_option_selectors() {
      var elements = context.querySelectorAll(".single-option-selector");
      elements.forEach(Selector);

      function Selector(element, index) {
        var option_position = index + 1;
        events.on("swatch:change:" + option_position, change);

        function change(value) {
          $(element).val(value).trigger("change");
        }
      }
    })();
  }


  // ITEM : PRICE
  (function price() {
    var element = context.querySelector(".product-price .money") || context.querySelector(".product-price");
    if ( !element ) {
      return false;
    }

    events.on("variantchange", function (variant) {
      var price = money(variant.price);

      if ( !variant.available && config.hide_price_on_unavailable ) {
        price = config.sold_out;
      }

      // UPDATE : Set new price on DOM Nodelist
      element.innerHTML = price;

      if ( config.hide_price_on_unavailable ) {
        events.on("variantunavailable", function (variant) {
          price = config.sold_out;
          element.innerHTML = price;
        });
      }

    });
  })();

  // ITEM : COMPARE AT PRICE
  (function compare_price() {
    var element = context.querySelector(".was");

    if ( !element ) {
      return false;
    }

    events.on("variantchange", function (variant) {
      var price = "";

      if ( variant.compare_at_price > variant.price ) {
        var price = money(variant.compare_at_price);
      }

      if ( !variant.available ) {
        price = "";
      }

      element.innerHTML = '<span class="money">' + price + '</span>';
    });
  })();

  // ITEM : SKU
  (function sku() {
    var element = document.querySelector(".product-sku");

    if ( !element ) {
      return false;
    }

    events.on("variantchange", function (variant) {
      var variant_sku = variant.sku;
      element.innerHTML = variant_sku;
    });
    events.on("variantunavailable", function (variant) {
      var variant_sku = config.unavailable;
      element.innerHTML = variant_sku;
    });
  })();

  // ITEM : DESCRIPTION + TITLE
  (function descriptionTitle() {
    const descriptions = document.querySelectorAll( '.product-description-content' );
    const titles = document.querySelectorAll( '.product-title-content' );

    // DESCRIPTIONS : EVENT LISTENER : Wire 'variantchange' listener to all the description nodes
    descriptions.forEach( element => {
      events.on( "variantchange", function (variant) {
        const infoObj = product.info[ variant.id ];
        if ( infoObj && infoObj.description ) {
          element.innerHTML = infoObj.description;
        }
      });
    });

    // TITLES : EVENT LISTENER : Wire 'variantchange' listener to all the description nodes
    titles.forEach( element => {
      events.on( "variantchange", function (variant) {
        const infoObj = product.info[ variant.id ];
        if ( infoObj && infoObj.title ) {
          element.innerHTML = infoObj.title;
        }
      });
    });

  })();

  // ITEM : ADD TO CART
  (function add_to_cart() {
    var element = context.querySelector(".add");
    var mobileElement = $('.product--mobile-header--add'); // Event binding, simpler to use JQ

    // SWATCH STYLE
    events.on("variantchange:precise", function (variant) {
      var text = config.button;
      var disabled = false;

      if ( !variant || !variant.available ) {
        text = config.sold_out;
        disabled = true;
      }

      if ( element ) {
        element.value = text;
        element.disabled = disabled;
      }

      if ( mobileElement.length ) {
        mobileElement.value = text;
        mobileElement.disabled = disabled;
      }
    });


    // DROPDOWN STYLE
    events.on("variantunavailable", function () {
      if ( element ) {
        element.value = config.sold_out;
        element.disabled = true;
      }

      if ( mobileElement.length ) {
        mobileElement.value = config.sold_out;
        mobileElement.disabled = true;
      }
    });


    // MOBILE HEADER BUTTON - CLICK EVENT (Moves user to actual add to cart button. Not sure why it was requested to do that, just merging duplicated functions, left as is :p)
    if ( mobileElement.length ) {
      mobileElement.on('click',this, function() {
        const ui = {
          navLogo: $('#nav-logo svg'),
          prodDesc: $('#product-description')
        }

        if ( ui.navLogo.length > 0 && ui.prodDesc.length > 0 ) {
          const $headerHeight = ui.navLogo.outerHeight() * 1.75; // accommodate for header height
          var scrollValue = ui.prodDesc.offset().top - $headerHeight;

          $('body,html').animate({ scrollTop: scrollValue }, 1000);
        }
      });
    }
  })();

  // ITEM : MOBILE PRICE
  (function mobile_header_price() {
    var element = $(".product--mobile-header .product-price .money") || $(".product--mobile-header .product-price");

    if ( !element.length > 0 ) {
      return false;
    }

    events.on("variantchange", function (variant) {
      var price = money(variant.price);

      if ( !variant.available && config.hide_price_on_unavailable ) {
        price = config.sold_out;
      }

      element.html(price);

      if ( config.hide_price_on_unavailable ) {
        events.on("variantunavailable", function (variant) {
          price = config.sold_out;
          element.html(price);
        });
      }

    });
  })();

  // ITEM : MOBILE COMPARE AT PRICE
  (function mobile_header_compare_price() {
    var element = $(".product--mobile-header .was");

    if ( !element.length > 0 ) {
      return false;
    }

    events.on("variantchange", function (variant) {
      var price = "";

      if ( variant.compare_at_price > variant.price ) {
        var price = money(variant.compare_at_price);
      }

      if ( !variant.available ) {
        price = "";
      }

      element.innerHTML = '<span class="money">' + price + '</span>';
    });
  })();

  // ITEM : SMART PAYMENT BUTTONS
  (function smart_payment_buttons() {
    var element = context.querySelector(".shopify-payment-button");
    if ( !element ) {
      return false;
    }

    events.on("variantchange:precise", function (variant) {
      if ( !variant || !variant.available ) {
         element.style.display = 'none';

       } else {
         element.style.display = 'inline-block';
       }
    });
  })();

  // UTIL : MONEY FORMATTING
  function money(cents) {
    if ( config.currency_switcher_enabled ) {
      var converted = Currency.convert(cents, defaultCurrency, Currency.currentCurrency);
      var format = Currency.moneyFormats[Currency.currentCurrency][Currency.format];

      return Currency.formatMoney(converted, format);
    } else {
      return Shopify.formatMoney(cents, config.money_format);
    }
  }

  // UTIL : SET AVAILABLITY (Single Element Class Updater)
  function setAvailable( element, isAvailable ) {
    if ( !element ) {
      console.log( 'ERROR : [ ProductForm - setAvailable() ] -- Element was not passed in, so setting the available state failed.' );
      return;
    }

    if ( isAvailable ) {
      element.parentElement.classList.remove( "soldout" );
    } else {
      element.parentElement.classList.add("soldout");
    }
  }
};
