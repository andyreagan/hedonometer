// main context
(function() {

    // alert("You've somehow arrived at the development version. Navigate back to hedonometer.org, or beware of strange behavior and you can help us by reporting bugs to @hedonometer. Thanks for visiting :)");
    var tmp = location.href;
    tmp = tmp.replace("wordshift","index");
    history.pushState("something","something",tmp);

    // console.log("running timeline viz");

    String.prototype.width = function(font) {
	var f = font || '12px arial',
	o = $('<div>' + this + '</div>')
	    .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
	    .appendTo($('body')),
	w = o.width();
	o.remove();
	return w;
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

    var dur =  550,
    ignoreWords = ["nigga","nigger","niggaz","niggas","thirsty"],
    bigdays = {},
    shiftTypeSelect = false,
    formatDate = d3.time.format("%b %Y"),
    today = new Date(),
    beginningOfTime = new Date(2008,8,10),
    cformat = d3.time.format("%Y-%m-%d"),
    dformat = d3.time.format("%Y-%m-%dT00:00:00"),
    longformat = d3.time.format("%B %e, %Y"),
    longerformat = d3.time.format("%A, %B %e, %Y"),
    fromencoder = d3.urllib.encoder().varname("from");
    fromdecoder = d3.urllib.decoder().varname("from").varresult(cformat(d3.time.month.offset(today,-18))),
    toencoder = d3.urllib.encoder().varname("to"),
    todecoder = d3.urllib.decoder().varname("to").varresult(cformat(today)),
    dateencoder = d3.urllib.encoder().varname("date"),
    datedecoder = d3.urllib.decoder().varname("date"),
    shiftselencoder = d3.urllib.encoder().varname("wordtypes"),
    shiftseldecoder = d3.urllib.decoder().varname("wordtypes").varresult("none"),
    weekDaysShort = ["sun","mon","tue","wed","thu","fri","sat"],
    weekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    popupExitDur = 500,
    popupEnterDur = 400,
    intStr = ["zero","one","two","three"],
    // min radius for day circles
    rmin = 0,
    // max radius for day circles
    // these get reset when the day toggle is called
    rmax = 3.25,
    legendDict = {
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
	}
    }
    timeseries = {};

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

    function toggleAll(r) {
	if (legendDict['togall'] == 'on') {
	    d3.selectAll(".Monday, .Tuesday, .Wednesday, .Thursday, .Friday, .Saturday, .Sunday, .Togall").transition().duration(250).attr("r", r);
	}
	if (legendDict['togall'] == 'off') {
	    d3.selectAll(".Monday, .Tuesday, .Wednesday, .Thursday, .Friday, .Saturday, .Sunday, .Togall").transition().duration(250).attr("r", rmin);
	}
    };

    function toggleDays(r) {
	//run through the legendDict to see what's on or off...
	for (var i=0; i < weekDays.length; i=i+1) {
	    if (legendDict[weekDaysShort[i]] == 'on') {
		d3.selectAll("."+weekDays[i]).transition().duration(250).attr("r", r);
	    }
	    else {
		d3.selectAll("."+weekDays[i]).transition().duration(250).attr("r", rmin);
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

    var margin = {
	top: 10,
	right: 60,
	bottom: 140,
	left: 50
    },
    width = parseInt(d3.select("#bigbox").style("width"))-margin.left-margin.right,
    height = d3.min([600,d3.max([300,parseInt(d3.select("#bigbox").style("width"))*0.5-margin.bottom-margin.top])]),
    height2 = 50;
    // vertical space to give the bottom brush selection
    var MainxAxisSpace = 80;
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
    var brush = d3.svg.brush().x(x2).extent([cformat.parse(fromdecoder().cached),cformat.parse(todecoder().cached)]).on("brush", brushing).on("brushend",brushended);

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

    var svg = d3.select("#bigbox").append("svg").attr("id", "timeseries")
	.attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);

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
	.text(function(d,i) { return weekDays[i][0]+weekDays[i][1]+weekDays[i][2] });
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
	//toggleAll();
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

    d3.csv("/static/hedonometer/data/word-vectors/sumhapps.csv", function(data) {
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
	var path = focus.append("path").attr("id", "path").data([data]).attr("clip-path", "url(#clip)").attr("d", line);

	// focus.append("path").attr("id", "path").data([data]).attr("clip-path", "url(#clip)").attr("d", line3);

	focus.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").transition().duration(dur).call(xAxis);
	// text for legend h_avg
	// focus.append("text").attr("class", "y labelTimeseries").attr("text-anchor", "start").attr("y", 6).attr("x", width-250).attr("dy", ".75em").attr("transform", "rotate(0)").text("Average Happiness h").append("tspan").attr("baseline-shift","sub").text("avg");
	//focus.append("g").attr("class", "y axis").call(yAxis);
	focus.append("g").attr("class", "y axis").attr("transform", "translate(" + width + ",0)").call(yAxis2);

	horizontalLineGroup = focus.append("g")
	horizontalLineGroup.selectAll("line").data(y.ticks(7).slice(1,7)).enter().append("line")
	    .attr("class", "horizontalLines") //.attr("transform", "translate(" + width + ",0)").call(yAxis2);
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

	context.append("path").data([data]).attr("class", "mini").attr("d", area2);
	context.append("g").attr("class", "x axis")
	    .attr("transform", "translate("+"0"+"," + height2 + ")")
	    .call(xAxis2);

	var format = d3.time.format("%m-%d");

	// http://hedonometer.org/api/v1/events/?format=json
	d3.json('/api/v1/events/?format=json',function(json) { 
	// d3.json('/static/hedonometer/data/bigdays.json',function(json) { 
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
	} )

	// d3.select(".x.brush").call(brush.event);
	var brushgroup = context.append("g").attr("class", "x brush")
	    .call(brush);
	// .call(brush.event);
	
	brushgroup
	    .selectAll("rect")
	    .attr("y", -6)
	    .attr("height", height2 + 7);

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

	//x.domain(brush.empty() ? x2.domain() : brush.extent());
	x.domain(brush.empty() ? x2.domain() : brush.extent());
	//focus.select("#path").attr("d", fishline);
	focus.select("#path").attr("d", line);
	focus.select(".x.axis").call(xAxis);
	
	focus.selectAll(".brushingline")
	    .attr({ 
		"x2": function(d,i) { return x2(brush.extent()[i]) },
		"visibility": "visible",
	    });

	var circle = focus2.selectAll("circle").attr("cx", function(d) {
	    return x(d.date);
	}).attr("cy", function(d) {
	    return y(d.value);
	})
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
	d3.text("static/hedonometer/data/word-vectors/"+cformat(popdate)+"-sum.csv",function(tmp) {
	    compFvec = tmp.split('\n').slice(0,10222);
	    d3.text("static/hedonometer/data/word-vectors/"+cformat(d3.time.day.offset(popdate,0))+"-prev7.csv",function(tmp2) {
		refFvec = tmp2.split('\n').slice(0,10222);

		for (var i = 0; i < words.length; i++) {
		    var exclude = false;
		    for (var k = 0; k < ignoreWords.length; k++) {
			if (ignoreWords[k] == words[i]) {
			    exclude = true;
			    // console.log("excluding");
			}
		    }
		    // console.log(i);
		    if (lens[i] > 4 && lens[i] < 6) {
			exclude = true;
			// console.log("excluding");
		    }
		    if (exclude) {
			refFvec[i] = 0;
			compFvec[i] = 0;
		    }
		}
		shiftObj = shift(refFvec,compFvec,lens,words);
		var sortedMag = shiftObj.sortedMag.slice(0,1000),
		sortedType = shiftObj.sortedType.slice(0,1000),
		sortedWords = shiftObj.sortedWords.slice(0,1000),
		sumTypes = shiftObj.sumTypes.slice(0,1000),
		havg = shiftObj.refH,
		tcomp = shiftObj.compH;

		//console.log(circle);
		dateencoder.varval(cformat(popdate));

		//console.log(cformat.parse(circle.attr("shortdate")));
		var bigdaytest = false;
		var bigdaywiki = ''; //'http://en.wikipedia.org/wiki/Wedding_of_Prince_William_and_Catherine_Middleton';

		addthis_share.passthrough.twitter.text = longformat(popdate)+", word shift:"

		for (var i=0; i<bigdays.length; i++) {
		    //console.log(bigdays[i].date);
		    //if (bigdays[i].date.getTime() === cformat.parse(circle.attr("shortdate")).getTime()) {
		    if (bigdays[i].date.getTime() === popdate.getTime()) {
			// console.log("major event wiki");
			bigdaytest = true;
			bigdaywiki = bigdays[i].wiki;
			addthis_share.passthrough.twitter.text = bigdays[i].longer+", "+longformat(popdate)+", word shift:"
			break;
		    }
		}
		if (bigdaytest) { d3.select("#modaltitle").html("Interactive Wordshift <span class='label label-default'>Major Event <i class='fa fa-signal'></i></span> <a href='"+bigdaywiki+"' target='_blank'><img src='https://lh6.ggpht.com/-Eq7SGa8CVtZCQPXmnux59sebPPU04j1gak4ppkMVboUMQ_ucceGCHrC1wtqfqyByg=w300' height='35'/></a>"); }
		else { d3.select("#modaltitle").html("Interactive Wordshift <span class='label label-default'></span><img src='static/hedonometer/graphics/white.png' height='35'/>"); }
		//Interactive Wordshift <span class="label label-default">Major Event <i class="fa fa-signal"></i></span>

		// grab the modal body
		var modalbody = d3.select("#moveshifthere");
		var modalfooter = d3.select("#moveshiftherefooter");
		// remove the text at the top
		modalbody.selectAll("p").remove();
		modalbody.append("p").attr("class","shifttitle").html(function(d,i) { return "<b>"+longerformat(popdate)+"</b>"; });
		if (bigdaytest) {
		    for (var i=0; i<bigdays.length; i++) {
			//console.log(bigdays[i].date);
			if (bigdays[i].date.getTime() === popdate.getTime()) {
			    // console.log("major event");
			    modalbody.append("p","svg").attr("class","shifttitle pullright").html(function() { return "<b>"+""+bigdays[i].longer+"</b>"; });
			    break;
			}
		    }
		}
		else {
		    modalbody.append("p","svg").attr("class","shifttitle pullright").html(function() { return "<br>"; });
		}
		modalbody.append("p").attr("class","shifttitle").text(function(d,i) { return "Average happiness: "+parseFloat(tcomp).toFixed(3); });
		modalbody.append("p").text(function() {
		    var head = "What's making this day ";
		    return havg <= tcomp ? head + "happier than the last seven days:" : head + "sadder than the last seven days:";
		});

		if (popdate.getTime() === timeseries[0].date.getTime()) {
		    modalfooter.select(".left").attr("disabled","disabled");
		}
		else {
		    modalfooter.select(".left").attr("disabled",null);
		}
                if (popdate.getTime() === timeseries[timeseries.length-1].date.getTime()) {
		    modalfooter.select(".right").attr("disabled","disabled");
		}
		else {
		    modalfooter.select(".right").attr("disabled",null);
		}

 		// new one
		var newsmalllist = d3.select('#moveshifthere').append('svg')
		    .attr('height',modalheight).attr('width',modalwidth)
		    .attr('id','modalsvg');

		newsmalllist.append("svg")
		    .attr("id","shiftcanvas")
		    .attr("width",function () { return modalwidth-20-10; })
		    .attr("height",function () { return modalheight-25; });

		// x label of shift, outside of the SVG
		newsmalllist.append("text")
		    .text("Per word average happiness shift")
		    .attr("class","axes-text")
		    .attr("x",(modalwidth-20-10)/2+20) // 350-20-10 for svg width,  
		    .attr("y",modalheight-7)
		    .attr("font-size", "18.0px")
		    .attr("fill", "#000000")
		    .attr("style", "text-anchor: middle;");
		
		// var canvas = smallList.select("svg"),
		var canvas = newsmalllist.select("svg"),
		boxwidth = (modalwidth-20-10),
		boxheight = (modalheight-40-25),

		// d3.select("#smallshiftgroup").attr("transform","translate(20,0)");

		shiftTypeSelect = false;

		var margin = {top: 0, right: 0, bottom: 0, left: 0},
		figwidth = boxwidth - margin.left - margin.right,
		figheight = boxheight - margin.top - margin.bottom,
		iBarH = 11;

		var yHeight = (7+17*3+14+5-13), // 101
		clipHeight = 100-20-13,
		barHeight = (7+17*3+15-13), // 95
		width = (figwidth-20), 	// give just enough room for the labels
		height = (figheight-20);

		var bigfigcenter = width/2;

		// take the longest of the top five words
		// console.log("appending to sorted words");
		// console.log(sortedWords);
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
		// console.log(sortedWords);
		var maxWidth = d3.max(sortedWords.slice(0,5).map(function(d) { return d.width(); }));
		// console.log(maxWidth);

		var bigshiftx = d3.scale.linear()
		    .domain([-Math.abs(sortedMag[0]),Math.abs(sortedMag[0])])
		    .range([maxWidth+10,width-maxWidth-10]);

		// linear scale function
		var bigshifty = d3.scale.linear()
		    .domain([numWords+1,1])
		    .range([height+2, yHeight]); 

		// zoom object for the axes
		var zoom = d3.behavior.zoom()
		    .y(bigshifty) // pass linear scale function
		// .translate([10,10])
		    .scaleExtent([1,1])
		    .on("zoom",zoomed);

		// create the axes themselves
		// var axes = canvas.select("g")
		var axes = canvas.append("g")
		    .attr("transform","translate(20,0)")
		    .attr("width", width)
		    .attr("height", height)
		    .attr("class", "main")
		    .call(zoom);

		// create the axes background
		axes.append("rect")
		    .attr("width", width)
		    .attr("height", height+60)
		    //.attr("transform","translate(0,40)")
		    .attr("class", "bg")
		    .style({'stroke-width':'3','stroke':'rgb(0,0,0)'})
		    .attr("fill", "#FCFCFC")
		    .attr("opacity","0.96");

		canvas.append("text")
		    .text("Word Rank")
		    .attr("class","axes-text")
		    .attr("x",15)
		    .attr("y",figheight/2+60)
		    .attr("font-size", "18.0px")
		    .attr("fill", "#000000")
		    .attr("transform", "rotate(-90.0," + (15) + "," + (figheight/2+60) + ")");

		// going to append this outside the svg		       
		// canvas.append("text")
		//     .text("Per word average happiness shift")
		//     .attr("class","axes-text")
		//     .attr("x",width/2+(figwidth-width)/2)
		//     .attr("y",3*(figheight-height)/4+height+15)
		//     .attr("font-size", "15.0px")
		//     .attr("fill", "#000000")
		//     .attr("style", "text-anchor: middle;");

		var bigshifttextsize = 13;

		axes.selectAll("rect.shiftrect")
		    .data(sortedMag)
		    .enter()
		    .append("rect")
		// color
		    .attr("fill", function(d,i) { if (sortedType[i] == 2) {return "#4C4CFF";} else if (sortedType[i] == 3) {return "#FFFF4C";} else if (sortedType[i] == 0) {return "#B3B3FF";} else { return "#FFFFB3"; }})
		    .attr("class", function(d,i) { return "shiftrect "+intStr[sortedType[i]]; })
		    .attr("x",function(d,i) { 
			if (d>0) { return bigfigcenter; } 
			else { return bigshiftx(d)} })
		    .attr("y",function(d,i) { return bigshifty(i+1); } )
		    .attr("height",function(d,i) { return iBarH; } )
		    .attr("width",function(d,i) { if ((d)>0) {return bigshiftx(d)-bigshiftx(0);} else {return bigshiftx(0)-bigshiftx(d); } } )
		    .style({'opacity':'0.7','stroke-width':'1','stroke':'rgb(0,0,0)'});
		// .on('mouseover', function(d){
		//     var rectSelection = d3.select(this).style({opacity:'1.0'});
		// })
		// .on('mouseout', function(d){
		//     var rectSelection = d3.select(this).style({opacity:'0.7'});
		// });

		axes.selectAll("text.shifttext")
		    .data(sortedMag)
		    .enter()
		    .append("text")
		    .attr("class", function(d,i) { return "shifttext "+intStr[sortedType[i]]; })
		    .attr("x",function(d,i) { if (d>0) {return bigshiftx(d)+2;} else {return bigshiftx(d)-2; } } )
		    .attr("y",function(d,i) { return bigshifty(i+1)+iBarH; } )
		    .style({"text-anchor": function(d,i) { if (sortedMag[i] < 0) { return "end";} else { return "start";}}, "font-size": bigshifttextsize})
		    .text(function(d,i) { return sortedWords[i]; });

		// check if there is a word selection to apply
		if (shiftseldecoder().current === "posup") {
		    shiftTypeSelect = true;
		    resetButton();
		    axes.selectAll("rect.shiftrect.zero").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.zero").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.one").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.one").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.two").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.three").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.three").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		}
		else if (shiftseldecoder().current === "negdown") {
		    shiftTypeSelect = true;
		    resetButton();
		    axes.selectAll("rect.shiftrect.zero").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.zero").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		    axes.selectAll("rect.shiftrect.one").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.one").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.two").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.three").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.three").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});		
		}
		else if (shiftseldecoder().current === "posdown") {
		    shiftTypeSelect = true;
		    resetButton();
		    axes.selectAll("rect.shiftrect.zero").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.zero").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.three").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.three").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.two").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.one").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.one").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		}
		else if (shiftseldecoder().current === "negup") {
		    shiftTypeSelect = true;
		    resetButton();
		    axes.selectAll("rect.shiftrect.zero").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.zero").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.one").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.one").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.two").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		    axes.selectAll("rect.shiftrect.three").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.three").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		}
		
		// draw a white rectangle to hide the shift bars behind the summary shifts
		// move x,y to 3 and width to -6 to give the bg a little space
		axes.append("rect").attr("x",3).attr("y",3).attr("width",width-6).attr("height",73-13).attr("fill","white").style({"opacity": "1.0"});

		// draw the summary things
		axes.append("line")
		    .attr("x1",0)
		    .attr("x2",width)
		    .attr("y1",barHeight)
		    .attr("y2",barHeight)
		    .style({"stroke-width" : "1", "stroke": "black"});

		var maxShiftSum = Math.max(Math.abs(sumTypes[1]),Math.abs(sumTypes[2]),sumTypes[0],sumTypes[3]);

		topScale = d3.scale.linear()
		    .domain([-maxShiftSum,maxShiftSum])
		    .range([width*.12,width*.88]);

		// define the RHS summary bars so I can add if needed
		// var summaryArray = [sumTypes[3],sumTypes[0],sumTypes[3]+sumTypes[1],d3.sum(sumTypes)];
		var summaryArray = [sumTypes[3],sumTypes[0],d3.sum(sumTypes)];

		axes.selectAll(".sumrectR")
		    .data(summaryArray)
		    .enter()
		    .append("rect")
		    .attr("fill", function(d,i) { 
			if (i==0) {
			    return "#FFFF4C";
			} 
			else if (i==1) {
			    return "#B3B3FF";
			} 
			else {
			    // always dark grey
			    return "#272727";
			}
		    })
		    .attr("class", "sumrectR")
		    .attr("x",function(d,i) { 
			if (d>0) { 
			    return bigfigcenter;
			} 
			else { return topScale(d)} }
			 )
		    .attr("y",function(d,i) { if (i<3) { return i*17+7;} else { return i*17+7-2;} } )
		    .style({'opacity':'0.7','stroke-width':'1','stroke':'rgb(0,0,0)'})
		    .attr("height",function(d,i) { return 14; } )
		    .attr("width",function(d,i) { if (d>0) {return topScale(d)-bigfigcenter;} else {return bigfigcenter-topScale(d); } } )
		    .on('mouseover', function(d){
			var rectSelection = d3.select(this).style({opacity:'1.0'});
		    })
		    .on('mouseout', function(d){
			var rectSelection = d3.select(this).style({opacity:'0.7'});
		    })
		    .on('click', function(d,i) { 
			if (i==0) {
			    shiftTypeSelect = true;
			    resetButton();
			    shiftselencoder.varval("posup");
			    // shoot them all away
			    //d3.selectAll("rect.shiftrect, text.shifttext").transition().duration(1000).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    // keep the ones with class "three"
			    //d3.selectAll("rect.shiftrect.three, text.shifttext.three").transition().duration(1000)
			    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
			    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
			}
			else if (i==1) {
			    shiftTypeSelect = true;
			    resetButton();
			    shiftselencoder.varval("negdown");
			    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
			    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
			    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			}
			else if (i==2) {
			    // shiftTypeSelect = true;
			    reset();
			    // shiftselencoder.varval("negdown");
			}
		    });

		axes.selectAll(".sumtextR")
		    .data([sumTypes[3],sumTypes[0],d3.sum(sumTypes)])
		    .enter()
		    .append("text")
		    .attr("class", "sumtextR")
		    .style("text-anchor",function(d,i) { if (d>0) {return "start";} else {return "end";} })
		//.attr("y",function(d,i) { if (i<2) {return i*17+17;} else if ((sumTypes[3]+sumTypes[1])*(sumTypes[0]+sumTypes[2])<0) {return i*17+33; } else {return i*17+33; } })
		// for only three days
		    .attr("y",function(d,i) { return i*17+17; })
		    .text(function(d,i) { if (i == 0) {return "\u2211+\u2191";} if (i==1) { return"\u2211-\u2193";} else { return "\u2211";} } )
		// push to the side of d
		    .attr("x",function(d,i) { return topScale(d)+5*d/Math.abs(d); });

		// var summaryArray = [sumTypes[2],sumTypes[1],sumTypes[0]+sumTypes[2]];
		var summaryArray = [sumTypes[2],sumTypes[1]];

		axes.selectAll(".sumrectL")
		    .data(summaryArray)
		    .enter()
		    .append("rect")
		    .attr("fill", function(d,i) { 
			if (i==0) {
			    return "#FFFFB3";
			} 
			else if (i==1) {
			    return "#4C4CFF";
			} 
			else {
			    // choose color based on whether increasing/decreasing wins
			    if (d>0) {
				return "#B3B3FF";
			    }
			    else {
				return "#4C4CFF";
			    }
			}
		    })
		    .attr("class", "sumrectL")
		    .attr("x",function(d,i) { 
			if (i<2) { 
			    return topScale(d);
			} 
			else { 
			    // place the sum of negatives bar
			    // if they are not opposing
			    if ((sumTypes[3]+sumTypes[1])*(sumTypes[0]+sumTypes[2])>0) {
				// if positive, place at end of other bar
				if (d>0) {
				    return topScale((sumTypes[3]+sumTypes[1]));
				}
				// if negative, place at left of other bar, minus length (+topScale(d))
				else {
				    return topScale(d)-(bigfigcenter-topScale((sumTypes[3]+sumTypes[1])));
				}
			    } 
			    else { 
				if (d>0) {return bigfigcenter} 
				else { return topScale(d)} }
			}
		    })
		    .attr("y",function(d,i) { return i*17+7; } )
		    .style({'opacity':'0.7','stroke-width':'1','stroke':'rgb(0,0,0)'})
		    .attr("height",function(d,i) { return 14; } )
		    .attr("width",function(d,i) { if (d>0) {return topScale(d)-bigfigcenter;} else {return bigfigcenter-topScale(d); } } )
		    .on('mouseover', function(d){
			var rectSelection = d3.select(this).style({opacity:'1.0'});
		    })
		    .on('mouseout', function(d){
			var rectSelection = d3.select(this).style({opacity:'0.7'});
		    })
		    .on('click', function(d,i) {
			shiftTypeSelect = true;
			resetButton();
			if (i==0) {
			    shiftselencoder.varval("posdown");
			    // together
			    // axes.selectAll("rect.shiftrect.zero, text.shifttext.zero, rect.shiftrect.three, text.shifttext.three, rect.shiftrect.two, text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    // separate
			    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
			    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
			}
			else if (i==1) {
			    shiftselencoder.varval("negup");
			    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
			    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
			    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			}
		    } );

		axes.selectAll(".sumtextL")
		    .data([sumTypes[2],sumTypes[1]])
		    .enter()
		    .append("text")
		    .attr("class", "sumtextL")
		    .style("text-anchor", "end")
		    .attr("y",function(d,i) { return i*17+17; } )
		    .text(function(d,i) { if (i == 0) {return "\u2211+\u2193";} else { return"\u2211-\u2191";} })
		    .attr("x",function(d,i) { return topScale(d)-5; });



		// axes.append("rect")
		//     .attr("width", width)
		//     .attr("height", height+20)
		//     .attr("x",20)
		//     .attr("y",0)
		//     //.attr("transform","translate(0,40)")
		//     .attr("class", "bgborder")
		//     .style({'stroke-width':'3','stroke':'rgb(0,0,0)'})
		//     .attr("fill", "#FCFCFC")
		//     .attr("opacity","0.01");

		function zoomed() {
		    // if we have zoomed in, we set the y values for each subselection
		    // console.log(shiftTypeSelect);
		    if (shiftTypeSelect) {
			for (var j=0; j<4; j++) {
			    axes.selectAll("rect.shiftrect."+intStr[j]).attr("y", function(d,i) { return bigshifty(i+1) });
			    axes.selectAll("text.shifttext."+intStr[j]).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } )
			}
		    }
		    else {
			axes.selectAll("rect.shiftrect").attr("y", function(d,i) { return bigshifty(i+1) });
			axes.selectAll("text.shifttext").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } );
		    }

		}; // zoomed

		function reset() {
		    // console.log("reset function");
		    shiftTypeSelect = false;		
		    d3.selectAll("rect.shiftrect").transition().duration(1000)
			.attr("y", function(d,i) { return bigshifty(i+1) })
			.attr("transform","translate(0,0)");
		    d3.selectAll("text.shifttext").transition().duration(1000)
			.attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } )
			.attr("transform","translate(0,0)");
		    // d3.selectAll(".resetbutton").remove();
		    shiftselencoder.varval("none");
		    shiftselencoder.destroy();
		} // reset

		function resetButton() {
		    // console.log("resetbutton function");

		    d3.selectAll(".resetbutton").remove();
		    
		    var shiftsvg = d3.select("#modalsvg");

		    var resetGroup = shiftsvg.append("g")
			.attr("transform","translate("+(0)+","+(56)+") rotate(-90)")
			.attr("class","resetbutton");

		    resetGroup.append("rect")
			.attr("x",0)
			.attr("y",0)
			.attr("rx",3)
			.attr("ry",3)
			.attr("width",48)
			.attr("height",17)
			.attr("fill","#F0F0F0") //http://www.w3schools.com/html/html_colors.asp
			.style({'stroke-width':'0.5','stroke':'rgb(0,0,0)'});

		    resetGroup.append("text")
			.text("Reset")
			.attr("x",6)
			.attr("y",13)
			.attr("font-size", "13.0px");

		    resetGroup.append("rect")
			.attr("x",0)
			.attr("y",0)
			.attr("rx",3)
			.attr("ry",3)
			.attr("width",48)
			.attr("height",189)
			.attr("fill","white") //http://www.w3schools.com/html/html_colors.asp
			.style({"opacity": "0.0"})
			.on("click",function() { 
			    reset();
			});
		    
		}; // resetButton

		// call it
		resetButton();

		// now go ahead and move everthing to the modal
		// this is not straightforward:
		// http://stackoverflow.com/questions/20910147/how-to-move-all-html-element-children-to-another-parent-using-javascript

		// console.log("moving parents");
		// // remove old svg
		// d3.select('#moveshifthere').selectAll('svg').remove();
		// // new one
		// d3.select('#moveshifthere').append('svg')
		//     .attr('height',modalheight).attr('width',modalwidth)
		//     .attr('id','modalsvg');

		// var newParent = document.getElementById('modalsvg');
		// var oldParent = document.getElementById('minilist');

		// while (oldParent.childNodes.length > 0) {
		//     newParent.appendChild(oldParent.childNodes[0]);
		// }

		$('#myModal').modal('toggle'); 

	    }) // data
	    
	}) // metadata

	// d3.select("#dp1").attr("value",function() { return cformat(popdate); });

	// $('#dp1').datepicker({
	//     autoclose: true,
	//     format: 'yyyy-mm-dd',
	//     orientation: 'top-left',
	//     language: 'en',
	// });

	$('#dp1').datepicker('setDate',popdate);
	
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

	d3.csv("/static/hedonometer/data/shifts/" + cformat(popdate) + "-shift.csv", function(csv) {
	    var names = csv.map(function(d) { return d.word; });
	    var sizes = csv.map(function(d) { return d.mag; });
	    var types = csv.map(function(d) { return d.type; });

	    // set the width for bars
	    //var x0 = Math.max(-d3.min(sizes) * 1.33, d3.max(sizes) * 1.33);
	    //var x = d3.scale.linear().domain([-x0, x0]).range([0, 400]);
	    //var y = d3.scale.linear().domain(d3.range(sizes.length)).range([5, 7]);

	    d3.csv("/static/hedonometer/data/shifts/" + cformat(popdate) + "-metashift.csv", function(csv) {
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

		//plotShift: function(canvas,boxwidth,boxheight,numWords,sizes,sortedType,sortedWords)
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

	// console.log(big);
	// console.log(sortedMag);
	// console.log(sortedWords);
	// console.log(sortedType);

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
    // nextDay = function nextDay(offset) {
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
	var bigshiftdiv = d3.select("#moveshifthere");
	// var newdate = d3.time.day.offset(cformat.parse(date),offset);
	var newdate = update;
	// console.log(newdate);
	// console.log(cformat(newdate));	
	dateencoder.varval(cformat(newdate));
	// grab the date

	addthis_share.passthrough.twitter.text = longformat(newdate)+", word shift:"

	//console.log(cformat.parse(circle.attr("shortdate")));
	var bigdaytest = false;
	var bigdaywiki = '';
	for (var i=0; i<bigdays.length; i++) {
	    //console.log(bigdays[i].date);
	    if (bigdays[i].date.getTime() === newdate.getTime()) {
		//console.log("major event");
		bigdaytest = true;
		bigdaywiki = bigdays[i].wiki;
		addthis_share.passthrough.twitter.text = bigdays[i].longer+", "+longformat(popdate)+", word shift:"
		break;
	    }
	}
	if (bigdaytest) { d3.select("#modaltitle").html("Interactive Wordshift <span class='label label-default'>Major Event <i class='fa fa-signal'></i></span> <a href='"+bigdaywiki+"' target='_blank'><img src='https://lh6.ggpht.com/-Eq7SGa8CVtZCQPXmnux59sebPPU04j1gak4ppkMVboUMQ_ucceGCHrC1wtqfqyByg=w300' height='35'/></a>"); }
	else { d3.select("#modaltitle").html("Interactive Wordshift <span class='label label-default'></span><img src='static/hedonometer/graphics/white.png' height='35'/>"); }

	var modalfooter = d3.select("#moveshiftherefooter");

	if (newdate.getTime() === timeseries[0].date.getTime()) {
	    modalfooter.select(".left").attr("disabled","disabled");
	}
	else {
	    modalfooter.select(".left").attr("disabled",null);
	}
        if (newdate.getTime() === timeseries[timeseries.length-1].date.getTime()) {
	    modalfooter.select(".right").attr("disabled","disabled");
	}
	else {
	    modalfooter.select(".right").attr("disabled",null);
	}

	d3.text("static/hedonometer/data/word-vectors/"+cformat(newdate)+"-sum.csv",function(tmp) {
	    compFvec = tmp.split('\n').slice(0,10222);
	    d3.text("static/hedonometer/data/word-vectors/"+cformat(d3.time.day.offset(newdate,0))+"-prev7.csv",function(tmp2) {
		refFvec = tmp2.split('\n').slice(0,10222);

		for (var i = 0; i < words.length; i++) {
		    var exclude = false;
		    for (var k = 0; k < ignoreWords.length; k++) {
			if (ignoreWords[k] == words[i]) {
			    exclude = true;
			    // console.log("excluding");
			}
		    }
		    // console.log(i);
		    if (lens[i] > 4 && lens[i] < 6) {
			exclude = true;
			// console.log("excluding");
		    }
		    if (exclude) {
			refFvec[i] = 0;
			compFvec[i] = 0;
		    }
		}
		shiftObj = shift(refFvec,compFvec,lens,words);
		var sizes = shiftObj.sortedMag.slice(0,1000),
		types = shiftObj.sortedType.slice(0,1000),
		names = shiftObj.sortedWords.slice(0,1000),
		sumTypes = shiftObj.sumTypes.slice(0,1000),
		havg = shiftObj.refH,
		tcomp = shiftObj.compH;

		var modalwidth = 558;
		var modalheight = 495;
		var boxwidth = modalwidth-20-10;
		var boxheight = modalheight-40-25;

		// select the innermost svg on the modal
		var axes = bigshiftdiv.select("#shiftcanvas");

		// reconstruct the scales
		var margin = {top: 0, right: 0, bottom: 0, left: 0},
		figwidth = boxwidth - margin.left - margin.right,
		figheight = boxheight - margin.top - margin.bottom,
		iBarH = 11;

		var yHeight = (7+17*3+14+5), // 101
		clipHeight = 100,
		barHeight = (7+17*3+15), // 95
		width = (figwidth-20), 	// give just enough room for the labels
		height = (figheight-20);

		var bigfigcenter = width/2;

		var bigshiftx = d3.scale.linear()
		    .domain([-Math.abs(sizes[0]),Math.abs(sizes[0])])
		//.range([-x0,x0]);
		    .range([(names[0].length+4.5)*5, width-(names[0].length+4.5)*5]);

		// linear scale function
		var bigshifty = d3.scale.linear()
		    .domain([numWords+1,1])
		    .range([height+2, yHeight]); 

		var newbars = axes.selectAll("rect.shiftrect").data(sizes);
		var newwords = axes.selectAll("text.shifttext").data(sizes);
		
		// if we haven't dont a subselection, apply with a transition
		if (shiftseldecoder().current === "none" || shiftseldecoder().current.length === 0) {
		    newbars.transition()
			.attr("fill", function(d,i) { if (types[i] == 2) {return "#4C4CFF";} else if (types[i] == 3) {return "#FFFF4C";} else if (types[i] == 0) {return "#B3B3FF";} else { return "#FFFFB3"; }})
			.attr("class", function(d,i) { return "shiftrect "+intStr[types[i]]; })
			.attr("x",function(d,i) { 
			    if (d>0) { return bigfigcenter; } 
			    else { return bigshiftx(d)} })
			.attr("height",function(d,i) { return iBarH; } )
			.attr("width",function(d,i) { if ((d)>0) {return bigshiftx(d)-bigshiftx(0);} else {return bigshiftx(0)-bigshiftx(d); } } )

		    newwords.transition()
			.attr("class", function(d,i) { return "shifttext "+intStr[types[i]]; })
			.style({"text-anchor": function(d,i) { if (sizes[i] < 0) { return "end";} else { return "start";}}, "font-size": 11})
			.text(function(d,i) { if (types[i] == 0) {tmpStr = "-\u2193";} else if (types[i] == 1) {tmpStr = "\u2193+";}
	    				      else if (types[i] == 2) {tmpStr = "\u2191-";} else {tmpStr = "+\u2191";}
	    				      if (sizes[i] < 0) {return tmpStr.concat(names[i]);} else { return names[i].concat(tmpStr); } })
			.attr("x",function(d,i) { if (d>0) {return bigshiftx(d)+2;} else {return bigshiftx(d)-2; } } );
		}
		// else apply without a transition
		else {
		    newbars
			.attr("fill", function(d,i) { if (types[i] == 2) {return "#4C4CFF";} else if (types[i] == 3) {return "#FFFF4C";} else if (types[i] == 0) {return "#B3B3FF";} else { return "#FFFFB3"; }})
			.attr("class", function(d,i) { return "shiftrect "+intStr[types[i]]; })
			.attr("x",function(d,i) { 
			    if (d>0) { return bigfigcenter; } 
			    else { return bigshiftx(d)} })
			.attr("height",function(d,i) { return iBarH; } )
			.attr("width",function(d,i) { if ((d)>0) {return bigshiftx(d)-bigshiftx(0);} else {return bigshiftx(0)-bigshiftx(d); } } )

		    newwords
			.attr("class", function(d,i) { return "shifttext "+intStr[types[i]]; })
			.style({"text-anchor": function(d,i) { if (sizes[i] < 0) { return "end";} else { return "start";}}, "font-size": 11})
			.text(function(d,i) { if (types[i] == 0) {tmpStr = "-\u2193";} else if (types[i] == 1) {tmpStr = "\u2193+";}
	    				      else if (types[i] == 2) {tmpStr = "\u2191-";} else {tmpStr = "+\u2191";}
	    				      if (sizes[i] < 0) {return tmpStr.concat(names[i]);} else { return names[i].concat(tmpStr); } })
			.attr("x",function(d,i) { if (d>0) {return bigshiftx(d)+2;} else {return bigshiftx(d)-2; } } );

		    if (shiftseldecoder().current === "posup") {
			axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
			axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		    }
		    else if (shiftseldecoder().current === "negdown") {
			axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
			axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
			axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});		
		    }
		    else if (shiftseldecoder().current === "posdown") {
			axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
			axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		    }
		    else if (shiftseldecoder().current === "negup") {
			axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
			axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
			axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    }
		}

		var modalbody = d3.select("#moveshifthere");
		// remove the text at the top
		modalbody.selectAll("p").remove();
		modalbody.insert("p","svg").attr("class","shifttitle pullleft").html(function(d,i) { return "<b>"+""+longerformat(newdate)+"</b>"; });
		if (bigdaytest) {
		    for (var i=0; i<bigdays.length; i++) {
			//console.log(bigdays[i].date);
			if (bigdays[i].date.getTime() === newdate.getTime()) {
			    // console.log("major event");
			    modalbody.insert("p","svg").attr("class","shifttitle pullright").html(function() { return "<b>"+""+bigdays[i].longer+"</b>"; });
			    break;
			}
		    }
		}
		else {
		    modalbody.insert("p","svg").attr("class","shifttitle pullright").html(function() { return "<br>"; });
		}	    
		modalbody.insert("p","svg").attr("class","shifttitle").text(function(d,i) { return "Average Happiness: "+parseFloat(tcomp).toFixed(3); });
		modalbody.insert("p","svg").text(function() {
		    var head = "What's making this day ";
		    return havg <= tcomp ? head + "happier than the last seven days:" : head + "sadder than the last seven days:";
		});

		// var sumTypes = [8,-10,-6,14];
		// var sumTypes = [json2[0].normnegdown,-json2[0].normnegup,-json2[0].normposdown,json2[0].normposup]

		var maxShiftSum = Math.max(Math.abs(sumTypes[1]),Math.abs(sumTypes[2]),sumTypes[0],sumTypes[3]);

		topScale = d3.scale.linear()
		    .domain([-maxShiftSum,maxShiftSum])
		    .range([width*.1,width*.9]);

		// define the RHS summary bars so I can add if needed
		// var summaryArray = [sumTypes[3],sumTypes[0],sumTypes[3]+sumTypes[1],d3.sum(sumTypes)];
		var summaryArray = [sumTypes[3],sumTypes[0],d3.sum(sumTypes)];

		var newRtopbars = axes.selectAll(".sumrectR")
		    .data(summaryArray);
		
		newRtopbars.transition()
		    .attr("x",function(d,i) { 
			if (d>0) { 
			    return bigfigcenter;
			} 
			else { return topScale(d)} })
		    .attr("width",function(d,i) { if (d>0) {return topScale(d)-bigfigcenter;} else {return bigfigcenter-topScale(d); } } );

		var newRtoptext = axes.selectAll(".sumtextR")
		    .data([sumTypes[3],sumTypes[0],d3.sum(sumTypes)]);

		newRtoptext.transition().attr("class", "sumtextR")
		    .style("text-anchor",function(d,i) { if (d>0) {return "start";} else {return "end";} })
		    .attr("x",function(d,i) { return topScale(d)+5*d/Math.abs(d); });

		
		var summaryArray = [sumTypes[1],sumTypes[2],sumTypes[0]+sumTypes[2]];

		var newLtopbars = axes.selectAll(".sumrectL")
		    .data(summaryArray);

		newLtopbars.transition().attr("fill", function(d,i) { 
		    if (i==0) {
			return "#FFFFB3";
		    } 
		    else if (i==1) {
			return "#4C4CFF";
		    } 
		    else {
			// choose color based on whether increasing/decreasing wins
			if (d>0) {
			    return "#B3B3FF";
			}
			else {
			    return "#4C4CFF";
			}
		    }
		})
		    .attr("x",function(d,i) { 
			if (i<2) { 
			    return topScale(d);
			} 
			else { 
			    // place the sum of negatives bar
			    // if they are not opposing
			    if ((sumTypes[3]+sumTypes[1])*(sumTypes[0]+sumTypes[2])>0) {
				// if positive, place at end of other bar
				if (d>0) {
				    return topScale((sumTypes[3]+sumTypes[1]));
				}
				// if negative, place at left of other bar, minus length (+topScale(d))
				else {
				    return topScale(d)-(bigfigcenter-topScale((sumTypes[3]+sumTypes[1])));
				}
			    } 
			    else { 
				if (d>0) {return bigfigcenter} 
				else { return topScale(d)} }
			}
		    })
		    .attr("width",function(d,i) { if (d>0) {return topScale(d)-bigfigcenter;} else {return bigfigcenter-topScale(d); } } );

		var newLtoptext = axes.selectAll(".sumtextL")
		    .data([sumTypes[1],sumTypes[2]]);

		newLtoptext.transition().attr("x",function(d,i) { return topScale(d)-5; });

	    }); // d3.json metadata

	}); // d3.json 

	// d3.select("#dp1").attr("value",function() { return cformat(newdate); });

	// $('#dp1').datepicker('setDate',newdate);

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

    console.log("enjoy :)");

})();


