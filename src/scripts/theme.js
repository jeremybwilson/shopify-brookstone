// GLOBAL NAMESPACES
window.theme = window.theme || {};
theme.utils = theme.utils || {};

// UTILS - add functionality modules we can later port out to other files
require('./utils/global-utils.js');
theme.utils.filterUtils = require('./utils/filter-utils.js');
theme.utils.productUtils = require('./utils/product-utils.js');
theme.utils.cartUtils = require('./utils/cart-utils.js');
theme.utils.emailUtils = require('./utils/email-utils.js');

// SECTIONS
require('./sections/sections.js');
require('./sections/instagram.js');
require('./sections/header.js');
require('./sections/newsletter.js');
require('./sections/testimonials.js');
require('./sections/columns-carousel.js');
require('./sections/slideshow.js');
require('./sections/featured-collections.js');
require('./sections/collection.js');
require('./sections/parallax.js');
require('./sections/maps.js');
require('./sections/product.js');
require('./sections/collection.js');
require('./sections/search.js');

// SNIPPETS - Usually used in multiple places, most of these are global components
require('./bol/other.js');
require('./snippets/newsletter-popup.js');
require('./snippets/cookie-banner.js');
require('./snippets/scroll-to-top.js');


/*============================================================================
  Registering Sections
==============================================================================*/
$(document).ready(function() {
  var sections = new theme.Sections();
  sections.register('header-section', theme.Header);
  sections.register('newsletter-social', theme.Newsletter);
  sections.register('instagram', theme.Instagram);
  sections.register('featured-collections', theme.FeaturedCollections);
  sections.register('homepage-products', theme.FeaturedProducts);
  sections.register('collection-template', theme.Collection);
  sections.register('slideshow-section', theme.Slideshow);
  sections.register('columns-carousel-section', theme.ColumnsCarousel);
  sections.register('parallax-section', theme.Parallax);
  sections.register('map', theme.Maps);
  sections.register('homepage-testimonials', theme.Testimonials);
  sections.register('mobile-navigation', theme.mobileNav);
  sections.register('product-section', theme.Product);
  sections.register('search-template', theme.Search);
});
