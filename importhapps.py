import sys, os
sys.path.append('/usr/share/nginx/wiki/mysite/mysite')
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
from django.conf import settings

from hedonometer.models import *
import datetime
import json

f = open('mysite/static/hedonometer/data/word-vectors/sumhapps.csv','r')
f.readline()

for line in f:
    tmp = line.rstrip().split(',')
    print tmp
    dates = map(int,tmp[0].split('-'))
    d = datetime.datetime(dates[0],dates[1],dates[2])
    v = float(tmp[1])
    h = Happs(date=d,value=v)
    h.save()


