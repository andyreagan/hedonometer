// begin with some helper functions
// http://stackoverflow.com/a/1026087/3780153
function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// this works really well, but it's deadly slow (working max 5 elements)
// and it's coupled to jquery
// http://stackoverflow.com/a/5047712/3780153
String.prototype.width = function(font) {
    var f = font || '12px arial',
    o = $('<div>' + this + '</div>')
	.css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
	.appendTo($('body')),
    w = o.width();
    o.remove();
    return w;
}

// yup
// http://stackoverflow.com/questions/3883342/add-commas-to-a-number-in-jquery
function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
	val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

// console.log("would use "+movie+" as the default here");
// set the default here
// var movieDecoder = d3.urllib.decoder().varresult("Harry Potter (all movies together)").varname("movie");
var movieDecoder = d3.urllib.decoder().varresult(movie).varname("movie");
var movieEncoder = d3.urllib.encoder().varname("movie");

var windowDecoder = d3.urllib.decoder().varresult("2000").varname("window");

var ignoreWords = [];
var movieinfo = {};

function initializePlot() {
    movie = movieDecoder().cached;
    // console.log("not a classic");
    // hit the random api
    d3.json("http://hedonometer.org/api/v1/movies/?format=json&title__startswith="+movie,function(data) {
	var result = data.objects[0];
	// console.log(result);
	lang = result.language;
	lang = "english";
	var movietitle = d3.select("#booktitle");
	var title = movietitle.append("h2").text(result.title+" ");
	// title.append("small").text("by "+result.author);
	var movieauthor = d3.select("#bookauthor");
	var author = movietitle.append("h2").append("small").text("directed by "+result.director.map(function(d) { return d.name; }).join(" and "));
	var newignore = result.ignorewords.split(",");
	for (var i=0; i<newignore.length-1; i++) {
	    ignoreWords.push(newignore[i]);
	}
	// console.log(ignoreWords);
	// set the filename
	// movie = result.reference;
	movieref = result.reference;
	sumWords = result['length'];
	movieinfo.lang = lang;
	movieinfo.lang = "english";
	movieinfo.title = result.title;
	movieinfo.author = result.author;
	loadCsv();
    })
}

function loadCsv() {
    var csvLoadsRemaining = 4;
    var moviefile = "http://hedonometer.org/data/moviedata/timeseries/"+windowDecoder().cached+"/"+movieref+".csv";
    d3.text(moviefile, function (text) {
	var tmpminwin = 10;
	fulltimeseries = text.split(",").map(parseFloat);
	begtimeseries = fulltimeseries.slice(0,tmpminwin/2+1);
	endtimeseries = fulltimeseries.slice(fulltimeseries.length-1-tmpminwin/2,fulltimeseries.length);
	timeseries = fulltimeseries.slice(tmpminwin/2,fulltimeseries.length-tmpminwin/2);
        if (!--csvLoadsRemaining) initializePlotPlot();
    });
    d3.text("http://hedonometer.org/data/moviedata/labMT/labMTscores-"+lang+".csv", function (text) {
        var tmp = text.split("\n");
        //console.log(tmp.length);
        //console.log(tmp[tmp.length-1]);
        var lens = tmp.map(parseFloat);
        var len = lens.length - 1;
        while (!lens[len]) {
            //console.log("in while loop");
            lens = lens.slice(0, len);
            len--;
        }
	hedotools.shifter._lens(lens);
        if (!--csvLoadsRemaining) initializePlotPlot();
    });
    d3.text("http://hedonometer.org/data/moviedata/labMT/labMTwords-"+lang+".csv", function (text) {
        var tmp = text.split("\n");
        var words = tmp;
        var len = words.length - 1;
        while (!words[len]) {
            //console.log("in while loop");
            words = words.slice(0, len);
            len--;
        }
	hedotools.shifter._words(words);
        if (!--csvLoadsRemaining) initializePlotPlot();
    });
    d3.text("http://hedonometer.org/data/moviedata/labMT/labMTwordsEn-"+lang+".csv", function (text) {
        var tmp = text.split("\n");
        var words_en = tmp;
        var len = words_en.length - 1;
        while (!words_en[len]) {
            //console.log("in while loop");
            words_en = words_en.slice(0, len);
            len--;
        }
	hedotools.shifter._words_en(words_en);
        if (!--csvLoadsRemaining) initializePlotPlot();
    });
};

function initializePlotPlot(lens, words) {
    // initially apply the lens
    var minSize = parseInt(windowDecoder().cached);
    var dataSize = parseInt(windowDecoder().cached)/10;
    minWindows = Math.round(minSize / dataSize);

    lensDecoder = d3.urllib.decoder().varresult([3,7]).varname("lens");

    lensExtent = lensDecoder().cached.map(parseFloat);
    
    // ignore these on all
    var alwaysIgnore = ["nigga","niggaz","niggas","nigger"]; //["cried", "cry", "coffin"];
    for (var i=0; i<alwaysIgnore.length; i++) {
	ignoreWords.push(alwaysIgnore[i]);
    }
    refFextentDecoder = d3.urllib.decoder().varresult([0,.2]).varname("refExtent");				      
    refFextent = [Math.round(parseFloat(refFextentDecoder().cached[0])*(fulltimeseries.length-1)), Math.round(parseFloat(refFextentDecoder().cached[1])*(fulltimeseries.length-1))];
    compFextentDecoder = d3.urllib.decoder().varresult([.8,1]).varname("compExtent");			      
    compFextent = [Math.round(parseFloat(compFextentDecoder().cached[0])*(fulltimeseries.length-1)), Math.round(parseFloat(compFextentDecoder().cached[1])*(fulltimeseries.length-1))];
    
    // only draw the lens is the page is wide enough
    // this approach is terrible
    // if (parseInt(d3.select("#lens01").style("width")) > 100) {
    // 	drawLens(d3.select("#lens01"), lens);
    // }

    // console.log(timeseries);
    // drawBookTimeseries(d3.select("#chapters03"),timeseries);
    hedotools.booktimeseries.setFigure(d3.select("#chapters03"));
    hedotools.booktimeseries.setData(fulltimeseries);
    hedotools.booktimeseries.plot();
    hedotools.booktimeseries.drawAnnotations();
    hedotools.booktimeseries.showLine(true);
    selectChapterTop(d3.select("#chapters01"), timeseries.length);
    selectChapter(d3.select("#chapters02"), timeseries.length);
};

// make the whole thing
initializePlot();

var allDataRaw;
// console.log(bookref);

var opts = {
    lines: 13, // The number of lines to draw
    length: 5, // The length of each line
    width: 2, // The line thickness
    radius: 3, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
};

var loadwordshiftdata = function() {
// function loadwordshiftdata() {
    var target = document.getElementById("popupbutton");
    var spinner = new Spinner(opts).spin(target);

    var moviefile = "http://hedonometer.org/data/moviedata/word-vectors/"+windowDecoder().cached+"/"+movieref+".csv";
    d3.text(moviefile, function (text) {
        tmp = text.split("\n");

        // build the full data, terrible
	// declared global before this function
        allDataRaw = Array(tmp[0].split(',').length);
        for (var i = 0; i < tmp[0].split(',').length; i++) {
	    allDataRaw[i] = Array(tmp.length);
        }
        for (var i = 0; i < tmp.length; i++) {
	    var tmpTmp = tmp[i].split(',');
	    for (var j = 0; j < tmpTmp.length; j++) {
                allDataRaw[j][i] = parseFloat(tmpTmp[j]);
	    }
        }
	// alert
	// if (sumWords < 10000) { alert("There are too few words in this movie for the hedonometer to accurately generate a timeseries. Currently we need at least 10000 words, and this movie has "+sumWords+"."); }

	// console.log("done loading");
	spinner.stop();
	d3.select("#popupbutton").attr("disabled",null);
	d3.select("#lensbutton").attr("disabled",null);
    });
};

$("#loaddatabutton").on("click",loadwordshiftdata);
$("#loadalldatabutton").on("click",loadwordshiftdata);

function beginannotation() {
    // alert("feature coming soon!");

    // highlight all of the high/low points on the timeseries
    // when they're clicked, create a form to enter the description, which the cursor moves to when the point is selected
    // create a view to accept the form...in the background.
    // (make the user refresh to see a new view)
    // either use a logo next to all annotated points, or display the actual text
    // be able to access all of the annotations in the database...they do need a model to be created for them.

    swap("annotationPaper","shiftingPaper");

    var triggered = 0;
    $("#inputSuccess4").keypress(function(d) {
	// console.log( "Handler for .keypress() called." );
	// checking that each word is in the movie's words
	var sampleWordList = ["in","the","book"];
	// split the input
	triggered++;
	// console.log(this.value);
	var that = this;
	setTimeout(delayedcheck,1000);
	setTimeout(delayedcheck,2000);
	setTimeout(delayedcheck,3000);
	setTimeout(delayedcheck,4000);
	setTimeout(delayedcheck,5000);
	// if (this.value.length > 0) {
	if (triggered == 1) {
    	    d3.select("#annotationInput").classed("has-error",false);
    	    d3.select("#annotationInput").classed("has-success",true);
    	    d3.select("#annotationInputIcon").classed("glyphicon-remove",false);
    	    d3.select("#annotationInputIcon").classed("glyphicon-ok",true);
	}

    });

    d3.select("#beginannotationbutton").remove();
    d3.select("#annotationform").attr("style","display: block");
    d3.select("#windowInput").attr("value",windowDecoder().cached);
    hedotools.booktimeseries.highlightExtrema();
}

var swap = function(fromId, toId){
    var temp = $("#"+toId).html();
    $("#"+toId).empty().html($("#"+fromId).html());
    $("#"+fromId).empty().html(temp);
    document.getElementById(fromId).setAttribute("id",toId)
    document.getElementById(toId).setAttribute("id",fromId)
}

$("#beginannotationbutton").on("click",beginannotation);



var delayedcheck = function(d) {
    var words = document.getElementById("inputSuccess4").value.split(" ");
    // $("#inputSuccess4").value.split(" ");
    // var words = d.value.split(" ");
    // console.log(words);
    if (words.length > 6) {
	if (words[6] !== "") {
    	    // console.log("too many words");
    	    d3.select("#annotationInput").classed("has-error",true);
    	    d3.select("#annotationInput").classed("has-success",false);
    	    d3.select("#inputSuccess4").classed("glyphicon-remove",true);
    	    d3.select("#inputSuccess4").classed("glyphicon-ok",false);
	    d3.select("#inputSuccess4col").selectAll(".toomany").remove();
	    d3.select("#inputSuccess4col").append("span").attr("class","help-block toomany").text("Too many words!");
	}
	else {
	    // we're in the clear!
	    d3.select("#inputSuccess4col").selectAll(".toomany").remove();
	    d3.select("#annotationInput").classed("has-error",false);
    	    d3.select("#annotationInput").classed("has-success",true);
    	    d3.select("#annotationInputIcon").classed("glyphicon-remove",false);
    	    d3.select("#annotationInputIcon").classed("glyphicon-ok",true);
	    // show the submit button
	    d3.select("#tweetCheckDiv").selectAll(".tweettext").remove();
	    // console.log("The tweet would be \"@hedonometer: "+"67%"+" through "+"Harry Potter (all movies together)"+", "+document.getElementById("inputSuccess4").value+"\"");
	    d3.select("#tweetCheckDiv").append("span").attr("class","help-block tweettext").text("The tweet would be \"@hedonometer: "+"67%"+" through "+"Harry Potter (all movies together)"+", "+document.getElementById("inputSuccess4").value+"\"");
	}
    }
    else {
	d3.select("#inputSuccess4col").selectAll(".toomany").remove();
	d3.select("#annotationInput").classed("has-error",false);
    	d3.select("#annotationInput").classed("has-success",true);
    	d3.select("#annotationInputIcon").classed("glyphicon-remove",false);
    	d3.select("#annotationInputIcon").classed("glyphicon-ok",true);
	// show the submit button
	d3.select("#tweetCheckDiv").selectAll(".tweettext").remove();
	// console.log("The tweet would be \"@hedonometer: "+"67%"+" through "+"Harry Potter (all movies together)"+", "+document.getElementById("inputSuccess4").value+"\"");
	d3.select("#tweetCheckDiv").append("span").attr("class","help-block tweettext").text("The tweet would be \"@hedonometer: "+document.getElementById("inputSuccess3").value+" through "+movie+", "+document.getElementById("inputSuccess4").value+"\"");
    }
    if (document.getElementById("inputSuccess4").value === "") {
	d3.select("#annotationInput").classed("has-error",false);
    	d3.select("#annotationInput").classed("has-success",true);
    	d3.select("#annotationInputIcon").classed("glyphicon-remove",false);
    	d3.select("#annotationInputIcon").classed("glyphicon-ok",true);
	d3.select("#tweetCheckDiv").selectAll(".tweettext").remove();
    }
    // var wordsmissing = [];
    // for (var i=0; i<words.length; i++) {
    // 	var wordfound = false;
    // 	for (var j=0; j<sampleWordList.length; j++) {
    // 	    if ( words[i] === sampleWordList[j] ) {
    // 		wordfound = true;
    // 		break;
    // 	    }
    // 	}
    // 	if (!wordfound) {
    // 	    wordsmissing.push(words[i]);
    // 	}
    // }
    // console.log(wordsmissing);
    // if (wordsmissing.length > 0) {
    // 	d3.select("#annotationInput").classed("has-error",true);
    // 	d3.select("#annotationInput").classed("has-success",false);
    // 	d3.select("#inputSuccess4").classed("glyphicon-remove",true);
    // 	d3.select("#inputSuccess4").classed("glyphicon-ok",false);
    // }
    // else {
    // 	d3.select("#annotationInput").classed("has-error",false);
    // 	d3.select("#annotationInput").classed("has-success",true);
    // 	d3.select("#inputSuccess4").classed("glyphicon-remove",false);
    // 	d3.select("#inputSuccess4").classed("glyphicon-ok",true);
    // }
}

var popupwordshift = function() {
    // initialize new values
    var refF = Array(allDataRaw[0].length);
    var compF = Array(allDataRaw[0].length);
    // fill them with 0's
    for (var i = 0; i < allDataRaw[0].length; i++) {
        refF[i] = 0;
        compF[i] = 0;
    }
    // loop over each slice of data
    for (var i = 0; i < allDataRaw[0].length; i++) {
        // grab the shift vectors
	for (var k = refFextent[0]; k < refFextent[1]-1; k++) {
            refF[i] += parseFloat(allDataRaw[k][i]);
	}
	for (var k = compFextent[0]; k < compFextent[1]-1; k++) {
            compF[i] += parseFloat(allDataRaw[k][i]);
	}
    }

    hedotools.shifter._refF(refF);
    hedotools.shifter._compF(compF);
    hedotools.shifter.stop();
    hedotools.shifter.shifter();
    var happysad = hedotools.shifter._compH() > hedotools.shifter._refH() ? "happier" : "less happy";
    var shifttext = ["Why comparison section is "+happysad+" than reference section:","Reference section's happiness: "+hedotools.shifter._refH().toFixed(2),"Comparison section's happiness: "+hedotools.shifter._compH().toFixed(2)]

    hedotools.shifter.setfigure(d3.select('#moveshifthere')).setText(shifttext);
    hedotools.shifter.setWidth(540);
    hedotools.shifter.plot();

    // show the modal a bit early, so that it gets the size right
    // I did, but that didn't help too much
    $('#myModal').modal('show')
};


$("#popupbutton").on("click",popupwordshift);

d3.select("#changeMe").attr("href","/twitter/login/?next="+window.location.href);
d3.select("#changeMeAlso").attr("action",window.location.href);

d3.select("#window500").attr("href",window.location.origin + window.location.pathname + "?window=500");
d3.select("#window1000").attr("href",window.location.origin + window.location.pathname + "?window=1000");
d3.select("#window2000").attr("href",window.location.origin + window.location.pathname + "?window=2000");
d3.select("#window5000").attr("href",window.location.origin + window.location.pathname + "?window=5000");
d3.select("#window"+windowDecoder().cached).classed("active",true);

// api access method for the movie API
var substringMatcher = function() {
    return function findMatches(q,cb) {
        var matches, substringRegex;
        matches = [];
	d3.json("http://hedonometer.org/api/v1/movies/?format=json&title__icontains="+q,function(data) {
	    var result = data.objects;
	    var newresult = [];
	    for (var i=0; i<result.length; i++) {
		newresult.push({value: result[i].title})
	    }
            cb(newresult);
	})
    };
};

// use jquery to build the book search
// (and twitter typeahead)
$(document).ready(function() {
    // send a random movie
    $('#randombook').on("click",function() {
	d3.json("http://hedonometer.org/api/v1/randommovie/?format=json",function(data) {
	    var result = data.objects[0];
	    window.location.replace("/movies/"+result.title+"/");
	})	
    });
    // the default search
    $("#wordsearch").typeahead(
        {
            hint: false,
            highlight: true,
            minLength: 2,
        },
        {
            name: "books",
            source: substringMatcher()
        });
}).on("typeahead:selected",function(event,sugg,dataset) {
    // note that the complicated logic here is because
    // the title of some books contians "by" in them
    window.location.replace("/movies/"+sugg.value+"/");
});

