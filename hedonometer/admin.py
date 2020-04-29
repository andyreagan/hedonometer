from django.contrib import admin

# Register your models here.
# No models for now
# Eventually we can create a database for the big events
from hedonometer.models import Event,Book,Happs,Embeddable,Movie,NYT,Timeseries,Word,Contact,HappsEvent,WordList


class TimeseriesAdmin(admin.ModelAdmin):
    list_display = ('title', 'wordList', 'showindropdown', 'mediaFlag', 'sourceDir')
    list_display_links = ('title',)
    list_editable = ('showindropdown', 'mediaFlag', 'sourceDir')


class EventAdmin(admin.ModelAdmin):
    search_fields = ('longer',)
    save_as = True
    list_display = ('importance','x','y','shorter',)
    list_display_links = ('shorter',)
    list_editable = ('importance','x','y',)
    autocomplete_fields = ('happs',)


class WordListAdmin(admin.ModelAdmin):
    list_display = ('date','title','language','reference','referencetitle','showindropdown','showinfulllist',)
    list_display_links = ('title',)
    list_editable = ('date','reference','referencetitle','showindropdown','showinfulllist',)


class EmbedAdmin(admin.ModelAdmin):
    save_as = True


class EventInline(admin.StackedInline):
    model = Event


class HappsAdmin(admin.ModelAdmin):
    date_hierarchy = 'date'
    list_filter = ('timeseries__title',)
    list_display = ('timeseries', 'date', 'value', 'frequency')
    readonly_fields = ('timeseries', 'date', 'value', 'frequency')
    search_fields = ('timeseries__title', 'date',)


class HappsEventAdmin(admin.ModelAdmin):
    date_hierarchy = 'date'
    list_filter = ('timeseries__title',)
    list_display = ('timeseries', 'date', 'value', 'event_display')
    readonly_fields = ('timeseries', 'date', 'value', 'frequency')
    inlines = (EventInline,)

    def event_display(self, obj):
        return str(obj.event.shorter)
    event_display.short_description = "Event"

class BookAdmin(admin.ModelAdmin):
    search_fields = ('title','author',)
    list_display = ('title','author','language',)
    list_display_links = ('title',)
    list_editable = ('language',)


class NYTAdmin(admin.ModelAdmin):
    search_fields = ('genre',)
    list_display = ('genre','happs','variance','ignorewords','numwords')
    list_display_links = ('genre',)
    list_editable = ('ignorewords',)


class MovieAdmin(admin.ModelAdmin):
    search_fields = ('title',)
    list_display = ('title','length','ignorewords','happs','happsStart','happsEnd','happsVariance','happsMin','happsMax','happsDiff',)
    list_display_links = ('title',)
    list_editable = ('ignorewords',)


class ContactAdmin(admin.ModelAdmin):
    list_display = ('name','email','comment')


admin.site.register(Event,EventAdmin)
admin.site.register(Book,BookAdmin)
admin.site.register(Happs,HappsAdmin)
admin.site.register(HappsEvent,HappsEventAdmin)
admin.site.register(Movie,MovieAdmin)
admin.site.register(NYT,NYTAdmin)
admin.site.register(Timeseries,TimeseriesAdmin)
admin.site.register(Word)
admin.site.register(WordList,WordListAdmin)
admin.site.register(Contact,ContactAdmin)
admin.site.register(Embeddable,EmbedAdmin)
