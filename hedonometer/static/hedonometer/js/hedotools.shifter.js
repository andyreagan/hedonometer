// current usage example:
// (from the sankey page)
//
// hedotools.shifter.shift(allDataOld[hedotools.sankey.newindices()[0]].freq,allData[hedotools.sankey.newindices()[0]].freq,lens,words);
// hedotools.shifter.setfigure(d3.select('#shift01')).setHeight(400).setText("Why "+allDataOld[hedotools.sankey.newindices()[0]].name+" has become "+"happier"+":").plot();
//
// there are two options for having it compute the shift
// calling the .shift() with four arguments does the trick
// or calling .shifter() with no arguments also does it
// for the latter, need to have defined the variables beforehand
// using the _lens, _words, etc accessors
//
// if the text isn't set, will attempt to grab it using the
// allData structure (which works in the maps.html)
//
// the text setting here removes all p instances in the figure,
// and then inserts a new one before the svg, inside the figure (using d3.insert)
//
// can also use the setText method to set the text
// need to do this outside of maps page

// define the shifter module 
hedotools.shifter = function()
{
    // for the word type selection
    var shiftselencoder = d3.urllib.encoder().varname("wordtypes");
    var shiftseldecoder = d3.urllib.decoder().varname("wordtypes").varresult("none");
    // initialize that we have't selected a shift
    var shiftTypeSelect = false;

    // set a special variable to make sure all necessary things
    // have been set before shifting
    // (this is a double check on the page loading)
    var loadsremaining = 4;

    // we'll use this thing
    var intStr = ["zero","one","two","three"];

    // will need a figure.
    // this needs to be set by setfigure() before plotting
    var figure = d3.select("body");

    var widthsetexplicitly = false;
    var setfigure = function(_) {
	// console.log("setting figure");
	figure = _;
	if (!widthsetexplicitly) {
	    grabwidth();
	}
	return hedotools.shifter;
    }

    // set the ones we can
    // since the height is fixed, do all that
    // but just initialize the width-related variables

    // full width and height. we'll draw the outer svg this big
    var fullwidth = 700;
    var fullheight = 500;

    var margin = {top: 0, right: 0, bottom: 0, left: 0};

    // the width and height that we're going to use
    var boxwidth = fullwidth-margin.left-margin.right;
    var boxheight = fullheight-margin.top-margin.bottom;

    // margin inside
    var axeslabelmargin = {top: 0, right: 0, bottom: 25, left: 20};
    
    // inner width and height
    // used for the axes
    var figwidth = boxwidth - axeslabelmargin.left - axeslabelmargin.right;
    var figheight = boxheight - axeslabelmargin.top - axeslabelmargin.bottom;
    var leftOffsetStatic = axeslabelmargin.left;

    // individual bar height, and number of words
    // need to be tuned to the height of the plot
    var iBarH = 11;
    var numWords = 28;
    
    // all inside the axes
    var yHeight = (7+17*3+14+5-13); // 101
    // where to draw the line below the summary bars
    var barHeight = (7+17*3+15-13); // 95
    var figcenter = figwidth/2;

    // pull the width, set the height fixed
    var grabwidth = function() {
	// console.log("setting width from figure");
	// console.log(parseInt(figure.style("width")));
	// use d3.min to set a max width of fullwidth
	fullwidth = d3.min([parseInt(figure.style("width")),fullwidth]);
	boxwidth = fullwidth-margin.left-margin.right;
	figwidth = boxwidth-axeslabelmargin.left-axeslabelmargin.right;
	figcenter = figwidth/2;
    }

    var setWidth = function(_) {
	if (!arguments.length) return fullwidth;
	widthsetexplicitly = true;
	fullwidth = _;
	boxwidth = fullwidth-margin.left-margin.right;
	figwidth = boxwidth-axeslabelmargin.left-axeslabelmargin.right;
	figcenter = figwidth/2;
    }

    // pull the width, set the height fixed
    var setHeight = function(_) {
	fullheight = _;
	boxheight = fullheight-margin.top-margin.bottom;
	figheight = boxheight - axeslabelmargin.top - axeslabelmargin.bottom;
	return hedotools.shifter;
    }

    // will be set by setdata() or shift() functions
    var sortedMag;
    var sortedType;
    var sortedWords;
    var sortedWordsEn;
    var sumTypes;
    var refH;
    var compH;

    var _sortedMag = function(_) {
	if (!arguments.length) return sortedMag;
	sortedMag = _;
	return hedotools.shifter;
    }
    var _sortedType = function(_) {
	if (!arguments.length) return sortedType;
	sortedType = _;
	return hedotools.shifter;
    }
    var _sortedWords = function(_) {
	if (!arguments.length) return sortedWords;
	sortedWords = _;
	return hedotools.shifter;
    }
    var _sortedWordsEn = function(_) {
	if (!arguments.length) return sortedWordsEn;
	sortedWordsEn = _;
	return hedotools.shifter;
    }
    var _sumTypes = function(_) {
	if (!arguments.length) return sumTypes;
	sumTypes = _;
	return hedotools.shifter;
    }
    var _refH = function(_) {
	if (!arguments.length) return refH;
	refH = _;
	return hedotools.shifter;
    }
    var _compH = function(_) {
	if (!arguments.length) return compH;
	compH = _;
	return hedotools.shifter;
    }

    var reset = true;
    var _reset = function(_) {
	if (!arguments.length) return reset;
	reset = _;
	return hedotools.shifter;
    }

    var setdata = function(a,b,c,d,e,f) {
	// console.log("setting data");
	sortedMag = a;
	sortedType = b;
	sortedWords = c;
	sumTypes = d;
	refH = e;
	compH = f;
	loadsremaining = 0;
	return hedotools.shifter;
    }

    var comparisonText = [""];

    var setText = function(_) {
	if (!arguments.length) return _;
	comparisonText = _;
	return hedotools.shifter;
    }

    var numwordstoplot = 200;

    var refF;
    var compF;
    var lens;
    var stoprange = [4,6];
    var words;
    var words_en;
    var translate = false;

    var _stoprange = function(_) {
	if (!arguments.length) return stoprange;
	stoprange = _;
	return hedotools.shifter;
    }

    var _refF = function(_) {
	if (!arguments.length) return refF;
	refF = _;
	loadsremaining--;
	return hedotools.shifter;
    }

    var _compF = function(_) {
	if (!arguments.length) return compF;
	compF = _;
	loadsremaining--;
	return hedotools.shifter;
    }

    var _lens = function(_) {
	if (!arguments.length) return lens;
	lens = _;
	loadsremaining--;
	return hedotools.shifter;
    }

    var _words = function(_) {
	if (!arguments.length) return words;
	words = _;
	loadsremaining--;
	return hedotools.shifter;
    }

    var _words_en = function(_) {
	if (!arguments.length) return words_en;
	words_en = _;
	translate = true;
	return hedotools.shifter;
    }

    var ignoreWords = ["nigga","niggas","niggaz","nigger"];

    var ignore = function(_) {
	if (!arguments.length) return ignoreWords;
	ignoreWords = ignoreWords.concat(_);
	// console.log(_);
	// console.log(ignoreWords);
	return hedotools.shifter;
    }

    var stop = function() {
	// first check if all the loads are done
	// WARNING
	// could not get this loop to stop!
	// even when the other variables are set
	// while (loadsremaining > 0) { console.log("waiting"); };
	for (var i=0; i<lens.length; i++) {
	    var include = true;
	    // check if in removed word list
	    for (var k=0; k<ignoreWords.length; k++) {
		if (ignoreWords[k] == words[i]) {
		    include = false;
		}
	    }
	    // check if underneath lens cover
	    if (lens[i] > stoprange[0] && lens[i] < stoprange[1]) {
		include = false;
	    }
	    // include it, or set to 0
	    if (!include) {
		refF[i] = 0;
		compF[i] = 0;
	    }
	}
	return hedotools.shifter;
    }

    // stop an individual vector
    var istopper = function(fvec) {
	for (var i=0; i<lens.length; i++) {
	    var include = true;
	    // check if in removed word list
	    for (var k=0; k<ignoreWords.length; k++) {
		if (ignoreWords[k] == words[i]) {
		    include = false;
		}
	    }
	    // check if underneath lens cover
	    if (lens[i] > stoprange[0] && lens[i] < stoprange[1]) {
		include = false;
	    }
	    // include it, or set to 0
	    if (!include) {
		fvec[i] = 0;
	    }
	}
	return fvec;
    }
    
    var shift = function(a,b,c,d) {
	refF = a;
	compF = b;
	lens = c;
	words = d;
	loadsremaining = 0;
	shifter();
	return hedotools.shifter;
    }	

    var shifter = function() {
	/* shift two frequency vectors
	   -assume they've been zero-ed for stop words
	   -lens is of full length
	   -words is a list of utf8 strings

	   return an object with the sorted quantities for plotting the shift
	*/

	//normalize frequencies
	var Nref = 0.0;
	var Ncomp = 0.0;
	for (var i=0; i<refF.length; i++) {
            Nref += parseFloat(refF[i]);
            Ncomp += parseFloat(compF[i]);
	}

	// for (var i=0; i<refF.length; i++) {
	//     refF[i] = parseFloat(refF[i])/Nref;
	//     compF[i] = parseFloat(compF[i])/Ncomp;
	// }
	
	// compute reference happiness
	refH = 0.0;
	for (var i=0; i<refF.length; i++) {
            refH += refF[i]*parseFloat(lens[i]);
	}
	refH = refH/Nref;
	// console.log(refH);

	// compute reference variance
	// var refV = 0.0;
	// for (var i=0; i<refF.length; i++) {
	//     refV += refF[i]*Math.pow(parseFloat(lens[i])-refH,2);
	// }
	// refV = refV/Nref; 
	// // console.log(refV);

	// compute comparison happiness
	compH = 0.0;
	for (var i=0; i<compF.length; i++) {
            compH += compF[i]*parseFloat(lens[i]);
	}
	compH = compH/Ncomp;

	// do the shifting
	var shiftMag = Array(refF.length);
	var shiftType = Array(refF.length);
	var freqDiff = 0.0;
	for (var i=0; i<refF.length; i++) {
	    freqDiff = compF[i]/Ncomp-refF[i]/Nref;
            shiftMag[i] = (parseFloat(lens[i])-refH)*freqDiff;
	    if (freqDiff > 0) { shiftType[i] = 2; }
	    else { shiftType[i] = 0}
	    if (parseFloat(lens[i]) > refH) { shiftType[i] += 1;}
	}

	// +2 for frequency up
	// +1 for happier
	// => 
	// 0 sad, down
	// 1 happy, down
	// 2 sad, up
	// 3 happy, up

	// do the sorting
	var indices = Array(refF.length);
	for (var i = 0; i < refF.length; i++) { indices[i] = i; }
	indices.sort(function(a,b) { return Math.abs(shiftMag[a]) < Math.abs(shiftMag[b]) ? 1 : Math.abs(shiftMag[a]) > Math.abs(shiftMag[b]) ? -1 : 0; });

	sortedMag = Array(numwordstoplot);
	sortedType = Array(numwordstoplot);
	sortedWords = Array(numwordstoplot);

	for (var i = 0; i < numwordstoplot; i++) { 
	    sortedMag[i] = shiftMag[indices[i]]; 
	    sortedType[i] = shiftType[indices[i]]; 
	    sortedWords[i] = words[indices[i]]; 
	}

	// compute the sum of contributions of different types
	sumTypes = [0.0,0.0,0.0,0.0];
	for (var i = 0; i < refF.length; i++)
	{ 
            sumTypes[shiftType[i]] += shiftMag[i];
	}

	// slice them
	// sortedMag = sortedMag.slice(0,numwordstoplot);
	// sortedWords = sortedWords.slice(0,numwordstoplot);
	// sortedType = sortedType.slice(0,numwordstoplot);

	if (translate) {
	    sortedWordsEn = Array(numwordstoplot);
	    for (var i = 0; i < sortedWordsEn.length; i++) { 
		sortedWordsEn[i] = words_en[indices[i]]; 
	    }   
	}

	// // return as an object
	// return {
	//     sortedMag: sortedMag,
	//     sortedType: sortedType,
	//     sortedWords: sortedWords,
	//     sumTypes: sumTypes,
	//     refH: refH,
	//     compH: compH,
	// };

	// allow chaining here too
	return hedotools.shifter;
    }

    // declare a boat load of private variables
    // to be accessed by the other methods
    var canvas;
    var maxWidth;
    var x;
    var y;
    var topScale;
    var bgrect;
    var xlabel;
    var topbgrect;
    var ylabel;
    var sepline;
    var zoom;
    var axes;
    var bigshifttextsize;
    var typeClass = ["negdown","posdown","negup","posup"];
    var shiftrects;
    var shifttext;
    var flipVector;
    var maxShiftSum;
    var summaryArray;

    var plot = function() {
	/* plot the shift

	   -take a d3 selection, and draw the shift SVG on it
	   -requires sorted vectors of the shift magnitude, type and word
	   for each word

	*/
	// console.log("plotting shift");

	figure.selectAll("svg").remove();

	canvas = figure.append("svg")
	    .attr("id","shiftsvg")
	    .attr("width",function () { return boxwidth; })
	    .attr("height",function () { return boxheight; });



	// take the longest of the top five words
	// console.log("appending to sorted words");
	// console.log(sortedWords);
	sortedWords = sortedWords.map(function(d,i) { 
	    if (sortedType[i] == 0) {
		return d.concat("-\u2193");
	    } 
	    else if (sortedType[i] == 1) {
		return "\u2193+".concat(d);
	    }
	    else if (sortedType[i] == 2) {
		return "\u2191-".concat(d);
	    } else {
		return d.concat("+\u2191");
	    }
	});

	maxWidth = d3.max(sortedWords.slice(0,5).map(function(d) { return d.width(); }));

	// linear scale function
	x = d3.scale.linear()
	    .domain([-Math.abs(sortedMag[0]),Math.abs(sortedMag[0])])
	    .range([maxWidth+10,figwidth-maxWidth-10]);

	// linear scale function
	y = d3.scale.linear()
	    .domain([numWords+1,1])
	    .range([figheight+2, yHeight]); 

	// zoom object for the axes
	zoom = d3.behavior.zoom()
	    .y(y) // pass linear scale function
	// .translate([10,10])
	    .scaleExtent([1,1])
	    .on("zoom",zoomed);

	// create the axes themselves
	axes = canvas
	    // .append("svg")
	    // .attr("width", figwidth)
	    // .attr("height", figheight)
	    // .attr("class", "shiftcanvas")
	    .append("g")
	    .attr("transform","translate("+(axeslabelmargin.left)+","+axeslabelmargin.top+")")
	    .attr("width", figwidth)
	    .attr("height", figheight)
	    .attr("class", "main");
	
	axes.call(zoom);

	// create the axes background
	bgrect = axes.append("rect")
	    .attr("x",0)
	    .attr("y",1)
	    .attr("width", figwidth-2)
	    .attr("height", figheight-2)
	    .attr("class", "bg")
	    .style({"stroke-width":"2","stroke":"rgb(0,0,0)"})
	    .attr("fill", "#FCFCFC")
	    .attr("opacity","0.96");



	bigshifttextsize = 13;

	if (compH >= refH) {
	    var happysad = "happier";
	}
	else { 
	    var happysad = "less happy";
	}

	// figure.selectAll("p.sumtext.ref")
	// 	.data([refH,])
	// 	.html(function(d,i) { 
	// 	    if (i===0) {
	// 		return "Reference: happiness " + (d.toFixed(3));
	// 	    }
	// 	});

	// figure.selectAll("p.sumtext.comp")
	// 	.data([compH,])
	// 	.html(function(d,i) { 
	// 	    if (i===0) {
	// 		return "Comparison: happiness " + (d.toFixed(3));
	// 	    }
	// 	});

	// addthis_share.passthrough.twitter.text = "Why "+allData[shiftComp].name+" was "+happysad+" than "+allData[shiftRef].name+" in "+timeseldecoder().cached;

	// addthis_share.title = "Why "+allData[shiftComp].name+" was "+happysad+" than "+allData[shiftRef].name+" in "+timeseldecoder().cached;

	// addthis_share.url = document.URL;

	// d3.select("[id=fbtitle]").attr("content","Hedonometer Maps: Andy has been here");

	// if there wasn't any text passed, make it
	if (comparisonText[0].length < 1) {
	    // console.log("generating text for wordshift");
	    comparisonText[0] = "Why comparison is "+happysad+" than reference:";
	}
	else { 
	    // console.log("word shift text is:");
	    // console.log(comparisonText);
	}

	figure.selectAll("p")
	    .remove();

	figure.selectAll("p")
	    .data(comparisonText)
	    .enter()
	    .insert("p","svg")
	    .attr("class","shifttitle")
	    .html(function(d) { return d; });

	typeClass = ["negdown","posdown","negup","posup"];
	
	axes.selectAll("rect.shiftrect")
	    .data(sortedMag)
	    .enter()
	    .append("rect")
	    .attr("class", function(d,i) { return "shiftrect "+intStr[sortedType[i]]+" "+typeClass[sortedType[i]]; })
	    .attr("x",function(d,i) { 
		if (d>0) { return figcenter; } 
		else { return x(d)} })
	    .attr("y",function(d,i) { return y(i+1); } )
	    .attr("height",function(d,i) { return iBarH; } )
	    .attr("width",function(d,i) { if ((d)>0) {return x(d)-x(0);} else {return x(0)-x(d); } } )
	    .style({"opacity":"0.7","stroke-width":"1","stroke":"rgb(0,0,0)"});
  	    // these add some hover niceness to the rectangles
	// .on("mouseover", function(d){
	//     var rectSelection = d3.select(this).style({opacity:"1.0"});
	// })
	// .on("mouseout", function(d){
	//     var rectSelection = d3.select(this).style({opacity:"0.7"});
	// });

	shiftrects = axes.selectAll("rect.shiftrect")
	    .data(sortedMag)
	    .enter()
	    .append("rect")
	    .attr({ 
		"class": function(d,i) { return "shiftrect "+intStr[sortedType[i]]+" "+typeClass[sortedType[i]]; },
		"x": function(d,i) { 
		    if (d>0) { return figcenter; } 
		    else { return x(d)}
		},
		"y": function(d,i) { return y(i+1); },
		"height": function(d,i) { return iBarH; },
		"width": function(d,i) { 
		    if ((d)>0) { return x(d)-x(0); }
		    else { return x(0)-x(d); } 
		},
		"opacity": "0.7",
		"stroke-width": "1",
		"stroke": "rgb(0,0,0)"
	    });

	shifttext = axes.selectAll("text.shifttext")
	    .data(sortedMag)
	    .enter()
	    .append("text")
	    .attr("class", function(d,i) { return "shifttext "+intStr[sortedType[i]]; })
	    .attr("x",function(d,i) { if (d>0) {return x(d)+2;} else {return x(d)-2; } } )
	    .attr("y",function(d,i) { return y(i+1)+iBarH; } )
	    .style({"text-anchor": function(d,i) { if (sortedMag[i] < 0) { return "end";} else { return "start";}}, "font-size": bigshifttextsize})
	    .text(function(d,i) { return sortedWords[i]; });

	if (translate) {
	    // it is one longer than the words, the last entry being what
	    // everything will be set to on "translate all"
	    flipVector = Array(sortedWords.length+1);
	    for (var i=0; i<flipVector.length; i++) { flipVector[i] = 0; }
	    flipVector[flipVector.length-1] = 1;
	    shifttext.on("click",function(d,i) {
		// goal is to toggle translation
		// need translation vector
		//console.log(flipVector[i]);
		if (flipVector[i]) { 
		    if (sortedType[i] == 0) {tmpStr = "-\u2193";} else if (sortedType[i] == 1) {tmpStr = "\u2193+";}
		    else if (sortedType[i] == 2) {tmpStr = "\u2191-";} else {tmpStr = "+\u2191";}
		    if (sortedMag[i] < 0) { tmpStr = tmpStr.concat(sortedWords[i]);} else { tmpStr = sortedWords[i].concat(tmpStr); } 
		    flipVector[i] = 0; }
		else {
		    tmpStr = sortedWordsEn[i];
		    flipVector[i] = 1; }
		newText = d3.select(this).text(tmpStr);
	    });
	}

	// check if there is a word selection to apply
	if (shiftseldecoder().current === "posup") {
	    shiftTypeSelect = true;
	    resetButton();
	    axes.selectAll("rect.shiftrect.zero").attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.zero").attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.one").attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.one").attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.two").attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.two").attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.three").attr("y", function(d,i) { return y(i+1) }).attr("transform","translate(0,0)");
	    axes.selectAll("text.shifttext.three").attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform","translate(0,0)");
	}
	else if (shiftseldecoder().current === "negdown") {
	    shiftTypeSelect = true;
	    resetButton();
	    axes.selectAll("rect.shiftrect.zero").attr("y", function(d,i) { return y(i+1) }).attr("transform","translate(0,0)");
	    axes.selectAll("text.shifttext.zero").attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform","translate(0,0)");
	    axes.selectAll("rect.shiftrect.one").attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.one").attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.two").attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.two").attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.three").attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.three").attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});		
	}
	else if (shiftseldecoder().current === "posdown") {
	    shiftTypeSelect = true;
	    resetButton();
	    axes.selectAll("rect.shiftrect.zero").attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.zero").attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.three").attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.three").attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.two").attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.two").attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.one").attr("y", function(d,i) { return y(i+1) }).attr("transform","translate(0,0)");
	    axes.selectAll("text.shifttext.one").attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform","translate(0,0)");
	}
	else if (shiftseldecoder().current === "negup") {
	    shiftTypeSelect = true;
	    resetButton();
	    axes.selectAll("rect.shiftrect.zero").attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.zero").attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.one").attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.one").attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.two").attr("y", function(d,i) { return y(i+1) }).attr("transform","translate(0,0)");
	    axes.selectAll("text.shifttext.two").attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform","translate(0,0)");
	    axes.selectAll("rect.shiftrect.three").attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.three").attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	}
	
	// draw a white rectangle to hide the shift bars behind the summary shifts
	// move x,y to 3 and width to -6 to give the bg a little space
	topbgrect = axes.append("rect").attr("x",3).attr("y",3).attr("width",figwidth-axeslabelmargin.left-5).attr("height",73-13).attr("fill","white").style({"opacity": "1.0"});

	bottombgrect = axes.append("rect").attr("x",3).attr("y",fullheight-axeslabelmargin.bottom).attr("width",figwidth-axeslabelmargin.left-5).attr("height",axeslabelmargin.bottom).attr("fill","white").style({"opacity": "1.0"});

	// draw the summary things
	sepline = axes.append("line")
	    .attr("x1",0)
	    .attr("x2",figwidth)
	    .attr("y1",barHeight)
	    .attr("y2",barHeight)
	    .style({"stroke-width" : "1", "stroke": "black"});

	maxShiftSum = Math.max(Math.abs(sumTypes[1]),Math.abs(sumTypes[2]),sumTypes[0],sumTypes[3]);

	topScale = d3.scale.linear()
	    .domain([-maxShiftSum,maxShiftSum])
	    .range([figwidth*.12,figwidth*.88]);

	// define the RHS summary bars so I can add if needed
	// summaryArray = [sumTypes[3],sumTypes[0],sumTypes[3]+sumTypes[1],d3.sum(sumTypes)];
	summaryArray = [sumTypes[3],sumTypes[0],d3.sum(sumTypes)];

	typeClass = ["posup","negdown","sumgrey"];

	axes.selectAll(".sumrectR")
	    .data(summaryArray)
	    .enter()
	    .append("rect")
	    .attr("class", function(d,i) { return "sumrectR "+intStr[i]+" "+typeClass[i]; })
	    .attr("x",function(d,i) { 
		if (d>0) { 
		    return figcenter;
		} 
		else { return topScale(d)} }
		 )
	    .attr("y",function(d,i) { if (i<3) { return i*17+7;} else { return i*17+7-2;} } )
	    .style({"opacity":"0.7","stroke-width":"1","stroke":"rgb(0,0,0)"})
	    .attr("height",function(d,i) { return 14; } )
	    .attr("width",function(d,i) { if (d>0) {return topScale(d)-figcenter;} else {return figcenter-topScale(d); } } )
	    .on("mouseover", function(d){
		var rectSelection = d3.select(this).style({opacity:"1.0"});
	    })
	    .on("mouseout", function(d){
		var rectSelection = d3.select(this).style({opacity:"0.7"});
	    })
	    .on("click", function(d,i) { 
		if (i==0) {
		    shiftTypeSelect = true;
		    resetButton();
		    shiftselencoder.varval("posup");
		    // shoot them all away
		    //d3.selectAll("rect.shiftrect, text.shifttext").transition().duration(1000).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    // keep the ones with class "three"
		    //d3.selectAll("rect.shiftrect.three, text.shifttext.three").transition().duration(1000)
		    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		}
		else if (i==1) {
		    shiftTypeSelect = true;
		    resetButton();
		    shiftselencoder.varval("negdown");
		    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		}
		else if (i==2) {
		    // shiftTypeSelect = true;
		    reset();
		    // shiftselencoder.varval("negdown");
		}
	    });

	axes.selectAll(".sumtextR")
	    .data([sumTypes[3],sumTypes[0],d3.sum(sumTypes)])
	    .enter()
	    .append("text")
	    .attr("class", "sumtextR")
	    .style("text-anchor",function(d,i) { if (d>0) {return "start";} else {return "end";} })
	//.attr("y",function(d,i) { if (i<2) {return i*17+17;} else if ((sumTypes[3]+sumTypes[1])*(sumTypes[0]+sumTypes[2])<0) {return i*17+33; } else {return i*17+33; } })
	// for only three days
	    .attr("y",function(d,i) { return i*17+17; })
	    .text(function(d,i) { if (i == 0) {return "\u2211+\u2191";} if (i==1) { return"\u2211-\u2193";} else { return "\u2211";} } )
	// push to the side of d
	    .attr("x",function(d,i) { return topScale(d)+5*d/Math.abs(d); });

	// summaryArray = [sumTypes[1],sumTypes[2],sumTypes[0]+sumTypes[2]];
	summaryArray = [sumTypes[1],sumTypes[2]];

	typeClass = ["posdown","negup"];

	axes.selectAll(".sumrectL")
	    .data(summaryArray)
	    .enter()
	    .append("rect")
	    .attr("class",function(d,i) { return "sumrectL "+intStr[i]+" "+typeClass[i]; })
	    .attr("x",function(d,i) { 
		if (i<2) { 
		    return topScale(d);
		} 
		else { 
		    // place the sum of negatives bar
		    // if they are not opposing
		    if ((sumTypes[3]+sumTypes[1])*(sumTypes[0]+sumTypes[2])>0) {
			// if positive, place at end of other bar
			if (d>0) {
			    return topScale((sumTypes[3]+sumTypes[1]));
			}
			// if negative, place at left of other bar, minus length (+topScale(d))
			else {
			    return topScale(d)-(figcenter-topScale((sumTypes[3]+sumTypes[1])));
			}
		    } 
		    else { 
			if (d>0) {return figcenter} 
			else { return topScale(d)} }
		}
	    })
	    .attr("y",function(d,i) { return i*17+7; } )
	    .style({"opacity":"0.7","stroke-width":"1","stroke":"rgb(0,0,0)"})
	    .attr("height",function(d,i) { return 14; } )
	    .attr("width",function(d,i) { if (d>0) {return topScale(d)-figcenter;} else {return figcenter-topScale(d); } } )
	    .on("mouseover", function(d){
		var rectSelection = d3.select(this).style({opacity:"1.0"});
	    })
	    .on("mouseout", function(d){
		var rectSelection = d3.select(this).style({opacity:"0.7"});
	    })
	    .on("click", function(d,i) {
		shiftTypeSelect = true;
		resetButton();
		if (i==0) {
		    shiftselencoder.varval("posdown");
		    // together
		    // axes.selectAll("rect.shiftrect.zero, text.shifttext.zero, rect.shiftrect.three, text.shifttext.three, rect.shiftrect.two, text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    // separate
		    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		}
		else if (i==1) {
		    shiftselencoder.varval("negup");
		    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		}
	    } );

	axes.selectAll(".sumtextL")
	    .data(summaryArray)
	    .enter()
	    .append("text")
	    .attr("class", "sumtextL")
	    .style("text-anchor", "end")
	    .attr("y",function(d,i) { return i*17+17; } )
	    .text(function(d,i) { if (i == 0) {return "\u2211+\u2193";} else { return"\u2211-\u2191";} })
	    .attr("x",function(d,i) { return topScale(d)-5; });

	// x label of shift, outside of the SVG
	xlabel = canvas.append("text")
	    .text("Per word average happiness shift")
	    .attr("class","axes-text")
	    .attr("x",axeslabelmargin.left+figcenter) // 350-20-10 for svg width,  
	    .attr("y",boxheight-7)
	    .attr("font-size", "18.0px")
	    .attr("fill", "#000000")
	    .attr("style", "text-anchor: middle;");

	ylabel = canvas.append("text")
	    .text("Word Rank")
	    .attr("class","axes-text")
	    .attr("x",15)
	    .attr("y",figheight/2+60)
	    .attr("font-size", "18.0px")
	    .attr("fill", "#000000")
	    .attr("transform", "rotate(-90.0," + (15) + "," + (figheight/2+60) + ")");

	function zoomed() {
	    // if we have zoomed in, we set the y values for each subselection
	    // console.log(shiftTypeSelect);
	    if (shiftTypeSelect) {
		for (var j=0; j<4; j++) {
		    axes.selectAll("rect.shiftrect."+intStr[j]).attr("y", function(d,i) { return y(i+1) });
		    axes.selectAll("text.shifttext."+intStr[j]).attr("y", function(d,i) { return y(i+1)+iBarH; } )
		}
	    }
	    else {
		axes.selectAll("rect.shiftrect").attr("y", function(d,i) { return y(i+1) });
		axes.selectAll("text.shifttext").attr("y", function(d,i) { return y(i+1)+iBarH; } );
	    }

	}; // zoomed

	function reset() {
	    // console.log("reset function");
	    shiftTypeSelect = false;		
	    d3.selectAll("rect.shiftrect").transition().duration(1000)
		.attr("y", function(d,i) { return y(i+1) })
		.attr("transform","translate(0,0)");
	    d3.selectAll("text.shifttext").transition().duration(1000)
		.attr("y", function(d,i) { return y(i+1)+iBarH; } )
		.attr("transform","translate(0,0)");
	    // d3.selectAll(".resetbutton").remove();
	    shiftselencoder.varval("none");
	    shiftselencoder.destroy();
	} // reset

	function resetButton() {
	    // console.log("resetbutton function");

	    d3.selectAll(".resetbutton").remove();
	    
	    var resetGroup = canvas.append("g")
		.attr("transform","translate("+(0)+","+(56)+") rotate(-90)")
		.attr("class","resetbutton");

	    resetGroup.append("rect")
		.attr("x",0)
		.attr("y",0)
		.attr("rx",3)
		.attr("ry",3)
		.attr("width",48)
		.attr("height",17)
		.attr("fill","#F0F0F0") //http://www.w3schools.com/html/html_colors.asp
		.style({"stroke-width":"0.5","stroke":"rgb(0,0,0)"});

	    resetGroup.append("text")
		.text("Reset")
		.attr("x",6)
		.attr("y",13)
		.attr("font-size", "13.0px");

	    resetGroup.append("rect")
		.attr("x",0)
		.attr("y",0)
		.attr("rx",3)
		.attr("ry",3)
		.attr("width",48)
		.attr("height",18)
		.attr("fill","white") //http://www.w3schools.com/html/html_colors.asp
		.style({"opacity": "0.0"})
		.on("click",function() { 
		    reset();
		});
	    
	}; // resetButton

	if (reset) {
	    // call it
	    resetButton();
	}

	function translateButton() {

	    var translateGroup = canvas.append("g")
		.attr("class","translatebutton")
		.attr("transform","translate("+(0)+","+(136)+") rotate(-90)");

	    translateGroup.append("rect")
		.attr("x",0)
		.attr("y",0)
		.attr("rx",3)
		.attr("ry",3)
		.attr("width",75)
		.attr("height",17)
		.attr("fill","#F0F0F0") //http://www.w3schools.com/html/html_colors.asp
		.style({'stroke-width':'0.5','stroke':'rgb(0,0,0)'});

	    translateGroup.append("text")
		.text("Translate All")
		.attr("x",6)
		.attr("y",13)
		.attr("font-size", "11.0px")

	    translateGroup.append("rect")
		.attr("x",0)
		.attr("y",0)
		.attr("rx",3)
		.attr("ry",3)
		.attr("width",75)
		.attr("height",18)
		.attr("fill","white") //http://www.w3schools.com/html/html_colors.asp
		.style({"opacity": "0.0"})
		.on("click",function() { 
		    for (var i=0; i<flipVector.length-1; i++) { flipVector[i] = flipVector[flipVector.length-1]; }
		    flipVector[flipVector.length-1] = (flipVector[flipVector.length-1] + 1) % 2;
		    console.log("clicked translate");

		    axes.selectAll("text.shifttext").transition().duration(1000)
			.text(function(d,i) { 
			    // goal is to toggle translation
			    // need translation vector
			    //console.log(flipVector[i]);
			    if (flipVector[i]) { 
				if (sortedType[i] == 0) {tmpStr = "-\u2193";} 
				else if (sortedType[i] == 1) {tmpStr = "\u2193+";}
				else if (sortedType[i] == 2) {tmpStr = "\u2191-";} 
				else {tmpStr = "+\u2191";}
				if (sortedMag[i] < 0) { tmpStr = tmpStr.concat(sortedWordsEn[i]);} 
				else { tmpStr = sortedWordsEn[i].concat(tmpStr); } 
			    }
			    else {
				tmpStr = sortedWords[i];
			    }
			    return tmpStr;
			}); // .text()
	        }); // on("click")
	}; // translateButton

	if (translate) {
	    translateButton();
	}

	// var credit = axes.insert("text","rect")
        //     .attr("class","credit")
	//     .text("by Andy Reagan")
        //     .attr("fill","#B8B8B8")
	//     .attr("x",width-7)
	//     .attr("y",527)
	//     .attr("font-size", "8.0px")
        //     .style({"text-anchor": "end"});

	return hedotools.shifter;

    }; // hedotools.shifter.plot

    function replot() {
	// apply new data to the bars, transition everything
	// tricky to get the transition right

	var newbars = axes.selectAll("rect.shiftrect").data(sortedMag);
	var newwords = axes.selectAll("text.shifttext").data(sortedMag);
	
	// if we haven't dont a subselection, apply with a transition
	if (shiftseldecoder().current === "none" || shiftseldecoder().current.length === 0) {
	    newbars.transition()
		.attr("fill", function(d,i) { if (sortedType[i] == 2) {return "#4C4CFF";} else if (sortedType[i] == 3) {return "#FFFF4C";} else if (sortedType[i] == 0) {return "#B3B3FF";} else { return "#FFFFB3"; }})
		.attr("class", function(d,i) { return "shiftrect "+intStr[sortedType[i]]; })
		.attr("x",function(d,i) { 
		    if (d>0) { return figcenter; } 
		    else { return x(d)} })
		.attr("height",function(d,i) { return iBarH; } )
		.attr("width",function(d,i) { if ((d)>0) {return x(d)-x(0);} else {return x(0)-x(d); } } )

	    newwords.transition()
		.attr("class", function(d,i) { return "shifttext "+intStr[sortedType[i]]; })
		.style({"text-anchor": function(d,i) { if (sortedMag[i] < 0) { return "end";} else { return "start";}}, "font-size": 11})
		.text(function(d,i) { if (sortedType[i] == 0) {tmpStr = "-\u2193";} else if (sortedType[i] == 1) {tmpStr = "\u2193+";}
				      else if (sortedType[i] == 2) {tmpStr = "\u2191-";} else {tmpStr = "+\u2191";}
				      if (sortedMag[i] < 0) {return tmpStr.concat(sortedWords[i]);} else { return sortedWords[i].concat(tmpStr); } })
		.attr("x",function(d,i) { if (d>0) {return x(d)+2;} else {return x(d)-2; } } );
	}
	// else apply without a transition
	else {
	    newbars
		.attr("fill", function(d,i) { if (sortedType[i] == 2) {return "#4C4CFF";} else if (sortedType[i] == 3) {return "#FFFF4C";} else if (sortedType[i] == 0) {return "#B3B3FF";} else { return "#FFFFB3"; }})
		.attr("class", function(d,i) { return "shiftrect "+intStr[sortedType[i]]; })
		.attr("x",function(d,i) { 
		    if (d>0) { return figcenter; } 
		    else { return x(d)} })
		.attr("height",function(d,i) { return iBarH; } )
		.attr("width",function(d,i) { if ((d)>0) {return x(d)-x(0);} else {return x(0)-x(d); } } )

	    newwords
		.attr("class", function(d,i) { return "shifttext "+intStr[sortedType[i]]; })
		.style({"text-anchor": function(d,i) { if (sortedMag[i] < 0) { return "end";} else { return "start";}}, "font-size": 11})
		.text(function(d,i) { if (sortedType[i] == 0) {tmpStr = "-\u2193";} else if (sortedType[i] == 1) {tmpStr = "\u2193+";}
				      else if (sortedType[i] == 2) {tmpStr = "\u2191-";} else {tmpStr = "+\u2191";}
				      if (sortedMag[i] < 0) {return tmpStr.concat(sortedWords[i]);} else { return sortedWords[i].concat(tmpStr); } })
		.attr("x",function(d,i) { if (d>0) {return x(d)+2;} else {return x(d)-2; } } );

	    if (shiftseldecoder().current === "posup") {
		axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform","translate(0,0)");
		axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform","translate(0,0)");
	    }
	    else if (shiftseldecoder().current === "negdown") {
		axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform","translate(0,0)");
		axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});		
	    }
	    else if (shiftseldecoder().current === "posdown") {
		axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform","translate(0,0)");
		axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform","translate(0,0)");
	    }
	    else if (shiftseldecoder().current === "negup") {
		axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform","translate(0,0)");
		axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return y(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return y(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    }
	}

	maxShiftSum = Math.max(Math.abs(sumTypes[1]),Math.abs(sumTypes[2]),sumTypes[0],sumTypes[3]);

	topScale.domain([-maxShiftSum,maxShiftSum]);

	// define the RHS summary bars so I can add if needed
	// var summaryArray = [sumTypes[3],sumTypes[0],sumTypes[3]+sumTypes[1],d3.sum(sumTypes)];
	summaryArray = [sumTypes[3],sumTypes[0],d3.sum(sumTypes)];

	var newRtopbars = axes.selectAll(".sumrectR")
	    .data(summaryArray);
	
	newRtopbars.transition()
	    .attr("x",function(d,i) { 
		if (d>0) { 
		    return figcenter;
		} 
		else { return topScale(d)} })
	    .attr("width",function(d,i) { if (d>0) {return topScale(d)-figcenter;} else {return figcenter-topScale(d); } } );

	var newRtoptext = axes.selectAll(".sumtextR")
	    .data([sumTypes[3],sumTypes[0],d3.sum(sumTypes)]);

	newRtoptext.transition().attr("class", "sumtextR")
	    .style("text-anchor",function(d,i) { if (d>0) {return "start";} else {return "end";} })
	    .attr("x",function(d,i) { return topScale(d)+5*d/Math.abs(d); });
	
	summaryArray = [sumTypes[1],sumTypes[2],sumTypes[0]+sumTypes[2]];

	var newLtopbars = axes.selectAll(".sumrectL")
	    .data(summaryArray);

	newLtopbars.transition().attr("fill", function(d,i) { 
	    if (i==0) {
		return "#FFFFB3";
	    } 
	    else if (i==1) {
		return "#4C4CFF";
	    } 
	    else {
		// choose color based on whether increasing/decreasing wins
		if (d>0) {
		    return "#B3B3FF";
		}
		else {
		    return "#4C4CFF";
		}
	    }
	})
	    .attr("x",function(d,i) { 
		if (i<2) { 
		    return topScale(d);
		} 
		else { 
		    // place the sum of negatives bar
		    // if they are not opposing
		    if ((sumTypes[3]+sumTypes[1])*(sumTypes[0]+sumTypes[2])>0) {
			// if positive, place at end of other bar
			if (d>0) {
			    return topScale((sumTypes[3]+sumTypes[1]));
			}
			// if negative, place at left of other bar, minus length (+topScale(d))
			else {
			    return topScale(d)-(figcenter-topScale((sumTypes[3]+sumTypes[1])));
			}
		    } 
		    else { 
			if (d>0) {return figcenter} 
			else { return topScale(d)} }
		}
	    })
	    .attr("width",function(d,i) { if (d>0) {return topScale(d)-figcenter;} else {return figcenter-topScale(d); } } );

	var newLtoptext = axes.selectAll(".sumtextL")
	    .data([sumTypes[1],sumTypes[2]]);

	newLtoptext.transition().attr("x",function(d,i) { return topScale(d)-5; });

	return hedotools.shifter;
	
    }; // hedotools.shifter.replot


    d3.select(window).on("resize.shiftplot",resizeshift);
    
    function resizeshift() {
	fullwidth = parseInt(figure.style("width"));
	boxwidth = fullwidth-margin.left-margin.right;
	figwidth = boxwidth-axeslabelmargin.left-axeslabelmargin.right;
	figcenter = figwidth/2;
	console.log(figcenter);

	canvas.attr("width", boxwidth);
	axes.attr("width", figwidth);

	x.range([maxWidth+10,figwidth-maxWidth-10]);
	
	topScale.range([figwidth*.12,figwidth*.88]);

	bgrect.attr("width",figwidth);
	topbgrect.attr("width",figwidth-5);
	bottombgrect.attr("width",figwidth-5);

	// fix the x axis
	// canvas.select(".x.axis").call(xAxis);

	// get the x label
	xlabel.attr("x",(leftOffsetStatic+figwidth/2));

	// the andy reagan credit
	// credit.attr("x",width-7);

	// line separating summary
	sepline.attr("x2",figwidth);

	axes.selectAll(".sumrectR")
	    .attr("x",function(d,i) { 
		if (d>0) { return figcenter; } 
		else { return topScale(d)} } )
	    .attr("width",function(d,i) { if (d>0) {return topScale(d)-figcenter;} else {return figcenter-topScale(d); } } );

	axes.selectAll(".sumtextR")
	    .attr("x",function(d,i) { return topScale(d)+5*d/Math.abs(d); });

	axes.selectAll(".sumrectL")
	    .attr("x",function(d,i) { 
		if (i<2) { 
		    return topScale(d);
		} 
		else { 
		    // place the sum of negatives bar
		    // if they are not opposing
		    if ((sumTypes[3]+sumTypes[1])*(sumTypes[0]+sumTypes[2])>0) {
			// if positive, place at end of other bar
			if (d>0) {
			    return topScale((sumTypes[3]+sumTypes[1]));
			}
			// if negative, place at left of other bar, minus length (+topScale(d))
			else {
			    return topScale(d)-(figcenter-topScale((sumTypes[3]+sumTypes[1])));
			}
		    } 
		    else { 
			if (d>0) {return figcenter} 
			else { return topScale(d)} }
		}
	    })
	    .attr("width",function(d,i) { if (d>0) {return topScale(d)-figcenter;} else {return figcenter-topScale(d); } } );

	axes.selectAll(".sumtextL")
	    .attr("x",function(d,i) { return topScale(d)-5; });

	axes.selectAll("rect.shiftrect")
	// this variable does not seem to do the trick...
	// shiftrects
	    .attr("x",function(d,i) { 
		if (d>0) { return figcenter; } 
		else { return x(d); } })
	    .attr("width",function(d,i) { 
		if ((d)>0) { return x(d)-x(0); } 
		else { return x(0)-x(d); } });

	// all of the lower shift text
	shifttext.attr("x",function(d,i) { if (d>0) {return x(d)+2;} else {return x(d)-2; } } );

    }

    var opublic = { shift: shift,
		    ignore: ignore,
		    stop: stop,
		    istopper: istopper,
		    shifter: shifter,
		    setfigure: setfigure,
		    setdata: setdata,
		    plot: plot, 
		    replot: replot, 
		    setText: setText,
		    setWidth: setWidth,
		    setHeight: setHeight,
		    _reset: _reset,
		    _stoprange: _stoprange,
		    _refF: _refF,
		    _compF: _compF,
		    _lens: _lens,
		    _words: _words,
		    _words_en: _words_en,
		    // boatload more accessor functions
		    _sortedMag: _sortedMag,
		    _sortedType: _sortedType,
		    _sortedWords: _sortedWords,
		    _sumTypes: _sumTypes,
		    _refH: _refH,
		    _compH: _compH,
		  } 

    return opublic;
}();
