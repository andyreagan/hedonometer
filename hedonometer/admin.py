from django.contrib import admin

# Register your models here.
# No models for now
# Eventually we can create a database for the big events
from hedonometer.models import Event

class EventAdmin(admin.ModelAdmin):
    search_fields = ['longer']

admin.site.register(Event,EventAdmin)
