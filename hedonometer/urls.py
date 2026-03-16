# /usr/share/nginx/wiki/mysite/hedonometer/urls.py

from django.urls import re_path, include
from django.views.generic import TemplateView,RedirectView
from hedonometer import views
from tastypie.api import Api
from hedonometer.api import *
# EventResource,BookResource,RandomBookResource,HappsResource,WordResource,AnnotationResource,MovieAnnotationResource,MovieResource,RandomMovieResource,NYTResource,NYTResourceAll,MovieResourceMin

v1_api = Api(api_name='v1')
v1_api.register(TimeseriesResource())
v1_api.register(EventResource())
v1_api.register(HappsResource())
v1_api.register(BookResource())
v1_api.register(RandomBookResource())
v1_api.register(WordResource())
v1_api.register(WordListResource())
v1_api.register(MovieResource())
v1_api.register(RandomMovieResource())
v1_api.register(NYTResource())
v1_api.register(NYTResourceAll())
v1_api.register(MovieResourceMin())
v1_api.register(BookResourceV3())

urlpatterns = [
    # the main view!!
    re_path(r'^index.html', RedirectView.as_view(url='timeseries/en_all/',query_string=True)),
    # the rest of these are just staticically built pages:
    re_path(r'^about.html', TemplateView.as_view(template_name='hedonometer/about.html'), name='about'),
    re_path(r'^instructions.html', TemplateView.as_view(template_name='hedonometer/instructions.html'),name='instructions'),
    re_path(r'^words.html', RedirectView.as_view(url='words/labMT-en-v1/'),),
    re_path(r'^words/(?P<wordlisttitle>[\w-]+)/',views.wordlist, name='wordlist'),
    re_path(r'^words_table/(?P<wordlisttitle>[\w-]+)/',views.wordlist_table, name='wordlist_table'),
    re_path(r'^table.html', TemplateView.as_view(template_name='hedonometer/table.html'), name='table'),
    re_path(r'^press.html', TemplateView.as_view(template_name='hedonometer/press.html'), name='press'),
    re_path(r'^papers.html', TemplateView.as_view(template_name='hedonometer/papers.html'), name='papers'),
    re_path(r'^talks.html', TemplateView.as_view(template_name='hedonometer/talks.html'), name='talks'),
    re_path(r'^contact/',views.contact.as_view(), name='contactform'),
    re_path(r'^funding.html', TemplateView.as_view(template_name='hedonometer/funding.html'), name='funding'),
    re_path(r'^api.html', TemplateView.as_view(template_name='hedonometer/api.html'), name='api'),
    re_path(r'^maps.html', TemplateView.as_view(template_name='hedonometer/maps.html'),  name='maps'),
    re_path(r'^statesankey.html', TemplateView.as_view(template_name='hedonometer/statesankey.html'), name='statesankey'),
    re_path(r'^citysankey.html', TemplateView.as_view(template_name='hedonometer/citysankey.html'), name='citysankey'),
    re_path(r'^cities.html', TemplateView.as_view(template_name='hedonometer/cities2.html'), name='cities'),
    re_path(r'^cities2.html', TemplateView.as_view(template_name='hedonometer/cities2.html'), name='cities2'),

    # books
    # redirect this to version 1
    # url(r'^books.html', TemplateView.as_view(template_name='hedonometer/books/books.html'), name='books'),
    re_path(r'^books/v1/', TemplateView.as_view(template_name='hedonometer/books/books.html'), name='books'),
    re_path(r'^books.html', RedirectView.as_view(url='books/v1/', query_string=True, permanent=False)),
    # url(r'^harrypotter.html', TemplateView.as_view(template_name='hedonometer/books/harrypotter.html'), name='harry'),
    # url(r'^books/about.html', TemplateView.as_view(template_name='hedonometer/books/aboutbooks.html'), name='about'),
    re_path(r'^books/list.html',views.booklist.as_view(),name='booklist'),
    # url(r'^books/v3/(?P<book>[^/]+)/',views.gutenberg_books.as_view()),
    re_path(r'^books/v2/(?P<book>[^/]+)/',views.annotation.as_view(),name='annotation'),
    re_path(r'^books/v3/(?P<book>[0-9]+)/',views.gutenberg_paper.as_view()),
    re_path(r'^books/(?P<book>[^/]+)/',RedirectView.as_view(url='/books/v2/%(book)s/', query_string=True, permanent=False)),
    # url(r'^books/(?P<book>[\w]+)/',"hedonometer.views.book",name="book"),

    # movies
    re_path(r'^movies/about.html',
        TemplateView.as_view(template_name='hedonometer/aboutmovies.html'),
        name='about'),
    re_path(r'^movies/list.html',views.movielist.as_view(),name='movielist'),
    re_path(r'^movies/ranked-list.html',views.rankedmovielist.as_view(),name='rankedmovielist'),
    re_path(r'^movies/(?P<movie>[^/]+)/',views.movieannotation.as_view(),name='annotation'),
    # url(r'^movies/(?P<movie>[\w]+)/',"hedonometer.views.book",name="book"),
    re_path(r'^movies/', RedirectView.as_view(url='Pulp Fiction/')),

    # random demos
    re_path(r'^showcase/nyt/',views.nytlist.as_view(),name='nytlist'),
    re_path(r'^showcase/cbs/',views.cbslist.as_view(),name='cbslist'),
    re_path(r'^showcase/outside/',views.outsidelist.as_view(),name='outsidelist'),

    # this powers the slack command
    re_path(r'^happs/',views.wordhapps,name='happs'),

    # backend for making png and pdf
    re_path(r'^convertSVG', views.csv_view.as_view(), name='convertSVG'),

    # all of the embeds
    re_path(r'^embed/main/(?P<dateref>[\w-]+)/(?P<datecomp>[\w-]+)/$',views.embedMain,name='embed'),
    re_path(r'^embed/nyt/(?P<sectionref>[\w-]+)/(?P<sectioncomp>[\w-]+)/$',views.embedNYT,name='embed'),
    re_path(r'^embed/CBS/(?P<hostref>[\w-]+)/(?P<hostcomp>[\w-]+)/$',views.embedCBS,name='embed'),
    re_path(r'^embed/main/(?P<onedate>[\w-]+)/$',views.embedMainSimple,name='embed'),

    # others
    re_path(r'^api/', include(v1_api.urls)),
    re_path(r'^timeseries/(?P<urlregion>[\w-]+)/',views.timeseries, name='timeseries'),
    # this captures everything!
    # url(r'^(?P<urlregion>[\w]+)/',views.timeseries, name='timeseries'),
]
