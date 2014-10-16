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

hedotools.loader = function() {
    var lensExtent = [4,6];
    var csvLoadsRemaining = 4;
    // load labMT files
    var scoresFile = "http://hedonometer.org/data/labMT/labMTscores-english.csv";
    var wordsFile = "http://hedonometer.org/data/labMT/labMTwords-english.csv";
    // var longerformat = d3.time.format("%A, %B %e, %Y");
    // var cformat = d3.time.format("%Y-%m-%d");
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
	
	hedotools.shifter.shift(refFvec,compFvec,lens,words);
	hedotools.shifter.setfigure(d3.select('#shift01'));
	var embedtext = embedDetails.fulltext;
	if (embedtext.length > 0) {
	    if (embedDetails.contextflag === 'main') {
		// do some specific replaces
		embedtext = embedtext.replace('avhapps',hedotools.shifter._compH().toFixed(2));
		var happysad = hedotools.shifter._compH() > hedotools.shifter._refH() ? "happier" : "less happy";
		embedtext = embedtext.replace('updown',happysad);
		hedotools.shifter.setText(embedtext.split('\n'));
	    }
	    else {
		hedotools.shifter.setText(embedtext.split('\n'));
	    }
	}
	hedotools.shifter.plot();
	hedotools.shifter.drawlogo();
    };

    var opublic = { load: load,
		  };

    return opublic
}();

hedotools.loader.load();
