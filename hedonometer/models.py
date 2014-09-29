from django.db import models

# Create your models here.
class Happs(models.Model):
    date = models.DateTimeField()
    value = models.FloatField()

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

class Embeddable(models.Model):
    # the hash
    # will look things up by this
    h = models.CharField(max_length=64)
    # store the filenames and some titles for the things
    refFile = models.CharField(max_length=200, null=True, blank=True)
    refFileName = models.CharField(max_length=200, null=True, blank=True)
    compFile = models.CharField(max_length=200, null=True, blank=True)
    compFileName = models.CharField(max_length=200, null=True, blank=True)
