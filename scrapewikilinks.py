## the following imports allow access to Django models
import sys, os
sys.path.append('/usr/share/nginx/wiki/mysite/mysite')
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
from django.conf import settings

## get the Event model
from hedonometer.models import *
## use all this crap
import datetime
import json
from bs4 import BeautifulSoup
import urllib as url
## for slowing down the scrape
import time

if __name__ == '__main__':
    ## where to save the links
    f = open('wikilinks.csv','w')
    ## but I'm just going to put them right into the model
    f.close()
    
    ## load all the events
    allEvents = Event.objects.all()
    
    ## loop over each event
    for e in allEvents:
        ## wait
        time.sleep(1)
    
        ## grab the full html
        print "looking for image in "+e.wiki
        htmlObj = url.urlopen(e.wiki.encode('utf8'))
        rawHtml = htmlObj.read()
    
        ## parse
        soup = BeautifulSoup(rawHtml)
        
        ## grab the upper box
        infoBox = soup.find_all('table',class_="infobox")
    
        ## if we got something...
        if len(infoBox) > 0:
            table = infoBox[0]
            
            tmp = table.find_all('img')
            ## again, if we got an image...
            if len(tmp) > 0:
                img = tmp[0]
                print "found this image"
                print img
                href = img['src']
                print "extracted this URL:"
                print href
                
                ## update the model
                e.imagelink = href
                e.save()



