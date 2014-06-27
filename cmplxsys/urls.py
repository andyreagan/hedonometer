# urls.py
from django.conf.urls import patterns, include, url
from tastypie.api import Api
from cmplxsys.api import PersonResource, PaperResource

v1_api = Api(api_name='v1')
v1_api.register(PersonResource())
v1_api.register(PaperResource())

urlpatterns = patterns('',
    # The normal jazz here...
    # (r'^blog/', include('myapp.urls')),
    (r'^api/', include(v1_api.urls)),
)
