from django.contrib import admin

# Register your models here.
from cmplxsys.models import Person,Paper,Press,Funding,Project,Course

# class PersonAdmin(admin.ModelAdmin):
#     list_display = ('website','strava') 

class PaperPersonAdmin(admin.ModelAdmin):
    search_fields = ['title']
    filter_horizontal = ('authors','fromclass')

class PressPaperAdmin(admin.ModelAdmin):
    filter_horizontal = ('papers',)

class FundingProjectAdmin(admin.ModelAdmin):
    filter_horizontal = ('project',)

class ProjectPeopleAdmin(admin.ModelAdmin):
    filter_horizontal = ('people',)

class CoursePeopleAdmin(admin.ModelAdmin):
    filter_horizontal = ('students','teachers')

class PersonAdmin(admin.ModelAdmin):
    search_fields = ['fullname']

admin.site.register(Person,PersonAdmin)
admin.site.register(Paper,PaperPersonAdmin)
admin.site.register(Press,PressPaperAdmin)
admin.site.register(Funding,FundingProjectAdmin)
admin.site.register(Project,ProjectPeopleAdmin)
admin.site.register(Course,CoursePeopleAdmin)
