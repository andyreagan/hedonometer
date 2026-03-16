# /usr/share/nginx/wiki/mysite/mysite/urls.py

from django.urls import include, re_path

from django.contrib import admin

urlpatterns = [
    re_path(r'^admin/', admin.site.urls),
    re_path(r'^', include('hedonometer.urls')),
]

# load the static files if in debug
from .settings import DEBUG
if DEBUG:
    from django.conf.urls.static import static
    from django.conf import settings
    # urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
