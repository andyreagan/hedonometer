from hedonometer.models import Event,Book,Happs,Word,GeoHapps,Movie,Director,Actor,Writer,NYT
from twython_django.models import TwitterProfile,Annotation,MovieAnnotation
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie import fields
from tastypie.serializers import Serializer

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
            "region": ALL,
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
    def dehydrate(self, bundle):
        bundle.data['text'] = bundle.data['word']
        return bundle

    class Meta:
        queryset = Word.objects.all()
        excludes = ["id",]
        resource_name = "words"
        limit = 20000
        # default_format = ["json"]
        max_limit = None
        include_resource_uri = False
        # fields = ['username', 'first_name', 'last_name', 'last_login']
        filtering = {
            "word": ALL,
            "rank": ALL,
            "happs": ALL,
            "stdDev": ALL,
            # "text": ALL,
        }
        # these other formats could be better
        # but HTML, for example, isn't implemented yet
        # serializer = Serializer(formats=['json', 'jsonp', 'xml', 'yaml', 'html', 'plist'])

class NYTResource(ModelResource):
    happiness = FixedFloatField(attribute="happs")
    class Meta:
        queryset = NYT.objects.all().exclude(genre='all').order_by('-happs')
        excludes = ["happs",]
        resource_name = "nyt"
        limit = 30
        # default_format = ["json"]
        # max_limit = None
        # include_resource_uri = False
        filtering = {
            "genre": ALL,
        }

class NYTResourceAll(ModelResource):
    happiness = FixedFloatField(attribute="happs")
    class Meta:
        queryset = NYT.objects.all().order_by('-happs')
        excludes = ["happs",]
        resource_name = "nytall"
        limit = 30
        # default_format = ["json"]
        # max_limit = None
        # include_resource_uri = False
        filtering = {
            "genre": ALL,
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

class DirectorResource(ModelResource):
    class Meta:
        queryset = Director.objects.all()
        resource_name = 'director'
        filtering = {
            'name': ALL,
        }

class ActorResource(ModelResource):
    class Meta:
        queryset = Actor.objects.all()
        resource_name = 'actor'
        filtering = {
            'name': ALL,
        }

class WriterResource(ModelResource):
    class Meta:
        queryset = Writer.objects.all()
        resource_name = 'writer'
        filtering = {
            'name': ALL,
        }

class MovieResource(ModelResource):
    happiness = FixedFloatField(attribute="happs")
    reference = fields.CharField("filename")
    ignorewords = fields.CharField("ignorewords")
    director = fields.ManyToManyField('hedonometer.api.DirectorResource','director',full=True)
    writer = fields.ManyToManyField('hedonometer.api.DirectorResource','writer',full=True)
    actor = fields.ManyToManyField('hedonometer.api.DirectorResource','actor',full=True)
    class Meta:
        queryset = Movie.objects.all().exclude(exclude=True)
        resource_name = "movies"
        # excludes = ["happs","id","filename",]
        include_resource_uri = False
        max_limit = None
        limit = 50000
        filtering = {
            "title": ALL_WITH_RELATIONS,
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

class RandomMovieResource(ModelResource):
    reference = fields.CharField("filename")
    class Meta:
        queryset = Movie.objects.all().order_by("?")
        resource_name = "randommovie"
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
        queryset = MovieAnnotation.objects.all()
        resource_name = "movieannotation"
        limit = 500
        filtering = {
            "movie": ALL_WITH_RELATIONS,
            "position": ALL,
            "winner": ALL,
            "window": ALL,
        }









