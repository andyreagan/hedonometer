hedotools.sankeyoncall = function() { 
    var test = function(i,data) {
	console.log("set on call");
    }
    var opublic = { test: test, };
    return opublic;
}();

var intStr = ["one","two"];
var timeFrames= ["2011","2012","2013","2014"];

var reftimeselencoder = d3.urllib.encoder().varname("ref");
var reftimeseldecoder = d3.urllib.decoder().varname("ref").varresult("2011");
d3.select(".reftimelabel").html("All tweets from "+reftimeseldecoder().cached+' <span class="caret"></span>');
d3.select(".reftimelabelbottom").html("All tweets from "+reftimeseldecoder().cached+' <span class="caret"></span>');

var comptimeselencoder = d3.urllib.encoder().varname("comp");
var comptimeseldecoder = d3.urllib.decoder().varname("comp").varresult("2012");
d3.select(".comptimelabel").html("All tweets from "+comptimeseldecoder().cached+' <span class="caret"></span>');
d3.select(".comptimelabelbottom").html("All tweets from "+comptimeseldecoder().cached+' <span class="caret"></span>');

// to store the "select as reference city" selection
var refcity = "";

// share-able shifts!
var refshifttimeencoder = d3.urllib.encoder().varname("reftime");
var refshifttimedecoder = d3.urllib.decoder().varname("reftime").varresult("");
var refshiftcityencoder = d3.urllib.encoder().varname("refcity");
var refshiftcitydecoder = d3.urllib.decoder().varname("refcity").varresult("");
var compshifttimeencoder = d3.urllib.encoder().varname("comptime");
var compshifttimedecoder = d3.urllib.decoder().varname("comptime").varresult("");
var compshiftcityencoder = d3.urllib.encoder().varname("compcity");
var compshiftcitydecoder = d3.urllib.decoder().varname("compcity").varresult("");

// get rid of them when the modal closes
$('#myModal').on('hidden.bs.modal', function (e) {
    refshifttimeencoder.varval("none");
    refshifttimeencoder.destroy();
    refshiftcityencoder.varval("none");
    refshiftcityencoder.destroy();
    compshifttimeencoder.varval("none");
    compshifttimeencoder.destroy();
    compshiftcityencoder.varval("none");
    compshiftcityencoder.destroy();
});

function initializePlot() {
    timeDrop();
    loadCsv();
}

function timeDrop() {
    d3.select("#refSelect").selectAll("a")
        .on("click", function(d,i) {
	    key = i;
	    d3.select(".reftimelabel").html("All tweets from "+timeFrames[key]+' <span class="caret"></span>');
	    d3.select(".reftimelabelbottom").html("All tweets from "+timeFrames[key]+' <span class="caret"></span>');
	    reftimeselencoder.varval(timeFrames[key]);
	    d3.text("http://hedonometer.org/data/cities/cityList_"+(reftimeseldecoder().cached)+"_top100Happs.csv", function(text) {
		ref = text.split("\n").slice(0,304);
		hedotools.sankey.setdata(ref,comp,cities).replot();
	    });
	});
    d3.select("#compSelect").selectAll("a")
        .on("click", function(d,i) {
            // key = this.selectedIndex;
	    key = i;
	    d3.select(".comptimelabel").html("All tweets from "+timeFrames[key]+' <span class="caret"></span>');
	    d3.select(".comptimelabelbottom").html("All tweets from "+timeFrames[key]+' <span class="caret"></span>');
	    comptimeselencoder.varval(timeFrames[key]);
	    d3.text("http://hedonometer.org/data/cities/cityList_"+(comptimeseldecoder().cached)+"_top100Happs.csv", function(text) {
		comp = text.split("\n").slice(0,304);
		hedotools.sankey.setdata(ref,comp,cities).replot();
	    });
	});
    d3.select("#refSelectBottom").selectAll("a")
        .on("click", function(d,i) {
	    key = i;
	    d3.select(".reftimelabel").html("All tweets from "+timeFrames[key]+' <span class="caret"></span>');
	    d3.select(".reftimelabelbottom").html("All tweets from "+timeFrames[key]+' <span class="caret"></span>');
	    reftimeselencoder.varval(timeFrames[key]);
	    d3.text("http://hedonometer.org/data/cities/cityList_"+(reftimeseldecoder().cached)+"_top100Happs.csv", function(text) {
		ref = text.split("\n").slice(0,304);
		hedotools.sankey.setdata(ref,comp,cities).replot();
	    });
	});
    d3.select("#compSelectBottom").selectAll("a")
        .on("click", function(d,i) {
            // key = this.selectedIndex;
	    key = i;
	    d3.select(".comptimelabel").html("All tweets from "+timeFrames[key]+' <span class="caret"></span>');
	    d3.select(".comptimelabelbottom").html("All tweets from "+timeFrames[key]+' <span class="caret"></span>');
	    comptimeselencoder.varval(timeFrames[key]);
	    d3.text("http://hedonometer.org/data/cities/cityList_"+(comptimeseldecoder().cached)+"_top100Happs.csv", function(text) {
		comp = text.split("\n").slice(0,304);
		hedotools.sankey.setdata(ref,comp,cities).replot();
	    });
	});
}

function loadCsv() {
    var csvLoadsRemaining = 3;
    d3.text("http://hedonometer.org/data/cities/cityList_"+(reftimeseldecoder().cached)+"_top100Happs.csv", function(text) {
	ref = text.split("\n").slice(0,304);
	if (!--csvLoadsRemaining) initializePlotPlot();
    });
    d3.text("http://hedonometer.org/data/cities/cityList_"+(comptimeseldecoder().cached)+"_top100Happs.csv", function(text) {
	comp = text.split("\n").slice(0,304);;
	if (!--csvLoadsRemaining) initializePlotPlot();
    });
    d3.text("http://hedonometer.org/data/cities/mutualCities.csv", function(text) {
	cities = text.split("\n").slice(0,304);;
	if (!--csvLoadsRemaining) initializePlotPlot();
    });
};

function initializePlotPlot() {

    classColor.domain([cities.length,1]);
    
    hedotools.sankey.setSideWidth([100,100]).setfigure(d3.select("#sankeyChart")).setdata(ref,comp,cities).setTipOn().plot().setTitles(['2011','2012']);
    
    // set the figure initially
    hedotools.shifter.setfigure(d3.select('#shift')).setHeight(400);
    var ignoreWords = ["severe","flood","warning","earthquake","hi","me","new","humidity","pressure","burns","emergency","in","la","ms","mt","oh","ok","or","pa","ma","hawaii","virginia","grand","springs","falls","battle","old","miami"];
    hedotools.shifter.ignore(ignoreWords);

    var popupshiftct = 4;
    // check if going to pop up an shift

    console.log("popping up shift");
    var refyear = refshifttimedecoder().cached;
    var refname = refshiftcitydecoder().cached;
    var compyear = compshifttimedecoder().cached;
    var compname = compshiftcitydecoder().cached;
    // write a function to call on the load
    drawShift = function() {
	hedotools.shifter._refF(refF);
	hedotools.shifter._compF(compF);
	hedotools.shifter.stop();
	hedotools.shifter.shifter();
	hedotools.shifter.setText("Why "+compname+" in "+compyear+" is "+( ( hedotools.shifter._compH() > hedotools.shifter._refH() ) ? "happier" : "less happy" )+" than "+refname+" in "+refyear+":").plot();
	$('#myModal').modal('show');
    }
    // load both of the files
    var csvLoadsRemaining = 2;
    var reffile = "http://hedonometer.org/data/cities/word-vectors/"+refyear+"/"+refname+".csv";
    if (parseInt(refyear) < 2014) reffile+=".new"
    var compfile = "http://hedonometer.org/data/cities/word-vectors/"+compyear+"/"+compname+".csv";
    if (parseInt(compyear) < 2014) compfile+=".new"
    console.log(reffile);
    console.log(compfile);
    var refF;
    var compF;
    if ( refshifttimedecoder().cached.length > 0) {
	d3.text(reffile,function(text) {
	    refF = text.split(",");
	    console.log(refF);
	    if (!--popupshiftct) drawShift();
	});
	d3.text(compfile,function(text) {
	    compF = text.split(",");
	    console.log(compF);
	    if (!--popupshiftct) drawShift();
	});
    }

    // set some data
    var scoresFile = "http://hedonometer.org/data/labMT/labMTscores-english.csv";
    var wordsFile = "http://hedonometer.org/data/labMT/labMTwords-english.csv";
    d3.text(scoresFile, function(text) {
	var tmp = text.split("\n");
	console.log("loaded words");
	//console.log(tmp[tmp.length-1]);
	var lens = tmp.map(function(d) { return parseFloat(d); });
	var len = lens.length - 1;
	while (!lens[len]) {
	    //console.log("in while loop");
	    lens = lens.slice(0, len);
	    len--;
	}
	hedotools.shifter._lens(lens);
	if (!--popupshiftct) drawShift();
    });
    d3.text(wordsFile, function(text) {
	var tmp = text.split("\n");
	var words = tmp;
	var len = words.length - 1;
	while (!words[len]) {
	    //console.log("in while loop");
	    words = words.slice(0, len);
	    len--;
	}
	hedotools.shifter._words(words);
	if (!--popupshiftct) drawShift();
    });
};

initializePlot();



