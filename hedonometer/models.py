from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Happs(models.Model):
    date = models.DateTimeField()
    value = models.FloatField()
    lang = models.CharField(max_length=20)

class GeoHapps(models.Model):
    date = models.DateTimeField()
    stateId = models.IntegerField()
    stateName = models.CharField(max_length=100)
    value = models.FloatField()

class Word(models.Model):
    word = models.CharField(max_length=100)
    rank = models.IntegerField()
    happs = models.FloatField()
    stdDev = models.FloatField()
    twitterRank = models.IntegerField()
    googleBooksRank = models.IntegerField()
    newYorkTimesRank = models.IntegerField()
    lyricsRank = models.IntegerField()

class Event(models.Model):
    date = models.DateTimeField()
    value = models.CharField(max_length=20)
    importance = models.IntegerField(help_text="Centered at 0, higher numbers keep the event on the vizualization as you zoom out, lower numbers hide it earlier.")
    caption = models.CharField(max_length=200, null=True, blank=True)
    picture = models.CharField(max_length=200, null=True, blank=True)
    x = models.IntegerField()
    y = models.IntegerField()
    shorter = models.CharField(max_length=200, help_text="Use commas to make new lines on the main visualization label.")
    longer = models.TextField(max_length=200, help_text="Shows up in the description of the event inside shift popups (big and small).")
    wiki = models.URLField()
    imagelink = models.URLField(null=True, blank=True)
    # happs = models.OneToOneField('Happs')
    lang = models.CharField(max_length=20)
    region = models.CharField(max_length=100,default='world')

    def __unicode__(self):
        return self.caption

    class Meta:
        ordering = ('date',)

class Book(models.Model):
    filename = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    language = models.CharField(max_length=100)
    happs = models.FloatField()
    length = models.IntegerField()
    ignorewords = models.CharField(max_length=400)
    wiki = models.URLField()

    def __unicode__(self):
        return self.title

    class Meta:
        ordering = ('author',)

class GutenbergAuthor(models.Model):
    fullname = models.CharField(max_length=100)
    note = models.CharField(max_length=100,null=True, blank=True)
    gutenberg_id = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.fullname

class GutenbergBook(models.Model):
    title = models.CharField(max_length=200)
    pickle_object = models.FilePathField(null=True, blank=True)
    authors = models.ManyToManyField(GutenbergAuthor)
    language = models.CharField(max_length=100)
    lang_code_id = models.IntegerField(default=-1)
    downloads = models.IntegerField(default=0)
    
    gutenberg_id = models.IntegerField(null=True, blank=True)
    mobi_file_path = models.FilePathField(null=True, blank=True)
    epub_file_path = models.FilePathField(null=True, blank=True)
    txt_file_path = models.FilePathField(null=True, blank=True)
    expanded_folder_path = models.FilePathField(null=True, blank=True)
    
    # more basic info
    length = models.IntegerField(default=0)
    numUniqWords = models.IntegerField(default=0)
    ignorewords = models.CharField(max_length=400,
                                   help_text="Comma separated list of words to ignore from this one.")
    wiki = models.URLField(null=True, blank=True)
    scaling_exponent = models.FloatField(null=True, blank=True,
        help_text="Zipf law fit scaling exponent.")
    scaling_exponent_top100 = models.FloatField(null=True, blank=True,
        help_text="The scaling exponent fit across just the top 100.")

    # if we had an issue processing it....
    exclude = models.BooleanField(default=False)
    excludeReason = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.title

class NYT(models.Model):
    genre = models.CharField(max_length=100)
    language = models.CharField(max_length=100)
    filename = models.CharField(max_length=100)
    happs = models.FloatField()
    numwords = models.FloatField()
    variance = models.FloatField()
    ignorewords = models.CharField(max_length=400, null=True, blank=True)

    def __unicode__(self):
        return self.genre

    class Meta:
        ordering = ('genre',)

class Timeseries(models.Model):
    title = models.CharField(max_length=100)
    customLongTitle = models.CharField(max_length=200,default='Average Happiness for Twitter')
    mediaFlag = models.CharField(max_length=50,default='Tweets')
    language = models.CharField(max_length=100)
    regionID = models.CharField(max_length=100,null=True, blank=True)
    startDate = models.DateTimeField()
    endDate = models.DateTimeField()
    sumHappsFile = models.CharField(max_length=100,default='sumhapps.csv',help_text='dont change this')
    ignoreWords = models.CharField(max_length=400, null=True, blank=True)

    def __unicode__(self):
        return self.title

    class Meta:
        ordering = ('title',)

# Here's an example result from the API:
#
# {u'result': {u'cast': [{u'actor': u'Kristen Stewart', u'role': u'Bella Swan'},
#    {u'actor': u'Sarah Clarke', u'role': u'Ren\xe9e'},
#    {u'actor': u'Matt Bushell', u'role': u'Phil'},
#    {u'actor': u'Billy Burke', u'role': u'Charlie Swan'},
#    {u'actor': u'Gil Birmingham', u'role': u'Billy Black'},
#    {u'actor': u'Taylor Lautner', u'role': u'Jacob Black'},
#    {u'actor': u'Gregory Tyree Boyce', u'role': u'Tyler'},
#    {u'actor': u'Justin Chon', u'role': u'Eric'},
#    {u'actor': u'Michael Welch', u'role': u'Mike Newton'},
#    {u'actor': u'Anna Kendrick', u'role': u'Jessica'},
#    {u'actor': u'Christian Serratos', u'role': u'Angela'},
#    {u'actor': u'Nikki Reed', u'role': u'Rosalie'},
#    {u'actor': u'Kellan Lutz', u'role': u'Emmet Cullen'},
#    {u'actor': u'Ashley Greene', u'role': u'Alice Cullen'},
#    {u'actor': u'Jackson Rathbone', u'role': u'Jasper'}],
#   u'director': u'Catherine Hardwicke',
#   u'genre': [u'Drama', u'Fantasy', u'Romance'],
#   u'id': 1099212,
#   u'keywords': [u'vampire', u'love', u'blood', u'school', u'high school'],
#   u'language': u'English',
#   u'metascore': {u'given': 56, u'max': 100},
#   u'poster': u'http://ia.media-imdb.com/images/M/MV5BMTQ2NzUxMTAxN15BMl5BanBnXkFtZTcwMzEyMTIwMg@@._V1_SY1200_CR90,0,630,1200_AL_.jpg',
#   u'rating': {u'content': u'PG-13', u'given': 5.2, u'max': 10},
#   u'releaseDate': u'Fri Nov 21 2008',
#   u'reviews': {u'critic': 351, u'user': 1514},
#   u'runtime': u'PT122M',
#   u'storyline': u'A teenage girl risks everything when she falls in love with a vampire.',
#   u'title': u'Twilight',
#   u'writer': [u'Melissa Rosenberg', u'Stephenie Meyer'],
#   u'year': 2008},
#  u'success': True}



# actor for each movie
class Actor(models.Model):
    name = models.CharField(max_length=100)

class Director(models.Model):
    name = models.CharField(max_length=100)

class Writer(models.Model):
    name = models.CharField(max_length=100)

class Movie(models.Model):
    filename = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    titleraw = models.CharField(max_length=200)
    director = models.ManyToManyField(Director)
    actor = models.ManyToManyField(Actor)
    writer = models.ManyToManyField(Writer)
    language = models.CharField(max_length=100, null=True, blank=True)
    happs = models.FloatField()
    happsStart = models.FloatField()
    happsEnd = models.FloatField()
    happsVariance = models.FloatField()
    happsMin = models.FloatField()
    happsMax = models.FloatField()
    happsDiff = models.FloatField()
    exclude = models.BooleanField()
    excludeReason = models.CharField(max_length=100, null=True, blank=True)
    length = models.IntegerField()
    # length = models.CharField(max_length=100, null=True, blank=True)
    ignorewords = models.CharField(max_length=400, null=True, blank=True)
    wiki = models.URLField(null=True, blank=True)
    image = models.URLField(null=True, blank=True)
    genre = models.CharField(max_length=400, null=True, blank=True)
    imdbid = models.CharField(max_length=400, null=True, blank=True)
    keywords = models.CharField(max_length=400, null=True, blank=True)
    metascore = models.CharField(max_length=400, null=True, blank=True)
    score = models.CharField(max_length=10, null=True, blank=True)
    rating = models.CharField(max_length=400, null=True, blank=True)
    releaseDate = models.DateTimeField(null=True, blank=True)
    reviews = models.CharField(max_length=400, null=True, blank=True)
    runtime = models.CharField(max_length=400, null=True, blank=True)
    storyline = models.CharField(max_length=400, null=True, blank=True)
    year = models.CharField(max_length=400, null=True, blank=True)

    def __unicode__(self):
        return self.title

    class Meta:
        ordering = ('title',)

class Embeddable(models.Model):
    # the hash
    # will look things up by this
    h = models.CharField(max_length=64)
    # store the filenames and some titles for the things
    refFile = models.CharField(max_length=200, null=True, blank=True)
    refFileName = models.CharField(max_length=200, null=True, blank=True)
    compFile = models.CharField(max_length=200, null=True, blank=True)
    compFileName = models.CharField(max_length=200, null=True, blank=True)

    nickName = models.CharField(max_length=200, default="My super wordshift.")

    # two options here, which can be blank
    # this stores a full text, which is comma separated for the lines (up to four lines)
    # separate by the @-sign
    customFullText = models.CharField(max_length=600, null=True, blank=True)
    # this stores just a title
    customTitleText = models.CharField(max_length=200, null=True, blank=True)

    # the idea here is that we can let the embed page know whether this is
    # coming from the user page, or from the 
    contextFlag = models.CharField(max_length=200, null=True, blank=True)
    
    # for the user-created embeds, so we can query by them
    author = models.ForeignKey('twython_django.TwitterProfile',null=True)

    # let's also add some more information about them
    createdDate = models.DateTimeField(null=True, blank=True)
    updatedDate = models.DateTimeField(null=True, blank=True)

    # a special list of words to exclude, comma separted
    stopWords = models.CharField(max_length=600, null=True, blank=True)

    lang = models.CharField(max_length=40)
    
    def __unicode__(self):
        return self.nickName

class Song(models.Model):
    # genres can be a comma sep list
    genres = models.CharField(max_length=100)
    # basic info:
    title = models.CharField(max_length=100)
    length = models.CharField(max_length=100)
    happs = models.FloatField()
    length = models.IntegerField()
    releaseDate = models.DateTimeField(null=True, blank=True)
    filename = models.CharField(max_length=100)

class Album(models.Model):
    title = models.CharField(max_length=100)
    releaseDate = models.DateTimeField(null=True, blank=True)
    # the record label
    label = models.CharField(max_length=100)
    happs = models.FloatField()
    # make this a ManyToMany so that songs can belong to mult. albums
    songs = models.ManyToManyField(Song)

class Band(models.Model):
    name = models.CharField(max_length=100)
    happs = models.FloatField()
    # make this a ManyToMany so that bands can collaborate
    albums = models.ManyToManyField(Album)
    # also links to the labMT vector and full text for this Band
    labMTfile = models.CharField(max_length=100)
    filename = models.CharField(max_length=100)

class Contact(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    email = models.CharField(max_length=100, null=True, blank=True)
    comment = models.TextField(max_length=1000, null=True, blank=True)



