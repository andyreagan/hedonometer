from django.conf.urls import patterns, url
from django.views.generic import TemplateView

from consulting import views

urlpatterns = patterns('',
    # ex: /swn/         
    url(r'^index.html', 
        TemplateView.as_view(template_name='consulting/index.html'),
        name='index'),
    url(r'^about.html', 
        TemplateView.as_view(template_name='consulting/about.html'),
        name='about'),
    url(r'^shifts.html', 
        TemplateView.as_view(template_name='consulting/shifts.html'),
        name='shifts'),
    url(r'^words.html', 
        TemplateView.as_view(template_name='consulting/words.html'),
        name='words'),
    url(r'^table.html', 
        TemplateView.as_view(template_name='consulting/table.html'),
        name='table'),
    url(r'^press.html', 
        TemplateView.as_view(template_name='consulting/press.html'),
        name='press'),
    url(r'^papers.html', 
        TemplateView.as_view(template_name='consulting/papers.html'),
        name='papers'),
    url(r'^talks.html', 
        TemplateView.as_view(template_name='consulting/talks.html'),
        name='talks'),
    # url(r'^$', views.index, name='index'),
    # ex: /swn/5
    # url(r'^(?P<swn_id>\d+)/$', views.detail, name='detail'),
    # url(r'^(?P<swn_id>\d+)_vote/$', views.voteswn, name='detail'),
    # url(r'^(?P<swn_id>\d+)_submit/$', views.addswn, name='detail'),
)
