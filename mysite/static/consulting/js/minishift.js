// this will run whenever we mouse over a circle
var myMouseOverFunction = function() {
		var circle = d3.select(this);
		var rect = d3.select(this);

		function offsetXY(x, y, s) {
			if (x >= 600) {
				x = x - (180);
				if (y <= 200) {
					y = y - 10;
					x = x - (30);
				} else {
					y = y - 164;
				}
			} else {
				x = x - -(33);
				if (y <= 200) {
					y = y - 10;
					x = x - -(20);
				} else {
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
		if (circleX == undefined) circleX = rect.attr("x");

		var circleY = circle.attr("cy");
		if (circleY == undefined) circleY = rect.attr("y");

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

			shortlist.append("svg:rect").attr("id", "shadow").attr("x", 12).attr("y", 5).attr("width", miniboxWidth + 5).attr("height", miniboxHeight - 3).attr("rx", 0).attr("ry", 0).attr("stroke", "grey").attr("stroke-width", "4").attr("fill", "white").attr("opacity", 0.2);

			shortlist.append("svg:polyline").attr("points", function(d) {
				return triangleptsXY(circleX, circleY);
			}).attr("stroke", "grey").attr("fill", "white").attr("opacity", 0.9).attr("stroke-width", "1");


			shortlist.append("svg:rect").attr("x", 10).attr("y", 0).attr("width", miniboxWidth + 5).attr("height", miniboxHeight).attr("rx", 0).attr("ry", 0).attr("stroke", "grey").attr("stroke-width", "1").attr("fill", "white").attr("opacity", "0.96");

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


				shortlist.append("svg:text").attr("x", 20).attr("y", 35).attr("font-size", "10px").text(function() {
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

			for (j = 0; j <= 9; j++) {
				rect1 = innerlist.append("svg:rect").attr("id", "shortlist").attr("class", function(d, i) {
					return vibes[j] <= 0 ? "bar negative" : "bar positive";
				}).attr("x", function(d) {
					return (x(Math.min(0, sizes[j])) + px) / 4;
				}).attr("width", function(d) {
					return (Math.abs(x(sizes[j]) - x(0))) / 4;
				}).attr("y", py + 40 + (j * 10)) //30,20
				.attr("style", "stroke-width:0.33px").attr("height", 10 / 1.25);
			}
		});

	}

