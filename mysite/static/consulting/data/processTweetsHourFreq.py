# look at the happiness of words around an event
#
# USAGE
# python processTweets.py 2014 01 01 keywords

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

def parser(infile,freqList,labMTfreqList,keyWords,eventFolder):
  # take in the filename infile, a tgz, and read it
  # check each tweet for some keywords
  # if the keywords are in the tweet, tally that, and save the text
  #   to a file corresponding to it's hour of origin

  lang = 'english'

  # load in the labMT stuff
  labMT,labMTvector,labMTwordList = emotionFileReader(stopval=0.0,fileName='labMT2'+lang+'.txt',returnVector=True)

  numFiles = 0

  # got rid of the try loop, keeping fingers crossed for real data
  tar = tarfile.open(infile,'r:gz')
  for member in tar.getmembers():
    numFiles += 1
    # feedback of where this script is
    print member.name
    # grab out the hour.day.month.year
    memberHourDate = member.name[17:-5]
    memberMinuteDate = member.name[17:-5]
    # check that this is a file (the folder is in the tar)
    if len(memberHourDate) > 0:
      f = tar.extractfile(member)
      for line in f:
        try:
          tweet = loads(line)
        except:
          print "failed to load a tweet"
        try:
          if tweet['text']:
            raw_text = [x.lower().lstrip("?';:.$%&()\\!*[]{}|\"<>,^-_=+").rstrip("@#?';:.$%&()\\!*[]{}|\"<>,^-_=+") for x in re.split('\s|--',tweet['text'],flags=re.UNICODE)]
            # print raw_text
            for i in xrange(len(keyWords)):
              for word in raw_text:
                if keyWords[i] == word:
                  # print i
                  # print 'found a tweet with {0}'.format(keyWords[i])
                  # open corresponding outfile
                  # g = codecs.open('{0}/{1}.txt'.format(folderNames[i],memberMinuteDate),'a','utf8')
                  # g.write('{}\n'.format(tweet['text']))
                  # g.close()
                  # add to the frequency list
                  # print int(memberHourDate[3:5])
                  # print len(freqList)
                  # print len(freqList[i])
                  freqList[i][int(memberHourDate[3:5])-1] += 1
                  # find labMT words and add to labMT vector
                  # print tweet['text']
                  valence,fvec = emotion(tweet['text'],labMT,shift=True,happsList=labMTvector)
                  # print valence
                  # print len(fvec)
                  # print int(memberHourDate[0:2])
                  # print len(numpy.array(fvec))
                  # print len(labMTfreqList[i][int(memberHourDate[3:5])-1])
                  labMTfreqList[i][int(memberHourDate[3:5])] += numpy.array(fvec)
        except:
          # print "Unexpected error:", sys.exc_info()[0]
          pass
      f.close()
    # if numFiles == 3:
      # break
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
  fname = date.strftime('/users/c/d/cdanfort/scratch/twitter/tweet-troll/zipped-raw/%d.%m.%y.tgz')
  print fname
  parser(fname,freqList,labMTfreqList,keyWords,eventFolder)

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
        f.write('{0},'.format(str(labMTfreqList[i][j][k])))
      f.write('\n')
    f.close()

  # f = open('{0}/output.csv'.format(eventFolder),'a')
  # for i in xrange(len(freqList)):
  #   f.write('{0}'.format(freqList[i][0]))
  #   for j in xrange(1,len(freqList[i])):
  #     f.write(',{0}'.format(freqList[i][j]))
  #   f.write('\n')
  # f.close()
  
