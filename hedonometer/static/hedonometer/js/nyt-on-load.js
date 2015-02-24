// we need a decent amount of documentation here!
// or any
// there are a bunch of global variables so I'm going to put them all here:
var selType = true;

var refencoder = d3.urllib.encoder().varname("ref");
var refdecoder = d3.urllib.decoder().varname("ref").varresult("All");

var compencoder = d3.urllib.encoder().varname("comp");
var compdecoder = d3.urllib.decoder().varname("comp").varresult("Science");

var shiftRef = 0;
var shiftComp = 10;

var lens;
var words;
var sectionList;
var sectionListWAllFirst;
var allEntry;

// here is a short list of the functions and what they do
//
// external:
//
// hedotools.barchart()
//   -draws the bar chart
//   -has the override for the hover behaivor hedotools.barchartoncall
//
// ---------------------------------------------------------
// internal:
//
// hedotools.barchartoncall()
//   -overrides the hover callback for the barchart
// 
// sectionIndex(name)
//   -given the genre, returns the index in sectionListWAllFirst
//
// refcompdrops()
//   -initialize the drop downs with genre's from sectionListWAllFirst
//
// loadCsv()
//   -loads all four CSV files to start the thing
// 
// initializeBoth()
//   -calls the next two initialize functions
// 
// initializeList()
// 
// initializeShift()
//   -grabs the shift vectors and draws the first shift
// 
// drawShift()
//   -draws this shift
//
// initializePlot()
//   -starts the whole cascade...

hedotools.barchartoncall = function() {
    var test = function(d,i) {
	if (selType) {
	    shiftComp = i+1;
	    d3.select(".complabel").text(sectionList[i].genre);
	    compencoder.varval(sectionList[i].genre);
	}
	else {
	    shiftRef = i+1;
	    d3.select(".reflabel").text(sectionList[i].genre);
	    refencoder.varval(sectionList[i].genre);
	}
	if (shiftRef !== shiftComp) {
	    drawShift();
	}
    }
    var opublic = { test: test,
		  };
    return opublic;
}();



function sectionIndex(name) {
    var found = false;
    for (var i=0; i<sectionListWAllFirst.length; i++) {
	if (sectionListWAllFirst[i].genre.toLowerCase() === name.toLowerCase()) {
	    found = true;
	    return i;
	}
    }
    if (!found) {
	return -1;
    }
}

var refcompdrops = function() {
    d3.select("#compSelect").selectAll("a")
        .on("click", function(d,i) {
	    shiftComp = sectionIndex(sectionListWAllFirst[i].genre);
	    d3.select(".complabel").text(sectionListWAllFirst[i].genre);
	    compencoder.varval(sectionListWAllFirst[i].genre);
	    if (shiftRef !== shiftComp) {
		drawShift();
	    }
	});
    d3.select("#refSelect").selectAll("a")
        .on("click", function(d,i) {
	    // console.log(i);
	    shiftRef = sectionIndex(sectionListWAllFirst[i].genre);
	    d3.select(".reflabel").text(sectionListWAllFirst[i].genre);
	    refencoder.varval(sectionListWAllFirst[i].genre);
	    if (shiftRef !== shiftComp) {
		drawShift();
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
	    refencoder.varval(sectionList[shiftRef].genre);
	    compencoder.varval(sectionList[shiftComp].genre);
	    if (shiftRef !== shiftComp) {
		drawShift();
	    }
	});
}

function loadCsv() {
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
    d3.json("http://hedonometer.org/api/v1/nyt/?format=json", function(json) {
	sectionList = json.objects;
	if (!--allLoadsRemaining) initializeBoth();
    });
    d3.json("http://hedonometer.org/api/v1/nytall/?format=json&genre=All", function(json) {
	allEntry = json.objects;
	if (!--allLoadsRemaining) initializeBoth();
    });
};

var initializeBoth = function() { 
    initializeList();
    initializeShift();
};

var initializeList = function() {
    sectionListWAllFirst = allEntry.concat(sectionList);
    var happslist = sectionList.map(function(d) { return parseFloat(d.happiness)-parseFloat(allEntry[0].happiness); });
    var titlelist = sectionList.map(function(d) { return d.genre; });

    classColor.domain([happslist.length,1]);

    hedotools.barchart.setfigure(d3.select("#barChart"))
        // ._xlabeltext("Happiness Difference from all of NYT (h<sub>avg</sub> = 6.00)")
        ._xlabeltext("Happiness Difference from all of NYT (h = 6.00)")
	._data(happslist)
	._datanames(titlelist)
	._figheight(500)
	.plot();

    var refListDrop = d3.select("#refSelect").select("ul").selectAll("li").data(sectionListWAllFirst);
    refListDrop.enter().append("li").append("a").text(function(d,i) { return d.genre; });
    var compListDrop = d3.select("#compSelect").select("ul").selectAll("li").data(sectionListWAllFirst);
    compListDrop.enter().append("li").append("a").text(function(d,i) { return d.genre; });

    refcompdrops();
};

var initializeShift = function() {
    // hedotools.shifter.ignore(ignoreWords);
    hedotools.shifter.setfigure(d3.select('#shift01'));
    // get the indices from the url decoders
    shiftComp = sectionIndex(compdecoder().cached);
    shiftRef = sectionIndex(refdecoder().cached);
    
    drawShift();
};

var drawShift = function() {
    // write a function to call on the load
    var drawShiftInternal = function() {
	hedotools.shifter._refF(refF);
	hedotools.shifter._compF(compF);
	hedotools.shifter.stop();
	hedotools.shifter.shifter();
	if ((shiftComp > 0) && (shiftRef > 0)) {
	    hedotools.shifter.setText(["Why the "+sectionListWAllFirst[shiftComp].genre+" section is "+( ( hedotools.shifter._compH() > hedotools.shifter._refH() ) ? "happier" : "less happy" )+" than the "+sectionListWAllFirst[shiftRef].genre+" section:"]).plot();
	}
	else {
	    if (shiftComp === 0) {
		hedotools.shifter.setText(["Why the NYT as a whole is "+( ( hedotools.shifter._compH() > hedotools.shifter._refH() ) ? "happier" : "less happy" )+" than the "+sectionListWAllFirst[shiftRef].genre+" section:"]).plot();
	    }
	    else {
		hedotools.shifter.setText(["Why the "+sectionListWAllFirst[shiftComp].genre+" section is "+( ( hedotools.shifter._compH() > hedotools.shifter._refH() ) ? "happier" : "less happy" )+" than the NYT as a whole:"]).plot();
	    }
	}
    }

    // load both of the files
    var finalLoadsRemaining = 2;
    var refFile = "http://hedonometer.org/data/NYT/NYT_labVecs/"+sectionListWAllFirst[shiftRef].filename+".stripped.indexed";
    var compFile = "http://hedonometer.org/data/NYT/NYT_labVecs/"+sectionListWAllFirst[shiftComp].filename+".stripped.indexed";

    var refF;
    var compF;

    d3.select("#embedtextarea").html("<iframe src=\"http://hedonometer.org/embed/nyt/"+sectionListWAllFirst[shiftRef].genre+"/"+sectionListWAllFirst[shiftComp].genre+"/\" width=\"590\" height=\"800\" frameborder=\"0\" scrolling=\"no\"></iframe>");

    d3.text(refFile,function(text) {
	refF = text.split("\n");
	console.log(refF);
	if (!--finalLoadsRemaining) drawShiftInternal();
    });
    d3.text(compFile,function(text) {
	compF = text.split("\n");
	if (!--finalLoadsRemaining) drawShiftInternal();
    });
}

function initializePlot() {


    d3.select(".reflabel").text(refdecoder().cached);
    d3.select(".complabel").text(compdecoder().cached);

    d3.selectAll(".selbutton").data([false,true]).on("mousedown",function(d,i) { 
	if (selType !== d) {
	    selType = d;
	    d3.select(".selbutton.one").attr("class","btn btn-default btn-xs pull-right selbutton one")
	    d3.select(".selbutton.two").attr("class","btn btn-default btn-xs pull-right selbutton two")
	    d3.select(this).attr("class",d3.select(this).attr("class").replace("default","primary"));
	}
    });

    refcompdrops();

    loadCsv();
}

initializePlot();



