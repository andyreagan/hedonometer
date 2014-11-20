from hedonometer.models import Event,Book,Happs,Word,GeoHapps,Movie
from twython_django.models import TwitterProfile,Annotation,MovieAnnotation
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie import fields

class FixedFloatField(fields.ApiField):
    """
    A field for return fixed-width floats.
    """
    dehydrated_type = 'string'
    help_text = 'Fixed precision numeric data. Ex: 26.73'

    def convert(self, value):
        if value is None:
            return None

        if value and not isinstance(value, basestring):
            value = '{0:.3f}'.format(value)

        return value

    def hydrate(self, bundle):
        value = super(FixedFloatField, self).hydrate(bundle)

        if value and not isinstance(value, basestring):
            value = '{0:.3f}'.format(value)

        return value

class EventResource(ModelResource):
    class Meta:
        queryset = Event.objects.all()
        resource_name = "events"
        limit = 500
        filtering = {
            "importance": ALL,
            "lang": ALL,
        }

class HappsResource(ModelResource):
    happiness = FixedFloatField(attribute="value")
    class Meta:
        queryset = Happs.objects.all()
        excludes = ["value","id",]
        resource_name = "timeseries"
        limit = 3000
        # default_format = ["json"]
        max_limit = None
        include_resource_uri = False
        filtering = {
            "date": ALL,
            "lang": ALL,
        }

class GeoHappsResource(ModelResource):
    happiness = FixedFloatField(attribute="value")
    class Meta:
        queryset = GeoHapps.objects.all()
        excludes = ["value","id",]
        resource_name = "geohapps"
        limit = 500
        # default_format = ["json"]
        max_limit = None
        include_resource_uri = False
        filtering = {
            "date": ALL,
            "stateName": ALL,
            "stateId": ALL,
        }

class WordResource(ModelResource):
    # happiness = FixedFloatField(attribute="value")
    class Meta:
        queryset = Word.objects.all()
        excludes = ["id",]
        resource_name = "words"
        limit = 20000
        # default_format = ["json"]
        max_limit = None
        include_resource_uri = False
        filtering = {
            "word": ALL,
            "rank": ALL,
            "happs": ALL,
            "stdDev": ALL,
        }

class BookResource(ModelResource):
    happiness = FixedFloatField(attribute="happs")
    reference = fields.CharField("filename")
    ignorewords = fields.CharField("ignorewords")
    author = fields.CharField("author")
    class Meta:
        queryset = Book.objects.filter(length__gte=10000)
        resource_name = "gutenberg"
        # excludes = ["happs","id","filename",]
        include_resource_uri = False
        max_limit = None
        limit = 50000
        filtering = {
            "title": ALL_WITH_RELATIONS,
            "author": ALL_WITH_RELATIONS,
            "id": ALL,
            "length": ALL_WITH_RELATIONS,
            "annotation": ALL,
        }

class MovieResource(ModelResource):
    happiness = FixedFloatField(attribute="happs")
    reference = fields.CharField("filename")
    ignorewords = fields.CharField("ignorewords")
    director = fields.CharField("director")
    class Meta:
        queryset = Movie.objects.filter(length__gte=10000)
        resource_name = "movies"
        # excludes = ["happs","id","filename",]
        include_resource_uri = False
        max_limit = None
        limit = 50000
        filtering = {
            "title": ALL_WITH_RELATIONS,
            "director": ALL_WITH_RELATIONS,
            "id": ALL,
            "length": ALL_WITH_RELATIONS,
            "annotation": ALL,
        }

class RandomBookResource(ModelResource):
    reference = fields.CharField("filename")
    class Meta:
        queryset = Book.objects.filter(length__gte=20000).order_by("?")
        resource_name = "randombook"
        limit = 1

class AnnotationResource(ModelResource):
    book = fields.ForeignKey(BookResource, 'book')
    class Meta:
        queryset = Annotation.objects.all()
        resource_name = "annotation"
        limit = 500
        filtering = {
            "book": ALL_WITH_RELATIONS,
            "position": ALL,
            "winner": ALL,
        }

class MovieAnnotationResource(ModelResource):
    movie = fields.ForeignKey(MovieResource, 'movie')
    class Meta:
        queryset = Annotation.objects.all()
        resource_name = "movieannotation"
        limit = 500
        filtering = {
            "movie": ALL_WITH_RELATIONS,
            "position": ALL,
            "winner": ALL,
        }









