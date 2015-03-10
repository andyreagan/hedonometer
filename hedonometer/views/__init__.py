from django.shortcuts import render
from django.http import Http404
from django.http import HttpResponse
from django.views.generic import View
from django.core.context_processors import csrf
from django.template import Context

from mysite.settings import STATIC_ROOT

# proper logging (not using "print")
# import logging
# logger = logging.getLogger(__name__)

from hedonometer.models import NYT

import csv
import subprocess
import codecs

from embedviews import *
from wordshifteratorviews import *
from bookandmovieviews import *

def dummy(request):
    # latest_topic_list = Topic.objects.order_by('-pub_date')[:5]
    # context = {'latest_topic_list': latest_topic_list}
    return render(request, 'hedonometer/index.html')

class nytlist(View):
     # return all of the annotations for a book
    def get(self, request):
        nyt_list = NYT.objects.all().exclude(genre='all').order_by('-happs')
        return render(request, 'hedonometer/nytlist.html',{"nyt_list": nyt_list})

class cbslist(View):
     # return all of the annotations for a book
    def get(self, request):
        cbs_list = {}
        return render(request, 'hedonometer/cbslist.html',{"cbs_list": cbs_list})

# note that the arabic is just all twitter in arabic
# and I've also just added an english version, which will point to main timeseries
# but the dates and everything will be for the small one
regions = [["World","0","english",],["Arabic","0","arabic",],["France","79","french",],["Germany","86","german",],["England","239","english",],["Spain","213","spanish",],["Brazil","32","portuguese",],["Mexico","145","spanish",],["South-Korea","211","korean",],["Egypt","69","arabic",],["Australia","14","english",],["New-Zealand","160","english",],["Canada","41","english",],["Canada-fr","41","french",],["NYT","0","english"],]

def timeseries(request,urlregion):
    # set up this variable for saving the region
    requestedRegionIndex = -1
    requestedRegion = regions[0]

    for i in xrange(len(regions)):
        if regions[i][0].lower() == urlregion:
            requestedRegion = regions[i]
            requestedRegionIndex = i
    if not requestedRegionIndex > -1:
        raise Http404

    langdict = {
        "lang": requestedRegion[2],
        "region": requestedRegion[0].lower(),
    }

    # now pass those into the view
    return render(request, 'hedonometer/indexlang.html', Context(langdict))

class csv_view(View):
    # Create the HttpResponse object with the appropriate CSV header.
    def get(self, request):
        # print request
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="shift.csv"'

        writer = csv.writer(response)
        writer.writerow(['First row', 'Foo', 'Bar', 'Baz'])
        writer.writerow(['Second row', 'A', 'B', 'C', '"Testing"', "Here's a quote"])

        return response

    def post(self, request):
        # print request

        # print STATIC_ROOT
    
        output_format = request.POST['output_format']

        f = codecs.open(STATIC_ROOT+'/tmp.svg','w','utf8')
        f.write(request.POST['data'])
        f.close()

        if output_format == 'pdf':
            subprocess.call(['inkscape','-f',STATIC_ROOT+'/tmp.svg','-A',STATIC_ROOT+'/tmp.pdf'])
            f = open(STATIC_ROOT+'/tmp.pdf','r')
            response = HttpResponse(f.read(), content_type='application/pdf')
            f.close()
            response['Content-Disposition'] = 'attachment; filename="hedonomter-{0}-wordshift.pdf"'.format(request.POST['date'])
            subprocess.call(['rm',STATIC_ROOT+'/tmp.svg',STATIC_ROOT+'/tmp.pdf'])
        else:
            subprocess.call(['inkscape','-f',STATIC_ROOT+'/tmp.svg','-d','600','-e',STATIC_ROOT+'/tmp.png'])
            f = open(STATIC_ROOT+'/tmp.png','r')
            response = HttpResponse(f.read(), content_type='application/png')
            f.close()
            response['Content-Disposition'] = 'attachment; filename="hedonomter-{0}-wordshift.png"'.format(request.POST['date'])
            subprocess.call(['rm',STATIC_ROOT+'/tmp.svg',STATIC_ROOT+'/tmp.png'])

        return response


