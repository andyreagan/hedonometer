// main context
(function() {
    console.log("running timeline viz");

    var dur =  550,
    shiftTypeSelect = false,
    cformat = d3.time.format("%Y-%m-%d"),
    longformat = d3.time.format("%B %e, %Y"),
    longerformat = d3.time.format("%A, %B %e, %Y"),
    dateencoder = d3.urllib.encoder().varname("date"),
    datedecoder = d3.urllib.decoder().varname("date"),
    shiftselencoder = d3.urllib.encoder().varname("wordtypes"),
    shiftseldecoder = d3.urllib.decoder().varname("wordtypes").varresult("none"),
    weekDaysShort = ["sun","mon","tue","wed","thu","fri","sat"],
    weekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    popupExitDur = 500,
    popupEnterDur = 400,
    intStr = ["zero","one","two","three"],
    // min radius for day circles
    rmin = 0,
    // max radius for day circles
    // these get reset when the day toggle is called
    rmax = 3.25,
    legendDict = {
	"mon": "on",
	"tue": "on",
	"wed": "on",
	"thu": "on",
	"fri": "on",
	"sat": "on",
	"sun": "on",
	"hilite": "on",
	"togall": "on",
	toggle: function (name,r) {
	    this[name] =  this[name] === "on" ? "off" : "on";
	    toggleDays(r);
	}
    };

    // no longer in use
    function getDay(d) {
    	return weekDays[d.date.getDay()];
    };

    // days that are worth labeling
    var bigdays = [
	{
	    date: new Date(2008,  8, 29),
	    value: 5.95,
	    caption: 'Bailout',
	    picture: 'bailout.png',
	    x: 20,
	    y: 40,
	    shorter: ['US Government','Bailout'],
	    longer: 'US Government Bailout',
	    wiki: "http://en.wikipedia.org/wiki/Automotive_industry_crisis_of_2008%E2%80%9310",
	},
	{
	    date: new Date(2009,  3, 27),
	    value: 6.014,
	    caption: 'Swine flu',
	    x: -10,
	    y: 50,
	    shorter: ['Swine Flu','Outbreak'],
	    longer: 'Swine Flu Outbreak',
	    wiki: "http://en.wikipedia.org/wiki/2009_flu_pandemic",
	},
	{
	    date: new Date(2009,  5, 25),
	    value: 5.91,
	    caption: 'MJ death',
	    x: 0,
	    y: 37,
	    shorter: ['Death of','Michael Jackson'],
	    longer: 'Death of Michael Jackson',
	    wiki: "http://en.wikipedia.org/wiki/Death_of_Michael_Jackson",
	},
	{
	    date: new Date(2009,  8, 14), 
	    value:5.99, 
	    caption: 'Swayze dead',
	    x: 10,
	    y: 35,
	    shorter: ['Death of','Patrick Swayze'],
	    longer: 'Death of Patrick Swayze',
	    wiki: "http://en.wikipedia.org/wiki/Patrick_Swayze#Illness_and_death",
	},
	{
	    date: new Date(2010,  1, 27),
	    value: 6.00,
	    caption: 'Chile Quake',
	    x: 3,
	    y: 30,
	    shorter: ['Earthquake','in Chile'],
	    longer: 'Earthquake in Chile',
	    wiki: "http://en.wikipedia.org/wiki/2010_Chile_earthquake",
	},
	{
	    date: new Date(2011,  2, 11),
	    value:5.93,
	    caption: 'Tsunami Japan',
	    x: -5,
	    y: 30,
	    shorter: ['Tsunami in','Japan'],
	    longer: 'Tsunami in Japan',
	    wiki: "http://en.wikipedia.org/wiki/2011_T%C5%8Dhoku_earthquake_and_tsunami",
	},
	{
	    date: new Date(2011,  3, 29),
	    value: 6.060,
	    caption: 'Royal Wedding',
	    x: 15,
	    y: -120,
	    shorter: ['Wedding of','Prince William','and Kate Middleton'],
	    longer: 'Wedding of Prince William and Kate Middleton',
	    wiki: "http://en.wikipedia.org/wiki/Wedding_of_Prince_William_and_Catherine_Middleton",
	},
	{
	    date: new Date(2011,  7, 8),
	    value: 5.934,
	    caption: 'London Riots',
	    x: 7,
	    y: 50,
	    shorter: ['Riots in','London'],
	    longer: 'Riots in London',
	    wiki: "http://en.wikipedia.org/wiki/2011_England_riots",
	},
	{
	    date: new Date(2012,  11, 14),
	    value: 5.89,
	    caption: 'Newtown',
	    x: -5,
	    y: 30,
	    shorter: ['Sandy Hook Elementary','School shooting'],
	    longer: 'Sandy Hook Elementary School shooting',
	    wiki: "http://en.wikipedia.org/wiki/Sandy_Hook_Elementary_School_shooting",
	},
	{
	    date: new Date(2010,  01, 27),
	    value: 6.01,
	    caption: 'Earthquake in Chile',
	    x: -5,
	    y: 30,
	    shorter: ['Earthquake in Chile','Natural Disaster'],
	    longer: 'Earthquake in Chile, Natural Disaster',
	    wiki: "http://en.wikipedia.org/wiki/2010_Chile_earthquake",
	},
	{
	    date: new Date(2010,  00, 12),
	    value: 6.01,
	    caption: 'Earthquake in Haiti',
	    x: -5,
	    y: 30,
	    shorter: ['Earthquake in Haiti','Natural Disaster'],
	    longer: 'Earthquake in Haiti, Natural Disaster',
	    wiki: "http://en.wikipedia.org/wiki/2010_Haiti_earthquake",
	},
	{
	    date: new Date(2010,  04, 24),
	    value: 6.01,
	    caption: 'Lost Finale',
	    x: -5,
	    y: 30,
	    shorter: ['Day after the Lost Finale aired'],
	    longer: 'The show Lost aired its final episode the night before',
	    wiki: "http://en.wikipedia.org/wiki/Lost_(TV_series)",
	},
	{
	    date: new Date(2010,  09, 26),
	    value: 6.00,
	    caption: 'Sumatra Earthquake and Tsunami',
	    x: -5,
	    y: 30,
	    shorter: ['Sumatra Earthquake and Tsunami','Natural Disaster'],
	    longer: 'Earthquake devastates Sumatra, Indonesia followed by tsunami',
	    wiki: "http://en.wikipedia.org/wiki/October_2010_Sumatra_earthquake_and_tsunami",
	},
	{
	    date: new Date(2010,  10, 02),
	    value: 6.00,
	    caption: 'US Senate Elections',
	    x: -5,
	    y: 30,
	    shorter: ['US Senate Election Day'],
	    longer: 'US Senate Election Day',
	    wiki: "http://en.wikipedia.org/wiki/United_States_Senate_elections_2010",
	},
	{
	    date: new Date(2010,  11, 13),
	    value: 6.01,
	    caption: 'Football Game',
	    x: -5,
	    y: 30,
	    shorter: ['NFL Game', 'Ravens Vs. Texans'],
	    longer: 'NFL Matchup between Baltimore Ravens and Houston Texans',
	    wiki: "http://en.wikipedia.org/wiki/2010_Houston_Texans_season",
	},
	{
	    date: new Date(2011,  00, 11),
	    value: 5.97,
	    caption: 'President Obama Visit Site of Giffords Shooting',
	    x: -5,
	    y: 30,
	    shorter: ['President Obama Memorializes Site of Giffords Shooting'],
	    longer: 'President Obama Memorializes Site where Representative Gabrielle Giffords was shot on Jan. 8, 2010',
	    wiki: "http://en.wikipedia.org/wiki/2011_Tucson_shooting",
	},
	{
	    date: new Date(2011,  01, 22),
	    value: 5.98,
	    caption: 'Earthquake in Christchurch',
	    x: -5,
	    y: 30,
	    shorter: ['Earthquake in Christchurch', 'Natural Disaster'],
	    longer: 'Earthquake in Christchurch',
	    wiki: "http://en.wikipedia.org/wiki/2010_Canterbury_earthquake",
	},
	{
	    date: new Date(2011,  04, 01),
	    value: 5.96,
	    caption: 'Death of Osama bin Laden',
	    x: -5,
	    y: 30,
	    shorter: ['Death of', 'Osama bin Laden'],
	    longer: 'Osama bin Laden is found and killed by US Navy SEAL Team Six',
	    wiki: "http://en.wikipedia.org/wiki/Death_of_Osama_bin_Laden",
	},
	{
	    date: new Date(2011,  04, 02),
	    value: 5.92,
	    caption: 'Death of Osama bin Laden',
	    x: -5,
	    y: 30,
	    shorter: ['Death of', 'Osama bin Laden'],
	    longer: 'Osama bin Laden is found and killed by US Navy SEAL Team Six',
	    wiki: "http://en.wikipedia.org/wiki/Death_of_Osama_bin_Laden",
	},
	{
	    date: new Date(2011,  06, 05),
	    value: 5.94,
	    caption: 'Casey Anthony Trial',
	    x: -5,
	    y: 30,
	    shorter: ['Casey Anthony Found Not Guilty'],
	    longer: 'Casey Anthony found not guilty in the case over the murder of her young daughter',
	    wiki: "http://en.wikipedia.org/wiki/Death_of_Caylee_Anthony",
	},
	{
	    date: new Date(2011,  06, 23),
	    value: 5.94,
	    caption: 'Death of Amy Winehouse',
	    x: -5,
	    y: 30,
	    shorter: ['Death of', 'Amy Winehouse'],
	    longer: 'Death of Amy Winehouse',
	    wiki: "http://en.wikipedia.org/wiki/Amy_Winehouse",
	},
	{
	    date: new Date(2011,  07, 23),
	    value: 5.94,
	    caption: 'Earthquake in Virginia, USA',
	    x: -5,
	    y: 30,
	    shorter: ['Earthquake in Virginia, USA', 'Natural Disaster'],
	    longer: 'Earthquake in Virginia, USA',
	    wiki: "http://en.wikipedia.org/wiki/2011_Virginia_earthquake",
	},
	{
	    date: new Date(2011,  08, 21),
	    value: 5.93,
	    caption: 'Execution of Troy Davis',
	    x: -5,
	    y: 30,
	    shorter: ['Execution of', 'Troy Davis'],
	    longer: 'Execution of Troy Davis',
	    wiki: "http://en.wikipedia.org/wiki/Troy_Davis",
	},
	{
	    date: new Date(2011,  08, 11),
	    value: 5.94,
	    caption: 'Patriot Day',
	    x: -5,
	    y: 30,
	    shorter: ['Anniversary of', '10 Years Since September 11 Attacks'],
	    longer: '10 Year Anniversary of September 11 Attacks',
	    wiki: "http://en.wikipedia.org/wiki/September_11_attacks",
	},
	{
	    date: new Date(2012,  00, 18),
	    value: 5.94,
	    caption: 'Protest SOPA',
	    x: -5,
	    y: 30,
	    shorter: ['Protest against the Stop Online Piracy Act'],
	    longer: 'Protest against the Stop Online Piracy Act by Wikipedia and Google',
	    wiki: "http://en.wikipedia.org/wiki/Stop_Online_Piracy_Act",
	},
	{
	    date: new Date(2012,  03, 11),
	    value: 5.94,
	    caption: 'Sumatra Earthquake and Tsunami',
	    x: -5,
	    y: 30,
	    shorter: ['Sumatra Earthquake and Tsunami', 'Natural Disaster'],
	    longer: 'Another earthquake hits Sumatra, Indonesia causing another tsunami',
	    wiki: "http://en.wikipedia.org/wiki/2012_Indian_Ocean_earthquakes",
	},
	{
	    date: new Date(2012,  04, 29),
	    value: 5.94,
	    caption: 'Italian Earthquake',
	    x: -5,
	    y: 30,
	    shorter: ['Earthquake in Italy', 'Natural Disaster'],
	    longer: 'Earthquake in Italy',
	    wiki: "http://en.wikipedia.org/wiki/2012_Northern_Italy_earthquakes",
	},
	{
	    date: new Date(2012,  06, 20),
	    value: 5.94,
	    caption: 'Aurora Shooting',
	    x: -5,
	    y: 30,
	    shorter: ['Shooting in Aurora, Colorado', 'Shooting'],
	    longer: 'Shooting at the premier of “Dark Night Rises” in Aurora, Colorado',
	    wiki: "http://en.wikipedia.org/wiki/2012_Aurora_shooting",
	},
	{
	    date: new Date(2012,  08, 11),
	    value: 5.95,
	    caption: 'Benghazi Attack',
	    x: -5,
	    y: 30,
	    shorter: ['Attack in Benghazi', 'Terror Attack'],
	    longer: 'Terror Attack on American diplomatic mission in Benghazi',
	    wiki: "http://en.wikipedia.org/wiki/2012_Benghazi_attack",
	},
	{
	    date: new Date(2012,  09, 03),
	    value: 5.93,
	    caption: 'US Presidential Debate',
	    x: -5,
	    y: 30,
	    shorter: ['US Presidential Candidate Debate', 'US Presidential Election'],
	    longer: 'US Presidential Candidate Debate between Mitt Romney and President Barack Obama',
	    wiki: "http://en.wikipedia.org/wiki/United_States_presidential_election_debates,_2012",
	},
	{
	    date: new Date(2012,  10, 06),
	    value: 5.92,
	    caption: 'US Presidential Election',
	    x: -5,
	    y: 30,
	    shorter: ['US Presidential Election'],
	    longer: 'US Presidential Election',
	    wiki: "http://en.wikipedia.org/wiki/United_States_presidential_election,_2012",
	},
	{
	    date: new Date(2013,  00, 22),
	    value: 5.93,
	    caption: 'Lone Star College Shooting',
	    x: -5,
	    y: 30,
	    shorter: ['Lone Star College Shooting', 'School Shooting'],
	    longer: 'Lone Star College Shooting',
	    wiki: "http://en.wikipedia.org/wiki/Lone_Star_College–North_Harris",
	},
	{
	    date: new Date(2013,  03, 03),
	    value: 5.94,
	    caption: 'Bomb found in Berlin',
	    x: -5,
	    y: 30,
	    shorter: ['A WWII Bomb was found in Berlin'],
	    longer: 'A Bomb remaining from WWII was found and disabled in Berlin, Germany',
	    wiki: "http://en.wikipedia.org/wiki/Unexploded_ordnance",
	},
	{
	    date: new Date(2013,  03, 15),
	    value: 5.88,
	    caption: 'Boston Marathon Bombing',
	    x: -5,
	    y: 30,
	    shorter: ['Bomb explodes at Boston Marathon Finishline'],
	    longer: 'Two bombers attack the finish line of the Boston Marathon',
	    wiki: "http://en.wikipedia.org/wiki/Boston_Marathon_bombings",
	},
	{
	    date: new Date(2013,  03, 19),
	    value: 5.92,
	    caption: 'Boston Bomber Suspects Arresting',
	    x: -5,
	    y: 30,
	    shorter: ['Boston Bombing Suspects are arrested'],
	    longer: 'One Boston Bombing suspect is killed in shootout and the other is arrested',
	    wiki: "http://en.wikipedia.org/wiki/Boston_Marathon_bombings",
	},
	{
	    date: new Date(2013,  04, 22),
	    value: 5.94,
	    caption: 'Murder of Lee Rigby',
	    x: -5,
	    y: 30,
	    shorter: ['Man Killed in London Street Attack'],
	    longer: 'A veteran is killed on the street in London by two men',
	    wiki: "http://en.wikipedia.org/wiki/Murder_of_Lee_Rigby",
	},
	{
	    date: new Date(2013,  05, 18),
	    value: 5.94,
	    caption: 'NBA Finals',
	    x: -5,
	    y: 30,
	    shorter: ['Finals of NBA 2012-13 Season'],
	    longer: 'Finals of NBA 2012-13 Season, Miami Heat vs. San Antonio Spurs',
	    wiki: "http://en.wikipedia.org/wiki/2013_NBA_Finals",
	},
	{
	    date: new Date(2013,  06, 13),
	    value: 5.91,
	    caption: 'State of Florida v. George Zimmerman Verdict',
	    x: -5,
	    y: 30,
	    shorter: ['State of Florida v. George Zimmerman Verdict'],
	    longer: 'George Zimmerman is found not guilty in the Florida Stand Your Ground Case regarding the shooting of Trayvon Martin',
	    wiki: "http://en.wikipedia.org/wiki/State_of_Florida_v._George_Zimmerman",
	},
	{
	    date: new Date(2013,  06, 14),
	    value: 5.93,
	    caption: 'Death of Cory Monteith',
	    x: -5,
	    y: 30,
	    shorter: ['Death of Cory Monteith'],
	    longer: 'Cory Monteith is found dead of accidental overdose',
	    wiki: "http://en.wikipedia.org/wiki/Finn_Hudson",
	},
	{
	    date: new Date(2013,  11, 01),
	    value: 5.95,
	    caption: 'Death of Paul Walker',
	    x: -5,
	    y: 30,
	    shorter: ['Death of Paul Walker'],
	    longer: 'Paul Walker is killed in a car accident',
	    wiki: "http://en.wikipedia.org/wiki/Paul_Walker",
	},
	{
	    date: new Date(2014,  00, 23),
	    value: 5.93,
	    caption: 'Justin Bieber Arrested',
	    x: -5,
	    y: 30,
	    shorter: ['Justin Bieber is Arrested'],
	    longer: 'Justin Bieber is arrested in Miami for DUI, driving with an expired license and resisting arrest',
	    wiki: "http://en.wikipedia.org/wiki/Justin_Bieber#Legal_issues",
	},
	{
	    date: new Date(2013,  08, 13),
	    value: 6.02,
	    caption: 'Niall Horans Birthday',
	    x: -5,
	    y: 30,
	    shorter: ['One Direction', 'Niall Horans Birthday'],
	    longer: 'Niall Horan of One Direction celebrates a birthday',
	    wiki: "http://en.wikipedia.org/wiki/List_of_One_Direction_members#Niall_Horan",
	},
    ];

    // Boston will be ran whenever we mouse over a circle
    function myMouseDownOpenWordShiftFunction() {
	// var circle = d3.select(this);
	console.log(this);
	popitup('/wordshift.html?date=' + d3.select(this).attr("shortdate"));
    };

    function toggleAll(r) {
	if (legendDict['togall'] == 'on') {
	    d3.selectAll(".Monday, .Tuesday, .Wednesday, .Thursday, .Friday, .Saturday, .Sunday, .Togall").transition().duration(250).attr("r", r);
	}
	if (legendDict['togall'] == 'off') {
	    d3.selectAll(".Monday, .Tuesday, .Wednesday, .Thursday, .Friday, .Saturday, .Sunday, .Togall").transition().duration(250).attr("r", rmin);
	}
    };

    function toggleDays(r) {
	//run through the legendDict to see what's on or off...
	for (var i=0; i < weekDays.length; i=i+1) {
	    if (legendDict[weekDaysShort[i]] == 'on') {
		d3.selectAll("."+weekDays[i]).transition().duration(250).attr("r", r);
	    }
	    else {
		d3.selectAll("."+weekDays[i]).transition().duration(250).attr("r", rmin);
	    }
	}
	// check the highlight individually
	if (legendDict['hilite'] == 'on') { 
	    d3.selectAll(".Hilite").transition().duration(250).attr("visibility", "visible");
	}
	else { 
	    d3.selectAll(".Hilite").transition().duration(250).attr("visibility", "hidden");
	}
    };

    // not in use
    function myMouseDownHideDiv() {
	var item = d3.select(this);
	item.attr("style", "display: none;")
    };

    // not in use
    function myMouseDownClearMinibox() {
	var item = d3.select("#minibox");
	item.attr("style", "display: hidden;")
    };

    function popitup(url) {
	newwindow = window.open(url, 'name', 'height=820,width=780,scrollbars=no,resizeable=0');
	if (window.focus) {
	    newwindow.focus()
	}
	return false;
    };

    function myMouseOutFunction() {
	// don't remove the popup
	// d3.select("#minilist").remove();
	var circle = d3.select(this);
	var currRange = (x.domain()[1].getTime()-x.domain()[0].getTime());
	circle.transition().duration(250).attr("r",rScale(currRange)).style("stroke-width", .7);
	clearTimeout(hovertimer);
    };

    // this will run whenever we mouse over a circle
    function myMouseOverFunction() {
	// context is invoked inside mouseover event
	var circle = d3.select(this);
	popdate = cformat.parse(circle.attr("shortdate"));
	hovertimer = setTimeout(function(){drawSmallShift(parseFloat(circle.attr("cx")),parseFloat(circle.attr("cy")),popdate,false)},popupEnterDur);
    };

    function getDate(d) {
	return new Date(d.date);
    };

    var mainMargin = {
	top: 10,
	right: 10,
	bottom: 100,
	left: 0
    },
    secMargin = {
	top: 430,
	right: 10,
	bottom: 20,
	left: 0
    },
    mainWidth = document.documentElement.clientWidth * 0.9,
    mainHeight = document.documentElement.clientHeight* 0.5,
    sliderHeight = 50;

    // min radius for day circles
    var rmin = 0;
    // max radius for day circles
    // these get reset when the day toggle is called
    var rmax = 2.75; // scale down to 1.25 for whole timeseries

    var formatDate = d3.time.format("%b %Y");
    var today = new Date();

    var symbol = d3.scale.ordinal().range(d3.svg.symbolTypes),
    color = d3.scale.category10();
    
    var margin = {
	top: 10,
	right: 10,
	bottom: 100,
	left: 0
    },
    width = parseInt(d3.select("#bigbox").style("width")),
    height = width*0.5,
    // width = document.documentElement.clientWidth * 0.9,
    // height = document.documentElement.clientHeight* 0.5,
    height2 = 50;
    // height2 = document.documentElement.clientHeight/10;

    var formatDate = d3.time.format("%b %Y");

    var wrp = d3.select("#wrap");

    function selectYear(year) {
	d3.select("#timeseries").remove();
	d3.select(".infobox h4").remove();
	d3.selectAll("rect:not(#shortlist)").style("fill", "lightgrey");
	d3.select("#rect" + year).style("fill", "black");
	timeline(year);
	//if (year == "Full") d3.select(".infobox").append("h4").text("Daily Average Happiness for Twitter, September 2008 to present");
	//else d3.select(".infobox").append("h4").text("Daily Average Happiness for Twitter, " + year);
    }

    console.log("timeline");

    var margin = {
	top: 10,
	right: 40,
	bottom: 100,
	left: 0
    },
    width = parseInt(d3.select("#bigbox").style("width"))-margin.left-margin.right,
    height = d3.max([300,parseInt(d3.select("#bigbox").style("width"))*0.5-margin.bottom-margin.top]),
    height2 = 50;
    // vertical space to give the bottom brush selection
    var MainxAxisSpace = 40;
    //height2 = document.documentElement.clientHeight * 0.5;

    var x = d3.time.scale().range([0, width - 7]); //.domain([new Date(2008,8,10),today]);
    var x2 = d3.time.scale().range([0, width - 7]).domain([new Date(2008,8,10),today]);

    y = d3.scale.linear().range([height, 0]);
    var y2 = d3.scale.linear().range([height2, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");
    yAxis2 = d3.svg.axis().scale(y).orient("right").ticks(7);

    console.log([d3.time.month.offset(today,-18),today]);
    console.log([x2(d3.time.month.offset(today,-18)),x2(today)]);
    var brush = d3.svg.brush().x(x2).extent([d3.time.month.offset(today,-18),today]).on("brush", brushing).on("brushend",brushended);

    // var fisheye = d3.fisheye.circular()
    // 	.radius(120);

    var line = d3.svg.line()
	.x(function(d) {
	    return x(d.date);
	})
	.y(function(d) {
	    return y(d.value);
	});

    var line0 = d3.svg.line();
    // var fishline0 = d3.svg.line();
    // 	// .x(function(d) { return d.x })
    // 	// .y(function(d) { return d.y });

    var date1 = new Date(0000, 11, 25);
    var format = d3.time.format("%m-%d");

    var prevx = 0;
    var prevy = 0;

    //This attempts to draw a line that connects all dates that match 11/25
    var line3 = d3.svg.line().x(function(d) {
	if ((format(d.date) == format(date1))) {
	    prevx = d.date;
	    return x(d.date);
	} else {
	    return x(prevx);
	}
    }).y(function(d) {
	if ((format(d.date) == format(date1))) {
	    prevy = d.value;
	    return y(d.value);
	} else {
	    return y(prevy);
	}
    });

    var area2 = d3.svg.area().interpolate("linear").x(function(d) {
	return x2(d.date);
    }).y0(height2).y1(function(d) {
	return y2(d.value);
    });

    var svg = d3.select("#bigbox").append("svg").attr("id", "timeseries")
	.attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);

    svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);

    var focus = svg.append("g")
	.attr("id", "focus")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var focus2 = svg.append("g")
	.attr("id", "focus2")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // remove the popup wordshift for any click on this group
    // which should be behind the wordshift
    // doesn't work in chrome
    // .on("mousedown",function() { d3.select("#minilist").remove() });

    var legendgroup = svg.append("g")
	.attr({"class": "legendgroup",
	       "transform": "translate("+(width-10-366)+","+0+")",});

    legendgroup.append("rect")
	.attr({"class": "legendbox",
	       "x": 0,
	       "y": 0,
	       "rx": 3,
	       "ry": 3,
	       "width": 366,
	       "height": 19,
	       "fill": "#F0F0F0",
	       'stroke-width': '0.5',
	       'stroke': 'rgb(0,0,0)'});

    var legendboxwidth = 43;

    legendgroup.selectAll("circle")
	.data(weekDaysShort)
	.enter()
	.append("circle").on("mousedown", function(d,i) {
	    var currRange = (x.domain()[1].getTime()-x.domain()[0].getTime());
	    legendDict.toggle(d,rScale(currRange));
	    //toggleDays();
	})
	.attr("cx", function(d,i) { return 8+legendboxwidth*i; })
	.attr("cy", 9)
	.attr("r", rmax)
	.attr("stroke", "black")
	.attr("stroke-width", 0.7)
	.attr("class", function(d,i) { return weekDays[i]; });

    legendgroup.selectAll("text")
	.data(weekDaysShort)
	.enter()
	.append("text")
	.attr("x", function(d,i) { return 15+legendboxwidth*i; })
	.attr("y", 14)
	.on("mousedown", function(d,i) {
	    var currRange = (x.domain()[1].getTime()-x.domain()[0].getTime());
	    legendDict.toggle(d,rScale(currRange));
	    //toggleDays();
	})
    // return first three letters for the name
	.text(function(d,i) { return weekDays[i][0]+weekDays[i][1]+weekDays[i][2] });
    //.attr("class",function(d,i) { return weekDays[i] });

    legendgroup.selectAll("rect.legendclick")
	.data(weekDaysShort)
	.enter()
	.append("rect")
	.attr({"class": "legendrect",
	       "x": function(d,i) { return legendboxwidth*i; },
	       "y": 0,
	       "width": legendboxwidth-2,
	       "height": 19,
	       "fill": "white", //http://www.w3schools.com/html/html_colors.asp
	       "opacity": "0.0",})
	.on("mousedown", function(d,i) {
	    var currRange = (x.domain()[1].getTime()-x.domain()[0].getTime());
	    legendDict.toggle(d,rScale(currRange));
	});

    legendgroup.selectAll("line")
	.data([0,0,0,0,0,0,0])
	.enter()
	.append("line")
	.attr("stroke","grey")
	.attr("stroke-width","2")
	.attr("x1", function(d,i) { return 42+legendboxwidth*i+d; })
 	.attr("x2", function(d,i) { return 42+legendboxwidth*i+d; })
	.attr("y1", 0)
	.attr("y2", 19);
    
    // was at 350
    legendgroup.append("svg:circle").on("mousedown", function() {
	var currRange = (x.domain()[1].getTime()-x.domain()[0].getTime());
	legendDict.toggle('togall',rScale(currRange));
	//toggleAll();
    }).attr("cx", 306).attr("cy", 9).attr("r", rmax).attr("stroke", "black").attr("stroke-width", 0.7).attr("class", "Togall")
    
    legendgroup.append("svg:text").attr("x", 306 + 6).attr("y", 14).text("All on/off").attr("class", "togall").attr("id","togall");
    
    legendgroup.append("rect")
	.attr({"class": "legendrect",
	       "x": 301,
	       "y": 0,
	       "width": 66,
	       "height": 20,
	       "fill": "white", //http://www.w3schools.com/html/html_colors.asp
	       "opacity": "0.0",})
	.on("mousedown", function() {
	    legendDict.toggle('togall');
	    legendDict['mon'] = legendDict['togall'];
	    legendDict['tue'] = legendDict['togall'];
	    legendDict['wed'] = legendDict['togall'];
	    legendDict['thu'] = legendDict['togall'];
	    legendDict['fri'] = legendDict['togall'];
	    legendDict['sat'] = legendDict['togall'];
	    legendDict['sun'] = legendDict['togall'];
	    // the call inside .toggle above won't get that all the days
	    // were reset
	    var currRange = (x.domain()[1].getTime()-x.domain()[0].getTime());
	    toggleDays(rScale(currRange));
	});

    var context = svg.append("g").attr("id", "context").attr("transform", "translate(" + margin.left + "," + (height+MainxAxisSpace) + ")");

    var minDate,maxDate;

    d3.csv("http://s3.amazonaws.com/hedopostprocess/dailyFull.csv", function(data) {
	minDate = getDate(data[0]);
	maxDate = getDate(data[data.length - 1]);
	var parse = d3.time.format("%Y-%m-%d").parse;

	for (i = 0; i < data.length; i++) {
	    data[i].shortDate = data[i].date;
	    data[i].date = parse(data[i].date);
	    data[i].value = +data[i].value;
	}

	x.domain(d3.extent(data.map(function(d) {
	    return d.date;
	})));
	y.domain([5.8, 6.40]);
	//x2.domain(x.domain());
	y2.domain(y.domain());

	// var path = focus.append("path").attr("id", "path").data([data]).attr("clip-path", "url(#clip)").attr("d", fishline);
	var path = focus.append("path").attr("id", "path").data([data]).attr("clip-path", "url(#clip)").attr("d", line);

	// focus.append("path").attr("id", "path").data([data]).attr("clip-path", "url(#clip)").attr("d", line3);

	focus.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").transition().duration(dur).call(xAxis);
	// text for legend h_avg
	// focus.append("text").attr("class", "y labelTimeseries").attr("text-anchor", "start").attr("y", 6).attr("x", width-250).attr("dy", ".75em").attr("transform", "rotate(0)").text("Average Happiness h").append("tspan").attr("baseline-shift","sub").text("avg");
	//focus.append("g").attr("class", "y axis").call(yAxis);
	focus.append("g").attr("class", "y axis").attr("transform", "translate(" + width + ",0)").call(yAxis2);

	horizontalLineGroup = focus.append("g")
	horizontalLineGroup.selectAll("line").data(y.ticks(7).slice(1,7)).enter().append("line")
	    .attr("class", "horizontalLines") //.attr("transform", "translate(" + width + ",0)").call(yAxis2);
	    .attr("x1",0)
	    .attr("x2",width)
	    .attr("y1",function(d){ return y(d); })
	    .attr("y2",function(d){ return y(d); })
	    .attr("fill","none")
	    .attr("stroke",function(d,i) { if (i===0) {return "grey";} else {return "grey";} })
	    .attr("stroke-dasharray",function(d,i) { if (i===0) {return "5";} else {return "5";} })
	    .attr("stroke-width","0.3px");

	horizontalLineGroup.append("line")
	    .attr("class", "horizontalLinesFirst") //.attr("transform", "translate(" + width + ",0)").call(yAxis2);
	    .attr("x1",0)
	    .attr("x2",width)
	    .attr("y1",function(d){ return y(y.ticks(7)[0]); })
	    .attr("y2",function(d){ return y(y.ticks(7)[0]); })
	    .attr("fill","none")
	    .attr("stroke",function(d,i) { if (i===0) {return "black";} else {return "black";} })
	//.attr("stroke-dasharray",function(d,i) { if (i===0) {return "";} else {return "5";} })
	    .attr("stroke-width","1.7px");
	
	// focus2.append("text").attr("class", "labelTimeseries whitebox").attr("text-anchor", "end").attr("x", 168).attr("y", 427).attr("dy", ".75em").text("Select and slide time periods:").order();

	// console.log(data);
	
	var circle = focus2.selectAll("circle").data(data);

	circle.enter().append("circle").attr("r", function(d){return rmax*(0)}).attr("class", function(d) {
	    return weekDays[d.date.getDay()];
	}).attr("cx", function(d, i) {
	    return x(d.date);
	}).attr("clip-path", "url(#clip)")
	    .attr("cy", function(d) {
		return y(6.00);
	    })
	    .attr("shortdate", function(d) {
		return d.shortDate;
	    }).attr("havg", function(d) {
		return d.value.toFixed(2);
	    }).attr("day", function(d) {
		return weekDays[d.date.getDay()];
	    }).attr("date", function(d) {
		return d.date;
	    })
	//.transition().duration(dur)
	    .attr("cy", function(d) {
		return y(d.value);
	    })
	    .on("mouseover.enlarge", function() { d3.select(this).transition().duration(250).attr("r", 7.5).style("stroke-width", .5); })
	    .on("mouseover.popup",myMouseOverFunction) 
	    .on("mouseout", myMouseOutFunction) 
            // .on("mousedown", myMouseDownOpenWordShiftFunction)
	    .transition().duration(dur)
	    .attr("r", function(d){ return rmax; })
	;
	circle.exit().remove();

	context.append("path").data([data]).attr("class", "mini").attr("d", area2);
	context.append("g").attr("class", "x axis")
	    .attr("transform", "translate("+"0"+"," + height2 + ")")
	    .call(xAxis2);

	var format = d3.time.format("%m-%d");

	var bigdaylines = focus2.selectAll("line.bigdays").data(bigdays).enter()
	    .append("line")
	    .attr({
		"x1": function(d,i) { return x(d.date); },
		"x2": function(d,i) { return x(d.date)+d.x; },
		"y1": function(d,i) { return y(d.value)+2*(d.y/d.y); }, // 2 in the direction of the offset +2*(d.y/d.y)
		"y2": function(d,i) { if (d.y > 0) { return y(d.value)+d.y-26; } else { return y(d.value)+d.y+d.shorter.length*20;} },
		"stroke": "grey",
		"stroke-width": 0.5,
		"class": "bigdays",
	    });

	var bigdaygroups = focus2.selectAll("g.bigdays").data(bigdays).enter()
	    .append("g")
	    .attr("transform",function(d,i) { return "translate("+(x(d.date)+d.x)+","+(y(d.value)+d.y)+")"; });
	
	var textwidth = 6;

	String.prototype.width = function(font) {
	    var f = font || '12px arial',
	    o = $('<div>' + this + '</div>')
		.css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
		.appendTo($('body')),
	    w = o.width();

	    o.remove();

	    return w;
	}
	
	bigdaygroups
	    .append("text")
	    .text(function(d) { console.log(d.shorter.length); return d.shorter[0]; } )
	    .attr("class","")
	    .attr("stroke","grey")
 	    // .attr("stroke-width","0.1")
	    .attr("dx", function(d) { return -d.shorter[0].width()/2; })
	    .attr("dy", function(d) { return 0; });

	bigdaygroups
	    .append("text")
	    .text(function(d) { if (d.shorter.length > 1) { return d.shorter[1]; }
			      else { return ""; } })
	    .attr("class","")
	    .attr("stroke","grey")
	    .attr("dx", function(d) { if (d.shorter.length > 1) {return -d.shorter[1].width()/2; } else { return 0; } })
	    .attr("dy", function(d) { return 15; });

	bigdaygroups
	    .append("text")
	    .text(function(d) { if (d.shorter.length > 2) { return d.shorter[2]; }
			      else { return ""; } })
	    .attr("class","")
	    .attr("stroke","grey")
	    .attr("dx", function(d) { if (d.shorter.length > 2) { return -d.shorter[2].width()/2; } else { return 0; } })
	    .attr("dy", function(d) { return 30; });

	bigdaygroups
	    .append("text")
	    .text(function(d) { if (d.shorter.length > 3) { return d.shorter[3]; }
			      else { return ""; } })
	    .attr("class","")
	    .attr("stroke","grey")
	    .attr("dx", function(d) { if (d.shorter.length > 3) { return -d.shorter[3].width()/2; } else { return 0; } })
	    .attr("dy", function(d) { return 45; });

	// text.exit().remove();

	// svg.on("mousemove", function() {
	//     fisheye.focus(d3.mouse(this));

	//     // check that this layer wasn't too buried
	//     // might need "focus2" instead of "svg"
	//     // console.log("fisheye action");

	//     circle.each(function(d) { d.x = x(d.date); d.y = y(d.value); d.fisheye = fisheye(d); })
	//         .attr("cx",function(d) { return d.fisheye.x; })
	//         .attr("cy",function(d) { return d.fisheye.y; })
	//         .attr("r",function(d) { return rmax*d.fisheye.z; });
	
	//     text.each(function(d) { 
    	// 	d.x = x(d.date); 
    	// 	if (d.value <= 6.05) { d.y = y(d.value) -.4; }
    	// 	else { d.y = y(d.value) - 10.4; }
    	// 	d.fisheye = fisheye(d); 
	//     })
	// 	.attr("dx",function(d) { return d.fisheye.x; })
	//         .attr("dy",function(d) { return d.fisheye.y; });

	//     path.attr("d",fishline);
	// });

	// d3.select(".x.brush").call(brush.event);
	var brushgroup = context.append("g").attr("class", "x brush")
	    .call(brush);
	// .call(brush.event);
	
	brushgroup
	    .selectAll("rect")
	    .attr("y", -6)
	    .attr("height", height2 + 7);

	// call the brush initially
	brushing();

    }); // main data load

    // function fishline(d) { 
    // 	return fishline0(d.map(function(d) {
    // 	    d = fisheye({x: x(d.date), y: y(d.value)});
    // 	    return [d.x, d.y];
    // 	}));
    // };

    function line(d) { 
	return line0(d.map(function(d) {
	    return [d.x, d.y];
	}));
    };

    function brushended() {
	console.log("brushended");
    }

    function brushing() {
	console.log("brushing");
	console.log(x.domain()[0].getTime());
	console.log(x.domain()[1].getTime());
	console.log(x2.domain());
	//x.domain(brush.empty() ? x2.domain() : brush.extent());
	x.domain(brush.empty() ? x2.domain() : brush.extent());
	//focus.select("#path").attr("d", fishline);
	focus.select("#path").attr("d", line);
	focus.select(".x.axis").call(xAxis);
	var circle = focus2.selectAll("circle").attr("cx", function(d) {
	    return x(d.date);
	}).attr("cy", function(d) {
	    return y(d.value);
	})
 	    .attr("r", function(d) {
		var currRange = (x.domain()[1].getTime()-x.domain()[0].getTime());
		return rScale(currRange);
	    });
	var rect = focus2.selectAll("rect").attr("x", function(d) {
	    return x(d.date);
	}).attr("y", function(d) {
	    return y(d.value + .02);
	});

	var lines = focus2.selectAll("line.bigdays")
	    .attr({
		"x1": function(d,i) { return x(d.date); },
		"x2": function(d,i) { return x(d.date)+d.x; },
		"y1": function(d,i) { return y(d.value)+2*(d.y/d.y); }, // 2 in the direction of the offset
		"y2": function(d,i) { return y(d.value)+d.y; },
	    });
	
	var groups = focus2.selectAll("g")
	    .attr("transform",function(d,i) { return "translate("+(x(d.date)+d.x)+","+(y(d.value)+d.y)+")"; });

	d3.select("#minilist").remove();
    }

    var fullRange = (today.getTime()-1222964002773);
    var rScale = d3.scale.linear().range([rmax,1.25]);
    rScale.domain([0,fullRange]);

    function offsetXY(x, y, s) {
	// if on the right
	if (x >= 600) {
	    x = x - 220;
	    // if on the top
	    if (y <= 210) { 
		y = y - 10;
		x = x - 30;
	    } 
	    else { y = y - 209; }
	} 
	// on the left
	else {
	    x = x - 7;
	    // if on the top
	    if (y <= 210) {
		y = y - 10;
		x = x + 20;
	    } else {
		y = y - 209;
	    }
	}
	if (s == 'X') {
	    return x;
	}
	if (s == 'Y') {
	    return y;
	}
    };

    function triangleptsXY(x, y) {
	var trianglepointsA = ["10 0, 10 210, 20 200, 230 200, 230 0, 10 0"]
	var trianglepointsB = ["205 200, 215 210, 215 200, 230 200, 230 0, 10 0, 10 200, 205 200"]
	var trianglepointsC = ["10 10, 0 20, 10 20, 10 200, 230 200, 230 0, 10 0, 10 10"]
	var trianglepointsD = ["230 10, 240 20, 230 20, 230 200, 10 200, 10 0, 230 0, 230 10"]
	var result = []
	if (x >= 600) {
	    if (y <= 210) {
		result = trianglepointsD;
	    } else {
		result = trianglepointsB;
	    }
	} else {
	    if (y <= 210) {
		result = trianglepointsC;
	    } else {
		result = trianglepointsA;
	    }
	}
	return result;
    };

    function transitionBigShift(popdate) {
	// called directly on "expand detailed shift" click
	// resizes the #minilist group and the svg within it
	//   -> the svg gets both it's transform and width, height updated

	// console.log(cformat(circle));

	d3.select('#moveshifthere').selectAll('svg').remove();
	d3.select('#minilist').remove();

	var modalwidth = 558;
	// this call will work only once the modal is active
	// parseInt(d3.select("#moveshifthere").style("width"));
	var modalheight = 495;

	// now trying to load in data from zoo
	d3.text("static/hedonometer/data/word-vectors/"+cformat(popdate)+"-sum.csv",function(tmp) {
	    compFvec = tmp.split('\n').slice(0,10222);
	    d3.text("static/hedonometer/data/word-vectors/"+cformat(d3.time.day.offset(popdate,0))+"-prev7.csv",function(tmp2) {
		refFvec = tmp2.split('\n').slice(0,10222);

		for (var i = 0; i < words.length; i++) {
		    var exclude = false;
		    for (var k = 0; k < ignoreWords.length; k++) {
			if (ignoreWords[k] == words[i]) {
			    exclude = true;
			    // console.log("excluding");
			}
		    }
		    // console.log(i);
		    if (lens[i] > 4 && lens[i] < 6) {
			exclude = true;
			// console.log("excluding");
		    }
		    if (exclude) {
			refFvec[i] = 0;
			compFvec[i] = 0;
		    }
		}
		shiftObj = shift(refFvec,compFvec,lens,words);
	    });
	});

	d3.json("http://s3.amazonaws.com/hedopostprocess/word-shift-results/data/" + cformat(popdate) + ".json", function(json) {
	    // extract data from the json
	    var names = json.map(function(d) { return d.name; });
	    var sizes = json.map(function(d) { return d.size; });
	    // trend is -1 if down, 1 if up
	    var trends = json.map(function(d) { return d.trend; });
	    // vibe is -1 if negative, 1 if up
	    var vibes = json.map(function(d) { return d.vibe; });
	    // make a new type that agrees with mine
	    var types = Array(vibes.length);
	    for (var i=0; i<types.length; i=i+1) {
		types[i] = 0
		if (parseFloat(vibes[i]) === 1) {
		    types[i] = types[i] + 1;
		}
		if (parseFloat(trends[i]) === 1) {
		    types[i] = types[i] + 2;
		}
	    }
	    console.log(types);

	    // set the width for bars
	    //var x0 = Math.max(-d3.min(sizes) * 1.33, d3.max(sizes) * 1.33);
	    //var x = d3.scale.linear().domain([-x0, x0]).range([0, 400]);
	    //var y = d3.scale.linear().domain(d3.range(sizes.length)).range([5, 7]);

	    d3.json("http://s3.amazonaws.com/hedopostprocess/word-shift-results/metadata/" + cformat(popdate) + ".json", function(json) {
		var havg = json.map(function(d) { return d.trefhavg; });
		var tcomp = json.map(function(d) { return d.tcomphavg; });

		var shifttotals = json[0];

		//console.log(circle);
		dateencoder.varval(cformat(popdate));

		//console.log(cformat.parse(circle.attr("shortdate")));
		var bigdaytest = false;
		var bigdaywiki = ''; //'http://en.wikipedia.org/wiki/Wedding_of_Prince_William_and_Catherine_Middleton';

		for (var i=0; i<bigdays.length; i++) {
		    //console.log(bigdays[i].date);
		    //if (bigdays[i].date.getTime() === cformat.parse(circle.attr("shortdate")).getTime()) {
		    if (bigdays[i].date.getTime() === popdate.getTime()) {
			console.log("major event wiki");
			bigdaytest = true;
			bigdaywiki = bigdays[i].wiki;
			break;
		    }
		}
		if (bigdaytest) { d3.select("#modaltitle").html("Interactive Wordshift <span class='label label-default'>Major Event <i class='fa fa-signal'></i></span> <a href='"+bigdaywiki+"' target='_blank'><img src='https://lh6.ggpht.com/-Eq7SGa8CVtZCQPXmnux59sebPPU04j1gak4ppkMVboUMQ_ucceGCHrC1wtqfqyByg=w300' height='35'/></a>"); }
		else { d3.select("#modaltitle").html("Interactive Wordshift <span class='label label-default'></span><img src='static/hedonometer/graphics/white.png' height='35'/>"); }
		//Interactive Wordshift <span class="label label-default">Major Event <i class="fa fa-signal"></i></span>

		// grab the modal body
		var modalbody = d3.select("#moveshifthere");
		// remove the text at the top
		modalbody.selectAll("p").remove();
		modalbody.append("p").attr("class","shifttitle").html(function(d,i) { return "<b>"+longerformat(popdate)+"</b>"; });
		if (bigdaytest) {
		    for (var i=0; i<bigdays.length; i++) {
			//console.log(bigdays[i].date);
			if (bigdays[i].date.getTime() === popdate.getTime()) {
			    console.log("major event");
			    modalbody.append("p","svg").attr("class","shifttitle pullright").html(function() { return "<b>"+""+bigdays[i].longer+"</b>"; });
			    break;
			}
		    }
		}
		else {
		    modalbody.append("p","svg").attr("class","shifttitle pullright").html(function() { return "<br>"; });
		}
		modalbody.append("p").attr("class","shifttitle").text(function(d,i) { return "Average happiness: "+parseFloat(tcomp).toFixed(3); });
		modalbody.append("p").text(function() {
		    var head = "What's making this day ";
		    return havg <= tcomp ? head + "happier than the last seven days:" : head + "sadder than the last seven days:";
		});

 		// new one
		var newsmalllist = d3.select('#moveshifthere').append('svg')
		    .attr('height',modalheight).attr('width',modalwidth)
		    .attr('id','modalsvg');

		newsmalllist.append("svg")
		    .attr("id","shiftcanvas")
		    .attr("width",function () { return modalwidth-20-10; })
		    .attr("height",function () { return modalheight-25; });

		// x label of shift, outside of the SVG
		newsmalllist.append("text")
		    .text("Per word average happiness shift")
		    .attr("class","axes-text")
		    .attr("x",(modalwidth-20-10)/2+20) // 350-20-10 for svg width,  
		    .attr("y",modalheight-7)
		    .attr("font-size", "18.0px")
		    .attr("fill", "#000000")
		    .attr("style", "text-anchor: middle;");
		
		// var canvas = smallList.select("svg"),
		var canvas = newsmalllist.select("svg"),
		boxwidth = (modalwidth-20-10),
		boxheight = (modalheight-40-25),
		sortedMag = sizes,
		sortedType = types,
		sortedWords = names,
		sumTypes = [shifttotals.normnegdown,-shifttotals.normnegup,-shifttotals.normposdown,shifttotals.normposup];
		
		/* plot the shift

		   -take a d3 selection, and draw the shift SVG on it
		   -requires sorted vectors of the shift magnitude, type and word
		   for each word
		   
		   selection: will append an svg to this on which to draw
		   boxwidth: will use all of this
		   boxheight: will use all of this
		   numWords: number of words to plot
		   sorted...: the data
		   sumTypes: the summary information (array of four summary values)
		   big: whether to draw axis and summary bars

		*/



		// d3.select("#smallshiftgroup").attr("transform","translate(20,0)");

		shiftTypeSelect = false;

		var margin = {top: 0, right: 0, bottom: 0, left: 0},
		figwidth = boxwidth - margin.left - margin.right,
		figheight = boxheight - margin.top - margin.bottom,
		iBarH = 11;

		var yHeight = (7+17*3+14+5-13), // 101
		clipHeight = 100-20-13,
		barHeight = (7+17*3+15-13), // 95
		width = (figwidth-20), 	// give just enough room for the labels
		height = (figheight-20);

		var bigfigcenter = width/2;

		// create the x and y axis
		// scale in x by width of the top word
		// could still run into a problem if top magnitudes are similar
		// and second word is longer
		// make these local
		// var x0 = Math.max(-d3.min(sizes) * 1.33, d3.max(sizes) * 1.33);

		var bigshiftx = d3.scale.linear()
		    .domain([-Math.abs(sizes[0]),Math.abs(sizes[0])])
		//.range([-x0,x0]);
		    .range([(sortedWords[0].length+4.5)*5, width-(sortedWords[0].length+4.5)*5]);

		// linear scale function
		var bigshifty =  d3.scale.linear()
		    .domain([numWords+1,1])
		    .range([height+2, yHeight]); 

		// zoom object for the axes
		var zoom = d3.behavior.zoom()
		    .y(bigshifty) // pass linear scale function
		// .translate([10,10])
		    .scaleExtent([1,1])
		    .on("zoom",zoomed);

		// create the axes themselves
		// var axes = canvas.select("g")
		var axes = canvas.append("g")
		    .attr("transform","translate(20,0)")
		    .attr("width", width)
		    .attr("height", height)
		    .attr("class", "main")
		    .call(zoom);

		// create the axes background
		axes.append("rect")
		    .attr("width", width)
		    .attr("height", height+60)
		    //.attr("transform","translate(0,40)")
		    .attr("class", "bg")
		    .style({'stroke-width':'3','stroke':'rgb(0,0,0)'})
		    .attr("fill", "#FCFCFC")
		    .attr("opacity","0.96");





		canvas.append("text")
		    .text("Word Rank")
		    .attr("class","axes-text")
		    .attr("x",15)
		    .attr("y",figheight/2+60)
		    .attr("font-size", "18.0px")
		    .attr("fill", "#000000")
		    .attr("transform", "rotate(-90.0," + (15) + "," + (figheight/2+60) + ")");

		// going to append this outside the svg		       
		// canvas.append("text")
		//     .text("Per word average happiness shift")
		//     .attr("class","axes-text")
		//     .attr("x",width/2+(figwidth-width)/2)
		//     .attr("y",3*(figheight-height)/4+height+15)
		//     .attr("font-size", "15.0px")
		//     .attr("fill", "#000000")
		//     .attr("style", "text-anchor: middle;");

		var bigshifttextsize = 13;

		axes.selectAll("rect.shiftrect")
		    .data(sizes)
		    .enter()
		    .append("rect")
		// color
		    .attr("fill", function(d,i) { if (types[i] == 2) {return "#4C4CFF";} else if (types[i] == 3) {return "#FFFF4C";} else if (types[i] == 0) {return "#B3B3FF";} else { return "#FFFFB3"; }})
		    .attr("class", function(d,i) { return "shiftrect "+intStr[types[i]]; })
		    .attr("x",function(d,i) { 
			if (d>0) { return bigfigcenter; } 
			else { return bigshiftx(d)} })
		    .attr("y",function(d,i) { return bigshifty(i+1); } )
		    .attr("height",function(d,i) { return iBarH; } )
		    .attr("width",function(d,i) { if ((d)>0) {return bigshiftx(d)-bigshiftx(0);} else {return bigshiftx(0)-bigshiftx(d); } } )
		    .style({'opacity':'0.7','stroke-width':'1','stroke':'rgb(0,0,0)'});
		// .on('mouseover', function(d){
		//     var rectSelection = d3.select(this).style({opacity:'1.0'});
		// })
		// .on('mouseout', function(d){
		//     var rectSelection = d3.select(this).style({opacity:'0.7'});
		// });

		axes.selectAll("text.shifttext")
		    .data(sizes)
		    .enter()
		    .append("text")
		    .attr("class", function(d,i) { return "shifttext "+intStr[types[i]]; })
		    .attr("x",function(d,i) { if (d>0) {return bigshiftx(d)+2;} else {return bigshiftx(d)-2; } } )
		    .attr("y",function(d,i) { return bigshifty(i+1)+iBarH; } )
		    .style({"text-anchor": function(d,i) { if (sizes[i] < 0) { return "end";} else { return "start";}}, "font-size": bigshifttextsize})
		    .text(function(d,i) { if (types[i] == 0) {tmpStr = "-\u2193";} else if (types[i] == 1) {tmpStr = "\u2193+";}
					  else if (types[i] == 2) {tmpStr = "\u2191-";} else {tmpStr = "+\u2191";}
					  if (sizes[i] < 0) {return tmpStr.concat(names[i]);} else { return names[i].concat(tmpStr); } });

		// check if there is a word selection to apply
		if (shiftseldecoder().current === "posup") {
		    shiftTypeSelect = true;
		    resetButton();
		    axes.selectAll("rect.shiftrect.zero").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.zero").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.one").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.one").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.two").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.three").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.three").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		}
		else if (shiftseldecoder().current === "negdown") {
		    shiftTypeSelect = true;
		    resetButton();
		    axes.selectAll("rect.shiftrect.zero").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.zero").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		    axes.selectAll("rect.shiftrect.one").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.one").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.two").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.three").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.three").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});		
		}
		else if (shiftseldecoder().current === "posdown") {
		    shiftTypeSelect = true;
		    resetButton();
		    axes.selectAll("rect.shiftrect.zero").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.zero").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.three").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.three").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.two").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.one").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.one").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		}
		else if (shiftseldecoder().current === "negup") {
		    shiftTypeSelect = true;
		    resetButton();
		    axes.selectAll("rect.shiftrect.zero").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.zero").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.one").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.one").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.two").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		    axes.selectAll("rect.shiftrect.three").attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.three").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		}
		
		// draw a white rectangle to hide the shift bars behind the summary shifts
		// move x,y to 3 and width to -6 to give the bg a little space
		axes.append("rect").attr("x",3).attr("y",3).attr("width",width-6).attr("height",73-13).attr("fill","white").style({"opacity": "1.0"});

		// draw the summary things
		axes.append("line")
		    .attr("x1",0)
		    .attr("x2",width)
		    .attr("y1",barHeight)
		    .attr("y2",barHeight)
		    .style({"stroke-width" : "1", "stroke": "black"});

		var maxShiftSum = Math.max(Math.abs(sumTypes[1]),Math.abs(sumTypes[2]),sumTypes[0],sumTypes[3]);

		topScale = d3.scale.linear()
		    .domain([-maxShiftSum,maxShiftSum])
		    .range([width*.1,width*.9]);

		// define the RHS summary bars so I can add if needed
		// var summaryArray = [sumTypes[3],sumTypes[0],sumTypes[3]+sumTypes[1],d3.sum(sumTypes)];
		var summaryArray = [sumTypes[3],sumTypes[0],d3.sum(sumTypes)];

		axes.selectAll(".sumrectR")
		    .data(summaryArray)
		    .enter()
		    .append("rect")
		    .attr("fill", function(d,i) { 
			if (i==0) {
			    return "#FFFF4C";
			} 
			else if (i==1) {
			    return "#B3B3FF";
			} 
			else {
			    // always dark grey
			    return "#272727";
			}
		    })
		    .attr("class", "sumrectR")
		    .attr("x",function(d,i) { 
			if (d>0) { 
			    return bigfigcenter;
			} 
			else { return topScale(d)} }
			 )
		    .attr("y",function(d,i) { if (i<3) { return i*17+7;} else { return i*17+7-2;} } )
		    .style({'opacity':'0.7','stroke-width':'1','stroke':'rgb(0,0,0)'})
		    .attr("height",function(d,i) { return 14; } )
		    .attr("width",function(d,i) { if (d>0) {return topScale(d)-bigfigcenter;} else {return bigfigcenter-topScale(d); } } )
		    .on('mouseover', function(d){
			var rectSelection = d3.select(this).style({opacity:'1.0'});
		    })
		    .on('mouseout', function(d){
			var rectSelection = d3.select(this).style({opacity:'0.7'});
		    })
		    .on('click', function(d,i) { 
			if (i==0) {
			    shiftTypeSelect = true;
			    resetButton();
			    shiftselencoder.varval("posup");
			    // shoot them all away
			    //d3.selectAll("rect.shiftrect, text.shifttext").transition().duration(1000).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    // keep the ones with class "three"
			    //d3.selectAll("rect.shiftrect.three, text.shifttext.three").transition().duration(1000)
			    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
			    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
			}
			else if (i==1) {
			    shiftTypeSelect = true;
			    resetButton();
			    shiftselencoder.varval("negdown");
			    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
			    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
			    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			}
			else if (i==2) {
			    // shiftTypeSelect = true;
			    reset();
			    // shiftselencoder.varval("negdown");
			}
		    });

		axes.selectAll(".sumtextR")
		    .data([sumTypes[3],sumTypes[0],d3.sum(sumTypes)])
		    .enter()
		    .append("text")
		    .attr("class", "sumtextR")
		    .style("text-anchor",function(d,i) { if (d>0) {return "start";} else {return "end";} })
		//.attr("y",function(d,i) { if (i<2) {return i*17+17;} else if ((sumTypes[3]+sumTypes[1])*(sumTypes[0]+sumTypes[2])<0) {return i*17+33; } else {return i*17+33; } })
		// for only three days
		    .attr("y",function(d,i) { return i*17+17; })
		    .text(function(d,i) { if (i == 0) {return "\u2211+\u2191";} if (i==1) { return"\u2211-\u2193";} else { return "\u2211";} } )
		// push to the side of d
		    .attr("x",function(d,i) { return topScale(d)+5*d/Math.abs(d); });

		// var summaryArray = [sumTypes[2],sumTypes[1],sumTypes[0]+sumTypes[2]];
		var summaryArray = [sumTypes[2],sumTypes[1]];

		axes.selectAll(".sumrectL")
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
				    return topScale(d)-(bigfigcenter-topScale((sumTypes[3]+sumTypes[1])));
				}
			    } 
			    else { 
				if (d>0) {return bigfigcenter} 
				else { return topScale(d)} }
			}
		    })
		    .attr("y",function(d,i) { return i*17+7; } )
		    .style({'opacity':'0.7','stroke-width':'1','stroke':'rgb(0,0,0)'})
		    .attr("height",function(d,i) { return 14; } )
		    .attr("width",function(d,i) { if (d>0) {return topScale(d)-bigfigcenter;} else {return bigfigcenter-topScale(d); } } )
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
			    shiftselencoder.varval("posdown");
			    // together
			    // axes.selectAll("rect.shiftrect.zero, text.shifttext.zero, rect.shiftrect.three, text.shifttext.three, rect.shiftrect.two, text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    // separate
			    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
			    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
			}
			else if (i==1) {
			    shiftselencoder.varval("negup");
			    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
			    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
			    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
			}
		    } );

		axes.selectAll(".sumtextL")
		    .data([sumTypes[2],sumTypes[1]])
		    .enter()
		    .append("text")
		    .attr("class", "sumtextL")
		    .style("text-anchor", "end")
		    .attr("y",function(d,i) { return i*17+17; } )
		    .text(function(d,i) { if (i == 0) {return "\u2211+\u2193";} else { return"\u2211-\u2191";} })
		    .attr("x",function(d,i) { return topScale(d)-5; });



		// axes.append("rect")
		//     .attr("width", width)
		//     .attr("height", height+20)
		//     .attr("x",20)
		//     .attr("y",0)
		//     //.attr("transform","translate(0,40)")
		//     .attr("class", "bgborder")
		//     .style({'stroke-width':'3','stroke':'rgb(0,0,0)'})
		//     .attr("fill", "#FCFCFC")
		//     .attr("opacity","0.01");

		function zoomed() {
		    // if we have zoomed in, we set the y values for each subselection
		    if (shiftTypeSelect) {
			for (var j=0; j<4; j++) {
			    axes.selectAll("rect.shiftrect."+intStr[j]).attr("y", function(d,i) { return bigshifty(i+1) });
			    axes.selectAll("text.shifttext."+intStr[j]).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } )
			}
		    }
		    else {
			axes.selectAll("rect.shiftrect").attr("y", function(d,i) { return bigshifty(i+1) });
			axes.selectAll("text.shifttext").attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } );
		    }

		}; // zoomed

		function reset() {
		    console.log("reset function");
		    shiftTypeSelect = false;		
		    d3.selectAll("rect.shiftrect").transition().duration(1000)
			.attr("y", function(d,i) { return bigshifty(i+1) })
			.attr("transform","translate(0,0)");
		    d3.selectAll("text.shifttext").transition().duration(1000)
			.attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } )
			.attr("transform","translate(0,0)");
		    d3.selectAll(".resetbutton").remove();
		    shiftselencoder.varval("none");
		    shiftselencoder.destroy();
		} // reset

		function resetButton() {
		    console.log("resetbutton function");

		    d3.selectAll(".resetbutton").remove();
		    
		    var shiftsvg = d3.select("#modalsvg");

		    var resetGroup = shiftsvg.append("g")
			.attr("transform","translate("+(8)+","+(60)+") rotate(-90)")
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
			.attr("font-size", "13.0px");

		    resetGroup.append("rect")
			.attr("x",0)
			.attr("y",0)
			.attr("rx",3)
			.attr("ry",3)
			.attr("width",48)
			.attr("height",189)
			.attr("fill","white") //http://www.w3schools.com/html/html_colors.asp
			.style({"opacity": "0.0"})
			.on("click",function() { 
			    reset();
			});
		    
		}; // resetButton

		// now go ahead and move everthing to the modal
		// this is not straightforward:
		// http://stackoverflow.com/questions/20910147/how-to-move-all-html-element-children-to-another-parent-using-javascript

		// console.log("moving parents");
		// // remove old svg
		// d3.select('#moveshifthere').selectAll('svg').remove();
		// // new one
		// d3.select('#moveshifthere').append('svg')
		//     .attr('height',modalheight).attr('width',modalwidth)
		//     .attr('id','modalsvg');

		// var newParent = document.getElementById('modalsvg');
		// var oldParent = document.getElementById('minilist');

		// while (oldParent.childNodes.length > 0) {
		//     newParent.appendChild(oldParent.childNodes[0]);
		// }

		$('#myModal').modal('toggle'); 

	    }) // data
	    
	}) // metadata

	// d3.select("#dp1").attr("value",function() { return cformat(popdate); });

	// $('#dp1').datepicker({
	//     autoclose: true,
	//     format: 'yyyy-mm-dd',
	//     orientation: 'top-left',
	//     language: 'en',
	// });

	$('#dp1').datepicker('setDate',popdate);
	
    }; // transitionBigShift

    var numWords = 27;
    
    // global declaration
    // drawSmallShift = function drawSmallShift(circle) {
    // inside function closure
    function drawSmallShift(cx,cy,popdate) {
	// remove old guys
	d3.select("#minilist").remove();

	// var circleX = parseFloat(circle.attr("cx"));
	// var circleY = parseFloat(circle.attr("cy"));
	var circleX = parseFloat(cx);
	var circleY = parseFloat(cy);
	
	var miniboxX = offsetXY(circleX, circleY, "X");
	var miniboxY = offsetXY(circleX, circleY, "Y");

	console.log(miniboxX);
	console.log(miniboxY);

	// not sure what these are
	var py = 5;
	var px = 210;
	// number of bars
	var barcount = 9;
	
	// append the main svg
	var shortlist = d3.select("#timeseries").append("g")
	    .attr("transform", "translate(" + miniboxX + "," + miniboxY + ")")
	    .attr("id", "minilist")
	    .on("mouseleave",function(d,i) {
		//console.log("mouseleave");
		minilistMouseLeaveTimer = setTimeout(function() {
		    d3.select("#minilistbg").transition().duration(200).remove(); 
		    d3.select("#minilist").transition().duration(200).remove();
		},popupExitDur);
	    })
	    .on("mouseenter",function(d,i) { 
		//console.log("mouseenter");
		try {
		    clearTimeout(minilistMouseLeaveTimer);
		}
		catch(err) {
		    console.log(err);
		}
	    });
	// these are for logging the events
	// I was having issues when the minilistbg was appended
	// before the shortlist. I appended it after, and attached
	// these (the above) events to the group, not the rect
	// .on("mouseout",function(d,i) { 
	// 	console.log("mouseout");
	// });
	// .on("mouseover",function(d,i) { 
	// 	console.log("mouseover");
	// });

	// draw a background rectangle to remove the popup on click out
	// d3.select("#timeseries").insert("rect","#minilist")
	// d3.select("#timeseries").append("rect")
	// and now it's inside the list, just to make the group the right size
	    shortlist.append("rect")
		.attr("id","minilistbg")
	    // .attr("width", mainWidth + mainMargin.left + mainMargin.right + 35)
	    // .attr("height", mainHeight + mainMargin.top + mainMargin.bottom)
		.attr("width", 315)
		.attr("height", 260)
	    //.attr("transform", "translate(" + (miniboxX-40) + "," + (miniboxY-40) + ")")
		.attr("transform", "translate(-40,-40)") // it is 40 wider
	    // than the pop-up, in every dimension
		.attr("fill","grey")
		.attr("opacity",0.01); // it needs some opacity to be clickable
	    // these events are now on the group
	    //.on("mousedown",function(d,i) { d3.select(this).remove(); d3.select("#minilist").remove(); } );

	    shortlist.append("svg:polyline").attr("id", "shadow").attr("points", function(d) {
		return triangleptsXY(circleX, circleY); })
		.attr("transform", "translate(4,4)")
		.attr("stroke", "grey").attr("fill", "grey").attr("opacity", 0.2).attr("stroke-width", "1");

	    shortlist.append("svg:polyline").attr("id", "bg").attr("points", function(d) {
		return triangleptsXY(circleX, circleY);
	    }).attr("stroke", "grey").attr("fill", "white").attr("opacity", 0.96).attr("stroke-width", "1");

	    // shortlist.append("svg:text").attr("x", 20).attr("y", 14).attr("shortdate", circle.attr("shortdate")).text(circle.attr("day") + ", " + longformat(cformat.parse(circle.attr("shortdate")))).attr("font-size", "10px").attr("font-weight", "bold").attr("class","shifttitledate");
	    shortlist.append("svg:text").attr("x", 20).attr("y", 14).text(longerformat(popdate)).attr("font-size", "10px").attr("font-weight", "bold").attr("class","shifttitledate"); 

	for (var i=0; i<bigdays.length; i++) {
	    //console.log(bigdays[i].date);
	    if (bigdays[i].date.getTime() === popdate.getTime()) {
		console.log("major event");
		shortlist.append("text").attr("x", 200).attr("y", 24)
		    .attr('font-family', 'FontAwesome')
		    .attr('font-size', function(d) { return '2em'} )
		    .text(function() { return '\uF012' }); 
		shortlist.append("text").attr("x", 20).attr("y", 36)
		//.html(function() { return '<b>'+bigdays[i].caption+'</b>'; })
		    .text(function() { return bigdays[i].longer; })
		    .attr("font-weight","bold")
		    .attr("font-size", "10px")
		    .attr("class","shifttitlebigdaytext");
		break;
	    }
	}

	d3.json("http://s3.amazonaws.com/hedopostprocess/word-shift-results/data/" + cformat(popdate) + ".json", function(json) {
	    // extract data from the json
	    var names = json.map(function(d) { return d.name; });
	    var sizes = json.map(function(d) { return d.size; });
	    // trend is -1 if down, 1 if up
	    var trends = json.map(function(d) { return d.trend; });
	    // vibe is -1 if negative, 1 if up
	    var vibes = json.map(function(d) { return d.vibe; });
	    // make a new type that agrees with mine
	    var types = Array(vibes.length);
	    for (var i=0; i<types.length; i=i+1) {
		types[i] = 0
		if (parseFloat(vibes[i]) === 1) {
		    types[i] = types[i] + 1;
		}
		if (parseFloat(trends[i]) === 1) {
		    types[i] = types[i] + 2;
		}
	    }
	    console.log(types);

	    // set the width for bars
	    //var x0 = Math.max(-d3.min(sizes) * 1.33, d3.max(sizes) * 1.33);
	    //var x = d3.scale.linear().domain([-x0, x0]).range([0, 400]);
	    //var y = d3.scale.linear().domain(d3.range(sizes.length)).range([5, 7]);

	    d3.json("http://s3.amazonaws.com/hedopostprocess/word-shift-results/metadata/" + cformat(popdate) + ".json", function(json) {
		var havg = json.map(function(d) { return d.trefhavg; });
		var tcomp = json.map(function(d) { return d.tcomphavg; });

		shortlist.append("svg:text").attr("x", 20).attr("y", 25).text("Average Happiness: " + parseFloat(tcomp).toFixed(2)).attr("font-size", "10px").attr("class","shifttitlehavg");

		var shifttotals = json[0];
		// shortlist.append("svg:text").attr("x", 20).attr("y", 35).attr("font-size", "10px").text(function() {
		//     var head = "What's making this day ";
		//     // longer
		//     //return havg <= tcomp ? head + "happier than the last seven days:" : head + "sadder than the last seven days:";
		//     // shorter
		//     return havg <= tcomp ? head + "happier:" : head + "sadder:";
		// }).attr("class","shifttitlewhatis");

		// wrap the longer sentence
		shortlist.append("svg:text").attr("x", 20).attr("y", 47).attr("font-size", "10px").text(function() {
		    var head = "What's making this day ";
		    // longer
		    // return havg <= tcomp ? head + "happier than the last seven days:" : head + "sadder than the last seven days:";
		    // shorter
		    return havg <= tcomp ? head + "happier" : head + "sadder";
		}).attr("class","shifttitlewhatisone");
		shortlist.append("svg:text").attr("x", 20).attr("y", 57).attr("font-size", "10px").text(function() {
		    return "than the last seven days:"
		}).attr("class","shifttitlewhatistwo");

		shortlist.append("line")
		    .attr("x1", 20)
		    .attr("x2",220)
		    .attr("y1", 61)
		    .attr("y2", 61)
		    .attr("stroke", "grey")
		    .attr("stroke-width", ".3px")
		    .attr("class","shiftsepline");
		shortlist.append("line")
		    .attr("x1", 20)
		    .attr("x2",220)
		    .attr("y1", 183)
		    .attr("y2", 183)
		    .attr("stroke", "grey")
		    .attr("stroke-width", ".3px")
		    .attr("class","shiftsepline");

		// add the link to bigger wordshift
		shortlist.append("g").attr("transform","translate(40,196)")
		//.insert("g","rect").attr("transform","translate(20,177)")
		    .append("text")
		    .text("Click for interactive word shift.")
		//.attr("data-toggle","modal")
		//.attr("href","#myModal")
		    .attr("class","expanderbutton")
	            .on("click",function() { 
		                             transitionBigShift(popdate);
					     
					   });

		var innerlist = shortlist.append("svg:g").attr("transform", "translate(20,64)").attr("id","smallshiftgroup");

		var figwidth = 190,
		figheight = 115,
		numWords = 10;
		var shiftsvg = innerlist.append("svg")
		    .attr("width",figwidth)
		    .attr("height",figheight)
		    .attr("id","shiftcanvas");
		summaryStats = false;

		//plotShift: function(canvas,boxwidth,boxheight,numWords,sizes,sortedType,sortedWords)
		plotShift(shiftsvg,figwidth,figheight,numWords,sizes,types,names);

		// .attr("class","btn btn-primary expanderbutton");
		// .attr("x",20)
		// .attr("y",167)
		// .attr("font-size","10px")
		// .on("mousedown",function() { transitionBigShift(circle,sizes,types,names); });

	    }); // d3.json metadata

	}); // d3.json data

    }; // drawSmallShift

    function plotShift(canvas,boxwidth,boxheight,numWords,sortedMag,sortedType,sortedWords) {
	/* plot the shift

	   -take a d3 selection, and draw the shift SVG on it
	   -requires sorted vectors of the shift magnitude, type and word
	   for each word
	   
	   selection: will append an svg to this on which to draw
	   boxwidth: will use all of this
	   boxheight: will use all of this
	   numWords: number of words to plot
	   sorted...: the data
	   sumTypes: the summary information (array of four summary values)
	   big: whether to draw axis and summary bars

	*/

	// console.log(big);
	// console.log(sortedMag);
	// console.log(sortedWords);
	// console.log(sortedType);

	var margin = {top: 0, right: 0, bottom: 0, left: 0},
	figwidth = boxwidth - margin.left - margin.right,
	figheight = boxheight - margin.top - margin.bottom,
	iBarH = 9;

	var yHeight = 1,
	clipHeight = 0,
	barHeight = 0,
	width = .99*figwidth,
	height = .99*figheight;

	var figcenter = width/2;

	// create the x and y axis
	// scale in x by width of the top word
	// could still run into a problem if top magnitudes are similar
	// and second word is longer
	// make these local
	// var x0 = Math.max(-d3.min(sortedMag) * 1.33, d3.max(sortedMag) * 1.33);
	var x = d3.scale.linear()
	    .domain([-Math.abs(sortedMag[0]),Math.abs(sortedMag[0])])
	//.range([-x0,x0]);
	    .range([(sortedWords[0].length+2.5)*5, width-(sortedWords[0].length+2.5)*5]);

	// linear scale function
	var y =  d3.scale.linear()
	    .domain([numWords+1,1])
	    .range([height+2, yHeight]); 

	// zoom object for the axes
	var zoom = d3.behavior.zoom()
	    .y(y) // pass linear scale function
	// .translate([10,10])
	    .scaleExtent([1,1])
	    .on("zoom",zoomed);

	// create the axes themselves
	var axes = canvas.append("g")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class", "main")
	    .call(zoom);

	// create the axes background
	axes.append("svg:rect")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class", "bg")
	//.style({'stroke-width':'2','stroke':'rgb(0,0,0)'})
	    .attr("fill", "#FCFCFC")
	    .attr("opacity","0.96");

	intStr = ["zero","one","two","three"];

	axes.selectAll("rect.shiftrect")
	    .data(sortedMag)
	    .enter()
	    .append("rect")
	// color
	    .attr("fill", function(d,i) { if (sortedType[i] == 2) {return "#4C4CFF";} else if (sortedType[i] == 3) {return "#FFFF4C";} else if (sortedType[i] == 0) {return "#B3B3FF";} else { return "#FFFFB3"; }})
	    .attr("class", function(d,i) { return "shiftrect "+intStr[sortedType[i]]; })
	    .attr("x",function(d,i) { 
                if (d>0) { return figcenter; } 
                else { return x(d)} })
	    .attr("y",function(d,i) { return y(i+1); } )
	    .style({'opacity':'0.7','stroke-width':'1','stroke':'rgb(0,0,0)'})
	    .attr("height",function(d,i) { return iBarH; } )
	    .attr("width",function(d,i) { if ((d)>0) {return x(d)-x(0);} else {return x(0)-x(d); } } )
	    .on('mouseover', function(d){
		// var rectSelection = d3.select(this).style({opacity:'1.0'});
	    })
	    .on('mouseout', function(d){
		var rectSelection = d3.select(this).style({opacity:'0.7'});
	    });

	axes.selectAll("text.shifttext")
	    .data(sortedMag)
	    .enter()
	    .append("text")
	    .attr("class", function(d,i) { return "shifttext "+intStr[sortedType[i]]; })
	    .style({"text-anchor": function(d,i) { if (sortedMag[i] < 0) { return "end";} else { return "start";}}, "font-size": 11})
	    .attr("y",function(d,i) { return y(i+1)+iBarH; } )
	    .text(function(d,i) { if (sortedType[i] == 0) {tmpStr = "-\u2193";} else if (sortedType[i] == 1) {tmpStr = "\u2193+";}
				  else if (sortedType[i] == 2) {tmpStr = "\u2191-";} else {tmpStr = "+\u2191";}
				  if (sortedMag[i] < 0) {return tmpStr.concat(sortedWords[i]);} else { return sortedWords[i].concat(tmpStr); } })
	    .attr("x",function(d,i) { if (d>0) {return x(d)+2;} else {return x(d)-2; } } );

	function zoomed() {
	    //axes.selectAll("rect.shiftrect").attr("transform", "translate(0," + Math.min(0,d3.event.translate[1]) + ")");
	    //axes.selectAll("text.shifttext").attr("transform", "translate(0," + Math.min(0,d3.event.translate[1]) + ")");
	    axes.selectAll("rect.shiftrect").attr("y", function(d,i) { return y(i+1) });
	    axes.selectAll("text.shifttext").attr("y", function(d,i) { return y(i+1)+iBarH; } )
	};
    };

    // store the function in a object of the same name globally
    // nextDay = function nextDay(offset) {
    nextDay = function nextDay(update) {
	// trying to get this function to remember it's context
	var that = this;
	// console.log(this);
	// console.log(that);

	// var date = datedecoder().current;
	// console.log(date);
	// console.log(cformat.parse(date));
	var bigshiftdiv = d3.select("#moveshifthere");
	// var newdate = d3.time.day.offset(cformat.parse(date),offset);
	var newdate = update;
	console.log(newdate);
	console.log(cformat(newdate));	
	dateencoder.varval(cformat(newdate));
	// grab the date

	//console.log(cformat.parse(circle.attr("shortdate")));
	var bigdaytest = false;
	var bigdaywiki = '';
	for (var i=0; i<bigdays.length; i++) {
	    //console.log(bigdays[i].date);
	    if (bigdays[i].date.getTime() === newdate.getTime()) {
		//console.log("major event");
		bigdaytest = true;
		bigdaywiki = bigdays[i].wiki;
		break;
	    }
	}
	if (bigdaytest) { d3.select("#modaltitle").html("Interactive Wordshift <span class='label label-default'>Major Event <i class='fa fa-signal'></i></span> <a href='"+bigdaywiki+"' target='_blank'><img src='https://lh6.ggpht.com/-Eq7SGa8CVtZCQPXmnux59sebPPU04j1gak4ppkMVboUMQ_ucceGCHrC1wtqfqyByg=w300' height='35'/></a>"); }
	else { d3.select("#modaltitle").html("Interactive Wordshift <span class='label label-default'></span><img src='static/hedonometer/graphics/white.png' height='35'/>"); }

	d3.json("http://s3.amazonaws.com/hedopostprocess/word-shift-results/data/" + cformat(newdate) + ".json", function(json) {
	    // extract data from the json
	    var names = json.map(function(d) { return d.name; });
	    var sizes = json.map(function(d) { return d.size; });
	    // trend is -1 if down, 1 if up
	    var trends = json.map(function(d) { return d.trend; });
	    // vibe is -1 if negative, 1 if up
	    var vibes = json.map(function(d) { return d.vibe; });
	    // make a new type that agrees with mine
	    var types = Array(vibes.length);
	    for (var i=0; i<types.length; i=i+1) {
		types[i] = 0
		if (parseFloat(vibes[i]) === 1) { types[i] = types[i] + 1; }
		if (parseFloat(trends[i]) === 1) { types[i] = types[i] + 2; }
	    }

	    console.log(types);

	    var modalwidth = 558;
	    var modalheight = 495;
	    var boxwidth = modalwidth-20-10;
	    var boxheight = modalheight-40-25;

	    // select the innermost svg on the modal
	    var axes = bigshiftdiv.select("#shiftcanvas");

	    // reconstruct the scales
	    var margin = {top: 0, right: 0, bottom: 0, left: 0},
	    figwidth = boxwidth - margin.left - margin.right,
	    figheight = boxheight - margin.top - margin.bottom,
	    iBarH = 11;

	    var yHeight = (7+17*3+14+5), // 101
	    clipHeight = 100,
	    barHeight = (7+17*3+15), // 95
	    width = (figwidth-20), 	// give just enough room for the labels
	    height = (figheight-20);

	    var bigfigcenter = width/2;

	    var bigshiftx = d3.scale.linear()
		.domain([-Math.abs(sizes[0]),Math.abs(sizes[0])])
	    //.range([-x0,x0]);
		.range([(names[0].length+4.5)*5, width-(names[0].length+4.5)*5]);

	    // linear scale function
	    var bigshifty = d3.scale.linear()
		.domain([numWords+1,1])
		.range([height+2, yHeight]); 

	    var newbars = axes.selectAll("rect.shiftrect").data(sizes);
	    var newwords = axes.selectAll("text.shifttext").data(sizes);
	    
	    // if we haven't dont a subselection, apply with a transition
	    if (shiftseldecoder().current === "none" || shiftsledecoder().current.length === 0) {
		newbars.transition()
	            .attr("fill", function(d,i) { if (types[i] == 2) {return "#4C4CFF";} else if (types[i] == 3) {return "#FFFF4C";} else if (types[i] == 0) {return "#B3B3FF";} else { return "#FFFFB3"; }})
	            .attr("class", function(d,i) { return "shiftrect "+intStr[types[i]]; })
		    .attr("x",function(d,i) { 
			if (d>0) { return bigfigcenter; } 
			else { return bigshiftx(d)} })
		    .attr("height",function(d,i) { return iBarH; } )
		    .attr("width",function(d,i) { if ((d)>0) {return bigshiftx(d)-bigshiftx(0);} else {return bigshiftx(0)-bigshiftx(d); } } )

		newwords.transition()
	            .attr("class", function(d,i) { return "shifttext "+intStr[types[i]]; })
	            .style({"text-anchor": function(d,i) { if (sizes[i] < 0) { return "end";} else { return "start";}}, "font-size": 11})
	            .text(function(d,i) { if (types[i] == 0) {tmpStr = "-\u2193";} else if (types[i] == 1) {tmpStr = "\u2193+";}
	    				  else if (types[i] == 2) {tmpStr = "\u2191-";} else {tmpStr = "+\u2191";}
	    				  if (sizes[i] < 0) {return tmpStr.concat(names[i]);} else { return names[i].concat(tmpStr); } })
		    .attr("x",function(d,i) { if (d>0) {return bigshiftx(d)+2;} else {return bigshiftx(d)-2; } } );
	    }
	    // else apply without a transition
	    else {
		newbars
	            .attr("fill", function(d,i) { if (types[i] == 2) {return "#4C4CFF";} else if (types[i] == 3) {return "#FFFF4C";} else if (types[i] == 0) {return "#B3B3FF";} else { return "#FFFFB3"; }})
	            .attr("class", function(d,i) { return "shiftrect "+intStr[types[i]]; })
		    .attr("x",function(d,i) { 
			if (d>0) { return bigfigcenter; } 
			else { return bigshiftx(d)} })
		    .attr("height",function(d,i) { return iBarH; } )
		    .attr("width",function(d,i) { if ((d)>0) {return bigshiftx(d)-bigshiftx(0);} else {return bigshiftx(0)-bigshiftx(d); } } )

		newwords
	            .attr("class", function(d,i) { return "shifttext "+intStr[types[i]]; })
	            .style({"text-anchor": function(d,i) { if (sizes[i] < 0) { return "end";} else { return "start";}}, "font-size": 11})
	            .text(function(d,i) { if (types[i] == 0) {tmpStr = "-\u2193";} else if (types[i] == 1) {tmpStr = "\u2193+";}
	    				  else if (types[i] == 2) {tmpStr = "\u2191-";} else {tmpStr = "+\u2191";}
	    				  if (sizes[i] < 0) {return tmpStr.concat(names[i]);} else { return names[i].concat(tmpStr); } })
		    .attr("x",function(d,i) { if (d>0) {return bigshiftx(d)+2;} else {return bigshiftx(d)-2; } } );

		if (shiftseldecoder().current === "posup") {
		    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		}
		else if (shiftseldecoder().current === "negdown") {
		    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});		
		}
		else if (shiftseldecoder().current === "posdown") {
		    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		}
		else if (shiftseldecoder().current === "negup") {
		    axes.selectAll("rect.shiftrect.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.zero").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.one").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("rect.shiftrect.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform","translate(0,0)");
		    axes.selectAll("text.shifttext.two").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform","translate(0,0)");
		    axes.selectAll("rect.shiftrect.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1) }).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		    axes.selectAll("text.shifttext.three").transition().duration(1000).attr("y", function(d,i) { return bigshifty(i+1)+iBarH; } ).attr("transform",function(d,i) { if (d<0) { return "translate(-500,0)"; } else {return "translate(500,0)"; }});
		}
	    }

	    d3.json("http://s3.amazonaws.com/hedopostprocess/word-shift-results/metadata/" + cformat(newdate) + ".json", function(json2) {
		var havg = json2.map(function(d) { return d.trefhavg; });
		var tcomp = json2.map(function(d) { return d.tcomphavg; });

		var shifttotals = json[0];

		// console.log(havg);
		// console.log(tcomp);

		var modalbody = d3.select("#moveshifthere");
		// remove the text at the top
		modalbody.selectAll("p").remove();
		modalbody.insert("p","svg").attr("class","shifttitle pullleft").html(function(d,i) { return "<b>"+""+longerformat(newdate)+"</b>"; });
		if (bigdaytest) {
		    for (var i=0; i<bigdays.length; i++) {
			//console.log(bigdays[i].date);
			if (bigdays[i].date.getTime() === newdate.getTime()) {
			    console.log("major event");
			    modalbody.insert("p","svg").attr("class","shifttitle pullright").html(function() { return "<b>"+""+bigdays[i].longer+"</b>"; });
			    break;
			}
		    }
		}
		else {
		    modalbody.insert("p","svg").attr("class","shifttitle pullright").html(function() { return "<br>"; });
		}	    
		modalbody.insert("p","svg").attr("class","shifttitle").text(function(d,i) { return "Average Happiness: "+parseFloat(tcomp).toFixed(3); });
		modalbody.insert("p","svg").text(function() {
		    var head = "What's making this day ";
		    return havg <= tcomp ? head + "happier than the last seven days:" : head + "sadder than the last seven days:";
		});

		// var sumTypes = [8,-10,-6,14];
		var sumTypes = [json2[0].normnegdown,-json2[0].normnegup,-json2[0].normposdown,json2[0].normposup]

		var maxShiftSum = Math.max(Math.abs(sumTypes[1]),Math.abs(sumTypes[2]),sumTypes[0],sumTypes[3]);

		topScale = d3.scale.linear()
		    .domain([-maxShiftSum,maxShiftSum])
		    .range([width*.1,width*.9]);

		// define the RHS summary bars so I can add if needed
		// var summaryArray = [sumTypes[3],sumTypes[0],sumTypes[3]+sumTypes[1],d3.sum(sumTypes)];
		var summaryArray = [sumTypes[3],sumTypes[0],d3.sum(sumTypes)];

		var newRtopbars = axes.selectAll(".sumrectR")
		    .data(summaryArray);
		
		newRtopbars.transition()
		    .attr("x",function(d,i) { 
			if (d>0) { 
			    return bigfigcenter;
			} 
			else { return topScale(d)} })
		    .attr("width",function(d,i) { if (d>0) {return topScale(d)-bigfigcenter;} else {return bigfigcenter-topScale(d); } } );

		var newRtoptext = axes.selectAll(".sumtextR")
		    .data([sumTypes[3],sumTypes[0],d3.sum(sumTypes)]);

		newRtoptext.transition().attr("class", "sumtextR")
		    .style("text-anchor",function(d,i) { if (d>0) {return "start";} else {return "end";} })
		    .attr("x",function(d,i) { return topScale(d)+5*d/Math.abs(d); });

		
		var summaryArray = [sumTypes[1],sumTypes[2],sumTypes[0]+sumTypes[2]];

		var newLtopbars = axes.selectAll(".sumrectL")
		    .data(summaryArray);

		newLtopbars.transition().attr("fill", function(d,i) { 
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
				    return topScale(d)-(bigfigcenter-topScale((sumTypes[3]+sumTypes[1])));
				}
			    } 
			    else { 
				if (d>0) {return bigfigcenter} 
				else { return topScale(d)} }
			}
		    })
		    .attr("width",function(d,i) { if (d>0) {return topScale(d)-bigfigcenter;} else {return bigfigcenter-topScale(d); } } );

		var newLtoptext = axes.selectAll(".sumtextL")
		    .data([sumTypes[1],sumTypes[2]]);

		newLtoptext.transition().attr("x",function(d,i) { return topScale(d)-5; });

	    }); // d3.json metadata

	}); // d3.json 

	// d3.select("#dp1").attr("value",function() { return cformat(newdate); });

	// $('#dp1').datepicker('setDate',newdate);

    } // nextDay

    // make sure to remvoe the url bar junk when closed
    $('#myModal').on('hidden.bs.modal', function (e) {
	dateencoder.varval("none");
	dateencoder.destroy();
	shiftselencoder.varval("none");
	shiftselencoder.destroy();
    });

    $('#dp1').datepicker({
	autoclose: true,
	format: 'yyyy-mm-dd',
	orientation: 'top-left',
	language: 'en',
	startDate: minDate,
	endDate: maxDate,
    }).on('changeDate',function(e) {
	// compute the offset
	console.log(e.date);
	nextDay(e.date);
	});

    // d3.select(".x.brush").call(brush.event);

    if (datedecoder().current !== "none" && datedecoder().current.length > 0) {
	var pulldate = cformat.parse(datedecoder().current);
	// drawSmallShift(100,100,cformat.parse(datedecoder().current),true);
	//resetButton();
	transitionBigShift(pulldate);
    }

    addDays = function addDays(date, days) {
	var result = new Date(date);
	result.setDate(date.getDate() + days);
	return result;
    }
    

})();


