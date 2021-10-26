# /usr/share/nginx/wiki/mysite/mysite/urls.py

from django.conf.urls import include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^', include('hedonometer.urls')),
]

# load the static files if in debug
from .settings import DEBUG
if DEBUG:
    from django.conf.urls.static import static
    from django.conf import settings
    # urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
