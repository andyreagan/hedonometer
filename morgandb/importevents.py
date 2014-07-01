import sys, os
sys.path.append('/usr/share/nginx/wiki/mysite/mysite')
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
from django.conf import settings

from hedonometer.models import Event
import datetime
import json

f = open('morgandb/bigdays.json','r')

for line in f:
    a = json.loads(line)
    d = datetime.datetime(int(a['date'].split('-')[0]),int(a['date'].split('-')[1])+1,int(a['date'].split('-')[2]))
    e = Event(date=d,value=a['value'],importance=0,caption=a['caption'],picture="",x=a['x'],y=a['y'],shorter=','.join(a['shorter']),longer=a['longer'],wiki=a['wiki'])
    e.save()
