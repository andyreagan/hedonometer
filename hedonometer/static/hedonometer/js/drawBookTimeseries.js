function drawBookTimeseries(figure,data) {
/* takes a d3 selection and draws the lens distribution
   on slide of the stop-window
     -reload data csv's
     -cut out stops words (0 the frequencies)
     -call shift on these frequency vectors */

    // some colors
    // #1193c0 #759ae8

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
    axeslabelmargin = {top: 0, right: 80, bottom: 0, left: 40},
    // full width
    figwidth = parseInt(d3.select('#chapters03').style('width')) - margin.left - margin.right,
    // fixed height
    figheight = 200 - margin.top - margin.bottom,
    // don't shrink this
    width = figwidth - axeslabelmargin.left - axeslabelmargin.right,
    // tiny bit of space
    height = figheight-2;

    // console.log(data);

    // remove an old figure if it exists
    figure.select(".canvas").remove();

    var canvas = figure.append("svg")
        // full width and height
	.attr("width",figwidth)
	.attr("height",figheight)
	.attr("id","booktimeseriessvg")
	.attr("class","canvas");

    //console.log(data.length);

    // create the x and y axis
    var x = d3.scale.linear()
	//.domain([d3.min(lens),d3.max(lens)])
        // map from the start of the timeseries point to the max
	.domain([-minWindows/2,data.length+minWindows/2-1])
	.range([0,width]);
    
    // use d3.layout http://bl.ocks.org/mbostock/3048450
    // data = d3.layout.histogram()
    //     .bins(x.ticks(65))
    //     (lens);

    // linear scale function
    var y =  d3.scale.linear()
	.domain([d3.min(data),d3.max(data)])
	.range([height-10, 10]); 

    // console.log([d3.min(data),d3.max(data)])

    // create the axes themselves
    var axes = canvas.append("g")
	.attr("transform", "translate(" + (axeslabelmargin.left) + "," +
	      ((0) * figheight) + ")") // 99 percent
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
	    .ticks(5)
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

    // // create the clip boundary
    // var clip = axes.append("svg:clipPath")
    // 	.attr("id","clip")
    // 	.append("svg:rect")
    // 	.attr("x",0)
    // 	.attr("y",0)
    // 	.attr("width",width)
    // 	.attr("height",height);

    // var unclipped_axes = axes;

    // axes = axes.append("g")
    // 	.attr("clip-path","url(#clip)");

    var line = d3.svg.line()
	.x(function(d,i) { return x(i); })
	.y(function(d) { return y(d); })
	.interpolate("cardinal");
	// .interpolate("linear");

    var mainline = axes.append("path")
	.datum(data)
	.attr("class", "line")
	.attr("d", line)
	.attr("stroke","black")
	.attr("stroke-width",3)
	.attr("fill","none");

    var beglineline = d3.svg.line()
	.x(function(d,i) { return x(i-minWindows/2); })
	.y(function(d) { return y(d); })
	.interpolate("cardinal");
	// .interpolate("linear");

    begtimeseries.push(data[0]);
    
    var begline = axes.append("path")
	.datum(begtimeseries)
	.attr("class", "line")
	.attr("d", beglineline)
	.attr("stroke","black")
	.attr("stroke-dasharray","2,2")
	.attr("stroke-width",3)
	.attr("fill","none");

    var endlineline = d3.svg.line()
	.x(function(d,i) { return x(i+data.length-1); })
	.y(function(d) { return y(d); })
	.interpolate("cardinal");
	// .interpolate("linear");

    endtimeseries.unshift(data[data.length-1]);

    var endline = axes.append("path")
	.datum(endtimeseries)
	.attr("class", "line")
	.attr("d", endlineline)
	.attr("stroke","black")
	.attr("stroke-dasharray","2,2")
	.attr("stroke-width",3)
	.attr("fill","none");

    var area = d3.svg.area()
	.x(function(d,i) { return x(i); })
	.y0(height-1)
	.y1(function(d) { return y(d); });

    var mainarea = axes.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .attr("fill","#D3D3D3");

    axes.append("div").attr("class","dummy");

    drawRefArea = function drawRefArea(extent) {

	var refarea = d3.svg.area()
	    .x(function(d,i) { return x(extent[0]+i-minWindows/2); })
	    .y0(height-1)
	    .y1(function(d) { return y(d)+2; });
	
	axes.selectAll(".refarea").remove();

	console.log(extent);

	var refareaarea = axes.insert("path","div.dummy")
            .datum(fulltimeseries.slice(extent[0],extent[1]))
            .attr("class", "refarea")
            .attr("d", refarea)
            .attr("fill","#fefe81")
    }

    drawRefArea(refFextent);
    // d3.selectAll(".refarea").attr("visibility","hidden");

    drawCompArea = function drawCompArea(extent) {

	var comparea = d3.svg.area()
	    .x(function(d,i) { return x(extent[0]+i-minWindows/2-1); })
	    .y0(height-1)
	    .y1(function(d) { return y(d)+2; });
	
	axes.selectAll(".comparea").remove();

	console.log(extent);

	var compareaarea = axes.insert("path","div.dummy")
            .datum(fulltimeseries.slice(extent[0]-1,extent[1]))
            .attr("class", "comparea")
            .attr("d", comparea)
            .attr("fill","#fefe81")
    }

    drawCompArea(compFextent);
    // d3.selectAll(".comparea").attr("visibility","hidden");

    // console.log(d3.mean(data));
    var avhapps = d3.mean(data);

    var linearline = d3.svg.line()
	.x(function(d,i) { if (i===0) { return x(d.index); } else { return x(d.index)+3 } })
	.y(function(d) { return y(d.value); })
	.interpolate("linear");

    var averageline = axes.append("path")
	.datum([
	    { "index": 0, 
	       "value": avhapps, },
	    { "index": data.length+minWindows/2, 
	       "value": avhapps, }]
	      )
	.attr("class", "line")
	.attr("d",linearline)
	.attr("stroke","#1193c0")
	.attr("stroke-dasharray","5,5")
	.attr("stroke-width",0.5)
	.attr("fill","none");

    var averagetext1 = axes.append("text")
	.attr({ "x": width+5,
		"y": y(avhapps)-3,
		"fill": "#606060",
		"text-anchor": "start",
	      })
	    .text("Average");

    var averagetext2 = axes.append("text")
	.attr({ "x": width+5,
		"y": y(avhapps)+12,
		"fill": "#606060",
		"font-weight": "bold",
		"text-anchor": "start",
	      })
	    .text(avhapps.toFixed(2));

    // console.log(d3.min(data));
    var minhapps = d3.min(data);
    // console.log(d3.max(data));
    var maxhapps = d3.max(data);
    for (var i=0; i<data.length; i++) {
	if (data[i] === minhapps) {
	    var minhappsindex = i;
	}
	if (data[i] === maxhapps) {
	    var maxhappsindex = i;
	}
    }

    var mincircle  = axes.append("circle")
    	.attr("cx",x(minhappsindex))
	.attr("cy",y(minhapps))
    	.attr("fill","#1193c0")
	// .attr("stroke","#1193c0")
	// .attr("stroke-width",0.5)
    	.attr("r",4);


    var minline = axes.append("path")
	.datum([
	    { "index": minhappsindex, 
	       "value": minhapps, },
	    { "index": data.length+minWindows/2, 
	       "value": minhapps, }]
	      )
	.attr("class", "line")
	.attr("d",linearline)
	.attr("stroke","#1193c0")
	.attr("stroke-width",0.5)
	.attr("fill","none");

    var mintext1 = axes.append("text")
	.attr({ "x": width+5,
		"y": y(minhapps)-3,
		"fill": "#606060",
		"text-anchor": "start",
	      })
	    .text("Least Happy");

    var mintext2 = axes.append("text")
	.attr({ "x": width+5,
		"y": y(minhapps)+12,
		"fill": "#606060",
		"font-weight": "bold",
		"text-anchor": "start",
	      })
	    .text(minhapps.toFixed(2));

    var maxcircle  = axes.append("circle")
    	.attr("cx",x(maxhappsindex))
	.attr("cy",y(maxhapps))
    	.attr("fill","#1193c0")
	// .attr("stroke","#1193c0")
	// .attr("stroke-width",0.5)
    	.attr("r",4);

    var maxline = axes.append("path")
	.datum([
	    { "index": maxhappsindex, 
	       "value": maxhapps, },
	    { "index": data.length+minWindows/2, 
	       "value": maxhapps, }]
	      )
	.attr("class", "line")
	.attr("d",linearline)
	.attr("stroke","#1193c0")
	.attr("stroke-width",0.5)
	.attr("fill","none");

    var mintext1 = axes.append("text")
	.attr({ "x": width+5,
		"y": y(maxhapps),
		"fill": "#606060",
		"text-anchor": "start",
	      })
	    .text("Happiest");

    var maxtext2 = axes.append("text")
	.attr({ "x": width+5,
		"y": y(maxhapps)+15,
		"fill": "#606060",
		"font-weight": "bold",
		"text-anchor": "start",
	      })
	    .text(maxhapps.toFixed(2));

    d3.select(window).on("resize.booktimeseries",resize);
    
    function resize() {
	figwidth = parseInt(d3.select('#chapters03').style('width')) - margin.left - margin.right,
	width = .775*figwidth;

	canvas.attr("width",figwidth);

	x.range([0,width]);

	mainarea.attr("d",area);
	mainline.attr("d",line);

	bgrect.attr("width",width);
    }
}





