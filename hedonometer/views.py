# /usr/share/nginx/wiki/mysite/hedonometer/views.py

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.views.generic import View
from django.core.context_processors import csrf
from django.template import Context
from mysite.settings import STATIC_ROOT
import logging
logger = logging.getLogger(__name__)
from hedonometer.models import Embeddable,Event,Book
import csv
import subprocess
import codecs
import datetime

from twython_django.models import TwitterProfile,Annotation

# Create your views here.
def dummy(request):
    # latest_topic_list = Topic.objects.order_by('-pub_date')[:5]
    # context = {'latest_topic_list': latest_topic_list}
    return render(request, 'hedonometer/index.html')

class annotation(View):
     # return all of the annotations for a book
    def get(self, request, book):
        # print book
        # print request
        # print request.session
        # print request.user.twitterprofile
        # can just redirect to this view
        # with a URL parameter
        # return HttpResponseRedirect("/harrypotter.html?book="+book)
        # but why not just render the template
        return render(request, 'hedonometer/harrypotter.html',{"book": book})
    
    # accept an annotation
    def post(self, request, book):
        # print request.POST.get("tweetflag","none")
        # print request.POST.get("annotation","none")
        # print request.POST.get("point","none")
        b = Book.objects.filter(title__exact=book)[0]
        # print request.user.twitterprofile
        
        queryset = Annotation.objects.filter(book=b,position=request.POST.get("point","none"))
        # vote for an annotation
        # check on the POST data for a vote
        vote = False
        for q in queryset:
            id = q.id
            if request.POST.get(str(id),"none") != "none":
                print "casting a vote"
                vote = True
                q.votes += 1
                q.save()
                break

        # create a new annotation
        if not vote:
            print "making a new annotation"
            a = Annotation(book=b,user=request.user.twitterprofile,position=request.POST.get("point","none"),annotation=request.POST.get("annotation","none"),tweeted=request.POST.get("tweetflag","notset"),date=datetime.datetime.now(),votes=1,winner="0")
            # save it
            a.save()

        # check for the winner, always
        winner = 0
        mostvotes = 0

        if len(queryset) > 0:
            for i in xrange(len(queryset)):
                annotation = queryset[i]
                annotation.winner = "0"
                if int(annotation.votes) > mostvotes:
                    mostvotes = int(annotation.votes)
                    winner = i
    
            queryset[winner].winner = "1"
            queryset[winner].save()
        else:
            a.winner = "1"
            a.save()

        # return HttpResponse("this will also be the book page, with a new annotation")
        return render(request, 'hedonometer/harrypotter.html',{"book": book})
        
def embedMain(request,dateref,datecomp):
    # # but I do need a dates
    # logger.debug(some_hash)

    filenames = {'h': 'dont matter',
                 'refFile': 'http://hedonometer.org/data/word-vectors/%s.csv' % dateref,
                 "refFileName": dateref,
                 'compFile': 'http://hedonometer.org/data/word-vectors/%s.csv' % datecomp,
                 "compFileName": datecomp,
                 'fulltext': '',
                 'contextflag': 'none',
    }

    logger.debug(filenames)
    # logger.debug(Context(filenames))

    # now pass those into the view
    return render(request, 'hedonometer/embed.html', Context(filenames))

def embedMainSimple(request,onedate):
    [year,month,day] = map(int,onedate.split('-'))
    d = datetime.datetime(year,month,day)

    longer = d.strftime("%A, %B %e, %Y")

    event = Event.objects.filter(date=onedate)
    
    if len(event) > 0:
        eventtext = '\n'.join([e.longer for e in event])
    else:
        eventtext = ''

    specialtext = '{0}\n{1}\nAverage Happiness: avhapps\nWhat\'s making this day updown than the previous 7 days:'.format(longer,eventtext)

    print specialtext

    filenames = {'h': 'dont matter',
                 'refFile': 'http://hedonometer.org/data/word-vectors/%s-prev7.csv' % onedate,
                 'compFile': 'http://hedonometer.org/data/word-vectors/%s-sum.csv' % onedate,
                 'fulltext': specialtext,
                 'contextflag': 'main',
    }

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
    filenames = {
        'refFile': m[0].refFile,
        "compFile": m[0].compFile,
    }
    if len(m[0].customTitleText) > 0:
        filenames['contextflag'] = 'justtitle'
        filenames['fulltext'] = m[0].customTitleText
    if len(m[0].customFullText) > 0:    
        filenames['fulltext'] = m[0].customFullText

    # logger.debug(filenames)
    # logger.debug(Context(filenames))

    # now pass those into the view
    return render(request, 'hedonometer/embed.html', Context(filenames))

def timeseries(request,lang):
    langdict = {
        "lang": lang,
    }

    # now pass those into the view
    return render(request, 'hedonometer/indexlang.html', Context(langdict))

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


