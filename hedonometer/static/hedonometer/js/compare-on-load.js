String.prototype.width = function(font) {
    var f = font || '12px arial',
    o = $('<div>' + this + '</div>')
	.css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
	.appendTo($('body')),
    w = o.width();
    o.remove();
    return w;
}

d3.select("#makewordshift")
    .on("mousedown",function(d,i) { 
	// console.log("clicked");
	refText = d3.select("#referenceText").text();
	compText = d3.select("#comparisonText").text();
    });
