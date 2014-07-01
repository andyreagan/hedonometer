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

def parser(infile,freqList,keyWords,eventFolder):
  # take in the filename infile, a tgz, and read it
  # check each tweet for some keywords
  # if the keywords are in the tweet, tally that, and save the text
  #   to a file corresponding to it's hour of origin
  
  # got rid of the try loop, keeping fingers crossed for real data
  tar = tarfile.open(infile,'r:gz')
  # for member in tar.getmembers():
  while True:
    member = tar.next()
    if member.isfile():
      # feedback of where this script is
      print member.name
      # grab out the hour.day.month.year
      memberHourDate = member.name[17:-5]
      memberMinuteDate = member.name[17:-5]

      f = tar.extractfile(member)
      # try:
      for line in f:
        try:
          tweet = loads(line)
        except:
          print "failed to load a tweet"
        try:
          if tweet['text']:
            for i in xrange(len(keyWords)):
              if keyWords[i] in tweet['text'].lower():
                # print 'found a tweet'
                # open corresponding outfile
                g = codecs.open('{0}/{1}.txt'.format(folderNames[i],memberMinuteDate),'a','utf8')
                # freqList[int(memberHourDate[0:2])+int(memberHourDate[3:5])*60][i] += 1
                g.write('{}\n'.format(tweet['text']))
                g.close()
        except:
          print 'something went wrong'
          pass
      # except:
      #   print 'could not loop over f (or decode line)'
      f.close()
    elseif member.isdir():
      pass
    else:
      break
      
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
  freqList = []
  fname = date.strftime('/users/c/d/cdanfort/scratch/twitter/tweet-troll/zipped-raw/%d.%m.%y.tgz')
  print fname
  parser(fname,freqList,keyWords,eventFolder)

  print "complete"

  # dump this to the screen in case something goes wrong
  # print freqList

  # f = open('{0}/output.csv'.format(eventFolder),'a')
  # for i in xrange(len(freqList)):
  #   f.write('{0}'.format(freqList[i][0]))
  #   for j in xrange(1,len(freqList[i])):
  #     f.write(',{0}'.format(freqList[i][j]))
  #   f.write('\n')
  # f.close()
  
