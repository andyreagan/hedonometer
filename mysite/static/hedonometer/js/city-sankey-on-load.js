hedotools.sankeyoncall = function() { 
    var test = function(i,data) {
	console.log("set on call");
    }
    var opublic = { test: test, };
    return opublic;
}();

var intStr = ["one","two"];
var timeFrames= ["2011","2012","2013","2014"];

reftimeselencoder = d3.urllib.encoder().varname("ref");
reftimeseldecoder = d3.urllib.decoder().varname("ref").varresult("2011");
d3.select(".reftimelabel").html("All tweets from "+reftimeseldecoder().cached+' <span class="caret"></span>');
d3.select(".reftimelabelbottom").html("All tweets from "+reftimeseldecoder().cached+' <span class="caret"></span>');

comptimeselencoder = d3.urllib.encoder().varname("comp");
comptimeseldecoder = d3.urllib.decoder().varname("comp").varresult("2012");
d3.select(".comptimelabel").html("All tweets from "+comptimeseldecoder().cached+' <span class="caret"></span>');
d3.select(".comptimelabelbottom").html("All tweets from "+comptimeseldecoder().cached+' <span class="caret"></span>');

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
	    d3.text("/data/cities/cityList_"+(reftimeseldecoder().cached)+"_mutualHapps.csv", function(text) {
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
	    d3.text("/data/cities/cityList_"+(comptimeseldecoder().cached)+"_mutualHapps.csv", function(text) {
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
	    d3.text("/data/cities/cityList_"+(reftimeseldecoder().cached)+"_mutualHapps.csv", function(text) {
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
	    d3.text("/data/cities/cityList_"+(comptimeseldecoder().cached)+"_mutualHapps.csv", function(text) {
		comp = text.split("\n").slice(0,304);
		hedotools.sankey.setdata(ref,comp,cities).replot();
	    });
	});
}

function loadCsv() {
    var csvLoadsRemaining = 3;
    d3.text("/data/cities/cityList_"+(reftimeseldecoder().cached)+"_mutualHapps.csv", function(text) {
	ref = text.split("\n").slice(0,304);
	if (!--csvLoadsRemaining) initializePlotPlot();
    });
    d3.text("/data/cities/cityList_"+(comptimeseldecoder().cached)+"_mutualHapps.csv", function(text) {
	comp = text.split("\n").slice(0,304);;
	if (!--csvLoadsRemaining) initializePlotPlot();
    });
    d3.text("/data/cities/mutualCities.csv", function(text) {
	cities = text.split("\n").slice(0,304);;
	if (!--csvLoadsRemaining) initializePlotPlot();
    });
};

function initializePlotPlot() {

    classColor.domain([cities.length,1]);
    
    hedotools.sankey.setSideWidth([100,100]).setfigure(d3.select("#sankeyChart")).setdata(ref,comp,cities).setTipOn().plot().setTitles(['2011','2012']);
    
    // set the figure initially
    hedotools.shifter.setfigure(d3.select('#shift')).setHeight(400);
    var ignoreWords = ["severe","flood","warning","earthquake","hi","me","new","humidity","pressure","burns","emergency","in","la","ms","mt","oh","ok","or","pa","ma","hawaii","virginia","grand","springs","falls",];
    hedotools.shifter.ignore(ignoreWords);
    // set some data
    var scoresFile = "/data/labMT/labMTscores-english.csv";
    var wordsFile = "/data/labMT/labMTwords-english.csv";
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
    });
};

initializePlot();



