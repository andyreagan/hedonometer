var lang = "english";

d3.text("http://hedonometer.org/data/labMT/labMTscores-"+lang+".csv", function (text) {
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
    d3.text("http://hedonometer.org/data/labMT/labMTwords-"+lang+".csv", function (text2) {
	var tmp2 = text2.split("\n");
	words = tmp2;
	var len = words.length - 1;
	while (!words[len]) {
            //console.log("in while loop");
            words = words.slice(0, len);
            len--;
	}

    });
});
