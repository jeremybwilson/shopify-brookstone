/* For IE 11+ Nodelist forEach Function */
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

/*============================================================================
  Debounce for window resizing
  - Added to prevent multiple calls, when using an event for resizing
==============================================================================*/
function debounce(fn, wait, immediate) {
    var timeout;

    wait || (wait = 100);

    return function () {
      var context = this, args = arguments;

      var later = function() {
        timeout = null;

        if ( !immediate ) {
          fn.apply(context, args);
        }
      };

      var callNow = immediate && !timeout;

      clearTimeout(timeout);

      timeout = setTimeout(later, wait);

      if ( callNow ) {
        fn.apply(context, args);
      }
    };
  }

  // POLYFILL : Object.assign (IE 11)
  require( 'es6-object-assign/auto' ); //812 bytes, pretty safe and small :D

  /**
  * ----------------------------------------------------------------------------------------------------
  * AJAX CART
  * ----------------------------------------------------------------------------------------------------
  */

  /* replaceUrlParam - http://stackoverflow.com/questions/7171099/how-to-replace-url-parameter-with-javascript-jquery */
  function replaceUrlParam(e,r,a){var n=new RegExp("("+r+"=).*?(&|$)"),c=e;return c=e.search(n)>=0?e.replace(n,"$1"+a+"$2"):c+(c.indexOf("?")>0?"&":"?")+r+"="+a};


  /*
   * ----------------------------------------------------------------------------------------------------
   * ELEMENT.CLOSEST() POLYFILL -- This fixes IE 11 bug when changing swatches and others
   * ----------------------------------------------------------------------------------------------------
   */
  if (!Element.prototype.matches)
      Element.prototype.matches = Element.prototype.msMatchesSelector ||
                                  Element.prototype.webkitMatchesSelector;

  if (!Element.prototype.closest) {
      Element.prototype.closest = function(s) {
          var el = this;
          if (!document.documentElement.contains(el)) return null;
          do {
              if (el.matches(s)) return el;
              el = el.parentElement || el.parentNode;
          } while (el !== null && el.nodeType === 1);
          return null;
      };
  }

  /**
  * ----------------------------------------------------------------------------------------------------
  * PLACEHOLDERS
  * ----------------------------------------------------------------------------------------------------
  */
   !function(e,a,t){function l(e){var a={},l=/^jQuery\d+$/;return t.each(e.attributes,function(e,t){t.specified&&!l.test(t.name)&&(a[t.name]=t.value)}),a}function r(e,l){var r=this,o=t(r);if(r.value==o.attr("placeholder")&&o.hasClass("placeholder"))if(o.data("placeholder-password")){if(o=o.hide().next().show().attr("id",o.removeAttr("id").data("placeholder-id")),e===!0)return o[0].value=l;o.focus()}else r.value="",o.removeClass("placeholder"),r==a.activeElement&&r.select()}function o(){var e,a=this,o=t(a),d=this.id;if(""==a.value){if("password"==a.type){if(!o.data("placeholder-textinput")){try{e=o.clone().attr({type:"text"})}catch(c){e=t("<input>").attr(t.extend(l(this),{type:"text"}))}e.removeAttr("name").data({"placeholder-password":!0,"placeholder-id":d}).bind("focus.placeholder",r),o.data({"placeholder-textinput":e,"placeholder-id":d}).before(e)}o=o.removeAttr("id").hide().prev().attr("id",d).show()}o.addClass("placeholder"),o[0].value=o.attr("placeholder")}else o.removeClass("placeholder")}var d,c,n="placeholder"in a.createElement("input"),i="placeholder"in a.createElement("textarea"),h=t.fn,u=t.valHooks;n&&i?(c=h.placeholder=function(){return this},c.input=c.textarea=!0):(c=h.placeholder=function(){var e=this;return e.filter((n?"textarea":":input")+"[placeholder]").not(".placeholder").bind({"focus.placeholder":r,"blur.placeholder":o}).data("placeholder-enabled",!0).trigger("blur.placeholder"),e},c.input=n,c.textarea=i,d={get:function(e){var a=t(e);return a.data("placeholder-enabled")&&a.hasClass("placeholder")?"":e.value},set:function(e,l){var d=t(e);return d.data("placeholder-enabled")?(""==l?(e.value=l,e!=a.activeElement&&o.call(e)):d.hasClass("placeholder")?r.call(e,!0,l)||(e.value=l):e.value=l,d):e.value=l}},n||(u.input=d),i||(u.textarea=d),t(function(){t(a).delegate("form","submit.placeholder",function(){var e=t(".placeholder",this).each(r);setTimeout(function(){e.each(o)},10)})}),t(e).bind("beforeunload.placeholder",function(){t(".placeholder").each(function(){this.value=""})}))}(this,document,jQuery);

   /**
   * ----------------------------------------------------------------------------------------------------
   * COOKIES
   * ----------------------------------------------------------------------------------------------------
   */
  !function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e(jQuery)}(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function o(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function r(e){0===e.indexOf('"')&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(c," ")),u.json?JSON.parse(e):e}catch(n){}}function t(n,o){var i=u.raw?n:r(n);return e.isFunction(o)?o(i):i}var c=/\+/g,u=e.cookie=function(r,c,a){if(void 0!==c&&!e.isFunction(c)){if(a=e.extend({},u.defaults,a),"number"==typeof a.expires){var d=a.expires,f=a.expires=new Date;f.setTime(+f+864e5*d)}return document.cookie=[n(r),"=",i(c),a.expires?"; expires="+a.expires.toUTCString():"",a.path?"; path="+a.path:"",a.domain?"; domain="+a.domain:"",a.secure?"; secure":""].join("")}for(var s=r?void 0:{},p=document.cookie?document.cookie.split("; "):[],m=0,v=p.length;v>m;m++){var x=p[m].split("="),k=o(x.shift()),l=x.join("=");if(r&&r===k){s=t(l,c);break}r||void 0===(l=t(l))||(s[k]=l)}return s};u.defaults={},e.removeCookie=function(n,o){return void 0===e.cookie(n)?!1:(e.cookie(n,"",e.extend({},o,{expires:-1})),!e.cookie(n))}});

  /*
   * ----------------------------------------------------------------------------------------------------
   * DISCOUNT ENGINE (React Component)
   * ----------------------------------------------------------------------------------------------------
   */
  require('../react-components/discounts/DiscountParent.js');

$(document).ready(function () {

  /*============================================================================
    Fancybox
  ==============================================================================*/
  $(".fancybox").fancybox({
    helpers: {
      overlay: {
        locked: false
      }
    }
  });

});
