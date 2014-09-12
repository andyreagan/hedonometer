// namespace it
var hedotools = hedotools || {};

// define the module 
hedotools.shifter = function()
{
    // for the word type selection
    var shiftselencoder = d3.urllib.encoder().varname("wordtypes");
    var shiftseldecoder = d3.urllib.decoder().varname("wordtypes").varresult("none");

    // will need a figure.
    // this needs to be set by setfigure() before plotting
    var figure;

    var setfigure = function(_) {
	console.log("setting figure");
	figure = _;
	grabwidth();
	return hedotools.shifter;
    }

    // set the ones we can
    // since the height is fixed, do all that
    // but just initialize the width-related variables
    var modalwidth = 300;
    var modalheight = 450;
    var boxwidth = (modalwidth-20-10);
    var boxheight = (modalheight-40-25);
    var shiftTypeSelect = false;

    var margin = {top: 0, right: 0, bottom: 0, left: 0};
    var figwidth = boxwidth - margin.left - margin.right;
    var figheight = boxheight - margin.top - margin.bottom;
    var iBarH = 11;
    var numWords = 24;
    var intStr = ["zero","one","two","three"];

    var yHeight = (7+17*3+14+5-13); // 101
    var clipHeight = 100-20-13;
    var barHeight = (7+17*3+15-13); // 95
    var width = (figwidth-20); 	// give just enough room for the labels
    var height = (figheight-20);
    var bigfigcenter = width/2;

    // pull the width, set the height static
    var grabwidth = function() {
	console.log("setting width from figure");
	modalwidth = parseInt(figure.style("width"));
	boxwidth = (modalwidth-20-10);
	figwidth = boxwidth - margin.left - margin.right;
	width = (figwidth-20); 	// give just enough room for the labels
	bigfigcenter = width/2;
    }

    // will be set by setdata() or shift() functions
    var sortedMag;
    var sortedType;
    var sortedWords;
    var sumTypes;
    var refH;
    var compH;

    var setdata = function(a,b,c,d,e,f) {
	console.log("setting data");
	sortedMag = a;
	sortedType = b;
	sortedWords = c;
	sumTypes = d;
	refH = e;
	compH = f;
	return hedotools.shifter;
    }

    var numwordstoplot = 200;

    var shift = function(refF,compF,lens,words) {
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
	console.log(refH);

	// compute reference variance
	// var refV = 0.0;
	// for (var i=0; i<refF.length; i++) {
	//     refV += refF[i]*Math.pow(parseFloat(lens[i])-refH,2);
	// }
	// refV = refV/Nref; 
	// console.log(refV);

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

	// do the sorting
	var indices = Array(refF.length);
	for (var i = 0; i < refF.length; i++) { indices[i] = i; }
	indices.sort(function(a,b) { return Math.abs(shiftMag[a]) < Math.abs(shiftMag[b]) ? 1 : Math.abs(shiftMag[a]) > Math.abs(shiftMag[b]) ? -1 : 0; });

	sortedMag = Array(refF.length);
	sortedType = Array(refF.length);
	sortedWords = Array(refF.length);

	for (var i = 0; i < refF.length; i++) { 
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
	sortedMag = sortedMag.slice(0,numwordstoplot);
	sortedWords = sortedWords.slice(0,numwordstoplot);
	sortedType = sortedType.slice(0,numwordstoplot);

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

    var plot = function() {
	/* plot the shift

	   -take a d3 selection, and draw the shift SVG on it
	   -requires sorted vectors of the shift magnitude, type and word
	   for each word

	*/
	console.log("plotting shift");

	figure.selectAll("svg").remove();

	var canvas = figure.append("svg")
	    .attr("id","shiftcanvas")
	    .attr("width",function () { return modalwidth-20-10; })
	    .attr("height",function () { return modalheight-25; });

	// x label of shift, outside of the SVG
	canvas.append("text")
	    .text("Per word average happiness shift")
	    .attr("class","axes-text")
	    .attr("x",(modalwidth-20-10)/2+20) // 350-20-10 for svg width,  
	    .attr("y",modalheight-7)
	    .attr("font-size", "18.0px")
	    .attr("fill", "#000000")
	    .attr("style", "text-anchor: middle;");

	// var canvas = newsmalllist.select("svg");

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
	// console.log(sortedWords);
	var maxWidth = d3.max(sortedWords.slice(0,5).map(function(d) { return d.width(); }));
	// console.log(maxWidth);

	var bigshiftx = d3.scale.linear()
	    .domain([-Math.abs(sortedMag[0]),Math.abs(sortedMag[0])])
	    .range([maxWidth+10,width-maxWidth-10]);

	// linear scale function
	var bigshifty = d3.scale.linear()
	    .domain([numWords+1,1])
	    .range([height+2, yHeight]); 

	// zoom object for the axes
	var zoom = d3.behavior.zoom()
	    .y(bigshifty) // pass linear scale function
	// .translate([10,10])
	    .scaleExtent([1,1])
	    .on("zoom",zoomed);

	// create the axes themselves
	// var axes = canvas.select("g")
	var axes = canvas.append("g")
	    .attr("transform","translate(20,0)")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class", "main")
	    .call(zoom);

	// create the axes background
	axes.append("rect")
	    .attr("width", width)
	    .attr("height", height+60)
	//.attr("transform","translate(0,40)")
	    .attr("class", "bg")
	    .style({"stroke-width":"3","stroke":"rgb(0,0,0)"})
	    .attr("fill", "#FCFCFC")
	    .attr("opacity","0.96");

	canvas.append("text")
	    .text("Word Rank")
	    .attr("class","axes-text")
	    .attr("x",15)
	    .attr("y",figheight/2+60)
	    .attr("font-size", "18.0px")
	    .attr("fill", "#000000")
	    .attr("transform", "rotate(-90.0," + (15) + "," + (figheight/2+60) + ")");

	// going to append this outside the svg		       
	// canvas.append("text")
	//     .text("Per word average happiness shift")
	//     .attr("class","axes-text")
	//     .attr("x",width/2+(figwidth-width)/2)
	//     .attr("y",3*(figheight-height)/4+height+15)
	//     .attr("font-size", "15.0px")
	//     .attr("fill", "#000000")
	//     .attr("style", "text-anchor: middle;");

	var bigshifttextsize = 13;

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

	addthis_share.passthrough.twitter.text = "Why "+allData[shiftComp].name+" was "+happysad+" than "+allData[shiftRef].name+" in "+timeseldecoder().cached;

	addthis_share.title = "Why "+allData[shiftComp].name+" was "+happysad+" than "+allData[shiftRef].name+" in "+timeseldecoder().cached;

	addthis_share.url = document.URL;

	// d3.select("[id=fbtitle]").attr("content","Hedonometer Maps: Andy has been here");

	figure.selectAll("p.sumtext.text")
	    .data(["Why ",])
	    .text(function(d,i) { 
		if (i===0) {
		    return d+allData[shiftComp].name+" is "+happysad+" than "+allData[shiftRef].name+":";
		}
	    });
	
	var typeClass = ["negdown","posdown","negup","posup"];

	axes.selectAll("rect.shiftrect")
	    .data(sortedMag)
	    .enter()
	    .append("rect")
	    .attr("class", function(d,i) { return "shiftrect "+intStr[sortedType[i]]+" "+typeClass[sortedType[i]]; })
	    .attr("x",function(d,i) { 
		if (d>0) { return bigfigcenter; } 
		else { return bigshiftx(d)} })
	    .attr("y",function(d,i) { return bigshifty(i+1); } )
	    .attr("height",function(d,i) { return iBarH; } )
	    .attr("width",function(d,i) { if ((d)>0) {return bigshiftx(d)-bigshiftx(0);} else {return bigshiftx(0)-bigshiftx(d); } } )
	    .style({"opacity":"0.7","stroke-width":"1","stroke":"rgb(0,0,0)"});
	// .on("mouseover", function(d){
	//     var rectSelection = d3.select(this).style({opacity:"1.0"});
	// })
	// .on("mouseout", function(d){
	//     var rectSelection = d3.select(this).style({opacity:"0.7"});
	// });

	axes.selectAll("text.shifttext")
	    .data(sortedMag)
	    .enter()
	    .append("text")
	    .attr("class", function(d,i) { return "shifttext "+intStr[sortedType[i]]; })
	    .attr("x",function(d,i) { if (d>0) {return bigshiftx(d)+2;} else {return bigshiftx(d)-2; } } )
	    .attr("y",function(d,i) { return bigshifty(i+1)+iBarH; } )
	    .style({"text-anchor": function(d,i) { if (sortedMag[i] < 0) { return "end";} else { return "start";}}, "font-size": bigshifttextsize})
	    .text(function(d,i) { return sortedWords[i]; });

	// check if there is a word selection to apply
	if (shiftseldecoder().current === "posup") {
	    shiftTypeSelect = true;
	    resetButton();
	    axes.selectAll("rect.shiftrect.zero").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.zero").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.one").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.one").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.two").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.two").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.three").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
	    axes.selectAll("text.shifttext.three").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
	}
	else if (shiftseldecoder().current === "negdown") {
	    shiftTypeSelect = true;
	    resetButton();
	    axes.selectAll("rect.shiftrect.zero").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
	    axes.selectAll("text.shifttext.zero").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
	    axes.selectAll("rect.shiftrect.one").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.one").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.two").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.two").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.three").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.three").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});		
	}
	else if (shiftseldecoder().current === "posdown") {
	    shiftTypeSelect = true;
	    resetButton();
	    axes.selectAll("rect.shiftrect.zero").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.zero").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.three").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.three").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.two").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.two").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.one").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
	    axes.selectAll("text.shifttext.one").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
	}
	else if (shiftseldecoder().current === "negup") {
	    shiftTypeSelect = true;
	    resetButton();
	    axes.selectAll("rect.shiftrect.zero").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.zero").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.one").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.one").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("rect.shiftrect.two").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
	    axes.selectAll("text.shifttext.two").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
	    axes.selectAll("rect.shiftrect.three").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	    axes.selectAll("text.shifttext.three").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
	}
	
	// draw a white rectangle to hide the shift bars behind the summary shifts
	// move x,y to 3 and width to -6 to give the bg a little space
	axes.append("rect").attr("x",3).attr("y",3).attr("width",width-6).attr("height",73-13).attr("fill","white").style({"opacity": "1.0"});

	// draw the summary things
	axes.append("line")
	    .attr("x1",0)
	    .attr("x2",width)
	    .attr("y1",barHeight)
	    .attr("y2",barHeight)
	    .style({"stroke-width" : "1", "stroke": "black"});

	var maxShiftSum = Math.max(Math.abs(sumTypes[1]),Math.abs(sumTypes[2]),sumTypes[0],sumTypes[3]);

	topScale = d3.scale.linear()
	    .domain([-maxShiftSum,maxShiftSum])
	    .range([width*.12,width*.88]);

	// define the RHS summary bars so I can add if needed
	// var summaryArray = [sumTypes[3],sumTypes[0],sumTypes[3]+sumTypes[1],d3.sum(sumTypes)];
	var summaryArray = [sumTypes[3],sumTypes[0],d3.sum(sumTypes)];

	var typeClass = ["posup","negdown","sumgrey"];

	axes.selectAll(".sumrectR")
	    .data(summaryArray)
	    .enter()
	    .append("rect")
	    .attr("class", function(d,i) { return "sumrectR "+intStr[i]+" "+typeClass[i]; })
	    .attr("x",function(d,i) { 
		if (d>0) { 
		    return bigfigcenter;
		} 
		else { return topScale(d)} }
		 )
	    .attr("y",function(d,i) { if (i<3) { return i*17+7;} else { return i*17+7-2;} } )
	    .style({"opacity":"0.7","stroke-width":"1","stroke":"rgb(0,0,0)"})
	    .attr("height",function(d,i) { return 14; } )
	    .attr("width",function(d,i) { if (d>0) {return topScale(d)-bigfigcenter;} else {return bigfigcenter-topScale(d); } } )
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
		    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		}
		else if (i==1) {
		    shiftTypeSelect = true;
		    resetButton();
		    shiftselencoder.varval("negdown");
		    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
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

	// var summaryArray = [sumTypes[2],sumTypes[1],sumTypes[0]+sumTypes[2]];
	var summaryArray = [sumTypes[1],sumTypes[2]];

	var typeClass = ["posdown","negup"];

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
			    return topScale(d)-(bigfigcenter-topScale((sumTypes[3]+sumTypes[1])));
			}
		    } 
		    else { 
			if (d>0) {return bigfigcenter} 
			else { return topScale(d)} }
		}
	    })
	    .attr("y",function(d,i) { return i*17+7; } )
	    .style({"opacity":"0.7","stroke-width":"1","stroke":"rgb(0,0,0)"})
	    .attr("height",function(d,i) { return 14; } )
	    .attr("width",function(d,i) { if (d>0) {return topScale(d)-bigfigcenter;} else {return bigfigcenter-topScale(d); } } )
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
		    // axes.selectAll("rect.shiftrect.zero, text.shifttext.zero, rect.shiftrect.three, text.shifttext.three, rect.shiftrect.two, text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    // separate
		    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		}
		else if (i==1) {
		    shiftselencoder.varval("negup");
		    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		}
	    } );

	axes.selectAll(".sumtextL")
	    .data([sumTypes[1],sumTypes[2]])
	    .enter()
	    .append("text")
	    .attr("class", "sumtextL")
	    .style("text-anchor", "end")
	    .attr("y",function(d,i) { return i*17+17; } )
	    .text(function(d,i) { if (i == 0) {return "\u2211+\u2193";} else { return"\u2211-\u2191";} })
	    .attr("x",function(d,i) { return topScale(d)-5; });

	function zoomed() {
	    // if we have zoomed in, we set the y values for each subselection
	    // console.log(shiftTypeSelect);
	    if (shiftTypeSelect) {
		for (var j=0; j<4; j++) {
		    axes.selectAll("rect.shiftrect."+intStr[j]).attr("y", function(d,i) { return bigshifty(i+1) });
		    axes.selectAll("text.shifttext."+intStr[j]).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } )
		}
	    }
	    else {
		axes.selectAll("rect.shiftrect").attr("y", function(d,i) { return bigshifty(i+1) });
		axes.selectAll("text.shifttext").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } );
	    }

	}; // zoomed

	function reset() {
	    // console.log("reset function");
	    shiftTypeSelect = false;		
	    d3.selectAll("rect.shiftrect").transition().duration(1000)
		.attr("y", function(d,i) { return bigshifty(i+1) })
		.attr("transform","translate(0,0)");
	    d3.selectAll("text.shifttext").transition().duration(1000)
		.attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } )
		.attr("transform","translate(0,0)");
	    // d3.selectAll(".resetbutton").remove();
	    shiftselencoder.varval("none");
	    shiftselencoder.destroy();
	} // reset

	function resetButton() {
	    // console.log("resetbutton function");

	    d3.selectAll(".resetbutton").remove();
	    
	    var shiftsvg = d3.select("#shiftsvg");

	    var resetGroup = shiftsvg.append("g")
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

	// call it
	resetButton();

	return hedotools.shifter;

    }; // hedotools.shifter.plot

    var opublic = { shift: shift,
		    setfigure: setfigure,
		    setdata: setdata,
		    plot: plot, } 

    return opublic;

}();
