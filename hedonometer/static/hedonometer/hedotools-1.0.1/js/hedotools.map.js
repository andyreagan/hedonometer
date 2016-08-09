hedotools.map = function() {

    var figure;

    var setfigure = function(_) {
	console.log("setting figure");
	figure = _;
	return hedotools.map;
    }

    var geoJson;

    var setdata = function(_) {
	geoJson = _;
	return hedotools.map;
    }
    
    var plot = function() {
	/* 
	   plot the state map!

	   drawMap(figure,geoJson);
           -figure is a d3 selection
           -geoJson is the loaded us-states file
           -stateHapps is the loaded csv (state,val)
	*/

	//Width and height
	var w = parseInt(figure.style('width'));
	var h = w*650/900;

	// remove an old figure if it exists
	figure.select(".canvas").remove();

	//Create SVG element
	var canvas = figure
	    .append("svg")
	    .attr("class", "map canvas")
	    .attr("id", "mapsvg")
	    .attr("width", w)
	    .attr("height", h);

	var selarray = [false,true],
	selstrings = ["Reference","Comparison"],
	selstringslen = selstrings.map(function(d) { return d.width(); }),
	initialpadding = 5,
	boxpadding = 5,
	fullselboxwidth = selarray.length*boxpadding*2-boxpadding+initialpadding+d3.sum(selstringslen);

	var legendscale = d3.scale.linear()
            .domain([340,730])
            .range([0,1]);

	function makeSelector() {

	    canvas.append("text")
		.attr({
		    "x": (w-70-fullselboxwidth-56),
		    "y": 54,
		    "fill": "grey",
		})
		.text("Selecting ");

	    var selgroup = canvas.append("g")
		.attr({"class": "selgroup",
		       "transform": "translate("+(w-70-fullselboxwidth)+","+40+")",});

	    selgroup.append("rect")
		.attr({"class": "selbox",
		       "x": 0,
		       "y": 0,
		       "rx": 3,
		       "ry": 3,
		       "width": fullselboxwidth,
		       "height": 19,
		       "fill": "#F8F8F8",
		       'stroke-width': '0.5',
		       'stroke': 'rgb(0,0,0)'});
	    
	    selgroup.selectAll("rect.colorclick")
    		.data(selarray)
    		.enter()
    		.append("rect")
    		.attr({"class": function(d,i) { return "colorclick "+intStr[i]; },
    		       "x": function(d,i) { if (i === 0) { return 0; }
					    else { return d3.sum(selstringslen.slice(0,i))+i*boxpadding+(i-1)*boxpadding+initialpadding; } },
    		       "y": 0,
		       "rx": 3,
		       "ry": 3,
    		       "width": function(d,i) { if (i === 0) { return selstringslen[i]+initialpadding+boxpadding; } else { return selstringslen[i]+boxpadding*2; }},
    		       "height": 19,
    		       "fill": "#F8F8F8", //http://www.w3schools.com/html/html_colors.asp
		       'stroke-width': '0.5',
		       'stroke': 'rgb(0,0,0)'});

	    selgroup.selectAll("text")
    		.data(selstrings)
    		.enter()
    		.append("text")
    		.attr({ "x": function(d,i) { 
		    // start at 2
		    if (i==0) { return initialpadding; }
		    // then use 2+width+10+width+10+width...
		    // for default padding of 5 on L/R
		    else { return d3.sum(selstringslen.slice(0,i))+initialpadding+i*boxpadding*2; } },
    			"y": 14, 
    			"class": function(d,i) { return "seltext "+intStr[i]; },
		      })
    		.text(function(d,i) { return d; });

	    selgroup.selectAll("rect.selclick")
    		.data(selarray)
    		.enter()
    		.append("rect")
    		.attr({"class": "selrect",
    		       "x": function(d,i) { if (i === 0) { return 0; }
					    else { return d3.sum(selstringslen.slice(0,i))+i*boxpadding+(i-1)*boxpadding+initialpadding; } },
    		       "y": 0,
    		       "width": function(d,i) { if (i === 0) { return selstringslen[i]+initialpadding+boxpadding; } else { return selstringslen[i]+boxpadding*2; }},
    		       "height": 19,
    		       "fill": "white", //http://www.w3schools.com/html/html_colors.asp
    		       "opacity": "0.0",})
    		.on("mousedown", function(d,i) {
		    if (stateSelType !== d) {
			stateSelType = d;
			activeHover = true;
			d3.selectAll("text.seltext").attr("fill","black")
			d3.select("text.seltext."+intStr[i]).attr("fill","white")
			d3.selectAll("rect.colorclick").attr("fill","#F8F8F8").attr("stroke","rgb(0,0,0)")
			d3.select("rect.colorclick."+intStr[i]).attr("fill","#428bca").attr("stroke","#428bca"); 
			d3.select(".selbutton.one").attr("class","btn btn-default btn-xs pull-right selbutton one");
			d3.select(".selbutton.two").attr("class","btn btn-default btn-xs pull-right selbutton two");
			d3.select(".selbutton."+intStr[i]).attr("class","btn btn-primary btn-xs pull-right selbutton "+intStr[i]);
			d3.selectAll(".state").attr("stroke-width",0.7);
		    }
    		});

	    selgroup.selectAll("line")
    		.data(selstrings.slice(0,selstrings.length-1))
    		.enter()
    		.append("line")
    		.attr("stroke","grey")
    		.attr("stroke-width","2")
    		.attr("x1", function(d,i) { 
		    return d3.sum(selstringslen.slice(0,i+1))+i*boxpadding+(i+1)*boxpadding+initialpadding;
		})
    		.attr("x2", function(d,i) { 
		    return d3.sum(selstringslen.slice(0,i+1))+i*boxpadding+(i+1)*boxpadding+initialpadding;
		})
    		.attr("y1", 0)
    		.attr("y2", 19); 

	    if (stateSelType) {
		var i = 1; 
	    }
	    else { 
		var i = 0; 
	    }

	    d3.selectAll("text.seltext").attr("fill","black")
	    d3.select("text.seltext."+intStr[i]).attr("fill","white")
	    d3.selectAll("rect.colorclick").attr("fill","#F8F8F8").attr("stroke","rgb(0,0,0)")
	    d3.select("rect.colorclick."+intStr[i]).attr("fill","#428bca").attr("stroke","#428bca");

	}

	function makeLegend(legendwidth,legendheight,textsize) { 

	    var legendarray = [0,1,2,3,4,5,6],
	    legendstringslen = [legendwidth,legendwidth,legendwidth,legendwidth,legendwidth,legendwidth,legendwidth,],
	    initialpadding = 0,
	    boxpadding = 0.25,
	    fulllegendboxwidth = legendarray.length*boxpadding*2-boxpadding+initialpadding+d3.sum(legendstringslen);

	    var legendgroup = canvas.append("g")
		.attr({"class": "legendgroup",
		       "transform": "translate("+(w-50-fulllegendboxwidth)+","+(h-legendheight-legendheight-2)+")",});

	    legendgroup.selectAll("rect.legendrect")
    		.data(legendarray)
    		.enter()
    		.append("rect")
    		.attr({"class": function(d,i) { return "q"+i+"-8"; },
    		       "x": function(d,i) { if (i === 0) { return 0; }
					    else { return d3.sum(legendstringslen.slice(0,i))+i*boxpadding+(i-1)*boxpadding+initialpadding; } },
    		       "y": 0,
		       // "rx": 3,
		       // "ry": 3,
    		       "width": function(d,i) { return legendstringslen[i]; },
    		       "height": legendheight,
		       'stroke-width': '1',
		       'stroke': 'rgb(0,0,0)'});

	    legendgroup.selectAll("text.legendtext")
		.data(["less happy","happier"])
		.enter()
		.append("text")
		.attr({"x": function(d,i) {
		    if (i==0) { return 0; }
		    else { return fulllegendboxwidth-d.width(textsize+"px arial"); } },
    		       "y": legendheight+legendheight, 
    		       "class": function(d,i) { return "legendtext"; },
		       "font-size": textsize+"px",
		      })
    		.text(function(d,i) { return d; });
	}

	var scaleFactor = legendscale(w);

	makeLegend((20+10*scaleFactor),(8+5*scaleFactor),(9+3*scaleFactor));

	//Define map projection
	var projection = d3.geo.albersUsa()
	    .translate([w/2, h/2])
	    .scale(w*1.3);
	//.scale(1000);

	//Define path generator
	var path = d3.geo.path()
	    .projection(projection);

	var numColors = 20,
        hueRange = [240,60], // in degrees
        // see http://hslpicker.com/#ffd900
        saturation = 1, // full
        lightness = 0.5; // half
	var colors = Array(numColors);
	var colorStrings = Array(numColors);
	for (i = 0; i<numColors; i++) {
	    colors[i] = hslToRgb((hueRange[0]+(hueRange[1]-hueRange[0])/(numColors-1)*i)/360, saturation, lightness);
	    colorStrings[i] = "rgb(" + colors[i][0] + "," + colors[i][1] + "," + colors[i][2] + ")"
	}
	// console.log(colors);
	// console.log(colorStrings);
	
	//Define quantize scale to sort data values into buckets of color
	color = d3.scale.quantize()
	//.range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);
            .range(colorStrings)
	    .domain([
		d3.min(allData, function(d) { return d.avhapps; }), 
		d3.max(allData, function(d) { return d.avhapps; })
	    ]);

	//Colors taken from colorbrewer.js, included in the D3 download

	// do the sorting
	indices = Array(allData.length-1);
	for (var i = 0; i < allData.length-1; i++) { indices[i] = i; }
	indices.sort(function(a,b) { return Math.abs(allData[a].avhapps) < Math.abs(allData[b].avhapps) ? 1 : Math.abs(allData[a].avhapps) > Math.abs(allData[b].avhapps) ? -1 : 0; });
	sortedStates = Array(allData.length-1);
	for (var i = 0; i < allData.length-1; i++) { sortedStates[i] = [i,indices[i],allStateNames[indices[i]]]; }
	// console.log(sortedStates);
	sortedStateList = Array(allData.length);
	for (var i = 0; i < allData.length; i++) { sortedStateList[indices[i]] = i+1; }

	stateFeatures = topojson.feature(geoJson,geoJson.objects.states).features;

	//Bind data and create one path per GeoJSON feature
	var states = canvas.selectAll("path")
	    .data(stateFeatures);
	
	states.enter()
	    .append("path")
	    .attr("d", function(d,i) { return path(d.geometry); } )
	    .attr("id", function(d,i) { return d.properties.name; } )
	    .attr("class",function(d,i) { return "state map "+d.properties.name[0]+d.properties.name.split(" ")[d.properties.name.split(" ").length-1]+" "+"q"+classColor(sortedStateList[i])+"-8"; } )
            .on("mousedown",state_clicked)
            .on("mouseover",state_hover)
            .on("mouseout",state_unhover);

	states.exit().remove();

	states
	    .attr("stroke","black")
	    .attr("stroke-width",".7");

	function state_clicked(d,i) { 
	    // next line verifies that the data and json line up
	    // console.log(d.properties.name); console.log(allData[i].name);

	    if (activeHover) { 
		// stop hovering
		activeHover = false;
		// remove the color
		d3.selectAll(".state").style("fill",null);
		if (stateSelType) {
		    // select the comparison
		    d3.selectAll(".state."+allData[i].name[0]+allData[i].name.split(" ")[allData[i].name.split(" ").length-1])
			.attr("stroke-width",3);
		}
		else {
		    // toggle the reference
		    d3.selectAll(".state."+allData[i].name[0]+allData[i].name.split(" ")[allData[i].name.split(" ").length-1])
			.attr("stroke-width",3);
		}
	    }
	    else {
		activeHover = true;
		d3.selectAll(".state").attr("stroke-width",0.7);
	    }

	    //.text("Average Happiness h").append("tspan").attr("baseline-shift","sub").text("avg");

	    

	    // if (shiftRef !== i) {
	    //     //console.log("reference "+allData[i].name);
	    //     shiftRef = i;
	    //     d3.selectAll(".state.map").attr("stroke-width",".7");
	    //     d3.selectAll(".state.list").attr("stroke","none");
	    //     d3.selectAll(".state."+allData[i].name[0]+allData[i].name.split(" ")[allData[i].name.split(" ").length-1])
	    // 	.attr("stroke-width",3);
	    // }
	    // else { 
	    //     //console.log("reference everything");
	    //     shiftRef = 51;
	    //     d3.selectAll(".state.map").attr("stroke-width","0.7");
	    //     d3.selectAll(".state.list").attr("stroke","none");
	    //         //.attr("stroke-width",3);
	    // }
	    
	    // if (shiftRef !== shiftComp) {
	    //     shiftObj = shift(allData[shiftRef].freq,allData[shiftComp].freq,lens,words);
	    //     plotShift(d3.select('#shift01'),shiftObj.sortedMag.slice(0,200),
	    // 	      shiftObj.sortedType.slice(0,200),
	    // 	      shiftObj.sortedWords.slice(0,200),
	    // 	      shiftObj.sumTypes,
	    // 	      shiftObj.refH,
	    // 	      shiftObj.compH);
	    // }
	}

	function state_hover(d,i) { 
	    var bbox = this.getBBox(); 
	    var x = Math.floor(bbox.x + bbox.width/2.0);
	    var y = Math.floor(bbox.y + bbox.height/2.0);
	    // console.log(x);
	    // console.log(y);

	    var wordsstring = "Words Used: "+commaSeparateNumber(d3.sum(allData[i].freq)),// +"/"+commaSeparateNumber(d3.sum(allData[i].rawFreq)),
	    wordsstring2 = "Total Words: "+commaSeparateNumber(d3.sum(allData[i].rawFreq)),
	    USwordsstring = "US Words Used: "+commaSeparateNumber(d3.sum(allData[51].freq)),// +"/"+commaSeparateNumber(d3.sum(allData[i].rawFreq)),
	    USwordsstring2 = "US Total Words: "+commaSeparateNumber(d3.sum(allData[51].rawFreq)),
	    happsstring = "Average Happiness: "+allData[i].avhapps.toFixed(2)
	    //hoverboxheight = 115,
	    hoverboxheight = 125+51,
	    hoverboxwidth = d3.max([wordsstring.width('13px arial'),happsstring.width('15px arial'),wordsstring2.width('13px arial'),USwordsstring.width('13px arial'),USwordsstring2.width('13px arial')])+20,
	    hoverboxxoffset = 60;
	    var hoverboxyoffset = 30;
	    
	    // if it would wrap it over, move it to the left side
	    if ((x+hoverboxwidth+hoverboxxoffset)>w) {
		hoverboxxoffset = -hoverboxxoffset-hoverboxwidth;
	    }

	    // if it would wrap it over, move it to the left side
	    if ((y-hoverboxheight/2-hoverboxyoffset)<0) {
		hoverboxyoffset = -30;
	    }
	    
	    var hovergroup = canvas.append("g").attr({
		"class": "hoverinfogroup",
		"transform": "translate("+(x+hoverboxxoffset)+","+(y-hoverboxheight/2-hoverboxyoffset)+")",});

	    var hoverbox = hovergroup.append("rect").attr({
		"class": "hoverinfobox",
		"x": 0,
		"y": 0,
		"width": hoverboxwidth,
		"height": hoverboxheight,
		"fill": "white",
		"stroke": "black",
	    });

	    hovergroup.append("text").attr({
		"class": "hoverinfotext",
		"x": 10,
		"y": 15,
		"font-size": 15,
	    })
		.text(allData[i].name);

	    hovergroup.append("line").attr({
		"class": "hoverinfotext",
		"x": 10,
		"y": 15,
		"font-size": 15,
	    })
		.text(allData[i].name);

	    hovergroup.append("text").attr({
		"class": "hoverinfotext",
		"x": 10,
		//"y": 55,
		"y": 38,
		"font-size": 17,
	    })
		.text("Rank:"); // +"/51");

	    hovergroup.append("text").attr({
		"class": "hoverinfotext",
		"x": 59,
		"y": 55,
		"font-size": 40,
	    })
		.text(sortedStateList[i]); // +"/51");

	    hovergroup.append("text").attr({
		"class": "hoverinfotext",
		"x": 105,
		"y": 56,
		"font-size": 20,
	    })
		.text("out of 51");

	    hovergroup.append("text").attr({
		"class": "hoverinfotext",
		"x": 10,
		//"y": 73,
		"y": 79,
		"font-size": 15,
	    })
		.text(happsstring);

	    hovergroup.append("text").attr({
		"class": "hoverinfotext",
		"x": 10,
		//"y": 89,
		"y": 97,
		"font-size": 13,
	    })
		.text(wordsstring);

	    hovergroup.append("text").attr({
		"class": "hoverinfotext",
		"x": 10,
		//"y": 106,
		"y": 114,
		"font-size": 13,
	    })
		.text(wordsstring2);

	    hovergroup.append("text").attr({
		"class": "hoverinfotext",
		"x": 10,
		//"y": 106,
		"y": 131,
		"font-size": 13,
	    })
		.text("US Average Happiness: "+allData[51].avhapps.toFixed(2));

	    hovergroup.append("text").attr({
		"class": "hoverinfotext",
		"x": 10,
		//"y": 89,
		"y": 97+51,
		"font-size": 13,
	    })
		.text(USwordsstring);

	    hovergroup.append("text").attr({
		"class": "hoverinfotext",
		"x": 10,
		//"y": 106,
		"y": 114+51,
		"font-size": 13,
	    })
		.text(USwordsstring2);

	    if (activeHover) {
		if (stateSelType) {
		    shiftComp = i;
		    d3.select(".complabel").text(allData[i].name);
		    compencoder.varval(allData[i].name);
		}
		else {
		    shiftRef = i;
		    d3.select(".reflabel").text(allData[i].name);
		    refencoder.varval(allData[i].name);
		}

		// next line verifies that the data and json line up
		// console.log(d.properties.name); console.log(allData[i].name.split(" ")[allData[i].name.split(" ").length-1]); 
		d3.selectAll(".state."+allData[i].name[0]+allData[i].name.split(" ")[allData[i].name.split(" ").length-1]).style("fill","#428bca");

		if (shiftRef !== shiftComp) {
		    hedotools.shifter.shift(allData[shiftRef].freq,allData[shiftComp].freq,lens,words);
		    var happysad = hedotools.shifter._compH() > hedotools.shifter._refH() ? "happier" : "less happy";
		    hedotools.shifter.setfigure(d3.select('#shift01')).setText(["Why "+allData[shiftComp].name+" is "+happysad+" than "+allData[shiftRef].name+":"]).plot();
		}
	    }
	}

	function state_unhover(d,i) { 

	    d3.select(".hoverinfogroup").remove();

	    if (activeHover) {
		// next line verifies that the data and json line up
		// console.log(d.properties.name); console.log(allData[i].name.split(" ")[allData[i].name.split(" ").length-1]); 
		// shiftComp = i;
		//console.log(".state.list."+allData[i].name[0]+allData[i].name.split(" ")[allData[i].name.split(" ").length-1]);
		//d3.selectAll(".state.list."+allData[i].name[0]+allData[i].name.split(" ")[allData[i].name.split(" ").length-1])
		//.style("fill",null);
		d3.select(this)
		    .style("fill",null);
	    }
	}

	function resizemap() {
	    w = parseInt(figure.style('width'));
	    h = w*650/900;
	    projection.translate([w/2, h/2]).scale(w*1.3);
	    canvas.selectAll("path").attr("d",path);
	    canvas.attr("width",w).attr("height",h);
	};

	d3.select(window).on("resize.map",resizemap);

    };


    /*
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   Number  h       The hue
     * @param   Number  s       The saturation
     * @param   Number  l       The lightness
     * @return  Array           The RGB representation
     */
    function hslToRgb(h, s, l){
	var r, g, b;

	if(s == 0){
            r = g = b = l; // achromatic
	}else{
            function hue2rgb(p, q, t){
		if(t < 0) t += 1;
		if(t > 1) t -= 1;
		if(t < 1/6) return p + (q - p) * 6 * t;
		if(t < 1/2) return q;
		if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
		return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    var opublic = { setfigure: setfigure,
		    setdata: setdata,
		    plot: plot, };

    return opublic;

}();






