function shift(rrefF,ccompF,lens,words) {
/* shift two frequency vectors
   -assume they've been zero-ed for stop words
   -lens is of full length (scores)
   -words is a list of utf8 strings

   return an object with the sorted quantities for plotting the shift
*/

    //normalize frequencies
    var Nref = d3.sum(rrefF);
    var Ncomp = d3.sum(ccompF);

    // compute reference happiness
    var refH = 0.0;
    for (var i=0; i<rrefF.length; i++) {
        refH += rrefF[i]*lens[i];
    }
    refH = refH/Nref;

    // compute comparison happiness
    var compH = 0.0;
    for (var i=0; i<ccompF.length; i++) {
        compH += ccompF[i]*lens[i];
    }
    compH = compH/Ncomp;

    // do the shifting
    var shiftMag = Array(rrefF.length);
    var shiftType = Array(rrefF.length);
    var freqDiff = 0.0;
    for (var i=0; i<rrefF.length; i++) {
	freqDiff = ccompF[i]/Ncomp-rrefF[i]/Nref;
        shiftMag[i] = (lens[i]-refH)*freqDiff;
	if (freqDiff > 0) { shiftType[i] = 2; }
	else { shiftType[i] = 0}
	if (lens[i] > refH) { shiftType[i] += 1;}
    }

    // do the sorting
    var indices = Array(rrefF.length);
    for (var i = 0; i < rrefF.length; i++) { indices[i] = i; }
    indices.sort(function(a,b) { return Math.abs(shiftMag[a]) < Math.abs(shiftMag[b]) ? 1 : Math.abs(shiftMag[a]) > Math.abs(shiftMag[b]) ? -1 : 0; });

    var sortedMag = Array(rrefF.length);
    var sortedType = Array(rrefF.length);
    var sortedWords = Array(rrefF.length);
    var sortedWordsEn = Array(rrefF.length);

    for (var i = 0; i < rrefF.length; i++) { 
	sortedMag[i] = shiftMag[indices[i]]; 
	sortedType[i] = shiftType[indices[i]]; 
	sortedWords[i] = words[indices[i]];
	sortedWordsEn[i] = words_en[indices[i]]; 
    }

    // compute the sum of contributions of different types
    var sumTypes = [0.0,0.0,0.0,0.0];
    for (var i = 0; i < rrefF.length; i++)
    { 
        sumTypes[shiftType[i]] += shiftMag[i];
    }

    // return as an object
    return {
      sortedMag: sortedMag,
      sortedType: sortedType,
      sortedWords: sortedWords,
      sortedWordsEn: sortedWordsEn,
      sumTypes: sumTypes,
      refH: refH,
      compH: compH,
    };
};









