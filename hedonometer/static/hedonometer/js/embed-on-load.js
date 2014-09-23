var addthis_share = addthis_share || {}
addthis_share = {
    // title: "title", // doesn't do anything, documentation patchy
    passthrough : {
        twitter: {
            via: "hedonometer",
            text: "hedonometer:"
        }
    }
}

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

// yup
// http://stackoverflow.com/questions/3883342/add-commas-to-a-number-in-jquery
function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
	val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

hedotools.loader = function() {
    var lensExtent = [4,6];
    var csvLoadsRemaining = 4;
    // load labMT files
    var scoresFile = "/data/labMT/labMTscores-english.csv";
    var wordsFile = "/data/labMT/labMTwords-english.csv";
    var lens;
    var words;
    var refFvec;
    var compFvec;
    var load = function() {
	d3.text(scoresFile, function(text) {
	    var tmp = text.split("\n");
	    //console.log(tmp.length);
	    //console.log(tmp[tmp.length-1]);
	    lens = tmp.map(parseFloat);
	    var len = lens.length - 1;
	    while (!lens[len]) {
		//console.log("in while loop");
		lens = lens.slice(0, len);
		len--;
	    }
	    if (!--csvLoadsRemaining) onload();
	});
	d3.text(wordsFile, function(text) {
	    var tmp = text.split("\n");
	    words = tmp;
	    var len = words.length - 1;
	    while (!words[len]) {
		//console.log("in while loop");
		words = words.slice(0, len);
		len--;
	    }
	    if (!--csvLoadsRemaining) onload();
	});
	d3.text(embedDetails.refFile,function(tmp) {
	    compFvec = tmp.split('\n').slice(0,10222);
	    if (!--csvLoadsRemaining) onload();
	});
	d3.text(embedDetails.compFile,function(tmp2) {
	    refFvec = tmp2.split('\n').slice(0,10222);
	    if (!--csvLoadsRemaining) onload();
	});
    };
    
    var onload = function() {
	// need to cut out the refF and compF middles
	for (var i=0; i<refFvec.length; i++) {
	    if (lens[i] > lensExtent[0] && lens[i] < lensExtent[1]) {
		refFvec[i] = 0;
		compFvec[i] = 0;
	    }
	}
	var shiftObj = hedotools.shifter.shift(refFvec,compFvec,lens,words);
	shiftObj.setfigure(d3.select('#shift01')).setText("title text").plot();
    };

    var opublic = { load: load,
		  };

    return opublic
}();

hedotools.loader.load();
