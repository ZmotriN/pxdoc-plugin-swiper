(function(){
    const sheetSwiper = new CSSStyleSheet();
    sheetSwiper.replaceSync(`###CSSCONTENT###`);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheetSwiper];

    ###SWIPERCONTENT###

    ###PLUGINCONTENT###
})();