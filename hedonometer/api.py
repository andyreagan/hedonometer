from hedonometer.models import Event,Book
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

class BookResource(ModelResource):
    class Meta:
        queryset = Book.objects.filter(length__gte=10000)
        resource_name = 'gutenberg'
        limit = 500
        filtering = {
            'title': ALL_WITH_RELATIONS,
            'id': ALL,
        }

class RandomBookResource(ModelResource):
    class Meta:
        queryset = Book.objects.filter(length__gte=10000).order_by('?')
        resource_name = 'randombook'
        limit = 1











