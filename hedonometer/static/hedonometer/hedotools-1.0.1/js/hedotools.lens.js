// on call as a module
// in the test function, can set the function that gets called
// when the lens is moved
// full flexibility
hedotools.lensoncall = function() { 
    var test = function(extent1) {
	console.log("set on load (works for maps.html)");
	// reset
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
		if (lens[i] >= extent1[0] && lens[i] <= extent1[1]) {
		    include = false;
		}
		// include it, or set to 0
		if (include) {
		    allData[j].freq[i] = allData[j].rawFreq[i];
		}
		else { allData[j].freq[i] = 0; }
		
	    }
	}
	hedotools.computeHapps.go();
	hedotools.map.setfigure(d3.select('#map01')).setdata(geoJson).plot();
	if (shiftRef !== shiftComp) {
	    hedotools.shifter.shift(allData[shiftRef].freq,allData[shiftComp].freq,lens,words);
	    var happysad = hedotools.shifter._compH() > hedotools.shifter._refH() ? "happier" : "less happy";
	    hedotools.shifter.setfigure(d3.select('#shift01')).setText(["Why "+allData[shiftComp].name+" is "+happysad+" than "+allData[shiftRef].name+":"]).plot();
	}
    }
    var opublic = { test: test, };
    return opublic;
}();

hedotools.lens = function() {

    // for now, keep track of which page we're in
    // since they're all a bit different
    var page = "geo";

    var encoder = d3.urllib.encoder().varname("lens"); //.varval(lensExtent);
    var decoder = d3.urllib.decoder().varname("lens").varresult([4,6]); //.varval(lensExtent);

    var figure;
    var lens;
    var margin = {top: 0, right: 55, bottom: 0, left: 0};
    var figwidth;
    var figheight = 100 - margin.top - margin.bottom;
    var width;
    var height = .875*figheight-5;
    var leftOffsetStatic;

    var grabwidth = function() {
	figwidth = parseInt(figure.style('width')) - margin.left - margin.right;
	width = .875*figwidth-5;
	leftOffsetStatic = 0.125*figwidth;
    }

    var setfigure = function(_) {
	console.log("setting figure");
	figure = _;
	grabwidth();
	return hedotools.lens;
    }

    var setdata = function(_) {
	lens = _;
	return hedotools.lens;
    }
    
    lensExtent = decoder().cached;

    var plot = function () {

	if (figwidth > 10) {

	    // remove an old figure if it exists
	    figure.selectAll(".canvas").remove();

	    var canvas = figure.append("svg")
		.attr("width",figwidth)
		.attr("height",figheight)
		.attr("id","lenssvg")
		.attr("class","canvas");


	    // create the x and y axis
	    var x = d3.scale.linear()
	        .domain([1.00,9.00])
		// .domain(d3.extent(lens))
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
		      ((1 - 0.125 - 0.875) * figheight) + ")")
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

	    // var xlabel = canvas.append("text")
	    // 	.text("Word score")
	    // 	.attr("class","axes-text")
	    // 	.attr("x",width/2+(figwidth-width)/2)
	    // 	.attr("y",figheight)
	    // 	.attr("font-size", "12.0px")
	    // 	.attr("fill", "#000000")
	    // 	.attr("style", "text-anchor: middle;");

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
		// .domain(d3.extent(lens))
		.range([figwidth*.125,width+figwidth*.125]);
	    


	    function brushended() {
		if (!d3.event.sourceEvent) return;
		var extent0 = brush.extent(),
		extent1 = extent0; // should round it to bins

		onredrawfunction();
		
		// window.stopVals = extent1;
		// console.log(extent1);
		if ((extent1[0] !== lensExtent[0]) || (extent1[1] !== lensExtent[1]))
		{	    

		    lensExtent = [Math.round(extent1[0]*4)/4,Math.round(extent1[1]*4)/4];
		    hedotools.lensoncall.test(extent1);
		} 

		d3.select(this).transition()
		    .call(brush.extent(lensExtent))
		    .call(brush.event);

		encoder.varval(lensExtent);
	    }

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
		.attr("y",0)
		.style({'stroke-width':'2','stroke':'rgb(100,100,100)','opacity': 0.95})
		.attr("fill", "#FCFCFC");

	    //console.log(lensExtent);

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
	    };

	    d3.select(window).on("resize.selectlens",resizelens);

	    // var buttongroup = figure.append("div").attr({"class":"btn-group-vertical",});
	    //buttongroup.html('<button type="button" class="btn btn-default">Button</button><button type="button" class="btn btn-default">Button</button><div class="btn-group"><button id="btnGroupVerticalDrop1" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">Dropdown<span class="caret"></span>        </button>     <ul class="dropdown-menu" role="menu" aria-labelledby="btnGroupVerticalDrop1">          <li><a href="#">Dropdown link</a></li>          <li><a href="#">Dropdown link</a></li>        </ul></div>      <button type="button" class="btn btn-default">Button</button>'

	    figure.selectAll("div.btn-group-vertical").remove();
	    var buttongroup = figure.append("div").attr({"class":"btn-group-vertical pull-right",})
	    // var defaults = [[4,6],[3,7],[3,9],[1,7],[5,5]];
	    var defaults = [[4,6],[3,7],[5,5]];
	    // var defaultnames = ["Default","Wide","Sad","Happy","None"];
	    var defaultnames = ["Default","Wide","None"];
	    buttongroup.selectAll("button").data(defaults).enter()
		.append("button")
		.attr({"type":"button",
                       "class": function(d,i) { return "btn btn-default btn-xs "+defaultnames[i]; },})
		.html(function(d,i) { return defaultnames[i]; })
		.on("click",function(d,i) { 
		    figure.selectAll("button").attr("class","btn btn-default btn-xs"); 
		    d3.select(this).attr("class","btn btn-primary btn-xs"); 
		    d3.select(".lensbrush") //.transition()
			.call(brush.extent(d))
			.call(brush.event);
		});
	    // initially check if any are matched
	    console.log(lensExtent);
	    for (var i=0; i<defaults.length; i++) {
		if (defaults[i][0] === parseFloat(lensExtent[0]) && defaults[i][1] === parseFloat(lensExtent[1])) {
		    // make it active
		    buttongroup.select("button."+defaultnames[i]).attr("class","btn btn-primary btn-xs");
		}
	    }

	}; // if figwidth > 10
    }

    var onredrawfunction = function() {
	console.log("I got called");
    }

    var opublic = { setfigure: setfigure,
		    setdata: setdata,
		    plot: plot,
		    onredrawfunction: onredrawfunction,
		  };

    return opublic;
}();
