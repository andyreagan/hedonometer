 function drawLens(figure,lens) {
/* takes a d3 selection and draws the lens distribution
   on slide of the stop-window
     -reload data csv's
     -cut out stops words (0 the frequencies)
     -call shift on these frequency vectors */


    var margin = {top: 0, right: 0, bottom: 0, left: 0},
    figwidth = parseInt(d3.select('#lens01').style('width')) - margin.left - margin.right,
    figheight = 150 - margin.top - margin.bottom,
    width = .775*figwidth,
    height = .775*figheight-10,
    leftOffsetStatic = 0.125*figwidth;

    // remove an old figure if it exists
    figure.select(".canvas").remove();

    var canvas = figure.append("svg")
	.attr("width",figwidth)
	.attr("height",figheight)
	.attr("id","lenssvg")
	.attr("class","canvas");


    // create the x and y axis
    var x = d3.scale.linear()
	//.domain([d3.min(lens),d3.max(lens)])
	.domain([1.00,9.00])
	.range([0,width]);
    
    // use d3.layout http://bl.ocks.org/mbostock/3048450
    var data = d3.layout.histogram()
        .bins(x.ticks(65))
        (lens);

    // linear scale function
    var y =  d3.scale.linear()
	.domain([0,d3.max(data,function(d) { return d.y; } )])
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
	.attr("fill", "#FFFFF0");

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

    // draw the axes
    var yAxis = create_yAxis()
	.innerTickSize(6)
	.outerTickSize(0);

    axes.append("g")
	.attr("class", "top")
	.attr("transform", "translate(0,0)")
	.attr("font-size", "12.0px")
	.call(yAxis);

    var xAxis = create_xAxis()
	.innerTickSize(6)
	.outerTickSize(0);

    axes.append("g")
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
	.attr("height",height-80);

    var unclipped_axes = axes;
 
    //axes = axes.append("g")
	//.attr("clip-path","url(#clip)");

    canvas.append("text")
	.text("Num Words")
	.attr("class","axes-text")
	.attr("x",(figwidth-width)/4)
	.attr("y",figheight/2+30)
	.attr("font-size", "12.0px")
	.attr("fill", "#000000")
	.attr("transform", "rotate(-90.0," + (figwidth-width)/4 + "," + (figheight/2+30) + ")");

    var xlabel = canvas.append("text")
	.text("Word score")
	.attr("class","axes-text")
	.attr("x",width/2+(figwidth-width)/2)
	.attr("y",figheight)
	.attr("font-size", "12.0px")
	.attr("fill", "#000000")
	.attr("style", "text-anchor: middle;");

    var lensMean = d3.mean(lens);

    var bar = axes.selectAll(".distrect")
        .data(data)
        .enter()
        .append("g")
        .attr("class","distrect")
        .attr("fill",function(d,i) { if (d.x > lensMean) {return "#D3D3D3";} else { return "#D3D3D3";}})
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    var mainrect = bar.append("rect")
	.attr("x", 1)
	.attr("width", x(data[0].dx+1)-2 )
	.attr("height", function(d) { return height - y(d.y); });

    var line = d3.svg.line()
	.x(function(d,i) { return x(d.x); })
	.y(function(d) { return y(d.y); })
	.interpolate("linear");

    var mainline = axes.append("path")
	.datum(data)
	.attr("class", "line")
	.attr("d", line)
	.attr("stroke","black")
	.attr("stroke-width",3)
	.attr("fill","none");

    //console.log(x(d3.min(lens)));

    var brushX = d3.scale.linear()
        .domain([1,9])
        .range([figwidth*.125,width+figwidth*.125]);
    
    var brush = d3.svg.brush()
        .x(brushX)
        .extent(lensExtent)
        .on("brushend",brushended);

    var gBrush = canvas.append("g")
        .attr("class","lensbrush")
        .call(brush)
        .call(brush.event);

    gBrush.selectAll("rect")
        .attr("height",height)
        .attr("y",15)
	.style({'stroke-width':'2','stroke':'rgb(100,100,100)','opacity': 0.95})
	.attr("fill", "#FCFCFC");

     //console.log(lensExtent);

     lensencoder = d3.urllib.encoder().varname("lens"); //.varval(lensExtent);

     function brushended() {
	if (!d3.event.sourceEvent) return;
	var extent0 = brush.extent(),
	    extent1 = extent0;
	// round to nearest tenth (set 4 to 10)
	// round to nearest quarter

	if ((extent1[0] !== lensExtent[0]) || (extent1[1] !== lensExtent[1]))
	{	    

	    lensExtent = [Math.round(extent1[0]*4)/4,Math.round(extent1[1]*4)/4];

	    hedotools.shifter._stoprange(lensExtent);

	    console.log("redrawing timeserires with new lens");
	    var timeseries = computeHapps();
	    drawBookTimeseries(d3.select("#chapters03"),timeseries);
	    
	    console.log("redrawing shift with new lens");
	    hedotools.shifter.stop();
	    hedotools.shifter.shifter();
	    var happysad = hedotools.shifter._compH() > hedotools.shifter._refH() ? "happier" : "less happy";
	    var shifttext = ["Why comparison section is "+happysad+" than reference section:","Reference section's happiness: "+hedotools.shifter._refH().toFixed(2),"Comparison section's happiness: "+hedotools.shifter._compH().toFixed(2)]
	    hedotools.shifter.setText(shifttext).plot();

	    // set the lens extent in the browser, if it didn't already exist
	    // break down the current window.location
	}

	d3.select(this).transition()
	    .call(brush.extent(lensExtent))
	    .call(brush.event);

	lensencoder.varval(lensExtent);
    }

    d3.select(window).on("resize.selectlens",resizelens);
    
    function resizelens() {
	figwidth = parseInt(d3.select("#lens01").style('width')) - margin.left - margin.right,
	width = .775*figwidth;

	canvas.attr("width",figwidth);

	x.range([0,width]);
	bgrect.attr("width",width);
	//axes.attr("transform", "translate(" + (0.125 * figwidth) + "," +
	//      ((1 - 0.125 - 0.775) * figheight) + ")");
	
	mainline.attr("d",line);

	//create_xAxis.scale(x);
	//xAxisHandle.call(xAxis);
	canvas.select(".x.axis").call(xAxis);

	canvas.selectAll(".distrect").attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
	
	// xlabel.attr("x",(leftOffsetStatic+width/2));

	d3.selectAll(".tick line").style({'stroke':'black'});

	// //brushX.range([figwidth*.125,width+figwidth*.125]);
	brushX.range([leftOffsetStatic,leftOffsetStatic+width]);
	brush.x(brushX);
	d3.select(".lensbrush") //.transition()
	    .call(brush.extent(lensExtent))
	    .call(brush.event);
	//brushing();
	//brush.event();
    }

}





