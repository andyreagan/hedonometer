var bookDecoder = d3.urllib.decoder().varresult("moby_dick").varname("book");

var books = {
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
	fulltitle: "Frakenstein; Or the Modern Prometheus",
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
    lang = books[book].language;
    var booktitle = d3.select("#booktitle");
    var title = booktitle.append("h2").text(books[book].fulltitle+" ");
    for (var i=0; i<books[book].ignore.length; i++) {
	ignoreWords.push(books[book].ignore[i]);
    }
    title.append("small").append("a").attr("href",books[book].wiki).attr("target","_blank").text("(wiki)");
    loadCsv();
}

function loadCsv() {
    var csvLoadsRemaining = 4;
    d3.text("/static/hedonometer/data/bookdata/"+book+".csv", function (text) {
        tmp = text.split("\n");
        // kill extra rows
        var len = tmp.length - 1;
        //while (!tmp[len]) { console.log("in while loop"); tmp = tmp.slice(0,len); len--; } 
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

var books = {
    "blank": {
	language: "",
	fulltitle: "",
	wiki: "",
    },
    "moby_dick": {
	language: "english",
	fulltitle: "Moby Dick",
	wiki: "http://en.wikipedia.org/wiki/Moby-Dick",
    },
    "luther": {
	language: "english",
	fulltitle: "I Have a Dream",
	wiki: "",
    },
    "luther": {
	language: "english",
	fulltitle: "I Have a Dream",
	wiki: "",
    },
    "anna_karenina": {
	language: "russian",
	fulltitle: "Anna Karenina",
	wiki: "http://en.wikipedia.org/wiki/Anna_Karenina",
    },
    "count_of_monte_cristo": {
	language: "french",
	fulltitle: "Count of Monte Cristo",
	wiki: "http://en.wikipedia.org/wiki/The_Count_of_Monte_Cristo",
    },
    "crime_and_punishment": {
	language: "russian",
	fulltitle: "Crime and Punishment",
	wiki: "http://en.wikipedia.org/wiki/Crime_and_Punishment",
    },
    "crime_and_punishment_en": {
	language: "english",
	fulltitle: "Crime and Punishment: English Translation",
	wiki: "http://en.wikipedia.org/wiki/Crime_and_Punishment",
    },
    "die_verwandlung_en": { 
	language: "english", 
	fulltitle: "Die Verwandlung: English Translation",
	wiki: "http://en.wikipedia.org/wiki/The_Metamorphosis",
    },
    "die_verwandlung": { 
	language: "german",
	fulltitle: "Die Verwandlung",
	wiki: "http://en.wikipedia.org/wiki/The_Metamorphosis",
    },
    "don_quixote": {
	language: "spanish",
	fulltitle: "Don Quixote",
	wiki: "http://en.wikipedia.org/wiki/Don_Quixote",
    },
    "the_three_musketeers": {
	language: "french",
	fulltitle: "The Three Musketeers",
	wiki: "http://en.wikipedia.org/wiki/The_Three_Musketeers",
    },
    "twoCities": {
	language: "english",
	fulltitle: "A Tale of Two Cities",
	wiki: "",
    },
    "expectations": {
	language: "english",
	fulltitle: "Great Expectations",
	wiki: "",
    },
    "pride": {
	language: "english",
	fulltitle: "Pride and Prejudice",
	wiki: "",
    },
    "huck": {
	language: "english",
	fulltitle: "Adventures of Huckleberry Finn",
	wiki: "",
    },
    "alice": {
	language: "english",
	fulltitle: "Alice's Adventures in Wonderland",
	wiki: "",
    },
    "tom": {
	language: "english",
	fulltitle: "The Adventures of Tom Sawyer",
	wiki: "",
    },
    "sherlock": {
	language: "english",
	fulltitle: "The Adventures of Sherlock Holmes",
	wiki: "",
    },
    "leaves": {
	language: "english",
	fulltitle: "Leaves of Grass",
	wiki: "",
    },
    "ulysses": {
	language: "english",
	fulltitle: "Ulysses",
	wiki: "",
    },
    "frankenstein": {
	language: "english",
	fulltitle: "Frakenstein; Or the Modern Prometheus",
	wiki: "",
    },
    "heights": {
	language: "english",
	fulltitle: "Wuthering Heights",
	wiki: "",
    },
    "sense": {
	language: "english",
	fulltitle: "Sense and Sensibility",
	wiki: "",
    },
    "twist": {
	language: "english",
	fulltitle: "Oliver Twist",
	wiki: "",
    },
};

var booklist = [
    { caption: "moby_dick",
      language: "english",
      fulltitle: "Moby Dick",
      wiki: "http://en.wikipedia.org/wiki/Moby-Dick",
    },
    { caption: "luther",
      language: "english",
      fulltitle: "I Have a Dream",
      wiki: "",
    },
    { caption: "luther",
      language: "english",
      fulltitle: "I Have a Dream",
      wiki: "",
    },
    { caption:"anna_karenina",
      language: "russian",
      fulltitle: "Anna Karenina",
      wiki: "http://en.wikipedia.org/wiki/Anna_Karenina",
    },
    { caption:"count_of_monte_cristo",
      language: "french",
      fulltitle: "Count of Monte Cristo",
      wiki: "http://en.wikipedia.org/wiki/The_Count_of_Monte_Cristo",
    },
    { caption: "crime_and_punishment",
      language: "russian",
      fulltitle: "Crime and Punishment",
      wiki: "http://en.wikipedia.org/wiki/Crime_and_Punishment",
    },
    { caption: "crime_and_punishment_en",
      language: "english",
      fulltitle: "Crime and Punishment: English Translation",
      wiki: "http://en.wikipedia.org/wiki/Crime_and_Punishment",
    },
    { caption:"die_verwandlung_en", 
      language: "english", 
      fulltitle: "Die Verwandlung: English Translation",
      wiki: "http://en.wikipedia.org/wiki/The_Metamorphosis",
    },
    { caption: "die_verwandlung", 
      language: "german",
      fulltitle: "Die Verwandlung",
      wiki: "http://en.wikipedia.org/wiki/The_Metamorphosis",
    },
    { caption: "don_quixote",
      language: "spanish",
      fulltitle: "Don Quixote",
      wiki: "http://en.wikipedia.org/wiki/Don_Quixote",
    },
    { caption: "the_three_musketeers",
      language: "french",
      fulltitle: "The Three Musketeers",
      wiki: "http://en.wikipedia.org/wiki/The_Three_Musketeers",
    },
    { caption: "twoCities",
      language: "english",
      fulltitle: "A Tale of Two Cities",
      wiki: "",
    },
    { caption: "expectations",
      language: "english",
      fulltitle: "Great Expectations",
      wiki: "",
    },
    { caption: "pride",
      language: "english",
      fulltitle: "Pride and Prejudice",
      wiki: "",
    },
    { caption: "huck",
      language: "english",
      fulltitle: "Adventures of Huckleberry Finn",
      wiki: "",
    },
    { caption: "alice",
      language: "english",
      fulltitle: "Alice's Adventures in Wonderland",
      wiki: "",
    },
    { caption: "tom",
      language: "english",
      fulltitle: "The Adventures of Tom Sawyer",
      wiki: "",
    },
    { caption: "sherlock",
      language: "english",
      fulltitle: "The Adventures of Sherlock Holmes",
      wiki: "",
    },
    { caption: "leaves",
      language: "english",
      fulltitle: "Leaves of Grass",
      wiki: "",
    },
    { caption: "ulysses",
      language: "english",
      fulltitle: "Ulysses",
      wiki: "",
    },
    { caption: "frankenstein",
      language: "english",
      fulltitle: "Frakenstein; Or the Modern Prometheus",
      wiki: "",
    },
    { caption: "heights",
      language: "english",
      fulltitle: "Wuthering Heights",
      wiki: "",
    },
    { caption: "sense",
      language: "english",
      fulltitle: "Sense and Sensibility",
      wiki: "",
    },
    { caption: "twist",
      language: "english",
      fulltitle: "Oliver Twist",
      wiki: "",
    },
];

var substringMatcher = function(strs) {
    return function findMatches(q,cb) {
        var matches, substringRegex;
        console.log("matching "+q);
        matches = [];
        for (var i=0; i<booklist.length; i++) {
            if (booklist[i].fulltitle.toLowerCase().match(q)) {
     		matches.push({ value: booklist[i].fulltitle})   
            }
        }
        if (matches.length === 0) { matches.push({ value: "<i>book not indexed</i>" }); }
        cb(matches);
    };
};

$(document).ready(function() {
    $("#wordsearch").typeahead(
        {
            hint: false,
            highlight: true,
            minLength: 1,
        },
        {
            name: "books",
            source: substringMatcher(["one","two"])
        });
}).on("typeahead:selected",function(event,sugg,dataset) {
    console.log(event);
    console.log(sugg);
    console.log(dataset);
  
    //if (parseFloat(allDecoder().current)) { allEncoder.varval("0"); }
    for (var i=0; i<booklist.length; i++) {
        if (booklist[i].fulltitle === sugg.value) {
    	    // console.log(i);
    	    console.log(booklist[i].fulltitle);
    	    console.log(booklist[i].caption);
	    searchEncoder.varval(booklist[i].caption);
	    window.location.replace("http://www.uvm.edu/storylab/share/papers/dodds2014a/books.html?book="+booklist[i].caption);
            break;
        }
    }
});

