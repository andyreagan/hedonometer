// main context
(function() {

    String.prototype.width = function(font) {
	var f = font || '12px arial',
	o = $('<div>' + this + '</div>')
	    .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
	    .appendTo($('body')),
	w = o.width();
	o.remove();
	return w;
    }

    String.prototype.safe = function() {
	var tmp = this.split("/")
	tmp[tmp.length-1] = escape(tmp[tmp.length-1])
	return tmp.join("/");
    }

    function splitWidth(s,w) {
	// s is the string
	// w is the width that we want to split it to
	var t = s.split(" ");
	var n = [t[0]];
	var i = 1;
	var j = 0;
	while (i<t.length) {
	    if ((n[j]+t[i]).width() < w) {
		n[j] += " "+t[i]
	    }
	    else {
		j++;
		n.push(t[i]);
	    }
	    i++;
	}
	return n;
    }

    if ( document.documentElement.clientWidth < 500 ) { 
	var initialMonths = 3;
    }
    else { 
	var initialMonths = 18;
    }

    var dur =  550;
    var ignoreWords = ["thirsty","pakistan","india"];
    hedotools.shifter.ignore(ignoreWords);
    var bigdays = {};
    var shiftTypeSelect = false;
    var formatDate = d3.time.format("%b %Y");
    var today = new Date();
    var beginningOfTime = new Date(2008,8,10);
    var cformat = d3.time.format("%Y-%m-%d");
    var dformat = d3.time.format("%Y-%m-%dT00:00:00");
    var longformat = d3.time.format("%B %e, %Y");
    var longerformat = d3.time.format("%A, %B %e, %Y");
    var fromencoder = d3.urllib.encoder().varname("from");
    var fromdecoder = d3.urllib.decoder().varname("from").varresult(cformat(d3.time.month.offset(today,-initialMonths)));
    var toencoder = d3.urllib.encoder().varname("to");
    var todecoder = d3.urllib.decoder().varname("to").varresult(cformat(d3.time.day.offset(today,10)));
    var dateencoder = d3.urllib.encoder().varname("date");
    var datedecoder = d3.urllib.decoder().varname("date");
    var shiftselencoder = d3.urllib.encoder().varname("wordtypes");
    var shiftseldecoder = d3.urllib.decoder().varname("wordtypes").varresult("none");
    var weekDaysShort = ["sun","mon","tue","wed","thu","fri","sat"];
    var weekDays = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    var popupExitDur = 500;
    var popupEnterDur = 400;
    var intStr = ["zero","one","two","three"];
    // min radius for day circles
    var rmin = 0;
    // max radius for day circles
    // these get reset when the day toggle is called
    var rmax = 3.25;
    var legendDict = {
	"mon": "on",
	"tue": "on",
	"wed": "on",
	"thu": "on",
	"fri": "on",
	"sat": "on",
	"sun": "on",
	"hilite": "on",
	"togall": "on",
	toggle: function (name,r) {
	    this[name] =  this[name] === "on" ? "off" : "on";
	    toggleDays(r);
	},
    }
    var timeseries = [
	{
	    date: beginningOfTime,
	    value: 6.00,
	},
	{
	    date: today,
	    value: 6.00,
	},
    ];
    var circleColors = {
	"sunday": {
	    "fill": "#FFCCFF",
	},
	"monday": {
	    "fill": "#9933FF",
	},
	"tuesday": {
	    "fill": "#4BFFFE",
	},
	"wednesday": {
	    "fill": "#8AFF82",
	},
	"thursday": {
	    "fill": "#009900",
	},
	"friday": {
	    "fill": "#F87D15",
	},
	"saturday": {
	    "fill": "#F70012",
	},
	"hilite": {
	    "fill": "#000",
	},
	"togall": {
	    "fill": "#000",
	},
    }

    // no longer in use
    function getDay(d) {
    	return weekDays[d.date.getDay()];
    };


    // Boston will be ran whenever we mouse over a circle
    function myMouseDownOpenWordShiftFunction() {
	var circle = d3.select(this);
	popdate = cformat.parse(circle.attr("shortdate"));
	transitionBigShift(popdate);
    };

    function toggleDays(r) {
	//run through the legendDict to see what's on or off...
	for (var i=0; i < weekDays.length; i=i+1) {
	    if (legendDict[weekDaysShort[i]] == 'on') {
		d3.selectAll("."+weekDays[i]).style("visibility", "visible");
	    }
	    else {
		d3.selectAll("."+weekDays[i]).style("visibility", "hidden");
	    }
	}
	// check the highlight individually
	if (legendDict['hilite'] == 'on') { 
	    d3.selectAll(".Hilite").transition().duration(250).attr("visibility", "visible");
	}
	else { 
	    d3.selectAll(".Hilite").transition().duration(250).attr("visibility", "hidden");
	}
    };

    // not in use
    function myMouseDownHideDiv() {
	var item = d3.select(this);
	item.attr("style", "display: none;")
    };

    // not in use
    function myMouseDownClearMinibox() {
	var item = d3.select("#minibox");
	item.attr("style", "display: hidden;")
    };

    function popitup(url) {
	newwindow = window.open(url, 'name', 'height=820,width=780,scrollbars=no,resizeable=0');
	if (window.focus) {
	    newwindow.focus()
	}
	return false;
    };

    function myMouseOutFunction() {
	// don't remove the popup
	// d3.select("#minilist").remove();
	var circle = d3.select(this);
	var currRange = (x.domain()[1].getTime()-x.domain()[0].getTime());
	circle.transition().duration(250).attr("r",rScale(currRange)).style("stroke-width", .7);
	clearTimeout(hovertimer);
    };

    // this will run whenever we mouse over a circle
    function myMouseOverFunction() {
	// context is invoked inside mouseover event
	var circle = d3.select(this);
	popdate = cformat.parse(circle.attr("shortdate"));
	hovertimer = setTimeout(function(){drawSmallShift(parseFloat(circle.attr("cx")),parseFloat(circle.attr("cy")),popdate,false)},popupEnterDur);
    };

    function getDate(d) {
	return new Date(d.date);
    };

    // min radius for day circles
    var rmin = 0;
    // max radius for day circles
    // these get reset when the day toggle is called
    var rmax = 2.75; // scale down to 1.25 for whole timeseries

    var margin = {
	top: 10,
	right: 40,
	bottom: 100,
	left: 0
    },
    width = parseInt(d3.select("#bigbox").style("width"))-margin.left-margin.right,
    height = d3.max([300,parseInt(d3.select("#bigbox").style("width"))*0.5-margin.bottom-margin.top]),
    height2 = 50;
    // vertical space to give the bottom brush selection
    var MainxAxisSpace = 40;
    //height2 = document.documentElement.clientHeight * 0.5;

    var bigdayscale = d3.scale.linear()
    	.domain([0,today.getTime()-beginningOfTime.getTime()])
        .range([-100,99.5]);

    var x = d3.time.scale().range([0, width - 7]); //.domain([new Date(2008,8,10),today]);
    var x2 = d3.time.scale().range([0, width - 7]).domain([beginningOfTime,today]);

    var y = d3.scale.linear().range([height, 0]);
    var y2 = d3.scale.linear().range([height2, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");
    yAxis2 = d3.svg.axis().scale(y).orient("right").ticks(7);

    // console.log([d3.time.month.offset(today,-18),today]);
    // console.log([x2(d3.time.month.offset(today,-18)),x2(today)]);
    // var brush = d3.svg.brush().x(x2).extent([d3.time.month.offset(today,-18),today]).on("brush", brushing).on("brushend",brushended);
    var brush = d3.svg.brush()
	.x(x2)
	.extent([cformat.parse(fromdecoder().cached),cformat.parse(todecoder().cached)])
	.on("brush", brushing)
	.on("brushend",brushended);

    // console.log(brush.extent());
    // console.log([fromdecoder().current,todecoder().current]);

    // var fisheye = d3.fisheye.circular()
    // 	.radius(120);

    var line = d3.svg.line()
	.x(function(d) {
	    return x(d.date);
	})
	.y(function(d) {
	    return y(d.value);
	});

    var line0 = d3.svg.line();
    // var fishline0 = d3.svg.line();
    // 	// .x(function(d) { return d.x })
    // 	// .y(function(d) { return d.y });

    var date1 = new Date(0000, 11, 25);
    var format = d3.time.format("%m-%d");

    var prevx = 0;
    var prevy = 0;

    //This attempts to draw a line that connects all dates that match 11/25
    var line3 = d3.svg.line().x(function(d) {
	if ((format(d.date) == format(date1))) {
	    prevx = d.date;
	    return x(d.date);
	} else {
	    return x(prevx);
	}
    }).y(function(d) {
	if ((format(d.date) == format(date1))) {
	    prevy = d.value;
	    return y(d.value);
	} else {
	    return y(prevy);
	}
    });

    var area2 = d3.svg.area().interpolate("linear").x(function(d) {
	return x2(d.date);
    }).y0(height2).y1(function(d) {
	return y2(d.value);
    });

    var svg = d3.select("#bigbox").append("svg")
	.attr("id", "timeseries")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.attr("font","12px sans-serif");

    svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);

    var focus = svg.append("g")
	.attr("id", "focus")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var focus2 = svg.append("g")
	.attr("id", "focus2")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // remove the popup wordshift for any click on this group
    // which should be behind the wordshift
    // doesn't work in chrome
    // .on("mousedown",function() { d3.select("#minilist").remove() });

    var legendgroup = svg.append("g")
	.attr({"class": "legendgroup",
	       "transform": "translate("+(width-10-366)+","+1+")",});

    legendgroup.append("rect")
	.attr({"class": "legendbox",
	       "x": 0,
	       "y": 0,
	       "rx": 3,
	       "ry": 3,
	       "width": 366,
	       "height": 19,
	       "fill": "#F0F0F0",
	       'stroke-width': '0.5',
	       'stroke': 'rgb(0,0,0)'});

    var legendboxwidth = 43;

    legendgroup.selectAll("circle")
	.data(weekDaysShort)
	.enter()
	.append("circle").on("mousedown", function(d,i) {
	    var currRange = (x.domain()[1].getTime()-x.domain()[0].getTime());
	    legendDict.toggle(d,rScale(currRange));
	    //toggleDays();
	})
	.attr("cx", function(d,i) { return 8+legendboxwidth*i; })
	.attr("cy", 9)
	.attr("r", rmax)
	.attr("stroke", "black")
	.attr("stroke-width", 0.7)
	.attr("fill", function(d,i) { return circleColors[weekDays[i]].fill; })
	.attr("class", function(d,i) { return weekDays[i]; });

    legendgroup.selectAll("text")
	.data(weekDaysShort)
	.enter()
	.append("text")
	.attr("x", function(d,i) { return 15+legendboxwidth*i; })
	.attr("y", 14)
	.on("mousedown", function(d,i) {
	    var currRange = (x.domain()[1].getTime()-x.domain()[0].getTime());
	    legendDict.toggle(d,rScale(currRange));
	    //toggleDays();
	})
    // return first three letters for the name
	.text(function(d,i) { return weekDays[i][0].toUpperCase()+weekDays[i][1]+weekDays[i][2] });
    //.attr("class",function(d,i) { return weekDays[i] });

    legendgroup.selectAll("rect.legendclick")
	.data(weekDaysShort)
	.enter()
	.append("rect")
	.attr({"class": "legendrect",
	       "x": function(d,i) { return legendboxwidth*i; },
	       "y": 0,
	       "width": legendboxwidth-2,
	       "height": 19,
	       "fill": "white", //http://www.w3schools.com/html/html_colors.asp
	       "opacity": "0.0",})
	.on("mousedown", function(d,i) {
	    var currRange = (x.domain()[1].getTime()-x.domain()[0].getTime());
	    legendDict.toggle(d,rScale(currRange));
	});

    legendgroup.selectAll("line")
	.data([0,0,0,0,0,0,0])
	.enter()
	.append("line")
	.attr("stroke","grey")
	.attr("stroke-width","2")
	.attr("x1", function(d,i) { return 42+legendboxwidth*i+d; })
 	.attr("x2", function(d,i) { return 42+legendboxwidth*i+d; })
	.attr("y1", 0)
	.attr("y2", 19);
    
    // was at 350
    legendgroup.append("svg:circle").on("mousedown", function() {
	var currRange = (x.domain()[1].getTime()-x.domain()[0].getTime());
	legendDict.toggle('togall',rScale(currRange));
    }).attr("cx", 306).attr("cy", 9).attr("r", rmax).attr("stroke", "black").attr("stroke-width", 0.7).attr("class", "Togall")
    
    legendgroup.append("svg:text").attr("x", 306 + 6).attr("y", 14).text("All on/off").attr("class", "togall").attr("id","togall");
    
    legendgroup.append("rect")
	.attr({"class": "legendrect",
	       "x": 301,
	       "y": 0,
	       "width": 66,
	       "height": 20,
	       "fill": "white", //http://www.w3schools.com/html/html_colors.asp
	       "opacity": "0.0",})
	.on("mousedown", function() {
	    legendDict.toggle('togall');
	    legendDict['mon'] = legendDict['togall'];
	    legendDict['tue'] = legendDict['togall'];
	    legendDict['wed'] = legendDict['togall'];
	    legendDict['thu'] = legendDict['togall'];
	    legendDict['fri'] = legendDict['togall'];
	    legendDict['sat'] = legendDict['togall'];
	    legendDict['sun'] = legendDict['togall'];
	    // the call inside .toggle above won't get that all the days
	    // were reset
	    var currRange = (x.domain()[1].getTime()-x.domain()[0].getTime());
	    toggleDays(rScale(currRange));
	});


    var datearray = [
	[beginningOfTime, new Date(2009,11,31)],
	[new Date(2010,00,01), new Date(2010,11,31)],
	[new Date(2011,00,01), new Date(2011,11,31)],
	[new Date(2012,00,01), new Date(2012,11,31)],
	[new Date(2013,00,01), new Date(2013,11,31)],
	[beginningOfTime, today],
	[d3.time.month.offset(today,-18), today],
    ],
    yearstrings = ["\u2192 2009","2010","2011","2012","2013","Full","Last 18 mo"],
    yearstringslen = yearstrings.map(function(d) { return d.width(); }),
    initialpadding = 2,
    boxpadding = 5,
    fullyearboxwidth = datearray.length*boxpadding*2-boxpadding+initialpadding+d3.sum(yearstringslen);


    svg.append("text")
	.attr({
	    "x": (width-10-fullyearboxwidth-53),
	    "y": 44,
	    "fill": "grey",
	    })
	.text("Jump to:");

    var yeargroup = svg.append("g")
	.attr({"class": "yeargroup",
	       "transform": "translate("+(width-10-fullyearboxwidth)+","+30+")",});

    yeargroup.append("rect")
	.attr({"class": "yearbox",
	       "x": 0,
	       "y": 0,
	       "rx": 3,
	       "ry": 3,
	       "width": fullyearboxwidth,
	       "height": 19,
	       "fill": "#F0F0F0",
	       'stroke-width': '0.5',
	       'stroke': 'rgb(0,0,0)'});

    yeargroup.selectAll("text")
    	.data(yearstrings)
    	.enter()
    	.append("text")
    	.attr("x", function(d,i) { 
	    // start at 2
	    if (i==0) { return initialpadding; }
	    // then use 2+width+10+width+10+width...
	    // for default padding of 5 on L/R
	    else { return d3.sum(yearstringslen.slice(0,i))+initialpadding+i*boxpadding*2; }
	})
    	.attr("y", 14)
    	.text(function(d,i) { return d; });

    yeargroup.selectAll("rect.yearclick")
    	.data(datearray)
    	.enter()
    	.append("rect")
    	.attr({"class": "yearrect",
    	       "x": function(d,i) { if (i === 0) { return 0; }
	    else { return d3.sum(yearstringslen.slice(0,i))+i*boxpadding+(i-1)*boxpadding+initialpadding; } },
    	       "y": 0,
    	       "width": function(d,i) { if (i === 0) { return yearstringslen[i]+initialpadding+boxpadding; } else { return yearstringslen[i]+boxpadding*2; }},
    	       "height": 19,
    	       "fill": "white", //http://www.w3schools.com/html/html_colors.asp
    	       "opacity": "0.0",})
    	.on("mousedown", function(d,i) {
	    // console.log(yearstrings[i]);
	    // do everything brush related
	    brush.extent(d);
	    brushing();
	    brushended();
	    context.select(".x.brush")
		.call(brush);
	    var cutoff = bigdayscale(d[1].getTime()-d[0].getTime());
	    d3.selectAll("text.bigdaytext").transition().duration(1000).attr("visibility",function(d,i) { if ( d.importance > cutoff ) { return "visible"; } else { return "hidden"; } })
	    d3.selectAll("line.bigdayline").transition().duration(1000).attr("visibility",function(d,i) { if ( d.importance > cutoff ) { return "visbile"; } else { return "hidden"; } })
    	});

    yeargroup.selectAll("line")
    	.data(yearstrings.slice(0,yearstrings.length-1))
    	.enter()
    	.append("line")
    	.attr("stroke","grey")
    	.attr("stroke-width","2")
    	.attr("x1", function(d,i) { 
	    return d3.sum(yearstringslen.slice(0,i+1))+i*boxpadding+(i+1)*boxpadding+initialpadding;
	})
    	.attr("x2", function(d,i) { 
	    return d3.sum(yearstringslen.slice(0,i+1))+i*boxpadding+(i+1)*boxpadding+initialpadding;
	})
    	.attr("y1", 0)
    	.attr("y2", 19);

    var context = svg.append("g").attr("id", "context").attr("transform", "translate(" + margin.left + "," + (height+MainxAxisSpace) + ")");

    var minDate,maxDate;

    d3.csv("http://hedonometer.org/data/word-vectors/sumhapps.csv", function(data) {
	minDate = getDate(data[0]);
	maxDate = getDate(data[data.length - 1]);
	var parse = d3.time.format("%Y-%m-%d").parse;

	for (i = 0; i < data.length; i++) {
	    data[i].shortDate = data[i].date;
	    data[i].date = parse(data[i].date);
	    data[i].value = +data[i].value;
	}

	timeseries = data;

	x.domain(d3.extent(data.map(function(d) {
	    return d.date;
	})));
	y.domain([5.8, 6.40]);
	//x2.domain(x.domain());
	y2.domain(y.domain());

	// var path = focus.append("path").attr("id", "path").data([data]).attr("clip-path", "url(#clip)").attr("d", fishline);
	var path = focus.append("path").attr("id", "path").data([data])
	    .attr({ "clip-path": "url(#clip)",
		    "d": line,
		    "fill": "none",
		    "stroke": "grey",
		    "stroke-width": "0.5px",});

	// focus.append("path").attr("id", "path").data([data]).attr("clip-path", "url(#clip)").attr("d", line3);

	focus.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").transition().duration(dur).call(xAxis);
	// text for legend h_avg
	// focus.append("text").attr("class", "y labelTimeseries").attr("text-anchor", "start").attr("y", 6).attr("x", width-250).attr("dy", ".75em").attr("transform", "rotate(0)").text("Average Happiness h").append("tspan").attr("baseline-shift","sub").text("avg");
	//focus.append("g").attr("class", "y axis").call(yAxis);
	focus.append("g").attr("class", "y axis").attr("transform", "translate(" + width + ",0)").call(yAxis2);

	// go ahead and apply styles directly to these
	focus.select(".x.axis").select("path").attr("fill","none");
	focus.select(".x.axis").selectAll("line")
	    .attr({"fill": "none",
		   "stroke": "grey",
		   "shape-rendering": "crispEdges",
		  });
	focus.select(".y.axis").select("path").attr("fill","none");

	horizontalLineGroup = focus.append("g")
	horizontalLineGroup.selectAll("line").data(y.ticks(7).slice(1,7)).enter().append("line")
	    .attr("class", "horizontalLines")
	    //.attr("transform", "translate(" + width + ",0)").call(yAxis2);
	    .attr("x1",0)
	    .attr("x2",width)
	    .attr("y1",function(d){ return y(d); })
	    .attr("y2",function(d){ return y(d); })
	    .attr("fill","none")
	    .attr("stroke",function(d,i) { if (i===0) {return "grey";} else {return "grey";} })
	    .attr("stroke-dasharray",function(d,i) { if (i===0) {return "5";} else {return "5";} })
	    .attr("stroke-width","0.3px");

	horizontalLineGroup.append("line")
	    .attr("class", "horizontalLinesFirst") //.attr("transform", "translate(" + width + ",0)").call(yAxis2);
	    .attr("x1",0)
	    .attr("x2",width)
	    .attr("y1",function(d){ return y(y.ticks(7)[0]); })
	    .attr("y2",function(d){ return y(y.ticks(7)[0]); })
	    .attr("fill","none")
	    .attr("stroke",function(d,i) { if (i===0) {return "grey";} else {return "grey";} })
	//.attr("stroke-dasharray",function(d,i) { if (i===0) {return "";} else {return "5";} })
	    .attr("stroke-width","1.7px");
	
	// focus2.append("text").attr("class", "labelTimeseries whitebox").attr("text-anchor", "end").attr("x", 168).attr("y", 427).attr("dy", ".75em").text("Select and slide time periods:").order();

	// console.log(data);
	
	var circle = focus2.selectAll("circle").data(data);

    	var currRange = (x.domain()[1].getTime()-x.domain()[0].getTime());
    	    //yearDict.toggle(d,);



	circle.enter().append("circle")
	    .attr({
		"class": function(d) { return weekDays[d.date.getDay()]; },
		"fill": function(d) { return circleColors[weekDays[d.date.getDay()]].fill; },
		"stroke": "#000",
		"stroke-width": "0.5",
		"opacity": "0.7",
		"cursor": "hand",
		"cursor": "pointer",
		"cx": function(d, i) { return x(d.date); },
		"clip-path": "url(#clip)",
		"shortdate": function(d) { return d.shortDate;  },
		"havg": function(d) { d.value.toFixed(2); },
		"day": function(d) { return weekDays[d.date.getDay()]; },
		"date": function(d) { return d.date; },
		"cy": function(d) { return y(d.value); },
		"r": function(d) { return rScale(currRange); }, })
	    .on("mouseover.enlarge", function() { d3.select(this).transition().duration(250).attr("r", 7.5).style("stroke-width", .5); })
	    .on("mouseover.popup",myMouseOverFunction) 
	    .on("mouseout", myMouseOutFunction)
	    .on("mousedown", myMouseDownOpenWordShiftFunction);

	context.append("path")
	    .data([data])
	    .attr({ "class": "mini",
		    "fill": "lightgrey",
		    "stroke": "black",
		    "stroke-width": ".5px",
		    "d": area2,
		  });

	context.append("g").attr("class", "x axis")
	    .attr("transform", "translate("+"0"+"," + height2 + ")")
	    .call(xAxis2);

	context.select(".x.axis").selectAll("line")
	    .attr({"fill": "none",
		   "stroke": "grey",
		   "shape-rendering": "crispEdges",
		  });

	context.select(".x.axis").select("path").attr("fill","none");

	var format = d3.time.format("%m-%d");

	// http://hedonometer.org/api/v1/events/?format=json
	d3.json('http://hedonometer.org/api/v1/events/?format=json',function(json) { 
	    bigdays = json.objects;
	    bigdays.map( function(d) { d.date = dformat.parse(d.date);
				       d.x = parseFloat(d.x);
				       d.shorter = d.shorter.split(',');
				       // don't let them overflow the bottom
				       d.y = d3.min([parseFloat(d.y),height-parseFloat(y(d.value))-d.shorter.length*10]); 
				       d.importance = parseFloat(d.importance);})

	    var bigdaylines = focus2.selectAll("line.bigdayline").data(bigdays).enter()
		.append("line")
		.attr({
		    // the x and y get set upon brushing
		    "stroke": "grey",
		    "stroke-width": 0.5,
		    "class": "bigdayline",
		    "visibility": "hidden",
		});

	    var bigdaygroups = focus2.selectAll("g.bigdaygroup").data(bigdays).enter()
		.append("g")
	        .attr("class","bigdaygroup")
		.attr("transform",function(d,i) { return "translate("+(x(d.date)+d.x)+","+(y(d.value)+d.y)+")"; });
	    
	    var textwidth = 6;
	    // width of characters
	    var charwidth = 3;

	    var line0 = bigdaygroups
		.append("text")
		.text(function(d) { // console.log(d.shorter.length); 
 return d.shorter[0]; } )
		.attr("class","bigdaytext")
 	    // .attr("stroke-width","0.1")
		.attr("dx", 0)
		      //function(d) { 
		    // return -d.shorter[0].width()/2; 
		    // return 0; 
		    //return -d.shorter[0].length*charwidth/2; 
		    // return -d3.select(this).attr("width")/2;
		//})
		.attr("dy", function(d) { return 0; })
		.attr("stroke","")
		.attr("fill","grey")
		.attr("visibility","hidden");

	    bigdaygroups
		.append("text")
		.text(function(d) { if (d.shorter.length > 1) { return d.shorter[1]; }
				    else { return ""; } })
		.attr("class","bigdaytext")
		.attr("dx", 0) // function(d) { 
		//     if (d.shorter.length > 1) {
		// 	// return -d.shorter[1].width()/2; 
		// 	// return 0;
		// 	return -d.shorter[1].length*charwidth/2; 
		//     } 
		//     else { 
		// 	return 0; 
		//     } 
		// })
		.attr("dy", function(d) { return 15; })
		.attr("stroke","")
		.attr("fill","grey")
		.attr("visibility","hidden");

	    bigdaygroups
		.append("text")
		.text(function(d) { if (d.shorter.length > 2) { return d.shorter[2]; }
				    else { return ""; } })
		.attr("class","bigdaytext")
		.attr("dx", 0)
		.attr("dy", function(d) { return 30; })
		.attr("stroke","")
		.attr("fill","grey")
		.attr("visibility","hidden");

	    bigdaygroups
		.append("text")
		.text(function(d) { if (d.shorter.length > 3) { return d.shorter[3]; }
				    else { return ""; } })
		.attr("class","bigdaytext")
		.attr("dx", 0)
		.attr("dy", function(d) { return 45; })
		.attr("stroke","")
		.attr("fill","grey")
		.attr("visibility","hidden");
	    
	    // d3.selectAll("text.bigdaytext").attr("dx",function(d) {
	    // 	return -d3.select(this).attr("width")/2;
	    // })

	    // call the brush initially
	    brushing();
	    focus.selectAll(".brushingline")
		.attr({ 
		    "visibility": "hidden",
		});

	    // now go and fix all of the offsets
	    d3.selectAll("text.bigdaytext").attr("dx",function(d,i) { return -this.clientWidth/2; })
	    // d3.selectAll("text.bigdaytext").attr("fill","white")
	    // d3.selectAll("line.bigdayline").attr("stroke","white")

	    // add a catch to update the popup based on whether there was a big event
	    // console.log(datedecoder().current);
	    if (datedecoder().current.length > 0) {
		// console.log("checking for popup event");
		var pulldate = cformat.parse(datedecoder().current);
		for (var i=0; i<bigdays.length; i++) {
		    if (bigdays[i].date.getTime() === pulldate.getTime()) {
			bigdaytest = true;
			bigdaywiki = bigdays[i].wiki;
			bigdaytext = bigdays[i].longer;
			// console.log(addthis_share.passthrough.twitter.text);
			addthis_share.passthrough.twitter.text = bigdaytext+", "+longformat(pulldate)+", word shift:"
			// console.log(addthis_share.passthrough.twitter.text);
			d3.select('#modaltitle').html('Interactive Wordshift <span class="label label-default">Major Event <i class="fa fa-signal"></i></span> <a href="'+bigdaywiki.safe()+'" target="_blank"><img src="https://lh6.ggpht.com/-Eq7SGa8CVtZCQPXmnux59sebPPU04j1gak4ppkMVboUMQ_ucceGCHrC1wtqfqyByg=w300" height="35"/></a>');
			var modalbody = d3.select("#moveshifthere");
			var paragraphs = modalbody.selectAll("p").data(["<b>"+longerformat(pulldate)+"</b>","<b>"+bigdaytext+"</b>"]);
			paragraphs.attr("class","shifttitle").html(function(d,i) { return d; } );
			break;
		    };
		};
	    };
	} );

	// d3.select(".x.brush").call(brush.event);
	var brushgroup = context.append("g").attr("class", "x brush")
	    .call(brush);
	// .call(brush.event);
	
	brushgroup
	    .selectAll("rect")
	    .attr({"y": -6,
 		   "height": (height2 + 7),
		   "stroke": "#fff",
		   "fill-opacity": .125,
		   "shape-rendering": "crispEdges",
		   "cursor": "ew-resize",
		  });

	// call the brush initially
	brushing();

	focus.selectAll(".brushingline")
	    .attr({ 
		"visibility": "hidden",
	    });


    }); // main data load

    // function fishline(d) { 
    // 	return fishline0(d.map(function(d) {
    // 	    d = fisheye({x: x(d.date), y: y(d.value)});
    // 	    return [d.x, d.y];
    // 	}));
    // };

    function line(d) { 
	return line0(d.map(function(d) {
	    return [d.x, d.y];
	}));
    };

    function brushended() {
	// console.log("brushended");
	fromencoder.varval(cformat(x.domain()[0]));
	toencoder.varval(cformat(x.domain()[1]));
	focus.selectAll(".brushingline")
	    .attr({ 
		"visibility": "hidden",
	    });
    }

    focus.selectAll("brushingline").data([0,width]).enter().append("line")
	.attr({
	    "class": "brushingline",
	    "x1": function(d,i) { return d; },
	    "x2": function(d,i) { return x2(brush.extent()[i]); },
	    "y1": 475,
	    "y2": 500,
	    "stroke": "#C0C0C0",
	    "stroke-width": 2,
	    "visibility": "hidden",
	});

    function brushing() {
	// console.log("brushing");
	// console.log(x.domain()[0].getTime());
	// console.log(x.domain()[1].getTime());
	// console.log(x2.domain());
	// console.log(brush.extent());

	var currRange = (brush.extent()[1].getTime()-brush.extent()[0].getTime());
	// var currRange = (x.domain()[1].getTime()-x.domain()[0].getTime());
	// toggleDays(rScale(currRange));

	//x.domain(brush.empty() ? x2.domain() : brush.extent());
	x.domain(brush.empty() ? x2.domain() : brush.extent());
	//focus.select("#path").attr("d", fishline);
	focus.select("#path").attr("d", line);
	focus.select(".x.axis").call(xAxis);

	focus.select(".x.axis").selectAll("line")
	    .attr({"fill": "none",
		   "stroke": "grey",
		   "shape-rendering": "crispEdges",
		  });
	
	focus.selectAll(".brushingline")
	    .attr({ 
		"x2": function(d,i) { return x2(brush.extent()[i]) },
		"visibility": "visible",
	    });

	var circle = focus2.selectAll("circle").attr("cx", function(d) {
	    return x(d.date);
	}).attr("cy", function(d) {
	    return y(d.value);
	});
	
	focus2.selectAll("circle")
 	    .attr("r", function(d) {
	    	return rScale(currRange);
	    });

	var rect = focus2.selectAll("rect").attr("x", function(d) {
	    return x(d.date);
	}).attr("y", function(d) {
	    return y(d.value + .02);
	});

	var lines = focus2.selectAll("line.bigdayline")
	    .attr({
		"x1": function(d,i) { return x(d.date); },
		"x2": function(d,i) { return x(d.date)+d.x; },
		"y1": function(d,i) { return y(d.value)+3*(d.y/Math.abs(d.y)); }, // 2 in the direction of the offset +2*(d.y/d.y)
		"y2": function(d,i) { if (d.y > 0) { return y(d.value)+d.y-10; } else { return y(d.value)+d.y+d.shorter.length*12-6;} },
	    });
	
	var groups = focus2.selectAll("g.bigdaygroup")
	    .attr("transform",function(d,i) { return "translate("+(x(d.date)+d.x)+","+(y(d.value)+d.y)+")"; });

	d3.select("#minilist").remove();
	
	var cutoff = bigdayscale(currRange);
	// console.log(cutoff);

	// d3.selectAll("text.bigdaytext").attr("fill",function(d,i) { if ( d.importance > cutoff ) { return "grey"; } else { return "white"; } })
	// d3.selectAll("line.bigdayline").attr("stroke",function(d,i) { if ( d.importance > cutoff ) { return "grey"; } else { return "white"; } })
	d3.selectAll("text.bigdaytext").transition().duration(1000).attr("visibility",function(d,i) { if ( d.importance > cutoff ) { return "visible"; } else { return "hidden"; } })
	d3.selectAll("line.bigdayline").transition().duration(1000).attr("visibility",function(d,i) { if ( d.importance > cutoff ) { return "visbile"; } else { return "hidden"; } })
    }

    var fullRange = (today.getTime()-1222964002773);
    var rScale = d3.scale.linear().range([rmax,1.25]);
    rScale.domain([0,fullRange]);

    function offsetXY(x, y, s) {
	// if on the right
	if (x >= 600) {
	    x = x - 220;
	    // if on the top
	    if (y <= 210) { 
		y = y - 10;
		x = x - 30;
	    } 
	    else { y = y - 224; }
	} 
	// on the left
	else {
	    x = x - 7;
	    // if on the top
	    if (y <= 210) {
		y = y - 10;
		x = x + 20;
	    } else {
		y = y - 224;
	    }
	}
	if (s == 'X') {
	    return x;
	}
	if (s == 'Y') {
	    return y;
	}
    };

    function triangleptsXY(x, y) {
	var trianglepointsA = ["10 0, 10 225, 20 215, 230 215, 230 0, 10 0"]
	var trianglepointsB = ["205 215, 215 225, 215 215, 230 215, 230 0, 10 0, 10 215, 205 215"]
	var trianglepointsC = ["10 10, 0 20, 10 20, 10 215, 230 215, 230 0, 10 0, 10 10"]
	var trianglepointsD = ["230 10, 240 20, 230 20, 230 215, 10 215, 10 0, 230 0, 230 10"]
	var result = []
	if (x >= 600) {
	    if (y <= 210) {
		result = trianglepointsD;
	    } else {
		result = trianglepointsB;
	    }
	} else {
	    if (y <= 210) {
		result = trianglepointsC;
	    } else {
		result = trianglepointsA;
	    }
	}
	return result;
    };

    function transitionBigShift(popdate) {
	// called directly on "expand detailed shift" click
	// resizes the #minilist group and the svg within it
	//   -> the svg gets both it's transform and width, height updated

	// console.log(cformat(circle));

	d3.select('#moveshifthere').selectAll('svg').remove();
	d3.select('#minilist').remove();

	var modalwidth = 558;
	// this call will work only once the modal is active
	// parseInt(d3.select("#moveshifthere").style("width"));
	var modalheight = 495;

	// now trying to load in data from zoo
	d3.text("http://hedonometer.org/data/word-vectors/"+cformat(popdate)+"-sum.csv",function(tmp) {
	    compFvec = tmp.split('\n').slice(0,10222);
	    d3.text("http://hedonometer.org/data/word-vectors/"+cformat(d3.time.day.offset(popdate,0))+"-prev7.csv",function(tmp2) {
		refFvec = tmp2.split('\n').slice(0,10222);

		// console.log("see if all four vectors are here:");
		// console.log(lens);
		// console.log(words);
		// console.log(refFvec);
		// console.log(compFvec);
		// console.log(d3.select('#moveshifthere'));

		hedotools.shifter._refF(refFvec);
		hedotools.shifter._compF(compFvec);
		hedotools.shifter._words(words);
		hedotools.shifter._lens(lens);
		hedotools.shifter.stop();
		hedotools.shifter.shifter();
		hedotools.shifter.setWidth(modalwidth);
		hedotools.shifter.setText([" "," "," "," "]);
		hedotools.shifter.setfigure(d3.select('#moveshifthere')).plot();

		// danger! this calls next day
		// so, it's replotting
		// but this does get the main text up, and set the date
		// the previous call should really just initialize the plot with blank data
		// since we're loading twice as much!
		$('#dp1').datepicker('setDate',popdate);

		$('#myModal').modal('toggle'); 

	    }) // data
	    
	}) // metadata


	
    }; // transitionBigShift

    var numWords = 27;
    
    // global declaration
    // drawSmallShift = function drawSmallShift(circle) {
    // inside function closure
    function drawSmallShift(cx,cy,popdate) {
	// remove old guys
	d3.select("#minilist").remove();

	// var circleX = parseFloat(circle.attr("cx"));
	// var circleY = parseFloat(circle.attr("cy"));
	var circleX = parseFloat(cx);
	var circleY = parseFloat(cy);
	
	var miniboxX = offsetXY(circleX, circleY, "X");
	var miniboxY = offsetXY(circleX, circleY, "Y");

	// console.log(miniboxX);
	// console.log(miniboxY);

	// not sure what these are
	var py = 5;
	var px = 210;
	// number of bars
	var barcount = 9;
	
	// append the main svg
	var shortlist = d3.select("#timeseries").append("g")
	    .attr("transform", "translate(" + miniboxX + "," + miniboxY + ")")
	    .attr("id", "minilist")
	    .on("mouseleave",function(d,i) {
		//console.log("mouseleave");
		minilistMouseLeaveTimer = setTimeout(function() {
		    d3.select("#minilistbg").transition().duration(200).remove(); 
		    d3.select("#minilist").transition().duration(200).remove();
		},popupExitDur);
	    })
	    .on("mouseenter",function(d,i) { 
		//console.log("mouseenter");
		try {
		    clearTimeout(minilistMouseLeaveTimer);
		}
		catch(err) {
		    // console.log(err);
		}
	    });
	// these are for logging the events
	// I was having issues when the minilistbg was appended
	// before the shortlist. I appended it after, and attached
	// these (the above) events to the group, not the rect
	// .on("mouseout",function(d,i) { 
	// 	console.log("mouseout");
	// });
	// .on("mouseover",function(d,i) { 
	// 	console.log("mouseover");
	// });

	// draw a background rectangle to remove the popup on click out
	// d3.select("#timeseries").insert("rect","#minilist")
	// d3.select("#timeseries").append("rect")
	// and now it's inside the list, just to make the group the right size
	    shortlist.append("rect")
		.attr("id","minilistbg")
	    // .attr("width", mainWidth + mainMargin.left + mainMargin.right + 35)
	    // .attr("height", mainHeight + mainMargin.top + mainMargin.bottom)
		.attr("width", 315)
		.attr("height", 260)
	    //.attr("transform", "translate(" + (miniboxX-40) + "," + (miniboxY-40) + ")")
		.attr("transform", "translate(-40,-40)") // it is 40 wider
	    // than the pop-up, in every dimension
		.attr("fill","grey")
		.attr("opacity",0.01); // it needs some opacity to be clickable
	    // these events are now on the group
	    //.on("mousedown",function(d,i) { d3.select(this).remove(); d3.select("#minilist").remove(); } );

	    shortlist.append("svg:polyline").attr("id", "shadow").attr("points", function(d) {
		return triangleptsXY(circleX, circleY); })
		.attr("transform", "translate(4,4)")
		.attr("stroke", "grey").attr("fill", "grey").attr("opacity", 0.2).attr("stroke-width", "1");

	    shortlist.append("svg:polyline").attr("id", "bg").attr("points", function(d) {
		return triangleptsXY(circleX, circleY);
	    }).attr("stroke", "grey").attr("fill", "white").attr("opacity", 0.96).attr("stroke-width", "1");

	    // shortlist.append("svg:text").attr("x", 20).attr("y", 14).attr("shortdate", circle.attr("shortdate")).text(circle.attr("day") + ", " + longformat(cformat.parse(circle.attr("shortdate")))).attr("font-size", "10px").attr("font-weight", "bold").attr("class","shifttitledate");
	    shortlist.append("svg:text").attr("x", 20).attr("y", 14).text(longerformat(popdate)).attr("font-size", "10px").attr("font-weight", "bold").attr("class","shifttitledate"); 

	for (var i=0; i<bigdays.length; i++) {
	    //console.log(bigdays[i].date);
	    if (bigdays[i].date.getTime() === popdate.getTime()) {
		// console.log("major event");
		shortlist.append("text").attr("x", 200).attr("y", 24)
		    .attr('font-family', 'FontAwesome')
		    .attr('font-size', function(d) { return '2em'} )
		    .text(function() { return '\uF012' }); 
		var tmp = splitWidth(bigdays[i].longer,230);
		shortlist.append("text").attr("x", 20).attr("y", 38)
		//.html(function() { return '<b>'+bigdays[i].caption+'</b>'; })
		    .text(function() { return tmp[0]; })
		    .attr("font-weight","bold")
		    .attr("font-size", "10px")
		    .attr("class","shifttitlebigdaytext");
		if (tmp.length > 1) {
		    shortlist.append("text").attr("x", 20).attr("y", 49)
			.text(function() { return tmp[1]; })
			.attr("font-weight","bold")
			.attr("font-size", "10px")
			.attr("class","shifttitlebigdaytext");
		}
		break;
	    }
	}

	d3.csv("http://hedonometer.org/data/shifts/" + cformat(popdate) + "-shift.csv", function(csv) {
	    var names = csv.map(function(d) { return d.word; });
	    var sizes = csv.map(function(d) { return d.mag; });
	    var types = csv.map(function(d) { return d.type; });

	    // set the width for bars
	    //var x0 = Math.max(-d3.min(sizes) * 1.33, d3.max(sizes) * 1.33);
	    //var x = d3.scale.linear().domain([-x0, x0]).range([0, 400]);
	    //var y = d3.scale.linear().domain(d3.range(sizes.length)).range([5, 7]);

	    d3.csv("http://hedonometer.org/data/shifts/" + cformat(popdate) + "-metashift.csv", function(csv) {
		var havg = csv.map(function(d) { return d.refH; });
		var tcomp = csv.map(function(d) { return d.compH; });

		shortlist.append("svg:text").attr("x", 20).attr("y", 25).text("Average Happiness: " + parseFloat(tcomp).toFixed(2)).attr("font-size", "10px").attr("class","shifttitlehavg");

		// wrap the longer sentence
		shortlist.append("svg:text").attr("x", 20).attr("y", 62).attr("font-size", "10px").text(function() {
		    var head = "What's making this day ";
		    // longer
		    // return havg <= tcomp ? head + "happier than the last seven days:" : head + "sadder than the last seven days:";
		    // shorter
		    return havg <= tcomp ? head + "happier" : head + "sadder";
		}).attr("class","shifttitlewhatisone");
		shortlist.append("svg:text").attr("x", 20).attr("y", 72).attr("font-size", "10px").text(function() {
		    return "than the last seven days:"
		}).attr("class","shifttitlewhatistwo");

		shortlist.append("line")
		    .attr("x1", 20)
		    .attr("x2",220)
		    .attr("y1", 76)
		    .attr("y2", 76)
		    .attr("stroke", "grey")
		    .attr("stroke-width", ".3px")
		    .attr("class","shiftsepline");
		shortlist.append("line")
		    .attr("x1", 20)
		    .attr("x2",220)
		    .attr("y1", 198)
		    .attr("y2", 198)
		    .attr("stroke", "grey")
		    .attr("stroke-width", ".3px")
		    .attr("class","shiftsepline");

		// add the link to bigger wordshift
		shortlist.append("g").attr("transform","translate(40,211)")
		//.insert("g","rect").attr("transform","translate(20,177)")
		    .append("text")
		    .text("Click for interactive word shift.")
		//.attr("data-toggle","modal")
		//.attr("href","#myModal")
		    .attr("class","expanderbutton")
	            .on("click",function() { 
		                             transitionBigShift(popdate);
					   });

		var innerlist = shortlist.append("svg:g").attr("transform", "translate(20,79)").attr("id","smallshiftgroup");

		var figwidth = 190,
		figheight = 115,
		numWords = 10;
		var shiftsvg = innerlist.append("svg")
		    .attr("width",figwidth)
		    .attr("height",figheight)
		    .attr("id","shiftcanvas");
		summaryStats = false;

		plotShift(shiftsvg,figwidth,figheight,numWords,sizes,types,names);

		shortlist.append("rect").attr({
		    "x": 0,
		    "y": 0,
		    "width": 220,
		    "height": 200,
		    "fill": "white",
		    "opacity": 0.01,})
		    .on("click",function() { 
		        transitionBigShift(popdate);
		    });


		// .attr("class","btn btn-primary expanderbutton");
		// .attr("x",20)
		// .attr("y",167)
		// .attr("font-size","10px")
		// .on("mousedown",function() { transitionBigShift(circle,sizes,types,names); });

	    }); // d3.json metadata

	}); // d3.json data

    }; // drawSmallShift

    function plotShift(canvas,boxwidth,boxheight,numWords,sortedMag,sortedType,sortedWords) {
	/* plot the shift

	   -take a d3 selection, and draw the shift SVG on it
	   -requires sorted vectors of the shift magnitude, type and word
	   for each word
	   
	   selection: will append an svg to this on which to draw
	   boxwidth: will use all of this
	   boxheight: will use all of this
	   numWords: number of words to plot
	   sorted...: the data
	   sumTypes: the summary information (array of four summary values)
	   big: whether to draw axis and summary bars

	*/

	var margin = {top: 0, right: 0, bottom: 0, left: 0},
	figwidth = boxwidth - margin.left - margin.right,
	figheight = boxheight - margin.top - margin.bottom,
	iBarH = 9;

	var yHeight = 1,
	clipHeight = 0,
	barHeight = 0,
	width = .99*figwidth,
	height = .99*figheight;

	var figcenter = width/2;

	// create the x and y axis
	// scale in x by width of the top word
	// could still run into a problem if top magnitudes are similar
	// and second word is longer
	// make these local
	// var x0 = Math.max(-d3.min(sortedMag) * 1.33, d3.max(sortedMag) * 1.33);

	sortedWords = sortedWords.map(function(d,i) { 
	    if (sortedType[i] == 0) {
		return d.concat("-\u2193");
	    } 
	    else if (sortedType[i] == 1) {
		return "\u2193+".concat(d);
	    }
	    else if (sortedType[i] == 2) {
		return "\u2191-".concat(d);
	    } else {
		return d.concat("+\u2191");
	    }
	});
	var maxWidth = d3.max(sortedWords.slice(0,5).map(function(d) { return d.width(); }));
	var x = d3.scale.linear()
	    .domain([-Math.abs(sortedMag[0]),Math.abs(sortedMag[0])])
	//.range([-x0,x0]);
	    .range([maxWidth-5, boxwidth-maxWidth+5]);

	// linear scale function
	var y =  d3.scale.linear()
	    .domain([numWords+1,1])
	    .range([height+2, yHeight]); 

	// zoom object for the axes
	var zoom = d3.behavior.zoom()
	    .y(y) // pass linear scale function
	// .translate([10,10])
	    .scaleExtent([1,1])
	    .on("zoom",zoomed);

	// create the axes themselves
	var axes = canvas.append("g")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class", "main")
	    .call(zoom);

	// create the axes background
	axes.append("svg:rect")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class", "bg")
	//.style({'stroke-width':'2','stroke':'rgb(0,0,0)'})
	    .attr("fill", "#FCFCFC")
	    .attr("opacity","0.96");

	intStr = ["zero","one","two","three"];

	axes.selectAll("rect.shiftrect")
	    .data(sortedMag)
	    .enter()
	    .append("rect")
	// color
	    .attr("fill", function(d,i) { if (sortedType[i] == 2) {return "#4C4CFF";} else if (sortedType[i] == 3) {return "#FFFF4C";} else if (sortedType[i] == 0) {return "#B3B3FF";} else { return "#FFFFB3"; }})
	    .attr("class", function(d,i) { return "shiftrect "+intStr[sortedType[i]]; })
	    .attr("x",function(d,i) { 
                if (d>0) { return figcenter; } 
                else { return x(d)} })
	    .attr("y",function(d,i) { return y(i+1); } )
	    .style({'opacity':'0.7','stroke-width':'1','stroke':'rgb(0,0,0)'})
	    .attr("height",function(d,i) { return iBarH; } )
	    .attr("width",function(d,i) { if ((d)>0) {return x(d)-x(0);} else {return x(0)-x(d); } } )
	    .on('mouseover', function(d){
		// var rectSelection = d3.select(this).style({opacity:'1.0'});
	    })
	    .on('mouseout', function(d){
		var rectSelection = d3.select(this).style({opacity:'0.7'});
	    });

	axes.selectAll("text.shifttext")
	    .data(sortedMag)
	    .enter()
	    .append("text")
	    .attr("class", function(d,i) { return "shifttext "+intStr[sortedType[i]]; })
	    .style({"text-anchor": function(d,i) { if (sortedMag[i] < 0) { return "end";} else { return "start";}}, "font-size": 11})
	    .attr("y",function(d,i) { return y(i+1)+iBarH; } )
	    .text(function(d,i) { return sortedWords[i]; })
	    .attr("x",function(d,i) { if (d>0) {return x(d)+2;} else {return x(d)-2; } } );

	function zoomed() {
	    //axes.selectAll("rect.shiftrect").attr("transform", "translate(0," + Math.min(0,d3.event.translate[1]) + ")");
	    //axes.selectAll("text.shifttext").attr("transform", "translate(0," + Math.min(0,d3.event.translate[1]) + ")");
	    axes.selectAll("rect.shiftrect").attr("y", function(d,i) { return y(i+1) });
	    axes.selectAll("text.shifttext").attr("y", function(d,i) { return y(i+1)+iBarH; } )
	};
    };

    // store the function in a object of the same name globally
    nextDay = function nextDay(update) {
	// trying to get this function to remember it's context
	var that = this;
	// console.log(this);
	// console.log(that);

	// shiftselencoder.varval("none");
	// shiftselencoder.destroy();

	// var date = datedecoder().current;
	// console.log(date);
	// console.log(cformat.parse(date));

	// was used 2014-10-08
	// var bigshiftdiv = d3.select("#moveshifthere");

	// var newdate = d3.time.day.offset(cformat.parse(date),offset);

	// was used 2014-10-08
	// var newdate = update;

	// console.log(newdate);
	// console.log(cformat(newdate));	
	dateencoder.varval(cformat(update));
	// grab the date

	addthis_share.passthrough.twitter.text = longformat(update)+", word shift:";

	d3.text("http://hedonometer.org/data/word-vectors/"+cformat(update)+"-sum.csv",function(tmp) {
	    compFvec = tmp.split('\n').slice(0,10222);
	    d3.text("http://hedonometer.org/data/word-vectors/"+cformat(d3.time.day.offset(update,0))+"-prev7.csv",function(tmp2) {
		refFvec = tmp2.split('\n').slice(0,10222);



		// nextDay changing the text at the top
		var bigdaytest = false;
		var bigdaywiki = []; //'http://en.wikipedia.org/wiki/Wedding_of_Prince_William_and_Catherine_Middleton';
		var bigdaytext = [];

		addthis_share.passthrough.twitter.text = longformat(update)+", word shift:"

		for (var i=0; i<bigdays.length; i++) {
		    //console.log(bigdays[i].date);
		    //if (bigdays[i].date.getTime() === cformat.parse(circle.attr("shortdate")).getTime()) {
		    if (bigdays[i].date.getTime() === update.getTime()) {
			// console.log("major event wiki");
			bigdaytest = true;
			bigdaywiki.push(bigdays[i].wiki);
			bigdaytext.push(bigdays[i].longer);
			// always share the last event
			addthis_share.passthrough.twitter.text = bigdays[i].longer+", "+longformat(update)+", word shift:"
			// don't break for multiple events
			// break;
		    }
		}
		if (bigdaytest) { 
		    var tmpStr = 'Interactive Wordshift <span class="label label-default">Major Event <i class="fa fa-signal"></i></span> ';
		    for (var i=0; i<bigdaywiki.length; i++) { 
			tmpStr += '<a href="'+bigdaywiki[i].safe()+'" target="_blank"><img src="https://lh6.ggpht.com/-Eq7SGa8CVtZCQPXmnux59sebPPU04j1gak4ppkMVboUMQ_ucceGCHrC1wtqfqyByg=w300" height="35" class="wikilogo"/></a>';
		    }
		    d3.select('#modaltitle').html(tmpStr);
		}
		else { 
		    d3.select("#modaltitle").html("Interactive Wordshift <span class='label label-default'></span><img src='static/hedonometer/graphics/white.png' height='35'/>");
		}

		// grab the modal body
		var modalbody = d3.select("#moveshifthere");
		var modalfooter = d3.select("#moveshiftherefooter");
		// remove the text at the top
		// modalbody.selectAll("p").remove();
		// modalbody.insert("p","svg").attr("class","shifttitle").html(function(d,i) { return "<b>"+longerformat(update)+"</b>"; });
		var tmptext = [longerformat(update)];
		if (bigdaytest) {
		    // console.log(bigdaytext);
		    for (var bc=0; bc<bigdaytext.length; bc++) {
			// console.log("appending event "+bc+" text");
			// modalbody.insert("p","svg").attr("class","shifttitle pullright").html(function() { return "<b>"+""+bigdaytext[bc]+"</b>"; });
			tmptext = tmptext.concat([bigdaytext[bc]]);
		    }
		}
		else {
		    // modalbody.insert("p","svg").attr("class","shifttitle pullright").html(function() { return "<br>"; });
		    tmptext = tmptext.concat([""]);
		}

		// modalbody.insert("p","svg").attr("class","shifttitle").text(function(d,i) { return "Average happiness: "+parseFloat(hedotools.shifter._compH()).toFixed(3); });

		tmptext = tmptext.concat(["Average happiness: "+parseFloat(hedotools.shifter._compH()).toFixed(2)]);

		// modalbody.insert("p","svg").text(function() {
		//     var head = "What's making this day ";
		//     return hedotools.shifter._refH() <= hedotools.shifter._compH() ? head + "happier than the last seven days:" : head + "sadder than the last seven days:";
		// });

		tmptext = tmptext.concat([hedotools.shifter._refH() <= hedotools.shifter._compH() ? "What's making this day " + "happier than the last seven days:" : "What's making this day " + "sadder than the last seven days:"]);

		if (update.getTime() === timeseries[0].date.getTime()) {
		    modalfooter.select(".left").attr("disabled","disabled");
		}
		else {
		    modalfooter.select(".left").attr("disabled",null);
		}
		if (update.getTime() === timeseries[timeseries.length-1].date.getTime()) {
		    modalfooter.select(".right").attr("disabled","disabled");
		}
		else {
		    modalfooter.select(".right").attr("disabled",null);
		}

		hedotools.shifter._refF(refFvec);
		hedotools.shifter._compF(compFvec);
		hedotools.shifter.stop();
		hedotools.shifter.shifter();
		console.log("the text is");
		console.log(tmptext);
		hedotools.shifter.setText(tmptext);
		hedotools.shifter.drawlogo();
		hedotools.shifter.replot();

	    }); // d3.text prev7

	}); // d3.text sum

    } // nextDay

    // make sure to remvoe the url bar junk when closed
    $('#myModal').on('hidden.bs.modal', function (e) {
	dateencoder.varval("none");
	dateencoder.destroy();
	shiftselencoder.varval("none");
	shiftselencoder.destroy();
    });

    $('#dp1').datepicker({
	autoclose: true,
	format: 'yyyy-mm-dd',
	orientation: 'top-left',
	language: 'en',
	startDate: minDate,
	endDate: maxDate,
    }).on('changeDate',function(e) {
	// compute the offset
	// console.log(e.date);
	nextDay(e.date);
	});

    // d3.select(".x.brush").call(brush.event);

    if (datedecoder().current !== "none" && datedecoder().current.length > 0) {
	var pulldate = cformat.parse(datedecoder().current);
	// drawSmallShift(100,100,cformat.parse(datedecoder().current),true);
	//resetButton();
	transitionBigShift(pulldate);
    }

    addDays = function addDays(date, days) {
	var result = new Date(date);
	result.setDate(date.getDate() + days);
	return result;
    }

    var leftbutton = d3.select("button.left").on("click",function(d) { 
	$('#dp1').datepicker('setDate',addDays($('#dp1').datepicker('getDate'),-1)) 
    });

    var rightbutton = d3.select("button.right").on("click",function(d) { 
	$('#dp1').datepicker('setDate',addDays($('#dp1').datepicker('getDate'),1)) 
    });

    $('#myModal2').on('hidden.bs.modal', function (e) {
	hedotools.shifter.resetbuttontoggle(true);
    });

    $('#myModal2').on('show.bs.modal', function (e) {
	console.log("embed modal shown");
	$('#linktextarea').text(window.location.href);
	$('#embedtextarea').text('<iframe src="http://hedonometer.org/embed/main/'+datedecoder().current+'/'+((shiftseldecoder().current.length > 0) ? '?wordtypes='+shiftseldecoder().current : '' )+'" width="590" height="800" frameborder="0" scrolling="no"></iframe>');

	filename = 'hedonometer-'+cformat($('#dp1').datepicker('getDate'))+'-wordshift';

	// turn off the reset button
	hedotools.shifter.resetbuttontoggle(false);
	string = crowbar('shiftsvg');
	url = 'data:text/plain;charset=utf-8,' + encodeURIComponent(string);
	document.getElementById('svgbutton').setAttribute("download", filename + ".svg")
	document.getElementById('svgbutton').setAttribute("href", url);
	
	$('#pdfbutton').click(function() {
	    var form = document.getElementById('svgform');
	    form['output_format'].value = 'pdf';
	    form['date'].value = cformat($('#dp1').datepicker('getDate'));
	    form['data'].value = string;
	    form.submit();
	})

	$('#pngbutton').click(function() {
	    var form = document.getElementById('svgform');
	    form['output_format'].value = 'png';
	    form['date'].value = cformat($('#dp1').datepicker('getDate'));
	    form['data'].value = string;
	    form.submit();
	})


    })

    var crowbar = function(s) {
	// actually get the svg out, using a lot of the crowbar code
	var source = '';
	var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
	var prefix = {
	    xmlns: "http://www.w3.org/2000/xmlns/",
	    xlink: "http://www.w3.org/1999/xlink",
	    svg: "http://www.w3.org/2000/svg"
	}

	var styles = '';
        var styleSheets = document.styleSheets;

	// for (var i=0; i < styleSheets.length; i++) {
	//     processStyleSheet(styleSheets[i]);
	// }

	// // much simplified code from the crowbar
	// // don't care about illustrator
	// // and i don't use import rules
	// function processStyleSheet(ss) {
	//     if (ss.cssRules) {
	// 	for (var i = 0; i < ss.cssRules.length; i++) {
	// 	    var rule = ss.cssRules[i];
	// 	    styles += "\n" + rule.cssText;
	// 	}
	//     }
	// }

	// mostly untouched from the crowbar
	var svg = document.getElementById(s);
	svg.setAttribute("version", "1.1");

	var defsEl = document.createElement("defs");
	svg.insertBefore(defsEl, svg.firstChild); 
	var styleEl = document.createElement("style")
	defsEl.appendChild(styleEl);
	styleEl.setAttribute("type", "text/css");
	svg.removeAttribute("xmlns");
	svg.removeAttribute("xlink");
	// These are needed for the svg
	if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) {
	    svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
	}
	if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
	    svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
	}
	
	var svgxml = (new XMLSerializer()).serializeToString(svg)
	// can probably get rid of this replace when styles is blank
	    .replace('</style>', '<![CDATA[' + styles + ']]></style>');
	console.log("styles are");
	console.log(styles);
	source += doctype + svgxml;

	return source;
    }


    console.log("enjoy :)");

})();
