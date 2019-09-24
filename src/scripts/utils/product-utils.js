module.exports = (function() {

  // STATE : Maintain a product obj + selection options for use by gallery and swatch handlers
  var state = {
    dominantOptions: ['color','colour'],
    product: {},
    selectedOptions: {
      option1: null,
      option2: null,
      option3: null
    }
  };
  const dominantOptionsRgx = new RegExp( state.dominantOptions.join( "|" ), "i" ); // /color|colour/gi; -- (Don't use g flag or iteration will save state and get screwy)


  // PRODUCT UTIL : EXACT VARIANT : Find the exact variant match for the current state or passed in state
  function findExactVariant( passedOptions = state.selectedOptions, product = state.product ) {
    let perfectMatch = '';

    // BUILD : PERFECT MATCH : First use current selections to try to find the exact match (size + color, for example)
    for ( var key in passedOptions ) {
      if ( passedOptions[ key ] !== null ) {
        perfectMatch = perfectMatch.length > 0 ? `${perfectMatch} / ${passedOptions[key]}` : `${passedOptions[key]}`;
      }
    };

    // FIND : VARIANT : Try to find the exact match, returns undefined if no match found (which we want)
    if ( product.variants ) {
      return product.variants.find( variant => variant.title === perfectMatch );
    }

    return null; // No exact match found, return null
  }


  // PRODUCT UTIL : NEAREST VARIANT : Finds current variant based on user selection state (or nearest possible match based on dominant option)
  function findNearestVariant( passedOptions = state.selectedOptions, product = state.product ) {
    /* NOTES:
        - When merging multiple products, we may have cases like this: "Red" - Size 7, 8, 9 + "Green" - Size 4, 5, 6
        - Because of this, when an exact match isn't found, we fallback to finding the dominant variant match (re: color),
          as sizes more than likely don't vary in price, and since this size isn't on that color, user will likely next
          pick a new size and the perfect match will be found next pass. We don't want the data to change to the "9" on Red
          when the user has the green swatch selected, as that 9 doesn't exist and if prices vary on color, it would show red price.
    */

    // FIND : VARIANT : Try to find an exact matching variant object to the current selection state
    let variantMatch = findExactVariant( passedOptions );

    // FALLBACK : No Exact, Use "Dominant Option" to find nearest matching variant (Note, accounts for single dominant option # currently..)
    if ( !variantMatch ) {

      // BUILD : DOMINANT OPTION : Use dominant option to find nearest matching variant (Defined in 'dominantOptionsRgx' )
      const dominantPosition = product.options.findIndex( option => dominantOptionsRgx.test( option ) ) + 1; //index starts @ 0, regex ignores casing
      const dominantOption = `option${dominantPosition}`;
      const dominantValue = passedOptions[ dominantOption ];
      variantMatch = product.variants.find( variant => variant[ dominantOption ] === dominantValue );
    }

    return variantMatch;
  }


  // PRODUCT UTIL : UPDATE SELECTED OPTIONS : Updates the selected options state with the new selection
  function updateSelectedOption( optionPosition, value ) {
    if ( !optionPosition ) {
      console.log( `ERROR : [ productUtils - updateSelectedOption() ] -- Option position was not passed, unable to update selection state.` );
      return;
    }
    state.selectedOptions[ `option${optionPosition}` ] = value;
  }


  // PRODUCT UTIL : GET SELECTED OPTIONS : Returns the selected options object
  function getSelectedOptions() {
    return state.selectedOptions;
  }

  // PRODUCT UTIL : GET DOMINANT OPTIONS : Returens the dominantOptions array
  function getDominantOptions() {
    return state.dominantOptions;
  }


  // PRODUCT UTIL : INIT : Call this to initalize state with product / options selections
  function init( product, passedOptions ) {
    if ( !product || !product.variants ) {
      console.log( `ERROR : [ productUtils - init() ] -- Product object was not present or missing variants array.` );
    }

    state.product = product;
    state.selectedOptions = Object.assign( {}, state.selectedOptions, passedOptions );
  }


  // PUBLIC METHODS
  return {
    findExactVariant,
    findNearestVariant,
    getDominantOptions,
    getSelectedOptions,
    init,
    updateSelectedOption
  };
})();
