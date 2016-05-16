function selectChapter(figure,numSections) {
/* takes a d3 selection and draws the lens distribution
   on slide of the stop-window
     -reload data csv's
     -cut out stops words (0 the frequencies)
     -call shift on these frequency vectors */


    var margin = {top: 0, right: 0, bottom: 0, left: 0},
    axeslabelmargin = {top: 0, right: 80, bottom: 0, left: 40},
    figwidth = parseInt(d3.select('#chapters02').style('width')) - margin.left - margin.right,
    figheight = 70 - margin.top - margin.bottom,
    width = figwidth - axeslabelmargin.left - axeslabelmargin.right,
    height = .775*figheight-20,
    leftOffsetStatic = axeslabelmargin.left;

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
    
    // use d3.layout http://bl.ocks.org/mbostock/3048450
    // data = d3.layout.histogram()
    //     .bins(x.ticks(65))
    //     (lens);

    // linear scale function
    var y =  d3.scale.linear()
	.domain([0,1])
	.range([height, 0]); 

    // create the axes themselves
    var axes = canvas.append("g")
	.attr("transform", "translate(" + (axeslabelmargin.left) + "," +
	      ((1 - 0.125 - 0.775 -0.095) * figheight) + ")")
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

    var xAxis = create_xAxis()
	.innerTickSize(6)
	.outerTickSize(0);

    var xAxisHandle = axes.append("g")
	.attr("class", "x axis ")
	.attr("font-size", "12.0px")
	.attr("transform", "translate(0," + (height) + ")")
	.call(xAxis);

    d3.selectAll(".tick line").style({'stroke':'black'});

    // create the clip boundary
    var clip = axes.append("svg:clipPath")
	.attr("id","clip")
	.append("svg:rect")
	.attr("x",0)
	.attr("y",80)
	.attr("width",width)
	.attr("height",height-30);

    var unclipped_axes = axes;
 
    var xlabel = canvas.append("text")
	.text("Percentage of book")
	.attr("class","axes-text")
	.attr("x",width/2+(figwidth-width)/2)
	.attr("y",figheight)
	.attr("font-size", "12.0px")
	.attr("fill", "#000000")
	.attr("style", "text-anchor: middle;");

    var brushX = d3.scale.linear()
        .domain([0,fulltimeseries.length-1])
        .range([axeslabelmargin.left,width+axeslabelmargin.left]);

    canvas.append("text")
	.text("Comparison")
	.attr("class","complabel")
	.attr("x",brushX((compFextent[0]+compFextent[1])/2))
	.attr("y",figheight-48)
	.attr("font-size", "12.0px")
	.attr("fill", "#000000")
	.attr("style", "text-anchor: middle;");
    
    var brush = d3.svg.brush()
        .x(brushX)
        .extent(compFextent)
        .on("brush",brushing)
        .on("brushend",brushended);

    compFextentStrs = compFextent.map(function(d) { return (d/(fulltimeseries.length-1)*100).toFixed(0); });
    // console.log(compFextentStrs);

    d3.select("#compInput1").attr("value",compFextentStrs[0]+"%");
    d3.select("#compInput2").attr("value",compFextentStrs[1]+"%");

    var gBrush = canvas.append("g")
        .attr("class","bottombrush")
        .call(brush)
        .call(brush.event);

    gBrush.selectAll("rect")
        .attr("height",height)
        .attr("y",0)
	// .style({'stroke-width':'2','stroke':'rgb(100,100,100)','opacity': 0.35})
	// .attr("fill", "rgb(90,90,90)")
        // .on("mouseout",function() { d3.selectAll(".comparea").attr("visibility","hidden"); })
        .on("mouseover",function() { d3.selectAll(".comparea").attr("visibility","visible"); });

    function brushing() {
	if (!d3.event.sourceEvent) return;
	var extent0 = brush.extent(),
	    extent1 = extent0.map(Math.round); // should round it to bins

	hedotools.booktimeseries.drawCompArea(extent1);
	compFextentStrs = extent1.map(function(d) { return (d/(fulltimeseries.length-1)*100).toFixed(0); });
	// console.log(compFextentStrs);

 	d3.select("#compInput1").attr("value",compFextentStrs[0]+"%");
	d3.select("#compInput2").attr("value",compFextentStrs[1]+"%");
	
	d3.selectAll("text.complabel").attr("x",brushX(d3.sum(extent1)/extent1.length));
    };

    compFencoder = d3.urllib.encoder().varname("compExtent"); //.varval(compFextent.map(function(d) { return (d/allDataRaw.length).toFixed(2); }));

    function brushended() {
	if (!d3.event.sourceEvent) return;
	var extent0 = brush.extent(),
	    extent1 = extent0 .map(Math.round); // should round it to bins

	//d3.selectAll("text.complabel").attr("x",brushX(d3.sum(extent1)/extent1.length));

	if ((extent1[0] !== compFextent[0]) || (extent1[1] !== compFextent[1]))
	{	    

	compFextent = extent1;

	compFencoder.varval(compFextent.map(function(d) { return (d/(fulltimeseries.length-1)).toFixed(2); }));

	}

	d3.select(this).transition()
	    .call(brush.extent(extent1))
	    .call(brush.event);
    }

    // d3.select(window).on("resize.selectbottom",resizebottom);
    
    function resizebottom() {
	figwidth = parseInt(d3.select("#chapters03").style('width')) - margin.left - margin.right,
	width = .775*figwidth;

	canvas.attr("width",figwidth);

	x.range([0,width]);
	bgrect.attr("width",width);
	//axes.attr("transform", "translate(" + (0.125 * figwidth) + "," +
	//      ((1 - 0.125 - 0.775) * figheight) + ")");
	
	//create_xAxis.scale(x);
	//xAxisHandle.call(xAxis);
	canvas.select(".x.axis").call(xAxis);
	
	xlabel.attr("x",(leftOffsetStatic+width/2));

	d3.selectAll(".tick line").style({'stroke':'black'});

	//brushX.range([figwidth*.125,width+figwidth*.125]);
	brushX.range([leftOffsetStatic,leftOffsetStatic+width]);
	brush.x(brushX);
	d3.select(".bottombrush") //.transition()
	    .call(brush.extent(compFextent))
	    .call(brush.event);
	//brushing();
	//brush.event();
    }
}





