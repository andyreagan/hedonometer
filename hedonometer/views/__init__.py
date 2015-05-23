from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.http import HttpResponse
from django.views.generic import View
from django.core.context_processors import csrf
from django.template import Context

from mysite.settings import STATIC_ROOT

# proper logging (not using "print")
# import logging
# logger = logging.getLogger(__name__)

from hedonometer.models import NYT,Timeseries,Word

from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.core import serializers

import csv
import subprocess
import codecs
# import json

from embedviews import *
from wordshifteratorviews import *
from bookandmovieviews import *

import datetime

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


# class wordhapps(View):
#      # return all of the annotations for a book
#     def get(self, request):
#         cbs_list = {}
#         return HttpResponse("Word")

#     @csrf_exempt
#     def post(self, request):
#         # word = request.POST['text']
#         return HttpResponse("Word")
#         # w = get_object_or_404(Word,word=word)
#         # cbs_list = {}
#         # return HttpResponse(json.dumps(w))


@csrf_exempt
def wordhapps(request):
    word = request.POST['text']
    w = get_object_or_404(Word,word=word)
    w = Word.objects.filter(word=word)
    if len(w) > 0:
        entry = w[0]
        return HttpResponse('*{0}* happs: {1}, std dev: {2}, happs rank: {3}\nTwitter/Gbooks/NYT/Lyrics ranks: {4}/{5}/{6}/{7}'.format(word,entry.happs,entry.stdDev,entry.rank,entry.twitterRank,entry.googleBooksRank,entry.newYorkTimesRank,entry.lyricsRank))
    else:
        return HttpResponse('*{0}* not found in labMT database.'.format(word))

def timeseries(request,urlregion):
    t = get_object_or_404(Timeseries,title=urlregion)

    # langdict = {
    #     "lang": t.language,
    #     "region": t.title.lower(),
    #     "startDate": t.startDate.strftime('%Y-%m-%d'),
    #     "endDate": t.endDate.strftime('%Y-%m-%d'),
    #     "customLongTitle": t.customLongTitle,
    #     "mediaFlag": t.mediaFlag,
    #     "sumHappsFile": t.sumHappsFile,
    #     "ignoreWords": t.ignoreWords,
    # }

    # now pass those into the view
    return render(request, 'hedonometer/indexlang.html', {"model": t})

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


