from django.db import models
from django.contrib.auth import get_user_model

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

from hedonometer.models import Book

class Annotation(models.Model):
    book = models.ForeignKey(Book)
    user = models.ForeignKey(TwitterProfile)
    # give a position in percentage
    position = models.CharField(max_length=100)
    annotation = models.CharField(max_length=400)
    tweeted = models.CharField(max_length=100)
    date = models.DateTimeField()
