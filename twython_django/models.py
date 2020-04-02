from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class TwitterProfile(models.Model):
    """
        An example Profile model that handles storing the oauth_token and
        oauth_secret in relation to a user. Adapt this if you have a current
        setup, there's really nothing special going on here.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    oauth_token = models.CharField(max_length=200)
    oauth_secret = models.CharField(max_length=200)

    def __str__(self):
        return self.user.username


class Annotation(models.Model):
    book = models.ForeignKey('hedonometer.Book', on_delete=models.CASCADE)
    user = models.ForeignKey(TwitterProfile, on_delete=models.CASCADE)
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

    def __str__(self):
        return self.annotation

class Vote(models.Model):
    user = models.ForeignKey(TwitterProfile, on_delete=models.CASCADE)
    annotation = models.ForeignKey(Annotation, on_delete=models.CASCADE)
    date = models.DateTimeField()

class MovieAnnotation(models.Model):
    movie = models.ForeignKey('hedonometer.Movie', on_delete=models.CASCADE)
    user = models.ForeignKey(TwitterProfile, on_delete=models.CASCADE)
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

    def __str__(self):
        return self.annotation

class MovieVote(models.Model):
    user = models.ForeignKey(TwitterProfile, on_delete=models.CASCADE)
    annotation = models.ForeignKey(MovieAnnotation, on_delete=models.CASCADE)
    date = models.DateTimeField()

