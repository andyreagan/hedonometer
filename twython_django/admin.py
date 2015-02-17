from django.contrib import admin

# Register your models here.
# No models for now
# Eventually we can create a database for the big events
from twython_django.models import TwitterProfile,Annotation,MovieAnnotation

class AnnotationAdmin(admin.ModelAdmin):
    search_fields = ('movie','user',)
    list_display = ('movie','user','user_name','annotation','votes',)
    list_display_links = ('movie',)
    list_editable = ('votes',)

    def user_name(self, obj):
        return '%s'%(obj.User.oauth_token)
    user_name.short_description = 'username'

admin.site.register(TwitterProfile)
admin.site.register(Annotation)
# admin.site.register(MovieAnnotation)
admin.site.register(MovieAnnotation,AnnotationAdmin)

