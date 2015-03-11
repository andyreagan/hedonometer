import sys, os
# on the linode
sys.path.append('/home/prod/hedonometer')
# locally
# sys.path.append('/Users/andyreagan/work/2014/2014-09hedonometer/')
os.environ.setdefault('DJANGO_SETTINGS_MODULE','mysite.settings')
from django.conf import settings

from hedonometer.models import Timeseries

import datetime

regions = [["World","0","english",],["Arabic","0","arabic",],["France","79","french",],["Germany","86","german",],["England","239","english",],["Spain","213","spanish",],["Brazil","32","portuguese",],["Mexico","145","spanish",],["South-Korea","211","korean",],["Egypt","69","arabic",],["Australia","14","english",],["New-Zealand","160","english",],["Canada","41","english",],["Canada-fr","41","french",],["NYT","0","english"],]

if __name__ == '__main__':
    for region in regions:
        # title = models.CharField(max_length=100)
        # language = models.CharField(max_length=100)
        # regionID = models.CharField(max_length=100,null=True, blank=True)
        # startDate = models.DateTimeField()
        # endDate = models.DateTimeField()
        # sumHappsFile = models.CharField(max_length=100,default='sumhapps.csv',help_text='dont change this')
        # ignoreWords = models.CharField(max_length=400, null=True, blank=True)
        t = Timeseries(title=region[0],language=region[2],regionID=region[1],startDate=datetime.datetime(2014,4,16),endDate=datetime.datetime.now())
        t.save()
