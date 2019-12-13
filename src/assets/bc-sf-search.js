// Override Settings
var bcSfSearchSettings = {
    search: {
        //suggestionMode: 'test',
        //suggestionPosition: 'left',
    }
};

// Customize style of Suggestion box
BCSfFilter.prototype.customizeSuggestion = function(suggestionElement, searchElement, searchBoxId) {
  	if (jQ(searchBoxId).closest('.searchbox').length > 0) {
      	this.setSuggestionWidth(searchBoxId, 300);
  	}
};
BCSfFilter.prototype.buildSuggestionCollection = function(a, b, c, d, e) {
    var f = "";
    if (Object.keys(b).length > 0) {
        var f = bcsffilter.buildSuggestionHeader(d.label, "collection");
        for (var g in b)
            if (g < d.number) {
                let title = b[g].title;
                if(title.toLowerCase().startsWith("vendor_")){
                    var indexoffirstspace =title.indexOf(" ");
                    title=title.substring(indexoffirstspace+1);
                }
                var h = bcsffilter.highlightSuggestionResult(title, a);
                f += '<li class="' + bcsffilter.class.searchSuggestionItem + '" aria-label="' + this.escape(d.label) + ": " + this.escape(b[g].title) + '">', f += '<a href="/collections/' + b[g].handle + '">' + h + "</a>", f += "</li>"
            }
    }
    return f
}