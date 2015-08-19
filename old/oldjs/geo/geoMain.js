function initializePlot() {
    timeDrop();
    loadCsv("2013");
}

allStateNames = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut"
,"Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana"
,"Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska"
,"Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio"
,"Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee"
,"Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","DC","the entire U.S."]

ignoreWords = ["severe","flood","warning","earthquake","nigga","niggas","niggaz"];

timeFrames = ["2011","2012","2013","l30","l7","l1"];
timeFrameText = ["2011","2012","2013","Last 30 Days","Last Week","Last 24 Hours"];

function timeDrop() {
    var mainMenu = d3.select("#timeSelect").selectAll("option").data(timeFrames)
        .enter().append("option")
        .property("value",function(d,i) { 
	    //console.log(d); 
	    return d; })
        .text(function(d,i) { 
	    return timeFrameText[i]; });

    d3.select("#timeSelect")
        .on("change", function() {
            key = this.selectedIndex;
            timeName = timeFrames[key];
            loadCsv(timeName); 
	});
}

function loadCsv(time) {
var csvLoadsRemaining = 4;
d3.text("data/wordScores.csv", function(text) {
    var tmp = text.split(",");
    lens = tmp.map(parseFloat);
    if (!--csvLoadsRemaining) initializePlotPlot(lens,words);
});
d3.text("data/words.csv", function(text) {
    var tmp = text.split(",");
    words = tmp;
    if (!--csvLoadsRemaining) initializePlotPlot(lens,words);
});
d3.json("data/us-states.topojson", function(data) {
    geoJson = data;
    stateFeatures = topojson.feature(geoJson,geoJson.objects.states).features;
    if (!--csvLoadsRemaining) initializePlotPlot(lens,words);
});
d3.text("data/wordCounts"+(time)+".csv", function(text) {
    tmp = text.split("\n");
    allData = Array(52);
    for (var i=0; i<51; i++) {
	allData[i] = {name: allStateNames[i],
		      rawFreq: tmp[i].split(",").map(parseFloat),
		      freq: tmp[i].split(",")};
    }
    // initialize the all data
    allData[51] = {name: allStateNames[51],
		   rawFreq: Array(allData[0].freq.length),
		   freq: Array(allData[0].freq.length),};
    for (var j=0; j<allData[0].freq.length; j++) {
	allData[51].rawFreq[j] = 0.0;
    }
    for (var i=0; i<51; i++) {
	for (var j=0; j<allData[0].freq.length; j++) {
	    allData[51].rawFreq[j] += parseFloat(allData[i].rawFreq[j]);
	    }
    }
    if (!--csvLoadsRemaining) initializePlotPlot(lens,words);
});
};

function initializePlotPlot(lens,words) {
    // draw the lens
    drawLensGeo(d3.select("#lens01"),lens);

    // initially apply the lens, and draw the shift
    for (var j=0; j<allData.length; j++) {
	for (var i=0; i<allData[j].rawFreq.length; i++) {
	    if (lens[i] > 4 && lens[i] < 6) {
		allData[j].freq[i] = 0;
            }
	    else {
		allData[j].freq[i] = allData[j].rawFreq[i];
	    }
	}
    }
    // refill the avhapps value in the main data

    // reset
    for (var j=0; j<allData.length; j++) {
	for (var i=0; i<allData[j].rawFreq.length; i++) {
	    var include = true;
	    // check if in removed word list
	    for (var k=0; k<ignoreWords.length; k++) {
		if (ignoreWords[k] == words[i]) {
		    include = false;
		    //console.log("ignored "+ignoreWords[k]);
		}
	    }
	    // check if underneath lens cover
	    if (lens[i] >= 4 && lens[i] <= 6) {
		include = false;
	    }
	    // include it, or set to 0
	    if (include) {
		allData[j].freq[i] = allData[j].rawFreq[i];
	    }
	    else { allData[j].freq[i] = 0; }
	    
	}
    }

    computeHapps();

    // draw the map
    drawMap(d3.select('#map01'))

    sortStates(d3.select('#table01'))

    shiftRef = 51;
    shiftComp = 51;
    
    // compute the shift initially
    // shiftObj = shift(allData[shiftRef].freq,allData[shiftComp].freq,lens,words);
    // plotShift(d3.select("#shift01"),shiftObj.sortedMag.slice(0,200),
    //           shiftObj.sortedType.slice(0,200),
    //           shiftObj.sortedWords.slice(0,200),
    //           shiftObj.sumTypes,
    //           shiftObj.refH,
    //           shiftObj.compH);
};

initializePlot();


function sortStates(figure) {
    // var happsVector = Array(allData.length);
    // for (var i=0; i<allData.length; i++) {
    // 	happsVector[i] = allData[i].avhapps;
    // }
    

    // do the sorting
    indices = Array(allData.length);
    for (var i = 0; i < allData.length; i++) { indices[i] = i; }
    indices.sort(function(a,b) { return Math.abs(allData[a].avhapps) < Math.abs(allData[b].avhapps) ? 1 : Math.abs(allData[a].avhapps) > Math.abs(allData[b].avhapps) ? -1 : 0; });
    var sortedStates = Array(allData.length-1);
    for (var i = 0; i < allData.length-1; i++) { sortedStates[i] = [i,indices[i],allStateNames[indices[i]]]; }
    console.log(sortedStates);

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
    figwidth = 200 - margin.left - margin.right,
    figheight = 520 - margin.top - margin.bottom,
    width = .95*figwidth,
    height = .95*figheight,
	figcenter = width/2;

// remove an old figure if it exists
figure.select(".canvas").remove();

var canvas = figure.append("svg")
    .attr("width",figwidth)
    .attr("height",figheight)
    .attr("class","canvas")

// create the x and y axis
// scale in x by width of the top word
// could still run into a problem if top magnitudes are similar
// and second word is longer
x = d3.scale.linear()
  .domain([0,1])
  .range([0,width]);

// number to load initially
numStates = 20;

// linear scale function
listy =  d3.scale.linear()
    .domain([0,numStates])
    .range([20,height]);

// zoom object for the axes
var zoom = d3.behavior.zoom()
    .y(listy) //pass linear scale function
    .scaleExtent([1,1])
    .on("zoom",zoomed);

// create the axes themselves
var axes = canvas.append("g")
    .attr("transform", "translate(" + (0.05 * figwidth) + "," +
       ((0.05) * figheight) + ")")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "main")
    .call(zoom);

// create the axes background
axes.append("svg:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "bg")
    .style({'stroke-width':'2','stroke':'rgb(0,0,0)'})
    .attr("fill", "#FCFCFC");

// axes creation functions
var create_xAxis = function() {
    return d3.svg.axis()
    .ticks(4)
    .scale(x)
    .orient("bottom"); }

// axis creation function
var create_yAxis = function() {
   return d3.svg.axis()
    .scale(listy) //linear scale function
    .orient("left"); }

// draw the axes
var yAxis = create_yAxis()
    .innerTickSize(6)
    .outerTickSize(0);

// axes.append("g")
//   .attr("class", "y axis ")
//   .attr("font-size", "14.0px")
//   .attr("transform", "(0,0)")
//   .call(yAxis);

var xAxis = create_xAxis()
    .innerTickSize(6)
    .outerTickSize(0);

// axes.append("g")
//   .attr("class", "x axis ")
//   .attr("font-size", "14.0px")
//   .attr("transform", "translate(0," + (height) + ")")
//   .call(xAxis);

d3.selectAll(".tick line").style({'stroke':'black'});

// create the clip boundary
var clip = axes.append("svg:clipPath")
  .attr("id","listclip")
  .append("svg:rect")
  .attr("x",0)
  .attr("y",0)
  .attr("width",width)
  .attr("height",height);

// now something else
var unclipped_axes = axes;
 
axes = axes.append("g")
  .attr("clip-path","url(#listclip)");

var stateG = axes.selectAll(".state")
    .data(sortedStates)
   .enter()
   .append("g")
    .attr("class",function(d,i) { return "list";})
    .attr("transform",function(d,i) { return"translate(10,"+listy(i)+")"; });
    //.attr("y",function(d,i) { return y(i); })
    //.attr("x",function(d,i) { return 70; });

stateG.append("rect")
   .attr("x",-8)
    .attr("y",-18)
    .attr("class",function(d,i) { return "state list "+d[2][0]+d[2].split(" ")[d[2].split(" ").length-1];})
     .attr("width",width-4)
    .attr("height",23)
    .attr("fill",function(d,i) {return color(allData[d[1]].avhapps); })
        .on("mousedown",state_list_clicked)
        .on("mouseover",state_list_hover)
        .on("mouseout",state_list_unhover);

stateG.append("text")
    .text(function(d,i) { return (i+1) + ": " + d[2]; })
    .style("text-anchor", "left")
.attr("font-size", "16.0px");
    //.attr("fill",function(d,i) { return color(allData[indices[i]].avhapps); } )


    function state_list_clicked(d,i) { 
	// next line verifies that the data and json line up
	// console.log(d.properties.name); console.log(allData[i].name); 

	// toggle the reference
	if (shiftRef !== d[1]) {
	    //console.log("reference "+allData[i].name);
	    shiftRef = d[1];
	    d3.selectAll(".state").attr("stroke","none");
	    d3.selectAll(".state."+d[2][0]+d[2].split(" ")[d[2].split(" ").length-1]).attr("stroke","black")
	        .attr("stroke-width",3);
	}
	else { 
	    //console.log("reference everything");
	    shiftRef = 51;
	    d3.selectAll(".state").attr("stroke","none");
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

    function state_list_hover(d,i) { 
	// next line verifies that the data and json line up
	// console.log(d.properties.name); console.log(allData[i].name); 
	shiftComp = d[1];
	d3.selectAll(".state."+d[2][0]+d[2].split(" ")[d[2].split(" ").length-1]).style("fill","red");

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

    function state_list_unhover(d,i) { 
	// next line verifies that the data and json line up
	// console.log(d.properties.name); console.log(allData[i].name); 
	shiftComp = d[1];
	console.log("unhover");
	d3.selectAll(".state.list."+d[2][0]+d[2].split(" ")[d[2].split(" ").length-1])
	    .style("fill",function(d,i) {return color(allData[d[1]].avhapps); });
	d3.selectAll(".state.map."+d[2][0]+d[2].split(" ")[d[2].split(" ").length-1]).style("fill",color(allData[d[1]].avhapps));
	// d3.selectAll(".state.map."+d[2].split(" ")[d[2].split(" ").length-1])
        //  .style("fill", function() {
	//     // need to get the variable map right
	//     var value = allData[d[1]].avhapps;
	//     var numWords = d3.sum(allData[i].freq); // d3.sum(d.properties.freq);
    	//     if (numWords > 10000) {
    	// 	return color(value);
    	//     } else {
    	// 	return "#ccc";
    	//     }
    	// });
    }


    function zoomed() {
    console.log(Math.min(0,d3.event.translate[1]));
	//d3.select(".y.axis").call(yAxis);
	d3.selectAll("g.list")
	    //.attr("transform",function(d,i) { return"translate(70,"+ Math.min(0,d3.event.translate[1]) + ")"; });
	    .attr("transform",function(d,i) { return "translate(10,"+ (Math.min(0,d3.event.translate[1])+listy(d[0])) + ")"; });
     };


};



