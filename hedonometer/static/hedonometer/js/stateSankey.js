hedotools.sankey = function() { 

    var figure;

    var setfigure = function(_) {
	console.log("setting figure");
	figure = _;
	// grabwidth();
	return hedotools.sankey;
    }

    // make the plot
    var plot = function(oldlist,newlist,geodata) {
	/* plot the bar chart

	   -take a d3 selection, and draw the bar chart SVG on it
	   -requires the magnitude for each state, and the geojson
           with the names

	*/
	var margin = {top: 0, right: 0, bottom: 0, left: 0},
	axeslabelmargin = {top: 0, right: 90, bottom: 0, left: 90},
	figwidth = parseInt(figure.style('width')) - margin.left - margin.right,
	aspectRatio = 2.2,
	figheight = parseInt(figure.style('width'))*aspectRatio - margin.top - margin.bottom,
	width = figwidth-axeslabelmargin.left-axeslabelmargin.right,
	height = figheight-axeslabelmargin.top-axeslabelmargin.bottom,
	figcenter = width/2,
	leftOffsetStatic = axeslabelmargin.left;

	geodata[50].properties.name = "DC";

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
	var sortedStatesNew = Array(newlist.length);
	for (var i = 0; i < newlist.length; i++) { sortedStatesNew[i] = [i,newindices[i],geodata[newindices[i]].properties.name,newlist[newindices[i]]]; }
	console.log(sortedStatesNew);
	
	// now build the old list, with an additional entry
	sortedStatesOld = Array(oldlist.length);
	for (var i = 0; i < oldlist.length; i++) { sortedStatesOld[i] = [i,oldindices[i],geodata[oldindices[i]].properties.name,oldlist[oldindices[i]],Math.abs(oldlist[oldindices[i]]-newlist[oldindices[i]]),newindices.indexOf(oldindices[i])]; }
	console.log(sortedStatesOld);
	

	// remove an old figure if it exists
	figure.select(".canvas").remove();

	var canvas = figure.append("svg")
	    .attr("width",figwidth)
	    .attr("height",figheight)
	    .attr("class","canvas")

	// x scale, maps all the data to 
	var x = d3.scale.linear()
	    .domain([0,1])
	    .range([5,width-10]);

	// linear scale function
	var y =  d3.scale.linear()
	    .domain([newlist.length,1])
	    .range([height-20, 5]); 

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

	// axes creation functions
	var create_xAxis = function() {
	    return d3.svg.axis()
		.ticks(4)
		.scale(x)
		.orient("bottom"); }

	// axis creation function
	var create_yAxis = function() {
	    return d3.svg.axis()
		.scale(y) //linear scale function
		.orient("left"); }

	// draw the axes
	// var yAxis = create_yAxis()
	// 	.innerTickSize(6)
	// 	.outerTickSize(0);

	// axes.append("g")
	// 	.attr("class", "y axis ")
	// 	.attr("font-size", "14.0px")
	// 	.attr("transform", "translate(0,0)")
	// 	.call(yAxis);

	// var xAxis = create_xAxis()
	// 	.innerTickSize(6)
	// 	.outerTickSize(0);

	// axes.append("g")
	// 	.attr("class", "x axis ")
	// 	.attr("font-size", "14.0px")
	// 	.attr("transform", "translate(0," + (height) + ")")
	// 	.call(xAxis);

	// d3.selectAll(".tick line").style({'stroke':'black'});

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

	// var xlabel = canvas.append("text")
	// 	.text("Happiness")
	// 	.attr("class","axes-text")
	// 	.attr("x",width/2+(figwidth-width)/2)
	// 	.attr("y",3*(figheight-height)/4+height)
	// 	.attr("font-size", "16.0px")
	// 	.attr("fill", "#000000")
	// 	.attr("style", "text-anchor: middle;");

	// axes.selectAll("rect.staterect")
	// 	.data(sortedStates)
	// 	.enter()
	// 	.append("rect")
	// 	.attr("class", function(d,i) { return d[2]+" staterect"+" q"+classColor(i+1)+"-8"; })
	// 	.attr("x", function(d,i) { if (d[3]>0) { return figcenter; } else { return x(d[3]); } })
	// 	.attr("y", function(d,i) { return y(i+1); })
	// 	.style({'opacity':'0.7','stroke-width':'1','stroke':'rgb(0,0,0)'})
	// 	.attr("height",function(d,i) { return 15; } )
	// 	.attr("width",function(d,i) { if (d[3]>0) {return x(d[3])-figcenter;} else {return figcenter-x(d[3]); } } )
	// 	.on('mouseover', function(d){
	//         var rectSelection = d3.select(this).style({opacity:'1.0'});
	// 	})
	// 	.on('mouseout', function(d){
	//         var rectSelection = d3.select(this).style({opacity:'0.7'});
	// 	});

	axes.selectAll("text.statetext.old")
	    .data(sortedStatesOld)
	    .enter()
	    .append("text")
	    .attr("class", function(d,i) { return d[2]+" statetext"; })
	    .attr("x",20)
	    .style("text-anchor", "end")
	    .attr("y",function(d,i) { return y(i+1)+11; } )
            .text(function(d,i) { return (i+1)+". "+d[2]; });


	axes.selectAll("text.statetext.new")
	    .data(sortedStatesNew)
	    .enter()
	    .append("text")
	    .attr("class", function(d,i) { return d[2]+" statetext"; })
	    .attr("x",width-20)
	    .style("text-anchor", "start")
	    .attr("y",function(d,i) { return y(i+1)+11; } )
            .text(function(d,i) { return (i+1)+". "+d[2]; });

	// create an instance of the sankey to make paths
	var sankey = d3.sankey();
	var path = sankey.link();

	// create the sankey data thingy
	sankeydata = Array(51);
	for (var i=0; i<51; i++) {
	    sankeydata[i] = {
		"source": {
		    "x": 20,
		    "dx": 2,
		    "y": y(i+1)-8, 
		},
		"target": {
		    "x": width-22,
		    "dx": 2,
		    "y": y(sortedStatesOld[i][5]+1)-8,
		},
		"sy": 10,
		"ty": 10,
		"dy": 10,
	    };
	}

	pathwidth = d3.scale.linear()
	    .domain(d3.extent(sortedStatesOld.map(function(d) { return d[4]; })))
	    .range([2,13]);

	axes.selectAll("path.sankey").data(sankeydata)
	    .enter()
	    .append("path")
            .attr({ "d": path,
		    "fill": "none",
		    "class": function(d,i) { return "r"+classColor(i)+"-8"; },
		    "stroke-width": function(d,i) { return pathwidth(sortedStatesOld[i][4]); } })
	    .on("mouseover", function(d,i) { 
		console.log(i);
		console.log(sortedStatesOld[i]);

		var shiftObj = hedotools.shifter.shift(allDataOld[sortedStatesOld[i][1]].freq,allData[sortedStatesOld[i][1]].freq,lens,words);
		shiftObj.setfigure(d3.select('#shift01')).setText("Why "+sortedStatesOld[i][2]+" has become "+((allDataOld[sortedStatesOld[i][1]].avhapps < allData[sortedStatesOld[i][1]].avhapps) ? "happier" : "less happy")+":").plot();

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

    var opublic = {
	plot: plot,
	setfigure: setfigure,
    };

    return opublic;

}();







