from django.db import models

# Create your models here.

class Event(models.Model):
    date = models.DateTimeField()
    value = models.CharField(max_length=20)
    importance = models.CharField(max_length=20)
    caption = models.CharField(max_length=200, null=True, blank=True)
    picture = models.CharField(max_length=200, null=True, blank=True)
    x = models.CharField(max_length=200)
    y = models.CharField(max_length=200)
    shorter = models.CharField(max_length=200)
    longer = models.TextField(max_length=200)
    wiki = models.CharField(max_length=500)

    def __unicode__(self):
        return self.caption

    class Meta:
        ordering = ('date',)
