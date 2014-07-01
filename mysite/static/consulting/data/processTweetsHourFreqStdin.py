# look at the happiness of words around an event
#
# USAGE
# gzip -cd tweets.tgz | python processTweetsHourFreqStdin.py 2014 01 01 keywords

# we'll use most of these
from json import loads
import codecs
import time
import gzip
import tarfile
import re
import numpy
from labMTsimple.storyLab import *
import sys

def tweetreader(tweettext,keyWords,freqList,memberHourDate,labMT,labMTvector,labMTfreqList):
    raw_text = [x.lower().lstrip("?';:.$%&()\\!*[]{}|\"<>,^-_=+").rstrip("@#?';:.$%&()\\!*[]{}|\"<>,^-_=+") for x in re.split('\s|--',tweettext,flags=re.UNICODE)]
    # print raw_text
    for i in xrange(len(keyWords)):
        for word in raw_text:
            if keyWords[i] == word:
                # print "found "+keyWords[i]
                freqList[i][int(memberHourDate[3:5])-1] += 1
                # find labMT words and add to labMT vector
                valence,fvec = emotion(tweettext,labMT,shift=True,happsList=labMTvector)
                labMTfreqList[i][int(memberHourDate[3:5])] += numpy.array(fvec)
            # ends if keywords[i] == word
        # ends for work in raw_text
    # ends for len(keyWords)

def gzipper(freqList,labMTfreqList,keyWords):
    lang = 'english'
    # load in the labMT stuff
    labMT,labMTvector,labMTwordList = emotionFileReader(stopval=0.0,fileName='labMT2'+lang+'.txt',returnVector=True)

    tar = tarfile.open(mode="r|", fileobj=sys.stdin)
    for tarinfo in tar:
        if tarinfo.isfile():
            print tarinfo.name
            memberHourDate = tarinfo.name[17:-5]
            f = tar.extractfile(tarinfo)
            for line in f:
                try:
                    tweet = loads(line)
                except:
                    print "failed to load a tweet"
                try:
                    if tweet['text']:
                        tweetreader(tweet['text'],keyWords,freqList,memberHourDate,labMT,labMTvector,labMTfreqList)
                except:
                    # print "no text"
                    pass
                # ends try:
            # ends for line in f:
        # ends if .isfile():
    # ends for tarinfo in tar
    tar.close()

if __name__ == '__main__':
  # load the things
  from sys import argv
  [year,month,day] = map(int,argv[1:4])
  eventName = argv[4]

  # read in more things
  eventFolder = '/users/a/r/areagan/fun/twitter/unilever/{}'.format(eventName)
  f = codecs.open('/users/a/r/areagan/fun/twitter/unilever/keywords.txt'.format(eventFolder),'r','utf8')
  keyWords = [line.rstrip().lower() for line in f]
  f.close()
  del(keyWords[-1])
  del(keyWords[-1])
  
  # check these are the right keywords!
  print keyWords

  folderNames = ['{0}/{1}/tweets'.format(eventFolder,re.sub('&','&',re.sub('\'','',re.sub('\s','-',keyword)))) for keyword in keyWords]
  print folderNames

  # format date
  import datetime
  date = datetime.datetime(year,month,day)
  
  # freqList will store everything
  # [keyword][minute][labMTindex]
  # freqList = [[[0 for i in xrange(10222)] for i in xrange(1440)] for key in keyWords]
  labMTfreqList = [[numpy.zeros(10222) for j in xrange(24)] for key in xrange(len(keyWords))]
  freqList = [[0 for j in xrange(24)] for key in xrange(len(keyWords))]
  # fname = date.strftime('/users/c/d/cdanfort/scratch/twitter/tweet-troll/zipped-raw/%d.%m.%y.tgz')
  # print fname
  gzipper(freqList,labMTfreqList,keyWords)

  print "complete"

  # dump this to the screen in case something goes wrong
  # print freqList
  # print labMTfreqList

  for i in xrange(len(keyWords)):
    f = open('{0}/{1}-frequency-{2}.csv'.format(folderNames[i],date.strftime('%d.%m.%y'),i),'w')
    for j in xrange(len(freqList[i])):
      f.write('{0}\n'.format(str(freqList[i][j])))
    f.close()

    f = open('{0}/{1}-word-vector-{2}.csv'.format(folderNames[i],date.strftime('%d.%m.%y'),i),'w')
    for j in xrange(len(labMTfreqList[i])):
      for k in xrange(len(labMTfreqList[i][j])):
        f.write('{0:.0f},'.format(labMTfreqList[i][j][k]))
      f.write('\n')
    f.close()


