// function drawBookTimeseries(figure,data) {
hedotools.booktimeseries = function() {
    /* takes a d3 selection and draws the lens distribution
       on slide of the stop-window
       -reload data csv's
       -cut out stops words (0 the frequencies)
       -call shift on these frequency vectors */

    // some colors 
    // #1193c0 #759ae8

    var scoredtextparts;

    var margin = {top: 0, right: 80, bottom: 0, left: 40};
    // full width
    var figwidth;
    // fixed height
    var figheight = 350;
    // don't shrink this
    var width;
    // tiny bit of space
    var height = figheight-2;

    var figure;
    var setFigure = function(_) {
	if (!arguments.length) return figure;
	figure = _;
	figwidth = parseInt(figure.style('width'));
	width = figwidth - margin.left - margin.right;
    }

    var data;
    var setData = function(_) {
	if (!arguments.length) return data;
	data = _;
    }
    // console.log(data);

    var drawRefArea;
    var drawCompArea;

    var canvas;
    var axes;
    // var minWindows;
    var x;
    var y;
    // var fulltimeseries;

    drawRefArea = function(extent) {
	var refarea = d3.svg.area()
	    .x(function(d,i) { return x(extent[0]+i); })
	    .y0(height-1)
	    .y1(function(d) { return y(d)+2; });
	
	axes.selectAll(".refarea").remove();

	// console.log(extent);

	var refareaarea = axes.insert("path","div.dummy")
	    .datum(data.slice(extent[0],extent[1]))
	    .attr("class", "refarea")
	    .attr("d", refarea)
	    .attr("fill","#fefe81")
    }

    drawCompArea = function(extent) {
	var comparea = d3.svg.area()
	    .x(function(d,i) { return x(extent[0]+i); })
	    .y0(height-1)
	    .y1(function(d) { return y(d)+2; });
	
	axes.selectAll(".comparea").remove();

	// console.log(extent);

	var compareaarea = axes.insert("path","div.dummy")
	    .datum(data.slice(extent[0],extent[1]))
	    .attr("class", "comparea")
	    .attr("d", comparea)
	    .attr("fill","#fefe81")
    }

    var getFullText;

    // window size:
    // windowDecoder().cached
    // number of pieces of text
    // Math.floor(words.length/windowDecoder().cached/10)
    // have it here as
    // fulltimeseries.length-1
    // get text for timeseries point 20
    // this is chunk pieces 20-24
    // and 15-19

    getFullText = function(point) {
	// var point = 20;
	// console.log("point "+point);

	// var chunkSize = parseInt(windowDecoder().cached)/10;
	// var before = [d3.max([point-5,0]),d3.max([point-1,-1])];
	// var slicePoints = [before[0]*chunkSize,(before[1]+1)*chunkSize];
	// if (before[1] >= (fulltimeseries.length-2)) {
	//     slicePoints[1] = words.length;
	// }
	// // console.log("points before:")
	// // console.log(before);
	// // console.log("slicing from "+slicePoints[0]+" to "+slicePoints[1]);
	// var beforetext = words.slice(slicePoints[0],slicePoints[1]);
	// var after = [point,point+4];
	// var slicePoints = [after[0]*chunkSize,(after[1]+1)*chunkSize];
	// if (after[0] >= (fulltimeseries.length-1)) {
	//     slicePoints[0] = words.length;
	// }
	// if (after[1] >= (fulltimeseries.length-2)) {
	//     slicePoints[1] = words.length;
	// }
	// // console.log("points after:");
	// // console.log(after);
	// // console.log("slicing from "+slicePoints[0]+" to "+slicePoints[1]);
	// var aftertext = words.slice(slicePoints[0],slicePoints[1]);
	// // var aftertext = words.slice();

	d3.select("#puttexthere").selectAll("div").remove();
	d3.select("#puttexthere")
	    .html(scoredtextparts[point]);

	// // d3.select("#puttexthere")
	// //     .append("hr");

	// d3.select("#puttexthere")
	//     .append("p")
	//     .text(aftertext.join(" "));
    }

    var words;

    var showLine = function(show) {
	if (show) {
	    var moviefile = "https://hedonometer.org/data/moviedata/raw/"+movieref+".txt";
	    var pheight;
	    d3.text(moviefile, function (text) {
		// globaltext = text;
		words = text.match(/[\w\@\#\'\&\]\*\-\/\[\=\;]+/gi);
		// globalwords = words;

		// console.log("loaded movie full text");
		d3.select("#fulltextbox")
		    .append("div")
		    .attr("id","fulltextdiv")
		    .append("p")
		    .attr("class","fulltext")
		    .html(text);

		pheight = parseInt(d3.select("#fulltextdiv").style("height"));
	    });

	    var fheight;
	    var moviefile2 = "https://hedonometer.org/data/moviedata/rawer/"+movieref+".html.clean01";
	    d3.text(moviefile2, function (text) {
		// use this to test the total words in this different file
		// lwords = text.match(/[\w\@\#\'\&\]\*\-\/\[\=\;]+/gi); 
		// globalwords2 = lwords;
		

		// make the fulltext global
		fulltext = text;

		// // now parse the whole thing, line by line
		// lines = text.split("\n");
		// kwords = [];
		// klines = [];
		// for (var i=0; i<lines.length; i++) {
		//     line = lines[i];
		//     if (line.slice(0,3) !== "<b>") {
		// 	// console.log(line.slice(0,3));
		// 	newwords = line.match(/[\w\@\#\'\&\]\*\-\/\[\=\;]+/gi); 
		// 	if (newwords != null) {
		// 	    size = newwords.length;
		// 	    linenums = Array(size);
		// 	    while(size--) linenums[size] = i;
		// 	    kwords = kwords.concat(newwords);
		// 	    klines = klines.concat(linenums);
		// 	}
		//     }
		// }
		// globalwords3 = kwords;

		var breakfile = "https://hedonometer.org/data/moviedata/word-vectors/"+windowDecoder().cached+"/"+movieref+"-breaks.csv";
		d3.text(breakfile, function (breaks) {
		    // console.log("loaded movie full uncleaned text");
		    // console.log(breaks);
		    dabreaks = breaks.split(",").map(parseFloat);
		    lines = text.split("\n");
		    dabreaks.push(lines.length)
		    scoredtextparts = Array(fulltimeseries.length);
		    for (var i=0; i<fulltimeseries.length; i++) {
			// console.log(i);
			// console.log(d3.max([0,i-minWindows/2])+" to "+d3.min([i+minWindows/2,dabreaks.length-1]))
			// console.log(dabreaks[d3.max([0,i-minWindows/2])]+" to "+dabreaks[d3.min([i+minWindows/2,dabreaks.length-1])])
			scoredtextparts[i] = lines.slice(dabreaks[d3.max([0,i-minWindows/2])],dabreaks[d3.min([i+minWindows/2,dabreaks.length-1])]).join("\n");
		    }
		    d3.select("#formattedtextdiv")
		     	.html(scoredtextparts[0]);

		    // fheight = parseInt(d3.select("#formattedtextdiv").style("height"));
		});
	    });
	    

	    // console.log("showing line")
	    canvas.append("line")
	    .attr({
		"class": "hoverline",
		"x1": 0,
		"y1": 0,
		"x2": 0,
		"y2": 0,
		"stroke": "#A8A8A8",
		"stroke-width": "1.5px", });

	    // console.log(width);
	    // console.log(data.length);
	    canvas.on("mousemove",function() {
		var m = d3.mouse(this);
		// console.log(m);
		// console.log(y(m[1]/width*data.length));
		// data.length
		// this is the percentage of the text at hover
		// console.log((m[0]-margin.left)/width);
		
		if ( m[0] > margin.left && m[0] < (width+margin.left)) {
		    canvas.selectAll("line.hoverline")
			.attr("x1", m[0])
			.attr("y1", height)
			.attr("x2", m[0])
			.attr("y2", function() { return y(data[Math.floor((m[0]-margin.left)/width*data.length)]); });
		    d3.select("#fulltextdiv").style("top",-(m[0]-margin.left)/width*pheight+"px");
		    d3.select("#formattedtextdiv")
		     	.html(scoredtextparts[Math.floor((m[0]-margin.left)/width*data.length)]);
		    
		}
		});
		     
	}
	else {
	    // console.log("not showing line")
	    canvas.selectAll("line.hoverline").remove();
	    canvas.on("mousemove",null);
	}
    }

    var line;
    var mainline;
    var beglineline;
    var begline;
    var endlineline;
    var endline;
    var area;
    var mainarea;
    var trademark;
    
    var buildForm = function(perc,point) {
	// console.log("building form");
	// console.log(perc);
	// console.log(point);
	// console.log("/api/v1/movieannotation/?format=json&position="+perc+"&movie__title="+movie);
	d3.json("/api/v1/movieannotation/?format=json&position="+perc+"&movie__title="+movie,function(error,json) {
	    console.log(json);
	    globaljson = json.objects;

	    d3.select("#changeMeAlso")
		// .selectAll("input.annotation")
	        // that selection was empty
	        // but the later insert did not work
	        .selectAll("#votingPlaceHolder")
	        // the selection needed to be empty for the .enter()
	        // to actually append nodes
	        .selectAll("#thisdoesnotexist")
		.data(json.objects)
		.enter()
		// .insert("div","#annotationInput")
		.append("div")
		.attr("class","form-group")
		.append("div")
		.attr("class","col-sm-offset-3 col-sm-7")
		.append("div")
		.attr("class","checkbox")
		.attr("id","none")
		.append("label")
	        .html(function(d,i) { return '<input type="checkbox" id="none" name="'+d.id+'" value="off">'+d.annotation+' (votes: '+d.votes+')'; });

	    d3.select("#selectedPoint").attr("style","display: block");
	    
	    d3.select("#popuptext")
		.on("click",function() { 
	            $('#myModal2').modal('show');
		    hedotools.booktimeseries.getFullText(point);
		});

	    // <div class="form-group">
	    //     <div class="col-sm-offset-3 col-sm-7">
	    //       <div class="checkbox" id="none">
	    // 	<label>
	    // 	  <input type="checkbox" id="none" name="34" value="off">Dumbledore dies (votes: 1)
	    // 	</label>
	    //       </div>
	    //     </div>
	    //   </div>
	});
    }

    var highlightExtrema = function() {
	// put a point at each local min/max
	// and flash it, on click do something.

	// capture the indices of all of these points
	var minhapps = [];
	var maxhapps = [];
	var r = 1;
	for (var i=1; i<data.length-1; i++) {
	    if (data[i] > d3.max(data.slice(i-r,i).concat(data.slice(i+1,i+r+1)))) {
		maxhapps.push(i);
	    }
	    if (data[i] < d3.min(data.slice(i-r,i).concat(data.slice(i+1,i+r+1)))) {
		minhapps.push(i);
	    }
	}
	// console.log(minhapps);

	// console.log(y);
	// console.log(data);
	var mincircles  = axes.selectAll("circle.mincircle")
	    .data(minhapps)
	    .enter()
	    .append("circle")
    	    .attr("cx",function(d,i) { return x(d);})
    	    .attr("cy",function(d,i) { return y(data[d]);})
    	    .attr("fill","#1193c0")
    	    .attr("class","mincircle")	
    	    .attr("r",6)
	    .on("click",function(d,i) {
		// console.log("click on min element number");
		// console.log(d);
		// remove them all
		d3.selectAll("circle.mincircle").remove();
		d3.selectAll("circle.maxcircle").remove();
		clearInterval(minsmall);
		clearInterval(minbig);
		clearInterval(maxsmall);
		clearInterval(maxbig);
		d3.select("#selectPoint").classed("has-error",false);
		d3.select("#selectPoint").classed("has-success",true);
		d3.select("#selectPointIcon").classed("glyphicon-remove",false);
		d3.select("#selectPointIcon").classed("glyphicon-ok",true);
		d3.select("#inputSuccess3").attr("value",(d/data.length*100).toFixed(2)+"%");
		buildForm((d/data.length*100).toFixed(2)+"%",d);
	    });

	var maxcircles  = axes.selectAll("circle.maxcircle")
	    .data(maxhapps)
	    .enter()
	    .append("circle")
    	    .attr("cx",function(d,i) { return x(d);})
    	    .attr("cy",function(d,i) { return y(data[d]);})
    	    .attr("fill","red")
    	    .attr("class","maxcircle blink")	
    	    .attr("r",6)
	    .on("click",function(d,i) {
		// console.log("click on max element number");
		// console.log(d);
		// remove them all
		d3.selectAll("circle.mincircle").remove();
		d3.selectAll("circle.maxcircle").remove();
		clearInterval(minsmall);
		clearInterval(minbig);
		clearInterval(maxsmall);
		clearInterval(maxbig);
		d3.select("#selectPoint").classed("has-error",false);
		d3.select("#selectPoint").classed("has-success",true);
		d3.select("#selectPointIcon").classed("glyphicon-remove",false);
		d3.select("#selectPointIcon").classed("glyphicon-ok",true);
		d3.select("#inputSuccess3").attr("value",(d/data.length*100).toFixed(2)+"%");
		buildForm((d/data.length*100).toFixed(2)+"%",d);
	    });

	var minsmall = setInterval(function() { d3.selectAll("circle.mincircle").transition().attr("r",6); },1000);
	var minbig = setInterval(function() { setTimeout(function() { d3.selectAll("circle.mincircle").transition().attr("r",7); }, 500); },1000);
	var maxsmall = setInterval(function() { d3.selectAll("circle.maxcircle").transition().attr("r",6); },1000);
	var maxbig = setInterval(function() { setTimeout(function() { d3.selectAll("circle.maxcircle").transition().attr("r",7); }, 500); },1000);
    }

    var hovergroup;

    var hidehover = function() {
	hovergroup.style({
	    "visibility": "hidden",
	});
    }

    var plot = function() {

	hovergroup = figure.append("div").attr({
	    "class": "hoverinfogroup",
	    // "transform": "translate("+(x+hoverboxxoffset+margin.left)+","+(d3.min([d3.max([0,y-hoverboxheight/2-hoverboxyoffset]),height-hoverboxheight]))+")", 
	})
	    .style({
		"position": "absolute",
		"top": "100px",
		"left": "100px",
		"visibility": "hidden",
	    });


	// remove an old figure if it exists
	figure.select(".canvas").remove();

	canvas = figure.append("svg")
        // full width and height
	    .attr("width",figwidth)
	    .attr("height",figheight)
	    .attr("class","canvas");

	//console.log(data.length);

	// create the x and y axis
	x = d3.scale.linear()
	//.domain([d3.min(lens),d3.max(lens)])
        // map from the start of the timeseries point to the max
	    .domain([0,data.length-1])
	    .range([0,width]);
	
	// use d3.layout http://bl.ocks.org/mbostock/3048450
	// data = d3.layout.histogram()
	//     .bins(x.ticks(65))
	//     (lens);

	// linear scale function
	y =  d3.scale.linear()
	    .domain([d3.min(data),d3.max(data)])
	    .range([height-50, 50]); 

	// console.log([d3.min(data),d3.max(data)])

	// create the axes themselves
	axes = canvas.append("g")
	    .attr("transform", "translate(" + (margin.left) + "," +
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

	line = d3.svg.line()
	    .x(function(d,i) { return x(i+minWindows/2); })
	    .y(function(d) { return y(d); })
	    .interpolate("cardinal");
	// .interpolate("linear");

	// console.log(data.slice(minWindows/2,data.length-minWindows/2));
	mainline = axes.append("path")
	    .datum(data.slice(minWindows/2,data.length-minWindows/2))
	    .attr("class", "line")
	    .attr("d", line)
	    .attr("stroke","black")
	    .attr("stroke-width",3)
	    .attr("fill","none");

	beglineline = d3.svg.line()
	    .x(function(d,i) { return x(i); })
	    .y(function(d) { return y(d); })
	    .interpolate("cardinal");
	// .interpolate("linear");

	// console.log(data.slice(0,minWindows/2+1));
	begline = axes.append("path")
	    .datum(data.slice(0,minWindows/2+1))
	    .attr("class", "line")
	    .attr("d", beglineline)
	    .attr("stroke","black")
	    .attr("stroke-dasharray","2,2")
	    .attr("stroke-width",3)
	    .attr("fill","none");

	endlineline = d3.svg.line()
	    .x(function(d,i) { return x(i+data.length-minWindows/2-1); })
	    .y(function(d) { return y(d); })
	    .interpolate("cardinal");
	// .interpolate("linear");

	// endtimeseries.unshift(data[data.length-1]);

	// console.log(data.slice(data.length-6,data.length));
	endline = axes.append("path")
	    .datum(data.slice(data.length-6,data.length))
	    .attr("class", "line")
	    .attr("d", endlineline)
	    .attr("stroke","black")
	    .attr("stroke-dasharray","2,2")
	    .attr("stroke-width",3)
	    .attr("fill","none");

	area = d3.svg.area()
	    .x(function(d,i) { return x(i+minWindows/2); })
	    .y0(height-1)
	    .y1(function(d) { return y(d); });

	mainarea = axes.append("path")
            .datum(data.slice(minWindows/2,data.length-minWindows/2))
            .attr("class", "area")
            .attr("d", area)
            .attr("fill","#D3D3D3");

	axes.append("div").attr("class","dummy");

	drawRefArea(refFextent);
	// d3.selectAll(".refarea").attr("visibility","hidden");

	drawCompArea(compFextent);
	// d3.selectAll(".comparea").attr("visibility","hidden");

	// console.log(d3.mean(data));
	var avhapps = d3.mean(data.slice(minWindows/2,data.length-minWindows/2));

	var linearline = d3.svg.line()
	    .x(function(d,i) { return x(d.index); })
	    .y(function(d) { return y(d.value); })
	    .interpolate("linear");

	var averageline = axes.append("path")
	    .datum([
		{ "index": 0, 
		  "value": avhapps, },
		{ "index": data.length-1,
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
	var minhapps = d3.min(data.slice(minWindows/2,data.length-minWindows/2));
	// console.log(d3.max(data));
	var maxhapps = d3.max(data.slice(minWindows/2,data.length-minWindows/2));
	for (var i=0; i<data.slice(minWindows/2,data.length-minWindows/2).length; i++) {
	    if (data.slice(minWindows/2,data.length-minWindows/2)[i] === minhapps) {
		var minhappsindex = i;
	    }
	    if (data.slice(minWindows/2,data.length-minWindows/2)[i] === maxhapps) {
		var maxhappsindex = i;
	    }
	}

	var mincircle  = axes.append("circle")
    	    .attr("cx",x(minhappsindex+minWindows/2))
	    .attr("cy",y(minhapps))
    	    .attr("fill","#1193c0")
	// .attr("stroke","#1193c0")
	// .attr("stroke-width",0.5)
    	    .attr("r",4);


	var minline = axes.append("path")
	    .datum([
		{ "index": minhappsindex+minWindows/2, 
		  "value": minhapps, },
		{ "index": data.length-1, 
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
    	    .attr("cx",x(maxhappsindex+minWindows/2))
	    .attr("cy",y(maxhapps))
    	    .attr("fill","#1193c0")
	// .attr("stroke","#1193c0")
	// .attr("stroke-width",0.5)
    	    .attr("r",4);

	var maxline = axes.append("path")
	    .datum([
		{ "index": maxhappsindex+minWindows/2, 
		  "value": maxhapps, },
		{ "index": data.length-1, 
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

	// d3.select(window).on("resize.booktimeseries",resize);

	trademark = axes.append("text")
	    .attr({ "x": 3,
		    "y": height-7,
		    "fill": "#606060",
		    // "font-weight": "bold",
		    "font-size": ".8em",
		    "text-anchor": "start",
		  })
	    .text("visualization by @hedonometer team and @andyreagan");
	
	function resize() {
	    figwidth = parseInt(d3.select('#chapters03').style('width')),
	    width = .775*figwidth;

	    canvas.attr("width",figwidth);

	    x.range([0,width]);

	    mainarea.attr("d",area);
	    mainline.attr("d",line);

	    bgrect.attr("width",width);
	}
    }

    var opublic = { setFigure: setFigure,
		    setData: setData,
		    plot: plot,
		    drawRefArea: drawRefArea,
		    drawCompArea: drawCompArea,
		    highlightExtrema: highlightExtrema,
		    showLine: showLine,
		    getFullText: getFullText,
		  }

    return opublic;

}();





