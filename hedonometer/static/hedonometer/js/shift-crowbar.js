var page = require('webpage').create();
var system = require('system');
var fs = require('fs');
var address;
var selector;
var output;

if (system.args.length < 4) {
    console.log('Usage: phantom-crowbar.js <some URL> <selector> <outputfile>');
    phantom.exit();
}

address = system.args[1];
selector = system.args[2];
output = system.args[3];

// logging
page.onConsoleMessage = function(msg) {
  console.log('Console: '+msg);
};

// big screen
page.viewportSize = {
  width: 1400,
  height: 800
};

// open dat page
page.open(address, function(status) {
    if (status !== 'success') {
	console.log('FAIL to load the address');
	phantom.exit();
    } 
    else {
	var out = page.evaluate(function(s) {
	    // get rid of the credit and button entirely
	    d3.selectAll('g.resetbutton').remove();
	    d3.selectAll('.credit').remove();
	    
	    // nice way
	    // hedotools.shifter.resetbuttontoggle(false);
	    
	    // actually get the svg out, using a lot of the crowbar code
	    var source = '';
	    var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
	    var prefix = {
		xmlns: "http://www.w3.org/2000/xmlns/",
		xlink: "http://www.w3.org/1999/xlink",
		svg: "http://www.w3.org/2000/svg"
	    }

	    var styles = '';
            var styleSheets = document.styleSheets;

	    for (var i=0; i < styleSheets.length; i++) {
		processStyleSheet(styleSheets[i]);
	    }

	    // much simplified code from the crowbar
	    // don't care about illustrator
	    // and i don't use import rules
	    function processStyleSheet(ss) {
		if (ss.cssRules) {
		    for (var i = 0; i < ss.cssRules.length; i++) {
			var rule = ss.cssRules[i];
			styles += "\n" + rule.cssText;
		    }
		}
	    }

	    // mostly untouched from the crowbar
	    var svg = document.getElementById(s);
	    svg.setAttribute("version", "1.1");

	    var defsEl = document.createElement("defs");
	    svg.insertBefore(defsEl, svg.firstChild); 
	    var styleEl = document.createElement("style")
	    defsEl.appendChild(styleEl);
	    styleEl.setAttribute("type", "text/css");
	    svg.removeAttribute("xmlns");
	    svg.removeAttribute("xlink");
	    // These are needed for the svg
	    if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) {
		svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
	    }
	    if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
		svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
	    }
	    
	    var svgxml = (new XMLSerializer()).serializeToString(svg)
		.replace('</style>', '<![CDATA[' + styles + ']]></style>');
	    source += doctype + svgxml;

	    return source;

	}, selector);

	// write it out to a file
	fs.write(output,out,'w');
	console.log('Evaluated our code');
	phantom.exit();
    }
});



