from django.contrib import admin
from swn.models import Topic,Swn,User

# Register your models here.
from django.contrib import admin

class ChoiceInline(admin.TabularInline):
    model = Swn
    extra = 1

class TopicAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields':['title']}),
        ('Date Information', {'fields': ['pub_date']}),
    ]
    inlines = [ChoiceInline]
    list_display = ('title','pub_date','was_published_recently')
    list_filter = ['pub_date']
    search_fields = ['swn']

admin.site.register(Topic,TopicAdmin)

# was going to make my own user system
# admin.site.register(User)
