// namespace it
var hedotools = hedotools || {};

// hedonometer.org/maps.html needs this in hedotools.map.js
var classColor = d3.scale.quantize()		
    .range([0,1,2,3,4,5,6])
    .domain([50,1]);

// begin with some helper functions
// http://stackoverflow.com/a/1026087/3780153
function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// this works really well, but it's deadly slow (working max 5 elements)
// and it's coupled to jquery
// http://stackoverflow.com/a/5047712/3780153
String.prototype.width = function(font) {
    var f = font || '12px arial',
    o = $('<div>' + this + '</div>')
	.css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
	.appendTo($('body')),
    w = o.width();
    o.remove();
    return w;
}

String.prototype.safe = function() {
    var tmp = this.split("/")
    tmp[tmp.length-1] = escape(tmp[tmp.length-1])
    return tmp.join("/");
}

// yup
// http://stackoverflow.com/questions/3883342/add-commas-to-a-number-in-jquery
function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
	val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

function splitWidth(s,w) {
    // s is the string
    // w is the width that we want to split it to
    var t = s.split(" ");
    var n = [t[0]];
    var i = 1;
    var j = 0;
    while (i<t.length) {
	if ((n[j]+t[i]).width() < w) {
	    n[j] += " "+t[i]
	}
	else {
	    j++;
	    n.push(t[i]);
	}
	i++;
    }
    return n;
}

// look away
var intStr0 = ["zero","one","two","three","four","five","six","seven","eight","nine","then"];
var intStr = intStr0.slice(1,100);

