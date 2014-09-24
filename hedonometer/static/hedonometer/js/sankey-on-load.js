// override the lensoncall module
hedotools.lensoncall = function() { 
    var test = function() {
	// reset
	console.log(lensExtent);
	console.log(ignoreWords);
	for (var j=0; j<allData.length; j++) {
	    for (var i=0; i<allData[j].rawFreq.length; i++) {
		var include = true;
		// check if in removed word list
		for (var k=0; k<ignoreWords.length; k++) {
		    if (ignoreWords[k] == words[i]) {
			include = false;
			//console.log("ignored "+ignoreWords[k]);
		    }
		}
		// check if underneath lens cover
		if (lens[i] >= lensExtent[0] && lens[i] <= lensExtent[1]) {
		    include = false;
		}
		// include it, or set to 0
		if (include) {
		    allData[j].freq[i] = allData[j].rawFreq[i];
		    allDataOld[j].freq[i] = allDataOld[j].rawFreq[i];
		}
		else { 
		    allData[j].freq[i] = 0;
		    allDataOld[j].freq[i] = 0;
		}
		
	    }
	}

	hedotools.computeHapps.go();

	stateHappsList = Array(51);
	for (var i=0; i<stateHappsList.length; i++) {
	    stateHappsList[i] = allData[i].avhapps;
	}

	// this is computeHapps() with allData -> allDataOld
	for (var j=0; j<52; j++) {
	    // compute total frequency
	    var N = 0.0;
	    for (var i=0; i<allDataOld[j].freq.length; i++) {
		N += parseFloat(allDataOld[j].freq[i]);
	    }
	    var happs = 0.0;
	    for (var i=0; i<allDataOld[j].freq.length; i++) {
		happs += parseFloat(allDataOld[j].freq[i])*parseFloat(lens[i]);
	    }
	    allDataOld[j].avhapps = happs/N;
	}

	stateHappsListOld = Array(51);
	for (var i=0; i<stateHappsListOld.length; i++) {
	    stateHappsListOld[i] = allDataOld[i].avhapps;
	}

	// replotting the sankey
	console.log("replotting sankey");
	hedotools.sankey.setdata(stateHappsListOld,stateHappsList,allStateNames.slice(0,51)).replot();

	// compute the shift initially
	// use the top state from the new time
	var shiftObj = hedotools.shifter.shift(allDataOld[hedotools.sankey.newindices()[0]].freq,allData[hedotools.sankey.newindices()[0]].freq,lens,words);
	shiftObj.setfigure(d3.select('#shift01')).setText("Why "+allDataOld[hedotools.sankey.newindices()[0]].name+" has become "+"happier"+":").plot();

    }
    var opublic = { test: test, };
    return opublic;
}();

var intStr = ["one","two"];

var stateSelType = true;
// true corresponds to comparison selection
// false corresponds to reference selection
var activeHover = true;
// until a selection is fixed, let this be true

d3.selectAll(".selbutton").data([false,true]).on("mousedown",function(d,i) { 
    	    if (stateSelType !== d) {
		stateSelType = d;
		activeHover = true;
		d3.selectAll(".state").attr("stroke-width",0.7);
		d3.selectAll("text.seltext").attr("fill","black")
		d3.select("text.seltext."+intStr[i]).attr("fill","white")
		d3.selectAll("rect.colorclick").attr("fill","#F8F8F8").attr("stroke","rgb(0,0,0)")
		d3.select("rect.colorclick."+intStr[i]).attr("fill","#428bca").attr("stroke","#428bca");  
		d3.select(".selbutton.one").attr("class","btn btn-default btn-xs pull-right selbutton one")
		d3.select(".selbutton.two").attr("class","btn btn-default btn-xs pull-right selbutton two")
		d3.select(this).attr("class",d3.select(this).attr("class").replace("default","primary"));
	    } } );

timeselencoder = d3.urllib.encoder().varname("time"); //.varval(lensExtent);
timeseldecoder = d3.urllib.decoder().varname("time").varresult("Last 30 Days"); //.varval(lensExtent);


function initializePlot() {
    // timeDrop();
    // refcompdrops();
    console.log(timeseldecoder().cached);
    var timeF = timeseldecoder().cached.replace(/\+/g,' ');
    console.log(timeF);
    d3.select(".timelabel").text(timeF);
    for (var i=0; i<timeFrames.length; i++) { 
	if (timeF === timeFrameText[i]) {
	    timeF = timeFrames[i];
	    break;
	}
    }
    loadCsv(timeF);
}

var allStateNames = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut"
		 ,"Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana"
		 ,"Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska"
		 ,"Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio"
		 ,"Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee"
		 ,"Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","DC","U.S. as a whole"];

var allStateNamesUSFirst = ["U.S. as a whole","Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut"
		 ,"Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana"
		 ,"Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska"
		 ,"Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio"
		 ,"Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee"
		 ,"Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","DC",];

function stateIndex(name) {
    var found = false;
    for (var i=0; i<allStateNames.length; i++) {
	if (allStateNames[i] === name) {
	    found = true;
	    return i;
	}
    }
    if (!found) {
	return -1;
    }
}

ignoreWords = ["severe","flood","warning","earthquake","nigga","niggas","niggaz","hi","me","new","humidity","pressure","burns","emergency","in","la","ms","mt","oh","ok","or","pa","hawaii","virginia","grand","springs","falls",];

var refencoder = d3.urllib.encoder().varname("ref"), //.varval(lensExtent);
refdecoder = d3.urllib.decoder().varname("ref").varresult(allStateNames[51]); //.varval(lensExtent);

var compencoder = d3.urllib.encoder().varname("comp"), //.varval(lensExtent);
compdecoder = d3.urllib.decoder().varname("comp").varresult(allStateNames[0]); //.varval(lensExtent); 

// need to get these from the state name in the browser
var shiftRef = stateIndex(refdecoder().cached),
shiftComp = stateIndex(compdecoder().cached);

d3.select(".reflabel").text(refdecoder().cached);
d3.select(".complabel").text(compdecoder().cached);

var refListDrop = d3.select("#refSelect").select("ul").selectAll("li").data(allStateNamesUSFirst);
refListDrop.enter().append("li").append("a").text(function(d,i) { return d; });
var compListDrop = d3.select("#compSelect").select("ul").selectAll("li").data(allStateNamesUSFirst);
compListDrop.enter().append("li").append("a").text(function(d,i) { return d; });

// not worrying about this yet
shiftselencoder = d3.urllib.encoder().varname("selection"); //.varval(lensExtent);
shiftseldecoder = d3.urllib.decoder().varname("selection").varresult("none"); //.varval(lensExtent);

timeFrames = ["lastquarter","lastmonth","lastweek"];
timeFrameText = ["Last 90 Days","Last 30 Days","Last 7 Days"];

function timeDrop() {
    d3.select("#timeSelect").selectAll("a")
        .on("click", function(d,i) {
            // key = this.selectedIndex;
	    key = i;
            timeName = timeFrames[key];
	    d3.select(".timelabel").text(timeFrameText[key]);
	    timeselencoder.varval(timeFrameText[key]);
	    console.log(timeName);
            loadCsv(timeName); 
	});
}

function loadCsv(time) {
    var csvLoadsRemaining = 4;
    // load labMT files
    var scoresFile = "http://hedonometer.org/data/labMT/labMTscores-english.csv";
    var wordsFile = "http://hedonometer.org/data/labMT/labMTwords-english.csv";
    d3.text(scoresFile, function(text) {
	var tmp = text.split("\n");
	//console.log(tmp.length);
	//console.log(tmp[tmp.length-1]);
	lens = tmp.map(function(d) { return parseFloat(d); });
	var len = lens.length - 1;
	while (!lens[len]) {
	    //console.log("in while loop");
	    lens = lens.slice(0, len);
	    len--;
	}
	if (!--csvLoadsRemaining) initializePlotPlot(lens,words);
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
	if (!--csvLoadsRemaining) initializePlotPlot(lens,words);
    });
    d3.json("http://hedonometer.org/data/geodata/us-states.topojson", function(data) {
	geoJson = data;
	stateFeatures = topojson.feature(geoJson,geoJson.objects.states).features;
	if (!--csvLoadsRemaining) initializePlotPlot(lens,words);
    });
    // trying to load from a new format for the more recent tweets
    // d3.text("http://hedonometer.org/data/geodata/wordCounts"+(time)+".csv", function(text) {
    var time = "2014-08-25-week"
    d3.text("http://hedonometer.org/data/geodata/combined-word-vectors/"+(time)+".csv", function(text) {
	tmp = text.split("\n");
	allData = Array(52);
	for (var i=0; i<51; i++) {
	    allData[i] = {name: allStateNames[i],
			  rawFreq: tmp[i].split(",").map(parseFloat),
			  freq: tmp[i].split(",") };
	}
	// initialize the all data
	allData[51] = {name: allStateNames[51],
		       rawFreq: Array(allData[0].freq.length),
		       freq: Array(allData[0].freq.length),};
	for (var j=0; j<allData[0].freq.length; j++) {
	    allData[51].rawFreq[j] = 0.0;
	}
	for (var i=0; i<51; i++) {
	    for (var j=0; j<allData[0].freq.length; j++) {
		allData[51].rawFreq[j] += parseFloat(allData[i].rawFreq[j]);
	    }
	}
	if (!--csvLoadsRemaining) initializePlotPlot(lens,words);
    });
};

function initializePlotPlot(lens,words) {
    // draw the lens
    hedotools.lens.setfigure(d3.select("#lens01")).setdata(lens).plot();



    // randomHapps = stateHappsList.map(function(d) { return d+(Math.random()-0.5)/5; } )

    // the previous week
    var time = "2014-08-18-week"
    d3.text("http://hedonometer.org/data/geodata/combined-word-vectors/"+(time)+".csv", function(text) {

	var tmp = text.split("\n");
	allDataOld = Array(52);
	for (var i=0; i<51; i++) {
	    allDataOld[i] = {name: allStateNames[i],
			  rawFreq: tmp[i].split(",").map(parseFloat),
			  freq: tmp[i].split(",")};
	}
	// initialize the all data
	allDataOld[51] = {name: allStateNames[51],
		       rawFreq: Array(allDataOld[0].freq.length),
		       freq: Array(allDataOld[0].freq.length),};
	for (var j=0; j<allDataOld[0].freq.length; j++) {
	    allDataOld[51].rawFreq[j] = 0.0;
	}
	for (var i=0; i<51; i++) {
	    for (var j=0; j<allDataOld[0].freq.length; j++) {
		allDataOld[51].rawFreq[j] += parseFloat(allDataOld[i].rawFreq[j]);
	    }
	}

	for (var j=0; j<allData.length; j++) {
	    for (var i=0; i<allData[j].rawFreq.length; i++) {
		var include = true;
		// check if in removed word list
		for (var k=0; k<ignoreWords.length; k++) {
		    if (ignoreWords[k] == words[i]) {
			include = false;
			//console.log("ignored "+ignoreWords[k]);
		    }
		}
		// check if underneath lens cover
		if (lens[i] >= lensExtent[0] && lens[i] <= lensExtent[1]) {
		    include = false;
		}
		// include it, or set to 0
		if (include) {
		    allData[j].freq[i] = allData[j].rawFreq[i];
		    allDataOld[j].freq[i] = allDataOld[j].rawFreq[i];
		}
		else { 
		    allData[j].freq[i] = 0;
		    allDataOld[j].freq[i] = 0;
		}
		
	    }
	}

	hedotools.computeHapps.go();

	stateHappsList = Array(51);
	for (var i=0; i<stateHappsList.length; i++) {
	    stateHappsList[i] = allData[i].avhapps;
	}

	// this is computeHapps() with allData -> allDataOld
	for (var j=0; j<52; j++) {
	    // compute total frequency
	    var N = 0.0;
	    for (var i=0; i<allDataOld[j].freq.length; i++) {
		N += parseFloat(allDataOld[j].freq[i]);
	    }
	    var happs = 0.0;
	    for (var i=0; i<allDataOld[j].freq.length; i++) {
		happs += parseFloat(allDataOld[j].freq[i])*parseFloat(lens[i]);
	    }
	    allDataOld[j].avhapps = happs/N;
	}

	stateHappsListOld = Array(51);
	for (var i=0; i<stateHappsListOld.length; i++) {
	    stateHappsListOld[i] = allDataOld[i].avhapps;
	}

	hedotools.sankey.setfigure(d3.select("#sankeyChart")).setdata(stateHappsListOld,stateHappsList,allStateNames.slice(0,51)).plot();

	// // compute the shift initially
	// // use the top state from the new time
	var shiftObj = hedotools.shifter.shift(allDataOld[hedotools.sankey.newindices()[0]].freq,allData[hedotools.sankey.newindices()[0]].freq,lens,words);
	shiftObj.setfigure(d3.select('#shift01')).setHeight(400).setText("Why "+allDataOld[hedotools.sankey.newindices()[0]].name+" has become "+"happier"+":").plot();

    });
};

initializePlot();



