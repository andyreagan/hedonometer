function computeHapps() {
    // rolling timeseries of happiness
    // 
    var timeseries = Array(allDataRaw.length-minWindows);
    
    // initialize the frequency and N with 0
    var N = 0;//d3.sum(allData[0]);
    var freq = Array(allData[0].length);
    for (var i=0; i<allData[0].length; i++) {
        freq[i] = 0; //allData[0][i];
    }
    // add until we have the min number of windows
    for (var j=0; j<minWindows; j++) {
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
    }
    // console.log("inside computeHappsChapters");
    // console.log(timeseries);
    return timeseries;
}









