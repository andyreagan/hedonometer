function shift(refF,compF,lens,words) {
    /* shift two frequency vectors
       -assume they've been zero-ed for stop words
       -lens is of full length
       -words is a list of utf8 strings

       return an object with the sorted quantities for plotting the shift
    */

    //normalize frequencies
    var Nref = 0.0;
    var Ncomp = 0.0;
    for (var i=0; i<refF.length; i++) {
        Nref += parseFloat(refF[i]);
        Ncomp += parseFloat(compF[i]);
    }

    // for (var i=0; i<refF.length; i++) {
    //     refF[i] = parseFloat(refF[i])/Nref;
    //     compF[i] = parseFloat(compF[i])/Ncomp;
    // }
    
    // compute reference happiness
    var refH = 0.0;
    var refV = 0.0;
    for (var i=0; i<refF.length; i++) {
        refH += refF[i]*parseFloat(lens[i]);
    }
    refH = refH/Nref;
    console.log(refH);
    for (var i=0; i<refF.length; i++) {
	refV += refF[i]*Math.pow(parseFloat(lens[i])-refH,2);
    }
    refV = refV/Nref; 
    console.log(refV);

    // compute comparison happiness
    var compH = 0.0;
    for (var i=0; i<compF.length; i++) {
        compH += compF[i]*parseFloat(lens[i]);
    }
    compH = compH/Ncomp;

    // do the shifting
    var shiftMag = Array(refF.length);
    var shiftType = Array(refF.length);
    var freqDiff = 0.0;
    for (var i=0; i<refF.length; i++) {
	freqDiff = compF[i]/Ncomp-refF[i]/Nref;
        shiftMag[i] = (parseFloat(lens[i])-refH)*freqDiff;
	if (freqDiff > 0) { shiftType[i] = 2; }
	else { shiftType[i] = 0}
	if (parseFloat(lens[i]) > refH) { shiftType[i] += 1;}
    }

    // do the sorting
    var indices = Array(refF.length);
    for (var i = 0; i < refF.length; i++) { indices[i] = i; }
    indices.sort(function(a,b) { return Math.abs(shiftMag[a]) < Math.abs(shiftMag[b]) ? 1 : Math.abs(shiftMag[a]) > Math.abs(shiftMag[b]) ? -1 : 0; });

    var sortedMag = Array(refF.length);
    var sortedType = Array(refF.length);
    var sortedWords = Array(refF.length);

    for (var i = 0; i < refF.length; i++) { 
	sortedMag[i] = shiftMag[indices[i]]; 
	sortedType[i] = shiftType[indices[i]]; 
	sortedWords[i] = words[indices[i]]; 
    }

    // compute the sum of contributions of different types
    var sumTypes = [0.0,0.0,0.0,0.0];
    for (var i = 0; i < refF.length; i++)
    { 
        sumTypes[shiftType[i]] += shiftMag[i];
    }

    // return as an object
    return {
      sortedMag: sortedMag,
      sortedType: sortedType,
      sortedWords: sortedWords,
      sumTypes: sumTypes,
      refH: refH,
      compH: compH,
    };
};











