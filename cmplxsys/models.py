from django.db import models

# Create your models here.

# a model for the people
class Person(models.Model):
    uname = models.CharField(max_length=20)
    affiliation = models.CharField(max_length=200, default="University of Vermont")
    name = models.CharField(max_length=200)
    webpage = models.CharField(max_length=200, null=True, blank=True, default="")
    linkedin = models.CharField(max_length=200, null=True, blank=True, default="")
    twitter = models.CharField(max_length=200, null=True, blank=True, default="")
    strava = models.CharField(max_length=200, null=True, blank=True, default="")
    facebook = models.CharField(max_length=200, null=True, blank=True, default="")
    youtube = models.CharField(max_length=200, null=True, blank=True, default="")
    vine = models.CharField(max_length=200, null=True, blank=True, default="")
    instagram = models.CharField(max_length=200, null=True, blank=True, default="")
    scholar = models.CharField(max_length=200, null=True, blank=True, default="")
    github = models.CharField(max_length=200, null=True, blank=True, default="")
    bitbucket = models.CharField(max_length=200, null=True, blank=True, default="")
    stackoverflow = models.CharField(max_length=200, null=True, blank=True, default="")
    plus = models.CharField(max_length=200, null=True, blank=True, default="")
    pinterest = models.CharField(max_length=200, null=True, blank=True, default="")

    def __unicode__(self):
        return self.uname

    class Meta:
        ordering = ('uname',)
    
class Paper(models.Model):
    title = models.CharField(max_length=500)
    abstract = models.CharField(max_length=2000, default="There are none.")
    img = models.CharField(max_length=200, null=True, blank=True,)
    status = models.CharField(max_length=200)
    arxiv = models.CharField(max_length=200, null=True, blank=True)
    journal = models.CharField(max_length=200, null=True, blank=True)
    authors = models.ManyToManyField(Person)

    def __unicode__(self):
        return self.title

class Press(models.Model):
    title = models.CharField(max_length=500, default="UVM Researcher catapaults into fame.")
    url = models.CharField(max_length=2000, default="http://www.nytimes.com")
    author = models.CharField(max_length=200, null=True, blank=True,)
    date = models.DateTimeField('date published')
    description = models.CharField(max_length=200, null=True, blank=True)
    imagelink = models.CharField(max_length=200, null=True, blank=True)
    organization = models.CharField(max_length=200, null=True, blank=True)
    paper = models.ManyToManyField(Paper)

    def __unicode__(self):
        return self.title

class Project(models.Model):
    title = models.CharField(max_length=500, default="Earth shattering project.")
    description = models.CharField(max_length=200, null=True, blank=True)
    people = models.ManyToManyField(Person)

    def __unicode__(self):
        return self.title

class Funding(models.Model):
    title = models.CharField(max_length=500, default="100M Award.")
    url = models.CharField(max_length=2000, default="http://www.nsf.gov")
    startdate = models.DateTimeField('date begins')
    enddate = models.DateTimeField('date ends')
    shortdescription = models.CharField(max_length=200, null=True, blank=True)
    longdescription = models.CharField(max_length=2000, null=True, blank=True)
    source = models.CharField(max_length=200, null=True, blank=True)
    project = models.ManyToManyField(Project)

    def __unicode__(self):
        return self.title









