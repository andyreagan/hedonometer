from hedonometer.models import *
# from hedonometer.models import Event,Book,Happs,Word,Movie,Director,Actor,Writer,NYT
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie import fields
from tastypie.serializers import Serializer
from django.utils.html import smart_urlquote


class FixedFloatField(fields.ApiField):
    """
    A field for return fixed-width floats.
    """
    dehydrated_type = 'string'
    help_text = 'Fixed precision numeric data. Ex: 26.73'

    def convert(self, value):
        if value is None:
            return None

        if value and not isinstance(value, str):
            value = '{0:.3f}'.format(value)

        return value

    def hydrate(self, bundle):
        value = super(FixedFloatField, self).hydrate(bundle)

        if value and not isinstance(value, str):
            value = '{0:.3f}'.format(value)

        return value


class SmartUrlField(fields.ApiField):
    """
    A field for urls in plain text.
    """
    dehydrated_type = 'string'
    help_text = 'a field for urls in plain text.'

    def convert(self, value):
        if value is None:
            return None

        return smart_urlquote(value)

    def hydrate(self, bundle):
        value = super(SmartUrlField, self).hydrate(bundle)

        return self.convert(value)


class TimeseriesResource(ModelResource):
    title = fields.CharField(attribute="title")
    class Meta:
        queryset = Timeseries.objects.all()
        resource_name = 'timeseries'
        filtering = {
            'title': ALL
        }


class HappsResource(ModelResource):
    happiness = FixedFloatField(attribute="value")
    timeseries = fields.ForeignKey(TimeseriesResource, 'timeseries')
    class Meta:
        queryset = Happs.objects.filter(exclude=False, frequency__gte=10000)
        excludes = ["value","id","exclude"]
        resource_name = "happiness"
        limit = 10000
        # default_format = ["json"]
        max_limit = None
        include_resource_uri = False
        filtering = {
            "date": ALL,
            "lang": ALL,
            "timeseries": ALL_WITH_RELATIONS
        }


class EventResource(ModelResource):
    happs = fields.ToOneField(HappsResource, 'happs', full=True)
    wiki = SmartUrlField(attribute="wiki")
    class Meta:
        queryset = Event.objects.all()
        resource_name = "events"
        limit = 1000
        # allowed_methods = ['get']
        filtering = {
            "importance": ALL,
            "happs": ALL_WITH_RELATIONS
        }


class WordListResource(ModelResource):
    title = fields.CharField(attribute="title")
    class Meta:
        queryset = WordList.objects.all()
        resource_name = 'wordlist'
        excludes = ["id", "showindropdown", "showinfulllist"]
        include_resource_uri = False
        filtering = {
            'title': ALL
        }


class WordResource(ModelResource):
    # happiness = FixedFloatField(attribute="value")
    wordlist = fields.ForeignKey(WordListResource, 'wordlist', full=True)

    def dehydrate(self, bundle):
        bundle.data['text'] = bundle.data['word']
        return bundle

    class Meta:
        queryset = Word.objects.all()
        excludes = ["id", "stopword"]
        resource_name = "words"
        limit = 30000
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
            "wordlist": ALL_WITH_RELATIONS,
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

class GutAuthorResource(ModelResource):
    class Meta:
        queryset = GutenbergAuthor.objects.all()
        resource_name = 'author'
        filtering = {
            'fullname': ALL,
        }

class BookResourceV3(ModelResource):
    gutenberg_id = fields.IntegerField("gutenberg_id")
    # author = fields.CharField("author")
    authors = fields.ManyToManyField('hedonometer.api.GutAuthorResource','authors',full=True)
    class Meta:
        queryset = GutenbergBook.objects.all()
        resource_name = "gutenbergv3"
        # excludes = ["happs","id","filename",]
        include_resource_uri = False
        max_limit = None
        limit = 5000
        filtering = {
            "title": ALL_WITH_RELATIONS,
            "authors": ALL_WITH_RELATIONS,
            "length": ALL_WITH_RELATIONS,
            "exclude": ALL_WITH_RELATIONS,
            "downloads": ALL_WITH_RELATIONS,
            "numUniqWords": ALL_WITH_RELATIONS,
            "lang_code_id": ALL_WITH_RELATIONS,
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

class MovieResourceMin(ModelResource):
    # happiness = FixedFloatField(attribute="happs")
    # reference = fields.CharField("filename")
    # ignorewords = fields.CharField("ignorewords")
    class Meta:
        queryset = Movie.objects.all().exclude(exclude=True).order_by('-happs')
        resource_name = "moviesminimal"
        excludes = ["id","exclude","excludeReason","language","happsStart","happsEnd","happsVariance","happsMin","happsMax","happsDiff","wiki","image","genre","imdbid","keywords","metascore","score","rating","releaseDate","reviews","runtime","storyline","year"]
        include_resource_uri = False
        max_limit = None
        limit = 50000
        filtering = {"length": ALL_WITH_RELATIONS,
                     "title": ALL_WITH_RELATIONS,
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







