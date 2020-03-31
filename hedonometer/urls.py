# /usr/share/nginx/wiki/mysite/hedonometer/urls.py

from django.conf.urls import url, include
from django.views.generic import TemplateView,RedirectView
from hedonometer import views
from tastypie.api import Api
from hedonometer.api import *
# EventResource,BookResource,RandomBookResource,HappsResource,WordResource,AnnotationResource,MovieAnnotationResource,MovieResource,RandomMovieResource,NYTResource,NYTResourceAll,MovieResourceMin

v1_api = Api(api_name='v1')
v1_api.register(EventResource())
v1_api.register(HappsResource())
v1_api.register(BookResource())
v1_api.register(RandomBookResource())
v1_api.register(WordResource())
v1_api.register(AnnotationResource())
v1_api.register(MovieAnnotationResource())
v1_api.register(MovieResource())
v1_api.register(RandomMovieResource())
v1_api.register(NYTResource())
v1_api.register(NYTResourceAll())
v1_api.register(MovieResourceMin())
v1_api.register(BookResourceV3())

urlpatterns = [
    # the main view!!
    url(r'^index.html', TemplateView.as_view(template_name='hedonometer/index.html'),  name='index'),
    # this preserves a link from the MITRE version of the site
    url(r'^wordshift.html', RedirectView.as_view(url='index.html',query_string=True),),
    # the rest of these are just staticically built pages:
    url(r'^about.html', TemplateView.as_view(template_name='hedonometer/about.html'), name='about'),
    url(r'^shifts.html', RedirectView.as_view(url='instructions.html#wordshifts'),),
    url(r'^instructions.html', TemplateView.as_view(template_name='hedonometer/instructions.html'),name='instructions'),
    url(r'^words.html', TemplateView.as_view(template_name='hedonometer/words.html'), name='words'),
    url(r'^table.html', TemplateView.as_view(template_name='hedonometer/table.html'), name='table'),
    url(r'^press.html', TemplateView.as_view(template_name='hedonometer/press.html'), name='press'),
    url(r'^papers.html', TemplateView.as_view(template_name='hedonometer/papers.html'), name='papers'),
    url(r'^talks.html', TemplateView.as_view(template_name='hedonometer/talks.html'), name='talks'),
    url(r'^contact/',views.contact.as_view(), name='contactform'),
    url(r'^funding.html', TemplateView.as_view(template_name='hedonometer/funding.html'), name='funding'),
    url(r'^api.html', TemplateView.as_view(template_name='hedonometer/data.html'), name='funding'),
    url(r'^consulting.html', TemplateView.as_view(template_name='hedonometer/consulting.html'), name='funding'),
    url(r'^storylab.html', TemplateView.as_view(template_name='hedonometer/lab.html'), name='lab'),
    url(r'^maps.html', TemplateView.as_view(template_name='hedonometer/maps.html'),  name='maps'),
    url(r'^devmaps.html', TemplateView.as_view(template_name='hedonometer/devmaps.html'), name='maps'),
    url(r'^statesankey.html', TemplateView.as_view(template_name='hedonometer/statesankey.html'), name='statesankey'),
    url(r'^citysankey.html', TemplateView.as_view(template_name='hedonometer/citysankey.html'), name='citysankey'),
    url(r'^cities.html', TemplateView.as_view(template_name='hedonometer/cities2.html'), name='cities'),
    url(r'^cities2.html', TemplateView.as_view(template_name='hedonometer/cities2.html'), name='cities'),
    url(r'^legacyapi.html',
        TemplateView.as_view(template_name='hedonometer/api.html'),
        name='api'),

    # books
    # redirect this to version 1
    # url(r'^books.html', TemplateView.as_view(template_name='hedonometer/books/books.html'), name='books'),
    url(r'^books/v1/', TemplateView.as_view(template_name='hedonometer/books/books.html'), name='books'),
    url(r'^books.html', RedirectView.as_view(url='books/v1/', query_string=True, permanent=False)),
    # url(r'^harrypotter.html', TemplateView.as_view(template_name='hedonometer/books/harrypotter.html'), name='harry'),
    # url(r'^books/about.html', TemplateView.as_view(template_name='hedonometer/books/aboutbooks.html'), name='about'),
    url(r'^books/list.html',views.booklist.as_view(),name='booklist'),
    # url(r'^books/v3/(?P<book>[^/]+)/',views.gutenberg_books.as_view()),
    url(r'^books/v2/(?P<book>[^/]+)/',views.annotation.as_view(),name='annotation'),
    url(r'^books/v3/(?P<book>[0-9]+)/',views.gutenberg_paper.as_view()),
    url(r'^books/(?P<book>[^/]+)/',RedirectView.as_view(url='/books/v2/%(book)s/', query_string=True, permanent=False)),
    # url(r'^books/(?P<book>[\w]+)/',"hedonometer.views.book",name="book"),

    # movies
    url(r'^movies/about.html',
        TemplateView.as_view(template_name='hedonometer/aboutmovies.html'),
        name='about'),
    url(r'^movies/list.html',views.movielist.as_view(),name='movielist'),
    url(r'^movies/ranked-list.html',views.rankedmovielist.as_view(),name='rankedmovielist'),
    url(r'^movies/(?P<movie>[^/]+)/',views.movieannotation.as_view(),name='annotation'),
    # url(r'^movies/(?P<movie>[\w]+)/',"hedonometer.views.book",name="book"),
    url(r'^movies/', RedirectView.as_view(url='Pulp Fiction/')),

    # random demos
    url(r'^showcase/nyt/',views.nytlist.as_view(),name='nytlist'),
    url(r'^showcase/cbs/',views.cbslist.as_view(),name='cbslist'),
    url(r'^showcase/outside/',views.outsidelist.as_view(),name='outsidelist'),

    # this powers the slack command
    url(r'^happs/',views.wordhapps,name='happs'),

    # wordshifterator
    url(r'^wordshifterator/edit/(?P<some_hash>[\w-]+)/$',views.editwordshift.as_view(),name=''),
    url(r'^wordshifterator/share/(?P<some_hash>[\w-]+)/$',views.sharewordshift.as_view(),name=''),
    url(r'^wordshifterator/view/(?P<some_hash>[\w-]+)/$',views.viewwordshift.as_view(),name=''),
    # create is the most basic view
    url(r'^wordshifterator/create/$', TemplateView.as_view(template_name='hedonometer/wordshifterator/create.html') ,name=''),
    url(r'^wordshifterator/',views.main.as_view(),name=''),

    # backend for making png and pdf
    url(r'^convertSVG', views.csv_view.as_view(), name='convertSVG'),

    # all of the embeds
    url(r'^embed/main/(?P<dateref>[\w-]+)/(?P<datecomp>[\w-]+)/$',views.embedMain,name='embed'),
    url(r'^embed/nyt/(?P<sectionref>[\w-]+)/(?P<sectioncomp>[\w-]+)/$',views.embedNYT,name='embed'),
    url(r'^embed/CBS/(?P<hostref>[\w-]+)/(?P<hostcomp>[\w-]+)/$',views.embedCBS,name='embed'),
    url(r'^embed/main/(?P<onedate>[\w-]+)/$',views.embedMainSimple,name='embed'),
    url(r'^embed/test/(?P<reffile>[\w-]+).csv/(?P<compfile>[\w-]+).csv/$',views.shifttest,name='test'),
    url(r'^embed/happs/(?P<reffile>[\w-]+)/$',views.personalhapps,name='test'),
    url(r'^embed/(?P<some_hash>[\w-]+)/$',views.embedUpload,name='embed'),

    # some teletherming stuff
    url(r'^teletherm/',
        TemplateView.as_view(template_name='hedonometer/teletherm.html'),
        name='teletherm'),

    # others
    url(r'^api/', include(v1_api.urls)),
    url(r'^timeseries/(?P<urlregion>[\w-]+)/',views.timeseries, name='timeseries'),
    # this captures everything!
    # url(r'^(?P<urlregion>[\w]+)/',views.timeseries, name='timeseries'),
]
