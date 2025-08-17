const sheet = new CSSStyleSheet();
sheet.replaceSync(`###CSSCONTENT###`);
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

###SWIPERCONTENT###

###PLUGINCONTENT###