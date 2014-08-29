import sys, os
sys.path.append('/usr/share/nginx/wiki/mysite')
sys.path.append('/usr/share/nginx/wiki/mysite/mysite')
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
from django.conf import settings

from hedonometer.models import *
import datetime
import json
import numpy as np
from labMTsimple.storyLab import *

lang = 'english'
labMT,labMTvector,labMTwordList = emotionFileReader(stopval=0.0,fileName='labMT2'+lang+'.txt',returnVector=True)

date = sys.argv[1]
print date
dates = map(int,date.split('-'))
d = datetime.datetime(dates[0],dates[1],dates[2])

f = open('word-vectors/'+date+'-all-word-vector.csv','r')

allStateNames = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","DC","Whole U.S."];

wholeUS = np.zeros(10222)

for i in xrange(51):
    tmp = f.readline().rstrip().split(',')
    # print len(tmp)
    stateArray = np.array(map(int,tmp))
    wholeUS = wholeUS+stateArray
    stoppedVec = stopper(stateArray,labMTvector,labMTwordList)
    # print "computing happs w 4-6 stopwindow"
    happs = emotionV(stoppedVec,labMTvector)
    print happs
    v = happs
    h = GeoHapps(date=d,value=v,stateId=i+1,stateName=allStateNames[i])
    h.save()

f.close()

i = 51
stoppedVec = stopper(wholeUS,labMTvector,labMTwordList)
happs = emotionV(stoppedVec,labMTvector)
print happs
v = happs
h = GeoHapps(date=d,value=v,stateId=i+1,stateName=allStateNames[i])



