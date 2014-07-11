from django.contrib import admin

# Register your models here.
# No models for now
# Eventually we can create a database for the big events
from hedonometer.models import Event,Book

class EventAdmin(admin.ModelAdmin):
    search_fields = ('longer',)
    list_display = ('date','caption','importance','x','y','shorter',)
    list_display_links = ('caption',)
    list_editable = ('importance','x','y',)

class BookAdmin(admin.ModelAdmin):
    search_fields = ('title',)
    list_display = ('title','author','language',)
    list_display_links = ('title',)
    list_editable = ('language',)

admin.site.register(Event,EventAdmin)
admin.site.register(Book,BookAdmin)
