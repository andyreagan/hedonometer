hedotools.barchartoncall = function() {
    var test = function(d,i) {
	// console.log(i);
	i = indices[i];
	if (stateSelType) {
	    shiftComp = i;
	    d3.select(".complabel").text(allData[i].name);
	    compencoder.varval(allData[i].name);
	}
	else {
	    shiftRef = i;
	    d3.select(".reflabel").text(allData[i].name);
	    refencoder.varval(allData[i].name);
	}

	if (shiftRef !== shiftComp) {
	    var shiftObj = hedotools.shifter.shift(allData[shiftRef].freq,allData[shiftComp].freq,lens,words);
	    shiftObj.setfigure(d3.select('#shift01')).setText("").plot();
	}
    }
    var opublic = { test: test,
		  };
    return opublic;
}();

// make the plot
hedotools.barchart = function() {
    var figure;

    var setfigure = function(_) {
	// console.log("setting figure");
	figure = _;
	return hedotools.barchart;
    }

    var data;
    var datanames;
    var geodata;

    var setdata = function(a,b) {
	data = a;
	geodata = b;
	datanames = Array(geodata.length);
	for (var i=0; i<geodata.length; i++) {
	    datanames[i] = geodata[i].properties.name;
	}
	return hedotools.barchart;
    }
    
    var _data = function(_) {
	if (!arguments.length) return data;
	data = _;
	return hedotools.barchart;
    }

    var _datanames = function(_) {
	if (!arguments.length) return datanames;
	datanames = _;
	return hedotools.barchart;
    }
    
    var figheight = 730;
    var _figheight = function(_) {
	if (!arguments.length) return figheight;
	figheight = _;
	return hedotools.barchart;
    }

    var sortedStates;
    var getSorted = function(_) {
	if (!arguments.length) return sortedStates.map(function(d) { return d[2]; });
	if (_) {
	    return sortedStates.map(function(d,i) { return (i+1)+". "+d[2]; });
	}
	else {
	    return sortedStates.map(function(d) { return d[2]; });
	}
	return hedotools.barchart;
    }


    var plot = function() {
	/* plot the bar chart

	   -take a d3 selection, and draw the bar chart SVG on it
	   -requires the magnitude for each state, and the geojson
           with the names

	*/
	var margin = {top: 0, right: 0, bottom: 0, left: 0};
	var axeslabelmargin = {top: 0, right: 0, bottom: 50, left: 0};
	var figwidth = parseInt(figure.style('width')) - margin.left - margin.right;
	// aspectRatio = 1.9,
	// figheight = parseInt(d3.select('#barChart').style('width'))*aspectRatio - margin.top - margin.bottom,
	var width = figwidth-axeslabelmargin.left-axeslabelmargin.right;
	var height = figheight-axeslabelmargin.top-axeslabelmargin.bottom;
	var figcenter = width/2;
	var leftOffsetStatic = axeslabelmargin.left;

	// do the sorting
	var indices = Array(data.length);
	for (var i = 0; i < data.length; i++) { indices[i] = i; }
	// sort by abs magnitude
	// indices.sort(function(a,b) { return Math.abs(data[a]) < Math.abs(data[b]) ? 1 : Math.abs(data[a]) > Math.abs(data[b]) ? -1 : 0; });
	// sort by magnitude, parity preserving
	indices.sort(function(a,b) { return data[a] < data[b] ? 1 : data[a] > data[b] ? -1 : 0; });
	sortedStates = Array(data.length);
	for (var i = 0; i < data.length; i++) { sortedStates[i] = [i,indices[i],datanames[indices[i]],data[indices[i]]]; }
	// console.log(sortedStates);

	// remove an old figure if it exists
	figure.select(".canvas").remove();

	var canvas = figure.append("svg")
	    .attr("width",figwidth)
	    .attr("height",figheight)
	    .attr("class","canvas")
	    .attr("id","barchartsvg");

	// x scale, maps all the data to 
	var absDataMax = d3.max([d3.max(data),-d3.min(data)]);
	var x = d3.scale.linear()
	    .domain([-absDataMax,absDataMax])
	    .range([5,width-10]);

	// linear scale function
	var y =  d3.scale.linear()
	    .domain([data.length,1])
	    .range([height-20, 5]); 

	// // zoom object for the axes
	// var zoom = d3.behavior.zoom()
	// 	.y(y) // pass linear scale function
	//     // .translate([10,10])
	// 	.scaleExtent([1,1])
	// 	.on("zoom",zoomed);

	// create the axes themselves
	var axes = canvas.append("g")
	    .attr("transform", "translate(" + (axeslabelmargin.left) + "," +
		  (axeslabelmargin.top) + ")")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class", "main");
	// .call(zoom);

	// create the axes background
	// var bgrect = axes.append("svg:rect")
	// 	.attr("width", width)
	// 	.attr("height", height)
	// 	.attr("class", "bg")
	// 	.style({'stroke-width':'2','stroke':'rgb(0,0,0)'})
	// 	.attr("fill", "#FCFCFC");

	// create the x axes
	var bgrect = axes.append("svg:line")
    	    .attr("x1", width)
    	    .attr("y1", height)
    	    .attr("x2", axeslabelmargin.left)
    	    .attr("y2", height)
    	//.attr("class", "bg")
    	    .style({'stroke-width':'1','stroke':'rgb(10,10,10)'});
    	//.attr("fill", "#FCFCFC");

	// axes creation functions
	var create_xAxis = function() {
	    return d3.svg.axis()
		.ticks(4)
		.scale(x)
		.orient("bottom"); }

	// // axis creation function
	// var create_yAxis = function() {
	// 	return d3.svg.axis()
	// 	    .scale(y) //linear scale function
	// 	    .orient("left"); }

	// // draw the axes
	// var yAxis = create_yAxis()
	// 	.innerTickSize(6)
	// 	.outerTickSize(0);

	// axes.append("g")
	// 	.attr("class", "y axis ")
	// 	.attr("font-size", "14.0px")
	// 	.attr("transform", "translate(0,0)")
	// 	.call(yAxis);

	var xAxis = create_xAxis()
	    .innerTickSize(6)
	    .outerTickSize(0);

	axes.append("g")
	    .attr("class", "x axis ")
	    .attr("font-size", "14.0px")
	    .attr("transform", "translate(0," + (height) + ")")
	    .call(xAxis);

	d3.selectAll(".tick line").style({'stroke':'black'});

	// create the clip boundary
	// var clip = axes.append("svg:clipPath")
	// 	.attr("id","clip")
	// 	.append("svg:rect")
	// 	.attr("x",0)
	// 	.attr("y",0)
	// 	.attr("width",width)
	// 	.attr("height",height);

	// // now something else
	// var unclipped_axes = axes;

	// axes = axes.append("g")
	// 	.attr("clip-path","url(#clip)");

	// var ylabel = canvas.append("text")
	// 	.text("State Rank")
	// 	.attr("class","axes-text")
	// 	.attr("x",(figwidth-width)/4)
	// 	.attr("y",figheight/2+30)
	// 	.attr("font-size", "16.0px")
	// 	.attr("fill", "#000000")
	// 	.attr("transform", "rotate(-90.0," + (figwidth-width)/4 + "," + (figheight/2+30) + ")");

	var xlabel = canvas.append("text")
	    // .text("Happiness")
	    .text("Happiness difference from US as a whole")
	    .attr("class","axes-text")
	    .attr("x",width/2+(figwidth-width)/2)
	    .attr("y",3*(figheight-height)/4+height)
	    .attr("font-size", "16.0px")
	    .attr("fill", "#000000")
	    .attr("style", "text-anchor: middle;");

	axes.selectAll("rect.staterect")
	    .data(sortedStates)
	    .enter()
	    .append("rect")
	    .attr("class", function(d,i) { return d[2]+" staterect"+" q"+classColor(i+1)+"-8"; })
	    .attr("x", function(d,i) { if (d[3]>0) { return figcenter; } else { return x(d[3]); } })
	    .attr("y", function(d,i) { return y(i+1); })
	    .style({'opacity':'1.0','stroke-width':'1.0','stroke':'rgb(100,100,100)'})
	    .attr("height",function(d,i) { return 11; } )
	    .attr("width",function(d,i) { if (d[3]>0) {return d3.max([x(d[3])-figcenter,0]);} else {return d3.max([figcenter-x(d[3]),0]); } } )
	    .on('mouseover', function(d,i){
		var rectSelection = d3.select(this).style({'opacity':'1.0','stroke':'black','stroke-width':'1.0',});
		hedotools.barchartoncall.test(d,i);
	    })
	    .on('mouseout', function(d){
		var rectSelection = d3.select(this).style({'opacity':'1.0','stroke':'rgb(100,100,100)','stroke-width':'1.0',});
		// var rectSelection = d3.select(this).style({opacity:'0.7'});
	    });

	axes.selectAll("text.statetext")
	    .data(sortedStates)
	    .enter()
	    .append("text")
	    .attr("class", function(d,i) { return d[2]+" statetext"; })
	    .attr("x", function(d,i) { if (d[3]>0) { return figcenter-6; } else { return figcenter+6; } })
	    .style("text-anchor", function(d,i) { if (d[3]>0) { return "end";} else { return "start";}})
	    .attr("y",function(d,i) { return y(i+1)+11; } )
            .text(function(d,i) { return (i+1)+". "+d[2]; })
	    .on('mouseover', function(d,i){
		hedotools.barchartoncall.test(d,i);
	    });

	// d3.select(window).on("resize.shiftplot",resizeshift);
	
	// function resizeshift() {
	// 	figwidth = parseInt(d3.select("#shift01").style('width')) - margin.left - margin.right,
	// 	width = .775*figwidth
	// 	figcenter = width/2;

	// 	canvas.attr("width",figwidth);

	// 	x.range([(sortedWords[0].length+3)*9, width-(sortedWords[0].length+3)*9]);
	// 	topScale.range([width*.1,width*.9]);

	// 	bgrect.attr("width",width);
	// 	//axes.attr("transform", "translate(" + (0.125 * figwidth) + "," +
	// 	//      ((1 - 0.125 - 0.775) * figheight) + ")");
	
	// 	// mainline.attr("d",line);

	// 	// fix the x axis
	// 	canvas.select(".x.axis").call(xAxis);

	// 	clip.attr("width",width);

	// 	// get the x label
	// 	xlabel.attr("x",(leftOffsetStatic+width/2));

	// 	// the andy reagan credit
	// 	credit.attr("x",width-7);

	// 	// line separating summary
	// 	sepline.attr("x2",width);

	// 	// all of the lower shift text
	// 	axes.selectAll("text.shifttext").attr("x",function(d,i) { if (d>0) {return x(d)+2;} else {return x(d)-2; } } );
	// }
    };

    var opublic = { setfigure: setfigure,
		    setdata: setdata,
		    _data: _data,
		    _datanames: _datanames,
		    _figheight: _figheight, 
		    getSorted: getSorted, 
		    plot: plot, };

    return opublic;
}();









