from hedonometer.models import Event
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie import fields

class EventResource(ModelResource):
    class Meta:
        queryset = Event.objects.all()
        resource_name = 'events'
        limit = 500
        filtering = {
            'importance': ALL,
        }
