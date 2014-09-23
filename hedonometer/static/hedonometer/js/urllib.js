/*
d3.urllib
=========

a simple d3 plugin to manage pushing and pulling the visualization state to the brower url

tests
-----
no test suite, I've tested in in Chrome v35 for reasonable use cases

example
-------
also no simple example, but you can see it in use here:
http://www.uvm.edu/storylab/share/papers/dodds2014a/books.html

documentation
-------------
slightly more documentation in the README

new:

decoder returns { current, cached } values
the current will be blank if there is nothing in the url
but the cached remains
I like this feature

*/
(function() {
    d3.urllib = {
	encoder: function() {
	    var varname = "tmp";
	    var varval = [];
	    var show = true;
	    //var that = this;
	    
	    function urllib(d) {
		// nothing yet
		//console.log(this);
		//console.log(that);
		return {current: varval,};
	    }

	    function parseurl() {
		GET = {};
		query = window.location.search.substring(1).split("&");
		// break down the url
		for (var i = 0, max = query.length; i < max; i++)
		{
		    if (query[i] === "") // check for trailing & with no param
			continue;
		    var param = query[i].split("=");
		    GET[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
		}

		baseUrl = window.location.origin+window.location.pathname;
		var tmpStr = ""
		if (typeof varval == 'string' || varval instanceof String)
		{ tmpStr+=varval; }
		else
		{
		    tmpStr += "["+varval[0]
		    for (var i=1; i<varval.length; i++) { tmpStr += ","+varval[i]; }
		    tmpStr+="]"
		}
		GET[varname] = tmpStr;

		var urlString = ""
		for (var key in GET) {
		    if (GET.hasOwnProperty(key)) {
			if (varname === key) {
			    // console.log("found that variable");
			    // console.log(show);
			    if (show) {
				urlString += key+"="+GET[key]+"&";
			    }
			}
			else { urlString += key+"="+GET[key]+"&"; }
		    }
		}

		urlString = urlString.substring(0,urlString.length-1);
		
		// only add to url if there is stuff
		if (urlString.length > 0) {
		    newDataUrl = baseUrl+"?"+urlString
		}
		else { newDataUrl = baseUrl; }

		window.history.replaceState("object or string", "title",newDataUrl);

		return urllib;
	    }

	    urllib.varname = function(_) {
		if (!arguments.length) return varname;
		varname = _;
		return urllib;
	    }

	    urllib.destroy = function() {
		show = false;
		parseurl();
		show = true;
		// return urllib;
	    }

	    urllib.varval = function(_) {
		if (!arguments.length) return varval;
		varval = _;
		return parseurl();
	    }

	    return urllib;
	},
	decoder: function() {
	    var varname = "tmp";
	    var varresult = [];
	    var defvalue = [];
	    
	    function urllib(d) {
		parseurl();
		return {current: varresult,
		       cached: defvalue};
	    }

	    function parseurl() {
		GET = {};
		query = window.location.search.substring(1).split("&");
		for (var i = 0, max = query.length; i < max; i++) {
		    if (query[i] === "") // check for trailing & with no param
			continue;
		    var param = query[i].split("=");
		    GET[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
		}

		if (varname in GET) {
		    if (GET[varname].length > 0 && GET[varname][0] === "[") {
			if (GET[varname][GET[varname].length-1] === "]") { 
			    var tmpArray = GET[varname].substring(1, GET[varname].length - 1).split(',');
			}
			else {
			    var tmpArray = GET[varname].substring(1, GET[varname].length).split(',');
			}
			varresult = tmpArray;
			defvalue = tmpArray;
		    }
		    else {
			varresult = GET[varname];
			defvalue = GET[varname];
		    }
		}
		else {
		    // if there is nothing in the url...we'll let the value
		    // live. this next line would kill the value
		    varresult = ""
		}
		return urllib;
	    }

	    urllib.varname = function(_) {
		if (!arguments.length) return varname;
		varname = _;
		return parseurl();
	    }

	    urllib.varresult = function(_) {
		if (!arguments.length) return varresult;
		varresult = _;
		defvalue = _;
		return urllib;
	    }

	    return urllib;
	}
    }
})();











