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
    var N = 0;
    var freq = Array(allDataRaw[0].length);
    for (var i=0; i<allDataRaw[0].length; i++) {
        freq[i] = 0;
    }

    // add until we have the min number of windows
    for (var j=0; j<minWindows/2; j++) {
	// stop it each time
	// var tmpv = hedotools.shifter.istopper(allDataRaw[j]);
	// N+=d3.sum(tmpv);
	// for (var i=0; i<tmpv.length; i++) {
        //     freq[i] += tmpv[i];
	// }
	// don't stop it all all
	// N+=d3.sum(allDataRaw[j]);
	for (var i=0; i<allDataRaw[j].length; i++) {
            freq[i] += allDataRaw[j][i];
	}
    }

    for (var j=minWindows/2; j<minWindows; j++) {
	// compute the beginning happs and and variance
	var happs = 0.0;
	// assume that the vector freq has been stopped
	// for (var i=0; i<allDataRaw[j].length; i++) {
	//     happs += freq[i]*lens[i];
	// }
	// stop the freq vector
	freq = hedotools.shifter.istopper(freq);
	// recalculate N
	N = d3.sum(freq);
	for (var i=0; i<allDataRaw[j].length; i++) {
	    happs += freq[i]*lens[i];
	}
	//console.log(happs);
	//console.log(happs/N);
	begtimeseries[j-minWindows/2] = happs/N;
	var variance = 0.0;
	for (var i=0; i<allDataRaw[j].length; i++) {
	    variance += freq[i]*Math.pow(parseFloat(lens[i])-begtimeseries[j-minWindows/2],2);
	}
	begvtimeseries[j-minWindows/2] = variance/N;

	// just add up
	for (var i=0; i<allDataRaw[j].length; i++) {
            freq[i] += allDataRaw[j][i];
	}
	// stop along the way
	// tmpv = hedotools.shifter.istopper(allDataRaw[j]);
	// N+=d3.sum(tmpv);
	// for (var i=0; i<tmpv.length; i++) {
        //     freq[i] += tmpv[i];
	// }
    }

    // compute the first point of happiness
    var happs = 0.0;
    // stop the freq vector
    freq = hedotools.shifter.istopper(freq);
    for (var i=0; i<allDataRaw[j].length; i++) {
	happs += freq[i]*lens[i];
    }
    // recalculate N
    N = d3.sum(freq);
    timeseries[0] = happs/N;

    var variance = 0.0;
    for (var i=0; i<allDataRaw[j].length; i++) {
	variance += freq[i]*Math.pow(parseFloat(lens[i])-timeseries[0],2);
    }
    vtimeseries[0] = variance/N;
    // console.log(N);
    // console.log(freq);
    // console.log(d3.sum(freq));

    // roll forward
    for (var j=1; j<timeseries.length; j++) {
	// N+=d3.sum(allDataRaw[j+minWindows-1])
	// console.log(N);
	// N-=d3.sum(allDataRaw[j-1])
	for (var i=0; i<allDataRaw[j+minWindows-1].length; i++) {
	    freq[i] += allDataRaw[j+minWindows-1][i];
	    freq[i] -= allDataRaw[j-1][i];
	}

	var happs = 0.0
	// stop the freq vector
	freq = hedotools.shifter.istopper(freq);
	for (var i=0; i<allDataRaw[j].length; i++) {
	    happs += freq[i]*lens[i];
	}
	// recalculate N
	N = d3.sum(freq);

	//console.log(happs);
	//console.log(happs/N);
	timeseries[j] = happs/N;
	var variance = 0.0;
	for (var i=0; i<allDataRaw[j+minWindows-1].length; i++) {
	    variance += freq[i]*Math.pow(parseFloat(lens[i])-timeseries[j],2);
	}
	vtimeseries[j] = variance/N;
    }

    for (var j=timeseries.length; j<timeseries.length+minWindows/2; j++) {
	for (var i=0; i<allDataRaw[j-1].length; i++) {
	    freq[i] -= allDataRaw[j-1][i];
	    //console.log(freq[i]);
	}

	var happs = 0.0
	// stop the freq vector
	freq = hedotools.shifter.istopper(freq);
	for (var i=0; i<allDataRaw[j].length; i++) {
	    happs += freq[i]*lens[i];
	}
	// recalculate N
	N = d3.sum(freq);

	//console.log(happs);
	//console.log(happs/N);
	endtimeseries[j-timeseries.length] = happs/N;
	var variance = 0.0;
	for (var i=0; i<allDataRaw[j-1].length; i++) {
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











