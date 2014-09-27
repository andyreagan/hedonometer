hedotools.barchartoncall = function() {
    var test = function(d,i) {
	if (stateSelType) {
	    shiftComp = i;
	    d3.select(".complabel").text(cityListSorted[i]);
	    compencoder.varval(cityListSorted[i]);
	}
	else {
	    shiftRef = i;
	    d3.select(".reflabel").text(cityListSorted[i]);
	    refencoder.varval(cityListSorted[i]);
	}
	if (shiftRef !== shiftComp) {
	    drawTheFreakingShift();
	}
    }
    var opublic = { test: test,
		  };
    return opublic;
}();

var stateSelType = true;

d3.selectAll(".selbutton").data([false,true]).on("mousedown",function(d,i) { 
    	    if (stateSelType !== d) {
		stateSelType = d;
		d3.select(".selbutton.one").attr("class","btn btn-default btn-xs pull-right selbutton one")
		d3.select(".selbutton.two").attr("class","btn btn-default btn-xs pull-right selbutton two")
		d3.select(this).attr("class",d3.select(this).attr("class").replace("default","primary"));
	    } } );

var timeselencoder = d3.urllib.encoder().varname("time");
var timeseldecoder = d3.urllib.decoder().varname("time").varresult("2014");

function initializePlot() {
    timeDrop();
    // console.log(timeseldecoder().cached);
    var timeF = timeseldecoder().cached.replace(/\+/g,' ');
    // console.log(timeF);
    d3.select(".timelabel").text(timeF);
    for (var i=0; i<timeFrames.length; i++) { 
	if (timeF === timeFrameText[i]) {
	    timeF = timeFrames[i];
	    break;
	}
    }
    loadCsv(timeF);
}

function cityIndex(name) {
    var found = false;
    for (var i=0; i<cityList.length; i++) {
	if (cityList[i] === name) {
	    found = true;
	    return i;
	}
    }
    if (!found) {
	return -1;
    }
}

var refencoder = d3.urllib.encoder().varname("ref");
var refdecoder = d3.urllib.decoder().varname("ref").varresult("US");

var compencoder = d3.urllib.encoder().varname("comp");
var compdecoder = d3.urllib.decoder().varname("comp").varresult("Boulder, CO");

// need to get these from the state name in the browser
// var shiftRef = cityIndex(refdecoder().cached);
// var shiftComp = cityIndex(compdecoder().cached);
var shiftRef = 0;
var shiftComp = 50;

d3.select(".reflabel").text(refdecoder().cached);
d3.select(".complabel").text(compdecoder().cached);

// not worrying about this yet
shiftselencoder = d3.urllib.encoder().varname("selection"); //.varval(lensExtent);
shiftseldecoder = d3.urllib.decoder().varname("selection").varresult("none"); //.varval(lensExtent);

// var timeFrames = ["2014","2013","2012","2011"];
var timeFrames = ["2014","2013","2012"];
var timeFrameText = timeFrames;

var refcompdrops = function() {
    d3.select("#compSelect").selectAll("a")
        .on("click", function(d,i) {
	    shiftComp = cityIndex(cityListSortedUSFirst[i]);
	    d3.select(".complabel").text(cityListSortedUSFirst[i]);
	    compencoder.varval(cityListSortedUSFirst[i]);
	    if (shiftRef !== shiftComp) {
		drawTheFreakingShift();
	    }
	});
    d3.select("#refSelect").selectAll("a")
        .on("click", function(d,i) {
	    // console.log(i);
	    shiftRef = cityIndex(cityListSortedUSFirst[i]);
	    d3.select(".reflabel").text(cityListSortedUSFirst[i]);
	    refencoder.varval(cityListSortedUSFirst[i]);
	    if (shiftRef !== shiftComp) {
		drawTheFreakingShift();
	    }
	});
    d3.select("#rotate")
        .on("click", function(d,i) {
	    var tmp = shiftComp;
	    shiftComp = shiftRef;
	    shiftRef = tmp;
	    var tmp = d3.select(".complabel").text();
	    d3.select(".complabel").text(d3.select(".reflabel").text());
	    d3.select(".reflabel").text(tmp);
	    refencoder.varval(cityList[shiftRef]);
	    compencoder.varval(cityList[shiftComp]);
	    if (shiftRef !== shiftComp) {
		drawTheFreakingShift();
	    }
	});
}

var timeDrop = function() {
    d3.select("#timeSelect").selectAll("a")
        .on("click", function(d,i) {
	    key = i;
            timeName = timeFrames[key];
	    d3.select(".timelabel").text(timeFrameText[key]);
	    timeselencoder.varval(timeFrameText[key]);
	    // console.log(timeName);
            loadCsv(timeName); 
	});
}

var lens;
var words;
var cityList;
var cityListSorted;
var cityListSortedUSFirst;
var cityHappsList;

function loadCsv(time) {
    var shiftLoadsRemaining = 2;
    var listLoadsRemaining = 2;
    var allLoadsRemaining = listLoadsRemaining+shiftLoadsRemaining;
    var scoresFile = "http://hedonometer.org/data/labMT/labMTscores-english.csv";
    var wordsFile = "http://hedonometer.org/data/labMT/labMTwords-english.csv";
    d3.text(scoresFile, function(text) {
	var tmp = text.split("\n");
	lens = tmp.map(parseFloat);
	var len = lens.length - 1;
	while (!lens[len]) {
	    lens = lens.slice(0, len);
	    len--;
	}
	hedotools.shifter._lens(lens);
	if (!--allLoadsRemaining) initializeBoth();
    });
    d3.text(wordsFile, function(text) {
	var tmp = text.split("\n");
	words = tmp;
	var len = words.length - 1;
	while (!words[len]) {
	    words = words.slice(0, len);
	    len--;
	}
	hedotools.shifter._words(words);
	if (!--allLoadsRemaining) initializeBoth();
    });
    d3.text("http://hedonometer.org/data/cities/cityList_"+(timeseldecoder().cached)+"_PLOSHapps.csv", function(text) {
	cityHappsList = text.split("\n").slice(0,304).map(parseFloat);
	if (!--allLoadsRemaining) initializeBoth();
    });
    d3.text("http://hedonometer.org/data/cities/mutualCities.csv", function(text) {
	cityList = text.split("\n").slice(0,304);
	classColor.domain([cityList.length,1]);
	if (!--allLoadsRemaining) initializeBoth();
    });
};

var initializeBoth = function() { 
    initializeList();
    initializeShift();
};

var initializeList = function() {
    // compute the shift initially
    // var shiftObj = hedotools.shifter.shift(allData[shiftRef].freq,allData[shiftComp].freq,lens,words);
    // shiftObj.setfigure(d3.select('#shift01')).plot();

    cityHappsListNorm = Array(cityHappsList.length);
    for (var i=0; i<cityHappsList.length; i++) {
	cityHappsListNorm[i] = cityHappsList[i]-d3.mean(cityHappsList);
    }

    hedotools.barchart.setfigure(d3.select("#barChart"))._data(cityHappsListNorm)._datanames(cityList)._figheight(4200).plot();

    cityListSorted = hedotools.barchart.getSorted(false);
    cityListSortedUSFirst = ["US"].concat(hedotools.barchart.getSorted(false));

    var refListDrop = d3.select("#refSelect").select("ul").selectAll("li").data(["US"].concat(hedotools.barchart.getSorted(true)));
    refListDrop.enter().append("li").append("a").text(function(d,i) { return d; });
    var compListDrop = d3.select("#compSelect").select("ul").selectAll("li").data(["US"].concat(hedotools.barchart.getSorted(true)));
    compListDrop.enter().append("li").append("a").text(function(d,i) { return d; });

    refcompdrops();
};

var initializeShift = function() {
    var ignoreWords = ["nigga", "niggas", "niggaz", "nigger","thirsty","pakistan","india", "severe", "flood", "warning", "earthquake", "humidity", "pressure", "burns", "emergency", "grand", "springs", "falls", "battle", "old", "miami","pearl", "santa", "atlantic", "grand", "green", "falls", "lake", "haven", "sin", "con", "war","mercy","gren","beach","bills","health","springfield","falling","international","terminal","mad", "al","ak","az","ar","ca","co","ct","de","fl","ga","hi","id","il","in","ia","ks","ky","la","me","md","ma","mi","mn","ms","mo","mt","ne","nv","nh","nj","nm","ny","nc","nd","oh","ok","or","pa","ri","sc","sd","tn","tx","ut","vt","va","wa","wv","wi","wy", "alabama", "alaska", "arizona", "arkansas", "california", "colorado", "connecticut", "delaware", "florida", "georgia", "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana", "maine", "maryland", "massachusetts", "michigan", "minnesota", "mississippi", "missouri", "montana", "nebraska", "nevada", "new", "hampshire", "jersey", "mexico", "york", "north", "carolina", "dakota", "ohio", "oklahoma", "oregon", "pennsylvania", "rhode", "island", "south", "carolina", "dakota", "tennessee", "texas", "utah", "vermont", "virginia", "washington", "west", "virginia", "wisconsin",];

    hedotools.shifter.ignore(ignoreWords);
    hedotools.shifter.setfigure(d3.select('#shift01'));
    shiftRef = cityIndex(refdecoder().cached);
    shiftComp = cityIndex(compdecoder().cached);

    drawTheFreakingShift();
};

var drawTheFreakingShift = function() {
    var year = timeseldecoder().cached;
    var refyear = year;
    var refname = refdecoder().cached;
    var compyear = year;
    var compname = compdecoder().cached;

    // write a function to call on the load
    var drawShift = function() {
	hedotools.shifter._refF(refF);
	hedotools.shifter._compF(compF);
	hedotools.shifter.stop();
	hedotools.shifter.shifter();
	hedotools.shifter.setText("Why "+compname+" in "+compyear+" is "+( ( hedotools.shifter._compH() > hedotools.shifter._refH() ) ? "happier" : "less happy" )+" than "+refname+" in "+refyear+":").plot();
    }

    // load both of the files
    var finalLoadsRemaining = 2;
    var reffile = "http://hedonometer.org/data/cities/word-vectors/"+refyear+"/"+refname+".csv";
    if (parseInt(refyear) < 2014) reffile+=".new"
    var compfile = "http://hedonometer.org/data/cities/word-vectors/"+compyear+"/"+compname+".csv";
    if (parseInt(compyear) < 2014) compfile+=".new"

    // console.log(reffile);
    // console.log(compfile);

    var refF;
    var compF;

    d3.text(reffile,function(text) {
	refF = text.split(",");
	// console.log(refF);
	if (!--finalLoadsRemaining) drawShift();
    });
    d3.text(compfile,function(text) {
	compF = text.split(",");
	// console.log(compF);
	if (!--finalLoadsRemaining) drawShift();
    });
}

initializePlot();



