var legendDict = {"mon":"on","tue":"on","wed":"on","thu":"on","fri":"on","sat":"on","sun":"on"};


function generateTimeline() {
	function getDay(d) {
		switch (d.date.getDay()) {
		case 0:
			return "Sunday";
			break;
		case 1:
			return "Monday";
			break;
		case 2:
			return "Tuesday";
			break;
		case 3:
			return "Wednesday";
			break;
		case 4:
			return "Thursday";
			break;
		case 5:
			return "Friday";
			break;
		case 6:
			return "Saturday";
			break;
		}
	}

	var symbol = d3.scale.ordinal().range(d3.svg.symbolTypes),
		color = d3.scale.category10();

	var margin = {
		top: 10,
		right: 10,
		bottom: 100,
		left: 40
	},
		margin2 = {
			top: 430,
			right: 10,
			bottom: 20,
			left: 40
		},
		width = 1000 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom,
		height2 = 500 - margin2.top - margin2.bottom;

	var formatDate = d3.time.format("%b %Y");
	// this will be ran whenever we mouse over a circle
	var myMouseDownOpenWordShiftFunction = function() {
			//var circle = d3.select(this);
			popitup('/wordshift.html?date=' + d3.select(this).attr("shortdate"));
		}

	var myMouseDownHideDiv = function() {
			var item = d3.select(this);
			item.attr("style", "display: none;")
			d3.select("#pickbox").attr("style", "display:none;")
		}

	var myMouseDownClearMinibox = function() {
			var item = d3.select("#minibox");
			item.attr("style", "display: hidden;")
		}

	function popitup(url) {
		newwindow = window.open(url, 'name', 'height=820,width=780,scrollbars=no,resizeable=0');
		if (window.focus) {
			newwindow.focus()
		}
		return false;
	}

	var myMouseOutFunction = function() {
			d3.select("#minilist").remove();
			var circle = d3.select(this);
			circle.transition().duration(250).attr("r", rmax).style("stroke-width", .7);
		}

	var myPositionFunction = function() {
			return Math.random() * w;
		}

	


	var wrp = d3.select("#wrap");
	var lgd = wrp.append("div").attr("id", "daylegend").attr("class", "days");
	var yrs = d3.select("#yearsrow");
	var thelegend = lgd.append("svg:svg").attr("height", 30);
	//var thelegend = d3.select("#timeseries").append("svg:g")
	var yearbox = yrs.append("svg:svg").attr("class","yearbox");

	var rmin = 0;
	var rmax = 3.25;
	var spc = 8;
	
	var toggleDays = function(){
		//run through the legendDict to see what's on or off...
		if(legendDict['mon'] == 'on'){
			d3.selectAll(".Monday").transition().duration(250).attr("r", rmax);
		}		
		if(legendDict['tue'] == 'on')
			d3.selectAll(".Tuesday").transition().duration(250).attr("r", rmax);
		if(legendDict['wed'] == 'on')
			d3.selectAll(".Wednesday").transition().duration(250).attr("r", rmax);
		if(legendDict['thu'] == 'on')
			d3.selectAll(".Thursday").transition().duration(250).attr("r", rmax);
		if(legendDict['fri'] == 'on')
			d3.selectAll(".Friday").transition().duration(250).attr("r", rmax);
		if(legendDict['sat'] == 'on')
			d3.selectAll(".Saturday").transition().duration(250).attr("r", rmax);
		if(legendDict['sun'] == 'on')
			d3.selectAll(".Sunday").transition().duration(250).attr("r", rmax);

		if(legendDict['mon'] == 'off'){
			d3.selectAll(".Monday").transition().duration(250).attr("r", rmin);
		}
		if(legendDict['tue'] == 'off')
			d3.selectAll(".Tuesday").transition().duration(250).attr("r", rmin);
		if(legendDict['wed'] == 'off')
			d3.selectAll(".Wednesday").transition().duration(250).attr("r", rmin);
		if(legendDict['thu'] == 'off')
			d3.selectAll(".Thursday").transition().duration(250).attr("r", rmin);
		if(legendDict['fri'] == 'off')
			d3.selectAll(".Friday").transition().duration(250).attr("r", rmin);
		if(legendDict['sat'] == 'off')
			d3.selectAll(".Saturday").transition().duration(250).attr("r", rmin);
		if(legendDict['sun'] == 'off')
			d3.selectAll(".Sunday").transition().duration(250).attr("r", rmin);
	}

	thelegend.append("svg:g")
	.attr("width", 100)
	.append("svg:circle")
	.on("mousedown", function() { 
		if(legendDict['sun'] == "on"){ legendDict['sun'] = "off";} 
		else {legendDict['sun'] = "on";}
		toggleDays();})
	.attr("cx", 8).attr("cy", 15)
	.attr("r", rmax)
	.attr("stroke", "black")
	.attr("stroke-width", 0.7)
	.attr("class", "Sunday");
	
	thelegend.append("svg:g")
	.append("svg:text")
	.attr("x", 15)
	.attr("y", 20)
	.on("mousedown", function() { 
		if(legendDict['sun'] == "on"){ legendDict['sun'] = "off";} 
		else {legendDict['sun'] = "on";}
		toggleDays();})
	.text("Sun");

	thelegend.append("svg:g").append("svg:circle")
	.on("mousedown", function() { 
		if(legendDict['mon'] == "on"){ legendDict['mon'] = "off";} 
		else {legendDict['mon'] = "on";}
		toggleDays();})
.attr("cx", 49).attr("cy", 15).attr("r", rmax).attr("stroke", "black").attr("stroke-width", 0.7).attr("class", "Monday");
	thelegend.append("svg:g").append("svg:text").attr("x", 56).attr("y", 20)
	.on("mousedown", function() { 
		if(legendDict['mon'] == "on"){ legendDict['mon'] = "off";} 
		else {legendDict['mon'] = "on";}
		toggleDays();})
	.text("Mon");

	thelegend.append("svg:g").append("svg:circle")
	.on("mousedown", function() { 
		if(legendDict['tue'] == "on"){ legendDict['tue'] = "off";} 
		else {legendDict['tue'] = "on";}
		toggleDays();})
	.attr("cx", 90).attr("cy", 15).attr("r", rmax).attr("stroke", "black").attr("stroke-width", 0.7).attr("class", "Tuesday")
	thelegend.append("svg:g").append("svg:text").attr("x", 96).attr("y", 20)
	.on("mousedown", function() { 
		if(legendDict['tue'] == "on"){ legendDict['tue'] = "off";} 
		else {legendDict['tue'] = "on";}
		toggleDays();})
	.text("Tue");

	thelegend.append("svg:g").append("svg:circle").on("mousedown", function() { 
		if(legendDict['wed'] == "on"){ legendDict['wed'] = "off";} 
		else {legendDict['wed'] = "on";}
		toggleDays();})
		.attr("cx", 131).attr("cy", 15).attr("r", rmax).attr("stroke", "black").attr("stroke-width", 0.7).attr("class", "Wednesday");
	thelegend.append("svg:g").append("svg:text").attr("x", 131 + 6).attr("y", 20)
	.on("mousedown", function() { 
		if(legendDict['wed'] == "on"){ legendDict['wed'] = "off";} 
		else {legendDict['wed'] = "on";}
		toggleDays();}).text("Wed");

	thelegend.append("svg:g").append("svg:circle")	.on("mousedown", function() { 
			if(legendDict['thu'] == "on"){ legendDict['thu'] = "off";} 
			else {legendDict['thu'] = "on";}
			toggleDays();}).attr("cx", 172).attr("cy", 15).attr("r", rmax).attr("stroke", "black").attr("stroke-width", 0.7).attr("class", "Thursday");

	thelegend.append("svg:g").append("svg:text").attr("x", 172 + 6).attr("y", 20)
	.on("mousedown", function() { 
				if(legendDict['thu'] == "on"){ legendDict['thu'] = "off";} 
				else {legendDict['thu'] = "on";}
				toggleDays();}).text("Thu");

	thelegend.append("svg:circle")
	.on("mousedown", function() { 
				if(legendDict['fri'] == "on"){ legendDict['fri'] = "off";} 
				else {legendDict['fri'] = "on";}
				toggleDays();})
				.attr("cx", 213).attr("cy", 15).attr("r", rmax).attr("stroke", "black").attr("stroke-width", 0.7).attr("class", "Friday")
	thelegend.append("svg:text").attr("x", 213 + 6).attr("y", 20)
	.on("mousedown", function() { 
				if(legendDict['fri'] == "on"){ legendDict['fri'] = "off";} 
				else {legendDict['fri'] = "on";}
				toggleDays();})
				.text("Fri");

	thelegend.append("svg:circle")
	.on("mousedown", function() { 
				if(legendDict['sat'] == "on"){ legendDict['sat'] = "off";} 
				else {legendDict['sat'] = "on";}
				toggleDays();})
				.attr("cx", 251).attr("cy", 15).attr("r", rmax).attr("stroke", "black").attr("stroke-width", 0.7).attr("class", "Saturday")
	thelegend.append("svg:text").attr("x", 251 + 6).attr("y", 20)
	.on("mousedown", function() { 
				if(legendDict['sat'] == "on"){ legendDict['sat'] = "off";} 
				else {legendDict['sat'] = "on";}
				toggleDays();})
	.text("Sat");
	//HERE
	yearbox.append("svg:g").attr("id", "theyears");
	var theyears = d3.select("#theyears");

function selectYear(year) {
	d3.select("#timeseries").remove();
	d3.select(".infobox h4").remove();
	d3.selectAll("rect:not(#shortlist)").style("fill", "lightgrey");
	d3.select("#rect"+year).style("fill", "black");
	timeline(year);
	if (year == "Full")
	d3.select(".infobox").append("h4").text("Daily Happiness Averages for Twitter, September 2008 to present");
	else
	d3.select(".infobox").append("h4").text("Daily Happiness Averages for Twitter, " + year);
}


	theyears.append("svg:rect").attr("x", 55).attr("y", 10).attr("width", 10).attr("height", 10).attr("id", "rect2008").on("mouseup", function() {
		d3.select("#rect2008").style("fill", "black");
	}).on("mousedown", function() {
		selectYear(2008);
	})
	theyears.append("svg:text").attr("x", 70).attr("y", 20).text("2008").on("mouseup", function() {
		d3.select("#rect2008").style("fill", "black");
	}).on("mousedown", function() { selectYear(2008)		
	})

	theyears.append("svg:rect").attr("x", 55*2).attr("y", 10).attr("width", 10).attr("height", 10).attr("id", "rect2009").on("mouseup", function() {
		d3.select("#rect2009").style("fill", "black");
	}).on("mousedown", function() {
		selectYear(2009);
	})
	theyears.append("svg:text").attr("x", 55*2 + 15).attr("y", 20).text("2009").on("mouseup", function() {
		d3.select("#rect2009").style("fill", "black");
	}).on("mousedown", function() { selectYear(2009)		
	})

	theyears.append("svg:rect").attr("x", 55 * 3).attr("y", 10).attr("width", 10).attr("height", 10).attr("id", "rect2010").on("mouseup", function() {
		d3.select("#rect2010").style("fill", "black");
		}).on("mousedown", function() { selectYear(2010)		
		})
	theyears.append("svg:text").attr("x", 55 * 3 + 15).attr("y", 20).text("2010").on("mouseup", function() {
		d3.select("#rect2010").style("fill", "black");
		}).on("mousedown", function() { selectYear(2010)		
		})

	theyears.append("svg:rect").attr("x", 55 * 4).attr("y", 10).attr("width", 10).attr("height", 10).attr("id", "rect2011").on("mouseup", function() {
		d3.select("#rect2011").style("fill", "black");
		}).on("mousedown", function() { selectYear(2011)		
		})
	theyears.append("svg:text").attr("x", 55 * 4 + 15).attr("y", 20).text("2011").on("mouseup", function() {
		d3.select("#rect2011").style("fill", "black");
		}).on("mousedown", function() { selectYear(2011)		
		})

	theyears.append("svg:rect").attr("x", 55 * 5).attr("y", 10).attr("width", 10).attr("height", 10).attr("id", "rect2012").on("mouseup", function() {
		d3.select("#rect2012").style("fill", "black");
		}).on("mousedown", function() { selectYear(2012)		
		})
	theyears.append("svg:text").attr("x", 55 * 5 + 15).attr("y", 20).text("2012").on("mouseup", function() {
		d3.select("#rect2012").style("fill", "black");
		}).on("mousedown", function() { selectYear(2012)		
		})

	theyears.append("svg:rect").attr("x", 55 * 6).attr("y", 10).attr("width", 10).attr("height", 10).attr("id", "rect2013").on("mouseup", function() {
		d3.select("#rect2013").style("fill", "black");
		}).on("mousedown", function() { selectYear(2013)		
		})
	theyears.append("svg:text").attr("x", 55 * 6 + 15).attr("y", 20).text("2013").on("mouseup", function() {
		d3.select("#rect2013").style("fill", "black");
		}).on("mousedown", function() { selectYear(2013)		
		})

	theyears.append("svg:rect").attr("x", 55 *  7).attr("y", 10).attr("width", 10).attr("height", 10).attr("id", "rectFull").on("mouseup", function() {
		d3.select("#rectFull").style("fill", "black");
		}).on("mousedown", function() { selectYear("Full")		
		})

	theyears.append("svg:text").attr("x", 55 * 7 + 15).attr("y", 20).text("Full Range").on("mouseup", function() {
		d3.select("#rectFull").style("fill", "black");
		}).on("mousedown", function() { selectYear("Full")		
		})

	function timeline(year) {
		var margin = {
			top: 10,
			right: 10,
			bottom: 100,
			left: 40
		},
			margin2 = {
				top: 430,
				right: 10,
				bottom: 20,
				left: 40
			},
			width = 1000 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom,
			height2 = 500 - margin2.top - margin2.bottom;

		var formatDate = d3.time.format("%b %Y");

		var x = d3.time.scale().range([8.5, width - 7]);

		var x2 = d3.time.scale().range([8.5, width - 7]);

		var y = d3.scale.linear().range([height, 0]);

		var y2 = d3.scale.linear().range([height2, 0]);

		var xAxis = d3.svg.axis().scale(x).orient("bottom"),
			xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
			yAxis = d3.svg.axis().scale(y).orient("left");
		yAxis2 = d3.svg.axis().scale(y).orient("right");

		var brush = d3.svg.brush().x(x2).on("brush", brush);

		var area = d3.svg.line()
		//.interpolate("linear")
		.x(function(d) {
			return x(d.date);
		})
		//.y0(height)
		.y(function(d) {
			return y(d.value);
		});

		var date1 = new Date(0000,11,25);
//		var date2 = new Date(2010,0,1);
		var format = d3.time.format("%m-%d");
		
		var prevx = 0;
		var prevy = 0;

		//This attempts to draw a line that connects all dates that match 11/25
		var line3 = d3.svg.line()
		.x(function(d) {
			if((format(d.date) == format(date1))){
				prevx = d.date;
				return x(d.date);
			} else {
				return x(prevx);
			}
		})
		.y(function(d) {
			if((format(d.date) == format(date1))){
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

		.attr("width", width + margin.left + margin.right + 35).attr("height", height + margin.top + margin.bottom);

		svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);

		var focus = svg.append("g").attr("id", "focus").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var focus2 = svg.append("g").attr("id", "focus2").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var context = svg.append("g").attr("id", "context").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

		d3.csv("http://s3.amazonaws.com/hedopostprocess/daily" + year + ".csv", function(data) {
			function getDate(d) {
				return new Date(d.date);
			}

			var minDate = getDate(data[0]),
				maxDate = getDate(data[data.length - 1]),
				parse = d3.time.format("%Y-%m-%d").parse;

			for (i = 0; i < data.length; i++) {
				data[i].shortDate = data[i].date;
				data[i].date = parse(data[i].date);
				data[i].value = +data[i].value;
			}

			x.domain(d3.extent(data.map(function(d) {
				return d.date;
			})));
			y.domain([5.80, 6.40]);
			x2.domain(x.domain());
			y2.domain(y.domain());

			focus.append("path").attr("id", "path").data([data]).attr("clip-path", "url(#clip)").attr("d", area);

//			focus.append("path").attr("id", "path").data([data]).attr("clip-path", "url(#clip)").attr("d", line3);

			focus.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

			focus.append("text").attr("class", "y labelTimeseries").attr("text-anchor", "end").attr("y", 6).attr("dy", ".75em").attr("transform", "rotate(-90)").text("Happiness Average");

			focus.append("g").attr("class", "y axis").call(yAxis);

			focus.append("g").attr("class", "y axis").attr("transform", "translate(" + width + ",0)").call(yAxis2);

			focus2.append("text").attr("class", "labelTimeseries whitebox").attr("text-anchor", "end").attr("x", 168).attr("y", 427).attr("dy", ".75em").text("Select and slide time periods:").order();


			var circle = focus2.selectAll("circle").data(data);
			circle.enter().append("circle").attr("r", rmax).attr("class", function(d) {
				return getDay(d);
			}).attr("cx", function(d) {
				return x(d.date);
			}).attr("clip-path", "url(#clip)").attr("cy", function(d) {
				return y(d.value);
			}).attr("shortdate", function(d) {
				return d.shortDate;
			}).attr("havg", function(d) {
				return d.value.toFixed(2);
			}).attr("day", function(d) {
				return getDay(d);
			}).attr("date", function(d) {
				return d.date;
			}).on("mouseover", myMouseOverFunction).on("mouseout", myMouseOutFunction).on("mousedown", myMouseDownOpenWordShiftFunction);
			circle.exit().remove();

			context.append("path").data([data]).attr("class", "mini").attr("d", area2);

			context.append("g").attr("class", "x axis").attr("transform", "translate(0," + height2 + ")").call(xAxis2);

			context.append("g").attr("class", "x brush").call(brush).selectAll("rect").attr("y", -6).attr("height", height2 + 7);
			
			toggleDays();
			
		});

		function brush() {
			x.domain(brush.empty() ? x2.domain() : brush.extent());

			focus.select("#path").attr("d", area);
			focus.select(".x.axis").call(xAxis);

			var circle = focus2.selectAll("circle").attr("cx", function(d) {
				return x(d.date);
			}).attr("cy", function(d) {
				return y(d.value);
			});

		}

		// this will run whenever we mouse over a circle
		
		var myMouseOverFunction = function() {
				var circle = d3.select(this);
				
				function offsetXY(x, y, s) {
					if (x >= 600) {
						x = x - (180);
						if ( y <= 200){
							y = y - 10;
							x = x - (30);
						}
						else {
							y = y - 164;
						}
					} else {
						x = x - -(33);
						if ( y <= 200){
							y = y - 10;
							x = x - - (20);
						}
						else {
							y = y - 164;
						}
					}

					if (s == 'X') {
						return x;
					}
					if (s == 'Y') {
						return y;
					}
				}

				function triangleptsXY(x, y) {
					var trianglepointsA = ["10 155, 10 165, 20 155"]
					var trianglepointsB = ["205 155, 215 165, 215 155"]
					var trianglepointsC = ["10 10, 0 20, 10 20"]
					var trianglepointsD = ["230 10, 240 20, 230 20"]
					var result = []

					if (x >= 600) {
						if (y <= 200) {
							result = trianglepointsD;
						} else {
							result = trianglepointsB;
						}
					} else {
						if (y <= 200) {
							result = trianglepointsC;
						} else {
							result = trianglepointsA;
						}
					}
					return result;
				}


				var circleX = circle.attr("cx");
				var circleY = circle.attr("cy");

				var miniboxX = offsetXY(circleX, circleY, "X");
				var miniboxY = offsetXY(circleX, circleY, "Y");

				circle.transition().duration(250).attr("r", 7.5).style("stroke-width", .5);

				d3.json("http://s3.amazonaws.com/hedopostprocess/word-shift-results/data-short/" + circle.attr("shortdate") + ".json", function(json) {
					var names = json.map(function(d) {
						return d.name;
					});
					var sizes = json.map(function(d) {
						return d.size;
					});
					var trends = json.map(function(d) {
						return d.trend;
					});
					var vibes = json.map(function(d) {
						return d.vibe;
					});
					var x0 = Math.max(-d3.min(sizes) * 1.33, d3.max(sizes) * 1.33);
					var y0 = Math.max(-d3.min(sizes) * 1.33, d3.max(sizes) * 1.33);

					var x = d3.scale.linear().domain([-x0, x0]).range([0, 400]);
					var y = d3.scale.linear().domain(d3.range(sizes.length)).range([5, 7]);

					var py = 5;
					var px = 210;
					var miniboxWidth = 215;
					var miniboxOffsetX = 170;
					var miniboxOffsetY = 200;
					var miniboxHeight = 155;
					var barcount = 9;

					var subrow = d3.select("#subrow");


					d3.select("#minilist").remove();
					d3.select("#pickbox").remove();


					d3.select("#timeseries").append("svg:g").attr("transform", "translate(" + miniboxX + "," + miniboxY + ")").attr("id", "minilist");
					var shortlist = d3.select("#minilist");

					var plectrum = d3.select("#plectrum");
					var trianglepointsA = ["10 40, 0 50, 10 50"]
					var trianglepointsB = ["205 150, 215 160, 215 150"]
					var trianglepointsC = ["10 150, 10 160, 20 150"]

					shortlist.append("svg:rect").attr("id", "shadow").attr("x", 12).attr("y", 5).attr("width", miniboxWidth + 5) //+( Math.abs(sizes[0].toPrecision(4)))   )
					.attr("height", miniboxHeight - 3).attr("rx", 0).attr("ry", 0).attr("stroke", "grey").attr("stroke-width", "4").attr("fill", "white").attr("opacity", 0.2);

					shortlist.append("svg:polyline")
					//Check to see where the box is placed.
					.attr("points", function(d) {
						return triangleptsXY(circleX, circleY);
					}).attr("stroke", "grey").attr("fill", "white").attr("opacity", 0.9).attr("stroke-width", "1");


					shortlist.append("svg:rect").attr("x", 10).attr("y", 0).attr("width", miniboxWidth + 5) //+( Math.abs(sizes[0].toPrecision(4)))   )
					.attr("height", miniboxHeight).attr("rx", 0).attr("ry", 0).attr("stroke", "grey").attr("stroke-width", "1").attr("fill", "white").attr("opacity", "0.96");

					//Display the date nicely.
					var cformat = d3.time.format("%Y-%m-%d");
					var longformat = d3.time.format("%B %e, %Y");

					shortlist.append("svg:text").on("mousedown", myMouseDownOpenWordShiftFunction).attr("x", 20).attr("y", 14).attr("shortdate", circle.attr("shortdate")).text(circle.attr("day") + ", " + longformat(cformat.parse(circle.attr("shortdate")))).attr("font-size", "10px").attr("font-weight", "bold")

					shortlist.append("svg:text").attr("x", 20).attr("y", 24).text("Happiness Average: " + circle.attr("havg")).attr("font-size", "10px")
					
					d3.json("http://s3.amazonaws.com/hedopostprocess/word-shift-results/metadata/" + circle.attr("shortdate") + ".json", function(json) {
						var havg = json.map(function(d) {
							return d.trefhavg;
						});
						var tcomp = json.map(function(d) {
							return d.tcomphavg;
						});
						
						
						shortlist.append("svg:text").attr("x", 20).attr("y", 35).attr("font-size", "10px")
						.text(function() {
							var head = "What's making this day ";
							return havg <= tcomp ? head + "happier:" : head + "sadder:";
 						})	
					});


					var innerlist = shortlist.append("svg:g").attr("transform", "translate(25,7)");;

					//Hover word shift Max
					innerlist.append("svg:text").attr("dx", function(d) {
						if (sizes[0] < 0) return (Math.abs(x(sizes[0]) - x(0)) + px) / 4;
					}).attr("dx", function(d) {
						if (sizes[0] >= 0) return (Math.abs(x(sizes[0]) - x(0) + 8)) / 4;
					}).attr("x", function(d) {
						return (x(Math.min(0, sizes[0])) + px) / 4;
					}).attr("text-anchor", function(d, i) {
						return sizes[0] <= 0 ? "end" : "start";
					}).attr("y", (py + 35)) //25
					.attr("font-size", "9px").attr("font-weight", "bold").attr("font-style", "italic").text(sizes[0].toPrecision(4));

					//Zero on the Hover
					innerlist.append("svg:text").attr("font-size", "9px").attr("x", (px + 197) / 4).attr("y", (py + 35)) //25
					.text("0");


					for (j = 0; j <= barcount; j++) {
						//Label the bars with words, arrows and plus minus
						innerlist.append("svg:text").text(names[j]).attr("font-size", "11px").attr("class", function(d, i) {
							return vibes[j] <= 0 ? "text negative" : "text positive";
						}).attr("x", function(d) {
							return (x(Math.min(0, sizes[j])) - 4 + px) / 4;
						}).attr("dx", function(d) {
							if (sizes[j] >= 0) return (Math.abs(x(sizes[j]) - x(0) + 10)) / 4;
						}).attr("y", py + 35 + (j * 10) - 2) //30,20
						.attr("dy", 14.5) //14.5//9.5
						.attr("text-anchor", function(d, i) {
							return sizes[j] <= 0 ? "end" : "start";
						}).text(function(d) {
							var trendsign = ''
							var vibesign = ''
							if (trends[j] == 1) {
								trendsign = "↑";
							}
							if (trends[j] == -1) {
								trendsign = "↓";
							}
							if (trends[j] == 0) {
								trendsign = ""
							}
							if (vibes[j] == 1) {
								vibesign = "+";
							}
							if (vibes[j] == 0) {
								vibesign = "";
							}
							if (vibes[j] == -1) {
								vibesign = "-";
							}
							return sizes[j] <= 0 ? vibesign + trendsign + names[j] : names[j] + vibesign + trendsign
						});
					}

					//BARSBARSBARS
					for (j = 0; j <= 9; j++) {
						rect1 = innerlist.append("svg:rect").attr("id", "shortlist").attr("class", function(d, i) {
							return vibes[j] <= 0 ? "bar negative" : "bar positive";
						}).attr("x", function(d) {
							return (x(Math.min(0, sizes[j])) + px) / 4;
						}).attr("width", function(d) {
							return (Math.abs(x(sizes[j]) - x(0))) / 4;
						}).attr("y", py + 40 + (j * 10)) //30,20
						.attr("style", "stroke-width:0.33px").attr("height", 10 / 1.25); //20
					}
				});

			} //END OF STARTER
	}


	timeline("Full");
	d3.selectAll("rect:not(#rectFull)").style("fill", "lightgrey");

	Mousetrap.bind('1', function() { selectYear("2008"); toggleDays();});
	Mousetrap.bind('2', function() { selectYear("2009"); toggleDays();});
	Mousetrap.bind('3', function() { selectYear("2010"); toggleDays();});
	Mousetrap.bind('4', function() { selectYear("2011"); toggleDays();});
	Mousetrap.bind('5', function() { selectYear("2012"); toggleDays();});
	Mousetrap.bind('6', function() { selectYear("2013"); toggleDays();});
	Mousetrap.bind('7', function() { selectYear("Full"); toggleDays();});
}
