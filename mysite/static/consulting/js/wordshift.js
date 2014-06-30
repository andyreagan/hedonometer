function popitup(url) {
	newwindow = window.open(url, 'name');
	if (window.focus) {
		newwindow.focus()
	}
	return false;
}

var myMouseDownOpenMainFunction = function() {
		popitup('/');
	}


function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
		vars[key] = value;
	});
	return vars;
}

function today(offset){
	var todaysDate = new Date();
	var offsetDate = new Date();
	offsetDate.setDate(offsetDate.getDate() - offset);
	var dd = offsetDate.getDate();
	var mm = offsetDate.getMonth()+1; //January is 0!

	var yyyy = offsetDate.getFullYear();
	if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} offsetDate = yyyy+'-'+mm+'-'+dd;;
	return offsetDate;
}	

function pulled(date, plusminus){
	var pull = new Date(date);
	if (plusminus == "plus"){
		var dd = pull.getDate()+2;
	}
	if(plusminus == "minus"){
		var dd = pull.getDate()
	}
	var mm = pull.getMonth()+1;

	var yyyy = pull.getFullYear();
		if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} pull = yyyy+'-'+mm+'-'+dd;

	return pull;
	
}


function wordshift(pulldate){
//var pulldate = getUrlVars()["date"];
if(pulldate == null){
	pulldate = today(1);
}

d3.json("http://s3.amazonaws.com/hedopostprocess/word-shift-results/data/" + pulldate + ".json", function(error, json) {
	if (error){ 
		d3.select("#wordshift").append("span").attr("id","sorry").text("Sorry, unable to display the word shift for "+ pulldate + ". Please try again later.");
		return console.warn(error);
		}
	
	
	json.splice(30,40);
	
	var names = json.map(function(d) {
		return d.name;
	});
	var sizes = json.map(function(d) {
		return d.size;
	});
	var trends = json.map(function(d) {
		return d.trend;
	});
	var vibes = json.map(function(d) {
		return d.vibe;
	});

	var margin = {
		top: 30,
		right: 10,
		bottom: 10,
		left: 10
	},
		width = 500 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;//900

	var x0 = Math.max(-d3.min(sizes) * 1.33, d3.max(sizes) * 1.33);
	var x = d3.scale.linear().domain([-x0, x0]).range([0, width]).nice();
	var y = d3.scale.ordinal().domain(d3.range(sizes.length)).rangeRoundBands([0, height], .03);
	//The rangeRoundBands sets the height of the bars.
	var title1 = d3.select("#wordshift").append("div").attr("id", "whytitle").style("padding-bottom","20px")
	var wordshift = d3.select("#wordshift").append("svg").attr("id","shiftSVG").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	wordshift.selectAll(".bar").data(json).enter().append("rect").attr("class", function(d, i) {
		return d.vibe <= 0 ? "bar negative" : "bar positive";
	}).attr("x", function(d) {
		return x(Math.min(0, d.size));
	}).attr("y", function(d, i) {
		return y(i);
	}).attr("width", function(d) {
		return Math.abs(x(d.size) - x(0));
	}).attr("height", y.rangeBand() / 1.25);

	wordshift.selectAll("text").data(json).enter().append("text").attr("class", function(d, i) {
		return d.vibe <= 0 ? "text negative" : "text positive";
	}).attr("x", function(d) {
		return x(Math.min(0, d.size));
	}).attr("y", function(d, i) {
		return y(i)-2;
	}).attr("dx", function(d) {
		if (d.size >= 0) {return Math.abs(x(d.size) - x(0) + 5)}
		else {return -5};
	}).attr("text-anchor", function(d, i) {
		return d.size <= 0 ? "end" : "start";
	}).attr("dy", y.rangeBand() / 1.25) // vertical-align: middle
	.text(function(d) {
		var trendsign = ''
		var vibesign = ''
		if (d.trend == 1) {
			trendsign = "↑";
		}
		if (d.trend == -1) {
			trendsign = "↓";
		}
		if (d.trend == 0) {
			trendsign = ""
		}
		if (d.vibe == 1) {
			vibesign = "+";
		}
		if (d.vibe == 0) {
			vibesign = "";
		}
		if (d.vibe == -1) {
			vibesign = "-";
		}
		return d.size <= 0 ? vibesign + trendsign + d.name : d.name + vibesign + trendsign
	});
	

	wordshift.append("g").attr("class", "x axis").call(d3.svg.axis().scale(x).orient("top").tickSize(10));

	wordshift.append("g").attr("class", "y axis").call(d3.svg.axis().scale(y).orient("right").tickFormat(function (d) { return d + 1; }));

	wordshift.append("text").attr("class", "y labelTimeseries").attr("text-anchor", "end").attr("y", -10).attr("x", -190).attr("dy", ".75em").attr("transform", "rotate(-90)").text("Word Rank");

	wordshift.append("text").attr("class", "x labelTimeseries").attr("text-anchor", "end").attr("y", 455).attr("x", 195).attr("dy", ".75em").text("Per word average happiness shift");
	d3.json("http://s3.amazonaws.com/hedopostprocess/word-shift-results/metadata/" + pulldate + ".json", function(json) {
			var havg = json.map(function(d) {
				return d.trefhavg;
			});
			var tcomp = json.map(function(d) {
				return d.tcomphavg;
			});
			


function makeWordShiftTitle() {

				var head = "Why " + json[0].dow + ", " + pulldate + " is ";
				var tail = " than the 7 days before and 7 after combined";

				if (pulldate == "2009-05-25") {
					var tail = " than the 7 days after combined:"
				}

				if (pulldate == "2009-05-26") {
					var tail = " than the day before and 7 after combined:"
				}

				if (pulldate == "2009-05-27") {
					var tail = " than the 2 days before and 7 after combined:"
				}

				if (pulldate == "2009-05-28") {
					var tail = " than the 3 days before and 7 after combined:"
				}

				if (pulldate == "2009-05-29") {
					var tail = " than the 4 days before and 7 after combined:"
				}

				if (pulldate == "2009-05-30") {
					var tail = " than the 5 days before and 7 after combined:"
				}

				if (pulldate == "2009-05-31") {
					var tail = " than the 6 days before and 7 after combined:"
				}

				if (pulldate == today(1)){
					var tail = " than the 7 days before combined:"
				}
				if (pulldate == today(2)){
					var tail = " than the 7 days before and one after combined:"
				}
				if (pulldate == today(3)){
					var tail = " than the 7 days before and 2 after combined:"
				}
				if (pulldate == today(4)){
					var tail = " than the 7 days before and 3 after combined:"
				}
				if (pulldate == today(5)){
					var tail = " than the 7 days before and 4 after combined:"
				}
				if (pulldate == today(6)){
					var tail = " than the 7 days before and 5 after combined:"
				}
				if (pulldate == today(7)){
					var tail = " than the 7 days before and 6 after combined:"
				}
				return havg <= tcomp ? head + "happier" + tail : head + "sadder" + tail;
			}
			
			
		
		title1.insert("h3").attr("id", "shiftWhy").text(makeWordShiftTitle());
		d3.select("title").text(makeWordShiftTitle());

		var balanceChart = wordshift.append("svg").style("background-color", "none").attr("width", 105).attr("height", 145).attr("y", 320).attr("x", 390)
		var g = balanceChart.append("g")
		g.append("svg:text").text("Balance:").attr("id", "balance").attr("class", "text positive").attr("text-anchor", "middle").attr("x", 52).attr("y", 20)
		g.append("svg:text").text(json[0].bneg.toFixed(2)).attr("id", "balance").attr("class", "text positive").attr("text-anchor", "middle").attr("x", 25).attr("y", 35)
		g.append("svg:text").text("+" + json[0].bpos.toFixed(2)).attr("id", "balance").attr("class", "text positive").attr("text-anchor", "middle").attr("x", 75).attr("y", 35)

		g.append("line").attr("stroke", "black").attr("stroke-width", "1").attr("x1", 52).attr("y1", 37).attr("x2", 52).attr("y2", 145);
		balanceChart.append("svg:circle").attr("fill", "#FDFF76").attr("stroke", "black").attr("stroke-width", "0.5").attr("cx", 26).attr("cy", 62).attr("r", 50 * Math.sqrt(json[0].normposdown / 3.1415))
		balanceChart.append("svg:circle").attr("fill", "#FDFF76").attr("stroke", "black").attr("stroke-width", "0.5").attr("cx", 76).attr("cy", 62).attr("r", 50 * Math.sqrt(json[0].normposup / 3.1415))
		balanceChart.append("svg:circle").attr("fill", "#796BFE").attr("stroke", "black").attr("stroke-width", "0.5").attr("cx", 26).attr("cy", 108).attr("r", 50 * Math.sqrt(json[0].normnegup / 3.1415))
		balanceChart.append("svg:circle").attr("fill", "#796BFE").attr("stroke", "black").attr("stroke-width", "0.5").attr("cx", 76).attr("cy", 108).attr("r", 50 * Math.sqrt(json[0].normnegdown / 3.1415))

		g.append("svg:text").text("+↓").attr("id", "balance").attr("class", "text positive").attr("text-anchor", "start").attr("x", 0).attr("y", 47)

		g.append("svg:text").text("+↑").attr("id", "balance").attr("class", "text positive").attr("text-anchor", "end").attr("x", 100).attr("y", 47)

		g.append("svg:text").text("-↑").attr("id", "balance").attr("class", "text negative").attr("text-anchor", "start").attr("x", 0).attr("y", 140)

		g.append("svg:text").text("-↓").attr("id", "balance").attr("class", "text negative").attr("text-anchor", "end").attr("x", 100).attr("y", 140);
	});
	
});

Mousetrap.bind('left', function() { 
	d3.select("#whytitle").remove();
	d3.select("#sorry").remove();
	d3.select("#shiftSVG").remove();
	wordshift(pulled(pulldate, "minus")); 
	});
Mousetrap.bind('right', function() { 
	d3.select("#whytitle").remove();
	d3.select("#sorry").remove();
	d3.select("#shiftSVG").remove();
	wordshift(pulled(pulldate, "plus")); 
	});


}