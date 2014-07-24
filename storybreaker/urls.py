from django.conf.urls import patterns, url, include
from django.views.generic import TemplateView

from storybreaker import views
# from tastypie.api import Api
# from hedonometer.api import EventResource

# v1_api = Api(api_name='v1')
# v1_api.register(EventResource())

urlpatterns = patterns('',
    # ex: /swn/         
    url(r'^index.html', 
        TemplateView.as_view(template_name='storybreaker/index.html'),
        name='index'),
    url(r'^api/(?P<call>.+)$',views.api,name='api'),
    # (r'^api/', include(v1_api.urls)),
    # url(r'^$', views.index, name='index'),
    # ex: /swn/5
    # url(r'^(?P<swn_id>\d+)/$', views.detail, name='detail'),
    # url(r'^(?P<swn_id>\d+)_vote/$', views.voteswn, name='detail'),
    # url(r'^(?P<swn_id>\d+)_submit/$', views.addswn, name='detail'),
)
