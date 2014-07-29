String.prototype.width = function(font) {
    var f = font || '12px arial',
    o = $('<div>' + this + '</div>')
	.css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
	.appendTo($('body')),
    w = o.width();
    o.remove();
    return w;
}

String.prototype.safe = function() {
    var tmp = this.split("/")
    tmp[tmp.length-1] = escape(tmp[tmp.length-1])
    return tmp.join("/");
}

var bike = '<g transform="translate(0,180)"><svg height="50.000000pt" viewBox="0 0 580.000000 362.000000"><g transform="translate(0.000000,362.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"><path class="bike" d="M1676 3382 c-9 -16 14 -29 103 -57 61 -20 96 -38 126 -66 23 -22 49 -39 56 -39 22 0 35 -28 74 -156 20 -66 54 -175 75 -244 21 -69 55 -180 76 -247 l37 -121 -99 -156 c-55 -86 -121 -191 -148 -234 -248 -392 -339 -534 -354 -552 -14 -17 -30 -21 -97 -23 -100 -4 -139 -22 -189 -88 -46 -59 -55 -95 -44 -169 11 -76 32 -109 92 -150 45 -31 58 -35 116 -35 106 0 130 9 180 70 40 50 48 55 85 55 40 0 221 -32 363 -65 54 -12 71 -20 63 -28 -17 -17 -13 -65 7 -76 9 -5 37 -12 62 -16 25 -3 54 -8 65 -10 11 -2 39 -4 63 -4 39 -1 44 -4 58 -36 8 -19 13 -40 12 -47 -2 -7 7 -14 20 -16 12 -2 22 -10 22 -18 0 -11 6 -13 20 -9 16 5 20 2 20 -14 0 -12 7 -21 15 -21 8 0 15 -7 15 -15 0 -9 6 -12 15 -9 10 4 15 0 15 -11 0 -11 5 -15 15 -11 9 3 18 -1 21 -9 3 -7 12 -11 20 -8 8 3 14 0 14 -7 0 -7 8 -9 20 -5 12 4 20 2 20 -5 0 -7 7 -9 17 -6 9 4 20 1 25 -6 6 -10 10 -10 17 1 8 12 12 12 25 2 12 -10 16 -10 16 -2 0 8 8 10 20 6 12 -4 20 -2 20 5 0 7 8 9 20 5 12 -4 20 -2 20 5 0 7 6 10 14 7 8 -3 17 1 20 10 4 8 13 13 21 9 9 -3 15 0 15 9 0 8 6 15 14 15 8 0 17 7 20 16 3 8 10 13 15 10 5 -3 11 4 14 15 4 13 10 18 17 14 9 -5 10 -1 5 14 -4 15 -2 21 9 21 9 0 13 6 10 14 -3 7 2 16 11 20 9 3 13 10 10 16 -13 21 23 40 77 40 29 0 85 5 123 10 55 8 75 15 93 36 46 52 -3 77 -180 90 -95 7 -128 19 -113 44 3 5 -1 13 -10 16 -9 4 -14 13 -11 20 3 8 -1 14 -10 14 -10 0 -14 6 -10 15 3 9 0 15 -9 15 -8 0 -15 6 -15 14 0 8 -5 16 -10 18 -6 2 82 113 195 248 113 135 265 319 339 410 79 98 174 202 232 255 55 49 112 100 127 114 20 19 26 21 22 8 -8 -20 9 -22 51 -7 51 20 58 10 123 -183 34 -100 94 -272 135 -382 64 -174 72 -202 60 -220 -20 -32 -66 -175 -74 -229 -8 -59 15 -135 55 -176 69 -72 189 -93 267 -47 84 50 102 77 119 179 9 53 7 63 -16 109 -25 47 -86 118 -106 120 -5 1 -12 2 -16 3 -5 2 -29 6 -54 10 l-46 8 -26 79 c-15 43 -27 83 -27 89 0 6 -9 29 -19 53 -11 23 -42 116 -70 207 -27 91 -54 177 -59 190 -20 49 -71 215 -74 241 -3 22 11 37 88 102 51 42 101 89 113 106 30 42 51 106 51 157 0 39 3 44 27 50 27 7 315 -1 440 -12 64 -6 73 -5 79 11 4 10 3 25 -3 34 -11 18 -283 110 -326 111 -16 0 -38 5 -50 11 -15 9 -62 9 -181 1 -89 -7 -208 -14 -265 -18 -117 -7 -166 -21 -231 -66 -54 -37 -89 -78 -105 -124 l-11 -34 -719 0 c-804 -1 -740 -7 -769 74 -8 22 -34 102 -56 176 -83 270 -84 274 -106 285 -19 9 -19 11 -4 28 9 9 26 17 38 17 12 0 52 12 89 26 66 25 220 53 295 54 20 0 49 5 64 10 25 10 26 12 11 27 -14 15 -32 15 -184 5 -92 -7 -234 -12 -314 -12 -140 0 -386 15 -421 26 -9 3 -19 1 -22 -4z m2588 -621 c5 -1 1 -10 -8 -20 -24 -26 -15 -37 29 -35 l37 2 -5 -39 c-3 -22 -17 -56 -32 -75 -35 -46 -157 -146 -166 -137 -6 7 -78 231 -91 282 -5 22 37 30 137 26 50 -2 94 -4 99 -4z m-817 -219 l232 -7 29 -28 c33 -32 47 -82 33 -119 -5 -13 -82 -112 -172 -218 -416 -498 -678 -806 -693 -819 -12 -10 -20 -11 -24 -4 -4 5 -33 9 -65 8 -31 -1 -64 3 -71 9 -8 6 -37 85 -64 176 -28 91 -74 242 -102 335 -29 94 -70 229 -92 300 -22 72 -53 173 -69 225 -32 105 -35 136 -16 143 18 8 800 6 1074 -1z m-1122 -427 c36 -121 80 -256 97 -300 17 -44 39 -107 49 -140 10 -33 36 -114 58 -179 49 -143 52 -194 15 -227 -37 -33 -52 -50 -73 -79 -18 -24 -20 -24 -82 -12 -160 32 -293 51 -394 57 -60 4 -141 12 -180 19 l-70 11 -18 70 c-12 48 -25 76 -42 90 l-25 20 180 273 c99 151 180 275 180 278 0 5 59 91 90 131 11 16 48 70 81 122 33 51 62 92 64 90 2 -2 33 -103 70 -224z"></path> <path class="left-wheel go-counter-clockwise" d="M1435 2344 c-173 -20 -280 -51 -410 -116 -278 -140 -478 -390 -561 -698 -24 -92 -28 -123 -28 -255 -1 -150 7 -209 44 -332 69 -229 233 -446 439 -581 433 -284 1005 -224 1364 145 113 115 215 278 251 399 10 32 28 93 41 134 22 68 24 91 22 240 -2 148 -5 175 -31 265 -40 140 -66 194 -158 322 -200 282 -463 439 -789 473 -100 10 -125 10 -184 4z m118 -334 c-2 -69 -7 -212 -13 -319 -5 -107 -8 -196 -7 -197 1 -1 19 -5 40 -9 l37 -7 0 320 c0 314 0 321 20 327 43 14 176 -24 298 -85 85 -42 222 -156 222 -185 0 -16 -55 -72 -209 -211 -115 -104 -218 -197 -230 -207 l-21 -17 22 -33 c13 -17 23 -33 24 -34 0 -2 101 98 224 222 124 124 227 225 231 225 15 0 61 -57 93 -114 66 -119 110 -289 104 -401 l-3 -60 -175 3 c-198 4 -405 16 -435 26 -17 6 -22 1 -31 -38 -11 -50 -7 -54 38 -37 22 8 502 -21 555 -34 52 -12 49 -68 -8 -208 -57 -139 -179 -307 -223 -307 -22 0 -66 43 -211 204 -5 6 -50 56 -100 111 -49 55 -97 108 -106 118 -16 18 -18 18 -52 -1 l-36 -19 221 -222 c257 -256 251 -244 139 -312 -124 -75 -288 -122 -409 -117 l-77 3 3 175 c1 96 6 234 11 305 4 72 6 135 3 142 -3 9 -52 33 -68 33 -2 0 -4 -144 -4 -320 l0 -320 -25 -6 c-65 -16 -260 53 -379 136 -63 43 -146 120 -146 136 0 7 105 109 234 226 l234 213 -16 30 c-9 16 -18 32 -20 35 -1 2 -106 -99 -231 -224 -155 -154 -234 -227 -244 -223 -8 3 -26 21 -40 39 -74 99 -129 252 -148 406 -11 91 -10 105 3 119 14 13 42 14 249 4 129 -6 270 -14 315 -17 81 -6 81 -6 88 19 3 14 9 32 12 41 5 14 -28 16 -322 18 l-329 3 -3 37 c-7 78 68 266 151 378 91 125 124 143 167 93 87 -100 393 -433 399 -433 5 0 44 23 61 37 2 2 -99 107 -225 233 l-228 228 16 26 c29 44 247 152 247 122 0 -7 6 -18 13 -25 11 -8 13 -5 9 18 -4 28 -2 30 54 41 33 6 64 13 69 15 6 2 46 3 90 2 l80 -2 -2 -125z" transform="rotate(157.934 1517 1251.5)">  <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="360 1517 1251.5" to="0 1517 1251.5" dur="2s" repeatCount="indefinite"></animateTransform></path><path class="right-wheel" d="M4235 2310 c-38 -9 -103 -27 -144 -40 -336 -100 -607 -393 -702 -758 -26 -102 -36 -305 -19 -409 39 -242 133 -437 288 -597 153 -158 321 -254 541 -309 123 -30 359 -30 483 1 397 99 695 387 805 777 25 92 28 114 28 270 0 130 -4 187 -18 244 -104 429 -426 739 -859 826 -105 21 -311 18 -403 -5z m403 -201 c49 -12 52 -14 53 -43 0 -30 1 -30 11 -8 6 12 19 22 28 22 22 0 190 -86 217 -112 13 -12 23 -29 23 -37 0 -9 -99 -115 -219 -235 l-219 -219 35 -19 c20 -11 39 -16 43 -11 116 137 407 443 420 443 25 0 108 -97 165 -191 70 -117 125 -291 104 -331 -9 -17 -33 -18 -321 -18 l-310 0 6 -22 c3 -13 6 -31 6 -41 0 -17 8 -18 98 -13 53 3 158 8 232 11 74 3 169 8 210 11 100 8 105 3 96 -112 -4 -47 -18 -125 -32 -172 -39 -135 -128 -292 -166 -292 -6 0 -112 99 -234 221 l-221 221 -22 -31 c-19 -26 -20 -33 -9 -44 7 -6 67 -61 133 -121 279 -255 315 -289 315 -303 0 -30 -141 -143 -247 -197 -77 -38 -199 -76 -249 -76 l-44 0 0 325 c0 179 -4 325 -9 325 -5 0 -23 -3 -41 -6 l-32 -7 7 -176 c4 -97 9 -178 11 -182 9 -16 6 -281 -4 -291 -16 -16 -206 8 -298 37 -125 42 -248 111 -260 147 -5 17 36 63 222 250 200 200 227 230 211 239 -10 6 -35 25 -55 42 -20 17 -29 22 -18 10 l19 -22 -134 -148 c-74 -81 -157 -173 -185 -203 -29 -30 -64 -70 -79 -87 -15 -18 -35 -33 -45 -33 -23 0 -119 113 -169 200 -64 111 -117 269 -105 316 l6 24 327 0 c243 0 330 -3 339 -12 7 -7 3 7 -8 29 -11 23 -20 47 -20 54 0 9 -51 9 -207 3 -115 -5 -262 -9 -328 -9 l-120 0 1 85 c1 102 31 226 79 325 43 90 90 155 112 155 10 0 120 -102 244 -226 l226 -226 17 32 c17 36 21 60 8 60 -4 0 -46 35 -93 78 -47 42 -147 133 -222 201 -77 70 -137 132 -137 142 0 37 190 180 283 213 17 6 43 19 57 28 30 19 153 41 181 33 18 -6 19 -18 19 -203 0 -173 15 -420 25 -431 2 -2 16 0 31 3 l27 7 -8 137 c-18 343 -21 477 -11 491 12 16 146 10 234 -10z" transform="rotate(157.934 4434 1251.5)"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="360 4434 1251.5" to="0 4434 1251.5" dur="2s" repeatCount="indefinite"></animateTransform></path></g></svg></g><rect x="1" y="1" width="538" height="478" stroke="black" fill="none" stroke-width="2">';

// example API call
// all of the things we need to encode
// 2014-07-23-11-29/2014-07-24-11-29/en/240/0

// initialize the date
var s = moment().subtract('days', 1);
s.minute(Math.floor(s.minute()/15)*15-1);
var e = moment();
e.minute(Math.floor(e.minute()/15)*15-1);

var fromencoder = d3.urllib.encoder().varname("from");
var fromdecoder = d3.urllib.decoder().varname("from").varresult(s.format('YYYY-MM-DD-HH-mm'));
var toencoder = d3.urllib.encoder().varname("to");
var todecoder = d3.urllib.decoder().varname("to").varresult(e.format('YYYY-MM-DD-HH-mm'));
var langcodes = ["en","de","es",];
var langnames = ["English","German","Spanish",];
var langencoder = d3.urllib.encoder().varname("lang");
var langdecoder = d3.urllib.decoder().varname("lang").varresult("en");
var metricencoder = d3.urllib.encoder().varname("metric");
var metricdecoder = d3.urllib.decoder().varname("metric").varresult("happs");
var phraseencoder = d3.urllib.encoder().varname("phrases");
var phrasedecoder = d3.urllib.decoder().varname("phrases").varresult("0");
var boxencoder = d3.urllib.encoder().varname("box");
var boxdecoder = d3.urllib.decoder().varname("box").varresult("240");

// $('#reportrange span').html(s.format('YYYY-MM-DD h:mm A') + ' - ' + e.format('YYYY-MM-DD h:mm A'));
$('#reportrange span').html(fromdecoder().cached + ' - ' + todecoder().cached);


// make the calendar dropdown
$('#reportrange').daterangepicker(
    {
	timePicker: true,
	timePickerIncrement: 15,
	ranges: {
	    'Today': [moment(), moment()],
	    'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
	    'Last 7 Days': [moment().subtract('days', 6), moment()],
	    'Last 30 Days': [moment().subtract('days', 29), moment()],
	    'This Month': [moment().startOf('month'), moment().endOf('month')],
	    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
	},
	startDate: s,
	endDate: e,
	maxDate: moment(),
    },
    function(start, end) {
	$('#reportrange span').html(start.format('YYYY-MM-DD h:mm A') + ' - ' + end.format('YYYY-MM-DD h:mm A'));
	var apicall = "/storybreaker/api/timeseries/"+start.format('YYYY-MM-DD-HH-mm')+"/"+end.format('YYYY-MM-DD-HH-mm')+"/en/240/0"
	d3.select("#timeseries01").select("svg.canvas").selectAll().remove();	    
	d3.select("#timeseries01").select("svg")
	    .attr({"class":"canvas",
		   "width":"540",
		   "height":"480",})
	    .html(bike);
	drawTimeseries(apicall);
    }
);

// test grabbing on of the dropdowns and putting a list to it
// first, language
var langdrop = d3.select(".dropdown.language")
var langspan = langdrop.select("span").text(function(d,i) {
    for (var i=0; i<langcodes.length; i++) {
	if (langdecoder().cached === langcodes[i]) {
	    return "Language: "+langnames[i];
	    break;
	}
    }
});
var langlist = langdrop.select("ul").selectAll("li").data(langcodes);
langlist.enter().append("li").attr({"role":"presentation",})
    .append("a").attr({"role":"menuitem","tabindex":"-1",})
    .text(function(d,i) { return langnames[i]; })
    .on("click",function(d,i) {
	// console.log("changing language");
	var newlang = langnames[i];
	langspan.text("Language: "+newlang);
	langencoder.varval(d);
	var apicall = "/storybreaker/api/timeseries/"+fromdecoder().cached+"/"+todecoder().cached+"/"+langdecoder().cached+"/"+boxdecoder().cached+"/"+phrasedecoder().cached;
	d3.select("#timeseries01").select("svg.canvas").selectAll().remove();
	d3.select("#timeseries01").select("svg")
	    .attr({"class":"canvas",
		   "width":"540",
		   "height":"480",})
	    .html(bike);
	drawTimeseries(apicall);
    });

function drawMap() { 

    var degrees = 180 / Math.PI,
    width = parseInt(d3.select("#map01").style("width")),
    height = width;

    var loader = d3.dispatch("world");

    d3.json("/static/storybreaker/data/world-110m.json", function(error, world) {
	// console.log(world);

	var projection = orthographicProjection(width,height);
	
	var path = d3.geo.path().projection(projection);
	
	// append the svg
	var svg = d3.select("#map01")
	    .append("svg")
	    .attr("width", width)
	    .attr("height", height);

	var mousePoint = true;

	svg.append("path")
	    .datum({type: "Sphere"})
	    .attr("class", "foreground")
	    .attr("d", path)
	    .on("mousedown.grab", function() {
		var point;
		// console.log("grabbing");
		if (mousePoint) point = svg.insert("path", ".foreground")
		    .datum({type: "Point", coordinates: projection.invert(d3.mouse(this))})
		    .attr("class", "point")
		    .attr("d", path);
		var path = d3.select(this).classed("zooming", true),
		w = d3.select(window).on("mouseup.grab", function() {
		    path.classed("zooming", false);
		    w.on("mouseup.grab", null);
		    if (mousePoint) point.remove();
		});
	    })
	    .on("dblclick", function() {
		// console.log("dblclick");
		// console.log(this);
		// d3.event.sourceEvent.preventDefault();
		var coordinates = projection.invert(d3.mouse(this));
		// console.log(coordinates);
		// find the country that it is in, if any.
		// first find one whose bounding box contains it
	    });
	
	svg.append("path")
	    .datum(d3.geo.graticule())
	    .attr("class", "graticule")
	    .attr("d", path);

	svg.append("path").datum(topojson.feature(world,world.objects.land))
            .attr("class","land")
    	    .attr("d", path);

	// console.log("the countries");
	// console.log(topojson.feature(world,world.objects.countries));

	// svg.append("path").datum(topojson.feature(world,world.objects.countries))
        //     .attr("class","country")
    	//     .attr("d", path)
        //     .on("click",function(d,i) { console.log(d); } )
        //     .on("dblclick",function(d,i) { console.log(d); } );

	// console.log(topojson.feature(world,world.objects.countries).features);

	var intstr = ["zero","one","two","three","four","five","six","seven","eight","nine",];
	
	function integerify(num) {
	    var tmp = '';
	    for (var i=0; i<num.toString().length; i++) {
		tmp += intstr[parseInt(num.toString()[i])];
	    }
	    return tmp;
	}
	
	// console.log(integerify(1015));

	svg.selectAll("path.country").data(topojson.feature(world,world.objects.countries).features).enter().append("path")
            .attr("class",function(d,i) { return "country "+integerify(d.id); })
    	    .attr("d", function(d,i) { return path(d.geometry); } )
            .on("click",function(d,i) { console.log("clicked country number "+d.id); } )
            .on("dblclick",function(d,i) { console.log(d.id); } );

	svg.selectAll(".foreground")
            .call(d3.geo.zoom().projection(projection)
		  .scaleExtent([projection.scale() * .7, projection.scale() * 10])
		  .on("zoom.redraw", function() {
		      d3.event.sourceEvent.preventDefault();
		      svg.selectAll("path").attr("d", path);
		  }));

	svg.selectAll(".country")
            .call(d3.geo.zoom().projection(projection)
		  .scaleExtent([projection.scale() * .7, projection.scale() * 10])
		  .on("zoom.redraw", function() {
		      d3.event.sourceEvent.preventDefault();
		      svg.selectAll("path").attr("d", path);
		  }));

    });

    // function returns the projection
    function orthographicProjection(width, height) {
	return d3.geo.orthographic()
	    .precision(.5)
	    .clipAngle(90)
	    .clipExtent([[1, 1], [width - 1, height - 1]])
	    .translate([width / 2, height / 2])
	    .scale(width / 2 - 10)
	    //.scale(300)
	    .rotate([0, -30]);
    }
}



var apicall = "/storybreaker/api/timeseries/"+s.format('YYYY-MM-DD-hh-mm')+"/"+e.format('YYYY-MM-DD-hh-mm')+"/en/240/0"

// console.log(apicall);

function drawTimeseries(apicall) {
    console.log(apicall);
    d3.text(apicall, function(error, data) {
	var tmp = data.split("\n").slice(1,data.length);
	// console.log(tmp);
	var len = tmp.length-1;
	// console.log(len);
	while (tmp[len].length < 1) {
	    tmp = tmp.slice(0,len);
	    len--;
	}
	while (tmp[0].length < 1) {
	    tmp = tmp.slice(1,len+1);
	}
	// var timeseries = tmp.map(function(d) { return parseFloat(d.split(",")[0]); } );
	var dataarray = tmp.map(function(d) { return JSON.parse(d.replace(/'/g,'"')); } );

	var tformat = d3.time.format("%Y-%m-%d-%H-%M");
	var dataobject = dataarray.map(function(d) { return {"time": tformat.parse(d[0]), "happs": parseFloat(d[1]),}; });
	// console.log(dataobject);
	var len = dataobject.length-1;;
	while (dataobject[len].happs < 1) {
	    dataobject = dataobject.slice(0,len);
	    len--;
	}
	// console.log(dataobject);
	var margin = {top: 0, right: 0, bottom: 0, left: 0},
	figwidth = parseInt(d3.select('#timeseries01').style('width')) - margin.left - margin.right,
	aspectRatio = 1.18,
	figheight = figwidth*aspectRatio - margin.top - margin.bottom,
	width = .8875*figwidth-9,
	height = .8875*figheight,
	figcenter = width/2,
	leftOffsetStatic = 0.125*figwidth;

	d3.select("#timeseries01").select("svg.canvas").select("g").remove();

	var svg = d3.select("#timeseries01")
	    .select("svg")
	    .attr("width", figwidth)
	    .attr("height", figheight)
	    .attr("class","canvas");

	// x scale, maps all the data to 
	var x = d3.time.scale()
	    .domain([dataobject[0].time,dataobject[dataobject.length-1].time])
	    .range([5,width-10]);

	// linear scale function
	var y = d3.scale.linear()
	    .domain([d3.min(dataobject.map(function(d) { return d.happs; })),d3.max(dataobject.map(function(d) { return d.happs; }))])
	    .range([height-20, 5]); 

	// create the axes themselves
	var axes = svg.append("g")
	    .attr("transform", "translate(" + (0.125 * figwidth) + "," +
		  ((1 - 0.215 - 0.775) * figheight) + ")")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class", "main");

	// create the axes background
	var bgrect = svg.select("rect")
	    .transition()
	    .attr("transform", "translate(" + (0.125 * figwidth) + "," +
		  ((1 - 0.215 - 0.775) * figheight) + ")")
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

	var ylabel = svg.append("text")
	    .text("Entropy, Happs, Etc")
	    .attr("class","axes-text")
	    .attr("x",(figwidth-width)/4)
	    .attr("y",figheight/2+30)
	    .attr("font-size", "16.0px")
	    .attr("fill", "#000000")
	    .attr("transform", "rotate(-90.0," + (figwidth-width)/4 + "," + (figheight/2+30) + ")");

	var xlabel = svg.append("text")
	    .text("Time")
	    .attr("class","axes-text")
	    .attr("x",width/2+(figwidth-width)/2)
	    .attr("y",3*(figheight-height)/4+height)
	    .attr("font-size", "16.0px")
	    .attr("fill", "#000000")
	    .attr("style", "text-anchor: middle;");

	var circles = axes.selectAll("circle")
	    .data(dataobject)
	    .enter()
	    .append("circle");

	circles.attr({ "class": "timeseries",
		       "cx": function(d,i) { return x(d.time); },
		       "cy": function(d,i) { return y(d.happs); },
		       "r": function(d,i) { return 3; },
		     });

	var line = d3.svg.line()
	    .interpolate("cardinal")
	    .x(function(d,i) { return x(d.time); })
	    .y(function(d,i) { return y(d.happs); });

	axes.append("path").data([dataobject])
	    .attr("class","timeseries")
	    .attr("d",line);
	
    }) // d3.text API

} // drawTimeseries
// call it



function drawShift() {
    var csvLoadsRemaining = 2,
    lens = [],
    words = [];
    // console.log("drawing shift");
    var scoresFile = "/static/hedonometer/data/labMT/labMTscores-english.csv";
    var wordsFile = "/static/hedonometer/data/labMT/labMTwords-english.csv";
    d3.text(scoresFile, function(text) {
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
	if (!--csvLoadsRemaining) initializePlotPlot(lens,words);
    });
    d3.text(wordsFile, function(text) {
	var tmp = text.split("\n");
	words = tmp;
	var len = words.length - 1;
	while (!words[len]) {
	    //console.log("in while loop");
	    words = words.slice(0, len);
	    len--;
	}
	if (!--csvLoadsRemaining) initializePlotPlot(lens,words);
    });

    function initializePlotPlot(lens,words) {
	var ref = Array(lens.length);
	var comp = Array(lens.length);
	for (var i=0; i<lens.length; i++) { 
	    ref[i] = Math.floor(Math.random()*100);
	    comp[i] = Math.floor(Math.random()*100);
	}
	shiftObj = shift(ref,comp,lens,words);
	// plotShift(d3.select("#shift01"),shiftObj.sortedMag.slice(0,200),
	// 	  shiftObj.sortedType.slice(0,200),
	// 	  shiftObj.sortedWords.slice(0,200),
	// 	  shiftObj.sumTypes,
	// 	  shiftObj.refH,
	// 	  shiftObj.compH);
    }
}

drawMap();
drawTimeseries(apicall);
drawShift();

// $('#dropdown-1').on('show', function(event, dropdownData) {
//     console.log(dropdownData);
// }).on('hide', function(event, dropdownData) {
//     console.log(dropdownData);
// });

// $('#attachtome').dropdown('attach', ["#dropdown-1"]);







