from django.conf.urls import patterns, url, include
from django.views.generic import TemplateView

from hedonometer import views
from tastypie.api import Api
from hedonometer.api import EventResource

v1_api = Api(api_name='v1')
v1_api.register(EventResource())

urlpatterns = patterns('',
    # ex: /swn/         
    url(r'^index.html', 
        TemplateView.as_view(template_name='hedonometer/index.html'),
        name='index'),
    url(r'^wordshift.html', 
        TemplateView.as_view(template_name='hedonometer/index.html'),
        name='index'),
    url(r'^about.html', 
        TemplateView.as_view(template_name='hedonometer/about.html'),
        name='about'),
    url(r'^shifts.html', 
        TemplateView.as_view(template_name='hedonometer/shifts.html'),
        name='shifts'),
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
    url(r'^developometer.html', 
        TemplateView.as_view(template_name='hedonometer/dev.html'),
        name='dev'),
    url(r'^storylab.html',
        TemplateView.as_view(template_name='hedonometer/lab.html'),
        name='lab'),
    url(r'^maps.html',
        TemplateView.as_view(template_name='hedonometer/maps.html'),
        name='maps'),
    url(r'^books.html',
        TemplateView.as_view(template_name='hedonometer/books.html'),
        name='books'),

    (r'^api/', include(v1_api.urls)),
    # url(r'^$', views.index, name='index'),
    # ex: /swn/5
    # url(r'^(?P<swn_id>\d+)/$', views.detail, name='detail'),
    # url(r'^(?P<swn_id>\d+)_vote/$', views.voteswn, name='detail'),
    # url(r'^(?P<swn_id>\d+)_submit/$', views.addswn, name='detail'),
)
