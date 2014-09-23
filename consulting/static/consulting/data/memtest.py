# freqList = [[[0 for i in xrange(10222)] for i in xrange(1440)] for key in xrange(82)]
# freqList = [[0 for i in xrange(10222)] for i in xrange(1440)]
freqList = [[[0 for i in xrange(10222)] for j in xrange(24)] for key in xrange(82)]
f = open("testfreqlist.csv","w")
for i in xrange(len(freqList)):
    for j in xrange(len(freqList[0])):
        f.write(str(freqList[i][j]))
        f.write(",")
    f.write("\n")
f.close()
