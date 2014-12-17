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


function validateForm() {
    var ref = document.forms["wordshifterator"]["refText"].value;
    var comp = document.forms["wordshifterator"]["compText"].value;
    var refwords = ref.match(/[\w\@\#\'\&\]\*\-\/\[\=\;]+/gi);
    var compwords = comp.match(/[\w\@\#\'\&\]\*\-\/\[\=\;]+/gi);
    if (refwords.length < 1000) {
        alert("Too few words in reference text (found "+refwords.length+")");
        return false;
    }
    if (compwords.length < 1000) {
        alert("Too few words in comparison text (found "+compwords.length+")");
        return false;
    }
}
