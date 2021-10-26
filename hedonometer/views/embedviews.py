from django.shortcuts import render
from django.template import Context

from hedonometer.models import Event,NYT

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
                 'refFile': 'https://hedonometer.org/data/CBS/%s.csv' % hostref,
                 'refFileName': hostref,
                 'compFile': 'https://hedonometer.org/data/CBS/%s.csv' % hostcomp,
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

    print(specialtext)

    filenames = {'h': 'dont matter',
                 'refFile': 'https://hedonometer.org/data/word-vectors/vacc/%s-prev7.csv' % onedate,
                 'compFile': 'https://hedonometer.org/data/word-vectors/vacc/%s-sum.csv' % onedate,
                 'fulltext': specialtext,
                 'contextflag': 'main',
                 'stopWords': '',
    }

    # now pass those into the view
    return render(request, 'hedonometer/embed.html', Context(filenames))


def embedMain(request,dateref,datecomp):
    # # but I do need a dates
    # logger.debug(some_hash)

    filenames = {'h': 'dont matter',
                 'refFile': 'https://hedonometer.org/data/word-vectors/vacc/%s.csv' % dateref,
                 'refFileName': dateref,
                 'compFile': 'https://hedonometer.org/data/word-vectors/vacc/%s.csv' % datecomp,
                 'compFileName': datecomp,
                 'fulltext': '',
                 'contextflag': 'none',
                 'stopWords': '',
    }

    # logger.debug(filenames)
    # logger.debug(Context(filenames))

    # now pass those into the view
    return render(request, 'hedonometer/embed.html', Context(filenames))
