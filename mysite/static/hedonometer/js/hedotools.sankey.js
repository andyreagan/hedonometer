hedotools.sankey = function() { 

    var figure;

    var setfigure = function(_) {
	console.log("setting figure");
	figure = _;
	// grabwidth();
	return hedotools.sankey;
    }

    var oldlist;
    var newlist;
    var stateNames;

    var oldindices;
    var newindices;
    var data;

    var setdata = function(a,b,c) {
	oldlist = a;
	newlist = b;
	stateNames = c;
	stateNames[50] = "DC";

	// do the sorting
	oldindices = Array(oldlist.length);
	for (var i = 0; i < oldlist.length; i++) { oldindices[i] = i; }

	// sort by abs magnitude
	// oldindices.sort(function(a,b) { return Math.abs(data[a]) < Math.abs(data[b]) ? 1 : Math.abs(data[a]) > Math.abs(data[b]) ? -1 : 0; });

	// sort by magnitude, parity preserving
	oldindices.sort(function(a,b) { return oldlist[a] < oldlist[b] ? 1 : oldlist[a] > oldlist[b] ? -1 : 0; });

	// do the sorting on new data
	newindices = Array(newlist.length);
	for (var i = 0; i < newlist.length; i++) { newindices[i] = i; }

	newindices.sort(function(a,b) { return newlist[a] < newlist[b] ? 1 : newlist[a] > newlist[b] ? -1 : 0; });

	data = Array(51);
	for (var i=0; i<data.length; i++) {
	    data[i] = {
		"name": stateNames[i],
		"index": i,
		"oldindex": oldindices.indexOf(i),
		"newindex": newindices.indexOf(i),
		"change": newlist[i]-oldlist[i],
	    };
	}

	// console.log(data);
	// tmpglob = data;

	return hedotools.sankey;
    }

    // initialize everything so other function in this module have access
    var margin;
    var axeslabelmargin;
    var figwidth;
    var aspectRatio;
    var figheight;
    var width;
    var height;
    var figcenter;
    var leftOffsetStatic;

    var canvas;
    var x;
    var y;
    var axes;

    var oldstateselection;
    var newstateselction;
    var path;
    var sankeydata;
    var pathwidth;
    var pathselection;

    // make the plot
    var plot = function() {
	margin = {top: 0, right: 0, bottom: 0, left: 0};
	axeslabelmargin = {top: 0, right: 90, bottom: 0, left: 90};
	figwidth = parseInt(figure.style('width')) - margin.left - margin.right;
	aspectRatio = 2.2;
	figheight = parseInt(figure.style('width'))*aspectRatio - margin.top - margin.bottom;
	// figheight = 7;
	width = figwidth-axeslabelmargin.left-axeslabelmargin.right;
	height = figheight-axeslabelmargin.top-axeslabelmargin.bottom;
	figcenter = width/2;
	leftOffsetStatic = axeslabelmargin.left;

	// remove an old figure if it exists
	figure.select(".canvas").remove();

	canvas = figure.append("svg")
	    .attr("width",figwidth)
	    .attr("height",figheight)
	    .attr("class","canvas")

	// x scale, maps all the data to 
	x = d3.scale.linear()
	    .domain([0,1])
	    .range([5,width-10]);

	// linear scale function
	y =  d3.scale.linear()
	    .domain([newlist.length,1])
	    .range([height-20, 5]); 

	// create the axes themselves
	axes = canvas.append("g")
	    .attr("transform", "translate(" + (axeslabelmargin.left) + "," +
		  (axeslabelmargin.top) + ")")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class", "main");
	// .call(zoom);

	oldstateselection = axes.selectAll("text.statetext.old")
	    .data(data)
	    .enter()
	    .append("text")
	    .attr("class", function(d,i) { return d.name+" statetext"; })
	    .attr("x",20)
	    .style("text-anchor", "end")
	    .attr("y",function(d,i) { return y(d.oldindex+1)+11; } )
            .text(function(d,i) { return (d.oldindex+1)+". "+d.name; });

	newstateselection = axes.selectAll("text.statetext.new")
	    .data(data)
	    .enter()
	    .append("text")
	    .attr("class", function(d,i) { return d.name+" statetext"; })
	    .attr("x",width-20)
	    .style("text-anchor", "start")
	    .attr("y",function(d,i) { return y(d.newindex+1)+11; } )
            .text(function(d,i) { return (d.newindex+1)+". "+d.name; });

	// create an instance of the sankey to make paths
	var sankey = d3.sankey();
	path = sankey.link();

	// create the sankey data thingy
	sankeydata = Array(51);
	for (var i=0; i<data.length; i++) {
	    sankeydata[i] = {
		"source": {
		    "x": 20,
		    "dx": 2,
		    "y": y(data[i].oldindex+1)-8, 
		},
		"target": {
		    "x": width-22,
		    "dx": 2,
		    "y": y(data[i].newindex+1)-8,
		},
		"sy": 10,
		"ty": 10,
		"dy": 10,
	    };
	}

	pathwidth = d3.scale.linear()
	    .domain(d3.extent(data.map(function(d) { return Math.abs(d.change); })))
	    .range([2,13]);

	pathselection = axes.selectAll("path.sankey").data(sankeydata)
	    .enter()
	    .append("path")
            .attr({ "d": path,
		    "fill": "none",
		    "class": function(d,i) { return "r"+classColor(data[i].oldindex)+"-8"; },
		    "stroke-width": function(d,i) { return pathwidth(Math.abs(data[i].change)); } })
	    .on("mouseover", function(d,i) { 
		// console.log(i);
		// console.log(data[i]);

		var shiftObj = hedotools.shifter.shift(allDataOld[data[i].index].freq,allData[data[i].index].freq,lens,words);
		shiftObj.setfigure(d3.select('#shift01')).setText("Why "+data[i].name+" has become "+((allDataOld[data[i].index].avhapps < allData[data[i].index].avhapps) ? "happier" : "less happy")+":").plot();

		var rectSelection = d3.select(this)
		    .style({'opacity':'0.7',
			    // 'stroke-width':'1.0',
			   });
	    })
	    .on("mouseout", function(d,i) { 
		var rectSelection = d3.select(this)
		    .style({'opacity':'1.0',
			    // 'stroke':'black',
			    // "stroke-width": function(d,i) { 
			    //     return sortedStatesOld[i][4]*100; 
			    // }, 
			   }) 
	    });
    };

    var replot = function() {
	// assuming that the data has been updated
	// console.log(oldstateselection);
	// console.log(newstateselection);
	
	oldstateselection.data(data)
	    .transition()
            .text(function(d,i) { return (d.oldindex+1)+". "+d.name; })
	    .attr("y",function(d,i) { return y(d.oldindex+1)+11; } );

    	newstateselection.data(data)
	    .transition()
            .text(function(d,i) { return (d.newindex+1)+". "+d.name; })
    	    .attr("y",function(d,i) { return y(d.newindex+1)+11; } );

	for (var i=0; i<data.length; i++) {
	    sankeydata[i] = {
		"source": {
		    "x": 20,
		    "dx": 2,
		    "y": y(data[i].oldindex+1)-8, 
		},
		"target": {
		    "x": width-22,
		    "dx": 2,
		    "y": y(data[i].newindex+1)-8,
		},
		"sy": 10,
		"ty": 10,
		"dy": 10,
	    };
	}

	// update the width function
	pathwidth.domain(d3.extent(data.map(function(d) { return Math.abs(d.change); })));

	pathselection.data(sankeydata)
	    .transition()
            .attr({ "d": path,
		    // don't update this
		    // because the transition is applied by the css at the end
		    // and it messes up the whole effect
		    // "class": function(d,i) { return "r"+classColor(data[i].oldindex)+"-8"; },
		    "stroke-width": function(d,i) { return pathwidth(Math.abs(data[i].change)); } });

    };

    // need functions to access updated properties
    var GETdata = function() {
	return data;
    };

    var GETnewindices = function() {
	return newindices;
    };

    var opublic = {
	plot: plot,
	setfigure: setfigure,
	setdata: setdata,
	data: GETdata,
	newindices: GETnewindices,
	replot: replot,
    };

    return opublic;

}();







