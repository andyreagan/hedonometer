from django.db import models

from django.contrib.auth import get_user_model

User = get_user_model()

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
    x = models.IntegerField(max_length=4)
    y = models.IntegerField(max_length=4)
    shorter = models.CharField(max_length=200, help_text="Use commas to make new lines on the main visualization label.")
    longer = models.TextField(max_length=200, help_text="Shows up in the description of the event inside shift popups (big and small).")
    wiki = models.URLField()
    imagelink = models.URLField(null=True, blank=True)
    # happs = models.OneToOneField('Happs')
    lang = models.CharField(max_length=20)

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
    director = models.ManyToManyField(Director)
    actor = models.ManyToManyField(Actor)
    writer = models.ManyToManyField(Writer)
    language = models.CharField(max_length=100, null=True, blank=True)
    happs = models.FloatField()
    length = models.CharField(max_length=100, null=True, blank=True)
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
    customFullText = models.CharField(max_length=600, null=True, blank=True)
    customTitleText = models.CharField(max_length=200, null=True, blank=True)
    contextFlag = models.CharField(max_length=200, null=True, blank=True)
    author = models.ForeignKey(User,null=True)
