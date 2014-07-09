from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

# from wiki.urls import get_pattern as get_wiki_pattern
# from django_notify.urls import get_pattern as get_notify_pattern

# not using, out of date
# import likes

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'mysite.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^', include('hedonometer.urls',namespace='hedonometer')),
    url(r'^admin/', include(admin.site.urls)),
    # url(r'^swn/', include('swn.urls', namespace='swn')),
    # url(r'^vaccv/', include('vaccv.urls', namespace='vaccv')),
    url(r'^cmplxsys/', include('cmplxsys.urls', namespace='cmplxsys')),
    url(r'^explore/', include('consulting.urls', namespace='consulting')),
    # not using
    # url(r'^likes/', include('likes.urls')),
    # url(r'^polls/', include('polls.urls', namespace='polls')),
    # url(r'^notify/', get_notify_pattern()),
    # url(r'^wiki/', get_wiki_pattern()),
)
