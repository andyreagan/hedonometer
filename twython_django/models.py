from django.db import models
from django.contrib.auth import get_user_model
from hedonometer.models import Book,Movie

User = get_user_model()

class TwitterProfile(models.Model):
    """
        An example Profile model that handles storing the oauth_token and
        oauth_secret in relation to a user. Adapt this if you have a current
        setup, there's really nothing special going on here.
    """
    user = models.OneToOneField(User)
    oauth_token = models.CharField(max_length=200)
    oauth_secret = models.CharField(max_length=200)

class Annotation(models.Model):
    book = models.ForeignKey(Book)
    user = models.ForeignKey(TwitterProfile)
    # give a position in percentage
    position = models.CharField(max_length=100)
    annotation = models.CharField(max_length=400)
    tweeted = models.CharField(max_length=100)
    date = models.DateTimeField()
    # pre-sum the number of votes
    votes = models.IntegerField()
    winner = models.CharField(max_length=1)

    class Meta:
        ordering = ('date',)

    def __unicode__(self):
        return self.annotation

class Vote(models.Model):
    user = models.ForeignKey(TwitterProfile)
    annotation = models.ForeignKey(Annotation)
    date = models.DateTimeField()

class MovieAnnotation(models.Model):
    movie = models.ForeignKey(Movie)
    user = models.ForeignKey(TwitterProfile)
    # give a position in percentage
    position = models.CharField(max_length=100)
    annotation = models.CharField(max_length=400)
    tweeted = models.CharField(max_length=100)
    date = models.DateTimeField()
    # pre-sum the number of votes
    votes = models.IntegerField()
    winner = models.CharField(max_length=1)
    window = models.CharField(max_length=6)

    class Meta:
        ordering = ('date',)

    def __unicode__(self):
        return self.annotation
        
class MovieVote(models.Model):
    user = models.ForeignKey(TwitterProfile)
    annotation = models.ForeignKey(MovieAnnotation)
    date = models.DateTimeField()

