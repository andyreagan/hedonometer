import sys, os
sys.path.append('/usr/share/nginx/wiki/mysite')
sys.path.append('/usr/share/nginx/wiki/mysite/mysite')
# os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
# the above got the error
# django.core.exceptions.ImproperlyConfigured: The SECRET_KEY setting must not be empty.
# on 2014-08-28, don't know why
# this fixes it:
os.environ.setdefault('DJANGO_SETTINGS_MODULE','mysite.settings')
from django.conf import settings

from hedonometer.models import Happs
import datetime

if __name__ == '__main__':
    [di,hi]=sys.argv[1].split(',')
    dates = map(int,di.split('-'))
    d = datetime.datetime(dates[0],dates[1],dates[2])
    v = float(hi)
    h = Happs(date=d,value=v)
    h.save()


