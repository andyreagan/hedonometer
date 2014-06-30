// main context
(function() {
    console.log("running consulting timeline viz");

    var ignoreWords = ["nigga","nigger","niggaz","niggas"];

    // http://stackoverflow.com/questions/500606/javascript-array-delete-elements
    Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
    };

    var keywordnums = { 
	"ben & jerry's": 0,
	"ben & jerrys": 1,
	"ben and jerry's": 2,
	"ben and jerrys": 3,
	"breyers": 4,
	"edy's": 5,
	"edys": 6,
	"haagen dazs": 7,
	"klondike": 8,
	"mars": 9,
	"nestle": 10,
	"popsicle": 11,
	"dessert": 12,
	"ice cream": 13,
	"gelato": 14,
	"cone": 15,
	"snack": 16,
	"snacks": 17,
	"candy": 18,
	"pint": 19,
	"flavor": 20,
	"taste": 21,
	"chocolate": 22,
	"cookie": 23,
	"cookies": 24,
	"blue bell": 25,
	"blue bunny": 26,
	"dreyer's": 27,
	"good humor": 28,
	"magnum": 29,
	"mars": 30,
	"nestle": 31,
	"popsicle": 32,
	"turkey hill": 33,
	"fruttare": 34,
	"skinny cow": 35,
	"talenti": 36,
	"ice-cream": 37,
	"ice-lolly": 38,
	"ice lolly": 39,
	"pre-packaged": 40,
	"prepackaged": 41,
	"sticks": 42,
	"tubs": 43,
	"cups": 44,
	"pints": 45,
	"ice-cream parlour": 46,
	"ice cream parlour": 47,
	"flavours": 48,
	"taste": 49,
	"texture": 50,
	"vanilla": 51,
	"strawberry": 52,
	"chocolate bars": 53,
	"chocolate bar": 54,
	"candy bars": 55,
	"candy bar": 56,
	"cookie": 57,
	"crisps": 58,
	"hungry": 59,
	"snack": 60,
	"snacks": 61,
	"food": 62,
	"eat": 63,
	"starving": 64,
	"dessert": 65,
    };

    var dur =  550,
    shiftTypeSelect = false,
    cformat = d3.time.format("%Y-%m-%d"),
    dformat = d3.time.format("%d.%m.%y"),
    longformat = d3.time.format("%B %e, %Y"),
    longerformat = d3.time.format("%A, %B %e, %Y"),
    dateencoder = d3.urllib.encoder().varname("date"),
    datedecoder = d3.urllib.decoder().varname("date"),
    keyworddecoder = d3.urllib.decoder().varname("key").varresult("breyers");
    d3.select("#keybtn").html(keyworddecoder().current);
    var shiftselencoder = d3.urllib.encoder().varname("wordtypes"),
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
    };

    // no longer in use
    function getDay(d) {
    	return weekDays[d.date.getDay()];
    };

    // Boston will be ran whenever we mouse over a circle
    function myMouseDownOpenWordShiftFunction() {
	// var circle = d3.select(this);
	// console.log(this);
	var circle = d3.select(this);
	var popdate = cformat.parse(circle.attr("shortdate"));
	console.log("shift!");
	transitionBigShift(popdate);
	//popitup('/wordshift.html?date=' + d3.select(this).attr("shortdate"));
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
	// clearTimeout(hovertimer);
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

    var mainMargin = {
	top: 10,
	right: 10,
	bottom: 100,
	left: 0
    },
    secMargin = {
	top: 430,
	right: 10,
	bottom: 20,
	left: 0
    },
    mainWidth = document.documentElement.clientWidth * 0.9,
    mainHeight = document.documentElement.clientHeight* 0.5,
    sliderHeight = 50;

    // min radius for day circles
    var rmin = 0;
    // max radius for day circles
    // these get reset when the day toggle is called
    var rmax = 2.75; // scale down to 1.25 for whole timeseries

    var formatDate = d3.time.format("%b %Y");
    var today = new Date();

    var symbol = d3.scale.ordinal().range(d3.svg.symbolTypes),
    color = d3.scale.category10();
    
    var margin = {
	top: 10,
	right: 10,
	bottom: 100,
	left: 0
    },
    width = parseInt(d3.select("#bigbox").style("width")),
    height = width*0.5,
    // width = document.documentElement.clientWidth * 0.9,
    // height = document.documentElement.clientHeight* 0.5,
    height2 = 50;
    // height2 = document.documentElement.clientHeight/10;

    var formatDate = d3.time.format("%b %Y");

    var wrp = d3.select("#wrap");

    function selectYear(year) {
	d3.select("#timeseries").remove();
	d3.select(".infobox h4").remove();
	d3.selectAll("rect:not(#shortlist)").style("fill", "lightgrey");
	d3.select("#rect" + year).style("fill", "black");
	timeline(year);
	//if (year == "Full") d3.select(".infobox").append("h4").text("Daily Average Happiness for Twitter, September 2008 to present");
	//else d3.select(".infobox").append("h4").text("Daily Average Happiness for Twitter, " + year);
    }

    console.log("timeline");

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

    var x = d3.time.scale().range([0, width - 7]); //.domain([new Date(2008,8,10),today]);
    // var x2 = d3.time.scale().range([0, width - 7]).domain([new Date(2013,10,29),today]);

    // set full range here
    var x2 = d3.time.scale().range([0, width - 7]).domain([new Date(2013,10,29),today]);

    y = d3.scale.linear().range([height, 0]);
    var y2 = d3.scale.linear().range([height2, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");
    yAxis2 = d3.svg.axis().scale(y).orient("right").ticks(7);

    console.log([d3.time.month.offset(today,-18),today]);
    console.log([x2(d3.time.month.offset(today,-18)),x2(today)]);
    // set initial offset here
    var brush = d3.svg.brush().x(x2).extent([d3.time.month.offset(today,-3),today]).on("brush", brushing).on("brushend",brushended);

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
	       "transform": "translate("+(width-10-366)+","+0+")",});

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

    var context = svg.append("g").attr("id", "context").attr("transform", "translate(" + margin.left + "," + (height+MainxAxisSpace) + ")");

    var minDate,maxDate;

    d3.csv("/static/consulting/data/keywords/"+keyworddecoder().current+"/allhappsday.csv", function(error,data) {
	if (error) {
	    console.log("error loading");
	    alert("Data not available yet, on it's way!\nTry 'Breyers'");
	}
	minDate = new Date(2013, 11, 01);
	maxDate = new Date(2014, 06, 25);

	var parse = d3.time.format("%Y-%m-%d").parse;

	for (i = 0; i < data.length; i++) {
	    data[i].shortDate = data[i].date;
	    data[i].date = parse(data[i].date);
	    data[i].value = +data[i].value;
	}

	console.log(data);

	data = data.sort(function(a,b){
	    // Turn your strings into dates, and then subtract them
	    // to get a value that is either negative, positive, or zero.
	    return d3.ascending(a.date,b.date);
	});

	var i=0;
	while (i<data.length) {
	    if (data[i].value < 4) {
		data.remove(i);
		console.log("no data");
	    }
	    i++;
	}
	x.domain(d3.extent(data.map(function(d) {
	    return d.date;
	})));
	//y.domain([5.8, 6.40]);
	y.domain([d3.min(data.map(function(d) { return d.value; }))-.1, d3.max(data.map(function(d) { return d.value; }))+.1]);
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
	horizontalLineGroup.selectAll("line").data(y.ticks(7)).enter().append("line")
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
	    // .attr("y1",function(d){ return y(y.ticks(7)[0]); })
	    // .attr("y2",function(d){ return y(y.ticks(7)[0]); })
	    .attr("y1",function(d){ return 477; })
	    .attr("y2",function(d){ return 477; })
	    .attr("fill","none")
	    .attr("stroke",function(d,i) { if (i===0) {return "black";} else {return "black";} })
	//.attr("stroke-dasharray",function(d,i) { if (i===0) {return "";} else {return "5";} })
	    .attr("stroke-width","1.7px");
	
	// focus2.append("text").attr("class", "labelTimeseries whitebox").attr("text-anchor", "end").attr("x", 168).attr("y", 427).attr("dy", ".75em").text("Select and slide time periods:").order();

	// console.log(data);
	
	var circle = focus2.selectAll("circle").data(data);

	circle.enter().append("circle").attr("r", function(d){return rmax*(0)}).attr("class", function(d) {
	    return weekDays[d.date.getDay()];
	}).attr("cx", function(d, i) {
	    return x(d.date);
	}).attr("clip-path", "url(#clip)")
	    .attr("cy", function(d) {
		return y(6.00);
	    })
	    .attr("shortdate", function(d) {
		return d.shortDate;
	    }).attr("havg", function(d) {
		return d.value.toFixed(2);
	    }).attr("day", function(d) {
		return weekDays[d.date.getDay()];
	    }).attr("date", function(d) {
		return d.date;
	    })
	//.transition().duration(dur)
	    .attr("cy", function(d) {
		return y(d.value);
	    })
	    .on("mouseover.enlarge", function() { d3.select(this).transition().duration(250).attr("r", 7.5).style("stroke-width", .5); })
	    // .on("mouseover.popup",myMouseOverFunction) 
	    .on("mouseout", myMouseOutFunction) 
            .on("mousedown", myMouseDownOpenWordShiftFunction)
	    .transition().duration(dur)
	    .attr("r", function(d){ return rmax; })
	;
	circle.exit().remove();

	context.append("path").data([data]).attr("class", "mini").attr("d", area2);
	context.append("g").attr("class", "x axis")
	    .attr("transform", "translate("+"0"+"," + height2 + ")")
	    .call(xAxis2);

	var format = d3.time.format("%m-%d");

	var textwidth = 6;

	String.prototype.width = function(font) {
	    var f = font || '12px arial',
	    o = $('<div>' + this + '</div>')
		.css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
		.appendTo($('body')),
	    w = o.width();

	    o.remove();

	    return w;
	}
	
	var brushgroup = context.append("g").attr("class", "x brush")
	    .call(brush);
	// .call(brush.event);
	
	brushgroup
	    .selectAll("rect")
	    .attr("y", -6)
	    .attr("height", height2 + 7);

	// call the brush initially
	brushing();

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
	console.log("brushended");
    }

    function brushing() {
	console.log("brushing");
	console.log(x.domain()[0].getTime());
	console.log(x.domain()[1].getTime());
	console.log(x2.domain());
	//x.domain(brush.empty() ? x2.domain() : brush.extent());
	x.domain(brush.empty() ? x2.domain() : brush.extent());
	//focus.select("#path").attr("d", fishline);
	focus.select("#path").attr("d", line);
	focus.select(".x.axis").call(xAxis);
	var circle = focus2.selectAll("circle").attr("cx", function(d) {
	    return x(d.date);
	}).attr("cy", function(d) {
	    return y(d.value);
	})
 	    .attr("r", function(d) {
		var currRange = (x.domain()[1].getTime()-x.domain()[0].getTime());
		return rScale(currRange);
	    });
	var rect = focus2.selectAll("rect").attr("x", function(d) {
	    return x(d.date);
	}).attr("y", function(d) {
	    return y(d.value + .02);
	});

	var groups = focus2.selectAll("g")
	    .attr("transform",function(d,i) { return "translate("+(x(d.date)+d.x)+","+(y(d.value)+d.y)+")"; });

	d3.select("#minilist").remove();
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
	    else { y = y - 209; }
	} 
	// on the left
	else {
	    x = x - 7;
	    // if on the top
	    if (y <= 210) {
		y = y - 10;
		x = x + 20;
	    } else {
		y = y - 209;
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
	var trianglepointsA = ["10 0, 10 210, 20 200, 230 200, 230 0, 10 0"]
	var trianglepointsB = ["205 200, 215 210, 215 200, 230 200, 230 0, 10 0, 10 200, 205 200"]
	var trianglepointsC = ["10 10, 0 20, 10 20, 10 200, 230 200, 230 0, 10 0, 10 10"]
	var trianglepointsD = ["230 10, 240 20, 230 20, 230 200, 10 200, 10 0, 230 0, 230 10"]
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
	d3.text("/static/consulting/data/keywords/"+keyworddecoder().current+"/"+dformat(popdate)+"-word-vector-"+keywordnums[keyworddecoder().current]+"-sum.csv",function(tmp) {
	    compFvec = tmp.split(',').slice(0,10222);
	    d3.text("/static/hedonometer/data/word-vectors/"+cformat(d3.time.day.offset(popdate,0))+"-sum.csv",function(tmp2) {
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
		
		// console.log("here");
		shiftObj = shift(refFvec,compFvec,lens,words);
		var sortedMag = shiftObj.sortedMag.slice(0,1000),
		sortedType = shiftObj.sortedType.slice(0,1000),
		sortedWords = shiftObj.sortedWords.slice(0,1000),
		sumTypes = shiftObj.sumTypes.slice(0,1000),
		havg = shiftObj.refH,
		tcomp = shiftObj.compH;

		//var havg = json.map(function(d) { return d.trefhavg; });
		//var tcomp = json.map(function(d) { return d.tcomphavg; });
	
		//var shifttotals = json[0];

		//console.log(circle);
		dateencoder.varval(cformat(popdate));

		//console.log(cformat.parse(circle.attr("shortdate")));
		d3.select("#modaltitle").html("Interactive Wordshift <span class='label label-default'></span><img src='/static/hedonometer/graphics/white.png' height='35'/>");
		//Interactive Wordshift <span class="label label-default">Major Event <i class="fa fa-signal"></i></span>

		// grab the modal body
		var modalbody = d3.select("#moveshifthere");
		// remove the text at the top
		modalbody.selectAll("p").remove();
		modalbody.append("p").attr("class","shifttitle").html(function(d,i) { return "<b>"+longerformat(popdate)+"</b>"; });
		modalbody.append("p","svg").attr("class","shifttitle pullright").html(function() { return "<br>"; });

		modalbody.append("p").attr("class","shifttitle").text(function(d,i) { return "Average happiness: "+parseFloat(tcomp).toFixed(3); });
		modalbody.append("p").text(function() {
		    var head = "What's making words around "+keyworddecoder().current;
		    return havg <= tcomp ? head + " happier than the rest of twitter:" : head + " sadder than the rest of twitter:";
		});

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
		boxheight = (modalheight-40-25);
		
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

		// create the x and y axis
		// scale in x by width of the top word
		// could still run into a problem if top magnitudes are similar
		// and second word is longer
		// make these local
		// var x0 = Math.max(-d3.min(sortedMag) * 1.33, d3.max(sortedMag) * 1.33);

		var bigshiftx = d3.scale.linear()
		    .domain([-Math.abs(sortedMag[0]),Math.abs(sortedMag[0])])
		//.range([-x0,x0]);
		    .range([(sortedWords[0].length+4.5)*5, width-(sortedWords[0].length+4.5)*5]);

		// linear scale function
		var bigshifty =  d3.scale.linear()
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
		    .text(function(d,i) { if (sortedType[i] == 0) {tmpStr = "-\u2193";} else if (sortedType[i] == 1) {tmpStr = "\u2193+";}
					  else if (sortedType[i] == 2) {tmpStr = "\u2191-";} else {tmpStr = "+\u2191";}
					  if (sortedMag[i] < 0) {return tmpStr.concat(sortedWords[i]);} else { return sortedWords[i].concat(tmpStr); } });

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
		    .range([width*.1,width*.9]);

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
		    console.log("reset function");
		    shiftTypeSelect = false;		
		    d3.selectAll("rect.shiftrect").transition().duration(1000)
			.attr("y", function(d,i) { return bigshifty(i+1) })
			.attr("transform","translate(0,0)");
		    d3.selectAll("text.shifttext").transition().duration(1000)
			.attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } )
			.attr("transform","translate(0,0)");
		    d3.selectAll(".resetbutton").remove();
		    shiftselencoder.varval("none");
		    shiftselencoder.destroy();
		} // reset

		function resetButton() {
		    console.log("resetbutton function");

		    d3.selectAll(".resetbutton").remove();
		    
		    var shiftsvg = d3.select("#modalsvg");

		    var resetGroup = shiftsvg.append("g")
			.attr("transform","translate("+(8)+","+(60)+") rotate(-90)")
			.attr("class","resetbutton");

		    resetGroup.append("rect")
			.attr("x",0)
			.attr("y",0)
			.attr("rx",3)
			.attr("ry",3)
			.attr("width",48)
			.attr("height",19)
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

	    }); // data
	    
	}); // metadata

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
    
    // store the function in a object of the same name globally
    // nextDay = function nextDay(offset) {
    nextDay = function nextDay(update) {
	// trying to get this function to remember it's context
	var that = this;
	// console.log(this);
	// console.log(that);

	// var date = datedecoder().current;
	// console.log(date);
	// console.log(cformat.parse(date));
	var bigshiftdiv = d3.select("#moveshifthere");
	// var newdate = d3.time.day.offset(cformat.parse(date),offset);
	var newdate = update;
	console.log(newdate);
	console.log(cformat(newdate));	
	dateencoder.varval(cformat(newdate));
	// grab the date

	d3.select("#modaltitle").html("Interactive Wordshift <span class='label label-default'></span><img src='/static/hedonometer/graphics/white.png' height='35'/>");

	d3.text("/static/consulting/data/keywords/"+keyworddecoder().current+"/"+dformat(update)+"-word-vector-"+keywordnums[keyworddecoder().current]+"-sum.csv",function(tmp) {
	    compFvec = tmp.split(',').slice(0,10222);
	    d3.text("/static/hedonometer/data/word-vectors/"+cformat(d3.time.day.offset(update,0))+"-sum.csv",function(tmp2) {
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
		
		// console.log("here");
		shiftObj = shift(refFvec,compFvec,lens,words);
		var sizes = shiftObj.sortedMag.slice(0,1000),
		types = shiftObj.sortedType.slice(0,1000),
		names = shiftObj.sortedWords.slice(0,1000),
		sumTypes = shiftObj.sumTypes.slice(0,1000),
		havg = shiftObj.refH,
		tcomp = shiftObj.compH;

	// d3.json("http://s3.amazonaws.com/hedopostprocess/word-shift-results/data/" + cformat(newdate) + ".json", function(json) {
	//     // extract data from the json
	//     var names = json.map(function(d) { return d.name; });
	//     var sizes = json.map(function(d) { return d.size; });
	//     // trend is -1 if down, 1 if up
	//     var trends = json.map(function(d) { return d.trend; });
	//     // vibe is -1 if negative, 1 if up
	//     var vibes = json.map(function(d) { return d.vibe; });
	//     // make a new type that agrees with mine
	//     var types = Array(vibes.length);
	//     for (var i=0; i<types.length; i=i+1) {
	// 	types[i] = 0
	// 	if (parseFloat(vibes[i]) === 1) { types[i] = types[i] + 1; }
	// 	if (parseFloat(trends[i]) === 1) { types[i] = types[i] + 2; }
	//     }

	//     console.log(types);

	    // d3.json("http://s3.amazonaws.com/hedopostprocess/word-shift-results/metadata/" + cformat(newdate) + ".json", function(json2) {
	    // 	var havg = json2.map(function(d) { return d.trefhavg; });
	    // 	var tcomp = json2.map(function(d) { return d.tcomphavg; });

	    // 	var shifttotals = json[0];

	    // console.log(havg);
	    // console.log(tcomp);

	    // // var sumTypes = [8,-10,-6,14];
	    // var sumTypes = [json2[0].normnegdown,-json2[0].normnegup,-json2[0].normposdown,json2[0].normposup]

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
		modalbody.insert("p","svg").attr("class","shifttitle pullright").html(function() { return "<br>"; });
		modalbody.insert("p","svg").attr("class","shifttitle").text(function(d,i) { return "Average Happiness: "+parseFloat(tcomp).toFixed(3); });

		modalbody.append("p").text(function() {
		    var head = "What's making words around "+keyworddecoder().current;
		    return havg <= tcomp ? head + " happier than the rest of twitter:" : head + " sadder than the rest of twitter:";
		});

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
	console.log(e.date);
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
    

})();


