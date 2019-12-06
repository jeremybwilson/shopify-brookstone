// Override Settings : Note, custom object cant' be overriden and rquires direct modification
var bcSfFilterSettings = {
    general: {
       limit: bcSfFilterConfig.custom.products_per_page,
        // Optional
        loadProductFirst: true,
        refineByHorizontalPosition: 'top',
        breakpointMobile: '1023',
        isIpadMobile: $(window).width() < 1024 ? true : false
    },
    selector: {
        products: '#product-loop'
    }
};


// FILTER TEMPLATES
var bcSfFilterTemplate = {

    // Grid Template
    'productGridItemHtml':  '<div id="{{itemProductId}}" class="product-index {{itemGridWidthClass}}" data-alpha="{{itemTitle}}" data-price="{{itemPriceAttr}}">' +
                                '<div class="prod-container">' +
                                    '{{itemBadge}}' +
                                    '<div class="prod-image">' +
                                        '<a href="{{itemUrl}}" title="{{itemTitle}}">' +
                                        '<div class="reveal">' +
                                            '<img id="product-image-{{itemProductId}}" src="{{itemThumbUrl}}" alt="{{itemTitle}}" />' +
                                            '{{itemFlipImage}}' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +

                                '<div class="product-info">' +
                                    '{{itemQuickview}}' +
                                    '<a class="product-title-wrap" href="{{itemUrl}}"> ' +
                                        '{{itemVendor}}' +
                                        '<h3 class="product-title">{{itemTitle}}</h3>' +
                                    '</a>' +
                                    '{{wishlistButton}}' +
                                    '<div class="product-price-wrap bfx-price">{{itemPrice}}</div>' +
                                    '{{itemSwatch}}' +
                                    '{{itemPersistentNote}}'+                                    
                                '</div>' +
                            '</div>',

    // Badge Template
    'itemBadgeHtml': '<div class="react-badge" data-badge=\'{{badgeTags}}\'></div>',

    // Note Template
    'itemNoteHtml': '<h4 class="persistent-note">{{noteMsg}}</h4>',        

    // Wishlist Heart Template
    'wishlistBtnHtml': '<button class="button-wishlist-product" data-on-wishlist="false" data-product-id="{{itemProductId}}" data-variant-id="{{itemVaraintId}}">' +
        '<svg version="1.1" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 64 60.833">' +
            '<path stroke="#000" stroke-width="5" stroke-miterlimit="10" d="M45.684,2.654c-6.057,0-11.27,4.927-13.684,10.073 c-2.417-5.145-7.63-10.073-13.687-10.073c-8.349,0-15.125,6.776-15.125,15.127c0,16.983,17.134,21.438,28.812,38.231 c11.038-16.688,28.811-21.787,28.811-38.231C60.811,9.431,54.033,2.654,45.684,2.654z"></path>' +
        '</svg>' +
    '</button>',

    // Pagination Template
    'previousHtml': '<a href="{{itemUrl}}"><i class="fa fa-angle-left" aria-hidden="true"></i></a>',
    'nextHtml': '<a href="{{itemUrl}}"><i class="fa fa-angle-right" aria-hidden="true"></i></a>',
    'pageItemHtml': '<a href="{{itemUrl}}">{{itemTitle}}</a>',
    'pageItemSelectedHtml': '<span class="current">{{itemTitle}}</span>',
    'pageItemRemainHtml': '{{itemTitle}}',
    'paginateHtml': '<span class="count"></span>{{previous}}{{pageItems}}{{next}}',

    // Sorting Template
    'sortingHtml': '<h4 class="sort-label">' + bcSfFilterConfig.label.sorting + '</h4><select class="styled-select">{{sortingItems}}</select>',

    // Apply Btn Template (Mobile) : Filter constructor not exposed, so func binding close not available, hence this sad click..
    'mobileApplyBtnHtml': '<button class="mobile-apply-button" onClick="$(\'#bc-sf-filter-tree-mobile-button\').click()">Apply</button>'
};



BCSfFilter.prototype.buildProductGridItem = function(data, index, totalProduct) {
    // DATA : Prepare necessary data bits
    var images = data.images_info;
    var collectionMergeData = window.Shopify.collectionMergeData;
    if ( !collectionMergeData ) {
        console.log( 'Error : Global variable Shopify.collectionMergeData is missing, applying fallback -- Merge swatches will not work.' );
        collectionMergeData = {};
    }

    // Displaying price base on the policy of Shopify
    var soldOut = !data.available; // Check a product is out of stock
    var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
    var priceVaries = data.price_min != data.price_max; // Check a product has many prices


    /* HIDE ITEM : Hide if tag "hide_from_catalog" found basically 
    INFO:
        If item has tag "hide_from_catalog", skip it as its a Gift w/ Purchase item
        We can't set item unavailable on sales channels if its a gift item, so this 
        is solution for now to hide the item from store "all products catalogs"

    RESULTS COUNT NOTE : 
        Page counts will be off by however hidden items there are, but since
        hidden items should have no collection tag assignments, it should only
        affect the "all products" collection and a num or two off shouldn't matter there.
    * --------------------------------------------------------------------------------------- */ 
    if ( data.tags ) {
        var hasHideFlag = data.tags.filter(function (tag) {
            return tag === 'hide_from_catalog'
        }).length

        if ( hasHideFlag ) {
            return '';
        }
    }


    // Get First Variant (selected_or_first_available_variant)
    var firstVariant = data['variants'][0];
    if (getParam('variant') !== null && getParam('variant') != '') {
        var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant'); });
        if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];

    } else {
        for (var i = 0; i < data['variants'].length; i++) {
            if (data['variants'][i].available) {
                firstVariant = data['variants'][i];
                break;
            }
        }
    }
    /*** End Prepare data ***/


    // TEMPLATE : Create unique tpl instance
    var itemHtml = bcSfFilterTemplate.productGridItemHtml;


    // CSS GRID : Add itemGridWidthClass to match row config
    var itemGridWidthClass = '';
    switch (bcSfFilterConfig.custom.products_per_row) {
        case 2: itemGridWidthClass = 'desktop-6 tablet-3 mobile-half'; break;
        case 3: itemGridWidthClass = 'desktop-4 tablet-2 mobile-half'; break;
        case 4: itemGridWidthClass = 'desktop-3 tablet-2 mobile-half'; break;
        default: break;
    }
    itemHtml = itemHtml.replace(/{{itemGridWidthClass}}/g, itemGridWidthClass);


    // BADGE : ITEM TYPE : Add Item Badge (Required Tags : item_badge_text_SOMETHING + item_badge_shape_SOMETHING)
    if ( data.tags ) {
        var findTag = function(searchString) {
            var foundTags = data.tags.filter( function( tag ) {
                return tag.indexOf( searchString ) >= 0;
            });

            return foundTags || [];
        };

        // POPULATE : Build array of tags with only the ones we want
        var badgeTags = findTag( 'item_badge_' );
        if ( badgeTags.length > 0 ) {

            // RENDER : Drop populated badge template into itemHtml template
            var itemBadgeHtml = bcSfFilterTemplate.itemBadgeHtml; //Don't modify original :)
            itemBadgeHtml = itemBadgeHtml.replace( /{{badgeTags}}/g, JSON.stringify( badgeTags ) );
            itemHtml = itemHtml.replace( /{{itemBadge}}/g, itemBadgeHtml );

        } else {
            itemHtml = itemHtml.replace(/{{itemBadge}}/g, '' ); //No badge, remove block
        }
    }


    // THUMBNAIL : Add Thumbnail template
    var itemThumbUrl = images.length > 0 ? this.optimizeImage(images[0]['src'], '500x') : bcSfFilterConfig.general.no_image_url;
    itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);


    // IMAGE : FLIP : Add Flip Image if enabled
    var itemFlipImageHtml = '';
    if (bcSfFilterConfig.custom.image_flip && images.length > 1) {
        itemFlipImageHtml = '<div class="hidden">';
        itemFlipImageHtml += '<img src="' + this.optimizeImage(images[1]['src'], '500x') + '" alt="{{itemTitle}}" />';
        itemFlipImageHtml += '</div>';
    }
    itemHtml = itemHtml.replace(/{{itemFlipImage}}/g, itemFlipImageHtml);


    // VENDOR : Display vendor if enabled
    var itemVendorHtml = bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.vendorHtml.replace(/{{itemVendorLabel}}/g, data.vendor) : '';
    itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);


    // WISHLIST BUTTON : Add wishlist button to grid item (Needs ID, so fill this before "{{itemProductId}}" )
    itemHtml = itemHtml.replace(/{{wishlistButton}}/g, bcSfFilterTemplate.wishlistBtnHtml);


    // PRICE : Add price and original price if discounted
    var itemPriceHtml = '';
    if (onSale) {
        itemPriceHtml += '<div class="onsale bfx-price">' + this.formatMoney(data.price_min, this.moneyFormat) + '</div>';
        itemPriceHtml += '<div class="was bfx-price">' + this.formatMoney(data.compare_at_price_min, this.moneyFormat) + '</div>';

    } else {
        itemPriceHtml += '<div class="prod-price bfx-price">';

        if (priceVaries) {
            itemPriceHtml += bcSfFilterConfig.label.from_price + ' ' + this.formatMoney(data.price_min, this.moneyFormat) + ' - ' + this.formatMoney(data.price_max, this.moneyFormat);
        } else {
            itemPriceHtml += this.formatMoney(data.price_min, this.moneyFormat);
        }

        itemPriceHtml += '</div>';
    }
    // PDM-868 : Patch for mobile Safari regex bug
    var itemPriceRegEx = new RegExp( '{{itemPrice}}', 'g'); 
    itemHtml = itemHtml.replace(itemPriceRegEx, function(match) { return itemPriceHtml }); 
    

    // QUICK VIEW : Add quickview template and setup for fancybox usage
    var itemQuickviewHtml = '';
    if (bcSfFilterConfig.custom.quick_view_enable) {
        itemQuickviewHtml += '<a class="fancybox.ajax product-modal product-quickview" href="{{itemUrl}}?view=quick">' + bcSfFilterConfig.label.quick_view + '</a>';
    }
    itemHtml = itemHtml.replace(/{{itemQuickview}}/g, itemQuickviewHtml);


    // SWATCHES : Build data object for usage in react-swatches
    itemHtml = itemHtml.replace(/{{itemProductId}}/g, data.id ); //Splice in product ID
    var itemSwatchHtml = '';
    if ( bcSfFilterConfig.custom.alternate_colors ) {

        // UTILS : Store util methods so we can use inside iterators
        var slugify = this.slugify;
        var optimizeImage = this.optimizeImage.bind( this ); //BCSF constructor needs this context to function

        // DATA - PARENT COLORS : Build parent product colorValues array, simplifies complex BCSF data structure
        var colorValues = [];
        var colorOptionIndex = data.options.findIndex( function( opt ) { return opt === 'colour' || opt === 'color' } );
        var colorOptionData = data.options_with_values[ colorOptionIndex ];
        if ( colorOptionData && typeof colorOptionData !== 'undefined' && colorOptionData.values ) {
            colorValues = colorOptionData.values;
        }

        // DATA - DEFAULT IMAGE : Parent image that is displayed by default (used by hover states to reset)
        var productImgUrl = images.length > 0 ? optimizeImage(images[0]['src'], '500x') : bcSfFilterConfig.general.no_image_url;

        // DATA - MERGE DATA : If product had merge tags ('pdp_merge_HANDLE') its product ID will be in this manifest
        var mergeData = collectionMergeData[ data.id ];

        // BUILD : Color Values -- MERGE : If merge data present & color is on this product
        if ( colorOptionIndex > -1 && mergeData ) {
            var optionNum = colorOptionIndex + 1;

            // COLORS : Overwrite 'colorValues' using merged product data
            var mergedColors = mergeData[ 'option' + optionNum + 'Values' ];
            colorValues = [];

            // BUILD : Construct array of image url and color names using merged variant data
            mergedColors.forEach( function( color ) {

                // FALLBACK : Setup fallback image in case no variant in that color has an image attached
                var colorObj = {
                    image: productImgUrl, // Prevent broken img situations
                    title: color,
                    sku: '__No image on variants__' // Only missing img / sku when none of that color have a variant image attached (only needs 1, doesn't have to be all)
                };

                // FIND : Variant with image + congruent color name option
                //        Note: Must use variant in case merged product contains multiple colorways, can't fallback to product featured img
                var variantMatch = mergeData.variants.find( function ( variant ) {
                    var colorMatch = variant[ 'option' + optionNum ] === color;
                    var hasImage = variant.featured_image && variant.featured_image.src;
                    return colorMatch && hasImage;
                });

                // BUILD : Create object using variant data
                if ( variantMatch ) {
                    colorObj.image = variantMatch.featured_image.src;
                    colorObj.sku = variantMatch.sku;
                }

                // ADD : Push the color into our colors array
                colorValues.push( colorObj );
            });

        // BUILD : Color Values -- SINGLE : No merge data for this product, build color data using BCSF data
        } else if ( colorValues.length > 0 ){

            // SKU : Only used to build swatch url, sku will typically be the same across variants on a single product
            var productSku = data.selected_or_first_available_variant.sku;
            /* SKU NOTE : If sku contains size / etc content, use first portion like below:
                var productSku = data.selected_or_first_available_variant.sku.split('-');
                productSku = productSku[0];
            */

            // BUILD : Create congruent colorValues object as we do with the merge data for normalization
            var normalizedValues = colorValues.map( function (colorObj) {

                // VARIANT IMG: Fallback
                var variantImgUrl = productImgUrl;
                var imageIndex = colorObj.image - 1; //Doesn't count from 0, counts from 1
                if ( typeof data['images'][imageIndex] !== 'undefined' ) {
                    variantImgUrl = optimizeImage(data['images'][imageIndex]['src'], '500x');
                }

                // VALUE : Normalized value object to match merge type objects
                return {
                    image: variantImgUrl,
                    sku: productSku,
                    title: colorObj.title
                };
            });
            colorValues = normalizedValues;
        }



        // BUILD SWATCHES : React -> SwatchParent.js : render swatches if multiple colors present
        if ( colorValues && colorValues.length > 1 ) {
            var swatchManifest = [];

            // NOTE : REFACTOR TO A FOR EACH AND USE NEW NORMALIED STRUCTURE!
            colorValues.forEach( function( colorObj ) {

                // SWATCH IMAGE : Build swatch image, fallback to color setting in case that fails
                var colorName = slugify( colorObj.title ).replace( /-/gi, '_' ); //Replace slug dash for _ to support photo studio tool format
                var swatchFileName = colorObj.sku + '_' + colorName + '_sw.gif';
                var swatchImgUrl = bcSfFilterConfig.general.file_url.replace( 'swatch_url_source_do_not_remove.png', swatchFileName.toLowerCase() );

                // SWATCH OBJ: Single swatch object for manifest
                var colorValueName = slugify( colorObj.title );
                var swatch = {
                    colorDisplayName: colorObj.title,           // NAME : Color Name that user sees in tooltip
                    colorValueName: colorValueName,             // NAME : CSS name for color style fallback
                    productId: data.id,                         // ID : Product ID
                    productImgUrl: productImgUrl,               // IMAGE : Product image original (for restoring after hover)
                    swatchId: data.id + '-' + colorValueName,   // ID : Swatch : Swatch Color Unique ID
                    swatchImgUrl: swatchImgUrl,                 // SWATCH : Image url for swatch (fallback = name as color)
                    variantImgUrl: colorObj.image               // IMAGE : Product Variant Image for that color option
                }

                // MANIFEST : ADD : Add this swatch to the list
                swatchManifest.push( swatch );
            });


            // POPULATE : Render the react root element for each swatch list
            var swatchManifestString = JSON.stringify( swatchManifest );
            itemSwatchHtml = "<div class='react-swatch-list' data-swatches='" + swatchManifestString + "'></div>";

        // BUILD : Spacer : Only 1 color, render spacer instead of swatch list
        } else {
            itemSwatchHtml = "<div class='swatch-spacer'></div>";
        }
    }
    itemHtml = itemHtml.replace(/{{itemSwatch}}/g, itemSwatchHtml);

    // PERSISTENT NOTE

    if ( data.tags ) {
        var findTag = function(searchString) {
            var foundTags = data.tags.filter( function( tag ) {
                return tag.indexOf( searchString ) >= 0; 
            });

            return foundTags || [];
        };

        // POPULATE : Build array of tags with only the ones we want
        var noteTag = findTag( 'persistent_note_' );
        if ( noteTag.length > 0 ) {            

            noteTag = noteTag[0].replace('persistent_note_','');

            // RENDER : Drop populated note template into itemHtml template
            var itemNoteHtml = bcSfFilterTemplate.itemNoteHtml; //Don't modify original :)
            itemNoteHtml = itemNoteHtml.replace( /{{noteMsg}}/g, noteTag );
            itemHtml = itemHtml.replace( /{{itemPersistentNote}}/g, itemNoteHtml );

        } else {
            itemHtml = itemHtml.replace(/{{itemPersistentNote}}/g, '' ); //No tag, remove block
        }
    }    


    // INFO : Add main attributes for product data
    itemHtml = itemHtml.replace(/{{itemPriceAttr}}/g, data.price_min);
    itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
    itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
    itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);
    itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));


    // RENDER : Return out our built template!
    return itemHtml;
}

// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
    // Get page info
    var currentPage = parseInt(this.queryParams.page);
    var totalPage = Math.ceil(totalProduct / this.queryParams.limit);

    // If it has only one page, clear Pagination
    if (totalPage == 1) {
        jQ(this.selector.pagination).html('');
        return false;
    }

    if (this.getSettingValue('general.paginationType') == 'default') {
        var paginationHtml = bcSfFilterTemplate.paginateHtml;

        // Build Previous
        var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousHtml : '';
        previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage - 1));
        paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

        // Build Next
        var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextHtml : '';
        nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
        paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);

        // Create page items array
        var beforeCurrentPageArr = [];
        for (var iBefore = currentPage - 1; iBefore > currentPage - 3 && iBefore > 0; iBefore--) {
            beforeCurrentPageArr.unshift(iBefore);
        }
        if (currentPage - 4 > 0) {
            beforeCurrentPageArr.unshift('...');
        }
        if (currentPage - 4 >= 0) {
            beforeCurrentPageArr.unshift(1);
        }
        beforeCurrentPageArr.push(currentPage);

        var afterCurrentPageArr = [];
        for (var iAfter = currentPage + 1; iAfter < currentPage + 3 && iAfter <= totalPage; iAfter++) {
            afterCurrentPageArr.push(iAfter);
        }
        if (currentPage + 3 < totalPage) {
            afterCurrentPageArr.push('...');
        }
        if (currentPage + 3 <= totalPage) {
            afterCurrentPageArr.push(totalPage);
        }

        // Build page items
        var pageItemsHtml = '';
        var pageArr = beforeCurrentPageArr.concat(afterCurrentPageArr);
        for (var iPage in pageArr) {
            if (pageArr[iPage] == '...') {
                pageItemsHtml += bcSfFilterTemplate.pageItemRemainHtml;
            } else {
                pageItemsHtml += (pageArr[iPage] == currentPage) ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml;
            }
            pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
            pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, pageArr[iPage]));
        }
        paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);

        jQ(this.selector.pagination).html(paginationHtml);
    }
};

// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function() {
    if (bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
        jQ(this.selector.topSorting).html('');

        var sortingArr = this.getSortingList();
        if (sortingArr) {
            // Build content
            var sortingItemsHtml = '';
            for (var k in sortingArr) {
                sortingItemsHtml += '<option value="' + k +'">' + sortingArr[k] + '</option>';
            }
            var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
            jQ(this.selector.topSorting).html(html);

            // Set current value
            jQ(this.selector.topSorting + ' select').val(this.queryParams.sort);
        }
    }
};

// Build additional attributes of product items
BCSfFilter.prototype.buildExtrasProductList = function(data) {
    if(bcSfFilterSettings.general.isIpadMobile && data.length < 2){
        $('#collection-wrapper .filter-wrapper').hide();
    }
    // THE ONE IN THEME.JS SEEMS TO ACTUALLY DO SOMETHING,
    // NOT SURE WHAT THIS IS DOING AS NOTHING BROKE COMMENTING IT OUT..

    // if ($(window).width() >= 769) {
    //     $('.prod-container').hover(function(){
    //         $(this).children('.product-modal').show();
    //     }, function(){
    //         $(this).children('.product-modal').hide();
    //     })

    //     // Call Fancybox for product modal + stop scroll to top
    //     $('.product-modal').fancybox({
    //         helpers: {
    //             overlay: {
    //                 locked: false
    //             }
    //         }
    //     });
    // }
};

// Build Additional Elements
BCSfFilter.prototype.buildAdditionalElements = function(data, eventType) {

    var ui = {
        filterHeaderText: '.bc-sf-filter-block-title span', // Text for filter headers, appending the count here
        filterSetWraps: '.bc-sf-filter-option-block-list',  //Generated by filter js, DON'T store jq dom references here
        filterTreeWrap: '#bc-sf-filter-tree',
        filterWrap: '.filter-wrap-desktop',
        resultsCount: 'results-count', // Using innerHTML, lack of # intentional
        selectedInputs: 'input.selected'
    };

    // RESULTS COUNT : Render number of results in current collection
    var resultsDiv = document.getElementById( ui.resultsCount ) || {};
    resultsDiv.innerHTML = data.total_product + " Results";


    // Build number of products (BoostCommerce Code)
    var from = this.queryParams.page == 1 ? this.queryParams.page : (this.queryParams.page - 1) * this.queryParams.limit + 1;
    var to = from + data.products.length - 1;
    jQ(this.selector.bottomPagination).find('.count').html(bcSfFilterConfig.label.showing_items + ' ' + from + '-' + to + ' ' +  bcSfFilterConfig.label.pagination_of + ' ' + data.total_product);


    // APPLY (MOBILE) : Filters apply on selection, "Apply" closes menu on moble.
    var filterTreeWrap = $( ui.filterTreeWrap );
    if ( filterTreeWrap ) {
        filterTreeWrap.append( bcSfFilterTemplate.mobileApplyBtnHtml );
    }

    // HIDE 1 OPTION FILTERS : Do not show filters with one option, app doesn't seem to handle this right
    var filterData = {};
    if ( data.filter ) {
        filterData = window.filter = data.filter; //Update filter data with latest from API

    // Fallback, only initial API calls have filter data since its for the whole set of paginated data.
    } else {
        filterData = window.filter;
    }
    // HIDE : 'activeFilters' builds array of populated filters with 2+ props
    var filters =  filterData && filterData.options ? filterData.options : [];
    var activeFilters = filters.filter( function( obj ) {
        return obj.status === 'active' && obj.values && obj.values.length > 1
    });

    // TOTAL : Add data attr to determine number of filters present currently (so ipad can adjust)
    var filterWrap = $( ui.filterWrap );
    if ( filterWrap.length > 0 ) {
        visibleFilters = activeFilters.filter( function( filter ) {
            return filter.values && filter.values.length > 1;
        });
        filterWrap.attr( 'data-total-filter-count', visibleFilters.length );
    }


    // FILTER SELECTION COUNTS : Indicates how many filters in each set are selected
    var updateFilterCounts = function() {

        // SETS : If we have them, find the selected items in each and set a data-attr for the current count
        var filterSets = $( ui.filterSetWraps ) || [];
        var hasSelections = false;

        // SELECTED : Calculate which filters have selections to display an indicator
        filterSets.each( function() {
            var selections = $(this).find( ui.selectedInputs ) || [];

            // COUNT : If selections, count & store to data-selected-filter-count prop
            if ( selections.length > 0 ) {
                hasSelections = true;
                $(this).attr( 'data-selected-filter-count', selections.length ); //SET : Parent Set Wrapper block, used by 'clear' button styles
                $(this).find( ui.filterHeaderText ).attr( 'data-selected-filter-count', selections.length ); // SET : Actual Span so CSS can read value to show
            }

            // PURGE : Remove any filter with only one value available
            var id = this.dataset.id;
            var hasMultipleValues = activeFilters.find( function(active) {
                return id && id === active.filterOptionId;
            });
            if ( !hasMultipleValues ) {
                $(this).remove(); // Removal means border setups on ":first-child" still behave properly
            }
        });

        // BUTTONS : ARRANGEMENT : Indicator to tel how to style "apply" button to sit with "Clear All", which admittedly had to be a bit strangely wired
        hasSelections ? (
            $( ui.filterTreeWrap ).addClass( 'selections-active' ) // Selections present
        ) : (
            $( ui.filterTreeWrap ).removeClass( 'selections-active' ) // No selections present
        );
    }
    updateFilterCounts(); //Invoke count update on filter update


    // SWATCHES : Trigger event emit to re-render swatches
    $.event.trigger({
        type: "collectionUpdated",
        time: new Date()
    });
};


// Build Default layout
function buildDefaultLink(a,b){var c=window.location.href.split("?")[0];return c+="?"+a+"="+b}BCSfFilter.prototype.buildDefaultElements=function(a){if(bcSfFilterConfig.general.hasOwnProperty("collection_count")&&jQ("#bc-sf-filter-bottom-pagination").length>0){var b=bcSfFilterConfig.general.collection_count,c=parseInt(this.queryParams.page),d=Math.ceil(b/this.queryParams.limit);if(1==d)return jQ(this.selector.pagination).html(""),!1;if("default"==this.getSettingValue("general.paginationType")){var e=bcSfFilterTemplate.paginateHtml,f="";f=c>1?bcSfFilterTemplate.hasOwnProperty("previousActiveHtml")?bcSfFilterTemplate.previousActiveHtml:bcSfFilterTemplate.previousHtml:bcSfFilterTemplate.hasOwnProperty("previousDisabledHtml")?bcSfFilterTemplate.previousDisabledHtml:"",f=f.replace(/{{itemUrl}}/g,buildDefaultLink("page",c-1)),e=e.replace(/{{previous}}/g,f);var g="";g=c<d?bcSfFilterTemplate.hasOwnProperty("nextActiveHtml")?bcSfFilterTemplate.nextActiveHtml:bcSfFilterTemplate.nextHtml:bcSfFilterTemplate.hasOwnProperty("nextDisabledHtml")?bcSfFilterTemplate.nextDisabledHtml:"",g=g.replace(/{{itemUrl}}/g,buildDefaultLink("page",c+1)),e=e.replace(/{{next}}/g,g);for(var h=[],i=c-1;i>c-3&&i>0;i--)h.unshift(i);c-4>0&&h.unshift("..."),c-4>=0&&h.unshift(1),h.push(c);for(var j=[],k=c+1;k<c+3&&k<=d;k++)j.push(k);c+3<d&&j.push("..."),c+3<=d&&j.push(d);for(var l="",m=h.concat(j),n=0;n<m.length;n++)"..."==m[n]?l+=bcSfFilterTemplate.pageItemRemainHtml:l+=m[n]==c?bcSfFilterTemplate.pageItemSelectedHtml:bcSfFilterTemplate.pageItemHtml,l=l.replace(/{{itemTitle}}/g,m[n]),l=l.replace(/{{itemUrl}}/g,buildDefaultLink("page",m[n]));e=e.replace(/{{pageItems}}/g,l),jQ(this.selector.pagination).html(e)}}if(bcSfFilterTemplate.hasOwnProperty("sortingHtml")&&jQ(this.selector.topSorting).length>0){jQ(this.selector.topSorting).html("");var o=this.getSortingList();if(o){var p="";for(var q in o)p+='<option value="'+q+'">'+o[q]+"</option>";var r=bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g,p);jQ(this.selector.topSorting).html(r);var s=void 0!==this.queryParams.sort_by?this.queryParams.sort_by:this.defaultSorting;jQ(this.selector.topSorting+" select").val(s),jQ(this.selector.topSorting+" select").change(function(a){window.location.href=buildDefaultLink("sort_by",jQ(this).val())})}}};


// Customize data to suit the data of Shopify API
BCSfFilter.prototype.prepareProductData = function(data) {
    for (var k = 0; k < data.length; k++) {
        data[k]['images'] = data[k]['images_info'];
        if (data[k]['images'].length > 0) {
            data[k]['featured_image'] = data[k]['images'][0]
        } else {
            data[k]['featured_image'] = {
                src: bcSfFilterConfig.general.no_image_url,
                width: '',
                height: '',
                aspect_ratio: 0
            }
        }
        data[k]['url'] = '/products/' + data[k].handle;

        var optionsArr = [];
        for (var i = 0; i < data[k]['options_with_values'].length; i++) {
            optionsArr.push(data[k]['options_with_values'][i]['name'])
        }

        data[k]['options'] = optionsArr;

        data[k]['price_min'] *= 100,
        data[k]['price_max'] *= 100,
        data[k]['compare_at_price_min'] *= 100,
        data[k]['compare_at_price_max'] *= 100;

        data[k]['price'] = data[k]['price_min'];
        data[k]['compare_at_price'] = data[k]['compare_at_price_min'];
        data[k]['price_varies'] = data[k]['price_min'] != data[k]['price_max'];

        var firstVariant = data[k]['variants'][0];
        if (getParam('variant') !== null && getParam('variant') != '') {
            var variantArr = data.variants ? data.variants : data[k]['variants']; //MODIFIED : This was breaking collection when ?variant=### query params were in url
            var paramVariant = variantArr.filter(
                function(e) {
                    return e.id == getParam('variant')
                }
            );

            if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0]
        } else {
            for (var i = 0; i < data[k]['variants'].length; i++) {
                if (data[k]['variants'][i].available) {
                    firstVariant = data[k]['variants'][i];
                    break
                }
            }
        }

        data[k]['selected_or_first_available_variant'] = firstVariant;
        for (var i = 0; i < data[k]['variants'].length; i++) {
            var variantOptionArr = [];
            var count = 1;
            var variant = data[k]['variants'][i];
            var variantOptions = variant['merged_options'];
            if (Array.isArray(variantOptions)) {
                for (var j = 0; j < variantOptions.length; j++) {
                    var temp = variantOptions[j].split(':');
                    data[k]['variants'][i]['option' + (parseInt(j) + 1)] = temp[1];
                    data[k]['variants'][i]['option_' + temp[0]] = temp[1];
                    variantOptionArr.push(temp[1])
                }
                data[k]['variants'][i]['options'] = variantOptionArr
            }

            data[k]['variants'][i]['compare_at_price'] = parseFloat(data[k]['variants'][i]['compare_at_price']) * 100;
            data[k]['variants'][i]['price'] = parseFloat(data[k]['variants'][i]['price']) * 100
        }

        data[k]['description'] = data[k]['content'] = data[k]['body_html']
    }
    return data;
};
