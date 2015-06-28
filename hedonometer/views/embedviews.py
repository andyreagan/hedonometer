from django.shortcuts import render
from django.template import Context

from hedonometer.models import Embeddable,Event,NYT

import datetime

def embedNYT(request,sectionref,sectioncomp):
    # # but I do need a dates
    # logger.debug(some_hash)

    # r = NYT.objects.filter(genre__exact=sectionref)
    try:
        r = NYT.objects.get(genre=sectionref)
        c = NYT.objects.get(genre=sectioncomp)
    except:
        raise Http404

    specialtext = '{0}\n{1}\nComparison happiness: avhapps\nWhat\'s making {2} updown than {3}:'.format('New York Times Wordshift',c.genre.title()+' section compared to '+r.genre.title()+' section',c.genre.title(),r.genre.title())
    if r.genre == 'all':
        specialtext = '{0}\n{1}\nComparison happiness: avhapps\nWhat\'s making {2} updown than {3}:'.format('New York Times Wordshift',c.genre.title()+' section compared to the whole Times',c.genre.title(),'the whole Times')

    filenames = {'h': 'dont matter',
                 'refFile': '/data/NYT/NYT_labVecs/%s.stripped.indexed' % r.filename,
                 'refFileName': sectionref,
                 'compFile': '/data/NYT/NYT_labVecs/%s.stripped.indexed' % c.filename,
                 'compFileName': sectioncomp,
                 'fulltext': specialtext,
                 'contextflag': 'main', # 'none'
                 'stopWords': '',
    }

    # logger.debug(filenames)
    # logger.debug(Context(filenames))

    # now pass those into the view
    return render(request, 'hedonometer/embed.html', Context(filenames))

def embedCBS(request,hostref,hostcomp):
    # # but I do need a dates
    # logger.debug(some_hash)

    refi = ['CHARLIEROSE','GAYLEKING','NORAHODONNELL','ALL'].index(hostref)
    compi = ['CHARLIEROSE','GAYLEKING','NORAHODONNELL','ALL'].index(hostcomp)
    hosts_nice = ['Charlie Rose','Gayle King','Norah O\'Donnell','all']
    if refi == 3:
        specialtext = '{0}\n{1}\nComparison happiness: avhapps\nWhat\'s making {2} updown than {3}:'.format('CBS Host Wordshift',hosts_nice[compi]+'\'s lines compared to '+hosts_nice[refi]+' lines',hosts_nice[compi],hosts_nice[refi])
    else:
        specialtext = '{0}\n{1}\nComparison happiness: avhapps\nWhat\'s making {2} updown than {3}:'.format('CBS Host Wordshift',hosts_nice[compi]+'\'s lines compared to '+hosts_nice[refi]+'\'s lines',hosts_nice[compi],hosts_nice[refi])

    filenames = {'h': 'dont matter',
                 'refFile': 'http://hedonometer.org/data/CBS/%s.csv' % hostref,
                 'refFileName': hostref,
                 'compFile': 'http://hedonometer.org/data/CBS/%s.csv' % hostcomp,
                 'compFileName': hostcomp,
                 'fulltext': specialtext,
                 'contextflag': 'main', # 'none'
                 'stopWords': '',
    }

    # logger.debug(filenames)
    # logger.debug(Context(filenames))

    # now pass those into the view
    return render(request, 'hedonometer/embed.html', Context(filenames))

def embedMainSimple(request,onedate):
    [year,month,day] = map(int,onedate.split('-'))
    d = datetime.datetime(year,month,day)

    longer = d.strftime('%A, %B %e, %Y')

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
                 'stopWords': '',
    }

    # now pass those into the view
    return render(request, 'hedonometer/embed.html', Context(filenames))

def shifttest(request,reffile,compfile):
    # # but I do need a dates
    # logger.debug(some_hash)

    filenames = {'refFile': '/static/hedonometer/'+reffile+'.csv',
                 'compFile': '/static/hedonometer/'+compfile+'.csv',
    }

    # logger.debug(filenames)
    # logger.debug(Context(filenames))

    # now pass those into the view
    return render(request, 'hedonometer/shifttest.html', Context(filenames))

def embedUpload(request,some_hash):
    # don't expect any post data
    # logger.debug(request.POST)

    # # but I do need a hash
    # logger.debug(some_hash)

    # look up that hash in our database
    # m = Embeddable.objects.filter(compFile__contains='2014-06-06')
    m = Embeddable.objects.get(h=some_hash)

    # grab the filenames of the data from the database
    # filenames = [m.refFile,m.compFile]
    filenames = {
        'refFile': m.refFile,
        'compFile': m.compFile,
        'stopWords': m.stopWords,
        'hash': some_hash,
    }
    if len(m.customTitleText) > 0:
        filenames['contextflag'] = 'justtitle'
        filenames['fulltext'] = m.customTitleText
    if len(m.customFullText) > 0:
        filenames['fulltext'] = m.customFullText

    # logger.debug(filenames)
    # logger.debug(Context(filenames))

    # now pass those into the view
    return render(request, 'hedonometer/embed.html', Context(filenames))

def embedMain(request,dateref,datecomp):
    # # but I do need a dates
    # logger.debug(some_hash)

    filenames = {'h': 'dont matter',
                 'refFile': 'http://hedonometer.org/data/word-vectors/%s.csv' % dateref,
                 'refFileName': dateref,
                 'compFile': 'http://hedonometer.org/data/word-vectors/%s.csv' % datecomp,
                 'compFileName': datecomp,
                 'fulltext': '',
                 'contextflag': 'none',
                 'stopWords': '',
    }

    # logger.debug(filenames)
    # logger.debug(Context(filenames))

    # now pass those into the view
    return render(request, 'hedonometer/embed.html', Context(filenames))
