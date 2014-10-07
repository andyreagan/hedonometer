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

// set the default here
var bookDecoder = d3.urllib.decoder().varresult("Frankenstein,%20Or%20the%20Modern%20Prometheus").varname("book");
var bookEncoder = d3.urllib.encoder().varname("book");

// this guy is for the catalog card infomation
var bookinfo = {};

function initializePlot() {
    book = bookDecoder().cached;
    // hit the random api
    if (book === 'random') {
	d3.json("http://hedonomter.org/api/v1/randombook/?format=json",function(data) {
	    var result = data.objects[0];
	    // console.log(result);
	    lang = result.language;
	    var booktitle = d3.select("#booktitle");
	    var title = booktitle.append("h2").text(result.title+" ");
	    bookEncoder.varval(result.title);
	    // title.append("small").text("by "+result.author);
	    var bookauthor = d3.select("#bookauthor");
	    var author = booktitle.append("h2").append("small").text("by "+result.author);
	    var newignore = result.ignorewords.split(",");
	    hedotools.shifter.ignore(newignore);
	    if ( result.wiki.length > 0 ) {
		title.append("small").append("a").attr("href",result.wiki).attr("target","_blank").text("(wiki)");
	    }
	    // set the filename
	    book = result.reference;
	    sumWords = result['length'];
	    bookinfo.lang = lang;
	    bookinfo.title = result.title;
	    bookinfo.author = result.author;
	    loadCsv();
	})
    }
    else {
	d3.json("http://hedonometer.org/api/v1/gutenberg/?format=json&title__exact="+book,function(data) {
	    var result = data.objects[0];
	    console.log(result);
	    lang = result.language;
	    var booktitle = d3.select("#booktitle");
	    var title = booktitle.append("h2").text(result.title+" ");
	    // title.append("small").text("by "+result.author);
	    var bookauthor = d3.select("#bookauthor");
	    var author = booktitle.append("h2").append("small").text("by "+result.author);
	    var newignore = result.ignorewords.split(",");
	    hedotools.shifter.ignore(newignore);
	    if ( result.wiki.length > 0 ) {
		title.append("small").append("a").attr("href",result.wiki).attr("target","_blank").text("(wiki)");
	    }
	    // set the filename
	    book = result.reference;
	    sumWords = result['length'];
	    bookinfo.lang = lang;
	    bookinfo.title = result.title;
	    bookinfo.author = result.author;
	    loadCsv();
	})
    }
}

function loadCsv() {
    var csvLoadsRemaining = 4;
    var bookfile = "http://hedonometer.org/data/bookdata/processed/"+book+".csv";
    d3.text(bookfile, function (text) {
        tmp = text.split("\n");
        // kill extra rows
        var len = tmp.length - 1;
        //while (!tmp[len]) { console.log("in while loop"); tmp = tmp.slice(0,len); len--; } p
        // build the full data, terrible
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
	// console.log(allDataRaw);
	if (sumWords < 10000) { alert("There are too few words in this book for the hedonometer to accurately generate a timeseries. Currently we need at least 10000 words, and this book has "+sumWords+"."); }
        //console.log(d3.sum(allDataRaw[0]));
        if (!--csvLoadsRemaining) initializePlotPlot();
    });
    d3.text("http://hedonometer.org/data/bookdata/labMT/labMTscores-"+lang+".csv", function (text) {
        var tmp = text.split("\n");
        //console.log(tmp.length);
        //console.log(tmp[tmp.length-1]);
        lens = tmp.map(parseFloat);
        var len = lens.length - 1;
        while (!lens[len]) {
            //console.log("in while loop");
            lens = lens.slice(0, len);
            len--;
        }
	hedotools.shifter._lens(lens);
        if (!--csvLoadsRemaining) initializePlotPlot();
    });
    d3.text("http://hedonometer.org/data/bookdata/labMT/labMTwords-"+lang+".csv", function (text) {
        var tmp = text.split("\n");
        words = tmp;
        var len = words.length - 1;
        while (!words[len]) {
            //console.log("in while loop");
            words = words.slice(0, len);
            len--;
        }
	hedotools.shifter._words(words);
        if (!--csvLoadsRemaining) initializePlotPlot();
    });
    d3.text("http://hedonometer.org/data/bookdata/labMT/labMTwordsEn-"+lang+".csv", function (text) {
        var tmp = text.split("\n");
        words_en = tmp;
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

function initializePlotPlot() {
    // initially apply the lens
    var minSize = 10000;
    var dataSize = 1000;
    minWindows = Math.round(minSize / dataSize);

    lensDecoder = d3.urllib.decoder().varresult([3,7]).varname("lens");

    lensExtent = lensDecoder().cached.map(parseFloat);
    
    refFextentDecoder = d3.urllib.decoder().varresult([0,.2]).varname("refExtent");				      
    refFextent = [Math.round(parseFloat(refFextentDecoder().cached[0])*allDataRaw.length), Math.round(parseFloat(refFextentDecoder().cached[1])*allDataRaw.length)];
    compFextentDecoder = d3.urllib.decoder().varresult([.8,1]).varname("compExtent");				      
    compFextent = [Math.round(parseFloat(compFextentDecoder().cached[0])*allDataRaw.length), Math.round(parseFloat(compFextentDecoder().cached[1])*allDataRaw.length)];
    
    // initialize new values
    var refF = Array(allDataRaw[0].length);
    var compF = Array(allDataRaw[0].length);
    // fill them with 0's
    for (var i = 0; i < allDataRaw[0].length; i++) {
        refF[i] = 0;
        compF[i] = 0;
    }
    // loop over each
    for (var i = 0; i < allDataRaw[0].length; i++) {
        for (var k = refFextent[0]; k < refFextent[1]; k++) {
            refF[i] += parseFloat(allDataRaw[k][i]);
        }
        for (var k = compFextent[0]; k < compFextent[1]; k++) {
            compF[i] += parseFloat(allDataRaw[k][i]);
        }
    }

    // only draw the lens is the page is wide enough
    // this approach is terrible
    if (parseInt(d3.select("#lens01").style("width")) > 100) {
	drawLens(d3.select("#lens01"), lens);
    }

    // doesn't need to return anything, uses globals
    hedotools.shifter._stoprange(lensExtent);
    timeseries = computeHapps();
    selectChapterTop(d3.select("#chapters01"), allDataRaw.length);

    //console.log(timeseries);
    drawBookTimeseries(d3.select("#chapters03"), timeseries);
    selectChapter(d3.select("#chapters02"), allDataRaw.length);

    hedotools.shifter._refF(refF);
    hedotools.shifter._compF(compF);
    hedotools.shifter.stop();
    hedotools.shifter.shifter();
    var happysad = hedotools.shifter._compH() > hedotools.shifter._refH() ? "happier" : "less happy";
    var shifttext = ["Why comparison section is "+happysad+" than reference section:","Reference section's happiness: "+hedotools.shifter._refH().toFixed(2),"Comparison section's happiness: "+hedotools.shifter._compH().toFixed(2)]
    hedotools.shifter.setfigure(d3.select('#figure01')).setText(shifttext).plot();

    // shiftObj = shift(refF, compF, lens, words);
    // plotShift(d3.select("#figure01"), shiftObj.sortedMag.slice(0, 200),
    //           shiftObj.sortedType.slice(0, 200),
    //           shiftObj.sortedWords.slice(0, 200),
    //           shiftObj.sortedWordsEn.slice(0, 200),
    //           shiftObj.sumTypes,
    //           shiftObj.refH,
    //           shiftObj.compH);


    // build the catalog card
    bookinfo.avhapps = d3.mean(timeseries);
    bookinfo.len = 0;
    for (var i=0; i<allDataRaw.length; i++) {
	bookinfo.len += d3.sum(allDataRaw[i]);
    }
    var infobox = d3.select("p.basicinfobox");
    
    infobox.html(
	"Title: "+bookinfo.title+"<br>"+
	"Author: "+bookinfo.author+"<br>"+
	"Language: "+capitaliseFirstLetter(bookinfo.lang)+"<br>"+
	"Number of Words: "+commaSeparateNumber(bookinfo.len)+"<br>"+
	"Average Happiness: "+bookinfo.avhapps.toFixed(3)+"<br>"+
	"Hedonometric Analysis: "+"<a href=\""+window.location.href+"\" >"+window.location.href+"</a>"+"<br>"+
// someday	    
//	"Taxonomy: "+"Thriller"+"<br>"+
//	"10 Most Similar: "+"Coming soon!"+"<br>"
	    ""
    );
};

// make the whole thing
initializePlot();

// for pushing up a selected search
var searchEncoder = d3.urllib.encoder().varname("book");

// api access method for the book API
var substringMatcher = function(apik) {
    return function findMatches(q,cb) {
        var matches, substringRegex;
        // console.log("matching "+q);
	// console.log(apik);
        matches = [];
        // for (var i=0; i<booklist.length; i++) {
        //     if (booklist[i].fulltitle.toLowerCase().match(q)) {
     	// 	matches.push({ value: booklist[i].fulltitle})
        //     }
        // }
        // if (matches.length === 0) { matches.push({ value: "<i>book not indexed</i>" }); }
	d3.json("http://hedonometer.org/api/v1/gutenberg/?format=json&"+apik.toLowerCase()+"__icontains="+q,function(data) {
	    var result = data.objects;
	    // console.log(result);
	    var newresult = [];
	    for (var i=0; i<result.length; i++) {
		// console.log(result);
		// console.log(result[i].title+" by "+result[i].author);
		newresult.push({value: result[i].title+" by "+result[i].author})
	    }
	    // result.map(function(d) { return d.value = d.title; }));
            cb(newresult)
	})
    };
};

// use jquery to build the book search
// (and twitter typeahead)
$(document).ready(function() {
    $('#randombook').on("click",function() {
	window.location.replace("/books.html?book=random");
	});
    $('#randombook').on("click",function() {
	window.location.replace("/books.html?book=random");
	});
    $(".dropdown-menu li a").click(function(){

	$(this).parents(".btn-group").find('.selection').text($(this).text());
	$("#wordsearch").unbind();
	$("#wordsearch").typeahead(
            {
		hint: false,
		highlight: true,
		minLength: 3,
            },
            {
		name: "books",
		source: substringMatcher($(this).text())
            });
    }).on("typeahead:selected",function(event,sugg,dataset) {
	window.location.replace("/books.html?book="+sugg.value.split(" by ").slice(0,-1).join(" by "));

    });
    $("#wordsearch").typeahead(
        {
            hint: false,
            highlight: true,
            minLength: 3,
        },
        {
            name: "books",
            source: substringMatcher("Title")
        });
}).on("typeahead:selected",function(event,sugg,dataset) {
    // console.log(event);
    // console.log(sugg);
    // console.log(dataset);
    window.location.replace("/books.html?book="+sugg.value.split(" by ").slice(0,-1).join(" by "));
});


