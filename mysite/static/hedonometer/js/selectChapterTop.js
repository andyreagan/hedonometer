function selectChapterTop(figure,numSections) {
/* takes a d3 selection and draws the lens distribution
   on slide of the stop-window
     -reload data csv's
     -cut out stops words (0 the frequencies)
     -call shift on these frequency vectors */


    var margin = {top: 0, right: 0, bottom: 0, left: 0},
    figwidth = parseInt(d3.select('#chapters01').style('width')) - margin.left - margin.right,
    figheight = 38 - margin.top - margin.bottom,
    width = .775*figwidth,
    height = figheight-4,
    leftOffsetStatic = .125*figwidth;

    // remove an old figure if it exists
    figure.select(".canvas").remove();

    var canvas = figure.append("svg")
	.attr("width",figwidth)
	.attr("height",figheight)
	.attr("class","canvas");

    // create the x and y axis
    var x = d3.scale.linear()
	//.domain([d3.min(lens),d3.max(lens)])
	.domain([0,100])
	.range([0,width]);
    
    // linear scale function
    var y =  d3.scale.linear()
	.domain([0,1])
	.range([height, 0]); 

    // create the axes themselves
    var axes = canvas.append("g")
	.attr("transform", "translate(" + (0.125 * figwidth) + "," +
	      ((1 - 0.125 - 0.775) * figheight) + ")")
	.attr("width", width)
	.attr("height", height)
	.attr("class", "main");

    // create the axes background
    var bgrect = axes.append("svg:rect")
	.attr("width", width)
	.attr("height", height)
	.attr("class", "bg")
	.style({'stroke-width':'2','stroke':'rgb(0,0,0)'})
	.attr("fill", "#FCFCFC");

    // axes creation functions
    var create_xAxis = function() {
	return d3.svg.axis()
	    .scale(x)
	    .ticks(9)
	    .orient("bottom"); }

    // axis creation function
    var create_yAxis = function() {
	return d3.svg.axis()
	    .ticks(3)
	    .scale(y) //linear scale function
	    .orient("left"); }

    // create the clip boundary
    var clip = axes.append("svg:clipPath")
	.attr("id","clip")
	.append("svg:rect")
	.attr("x",0)
	.attr("y",38)
	.attr("width",width)
	.attr("height",height-30);

    var unclipped_axes = axes;


 
    var brushX = d3.scale.linear()
        .domain([0,allDataRaw.length])
        .range([figwidth*.125,width+figwidth*.125]);

    canvas.append("text")
	.text("Reference")
	.attr("class","reflabel")
	.attr("x",brushX((refFextent[0]+refFextent[1])/2))
	.attr("y",figheight-figheight/3)
	.attr("font-size", "12.0px")
	.attr("fill", "#000000")
	.attr("style", "text-anchor: middle;");
    
    var brush = d3.svg.brush()
        .x(brushX)
        .extent(refFextent)
        .on("brush",brushing)
        .on("brushend",brushended);

    var gBrush = canvas.append("g")
        .attr("class","topbrush")
        .call(brush)
        .call(brush.event);

    gBrush.selectAll("rect")
        .attr("height",height-2)
        .attr("y",4)
	.style({'stroke-width':'2','stroke':'rgb(100,100,100)','opacity': 0.35})
	.attr("fill", "rgb(90,90,90)");

    function brushing() {
	if (!d3.event.sourceEvent) return;
	var extent0 = brush.extent(),
	    extent1 = extent0.map(Math.round); // should round it to bins
	
	d3.selectAll("text.reflabel").attr("x",brushX(d3.sum(extent1)/extent1.length));
    };

    refFencoder = d3.urllib.encoder().varname("refExtent"); //.varval(refFextent.map(function(d) { return (d/allDataRaw.length).toFixed(2); }));

    function brushended() {
	if (!d3.event.sourceEvent) return;
	var extent0 = brush.extent(),
	    extent1 = extent0.map(Math.round); // should round it to bins
	
	//d3.selectAll("text.reflabel").attr("x",brushX(d3.sum(extent1)/extent1.length));

	if ((extent1[0] !== refFextent[0]) || (extent1[1] !== refFextent[1]))
	{	    
	refFextent = extent1;

	refFencoder.varval(refFextent.map(function(d) { return (d/allDataRaw.length).toFixed(2); }));

	// initialize new values
	var refF = Array(allDataRaw[0].length);
	var compF = Array(allDataRaw[0].length);
	for (var i=0; i<allDataRaw[0].length; i++) {
            refF[i]= 0;
            compF[i]= 0;
	}
	// loop over each slice of data
	for (var i=0; i<allDataRaw[0].length; i++) {
		for (var k=refFextent[0]; k<refFextent[1]; k++) {
                    refF[i] += allData[k][i];
		}
		for (var k=compFextent[0]; k<compFextent[1]; k++) {
                    compF[i] += allData[k][i];
		}
	}
	
	console.log("redrawing shift");
	var shiftObj = shift(refF,compF,lens,words);
	plotShift(d3.select("#figure01"),shiftObj.sortedMag.slice(0,200),
		  shiftObj.sortedType.slice(0,200),
		  shiftObj.sortedWords.slice(0,200),
		  shiftObj.sortedWordsEn.slice(0,200),
		  shiftObj.sumTypes,
		  shiftObj.refH,
		  shiftObj.compH);
	}

	d3.select(this).transition()
	    .call(brush.extent(extent1))
	    .call(brush.event);

    }

    d3.select(window).on("resize.selecttop",resizetop);
    
    function resizetop() {
	// var that = this;
	// console.log(this);
	// console.log(that);
	// console.log(figwidth);
	figwidth = parseInt(d3.select('#chapters01').style('width')) - margin.left - margin.right,
	width = .775*figwidth;
	
	canvas.attr("width",figwidth);

	x.range([0,width]);
	bgrect.attr("width",width);
	//axes.attr("transform", "translate(" + (0.125 * figwidth) + "," +
	//      ((1 - 0.125 - 0.775) * figheight) + ")");

	//brushX.range([figwidth*.125,width+figwidth*.125]);
	brushX.range([leftOffsetStatic,leftOffsetStatic+width]);
	brush.x(brushX);
	d3.select(".topbrush") //.transition()
	    .call(brush.extent(refFextent))
	    .call(brush.event);
	//brushing();
	//brush.event();
    }
}





