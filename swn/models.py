from django.db import models
from django.utils import timezone
import datetime
from django.contrib.auth.models import User

class Topic(models.Model):
    title = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')
    def __unicode__(self):
        return self.title
    def was_published_recently(self):
        now = timezone.now()
        return now - datetime.timedelta(days=1) <= self.pub_date < now
    was_published_recently.admin_order_field = 'pub_date'
    was_published_recently.boolean = True
    was_published_recently.short_description = 'Published Recently?'
    # class Meta:
    #     app_label = 'Six Word Novels'

class Swn(models.Model):
    topic = models.ForeignKey(Topic)
    text = models.CharField(max_length=200)
    votes = models.IntegerField(default=1)
    pub_date = models.DateTimeField('date submitted') 
    # user = models.ForeignKey(User)
    def __unicode__(self):
        return self.text
    # class Meta:
    #     verbose_name = 'Six Word Novel' 
    #     verbose_name_plural = 'Six Word Novels' 
    #     app_label = 'Six Word Novels'

class Like(models.Model):
    # user = models.ForeignKey(User)
    swn = models.ForeignKey(Swn)
    pub_date = models.DateTimeField(auto_now_add=True)

# this would replace my Like class, but it's out of date
# import secretballot
# secretballot.enable_voting_on(Swn)
