// hedonometer.org/maps.html needs this in hedotools.map.js
var classColor = d3.scaleQuantize()
    .range([0, 1, 2, 3, 4, 5, 6])
    .domain([50, 1]);

// begin with some helper functions
// http://stackoverflow.com/a/1026087/3780153
function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// this works really well, but it's deadly slow (working max 5 elements)
// and it's coupled to jquery
// http://stackoverflow.com/a/5047712/3780153
String.prototype.width = function(font) {
    var f = font || '12px arial',
        o = $('<div>' + this + '</div>')
        .css({
            'position': 'absolute',
            'float': 'left',
            'white-space': 'nowrap',
            'visibility': 'hidden',
            'font': f
        })
        .appendTo($('body')),
        w = o.width();
    o.remove();
    return w;
}

String.prototype.safe = function() {
    var tmp = this.split("/")
    tmp[tmp.length - 1] = escape(tmp[tmp.length - 1])
    return tmp.join("/");
}

// yup
// http://stackoverflow.com/questions/3883342/add-commas-to-a-number-in-jquery
function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}

function splitWidth(s, w) {
    // s is the string
    // w is the width that we want to split it to
    var t = s.split(" ");
    var n = [t[0]];
    var i = 1;
    var j = 0;
    while (i < t.length) {
        if ((n[j] + t[i]).width() < w) {
            n[j] += " " + t[i]
        } else {
            j++;
            n.push(t[i]);
        }
        i++;
    }
    return n;
}

var intStr = ["one", "two", "three", "four"];
var intStr0 = ["zero", "one", "two", "three"];

// main context
(function() {

    var hedotools = {};
    hedotools.shifter = shifterator.shifterator();
    hedotools.shifter._lens(lens);
    hedotools.shifter._words(words);
    hedotools.shifter._words_en(words_en);
    hedotools.shifter._xlabel_text("Per word average " + dimension + " shift")
    hedotools.shifter.ignore(ignoreWords);

    const initialMonths = (document.documentElement.clientWidth < 500) ? 3 : 18;

    // these variables are all available to everything inside of this closure
    var dur = 550;

    var today = new Date;
    var bigdays = {};
    var shiftTypeSelect = false;
    var formatDate = d3.timeFormat("%b %Y");
    var parseDate = d3.timeParse("%b %Y");
    var cformat = d3.timeFormat("%Y-%m-%d");
    var cparse = d3.timeParse("%Y-%m-%d");
    // pull these from the page template
    var beginningOfTime = cparse(startDate);
    var endOfTime = cparse(endDate);
    var dformat = d3.timeFormat("%Y-%m-%dT00:00:00");
    var longformat = d3.timeFormat("%B %e, %Y");
    var longerformat = d3.timeFormat("%A, %B %e, %Y");
    // declare all of the URL coders
    var fromencoder = d3.urllib.encoder().varname("from");
    var toencoder = d3.urllib.encoder().varname("to");
    // var fromdecoder = d3.urllib.decoder().varname("from").varresult(startDate);
    // var todecoder = d3.urllib.decoder().varname("to").varresult(endDate);
    var fromdecoder = d3.urllib.decoder().varname("from").varresult(cformat(d3.timeMonth.offset(today, -initialMonths)));
    var todecoder = d3.urllib.decoder().varname("to").varresult(cformat(d3.timeDay.offset(today, -1)));
    var dateencoder = d3.urllib.encoder().varname("date");
    var datedecoder = d3.urllib.decoder().varname("date");
    var shiftselencoder = d3.urllib.encoder().varname("wordtypes");
    var shiftseldecoder = d3.urllib.decoder().varname("wordtypes").varresult("none");
    var dataUrl = "https://hedonometer.org/data";

    var weekDaysShort = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    var weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    var popupExitDur = 500;
    var popupEnterDur = 400;

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
        toggle: function(name, r) {
            this[name] = this[name] === "on" ? "off" : "on";
            toggleDays(r);
        },
    };
    var circleColors = {
        "sunday": {"fill": "#FFCCFF",},
        "monday": {"fill": "#9933FF",},
        "tuesday": {"fill": "#4BFFFE",},
        "wednesday": {"fill": "#8AFF82",},
        "thursday": {"fill": "#009900",},
        "friday": {"fill": "#F87D15",},
        "saturday": {"fill": "#F70012",},
        "hilite": {"fill": "#000",},
        "togall": {"fill": "#000",},
    };

    // this will be ran whenever we mouse over a circle
    function myMouseDownOpenWordShiftFunction() {
        var circle = d3.select(this);
        popdate = cparse(circle.attr("shortdate"));
        transitionBigShift(popdate);
    };

    function toggleDays(r) {
        //run through the legendDict to see what's on or off...
        for (var i = 0; i < weekDays.length; i = i + 1) {
            if (legendDict[weekDaysShort[i]] == 'on') {
                d3.selectAll("." + weekDays[i]).style("visibility", "visible");
            } else {
                d3.selectAll("." + weekDays[i]).style("visibility", "hidden");
            }
        }
        // check the highlight individually
        if (legendDict['hilite'] == 'on') {
            d3.selectAll(".Hilite").transition().duration(250).attr("visibility", "visible");
        } else {
            d3.selectAll(".Hilite").transition().duration(250).attr("visibility", "hidden");
        }
    };

    function myMouseOutFunction() {
        // don't remove the popup
        // d3.select("#minilist").remove();
        var circle = d3.select(this);
        var currRange = (x.domain()[1].getTime() - x.domain()[0].getTime());
        circle.transition().duration(250).attr("r", rScale(currRange)).style("stroke-width", .7);
        clearTimeout(hovertimer);
    };

    // this will run whenever we mouse over a circle
    function myMouseOverFunction() {
        // context is invoked inside mouseover event
        var circle = d3.select(this);
        popdate = cparse(circle.attr("shortdate"));
        hovertimer = setTimeout(function() {
            drawSmallShift(parseFloat(circle.attr("cx")), parseFloat(circle.attr("cy")), popdate, false)
        }, popupEnterDur);
    };

    var margin = {
        top: 10,
        right: 40,
        bottom: 100,
        left: 40,
    };
    var width = parseInt(d3.select("#bigbox").style("width")) - margin.left - margin.right;
    var height = d3.max([300, parseInt(d3.select("#bigbox").style("width")) * 0.5 - margin.bottom - margin.top]);
    var height2 = 50;
    // vertical space to give the bottom brush selection
    var mainxAxisSpace = 40;

    var bigdayscale = d3.scaleLinear()
        .domain([0, endOfTime.getTime() - beginningOfTime.getTime()])
        .range([-100, 99.5]);

    var x = d3.scaleTime().range([0, width - 7]); //.domain([new Date(2008,8,10),endOfTime]);
    var x2 = d3.scaleTime().range([0, width - 7]).domain([beginningOfTime, endOfTime]);

    var y = d3.scaleLinear().range([height, 0]);
    var y2 = d3.scaleLinear().range([height2, 0]);
    // for the frequency plot
    var y3 = d3.scaleLinear().range([height, 6 * height / 7]);

    var xAxis = d3.axisBottom(x),
        xAxis2 = d3.axisBottom(x2),
        yAxis = d3.axisLeft(y),
        yAxis2 = d3.axisRight(y).ticks(7);

    var brush = d3.brushX()
        .extent([
            [0, 0],
            [width - 7, height2]
        ])
        .on("brush", brushed)
        .on("end", brushended);

    var line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value));

    var line0 = d3.line();

    var date1 = new Date(0000, 11, 25);
    var format = d3.timeFormat("%m-%d");

    var prevx = 0;
    var prevy = 0;

    //This attempts to draw a line that connects all dates that match 11/25
    var line3 = d3.line()
        .x(function(d) {
            if ((format(d.date) == format(date1))) {
                prevx = d.date;
                return x(d.date);
            } else {
                return x(prevx);
            }
        })
        .y(function(d) {
            if ((format(d.date) == format(date1))) {
                prevy = d.value;
                return y(d.value);
            } else {
                return y(prevy);
            }
        });

    // make the bottom area into a line
    var area2 = d3.line()
        .x(d => x2(d.date))
        .y(d => y2(d.value));

    // area for the freq
    var area3 = d3.area()
        .x(d => x(d.date))
        .y0(height)
        .y1(d => y3(d.freq));

    var svg = d3.select("#bigbox").append("svg")
        .attr("id", "timeseries")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("font", "12px sans-serif");

    svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);

    var focus = svg.append("g")
        .attr("id", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var focus2 = svg.append("g")
        .attr("id", "focus2")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var legendgroup = svg.append("g")
        .attr("class", "legendgroup")
        .attr("transform", "translate(" + (width - 10 - 366) + "," + 1 + ")");

    legendgroup.append("rect")
        .attr("class", "legendbox")
        .attr("x", 0)
        .attr("y", 0)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("width", 366)
        .attr("height", 19)
        .attr("fill", "#F0F0F0")
        .attr('stroke-width', '0.5')
        .attr('stroke', 'rgb(0,0,0)')

    var legendboxwidth = 43;

    legendgroup.selectAll("circle")
        .data(weekDaysShort)
        .enter()
        .append("circle").on("mousedown", function(d, i) {
            var currRange = (x.domain()[1].getTime() - x.domain()[0].getTime());
            legendDict.toggle(d, rScale(currRange));
        })
        .attr("cx", (d, i) => 8 + legendboxwidth * i)
        .attr("cy", 9)
        .attr("r", rmax)
        .attr("stroke", "black")
        .attr("stroke-width", 0.7)
        .attr("fill", (d, i) => circleColors[weekDays[i]].fill)
        .attr("class", (d, i) => weekDays[i]);

    legendgroup.selectAll("text")
        .data(weekDaysShort)
        .enter()
        .append("text")
        .attr("x", (d, i) => 15 + legendboxwidth * i)
        .attr("y", 14)
        .on("mousedown", function(d, i) {
            var currRange = (x.domain()[1].getTime() - x.domain()[0].getTime());
            legendDict.toggle(d, rScale(currRange));
        })
        // return first three letters for the name
        .text(function(d, i) {
            return weekDays[i][0].toUpperCase() + weekDays[i][1] + weekDays[i][2]
        });

    legendgroup.selectAll("rect.legendclick")
        .data(weekDaysShort)
        .enter()
        .append("rect")
        .attr("class", "legendrect")
        .attr("x", (d, i) => legendboxwidth * i)
        .attr("y", 0)
        .attr("width", legendboxwidth - 2)
        .attr("height", 19)
        .attr("fill", "white")
        .attr("opacity", "0.0")
        .on("mousedown", function(d, i) {
            var currRange = (x.domain()[1].getTime() - x.domain()[0].getTime());
            legendDict.toggle(d, rScale(currRange));
        });

    legendgroup.selectAll("line")
        .data([0, 0, 0, 0, 0, 0, 0])
        .enter()
        .append("line")
        .attr("stroke", "grey")
        .attr("stroke-width", "2")
        .attr("x1", (d, i) => 42 + legendboxwidth * i + d)
        .attr("x2", (d, i) => 42 + legendboxwidth * i + d)
        .attr("y1", 0)
        .attr("y2", 19);

    // was at 350
    legendgroup.append("svg:circle")
        .on("mousedown", function() {
            var currRange = (x.domain()[1].getTime() - x.domain()[0].getTime());
            legendDict.toggle('togall', rScale(currRange));
        })
        .attr("cx", 306)
        .attr("cy", 9)
        .attr("r", rmax)
        .attr("stroke", "black")
        .attr("stroke-width", 0.7)
        .attr("class", "Togall")

    legendgroup.append("svg:text")
        .attr("x", 306 + 6)
        .attr("y", 14)
        .text("All on/off")
        .attr("class", "togall")
        .attr("id", "togall");

    legendgroup.append("rect")
        .attr("class", "legendrect")
        .attr("x", 301)
        .attr("y", 0)
        .attr("width", 66)
        .attr("height", 20)
        .attr("fill", "white")
        .attr("opacity", "0.0")
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
            var currRange = (x.domain()[1].getTime() - x.domain()[0].getTime());
            toggleDays(rScale(currRange));
        });

    // ************************************************** //
    // define this function, but don't call it
    var makeNavBar = function() {

        var datearray = [
                [beginningOfTime, new Date(2009, 11, 31)],
                [new Date(2010, 00, 01), new Date(2010, 11, 31)],
                [new Date(2011, 00, 01), new Date(2011, 11, 31)],
                [new Date(2012, 00, 01), new Date(2012, 11, 31)],
                [new Date(2013, 00, 01), new Date(2013, 11, 31)],
                [new Date(2014, 00, 01), new Date(2014, 11, 31)],
                [new Date(2015, 00, 01), new Date(2015, 11, 31)],
                [new Date(2016, 00, 01), new Date(2016, 11, 31)],
                [new Date(2017, 00, 01), new Date(2017, 11, 31)],
                [new Date(2018, 00, 01), new Date(2018, 11, 31)],
                [new Date(2019, 00, 01), new Date(2019, 11, 31)],
                [new Date(2020, 00, 01), new Date(2020, 11, 31)],
                [new Date(2021, 00, 01), endOfTime],
                [beginningOfTime, endOfTime],
                [d3.timeMonth.offset(endOfTime, -18), endOfTime],
            ],
            yearstrings = ["\u2192 2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "Full", "Last 18 mo"],
            yearstringslen = yearstrings.map(function(d) {
                return d.width();
            }),
            initialpadding = 2,
            boxpadding = 5,
            fullyearboxwidth = datearray.length * boxpadding * 2 - boxpadding + initialpadding + d3.sum(yearstringslen);


        svg.append("text")
            .attr("x", (width - 10 - fullyearboxwidth - 53))
            .attr("y", 44)
            .attr("fill", "grey")
            .text("Jump to:");

        var yeargroup = svg.append("g")
            .attr("class", "yeargroup")
            .attr("transform", "translate(" + (width - 10 - fullyearboxwidth) + "," + 30 + ")")

        yeargroup.append("rect")
            .attr("class", "yearbox")
            .attr("x", 0)
            .attr("y", 0)
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("width", fullyearboxwidth)
            .attr("height", 19)
            .attr("fill", "#F0F0F0")
            .attr('stroke-width', '0.5')
            .attr('stroke', 'rgb(0,0,0)')

        yeargroup.selectAll("text")
            .data(yearstrings)
            .enter()
            .append("text")
            .attr("x", function(d, i) {
                // start at 2
                if (i == 0) {
                    return initialpadding;
                }
                // then use 2+width+10+width+10+width...
                // for default padding of 5 on L/R
                else {
                    return d3.sum(yearstringslen.slice(0, i)) + initialpadding + i * boxpadding * 2;
                }
            })
            .attr("y", 14)
            .text(function(d, i) {
                return d;
            });

        yeargroup.selectAll("rect.yearclick")
            .data(datearray)
            .enter()
            .append("rect")
            .attr("class", "yearrect")
            .attr("x", function(d, i) {
                if (i === 0) {
                    return 0;
                } else {
                    return d3.sum(yearstringslen.slice(0, i)) + i * boxpadding + (i - 1) * boxpadding + initialpadding;
                }
            })
            .attr("y", 0)
            .attr("width", function(d, i) {
                if (i === 0) {
                    return yearstringslen[i] + initialpadding + boxpadding;
                } else {
                    return yearstringslen[i] + boxpadding * 2;
                }
            })
            .attr("height", 19)
            .attr("fill", "white")
            .attr("opacity", "0.0")
            .on("mousedown", function(d, i) {
                console.log([x2(d[0]), x2(d[1])]);
                brushgroup.call(brush.move, [x2(d[0]), x2(d[1])])
                var cutoff = bigdayscale(d[1].getTime() - d[0].getTime());
                d3.selectAll("text.bigdaytext").transition().duration(1000).attr("visibility", function(d, i) {
                    if (d.importance > cutoff) {
                        return "visible";
                    } else {
                        return "hidden";
                    }
                })
                d3.selectAll("line.bigdayline").transition().duration(1000).attr("visibility", function(d, i) {
                    if (d.importance > cutoff) {
                        return "visbile";
                    } else {
                        return "hidden";
                    }
                })
            });

        yeargroup.selectAll("line")
            .data(yearstrings.slice(0, yearstrings.length - 1))
            .enter()
            .append("line")
            .attr("stroke", "grey")
            .attr("stroke-width", "2")
            .attr("x1", function(d, i) {
                return d3.sum(yearstringslen.slice(0, i + 1)) + i * boxpadding + (i + 1) * boxpadding + initialpadding;
            })
            .attr("x2", function(d, i) {
                return d3.sum(yearstringslen.slice(0, i + 1)) + i * boxpadding + (i + 1) * boxpadding + initialpadding;
            })
            .attr("y1", 0)
            .attr("y2", 19);
    }
    makeNavBar();

    var context = svg.append("g").attr("id", "context").attr("transform", "translate(" + margin.left + "," + (height + mainxAxisSpace) + ")");

    var minDate, maxDate;

    function line(d) {
        return line0(d.map(function(d) {
            return [d.x, d.y];
        }));
    };

    function brushended(selection) {
        // console.log("brushended");
        // console.log(d3.event);

        fromencoder.varval(cformat(x.domain()[0]));
        toencoder.varval(cformat(x.domain()[1]));

        // focus.selectAll(".brushedline")
        //     .attr("visibility", "hidden");
    }

    function brushed() {
        // console.log("brushed");
        // console.log(d3.event);
        // console.log(d3.event.selection.map(x2.invert));
        //
        // console.log(x.domain()[0].getTime());
        // console.log(x.domain()[1].getTime());
        // console.log(x2.domain());
        // console.log(brush.extent()());

        const currRange = d3.event.selection.map(x2.invert);
        console.log(currRange);

        x.domain(currRange);
        focus.select("#path").attr("d", line);
        focus.select("#freq").attr("d", area3);
        focus.select(".x.axis").call(xAxis);

        focus.select(".x.axis").selectAll("line")
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("shape-rendering", "crispEdges")

        // focus.selectAll(".brushedline")
        //     .attr("x2", (d, i) => x2(brush.extent()[i]))
        //     .attr("visibility", "visible")

        var circle = focus2.selectAll("circle")
            .attr("cx", d => x(d.date))
            .attr("cy", d => y(d.value))

        focus2.selectAll("circle")
            .attr("r", rScale(x.domain()[1].getTime() - x.domain()[0].getTime()))

        var rect = focus2.selectAll("rect")
            .attr("x", d => x(d.date))
            .attr("y", d => y(d.value + .02));

        var lines = focus2.selectAll("line.bigdayline")
            .attr("x1", d => x(d.date))
            .attr("x2", (d, i) => x(d.date) + d.x)
            .attr("y1", (d, i) => y(d.value) + 3 * (d.y / Math.abs(d.y)))
            // 2 in the direction of the offset +2*(d.y/d.y)
            .attr("y2", (d, i) => (d.y > 0) ? y(d.value) + d.y - 10 : y(d.value) + d.y + d.shorter.length * 12 - 6)

        var groups = focus2.selectAll("g.bigdaygroup")
            .attr("transform", function(d, i) {
                return "translate(" + (x(d.date) + d.x) + "," + (y(d.value) + d.y) + ")";
            });

        d3.select("#minilist").remove();

        var cutoff = bigdayscale(x.domain()[1].getTime() - x.domain()[0].getTime());
        // console.log(cutoff);

        d3.selectAll("text.bigdaytext").transition().duration(1000).attr("visibility", function(d, i) {
            if (d.importance > cutoff) {
                return "visible";
            } else {
                return "hidden";
            }
        })
        d3.selectAll("line.bigdayline").transition().duration(1000).attr("visibility", function(d, i) {
            if (d.importance > cutoff) {
                return "visbile";
            } else {
                return "hidden";
            }
        })
    }

    var fullRange = (endOfTime.getTime() - beginningOfTime.getTime());
    var rScale = d3.scaleLinear().range([rmax, 1.25]);
    rScale.domain([0, fullRange]);



    function offsetXY(x, y, s) {
        // if on the right
        if (x >= 600) {
            x = x - 220;
            // if on the top
            if (y <= 210) {
                y = y - 10;
                x = x - 30;
            } else {
                y = y - 224;
            }
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
        console.log("transitionBigShift", popdate)
        // called directly on "expand detailed shift" click
        // resizes the #minilist group and the svg within it
        //   -> the svg gets both it's transform and width, height updated

        d3.select('#moveshifthere').selectAll('svg').remove();
        d3.select('#minilist').remove();

        var modalwidth = 558;
        // parseInt(d3.select("#moveshifthere").style("width"));
        var modalheight = 495;

        d3.text(dataUrl + "/" + directory + "/" + wordVecDir + "/" + cformat(popdate) + "-sum.csv", function(tmp) {
            const compFvec = tmp.split(',').length > tmp.split('\n').length ? tmp.split(',') : tmp.split('\n');

            d3.text(dataUrl + "/" + directory + "/" + wordVecDir + "/" + cformat(d3.timeDay.offset(popdate, 0)) + "-prev7.csv", function(tmp2) {

                const refFvec = tmp2.split(',').length > tmp2.split('\n').length ? tmp2.split(',') : tmp2.split('\n');

                hedotools.shifter._refF(refFvec);
                hedotools.shifter._compF(compFvec);
                hedotools.shifter.stop();
                hedotools.shifter.shifter();
                hedotools.shifter.setWidth(modalwidth);
                hedotools.shifter.setText([" ", " ", " ", " "]);
                hedotools.shifter.setfigure('#moveshifthere');
                hedotools.shifter.plot();

                // this calls next day
                // so, it's replotting
                // but this does get the main text up, and set the date
                // the previous call should really just initialize the plot with blank data
                // since we're loading twice as much!
                $('#dp1').datepicker('setDate', popdate);

                $('#myModal').modal('toggle');

            }) // data

        }) // metadata



    }; // transitionBigShift

    var numWords = 27;

    // global declaration
    // drawSmallShift = function drawSmallShift(circle) {
    // inside function closure
    function drawSmallShift(cx, cy, popdate) {
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
            .on("mouseleave", function(d, i) {
                //console.log("mouseleave");
                minilistMouseLeaveTimer = setTimeout(function() {
                    d3.select("#minilistbg").transition().duration(200).remove();
                    d3.select("#minilist").transition().duration(200).remove();
                }, popupExitDur);
            })
            .on("mouseenter", function(d, i) {
                //console.log("mouseenter");
                try {
                    clearTimeout(minilistMouseLeaveTimer);
                } catch (err) {
                    // console.log(err);
                }
            });

        // draw a background rectangle to remove the popup on click out
        // d3.select("#timeseries").insert("rect","#minilist")
        // d3.select("#timeseries").append("rect")
        // and now it's inside the list, just to make the group the right size
        shortlist.append("rect")
            .attr("id", "minilistbg")
            // .attr("width", mainWidth + mainMargin.left + mainMargin.right + 35)
            // .attr("height", mainHeight + mainMargin.top + mainMargin.bottom)
            .attr("width", 315)
            .attr("height", 260)
            //.attr("transform", "translate(" + (miniboxX-40) + "," + (miniboxY-40) + ")")
            .attr("transform", "translate(-40,-40)") // it is 40 wider
            // than the pop-up, in every dimension
            .attr("fill", "grey")
            .attr("opacity", 0.01); // it needs some opacity to be clickable
        // these events are now on the group
        //.on("mousedown",function(d,i) { d3.select(this).remove(); d3.select("#minilist").remove(); } );

        shortlist.append("svg:polyline").attr("id", "shadow").attr("points", function(d) {
                return triangleptsXY(circleX, circleY);
            })
            .attr("transform", "translate(4,4)")
            .attr("stroke", "grey").attr("fill", "grey").attr("opacity", 0.2).attr("stroke-width", "1");

        shortlist.append("svg:polyline").attr("id", "bg").attr("points", function(d) {
            return triangleptsXY(circleX, circleY);
        }).attr("stroke", "grey").attr("fill", "white").attr("opacity", 0.96).attr("stroke-width", "1");

        // shortlist.append("svg:text").attr("x", 20).attr("y", 14).attr("shortdate", circle.attr("shortdate")).text(circle.attr("day") + ", " + longformat(cparse(circle.attr("shortdate")))).attr("font-size", "10px").attr("font-weight", "bold").attr("class","shifttitledate");
        shortlist.append("svg:text").attr("x", 20).attr("y", 14).text(longerformat(popdate)).attr("font-size", "10px").attr("font-weight", "bold").attr("class", "shifttitledate");

        for (var i = 0; i < bigdays.length; i++) {
            //console.log(bigdays[i].date);
            if (bigdays[i].date.getTime() === popdate.getTime()) {
                // console.log("major event");
                shortlist.append("text").attr("x", 200).attr("y", 24)
                    .attr('font-family', 'FontAwesome')
                    .attr('font-size', function(d) {
                        return '2em'
                    })
                    .text(function() {
                        return '\uF012'
                    });
                var tmp = splitWidth(bigdays[i].longer, 230);
                shortlist.append("text").attr("x", 20).attr("y", 38)
                    .text(function() {
                        return tmp[0];
                    })
                    .attr("font-weight", "bold")
                    .attr("font-size", "10px")
                    .attr("class", "shifttitlebigdaytext");
                if (tmp.length > 1) {
                    shortlist.append("text").attr("x", 20).attr("y", 49)
                        .text(function() {
                            return tmp[1];
                        })
                        .attr("font-weight", "bold")
                        .attr("font-size", "10px")
                        .attr("class", "shifttitlebigdaytext");
                }
                break;
            }
        }

        d3.csv(dataUrl + "/" + directory + "/" + shiftDir + "/" + cformat(popdate) + "-shift.csv", function(csv) {
            var names = csv.map(function(d) {
                return d.word;
            });
            var sizes = csv.map(function(d) {
                return d.mag;
            });
            var types = csv.map(function(d) {
                return d.type;
            });

            // set the width for bars
            //var x0 = Math.max(-d3.min(sizes) * 1.33, d3.max(sizes) * 1.33);
            //var x = d3.scaleLinear().domain([-x0, x0]).range([0, 400]);
            //var y = d3.scaleLinear().domain(d3.range(sizes.length)).range([5, 7]);

            d3.csv(dataUrl + "/" + directory + "/" + shiftDir + "/" + cformat(popdate) + "-metashift.csv", function(csv) {
                var havg = csv.map(function(d) {
                    return d.refH;
                });
                var tcomp = csv.map(function(d) {
                    return d.compH;
                });

                shortlist.append("svg:text").attr("x", 20).attr("y", 25).text("Average " + capitaliseFirstLetter(dimension) + ": " + parseFloat(tcomp).toFixed(2)).attr("font-size", "10px").attr("class", "shifttitlehavg");

                // wrap the longer sentence
                shortlist.append("svg:text").attr("x", 20).attr("y", 62).attr("font-size", "10px").text(function() {
                    var head = "What's making this day ";
                    // longer
                    // return havg <= tcomp ? head + "happier than the last seven days:" : head + "sadder than the last seven days:";
                    // shorter
                    return havg <= tcomp ? head + dimension_modifier_up : head + dimension_modifier_down;
                }).attr("class", "shifttitlewhatisone");
                shortlist.append("svg:text").attr("x", 20).attr("y", 72).attr("font-size", "10px").text(function() {
                    return "than the last seven days:"
                }).attr("class", "shifttitlewhatistwo");

                shortlist.append("line")
                    .attr("x1", 20)
                    .attr("x2", 220)
                    .attr("y1", 76)
                    .attr("y2", 76)
                    .attr("stroke", "grey")
                    .attr("stroke-width", ".3px")
                    .attr("class", "shiftsepline");
                shortlist.append("line")
                    .attr("x1", 20)
                    .attr("x2", 220)
                    .attr("y1", 198)
                    .attr("y2", 198)
                    .attr("stroke", "grey")
                    .attr("stroke-width", ".3px")
                    .attr("class", "shiftsepline");

                // add the link to bigger wordshift
                shortlist.append("g").attr("transform", "translate(40,211)")
                    //.insert("g","rect").attr("transform","translate(20,177)")
                    .append("text")
                    .text("Click for interactive word shift.")
                    //.attr("data-toggle","modal")
                    //.attr("href","#myModal")
                    .attr("class", "expanderbutton")
                    .on("click", function() {
                        transitionBigShift(popdate);
                    });

                var innerlist = shortlist.append("svg:g").attr("transform", "translate(20,79)").attr("id", "smallshiftgroup");

                var figwidth = 190,
                    figheight = 115,
                    numWords = 10;
                var shiftsvg = innerlist.append("svg")
                    .attr("width", figwidth)
                    .attr("height", figheight)
                    .attr("id", "shiftcanvas");
                summaryStats = false;

                plotSmallShift(shiftsvg, figwidth, figheight, numWords, sizes, types, names);

                shortlist.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", 220)
                    .attr("height", 200)
                    .attr("fill", "white")
                    .attr("opacity", 0.01)
                    .on("click", function() {
                        transitionBigShift(popdate);
                    });


                // .attr("class","btn btn-primary expanderbutton");
                // .attr("x",20)
                // .attr("y",167)
                // .attr("font-size","10px")
                // .on("mousedown",function() { transitionBigShift(circle,sizes,types,names); });

            }); // d3.csv metadata

        }); // d3.csv data

    }; // drawSmallShift

    function plotSmallShift(canvas, boxwidth, boxheight, numWords, sortedMag, sortedType, sortedWords) {
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

        var margin = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            figwidth = boxwidth - margin.left - margin.right,
            figheight = boxheight - margin.top - margin.bottom,
            iBarH = 9;

        var yHeight = 1,
            clipHeight = 0,
            barHeight = 0,
            width = .99 * figwidth,
            height = .99 * figheight;

        var figcenter = width / 2;

        // create the x and y axis
        // scale in x by width of the top word
        // could still run into a problem if top magnitudes are similar
        // and second word is longer
        // make these local
        // var x0 = Math.max(-d3.min(sortedMag) * 1.33, d3.max(sortedMag) * 1.33);

        sortedWords = sortedWords.map(function(d, i) {
            if (sortedType[i] == 0) {
                return d.concat("-\u2193");
            } else if (sortedType[i] == 1) {
                return "\u2193+".concat(d);
            } else if (sortedType[i] == 2) {
                return "\u2191-".concat(d);
            } else {
                return d.concat("+\u2191");
            }
        });
        var maxWidth = d3.max(sortedWords.slice(0, 5).map(function(d) {
            return d.width();
        }));
        var x = d3.scaleLinear()
            .domain([-Math.abs(sortedMag[0]), Math.abs(sortedMag[0])])
            //.range([-x0,x0]);
            .range([maxWidth - 5, boxwidth - maxWidth + 5]);

        // linear scale function
        var y = d3.scaleLinear()
            .domain([numWords + 1, 1])
            .range([height + 2, yHeight]);


        // create the axes themselves
        var axes = canvas.append("g")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "main");

        // create the axes background
        axes.append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "bg")
            .attr("fill", "#FCFCFC")
            .attr("opacity", "0.96");

        axes.selectAll("rect.shiftrect")
            .data(sortedMag)
            .enter()
            .append("rect")
            // color
            .attr("fill", function(d, i) {
                if (sortedType[i] == 2) {
                    return "#4C4CFF";
                } else if (sortedType[i] == 3) {
                    return "#FFFF4C";
                } else if (sortedType[i] == 0) {
                    return "#B3B3FF";
                } else {
                    return "#FFFFB3";
                }
            })
            .attr("class", function(d, i) {
                return "shiftrect " + intStr0[sortedType[i]];
            })
            .attr("x", function(d, i) {
                if (d > 0) {
                    return figcenter;
                } else {
                    return x(d)
                }
            })
            .attr("y", function(d, i) {
                return y(i + 1);
            })
            .style('opacity', '0.7')
            .style('stroke-width', '1')
            .style('stroke', 'rgb(0,0,0)')
            .attr("height", function(d, i) {
                return iBarH;
            })
            .attr("width", function(d, i) {
                if ((d) > 0) {
                    return x(d) - x(0);
                } else {
                    return x(0) - x(d);
                }
            })
            .on('mouseover', null)
            .on('mouseout', function(d) {
                var rectSelection = d3.select(this).style(
                    opacity, '0.7'
                );
            });

        axes.selectAll("text.shifttext")
            .data(sortedMag)
            .enter()
            .append("text")
            .attr("class", function(d, i) {
                return "shifttext " + intStr0[sortedType[i]];
            })
            .style(
                "text-anchor", function(d, i) {
                    if (sortedMag[i] < 0) {
                        return "end";
                    } else {
                        return "start";
                    }
                })
            .style("font-size", 11)
            .attr("y", function(d, i) {
                return y(i + 1) + iBarH;
            })
            .text(function(d, i) {
                return sortedWords[i];
            })
            .attr("x", function(d, i) {
                if (d > 0) {
                    return x(d) + 2;
                } else {
                    return x(d) - 2;
                }
            });
    };

    // store the function in a object of the same name globally
    nextDay = function nextDay(update) {
        console.log("nextDay", update);
        dateencoder.varval(cformat(update));

        d3.text(dataUrl + "/" + directory + "/" + wordVecDir + "/" + cformat(update) + "-sum.csv", function(tmp) {

            const compFvec = tmp.split(',').length > tmp.split('\n').length ? tmp.split(',') : tmp.split('\n');
            d3.text(dataUrl + "/" + directory + "/" + wordVecDir + "/" + cformat(d3.timeDay.offset(update, 0)) + "-prev7.csv", function(tmp2) {

                const refFvec = tmp2.split(',').length > tmp2.split('\n').length ? tmp2.split(',') : tmp2.split('\n');

                console.log("nextDay changing the text at the top");
                var bigdaytest = false;
                var bigdaywiki = []; //'http://en.wikipedia.org/wiki/Wedding_of_Prince_William_and_Catherine_Middleton';
                var bigdaytext = [];

                // addthis_share.passthrough.twitter.text = longformat(update) + ", word shift:"

                console.log(bigdays.length);

                for (var i = 0; i < bigdays.length; i++) {
                    console.log(i, bigdays[i].date);
                    if (bigdays[i].date.getTime() === update.getTime()) {
                        console.log("major event found");
                        bigdaytest = true;
                        bigdaywiki.push(bigdays[i].wiki);
                        bigdaytext.push(bigdays[i].longer);
                        // always share the last event
                        // addthis_share.passthrough.twitter.text = bigdays[i].longer + ", " + longformat(update) + ", word shift:"
                        // don't break for multiple events
                        // break;
                    }
                }
                if (bigdaytest) {
                    console.log(bigdaytest, "bigdaytest=true, adding wiki link to header")
                    var tmpStr = 'Interactive Wordshift <span class="label label-default">Major Event <i class="fa fa-signal"></i></span> ';
                    for (var i = 0; i < bigdaywiki.length; i++) {
                        tmpStr += '<a href="' + bigdaywiki[i].safe() + '" target="_blank"><img src="https://lh6.ggpht.com/-Eq7SGa8CVtZCQPXmnux59sebPPU04j1gak4ppkMVboUMQ_ucceGCHrC1wtqfqyByg=w300" height="35" class="wikilogo"/></a>';
                    }
                    d3.select('#modaltitle').html(tmpStr);
                } else {
                    d3.select("#modaltitle").html("Interactive Wordshift <span class='label label-default'></span><img src='/static/hedonometer/graphics/white.png' height='35'/>");
                }

                console.log("grab the modal body");
                var modalbody = d3.select("#moveshifthere");
                var modalfooter = d3.select("#moveshiftherefooter");
                // remove the text at the top
                // modalbody.selectAll("p").remove();
                // modalbody.insert("p","svg").attr("class","shifttitle").html(function(d,i) { return "<b>"+longerformat(update)+"</b>"; });
                var tmptext = [longerformat(update)];
                console.log(tmptext);
                if (bigdaytest) {
                    console.log(bigdaytext);
                    for (var bc = 0; bc < bigdaytext.length; bc++) {
                        console.log("appending event " + bc + " text");
                        // modalbody.insert("p","svg").attr("class","shifttitle pullright").html(function() { return "<b>"+""+bigdaytext[bc]+"</b>"; });
                        tmptext = tmptext.concat([bigdaytext[bc]]);
                    }
                } else {
                    // modalbody.insert("p","svg").attr("class","shifttitle pullright").html(function() { return "<br>"; });
                    tmptext = tmptext.concat([""]);
                }

                hedotools.shifter._refF(refFvec);
                hedotools.shifter._compF(compFvec);
                hedotools.shifter.stop();
                hedotools.shifter.shifter();

                // modalbody.insert("p","svg").attr("class","shifttitle").text(function(d,i) { return "Average happiness: "+parseFloat(hedotools.shifter._compH()).toFixed(3); });

                tmptext = tmptext.concat(["Average " + capitaliseFirstLetter(dimension) + ": " + parseFloat(hedotools.shifter._compH()).toFixed(2)]);

                // modalbody.insert("p","svg").text(function() {
                //     var head = "What's making this day ";
                //     return hedotools.shifter._refH() <= hedotools.shifter._compH() ? head + "happier than the last seven days:" : head + "sadder than the last seven days:";
                // });

                tmptext = tmptext.concat([hedotools.shifter._refH() <= hedotools.shifter._compH() ? "What's making this day " + dimension_modifier_up + " than the last seven days:" : "What's making this day " + dimension_modifier_down + " than the last seven days:"]);

                if (update.getTime() === happs[0].date.getTime()) {
                    modalfooter.select(".left").attr("disabled", "disabled");
                } else {
                    modalfooter.select(".left").attr("disabled", null);
                }
                if (update.getTime() === happs[happs.length - 1].date.getTime()) {
                    modalfooter.select(".right").attr("disabled", "disabled");
                } else {
                    modalfooter.select(".right").attr("disabled", null);
                }

                console.log("the text is");
                console.log(tmptext);

                hedotools.shifter.setText(tmptext);
                hedotools.shifter.drawlogo();
                hedotools.shifter.replot();

            }); // d3.text prev7

        }); // d3.text sum

    } // nextDay

    // make sure to remvoe the url bar junk when closed
    $('#myModal').on('hidden.bs.modal', function(e) {
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
    }).on('changeDate', function(e) {
        // compute the offset
        // console.log(e.date);
        nextDay(e.date);
    });

    addDays = function addDays(date, days) {
        var result = new Date(date);
        result.setDate(date.getDate() + days);
        return result;
    }

    var leftbutton = d3.select("button.left").on("click", function(d) {
        $('#dp1').datepicker('setDate', addDays($('#dp1').datepicker('getDate'), -1))
    });

    var rightbutton = d3.select("button.right").on("click", function(d) {
        $('#dp1').datepicker('setDate', addDays($('#dp1').datepicker('getDate'), 1))
    });

    $('#myModal2').on('hidden.bs.modal', function(e) {
        hedotools.shifter.resetbuttontoggle(true);
    });

    $('#myModal2').on('show.bs.modal', function(e) {
        console.log("embed modal shown");
        $('#linktextarea').text(window.location.href);
        $('#embedtextarea').text('<iframe src="https://hedonometer.org/embed/main/' + datedecoder().current + '/' + ((shiftseldecoder().current.length > 0) ? '?wordtypes=' + shiftseldecoder().current : '') + '" width="590" height="800" frameborder="0" scrolling="no"></iframe>');

        filename = 'hedonometer-' + cformat($('#dp1').datepicker('getDate')) + '-wordshift';

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

    minDate = new Date(happs[0].date);
    maxDate = new Date(happs[happs.length - 1].date);
    console.log('here are the min and max date picked up from happs encoded in html');
    console.log(minDate);
    console.log(maxDate);
    // var parse = d3.timeFormat("%Y-%m-%d").parse;

    for (i = 0; i < happs.length; i++) {
        happs[i].shortDate = happs[i].date;
        happs[i].date = cparse(happs[i].date);
    }

    x.domain(d3.extent(happs.map(function(d) {
        return d.date;
    })));
    var happsextent = d3.extent(happs.map(function(d) {
        return d.value;
    }))
    var extraspace = .1;
    y.domain([happsextent[0] - extraspace, happsextent[1] + extraspace]);
    y2.domain(y.domain());

    var path = focus.append("path")
        .attr("id", "path")
        .data([happs])
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("clip-path", "url(#clip)")
        .attr("stroke-width", "1.2px")

    focus.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").transition().duration(dur).call(xAxis);
    focus.append("g").attr("class", "y axis").attr("transform", "translate(" + width + ",0)").call(yAxis2);

    // go ahead and apply styles directly to these
    focus.select(".x.axis").select("path").attr("fill", "none");
    focus.select(".x.axis").selectAll("line")
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("shape-rendering", "crispEdges")
    focus.selectAll(".y.axis").select("path").attr("fill", "none");

    horizontalLineGroup = focus.append("g")
    horizontalLineGroup.selectAll("line").data(y.ticks(7)).enter().append("line")
        .attr("class", "horizontalLines")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y)
        .attr("y2", y)
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-dasharray", "5")
        .attr("stroke-width", "0.3px");

    horizontalLineGroup.append("line")
        .attr("class", "horizontalLinesFirst")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", height)
        .attr("y2", height)
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-width", "1.5px");

    var circle = focus2.selectAll("circle").data(happs);

    var currRange = (x.domain()[1].getTime() - x.domain()[0].getTime());

    circle.enter().append("circle")
        .attr("stroke-width", "0.5")
        .attr("clip-path", "url(#clip)")
        .attr("class", d => weekDays[d.date.getDay()])
        .attr("fill", d => circleColors[weekDays[d.date.getDay()]].fill)
        .attr("stroke", "#000")
        .attr("opacity", "0.7")
        .attr("cursor", "hand")
        .attr("cursor", "pointer")
        .attr("cx", d => x(d.date))
        .attr("shortdate", d => d.shortDate)
        .attr("havg", d => d.value.toFixed(2))
        .attr("day", d => weekDays[d.date.getDay()])
        .attr("date", d => d.date)
        .attr("cy", d => y(d.value))
        .attr("r", d => rScale(currRange))
        .on("mouseover.enlarge", function() {
            d3.select(this).transition().duration(250).attr("r", 7.5).style("stroke-width", .5);
        })
        .on("mouseover.popup", myMouseOverFunction)
        .on("mouseout", myMouseOutFunction)
        .on("mousedown", myMouseDownOpenWordShiftFunction);

    context.append("path")
        .data([happs])
        .attr("class", "mini")
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("d", area2)
        .attr("stroke-width", "1.5px")

    // need a line below now too
    context.append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", height2)
        .attr("y2", height2)
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-width", ".7px");

    context.append("g").attr("class", "x axis")
        .attr("transform", "translate(" + "0" + "," + height2 + ")")
        .call(xAxis2);

    context.select(".x.axis").selectAll("line")
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("shape-rendering", "crispEdges")

    context.select(".x.axis").select("path").attr("fill", "none");

    var format = d3.timeFormat("%m-%d");

    d3.json('/api/v1/events/?format=json&happs__timeseries__title=' + title,
        function(err, json) {
            console.log(err);
            console.log(json);
            bigdays = json.objects.map(function(d) {
                d.date = cparse(d.happs.date);
                d.x = +d.x;
                d.y = +d.y;
                d.value = +d.happs.happiness;
                d.importance = +d.importance;
                d.shorter = d.shorter.split(',');
                // don't let them overflow the bottom
                d.y = d3.min([d.y, height - (y(d.value)) - d.shorter.length * 10]);
                return d;
            });
            console.log("the events are:");
            console.log(bigdays);

            focus2.selectAll("line.bigdayline").data(bigdays).enter()
                .append("line")
                // the x and y get set upon brushed
                .attr("stroke", "grey")
                .attr("class", "bigdayline")
                .attr("visibility", "hidden")
                .attr("stroke-width", 0.5);

            const bigdaygroups = focus2.selectAll("g.bigdaygroup").data(bigdays).enter()
                .append("g")
                .attr("class", "bigdaygroup")
                .attr("transform", function(d, i) {
                    return "translate(" + (x(d.date) + d.x) + "," + (y(d.value) + d.y) + ")";
                });

            var line0 = bigdaygroups
                .append("text")
                .text(d => d.shorter[0])
                .attr("class", "bigdaytext")
                .attr("dx", 0)
                .attr("dy", 0)
                .attr("stroke", "")
                .attr("fill", "grey")
                .attr("visibility", "hidden");

            bigdaygroups
                .append("text")
                .text(d => (d.shorter.length > 1) ? d.shorter[1] : "")
                .attr("class", "bigdaytext")
                .attr("dx", 0)
                .attr("dy", 15)
                .attr("stroke", "")
                .attr("fill", "grey")
                .attr("visibility", "hidden");

            bigdaygroups
                .append("text")
                .text(d => (d.shorter.length > 2) ? d.shorter[2] : "")
                .attr("class", "bigdaytext")
                .attr("dx", 0)
                .attr("dy", 30)
                .attr("stroke", "")
                .attr("fill", "grey")
                .attr("visibility", "hidden");

            bigdaygroups
                .append("text")
                .text(d => (d.shorter.length > 3) ? d.shorter[3] : "")
                .attr("class", "bigdaytext")
                .attr("dx", 0)
                .attr("dy", 45)
                .attr("stroke", "")
                .attr("fill", "grey")
                .attr("visibility", "hidden");


            console.log('call the brush initially');
            console.log([x(cparse(fromdecoder().cached)), x(cparse(todecoder().cached))]);
            brushgroup.call(brush.move, [x(cparse(fromdecoder().cached)), x(cparse(todecoder().cached))])

            // now go and fix all of the offsets
            d3.selectAll("text.bigdaytext").attr("dx", function(d, i) {
                return -this.clientWidth / 2;
            })

            if (datedecoder().current !== "none" && datedecoder().current.length > 0) {
                var pulldate = cparse(datedecoder().current);
                transitionBigShift(pulldate);
            }
        } // d3.json callback
    ); // d3.json for events

    var freqExtent = d3.extent(happs.map(function(d) {
        return d.freq;
    }))

    y3.domain(freqExtent);

    yAxis3 = d3.axisLeft().scale(y3).ticks(2).tickFormat(d3.format(".1s"));

    focus.append("g").attr("class", "y axis freq").attr("transform", "translate(0,0)").call(yAxis3);
    focus.selectAll(".y.axis").select("path").attr("fill", "none");

    focus.append("path")
        .data([happs])
        .attr("id", "freq")
        .attr("fill", "#E0E0E0")
        .attr("stroke", "#C8C8C8")
        .attr("d", area3)
        .attr("clip-path", "url(#clip)")
        .attr("stroke-width", ".5px")

    var brushgroup = context.append("g").attr("class", "x brush")
        .call(brush);

    brushgroup
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", (height2 + 7))
        .attr("stroke", "#fff")
        .attr("cursor", "ew-resize")

    brushgroup
        .select("rect.extent")
        .attr("fill", "wheat")
        .attr("opacity", "0.5")

    brushgroup
        .select("g.resize.w")
        .select("rect")
        .attr("y", -6)
        .attr("height", (height2 + 7))
        .attr("stroke", "#fff")
        .attr("fill", "darkgrey")
        .attr("cursor", "ew-resize")
        .style("visibility", "visible");

    brushgroup
        .select("g.resize.e")
        .select("rect")
        .attr("y", -6)
        .attr("height", (height2 + 7))
        .attr("stroke", "#fff")
        .attr("fill", "darkgrey")
        .attr("cursor", "ew-resize")
        .style("visibility", "visible");

    console.log("enjoy :)");
})();
