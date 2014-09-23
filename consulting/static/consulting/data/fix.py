# take the hourly-frequency and word vectors
# sum them to day level
# compute happiness at hour level, day level
# for all keywords
#
# USAGE: 
# python rest.py 2014-01-01 2014-06-26

import codecs
from labMTsimple.storyLab import *
import datetime
import copy
import numpy as np
import sys
import re

if __name__ == '__main__':
    [year,month,day] = map(int,sys.argv[1].split('-'))
    start = datetime.datetime(year,month,day)

    [year,month,day] = map(int,sys.argv[2].split('-'))
    end = datetime.datetime(year,month,day)

    f = codecs.open('keywords.txt','r','utf8')
    keyWords = [line.rstrip().lower() for line in f]
    f.close()
    del(keyWords[-1])
    del(keyWords[-1])
    
    # check these are the right keywords!
    print keyWords
    print len(keyWords)
    folderNames = ['{0}'.format(re.sub('&','&',re.sub('\'','',re.sub('\s','-',keyword)))) for keyword in keyWords]
    print folderNames

    lang = "english"
    labMT,labMTvector,labMTwordList = emotionFileReader(stopval=0.0,fileName='labMT2'+lang+'.txt',returnVector=True)
    
    # loop over keywords
    wordCount = 64
    # print keyWords[22]
    for keyword in [keyWords[65]]: #[keyWords[22]]:
        wordCount += 1
        print keyword
        print folderNames[wordCount]

        # loop over time
        currDay = copy.copy(start)
        while currDay <= end:
            # empty array
            freqarray = np.zeros(24)
            dayfreqarray = np.zeros(1)
            happsarray = np.zeros(24)
            dayhappsarray = np.zeros(1)
            wordarray = [np.zeros(10222) for i in xrange(24)]
            daywordarray = np.zeros(10222)

            print 'reading keywords/{0}/{1}-word-vector-{2}-sum.csv'.format(folderNames[wordCount],currDay.strftime('%d.%m.%y'),wordCount,)
            f = codecs.open('keywords/{0}/{1}-word-vector-{2}-sum.csv'.format(folderNames[wordCount],currDay.strftime('%d.%m.%y'),wordCount,),'r','utf8')
            daywordarray = np.array(map(float,f.read().split(',')[1:10222]))
            # print daywordarray
            # print len(daywordarray)
            # compute happiness of the word vectors
            daywordarray = np.append(daywordarray,0)
            # print len(daywordarray)
            # print daywordarray[59]

            # write out the sum vector
            print 'writing keywords/{0}/{1}-word-vector-{2}-sum.csv'.format(folderNames[wordCount],currDay.strftime('%d.%m.%y'),wordCount,)
            f = codecs.open('keywords/{0}/{1}-word-vector-{2}-sum.csv'.format(folderNames[wordCount],currDay.strftime('%d.%m.%y'),wordCount,),'w','utf8')
            for i in xrange(10222):
                f.write('{0:.0f},'.format(daywordarray[i]))
            f.close()

            # increase the days
            currDay += datetime.timedelta(days=1)
        
    




