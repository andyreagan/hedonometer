import sys, os
sys.path.append('/usr/share/nginx/wiki/mysite/mysite')
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
from django.conf import settings

from hedonometer.models import *
import datetime
import json

f = open('/usr/share/nginx/wiki/labMT-simple/labMTsimple/data/labMT1.txt','r')
f.readline()

for line in f:
    tmp = line.rstrip().split('\t')
    tmp[1] = int(tmp[1])
    tmp[2:4] = map(float,tmp[2:4])
    for i in xrange(4,8):
        if tmp[i] == "--":
            tmp[i] = -1
        else:
            tmp[i] = int(tmp[i])
    [v,r,h,s,t,g,n,l] = tmp
    print tmp
    w = Word(word=v,rank=r,happs=h,stdDev=s,twitterRank=t,googleBooksRank=g,newYorkTimesRank=n,lyricsRank=l)
    w.save()


