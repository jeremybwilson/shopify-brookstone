/*============================================================================
  CART UTILS
==============================================================================*/

module.exports = (function() {

  // Setup QTY increment/decrement on cart line items
  const setupQtyInput = function ( wrapperId ) {
    var qtyWrapper = $( wrapperId ),
        decrementEl = qtyWrapper.find('.qty-decrement'),
        incrementEl = qtyWrapper.find('.qty-increment'),
        inputEl = qtyWrapper.find('input.cart-qty');

    // Decrement Qty field by 1
    decrementEl.on('click', function () {
      if (inputEl.val() > 0) {
        inputEl.val( parseInt(inputEl.val()) - 1);
      }
    });

    // Increment Qty field by 1
    incrementEl.on('click', function () {
      inputEl.val( parseInt(inputEl.val()) + 1);
    });
  };

  // Move item to wishlist, let call remove function
  const moveToWishlist = function ( productId, variantId, el) {
    var line_item_to_remove = $(el).closest('.cart-line-item').index() + 1;
    var _product = Appmate.wk.getProduct(productId);

    Appmate.wk.addProduct(productId, variantId)
      .then(function(){
        theme.utils.cartUtils.removeItem(el);
      })
      .catch(console.error);
  };

  // Remove product from cart
  const removeItem = function ( el ) {
    function successCallback( cart ) {

      // REMOVE : Line item we removed via api
      $( '#cart-line-item-' + line_item ).remove();

      // UPDATE : update cart line item ID's
      var lineItemRows = $('[id*="cart-line-item-"]');
      for (var i = 0; i < lineItemRows.length; i++) {
        lineItemRows.eq(i).attr( 'id' , 'cart-line-item-' + (i + 1) );
      }

      if(!lineItemRows.length) {
        window.location.reload();
      } else {
        // UPDATE : Price now currently in the cart
        var cartTotal = calcCartTotal( cart.total_price );
        $( '#cart-page-price' ).html( cartTotal );
        console.log( 'Just set priceEl inner html as ' + cartTotal );
      }
    }

    function calcCartTotal( total_price ) {
      // CONVERT : Change cart value to a whole dollar (or other currency) amount
      var dollar, cents, cartTotal, total = JSON.stringify( total_price );

      if ( total.length < 3 ) {
        dollar = 0;
        cents = total.length < 2 ? '0' + total : total; // So "9" becomes "0.09" at the end

      } else {
        dollar = total.substring( 0, total.length - 2 );
        cents = total.substring( total.length - 2, total.length );
      }

      return ( '$' + dollar + '.' + cents );
    }

    // REMOVE : Use API from ajax-cart.js.liquid to set item quantity to 0 for a removal
    var line_item = $(el).closest('.cart-line-item').index() + 1;
    ShopifyAPI.changeItem( line_item, 0, successCallback );
  };


  // PUBLIC METHODS
  return {
    setupQtyInput,
    moveToWishlist,
    removeItem
  };
})();