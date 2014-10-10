# /usr/share/nginx/wiki/mysite/hedonometer/urls.py

from django.conf.urls import patterns, url, include
from django.views.generic import TemplateView,RedirectView

from hedonometer import views
from tastypie.api import Api
from hedonometer.api import EventResource,BookResource,RandomBookResource,HappsResource,WordResource,GeoHappsResource

v1_api = Api(api_name='v1')
v1_api.register(EventResource())
v1_api.register(HappsResource())
v1_api.register(BookResource())
v1_api.register(RandomBookResource())
v1_api.register(WordResource())
v1_api.register(GeoHappsResource())

urlpatterns = patterns('',
    url(r'^index.html',
        TemplateView.as_view(template_name='hedonometer/index.html'),
        name='index'),
    url(r'^wordshift.html', 
        RedirectView.as_view(url='index.html',query_string=True),),
    url(r'^about.html', 
        TemplateView.as_view(template_name='hedonometer/about.html'),
        name='about'),
    url(r'^shifts.html', 
        RedirectView.as_view(url='instructions.html#wordshifts'),),
    url(r'^instructions.html', 
        TemplateView.as_view(template_name='hedonometer/instructions.html'),
        name='instructions'),
    url(r'^words.html',
        TemplateView.as_view(template_name='hedonometer/words.html'),
        name='words'),
    url(r'^table.html', 
        TemplateView.as_view(template_name='hedonometer/table.html'),
        name='table'),
    url(r'^press.html', 
        TemplateView.as_view(template_name='hedonometer/press.html'),
        name='press'),
    url(r'^papers.html', 
        TemplateView.as_view(template_name='hedonometer/papers.html'),
        name='papers'),
    url(r'^talks.html', 
        TemplateView.as_view(template_name='hedonometer/talks.html'),
        name='talks'),
    url(r'^funding.html', 
        TemplateView.as_view(template_name='hedonometer/funding.html'),
        name='funding'),
    url(r'^storylab.html',
        TemplateView.as_view(template_name='hedonometer/lab.html'),
        name='lab'),
    url(r'^maps.html',
        TemplateView.as_view(template_name='hedonometer/maps.html'),
        name='maps'),
    url(r'^devmaps.html',
        TemplateView.as_view(template_name='hedonometer/devmaps.html'),
        name='maps'),
    url(r'^statesankey.html',
        TemplateView.as_view(template_name='hedonometer/statesankey.html'),
        name='statesankey'),
    url(r'^citysankey.html',
        TemplateView.as_view(template_name='hedonometer/citysankey.html'),
        name='citysankey'),
    url(r'^cities.html',
        TemplateView.as_view(template_name='hedonometer/cities2.html'),
        name='cities'),
    url(r'^cities2.html',
        TemplateView.as_view(template_name='hedonometer/cities2.html'),
        name='cities'),
    url(r'^books.html',
        TemplateView.as_view(template_name='hedonometer/books.html'),
        name='books'),
    url(r'^harrypotter.html',
        TemplateView.as_view(template_name='hedonometer/harrypotter.html'),
        name='harry'),
    url(r'^api.html',
        TemplateView.as_view(template_name='hedonometer/api.html'),
        name='api'),
    url(r'^diy-compare.html',
        TemplateView.as_view(template_name='hedonometer/diy-compare.html'),
        name='api'),
    url(r'^diy-analyze.html',
        TemplateView.as_view(template_name='hedonometer/diy-analyze.html'),
        name='api'),
    url(r'^convertSVG', views.csv_view.as_view(), name='convertSVG'),
    url(r'^embed/main/(?P<dateref>[\w-]+)/(?P<datecomp>[\w-]+)/$',views.embedMain,name='embed'),
    url(r'^embed/(?P<some_hash>\w+)/$',views.embedUpload,name='embed'),
    (r'^api/', include(v1_api.urls)),
)
