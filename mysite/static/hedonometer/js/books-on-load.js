String.prototype.width = function(font) {
    var f = font || '12px arial',
    o = $('<div>' + this + '</div>')
	.css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
	.appendTo($('body')),
    w = o.width();
    o.remove();
    return w;
}

var bookDecoder = d3.urllib.decoder().varresult("moby_dick").varname("book");
var bookEncoder = d3.urllib.encoder().varname("book");

var classics = {
    "blank": {
	language: "",
	fulltitle: "",
	wiki: "",
	ignore: [],
    },
    "moby_dick": {
	language: "english",
	fulltitle: "Moby Dick",
	wiki: "http://en.wikipedia.org/wiki/Moby-Dick",
	ignore: ["cried", "cry", "coffin"],
    },
    "luther": {
	language: "english",
	fulltitle: "I Have a Dream",
	wiki: "",
	ignore: [],
    },
    "luther": {
	language: "english",
	fulltitle: "I Have a Dream",
	wiki: "",
	ignore: [],
    },
    "anna_karenina": {
	language: "russian",
	fulltitle: "Anna Karenina",
	wiki: "http://en.wikipedia.org/wiki/Anna_Karenina",
	ignore: [],
    },
    "count_of_monte_cristo": {
	language: "french",
	fulltitle: "Count of Monte Cristo",
	wiki: "http://en.wikipedia.org/wiki/The_Count_of_Monte_Cristo",
	ignore: [],
    },
    "crime_and_punishment": {
	language: "russian",
	fulltitle: "Crime and Punishment",
	wiki: "http://en.wikipedia.org/wiki/Crime_and_Punishment",
	ignore: [],
    },
    "crime_and_punishment_en": {
	language: "english",
	fulltitle: "Crime and Punishment: English Translation",
	wiki: "http://en.wikipedia.org/wiki/Crime_and_Punishment",
	ignore: [],
    },
    "die_verwandlung_en": { 
	language: "english", 
	fulltitle: "Die Verwandlung: English Translation",
	wiki: "http://en.wikipedia.org/wiki/The_Metamorphosis",
	ignore: [],
    },
    "die_verwandlung": { 
	language: "german",
	fulltitle: "Die Verwandlung",
	wiki: "http://en.wikipedia.org/wiki/The_Metamorphosis",
	ignore: [],
    },
    "don_quixote": {
	language: "spanish",
	fulltitle: "Don Quixote",
	wiki: "http://en.wikipedia.org/wiki/Don_Quixote",
	ignore: [],
    },
    "the_three_musketeers": {
	language: "french",
	fulltitle: "The Three Musketeers",
	wiki: "http://en.wikipedia.org/wiki/The_Three_Musketeers",
	ignore: [],
    },
    "twoCities": {
	language: "english",
	fulltitle: "A Tale of Two Cities",
	wiki: "",
	ignore: [],
    },
    "expectations": {
	language: "english",
	fulltitle: "Great Expectations",
	wiki: "",
	ignore: [],
    },
    "pride": {
	language: "english",
	fulltitle: "Pride and Prejudice",
	wiki: "",
	ignore: [],
    },
    "huck": {
	language: "english",
	fulltitle: "Adventures of Huckleberry Finn",
	wiki: "",
	ignore: [],
    },
    "alice": {
	language: "english",
	fulltitle: "Alice's Adventures in Wonderland",
	wiki: "",
	ignore: [],
    },
    "tom": {
	language: "english",
	fulltitle: "The Adventures of Tom Sawyer",
	wiki: "",
	ignore: [],
    },
    "sherlock": {
	language: "english",
	fulltitle: "The Adventures of Sherlock Holmes",
	wiki: "",
	ignore: [],
    },
    "leaves": {
	language: "english",
	fulltitle: "Leaves of Grass",
	wiki: "",
	ignore: [],
    },
    "ulysses": {
	language: "english",
	fulltitle: "Ulysses",
	wiki: "",
	ignore: [],
    },
    "frankenstein": {
	language: "english",
	fulltitle: "Frankenstein; Or the Modern Prometheus",
	wiki: "",
	ignore: [],
    },
    "heights": {
	language: "english",
	fulltitle: "Wuthering Heights",
	wiki: "",
	ignore: [],
    },
    "sense": {
	language: "english",
	fulltitle: "Sense and Sensibility",
	wiki: "",
	ignore: [],
    },
    "twist": {
	language: "english",
	fulltitle: "Oliver Twist",
	wiki: "",
	ignore: [],
    },
};

var ignoreWords = [];

function initializePlot() {
    book = bookDecoder().cached;
    if (classics[book]) { 
	isclassic = true;
	lang = classics[book].language;
	var booktitle = d3.select("#booktitle");
	var title = booktitle.append("h2").text(classics[book].fulltitle+" ");
	for (var i=0; i<classics[book].ignore.length; i++) {
	    ignoreWords.push(classics[book].ignore[i]);
	}
	title.append("small").append("a").attr("href",classics[book].wiki).attr("target","_blank").text("(wiki)");
	// more than 10000 for no alert
	sumWords = 20000;
	loadCsv();
    }
    else {
	isclassic = false;
	// console.log("not a classic");
	// hit the random api
	if (book === 'random') {
	    d3.json("/api/v1/randombook/?format=json",function(data) {
		var result = data.objects[0];
		// console.log(result);
		lang = result.language;
		var booktitle = d3.select("#booktitle");
		var title = booktitle.append("h2").text(result.title+" ");
		bookEncoder.varval(result.title);
		title.append("small").text("by "+result.author);
		// set the filename
		book = result.filename;
		sumWords = result['length'];
		loadCsv();
	    })
	}
	else {
	    d3.json("/api/v1/gutenberg/?format=json&title__exact="+book,function(data) {
		var result = data.objects[0];
		// console.log(result);
		lang = result.language;
		var booktitle = d3.select("#booktitle");
		var title = booktitle.append("h2").text(result.title+" ");
		title.append("small").text("by "+result.author);
		// set the filename
		book = result.filename;
		sumWords = result['length'];
		loadCsv();
	    })
	}
    }
}

function loadCsv() {
    var csvLoadsRemaining = 4;
    if (isclassic) { 
	var bookfile = "/static/hedonometer/data/bookdata/"+book+".csv";
    }
    else {
	var bookfile = "/static/hedonometer/data/bookdata/"+book+".csv";
    }
    d3.text(bookfile, function (text) {
        tmp = text.split("\n");
        // kill extra rows
        var len = tmp.length - 1;
        //while (!tmp[len]) { console.log("in while loop"); tmp = tmp.slice(0,len); len--; } p
        // build the full data, terrible
        allDataRaw = Array(tmp[0].split(',').length);
        //allData = Array(tmp[0].split(',').length);
        for (var i = 0; i < tmp[0].split(',').length; i++) {
	    allDataRaw[i] = Array(tmp.length);
	    //allData[i] = Array(tmp.length);
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
        if (!--csvLoadsRemaining) initializePlotPlot(allDataRaw, lens, words);
    });
    d3.text("/static/hedonometer/data/bookdata/labMTscores-"+lang+".csv", function (text) {
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
        if (!--csvLoadsRemaining) initializePlotPlot(allDataRaw, lens, words);
    });
    d3.text("/static/hedonometer/data/bookdata/labMTwords-"+lang+".csv", function (text) {
        var tmp = text.split("\n");
        words = tmp;
        var len = words.length - 1;
        while (!words[len]) {
            //console.log("in while loop");
            words = words.slice(0, len);
            len--;
        }
        if (!--csvLoadsRemaining) initializePlotPlot(allDataRaw, lens, words);
    });
    d3.text("/static/hedonometer/data/bookdata/labMTwordsEn-"+lang+".csv", function (text) {
        var tmp = text.split("\n");
        words_en = tmp;
        var len = words_en.length - 1;
        while (!words_en[len]) {
            //console.log("in while loop");
            words_en = words_en.slice(0, len);
            len--;
        }
        if (!--csvLoadsRemaining) initializePlotPlot(allDataRaw, lens, words);
    });
};

function initializePlotPlot(allDataRaw, lens, words) {
    // initially apply the lens
    var minSize = 10000;
    var dataSize = 1000;
    minWindows = Math.round(minSize / dataSize);

    lensDecoder = d3.urllib.decoder().varresult([3,7]).varname("lens");

    lensExtent = lensDecoder().cached.map(parseFloat);
    
    // ignore these on all
    var alwaysIgnore = ["nigga","niggaz","niggas","nigger"]; //["cried", "cry", "coffin"];
    for (var i=0; i<alwaysIgnore.length; i++) {
	ignoreWords.push(alwaysIgnore[i]);
    }
    refFextentDecoder = d3.urllib.decoder().varresult([0,.2]).varname("refExtent");				      
    refFextent = [Math.round(parseFloat(refFextentDecoder().cached[0])*allDataRaw.length), Math.round(parseFloat(refFextentDecoder().cached[1])*allDataRaw.length)];
    compFextentDecoder = d3.urllib.decoder().varresult([.8,1]).varname("compExtent");				      
    compFextent = [Math.round(parseFloat(compFextentDecoder().cached[0])*allDataRaw.length), Math.round(parseFloat(compFextentDecoder().cached[1])*allDataRaw.length)];
    
    // initialize new values
    var refF = Array(allDataRaw[0].length);
    var compF = Array(allDataRaw[0].length);
    allData = Array(allDataRaw.length);
    // fill them with 0's
    for (var i = 0; i < allDataRaw[0].length; i++) {
        refF[i] = 0;
        compF[i] = 0;
    }
    for (var i = 0; i < allDataRaw.length; i++) {
        allData[i] = Array(allDataRaw[i].length);
    }
    // loop over each slice of data
    for (var i = 0; i < allDataRaw[0].length; i++) {
        var include = true;
        for (var k = 0; k < ignoreWords.length; k++) {
            if (ignoreWords[k] == words[i]) {
                include = false;
            }
        }
        if (lens[i] > lensExtent[0] && lens[i] < lensExtent[1]) {
            include = false;
        }
        // grab the shift vectors
        if (include) {
            for (var k = refFextent[0]; k < refFextent[1]; k++) {
                refF[i] += parseFloat(allDataRaw[k][i]);
            }
            for (var k = compFextent[0]; k < compFextent[1]; k++) {
                compF[i] += parseFloat(allDataRaw[k][i]);
            }
            for (var k = 0; k < allDataRaw.length; k++) {
                allData[k][i] = allDataRaw[k][i];
            }
        }
        // slice up the data
        // for quicker redraw on window selection
        // and happiness calculation
        // double overhead for storage
        else {
            for (var k = 0; k < allData.length; k++) {
                allData[k][i] = 0;
            }
        }
    }

    drawLens(d3.select("#lens01"), lens);
    timeseries = computeHapps();
    selectChapterTop(d3.select("#chapters01"), allDataRaw.length);

    //console.log(timeseries);
    drawBookTimeseries(d3.select("#chapters03"), timeseries);
    selectChapter(d3.select("#chapters02"), allDataRaw.length);

    shiftObj = shift(refF, compF, lens, words);
    plotShift(d3.select("#figure01"), shiftObj.sortedMag.slice(0, 200),
              shiftObj.sortedType.slice(0, 200),
              shiftObj.sortedWords.slice(0, 200),
              shiftObj.sortedWordsEn.slice(0, 200),
              shiftObj.sumTypes,
              shiftObj.refH,
              shiftObj.compH);

};

initializePlot();

var searchEncoder = d3.urllib.encoder().varname("book");

var substringMatcher = function(strs) {
    return function findMatches(q,cb) {
        var matches, substringRegex;
        console.log("matching "+q);
        matches = [];
        // for (var i=0; i<booklist.length; i++) {
        //     if (booklist[i].fulltitle.toLowerCase().match(q)) {
     	// 	matches.push({ value: booklist[i].fulltitle}) 
        //     }
        // }
        // if (matches.length === 0) { matches.push({ value: "<i>book not indexed</i>" }); }
	d3.json("/api/v1/gutenberg/?format=json&title__contains="+q,function(data) {
	    var result = data.objects;
	    console.log(result);
	    var newresult = [];
	    for (var i=0; i<result.length; i++) {
		newresult.push({value: result[i].title})
	    }
	    // result.map(function(d) { return d.value = d.title; }));
            cb(newresult)
	})
    };
};

$(document).ready(function() {
    $('#randombook').on("click",function() {
	window.location.replace("/books.html?book=random");
	});
    $("#wordsearch").typeahead(
        {
            hint: false,
            highlight: true,
            minLength: 3,
        },
        {
            name: "books",
            source: substringMatcher(["one","two"])
        });
}).on("typeahead:selected",function(event,sugg,dataset) {
    console.log(event);
    console.log(sugg);
    console.log(dataset);
    window.location.replace("/books.html?book="+sugg.value);
});

