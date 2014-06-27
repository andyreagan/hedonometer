# convert 50K word vectors in 10222 word vectors (the ones we have scores for)
#
# USAGE
#
# python transform10k.py 

import sys
import codecs

def writeindexfile(name):
  lang = "english"

  f = codecs.open("labMT/labMTwords-"+lang+".csv","r","utf8")
  tmp = f.read()
  f.close()

  lines = tmp.split("\n")

  # print len(lines)
  # print lines[0:10]
  # print lines[10220:10230]

  words = lines
  
  # del(lines[-1])

  # load in the longer version
  f = codecs.open("labMT/labMTwordsLonger.csv","r","utf8")
  tmp = f.read()
  f.close()

  longerlines = tmp.split(",")

  # print len(longerlines)
  # print longerlines[0:10]
  # print longerlines[49990:50020]

  del(longerlines[0])

  # print len(longerlines)
  # print longerlines[0:10]
  # print longerlines[49990:50020]


  longerwords = [x.split(u'\n')[0].rstrip() for x in longerlines]

  # print len(longerwords)
  # print longerwords[0:10]
  # print longerwords[49990:50020]

  # fast search
  missed = 0
  for word in words:
    if word not in longerwords:
      missed += 1
      # print word
    
  print "missed {0}".format(missed)

  # slow search
  missed = 0
  index = [0 for x in xrange(len(words))]
  for i in xrange(len(words)):
    found = False
    for j in xrange(len(longerwords)):
      if words[i] == longerwords[j]:
        found = True
        index[i] = j
        break
    if not found:
      missed += 1
      index[i] = -1
      # print words[i]
        
  print "missed {0}".format(missed)
  # print index
  f = codecs.open(name,"w")
  for i in xrange(10222):
    f.write(str(index[i]))
    f.write('\n')
  f.close()


def readindexfile(name):
  f = codecs.open(name,"r","utf8")
  tmp = f.read().split("\n")
  f.close()

  del(tmp[-1])

  return map(int,tmp)


if __name__ == "__main__":
  
  rawfile = sys.argv[1]
  day = rawfile[7:17]
  print day

  # writeindexfile("longindex.csv")
  # raise("die")
  
  index = readindexfile("longindex.csv")
  # print len(index)
  
  rawbase = "word-vectors"
  # rawfile = "parsed."+day+".csv"
  newbase = "word-vectors"
  newfile = day+"-hours.csv"
  newfilesum = day+"-sum.csv"

  print "reading in raw file..."
  f = codecs.open(rawbase+"/"+rawfile,"r","utf8")
  tmp = f.read()
  f.close()

  allvecs = [x.split(",") for x in tmp.split("\n")]
  
  # check that there aren't missing hours
  for i in xrange(24):
    if (len(allvecs[-1][0]) == 0):
      del(allvecs[-1])

  for i in xrange(len(allvecs)):
    # print allvecs[i][0]
    del(allvecs[i][0])

  # print len(allvecs)
  # print len(allvecs[0])
  # print allvecs[0][0:10]
  # print allvecs[0][49990:50020]

  allvecs10k = [[0 for i in xrange(10222)] for j in xrange(24)]

  print "transforming..."
  for i in xrange(len(allvecs)):
    for j in xrange(10222):
      if index[j] > -1:
        allvecs10k[i][j] = int(allvecs[i][index[j]])
      else:
        allvecs10k[i][j] = 0

  print "writing new file..."
  f = codecs.open(newbase+"/"+newfile,"w","utf8")
  # i like writing them vertically
  for i in xrange(10222):
    f.write(str(allvecs10k[0][i]))
    for j in xrange(1,24):
      f.write(',')
      f.write(str(allvecs10k[j][i]))
    f.write('\n')
  f.close()

  print "writing new sum file..."
  f = codecs.open(newbase+"/"+newfilesum,"w","utf8")
  allvecs10ksum = [sum([allvecs10k[j][i] for j in xrange(24)]) for i in xrange(10222)]
  # i like writing them vertically
  for i in xrange(10222):
    f.write(str(allvecs10ksum[i]))
    f.write('\n')
  f.close()




