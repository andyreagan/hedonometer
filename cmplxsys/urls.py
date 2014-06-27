# urls.py
from django.conf.urls import patterns, include, url
from tastypie.api import Api
from cmplxsys.api import PersonResource, PaperResource, BasicFundingResource, BasicPressResource, BasicProjectResource

v1_api = Api(api_name='v1')
v1_api.register(PersonResource())
v1_api.register(PaperResource())
v1_api.register(BasicFundingResource())
v1_api.register(BasicPressResource())
v1_api.register(BasicProjectResource())

urlpatterns = patterns('',
    # The normal jazz here...
    # (r'^blog/', include('myapp.urls')),
    (r'^api/', include(v1_api.urls)),
)
