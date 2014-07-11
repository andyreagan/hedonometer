function computeHapps() {
    for (var j=0; j<51; j++) {
	// compute total frequency
	var N = 0.0;
	for (var i=0; i<allData[j].freq.length; i++) {
            N += parseFloat(allData[j].freq[i]);
	}
	var happs = 0.0;
	for (var i=0; i<allData[j].freq.length; i++) {
            happs += parseFloat(allData[j].freq[i])*parseFloat(lens[i]);
	}
	allData[j].avhapps = happs/N;
    }
}
