from django.conf.urls import patterns, url

from vaccv import views

urlpatterns = patterns('',
    # ex: /vaccv/                       
    url(r'^$', views.index, name='index'),
    # ex: /vaccv/users/a/r/areagan/work/2014/event-prediction/figures
    url(r'^(?P<directory>.+)$', views.detail, name='detail'),
)
