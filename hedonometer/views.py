# /usr/share/nginx/wiki/mysite/hedonometer/views.py

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.views.generic import View
from django.core.context_processors import csrf
from django.template import Context
from mysite.settings import STATIC_ROOT
import logging
logger = logging.getLogger(__name__)
from hedonometer.models import Embeddable
import csv
import subprocess
import codecs


# Create your views here.
def dummy(request):
    # latest_topic_list = Topic.objects.order_by('-pub_date')[:5]
    # context = {'latest_topic_list': latest_topic_list}
    return render(request, 'hedonometer/index.html')

def embedMain(request,dateref,datecomp):
    # # but I do need a dates
    # logger.debug(some_hash)

    filenames = {'h': 'dont matter',
                 'refFile': 'http://hedonometer.org/data/word-vectors/%s.csv' % dateref,
                 "refFileName": dateref,
                 'compFile': 'http://hedonometer.org/data/word-vectors/%s.csv' % datecomp,
                 "compFileName": datecomp,
    }

    logger.debug(filenames)
    # logger.debug(Context(filenames))

    # now pass those into the view
    return render(request, 'hedonometer/embed.html', Context(filenames))

def shifttest(request,reffile,compfile):
    # # but I do need a dates
    # logger.debug(some_hash)

    filenames = {'refFile': "/static/hedonometer/"+reffile+".csv",
                 'compFile': "/static/hedonometer/"+compfile+".csv",
    }

    logger.debug(filenames)
    # logger.debug(Context(filenames))

    # now pass those into the view
    return render(request, 'hedonometer/shifttest.html', Context(filenames))

def embedUpload(request,some_hash):
    # don't expect any post data
    # logger.debug(request.POST)

    # # but I do need a hash
    # logger.debug(some_hash)

    # look up that hash in our database
    # m = Embeddable.objects.filter(compFile__contains="2014-06-06")
    m = Embeddable.objects.filter(h__exact=some_hash)

    # grab the filenames of the data from the database
    # filenames = [m.refFile,m.compFile]
    filenames = {'h': m[0].h,
                 'refFile': m[0].refFile,
                 "refFileName": m[0].refFileName,
                 "compFile": m[0].compFile,
                 "compFileName": m[0].compFileName,
    }

    # logger.debug(filenames)
    # logger.debug(Context(filenames))

    # now pass those into the view
    return render(request, 'hedonometer/embed.html', Context(filenames))

def parser(request):
    # expect the post data
    logger.debug(request.POST)

    # create an instance in the model
    # m = embeddable()

    # grab the hash from that instance and pass to the embed page
    # some_hash = m.h
    
    # run some script on the data as save as hash filename
    # python chop.py request.POST['ref'] request.POST['comp'] some_hash+".txt"
    
    # return HttpResponseRedirect("/embed/"+some_hash+"/")

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

        print STATIC_ROOT
    
        output_format = request.POST['output_format']

        f = codecs.open('tmp.svg','w','utf8')
        f.write(request.POST['data'])
        f.close()

        if output_format == 'pdf':
            subprocess.call(['inkscape','-f','/Users/andyreagan/work/2014/2014-09hedonometer/tmp.svg','-A','/Users/andyreagan/work/2014/2014-09hedonometer/tmp.pdf'])
            f = open('tmp.pdf','r')
            response = HttpResponse(f.read(), content_type='application/pdf')
            f.close()
            response['Content-Disposition'] = 'attachment; filename="hedonomter-{0}-wordshift.pdf"'.format(request.POST['date'])
            subprocess.call(['rm','/Users/andyreagan/work/2014/2014-09hedonometer/tmp.svg','/Users/andyreagan/work/2014/2014-09hedonometer/tmp.pdf'])
        else:
            subprocess.call(['inkscape','-f','/Users/andyreagan/work/2014/2014-09hedonometer/tmp.svg','-e','/Users/andyreagan/work/2014/2014-09hedonometer/tmp.png'])
            f = open('tmp.png','r')
            response = HttpResponse(f.read(), content_type='application/png')
            f.close()
            response['Content-Disposition'] = 'attachment; filename="hedonomter-{0}-wordshift.png"'.format(request.POST['date'])
            subprocess.call(['rm','/Users/andyreagan/work/2014/2014-09hedonometer/tmp.svg','/Users/andyreagan/work/2014/2014-09hedonometer/tmp.png'])

        return response


