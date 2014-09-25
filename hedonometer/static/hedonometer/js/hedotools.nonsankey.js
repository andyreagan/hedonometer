hedotools.sankeyoncall = function() { 
    var test = function(i,data) {
	console.log("set in module");

	console.log(allDataOld);
	
	var shiftObj = hedotools.shifter.shift(allDataOld[data[i].index].freq,allData[data[i].index].freq,lens,words);

	shiftObj.setfigure(d3.select('#shift01')).setText("Why "+data[i].name+" has become "+((allDataOld[data[i].index].avhapps < allData[data[i].index].avhapps) ? "happier" : "less happy")+":").plot();


    }
    var opublic = { test: test, };
    return opublic;
}();

hedotools.sankey = function() { 

    var popuptimer;

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
	if ( stateNames[50] === "District of Columbia" ) {
	    stateNames[50] = "DC";
	}

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

	data = Array(oldlist.length);
	for (var i=0; i<data.length; i++) {
	    data[i] = {
		"name": stateNames[i],
		"index": i,
		"oldindex": oldindices.indexOf(i),
		"newindex": newindices.indexOf(i),
		"change": newlist[i]-oldlist[i],
		"oldhapps": oldlist[i],
		"newhapps": newlist[i],
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

    var listlabels;
    var extraSideWidth = [0,0];

    var useTip = false;
    var tip;

    var minwidth = 450;

    // make the plot
    var plot = function() {
	margin = {top: 0, right: 0, bottom: 0, left: 0};
	axeslabelmargin = {top: 0, right: 0+extraSideWidth[0], bottom: 0, left: 0+extraSideWidth[1]};
	figwidth = parseInt(figure.style('width')) - margin.left - margin.right;
	if (figwidth<minwidth) {
	    console.log("width is too small...");
	    d3.selectAll(".reftimelabel,.comptimelabel,.reftimelabelbottom,.comptimelabelbottom").remove();
	    figure.append("text").text("Unfortunately, this visualization will look terrible on your device. If you're on a phone, try rotating and refreshing, or looking from a desktop. Thanks :)");
	    return hedotools.sankey;
	}
	aspectRatio = 1.8+3.4*(oldlist.length-51)/(304-51);
	figheight = parseInt(figure.style('width'))*aspectRatio - margin.top - margin.bottom;
	// console.log("figheight is "+figheight);
	// figheight = 4576; // for the city sankey this seems good
	width = figwidth-axeslabelmargin.left-axeslabelmargin.right;
	height = figheight-axeslabelmargin.top-axeslabelmargin.bottom;
	figcenter = width/2;
	leftOffsetStatic = axeslabelmargin.left;

	var hovergroup = figure.append("div").attr({
	    "class": "hoverinfogroup",
	    // "transform": "translate("+(x+hoverboxxoffset+axeslabelmargin.left)+","+(d3.min([d3.max([0,y-hoverboxheight/2-hoverboxyoffset]),height-hoverboxheight]))+")", 
	})
	    .style({
		"position": "absolute",
		"top": "100px",
		"left": "100px",
		"visibility": "hidden",
	    });

	function hidehover() {
	    console.log("hiding hover");
	    hovergroup.style({
		"visibility": "hidden",
	    });
	}

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
	    .range([height-20, 0]); 

	// create the axes themselves
	axes = canvas.append("g")
	    .attr("transform", "translate(" + (axeslabelmargin.left) + "," +
		  (axeslabelmargin.top) + ")")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class", "main");

	// if (useTip) {
	//     console.log("setting tip");
	//     tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });
	//     axes.call(tip);
	// }

	oldstateselection = axes.selectAll("text.statetext.old")
	    .data(data)
	    .enter()
	    .append("text")
	    .attr("class", function(d,i) { return d.name+" statetext"; })
	    .attr("x",20)
	    .style("text-anchor", "start")
	    .attr("y",function(d,i) { return y(d.oldindex+1)+11; } )
            .text(function(d,i) { return (d.oldindex+1)+". "+d.name; })
	    .on("mouseover", function(d,i) { 
		var hoverboxheight = 90;
		var hoverboxwidth = 200;
		var hoverboxyoffset = 0;
		var hoverboxxoffset = 0;

		var x = d3.mouse(this)[0];
		var y = d3.mouse(this)[1];
		
                var hoverboxheightguess = 190;
		if (refcity.length > 0) {
		    hoverboxheightguess = 270;
		}
		if ((y+hoverboxheightguess)>height) { y-=(y+hoverboxheightguess-height); }

		    hovergroup.style({
			"position": "absolute",
			"top": y+"px",
			"left": x+"px",
			"visibility": "visible",
		    });

		    hovergroup.selectAll("p,h3,button,br").remove();

		    hovergroup.append("h3")
			.attr("class","cityname")
			.text(d.name);

		    hovergroup.append("p")
			.attr("class","refhapps")
		    	.text(reftimeseldecoder().cached+" Happiness: "+parseFloat(d.oldhapps).toFixed(2));

		    hovergroup.append("p")
			.attr("class","refrank")
		    	.text(reftimeseldecoder().cached+" Rank: "+(d.oldindex+1));

		    hovergroup.append("p")
			.attr("class","comphapps")
		    	.text(comptimeseldecoder().cached+" Happiness: "+parseFloat(d.newhapps).toFixed(2));

		    hovergroup.append("p")
			.attr("class","comprank")
		    	.text(comptimeseldecoder().cached+" Rank: "+(d.newindex+1));

		    var popupshift = function(refyear,refname,compyear,compname) {
			refshifttimeencoder.varval(refyear);
			refshiftcityencoder.varval(refname);
			compshifttimeencoder.varval(compyear);
			compshiftcityencoder.varval(compname);
			// write a function to call on the load
			drawShift = function() {
			    hedotools.shifter._refF(refF);
			    hedotools.shifter._compF(compF);
			    hedotools.shifter.stop();
			    hedotools.shifter.shifter();
			    hedotools.shifter.setText("Why "+compname+" in "+compyear+" is "+( ( hedotools.shifter._compH() > hedotools.shifter._refH() ) ? "happier" : "less happy" )+" than "+refname+" in "+refyear+":").plot();
			    $('#myModal').modal('show');
			}
			// load both of the files
			var csvLoadsRemaining = 2;
			var reffile = "http://hedonometer.org/data/cities/word-vectors/"+refyear+"/"+refname+".csv";
			if (parseInt(refyear) < 2014) reffile+=".new"
			var compfile = "http://hedonometer.org/data/cities/word-vectors/"+compyear+"/"+compname+".csv";
			if (parseInt(compyear) < 2014) compfile+=".new"
			console.log(reffile);
			console.log(compfile);
			var refF;
			var compF;
			d3.text(reffile,function(text) {
			    refF = text.split(",");
			    console.log(refF);
			    if (!--csvLoadsRemaining) drawShift();
			});
			d3.text(compfile,function(text) {
			    compF = text.split(",");
			    console.log(compF);
			    if (!--csvLoadsRemaining) drawShift();
			});
		    }

		    hovergroup.append("button")
			.attr("class","btn btn-sm btn-primary")
		    	.text("Shift city vs previous year")
			.on("click", function() {
			    console.log(d);
			    console.log(i);
			    popupshift(reftimeseldecoder().cached,d.name,comptimeseldecoder().cached,d.name);
			});

		    hovergroup.append("br");
		    hovergroup.append("br");

		    hovergroup.append("button")
			.attr("class","btn btn-sm btn-primary")
		    	.text("Shift city in "+reftimeseldecoder().cached+" vs sum "+reftimeseldecoder().cached)
			.on("click", function() {
			    console.log(d);
			    console.log(i);
			    popupshift(reftimeseldecoder().cached,"US",reftimeseldecoder().cached,d.name);
			});

		    hovergroup.append("br");
		    hovergroup.append("br");

		    hovergroup.append("button")
			.attr("class","btn btn-sm btn-primary")
		    	.text("Shift city in "+comptimeseldecoder().cached+" vs sum "+comptimeseldecoder().cached)
			.on("click", function() {
			    console.log(d);
			    console.log(i);
			    popupshift(comptimeseldecoder().cached,"US",comptimeseldecoder().cached,d.name);
			});

		    hovergroup.append("br");
		    hovergroup.append("br");


		    hovergroup.append("button")
			.attr("class","btn btn-xs btn-primary")
		    	.text("Select as reference for city-city comparison")
			.on("click", function() {
			    console.log(d);
			    console.log(i);
			    refcity = d.name;
			});

		    if (refcity.length > 0) {
			hovergroup.append("br");
			hovergroup.append("br");
			hovergroup.append("button")
			    .attr("class","btn btn-xs btn-primary")
		    	    .text("Compare against "+refcity+" in "+comptimeseldecoder().cached)
			    .on("click", function() {
				console.log(d);
				console.log(i);
				popupshift(comptimeseldecoder().cached,refcity,comptimeseldecoder().cached,d.name);
			    });
			hovergroup.append("br");
			hovergroup.append("br");
			hovergroup.append("button")
			    .attr("class","btn btn-xs btn-primary")
		    	    .text("Compare against "+refcity+" in "+reftimeseldecoder().cached)
			    .on("click", function() {
				console.log(d);
				console.log(i);
				popupshift(reftimeseldecoder().cached,refcity,reftimeseldecoder().cached,d.name);
			    });
		    }

		clearTimeout(popuptimer);

		popuptimer = setTimeout(hidehover,3000);
	    })
	    .on("mouseout", function(d,i) { 
		clearTimeout(popuptimer);

		popuptimer = setTimeout(hidehover,3000);
	    });

	newstateselection = axes.selectAll("text.statetext.new")
	    .data(data)
	    .enter()
	    .append("text")
	    .attr("class", function(d,i) { return d.name+" statetext"; })
	    .attr("x",300)
	    .style("text-anchor", "start")
	    .attr("y",function(d,i) { return y(d.newindex+1)+11; } )
            .text(function(d,i) { return (d.newindex+1)+". "+d.name; })
	    .on("mouseover", function(d,i) { 
		    var hoverboxheight = 90;
		    var hoverboxwidth = 200;
		    var hoverboxyoffset = 0;
		    var hoverboxxoffset = 0;

		    var x = d3.mouse(this)[0];
		    var y = d3.mouse(this)[1];

                var hoverboxheightguess = 190;
		if (refcity.length > 0) {
		    hoverboxheightguess = 270;
		}
		if ((y+hoverboxheightguess)>height) { y-=(y+hoverboxheightguess-height); }
		    
		    hovergroup.style({
			"position": "absolute",
			"top": y+"px",
			"left": x+"px",
			"visibility": "visible",
		    });

		    hovergroup.selectAll("p,h3,button,br").remove();

		    hovergroup.append("h3")
			.attr("class","cityname")
			.text(d.name);

		    hovergroup.append("p")
			.attr("class","refhapps")
		    	.text(reftimeseldecoder().cached+" Happiness: "+parseFloat(d.oldhapps).toFixed(2));

		    hovergroup.append("p")
			.attr("class","refrank")
		    	.text(reftimeseldecoder().cached+" Rank: "+(d.oldindex+1));

		    hovergroup.append("p")
			.attr("class","comphapps")
		    	.text(comptimeseldecoder().cached+" Happiness: "+parseFloat(d.newhapps).toFixed(2));

		    hovergroup.append("p")
			.attr("class","comprank")
		    	.text(comptimeseldecoder().cached+" Rank: "+(d.newindex+1));

		    var popupshift = function(refyear,refname,compyear,compname) {
			refshifttimeencoder.varval(refyear);
			refshiftcityencoder.varval(refname);
			compshifttimeencoder.varval(compyear);
			compshiftcityencoder.varval(compname);
			// write a function to call on the load
			drawShift = function() {
			    hedotools.shifter._refF(refF);
			    hedotools.shifter._compF(compF);
			    hedotools.shifter.stop();
			    hedotools.shifter.shifter();
			    hedotools.shifter.setText("Why "+compname+" in "+compyear+" is "+( ( hedotools.shifter._compH() > hedotools.shifter._refH() ) ? "happier" : "less happy" )+" than "+refname+" in "+refyear+":").plot();
			    $('#myModal').modal('show');
			}
			// load both of the files
			var csvLoadsRemaining = 2;
			var reffile = "http://hedonometer.org/data/cities/word-vectors/"+refyear+"/"+refname+".csv";
			if (parseInt(refyear) < 2014) reffile+=".new"
			var compfile = "http://hedonometer.org/data/cities/word-vectors/"+compyear+"/"+compname+".csv";
			if (parseInt(compyear) < 2014) compfile+=".new"
			console.log(reffile);
			console.log(compfile);
			var refF;
			var compF;
			d3.text(reffile,function(text) {
			    refF = text.split(",");
			    console.log(refF);
			    if (!--csvLoadsRemaining) drawShift();
			});
			d3.text(compfile,function(text) {
			    compF = text.split(",");
			    console.log(compF);
			    if (!--csvLoadsRemaining) drawShift();
			});
		    }

		    hovergroup.append("button")
			.attr("class","btn btn-sm btn-primary")
		    	.text("Shift city vs previous year")
			.on("click", function() {
			    console.log(d);
			    console.log(i);
			    popupshift(reftimeseldecoder().cached,d.name,comptimeseldecoder().cached,d.name);
			});

		    hovergroup.append("br");
		    hovergroup.append("br");

		    hovergroup.append("button")
			.attr("class","btn btn-sm btn-primary")
		    	.text("Shift city in "+reftimeseldecoder().cached+" vs sum "+reftimeseldecoder().cached)
			.on("click", function() {
			    console.log(d);
			    console.log(i);
			    popupshift(reftimeseldecoder().cached,"US",reftimeseldecoder().cached,d.name);
			});

		    hovergroup.append("br");
		    hovergroup.append("br");

		    hovergroup.append("button")
			.attr("class","btn btn-sm btn-primary")
		    	.text("Shift city in "+comptimeseldecoder().cached+" vs sum "+comptimeseldecoder().cached)
			.on("click", function() {
			    console.log(d);
			    console.log(i);
			    popupshift(comptimeseldecoder().cached,"US",comptimeseldecoder().cached,d.name);
			});

		    hovergroup.append("br");
		    hovergroup.append("br");


		    hovergroup.append("button")
			.attr("class","btn btn-xs btn-primary")
		    	.text("Select as reference for city-city comparison")
			.on("click", function() {
			    console.log(d);
			    console.log(i);
			    refcity = d.name;
			});

		    if (refcity.length > 0) {
			hovergroup.append("br");
			hovergroup.append("br");
			hovergroup.append("button")
			    .attr("class","btn btn-xs btn-primary")
		    	    .text("Compare against "+refcity+" in "+comptimeseldecoder().cached)
			    .on("click", function() {
				console.log(d);
				console.log(i);
				popupshift(comptimeseldecoder().cached,refcity,comptimeseldecoder().cached,d.name);
			    });
			hovergroup.append("br");
			hovergroup.append("br");
			hovergroup.append("button")
			    .attr("class","btn btn-xs btn-primary")
		    	    .text("Compare against "+refcity+" in "+reftimeseldecoder().cached)
			    .on("click", function() {
				console.log(d);
				console.log(i);
				popupshift(reftimeseldecoder().cached,refcity,reftimeseldecoder().cached,d.name);
			    });
		    }

		clearTimeout(popuptimer);

		popuptimer = setTimeout(hidehover,3000);
	    })
	    .on("mouseout", function(d,i) { 
		clearTimeout(popuptimer);

		popuptimer = setTimeout(hidehover,3000);
	    });

	return hedotools.sankey;
    };

    var replot = function() {
	// assuming that the data has been updated
	// console.log(oldstateselection);
	// console.log(newstateselection);

	console.log(data);
	
	oldstateselection.data(data)
	    .transition()
	    .duration(3000)
            .text(function(d,i) { return (d.oldindex+1)+". "+d.name; })
	    .attr("y",function(d,i) { return y(d.oldindex+1)+11; } );

    	newstateselection.data(data)
	    .transition()
	    .duration(3000)
            .text(function(d,i) { return (d.newindex+1)+". "+d.name; })
    	    .attr("y",function(d,i) { return y(d.newindex+1)+11; } );

	return hedotools.sankey;
    };

    // need functions to access updated properties
    var GETdata = function() {
	return data;
    };

    var GETnewindices = function() {
	return newindices;
    };

    var setTitles = function(titles) {
	listlabels = titles;
	return hedotools.sankey;
    };

    var setSideWidth = function(listTwoByOne) {
	extraSideWidth = listTwoByOne;
	return hedotools.sankey;
    };

    var setTipOn = function() {
	useTip = true;
	return hedotools.sankey;
    };

    var opublic = {
	plot: plot,
	setfigure: setfigure,
	setdata: setdata,
	data: GETdata,
	newindices: GETnewindices,
	replot: replot,
	setTitles: setTitles,
	setSideWidth: setSideWidth,
	setTipOn: setTipOn,
    };

    return opublic;

}();







