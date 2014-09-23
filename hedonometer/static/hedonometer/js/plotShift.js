// make the plot
function plotShift(figure,sortedMag,sortedType,sortedWords,sortedWordsEn,sumTypes,refH,compH) {
    /* plot the shift

       -take a d3 selection, and draw the shift SVG on it
       -requires sorted vectors of the shift magnitude, type and word
       for each word

    */

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
    figwidth = parseInt(d3.select('#figure01').style('width')) - margin.left - margin.right,
    figheight = 600 - margin.top - margin.bottom,
    width =  .775*figwidth,
    height = .8875*figheight,
    figcenter = width/2,
    yHeight = 101,
    clipHeight = 100,
    barHeight = 95,
    numWords = 24,
    shiftTypeSelect = false,
    leftOffsetStatic = 0.125*figwidth;

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
    var x = d3.scale.linear()
	.domain([-Math.abs(sortedMag[0]),Math.abs(sortedMag[0])])
	.range([(sortedWords[0].length+3)*9, width-(sortedWords[0].length+3)*9]);

    // linear scale function
    var y =  d3.scale.linear()
	.domain([numWords,1])
	.range([height, yHeight]); 

    // zoom object for the axes
    var zoom = d3.behavior.zoom()
	.y(y) //pass linear scale function
    //.translate([10,10])
	.scaleExtent([1,1])
	.on("zoom",zoomed);

    // create the axes themselves
    var axes = canvas.append("g")
	.attr("transform", "translate(" + (0.125 * figwidth) + "," +
	      ((1 - 0.215 - 0.775) * figheight) + ")")
	.attr("width", width)
	.attr("height", height)
	.attr("class", "main")
	.call(zoom);

    // create the axes background
    var bgrect = axes.append("svg:rect")
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
	    .scale(y) //linear scale function
	    .orient("left"); }

    // draw the axes
    var yAxis = create_yAxis()
	.innerTickSize(6)
	.outerTickSize(0);

    axes.append("g")
	.attr("class", "y axis ")
	.attr("font-size", "14.0px")
	.attr("transform", "translate(0,0)")
	.call(yAxis);

    var xAxis = create_xAxis()
	.innerTickSize(6)
	.outerTickSize(0);

    axes.append("g")
	.attr("class", "x axis ")
	.attr("font-size", "14.0px")
	.attr("transform", "translate(0," + (height) + ")")
	.call(xAxis);

    d3.selectAll(".tick line").style({'stroke':'black'});

    // create the clip boundary
    var clip = axes.append("svg:clipPath")
	.attr("id","clip")
	.append("svg:rect")
	.attr("x",0)
	.attr("y",clipHeight)
	.attr("width",width)
	.attr("height",height-clipHeight);

    // now something else
    var unclipped_axes = axes;

    // draw the summary things
    var sepline = unclipped_axes.append("line")
	.attr("x1",0)
	.attr("x2",width)
	.attr("y1",barHeight)
	.attr("y2",barHeight)
	.style({"stroke-width" : "2", "stroke": "black"});

    var maxShiftSum = Math.max(Math.abs(sumTypes[1]),Math.abs(sumTypes[2]),sumTypes[0],sumTypes[3]);

    var topScale = d3.scale.linear()
	.domain([-maxShiftSum,maxShiftSum])
	.range([width*.1,width*.9]);

    // define the RHS summary bars so I can add if needed
    var summaryArray = [sumTypes[3],sumTypes[0],sumTypes[3]+sumTypes[1],d3.sum(sumTypes)];

    unclipped_axes.selectAll(".sumrectR")
	.data(summaryArray)
	.enter()
	.append("rect")
	.attr("fill", function(d,i) { 
	    if (i==0) { return "#FFFF4C"; } 
	    else if (i==1) { return "#B3B3FF"; } 
	    else if (i==2) {
		// if positive, the postive increasing words won, color dark yellow
		if (d>0) { return "#FFFF4C";}
		// positive decreasing words won, color light yellow
		else { return "#FFFFB3";}
	    }
	    else {
		// always dark grey
		return "#272727";
	    } })
	.attr("class", "sumrectR")
	.attr("x",function(d,i) { 
            if (d>0) { return figcenter; } 
            else { return topScale(d)} } )
        // don't move the fourth bar down as much
	.attr("y",function(d,i) { if (i<3) { return i*22+7;} else { return i*22+1;} } )
	.style({'opacity':'0.7','stroke-width':'1','stroke':'rgb(0,0,0)'})
	.attr("height",function(d,i) { return 17; } )
	.attr("width",function(d,i) { if (d>0) {return topScale(d)-figcenter;} else {return figcenter-topScale(d); } } )
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
		d3.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y",function(d,i) { return y(i+1); }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y",function(d,i) { return y(i+1); }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y",function(d,i) { return y(i+1); }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y",function(d,i) { return y(i+1); }).attr("transform","translate(0,0)");
		d3.selectAll("text.shifttext.zero").transition().duration(1000).attr("y",function(d,i) { return y(i+1)+11; }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("text.shifttext.one").transition().duration(1000).attr("y",function(d,i) { return y(i+1)+11; }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("text.shifttext.two").transition().duration(1000).attr("y",function(d,i) { return y(i+1)+11; }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("text.shifttext.three").transition().duration(1000).attr("y",function(d,i) { return y(i+1)+11; }).attr("transform","translate(0,0)");
	    }
	    else if (i==1) {
		d3.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y",function(d,i) { return y(i+1); }).attr("transform","translate(0,0)");
		d3.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y",function(d,i) { return y(i+1); }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y",function(d,i) { return y(i+1); }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y",function(d,i) { return y(i+1); }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("text.shifttext.zero").transition().duration(1000).attr("y",function(d,i) { return y(i+1)+11; }).attr("transform","translate(0,0)");
		d3.selectAll("text.shifttext.one").transition().duration(1000).attr("y",function(d,i) { return y(i+1)+11; }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("text.shifttext.two").transition().duration(1000).attr("y",function(d,i) { return y(i+1)+11; }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("text.shifttext.three").transition().duration(1000).attr("y",function(d,i) { return y(i+1)+11; }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
	    }
	} );

    unclipped_axes.selectAll(".sumtextR")
	.data([sumTypes[3],sumTypes[0],d3.sum(sumTypes)])
	.enter()
	.append("text")
	.attr("class", "sumtextR")
	.style("text-anchor",function(d,i) { if (d>0) {return "start";} else {return "end";} })
	.attr("y",function(d,i) { if (i<2) {return i*22+22;} else if ((sumTypes[3]+sumTypes[1])*(sumTypes[0]+sumTypes[2])<0) {return i*22+39; } else {return i*22+30; } })
	.text(function(d,i) { if (i == 0) {return "\u2211+\u2191";} if (i==1) { return"\u2211-\u2193";} else { return "\u2211";} } )
    // push to the side of d
	.attr("x",function(d,i) { return topScale(d)+5*d/Math.abs(d); });

    var summaryArray = [sumTypes[1],sumTypes[2],sumTypes[0]+sumTypes[2]];

    unclipped_axes.selectAll(".sumrectL")
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
			return topScale(d)-(figcenter-topScale((sumTypes[3]+sumTypes[1])));
		    }
		} 
		else { 
		    if (d>0) {return figcenter} 
		    else { return topScale(d)} }
	    }
	})
	.attr("y",function(d,i) { return i*22+7; } )
	.style({'opacity':'0.7','stroke-width':'1','stroke':'rgb(0,0,0)'})
	.attr("height",function(d,i) { return 17; } )
	.attr("width",function(d,i) { if (d>0) {return topScale(d)-figcenter;} else {return figcenter-topScale(d); } } )
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
		d3.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y",function(d,i) { return y(i+1); }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y",function(d,i) { return y(i+1); }).attr("transform","translate(0,0)");
		d3.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y",function(d,i) { return y(i+1); }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y",function(d,i) { return y(i+1); }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("text.shifttext.zero").transition().duration(1000).attr("y",function(d,i) { return y(i+1)+11; }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("text.shifttext.one").transition().duration(1000).attr("y",function(d,i) { return y(i+1)+11; }).attr("transform","translate(0,0)");
		d3.selectAll("text.shifttext.two").transition().duration(1000).attr("y",function(d,i) { return y(i+1)+11; }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("text.shifttext.three").transition().duration(1000).attr("y",function(d,i) { return y(i+1)+11; }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
            }
            else if (i==1) {
		d3.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y",function(d,i) { return y(i+1); }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y",function(d,i) { return y(i+1); }).attr("transform","translate(0,0)");
		d3.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y",function(d,i) { return y(i+1); }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y",function(d,i) { return y(i+1); }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("text.shifttext.zero").transition().duration(1000).attr("y",function(d,i) { return y(i+1)+11; }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("text.shifttext.two").transition().duration(1000).attr("y",function(d,i) { return y(i+1)+11; }).attr("transform","translate(0,0)");
		d3.selectAll("text.shifttext.one").transition().duration(1000).attr("y",function(d,i) { return y(i+1)+11; }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
		d3.selectAll("text.shifttext.three").transition().duration(1000).attr("y",function(d,i) { return y(i+1)+11; }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else { return "translate(500,0)"; } });
            }
	} );

    unclipped_axes.selectAll(".sumtextL")
	.data([sumTypes[1],sumTypes[2]])
	.enter()
	.append("text")
	.attr("class", "sumtextL")
	.style("text-anchor", "end")
	.attr("y",function(d,i) { return i*22+22; } )
	.text(function(d,i) { if (i == 0) {return "\u2211+\u2193";} else { return"\u2211-\u2191";} })
	.attr("x",function(d,i) { return topScale(d)-5; });
    
    axes = axes.append("g")
	.attr("clip-path","url(#clip)");

    var ylabel = canvas.append("text")
	.text("Word Rank")
	.attr("class","axes-text")
	.attr("x",(figwidth-width)/4)
	.attr("y",figheight/2+30)
	.attr("font-size", "16.0px")
	.attr("fill", "#000000")
	.attr("transform", "rotate(-90.0," + (figwidth-width)/4 + "," + (figheight/2+30) + ")");

    var xlabel = canvas.append("text")
	.text("Per word average happiness shift")
	.attr("class","axes-text")
	.attr("x",width/2+(figwidth-width)/2)
	.attr("y",3*(figheight-height)/4+height)
	.attr("font-size", "16.0px")
	.attr("fill", "#000000")
	.attr("style", "text-anchor: middle;");

    if (compH >= refH) {
	var happysad = "happier";
    }
    else { 
	var happysad = "less happy";
    }

    d3.selectAll("p.sumtext")
	.data(["Why ",refH,compH])
	.text(function(d,i) { 
	    if (i==0) {
		// if there are names of the texts, put them here
		if (Math.abs(refH-compH) < 0.01) { return "How the words of reference and comparison differ";}
		else { return d+"comparison "+" is "+happysad+" than "+"reference ";}
	    }
	    else if (i==1) {
		return "Reference happiness " + (d.toFixed(2));
	    }
	    else {
		return "Comparison happiness " + (d.toFixed(2));
	    }});
	// .attr("x",width/2+(figwidth-width)/2)
	// .attr("y",function(d,i) { return i*20+13 })
	// .attr("font-size", "16.0px")
	// .attr("fill", "#000000")
	// .attr("style", "text-anchor: middle;");

    intStr = ["zero","one","two","three"];

    axes.selectAll("rect.shiftrect")
	.data(sortedMag)
	.enter()
	.append("rect")
	.attr("fill", function(d,i) { if (sortedType[i] == 2) {return "#4C4CFF";} else if (sortedType[i] == 3) {return "#FFFF4C";} else if (sortedType[i] == 0) {return "#B3B3FF";} else { return "#FFFFB3"; }})
	.attr("class", function(d,i) { return "shiftrect "+intStr[sortedType[i]]; })
	.attr("x",function(d,i) { 
            if (d>0) { 
                return figcenter;
            } 
            else { return x(d)} }
             )
	.attr("y",function(d,i) { return y(i+1); } )
	.style({'opacity':'0.7','stroke-width':'1','stroke':'rgb(0,0,0)'})
	.attr("height",function(d,i) { return 15; } )
	.attr("width",function(d,i) { if (d>0) {return x(d)-figcenter;} else {return figcenter-x(d); } } )
	.on('mouseover', function(d){
            var rectSelection = d3.select(this).style({opacity:'1.0'});
	})
	.on('mouseout', function(d){
            var rectSelection = d3.select(this).style({opacity:'0.7'});
	});

    // flipVector keeps track of the translation state
    // it is one longer than the words, the last entry being what
    // everything will be set to on "translate all"
    var flipVector = Array(sortedWords.length+1);
    for (var i=0; i<flipVector.length; i++) { flipVector[i] = 0; }
    flipVector[flipVector.length-1] = 1;

    axes.selectAll("text.shifttext")
	.data(sortedMag)
	.enter()
	.append("text")
    //.attr("fill", function(d,i) { if (sortedType[i] == 0 || sortedType[i] == 2) {return "blue";} else { return "yellow"; }})
	.attr("class", function(d,i) { return "shifttext "+intStr[sortedType[i]]; })
	.style("text-anchor", function(d,i) { if (sortedMag[i] < 0) { return "end";} else { return "start";}})
	.attr("y",function(d,i) { return y(i+1)+11; } )
	.text(function(d,i) { if (sortedType[i] == 0) {tmpStr = "-\u2193";} else if (sortedType[i] == 1) {tmpStr = "\u2193+";}
			      else if (sortedType[i] == 2) {tmpStr = "\u2191-";} else {tmpStr = "+\u2191";}
			      if (sortedMag[i] < 0) {return tmpStr.concat(sortedWords[i]);} else { return sortedWords[i].concat(tmpStr); } })
	.attr("x",function(d,i) { if (d>0) {return x(d)+2;} else {return x(d)-2; } } )
	.on("click",function(d,i){
	    // goal is to toggle translation
	    // need translation vector
	    //console.log(flipVector[i]);
	    if (flipVector[i]) { 
		if (sortedType[i] == 0) {tmpStr = "-\u2193";} else if (sortedType[i] == 1) {tmpStr = "\u2193+";}
		else if (sortedType[i] == 2) {tmpStr = "\u2191-";} else {tmpStr = "+\u2191";}
		if (sortedMag[i] < 0) { tmpStr = tmpStr.concat(sortedWords[i]);} else { tmpStr = sortedWords[i].concat(tmpStr); } 
		flipVector[i] = 0;}
	    else {
		if (sortedType[i] == 0) {tmpStr = "-\u2193";} 
		else if (sortedType[i] == 1) {tmpStr = "\u2193+";}
		else if (sortedType[i] == 2) {tmpStr = "\u2191-";} 
		else {tmpStr = "+\u2191";}
		if (sortedMag[i] < 0) { tmpStr = tmpStr.concat(sortedWordsEn[i]);} 
		else { tmpStr = sortedWordsEn[i].concat(tmpStr); } 
		flipVector[i] = 1; }
	    //console.log(tmpStr);
	    newText = d3.select(this).text(tmpStr);
	    //console.log(d);
	    //console.log(i);
	});

    function resetButton() {
	d3.selectAll(".resetbutton").remove();

	var resetGroup = canvas.append("g")
	     .attr("transform","translate("+(8)+","+(clipHeight+52)+") rotate(-90)")
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
	    .attr("font-size", "11.0px")

	resetGroup.append("rect")
	    .attr("x",0)
	    .attr("y",0)
	    .attr("rx",3)
	    .attr("ry",3)
	    .attr("width",48)
	    .attr("height",19)
	    .attr("fill","white") //http://www.w3schools.com/html/html_colors.asp
	    .style({"opacity": "0.0"})
	    .on("click",function() { 
		//console.log("clicked reset");
		shiftTypeSelect = false;		
		axes.selectAll("rect.shiftrect").transition().duration(1000)
		    .attr("y", function(d,i) { return y(i+1) })
		    .attr("transform","translate(0,0)")
	            .attr("x",function(d,i) { if (d<0) { return x(d);} 
					      else { return figcenter; }});
		axes.selectAll("text.shifttext").transition().duration(1000)
		    .attr("y", function(d,i) { return y(i+1)+11; } )
	            .attr("x",function(d,i) { if (d<0) { return x(d)-2; }
					      else { return x(d)+2; } })
		    .attr("transform","translate(0,0)");
		d3.selectAll(".resetbutton").remove();
	    });
    }

    function translateButton() {
	var translateGroup = canvas.append("g")
	    .attr("class","translatebutton")
	    .attr("transform","translate("+(8)+","+(clipHeight-5)+") rotate(-90)");

	translateGroup.append("rect")
	    .attr("x",0)
	    .attr("y",0)
	    .attr("rx",3)
	    .attr("ry",3)
	    .attr("width",75)
	    .attr("height",19)
	    .attr("fill","#F0F0F0") //http://www.w3schools.com/html/html_colors.asp
	    .style({'stroke-width':'0.5','stroke':'rgb(0,0,0)'});

	translateGroup.append("text")
	    .text("Translate All")
	    .attr("x",5)
	    .attr("y",13)
	    .attr("font-size", "11.0px")

	translateGroup.append("rect")
	    .attr("x",0)
	    .attr("y",0)
	    .attr("rx",3)
	    .attr("ry",3)
	    .attr("width",75)
	    .attr("height",19)
	    .attr("fill","white") //http://www.w3schools.com/html/html_colors.asp
	    .style({"opacity": "0.0"})
	    .on("click",function() { 
		for (var i=0; i<flipVector.length-1; i++) { flipVector[i] = flipVector[flipVector.length-1]; }
		flipVector[flipVector.length-1] = (flipVector[flipVector.length-1] + 1) % 2;
		console.log("clicked translate");

		axes.selectAll("text.shifttext").transition().duration(1000)
		    .text(function(d,i) { 
			// goal is to toggle translation
			// need translation vector
			//console.log(flipVector[i]);
			if (flipVector[i]) { 
			    if (sortedType[i] == 0) {tmpStr = "-\u2193";} 
			    else if (sortedType[i] == 1) {tmpStr = "\u2193+";}
			    else if (sortedType[i] == 2) {tmpStr = "\u2191-";} 
			    else {tmpStr = "+\u2191";}
			    if (sortedMag[i] < 0) { tmpStr = tmpStr.concat(sortedWordsEn[i]);} 
			    else { tmpStr = sortedWordsEn[i].concat(tmpStr); } 
			}
			else {
			    if (sortedType[i] == 0) {tmpStr = "-\u2193";} else if (sortedType[i] == 1) {tmpStr = "\u2193+";}
			    else if (sortedType[i] == 2) {tmpStr = "\u2191-";} else {tmpStr = "+\u2191";}
			    if (sortedMag[i] < 0) { tmpStr = tmpStr.concat(sortedWords[i]);} else { tmpStr = sortedWords[i].concat(tmpStr); } 
			}
			return tmpStr;
		    });
	        });
    };

    translateButton();

    function zoomed() {
	if (shiftTypeSelect) {
	    for (var j=0; j<4; j++) {
		axes.selectAll("rect.shiftrect."+intStr[j]).attr("y", function(d,i) { return y(i+1) });
		axes.selectAll("text.shifttext."+intStr[j]).attr("y", function(d,i) { return y(i+1)+11 }); }
	}
	else {
	    axes.selectAll("rect.shiftrect").attr("y", function(d,i) { return y(i+1) });
	    axes.selectAll("text.shifttext").attr("y", function(d,i) { return y(i+1)+11 });
	}
	d3.select(".y.axis").call(yAxis);
	d3.selectAll(".tick line").style({'stroke':'black'});
    };

    //console.log(leftOffsetStatic+width);

    var credit = axes.insert("text","rect")
        .attr("class","credit")
	.text("by Andy Reagan")
        .attr("fill","#B8B8B8")
	.attr("x",width-7)
	.attr("y",527)
	.attr("font-size", "8.0px")
        .style({"text-anchor": "end"});

    d3.select(window).on("resize.shiftplot",resizeshift);
    
    function resizeshift() {
	figwidth = parseInt(d3.select("#figure01").style('width')) - margin.left - margin.right,
	width = .775*figwidth
	figcenter = width/2;

	canvas.attr("width",figwidth);

	x.range([(sortedWords[0].length+3)*9, width-(sortedWords[0].length+3)*9]);
	topScale.range([width*.1,width*.9]);

	bgrect.attr("width",width);
	//axes.attr("transform", "translate(" + (0.125 * figwidth) + "," +
	//      ((1 - 0.125 - 0.775) * figheight) + ")");
	
	// mainline.attr("d",line);

	// fix the x axis
	canvas.select(".x.axis").call(xAxis);

	clip.attr("width",width);

	// get the x label
	xlabel.attr("x",(leftOffsetStatic+width/2));

	// the andy reagan credit
	credit.attr("x",width-7);

	// line separating summary
	sepline.attr("x2",width);

	// all of the lower shift text
	axes.selectAll("text.shifttext").attr("x",function(d,i) { if (d>0) {return x(d)+2;} else {return x(d)-2; } } );

    unclipped_axes.selectAll(".sumrectR")
	.attr("x",function(d,i) { 
            if (d>0) { return figcenter; } 
            else { return topScale(d)} } )
	.attr("width",function(d,i) { if (d>0) {return topScale(d)-figcenter;} else {return figcenter-topScale(d); } } );

    unclipped_axes.selectAll(".sumtextR")
	.attr("x",function(d,i) { return topScale(d)+5*d/Math.abs(d); });


    unclipped_axes.selectAll(".sumrectL")
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
			return topScale(d)-(figcenter-topScale((sumTypes[3]+sumTypes[1])));
		    }
		} 
		else { 
		    if (d>0) {return figcenter} 
		    else { return topScale(d)} }
	    }
	})
	.attr("width",function(d,i) { if (d>0) {return topScale(d)-figcenter;} else {return figcenter-topScale(d); } } );

    unclipped_axes.selectAll(".sumtextL")
	.attr("x",function(d,i) { return topScale(d)-5; });

    axes.selectAll("rect.shiftrect")
	.attr("x",function(d,i) { 
            if (d>0) { 
                return figcenter;
            } 
            else { return x(d)} }
             )
	.attr("width",function(d,i) { if (d>0) {return x(d)-figcenter;} else {return figcenter-x(d); } } );

	// //create_xAxis.scale(x);
	// //xAxisHandle.call(xAxis);
	// canvas.select(".x.axis").call(xAxis);

	// canvas.selectAll(".distrect").attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
	
	// // xlabel.attr("x",(leftOffsetStatic+width/2));

	// d3.selectAll(".tick line").style({'stroke':'black'});

	// // //brushX.range([figwidth*.125,width+figwidth*.125]);
	// brushX.range([leftOffsetStatic,leftOffsetStatic+width]);
	// brush.x(brushX);
	// d3.select(".lensbrush") //.transition()
	//     .call(brush.extent(lensExtent))
	//     .call(brush.event);
	//brushing();
	//brush.event();
    }
};









