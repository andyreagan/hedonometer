from django.db import models

# Create your models here.

# a model for the people
# pointed to by courses (twice), papers, projects
class Person(models.Model):
    # username
    uname = models.CharField(max_length=20)
    # eventually can build a model for affiliations (VACC, UVM, CSYS, CS, MATH, etc)
    # but bigger fish to fry right now
    affiliation = models.CharField(max_length=200, default="University of Vermont")
    fullname = models.CharField(max_length=200)
    # split up name is optional, for now
    first = models.CharField(max_length=200, null=True, blank=True, default="")
    middle = models.CharField(max_length=200, null=True, blank=True, default="")
    last = models.CharField(max_length=200, null=True, blank=True, default="")
    sur = models.CharField(max_length=200, null=True, blank=True, default="")
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
        return self.fullname

    class Meta:
        ordering = ('uname',)


# courses
# papers will point to them
# they point to students and teachers (both Persons)
class Course(models.Model):
    shortcode = models.CharField(max_length=500, default="CSYS 500.")
    title = models.CharField(max_length=500, default="Learn all the things.")
    description = models.CharField(max_length=2000, default="")
    logline = models.CharField(max_length=500, default="")
    url = models.CharField(max_length=2000, default="http://www.uvm.edu/~bagrow")
    nextoffering = models.DateTimeField('date offered next')
    numtimesoffered = models.CharField(max_length=200, null=True, blank=True)
    imagelink = models.CharField(max_length=200, null=True, blank=True)

    students = models.ManyToManyField(Person,related_name='courses_taught')
    teachers = models.ManyToManyField(Person,related_name='courses_taken')

    def __unicode__(self):
        return self.shortcode
    
# papers
# point to class, authors
# pointed to by press
class Paper(models.Model):
    title = models.CharField(max_length=500)
    logline = models.CharField(max_length=500)
    abstract = models.CharField(max_length=2000, default="There are none.")
    img = models.CharField(max_length=200, null=True, blank=True,)
    status = models.CharField(max_length=200)
    arxiv = models.CharField(max_length=200, null=True, blank=True)
    journal = models.CharField(max_length=200, null=True, blank=True)
    volume = models.CharField(max_length=200, null=True, blank=True)
    pages = models.CharField(max_length=200, null=True, blank=True)
    year = models.CharField(max_length=200, null=True, blank=True)
    googlescholarlink = models.CharField(max_length=200, null=True, blank=True)
    preprintlink = models.CharField(max_length=200, null=True, blank=True)
    supplementarylink = models.CharField(max_length=200, null=True, blank=True)
    onlineappendices = models.CharField(max_length=200, null=True, blank=True)
    journalpagelink = models.CharField(max_length=200, null=True, blank=True)
    arxivlink = models.CharField(max_length=200, null=True, blank=True)
    titlelink = models.CharField(max_length=200, null=True, blank=True)
    bibref = models.CharField(max_length=200, null=True, blank=True)
    timescited = models.CharField(max_length=20, null=True, blank=True)

    authors = models.ManyToManyField(Person)
    fromclass = models.ManyToManyField(Course)

    def __unicode__(self):
        return self.title

# press
# points to papers
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








