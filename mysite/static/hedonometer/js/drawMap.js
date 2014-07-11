function drawMap(figure) {
    /* 
       plot the state map!

       drawMap(figure,geoJson,stateHapps);
         -figure is a d3 selection
         -geoJson is the loaded us-states file
         -stateHapps is the loaded csv (state,val)
    */

    //Width and height
    var w = parseInt(figure.style('width')),
    h = w*650/900;

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
    console.log(colors);
    console.log(colorStrings);
    
    
    //Define quantize scale to sort data values into buckets of color
    color = d3.scale.quantize()
	//.range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);
        .range(colorStrings)
	.domain([
	    d3.min(allData, function(d) { return d.avhapps; }), 
	    d3.max(allData, function(d) { return d.avhapps; })
	]);
    //Colors taken from colorbrewer.js, included in the D3 download

    // remove an old figure if it exists
    figure.select(".canvas").remove();

    //Create SVG element
    var canvas = figure
	.append("svg")
	.attr("class", "canvas")
	.attr("width", w)
	.attr("height", h);

    stateFeatures = topojson.feature(geoJson,geoJson.objects.states).features;

    //Bind data and create one path per GeoJSON feature
    var states = canvas.selectAll("path")
	.data(stateFeatures);
    
    states.enter()
	.append("path")
	.attr("d", function(d,i) { return path(d.geometry); } )
	.attr("id", function(d,i) { return d.properties.name; } )
	.attr("class",function(d,i) { return "state map "+d.properties.name[0]+d.properties.name.split(" ")[d.properties.name.split(" ").length-1]; } )
        .on("mousedown",state_clicked)
        .on("mouseover",state_hover)
        .on("mouseout",state_unhover);

    states.exit().remove();

    states
         .style("fill", function(d,i) {
	    // need to get the variable map right
    	    var value = allData[i].avhapps;
	    var numWords = d3.sum(allData[i].freq); // d3.sum(d.properties.freq);
    	    if (numWords > 10000) {
    		return color(value);
    	    } else {
    		return "#ccc";
    	    }
    	})
	.attr("stroke","black")
	.attr("stroke-width",".7");

    function state_clicked(d,i) { 
	// next line verifies that the data and json line up
	// console.log(d.properties.name); console.log(allData[i].name); 

	// toggle the reference
	if (shiftRef !== i) {
	    //console.log("reference "+allData[i].name);
	    shiftRef = i;
	    d3.selectAll(".state.map").attr("stroke-width",".7");
	    d3.selectAll(".state.list").attr("stroke","none");
	    d3.selectAll(".state."+allData[i].name[0]+allData[i].name.split(" ")[allData[i].name.split(" ").length-1])
		.attr("stroke-width",3);
	}
	else { 
	    //console.log("reference everything");
	    shiftRef = 51;
	    d3.selectAll(".state.map").attr("stroke-width","0.7");
	    d3.selectAll(".state.list").attr("stroke","none");
	        //.attr("stroke-width",3);
	}
	
	if (shiftRef !== shiftComp) {
	    shiftObj = shift(allData[shiftRef].freq,allData[shiftComp].freq,lens,words);
	    plotShift(d3.select('#shift01'),shiftObj.sortedMag.slice(0,200),
		      shiftObj.sortedType.slice(0,200),
		      shiftObj.sortedWords.slice(0,200),
		      shiftObj.sumTypes,
		      shiftObj.refH,
		      shiftObj.compH);
	}
    }

    function state_hover(d,i) { 
	// next line verifies that the data and json line up
	// console.log(d.properties.name); console.log(allData[i].name.split(" ")[allData[i].name.split(" ").length-1]); 
	shiftComp = i;
	d3.selectAll(".state."+allData[i].name[0]+allData[i].name.split(" ")[allData[i].name.split(" ").length-1]).style("fill","red");

	if (shiftRef !== shiftComp) {
	    shiftObj = shift(allData[shiftRef].freq,allData[shiftComp].freq,lens,words);
	    plotShift(d3.select('#shift01'),shiftObj.sortedMag.slice(0,200),
		      shiftObj.sortedType.slice(0,200),
		      shiftObj.sortedWords.slice(0,200),
		      shiftObj.sumTypes,
		      shiftObj.refH,
		      shiftObj.compH);
	}
	if (shiftRef !== shiftComp) { 
	    //console.log("comparison "+allData[shiftComp].name);
	    //shift(); 
	}
    }

    function state_unhover(d,i) { 
	// next line verifies that the data and json line up
	// console.log(d.properties.name); console.log(allData[i].name.split(" ")[allData[i].name.split(" ").length-1]); 
	shiftComp = i;
	console.log(".state.list."+allData[i].name[0]+allData[i].name.split(" ")[allData[i].name.split(" ").length-1]);
	d3.selectAll(".state.list."+allData[i].name[0]+allData[i].name.split(" ")[allData[i].name.split(" ").length-1])
	    .style("fill",color(allData[i].avhapps));
	d3.select(this)
         .style("fill", function() {
	    // need to get the variable map right
    	    var value = allData[i].avhapps;
	    var numWords = d3.sum(allData[i].freq); // d3.sum(d.properties.freq);
    	    if (numWords > 10000) {
    		return color(value);
    	    } else {
    		return "#ccc";
    	    }
    	});
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






