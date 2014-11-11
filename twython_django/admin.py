from django.contrib import admin

# Register your models here.
# No models for now
# Eventually we can create a database for the big events
from twython_django.models import TwitterProfile,Annotation

admin.site.register(TwitterProfile)
admin.site.register(Annotation)

