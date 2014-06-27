from tastypie.resources import ModelResource
from cmplxsys.models import Person,Paper

class PersonResource(ModelResource):
    class Meta:
        queryset = Person.objects.all()
        resource_name = 'person'

class PaperResource(ModelResource):
    class Meta:
        queryset = Paper.objects.all()
        resource_name = 'paper'


