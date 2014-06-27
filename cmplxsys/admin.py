from django.contrib import admin

# Register your models here.
from cmplxsys.models import Person,Paper,Press,Funding,Project

# class PersonAdmin(admin.ModelAdmin):
#     list_display = ('website','strava')

class PaperPersonAdmin(admin.ModelAdmin):
    filter_horizontal = ('authors',)

class PressPaperAdmin(admin.ModelAdmin):
    filter_horizontal = ('paper',)

class FundingProjectAdmin(admin.ModelAdmin):
    filter_horizontal = ('project',)

class ProjectPeopleAdmin(admin.ModelAdmin):
    filter_horizontal = ('people',)

admin.site.register(Person) #,PersonAdmin)
admin.site.register(Paper,PaperPersonAdmin)
admin.site.register(Press,PressPaperAdmin)
admin.site.register(Funding,FundingProjectAdmin)
admin.site.register(Project,ProjectPeopleAdmin)
