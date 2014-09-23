function computeHapps() {
    // rolling timeseries of happiness
    // 
    var timeseries = Array(allDataRaw.length-minWindows);
    begtimeseries = Array(minWindows/2);
    endtimeseries = Array(minWindows/2);
    var vtimeseries = Array(allDataRaw.length-minWindows);
    var begvtimeseries = Array(minWindows/2);
    var endvtimeseries = Array(minWindows/2);
    
    // initialize the frequency and N with 0
    var N = 0;//d3.sum(allData[0]);
    var freq = Array(allData[0].length);
    for (var i=0; i<allData[0].length; i++) {
        freq[i] = 0; //allData[0][i];
    }

    // add until we have the min number of windows
    for (var j=0; j<minWindows/2; j++) {
	N+=d3.sum(allData[j]);
	for (var i=0; i<allData[j].length; i++) {
            freq[i] += allData[j][i];
	}
    }
    for (var j=minWindows/2; j<minWindows; j++) {


	// compute the beginning happs and and variance
	var happs = 0.0;
	for (var i=0; i<allData[j].length; i++) {
	    happs += freq[i]*lens[i];
	}
	//console.log(happs);
	//console.log(happs/N);
	begtimeseries[j-minWindows/2] = happs/N;
	var variance = 0.0;
	for (var i=0; i<allData[j].length; i++) {
	    variance += freq[i]*Math.pow(parseFloat(lens[i])-begtimeseries[j-minWindows/2],2);
	}
	begvtimeseries[j-minWindows/2] = variance/N;

	N+=d3.sum(allData[j]);
	for (var i=0; i<allData[j].length; i++) {
            freq[i] += allData[j][i];
	}

    }

    // compute the first point of happiness
    var happs = 0.0;
    for (var i=0; i<allData[j].length; i++) {
	happs += freq[i]*lens[i];
    }
    timeseries[0] = happs/N;
    var variance = 0.0;
    for (var i=0; i<allData[j].length; i++) {
	variance += freq[i]*Math.pow(parseFloat(lens[i])-timeseries[0],2);
    }
    vtimeseries[0] = variance/N;
    // console.log(N);
    // console.log(freq);
    // console.log(d3.sum(freq));
    // roll forward
    for (var j=1; j<timeseries.length; j++) {
	var happs = 0.0
	N+=d3.sum(allData[j+minWindows-1])
	//console.log(N);
	//console.log(allData[0]);
	N-=d3.sum(allData[j-1])
	for (var i=0; i<allData[j+minWindows-1].length; i++) {
	    freq[i] += allData[j+minWindows-1][i];
	    freq[i] -= allData[j-1][i];
	    //console.log(freq[i]);
	    happs += freq[i]*lens[i];
	}
	//console.log(happs);
	//console.log(happs/N);
	timeseries[j] = happs/N;
	var variance = 0.0;
	for (var i=0; i<allData[j+minWindows-1].length; i++) {
	    variance += freq[i]*Math.pow(parseFloat(lens[i])-timeseries[j],2);
	}
	vtimeseries[j] = variance/N;
    }

    for (var j=timeseries.length; j<timeseries.length+minWindows/2; j++) {
	var happs = 0.0
	N-=d3.sum(allData[j-1])
	for (var i=0; i<allData[j-1].length; i++) {
	    freq[i] -= allData[j-1][i];
	    //console.log(freq[i]);
	    happs += freq[i]*lens[i];
	}
	//console.log(happs);
	//console.log(happs/N);
	endtimeseries[j-timeseries.length] = happs/N;
	var variance = 0.0;
	for (var i=0; i<allData[j-1].length; i++) {
	    variance += freq[i]*Math.pow(parseFloat(lens[i])-endtimeseries[j-timeseries.length],2);
	}
	endvtimeseries[j-timeseries.length] = variance/N;
    }
    // console.log("inside computeHappsChapters");
    // console.log(timeseries);
    // console.log(vtimeseries);
    // console.log(begtimeseries);
    // console.log(endtimeseries);
    fulltimeseries = begtimeseries.concat(timeseries).concat(endtimeseries);
    // console.log(fulltimeseries);
    // console.log(begvtimeseries);
    // console.log(endvtimeseries);
    return timeseries;
}











