from django.db import models
from django.contrib.auth.models import User


class WordList(models.Model):
    date = models.DateField()
    title = models.CharField(max_length=100, unique=True)
    language = models.CharField(max_length=50, default="english")
    reference = models.URLField()
    referencetitle = models.CharField(max_length=300, default="this paper")

    def __str__(self):
        return self.title

class Word(models.Model):
    wordlist = models.ForeignKey(WordList, on_delete=models.CASCADE, to_field='title', default='labMT-en-v1')
    word = models.CharField(max_length=100)
    word_english = models.CharField(max_length=200, blank=True)
    rank = models.IntegerField()
    happs = models.FloatField()
    stdDev = models.FloatField()

    def __str__(self):
        return str(self.wordlist) + " - " + self.word + " ({0:.2f})".format(self.happs)


class Timeseries(models.Model):
    title = models.CharField(max_length=100, help_text="Title to use in the URL.", unique=True)
    directory = models.CharField(max_length=100, help_text="Name of the directory for this particular time series.")
    customLongTitle = models.CharField(
        max_length=200, default='Average Happiness for Twitter', help_text='Title on the webpage.')
    language = models.CharField(max_length=100, help_text='Second underlined part of the subtitle.')
    mediaFlag = models.CharField(max_length=50, default='All tweets', help_text='Describe the type of data. First part of the subtitle.')
    sumHappsFile = models.CharField(
        max_length=100, default='sumhapps.csv', help_text='Name of the CSV with date,happs for the full time series.')
    wordVecDir = models.CharField(max_length=100, default='word-vectors', help_text="Directory name with daily word vectors (as subdir of `directory`).")
    shiftDir = models.CharField(max_length=100, default='shifts', help_text="Directory name with daily pre-shifted word vectors (as subdir of `directory`).")
    stopWordList = models.CharField(max_length=100, default='stopwords.csv',  blank=True, help_text="Name of the csv of words to exclude.")
    wordList = models.CharField(max_length=100, default='labMTwords-english-covid.csv', help_text="Name of the csv of words.")
    wordListEnglish = models.CharField(max_length=100, default='labMTwords-english-covid.csv', help_text="Name of the csv of words in English.")
    scoreList = models.CharField(max_length=100, default='labMTscores-english-covid.csv', help_text="Name of the csv of scores.")
    sourceDir = models.CharField(max_length=200, default='/users/j/m/jminot/scratch/labmt/storywrangler_en', help_text="Directory on the VACC to pull daily vectors from.")

    def __str__(self):
        return self.title

    class Meta:
        ordering = ('title',)


class Happs(models.Model):
    timeseries = models.ForeignKey(Timeseries, on_delete=models.CASCADE, to_field='title', default='main')
    date = models.DateField()
    value = models.FloatField()
    frequency = models.FloatField(default=0)

    def __str__(self):
        return " ".join([self.timeseries.title, self.date.strftime('%Y-%m-%d')])


class HappsEvent(Happs):
    class Meta:
        proxy = True


class Event(models.Model):
    happs = models.OneToOneField(Happs, on_delete=models.CASCADE, related_name='event')
    importance = models.IntegerField(help_text="Centered at 0, higher numbers keep the event on the vizualization as you zoom out, lower numbers hide it earlier.")
    x = models.IntegerField(help_text="x offset of annotation")
    y = models.IntegerField(help_text="y offset of annotation")
    shorter = models.CharField(max_length=200, help_text="Use commas to make new lines on the main visualization label.")
    longer = models.TextField(max_length=200, help_text="Shows up in the description of the event inside shift popups (big and small).")
    wiki = models.URLField()

    def __str__(self):
        return self.shorter.replace(",", " ")


class Book(models.Model):
    filename = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    language = models.CharField(max_length=100)
    happs = models.FloatField()
    length = models.IntegerField()
    ignorewords = models.CharField(max_length=400)
    wiki = models.URLField()

    def __str__(self):
        return self.title

    class Meta:
        ordering = ('author',)


class GutenbergAuthor(models.Model):
    fullname = models.CharField(max_length=100)
    note = models.CharField(max_length=100, blank=True)
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
    excludeReason = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.title


class NYT(models.Model):
    genre = models.CharField(max_length=100)
    language = models.CharField(max_length=100)
    filename = models.CharField(max_length=100)
    happs = models.FloatField()
    numwords = models.FloatField()
    variance = models.FloatField()
    ignorewords = models.CharField(max_length=400, blank=True)

    def __str__(self):
        return self.genre

    class Meta:
        ordering = ('genre',)

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


class Actor(models.Model):
    '''Actor class for each movie'''
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
    language = models.CharField(max_length=100, blank=True)
    happs = models.FloatField()
    happsStart = models.FloatField()
    happsEnd = models.FloatField()
    happsVariance = models.FloatField()
    happsMin = models.FloatField()
    happsMax = models.FloatField()
    happsDiff = models.FloatField()
    exclude = models.BooleanField()
    excludeReason = models.CharField(max_length=100, blank=True)
    length = models.IntegerField()
    # length = models.CharField(max_length=100, null=True, blank=True)
    ignorewords = models.CharField(max_length=400, blank=True)
    wiki = models.URLField(null=True, blank=True)
    image = models.URLField(null=True, blank=True)
    genre = models.CharField(max_length=400, blank=True)
    imdbid = models.CharField(max_length=400, blank=True)
    keywords = models.CharField(max_length=400, blank=True)
    metascore = models.CharField(max_length=400, blank=True)
    score = models.CharField(max_length=10, blank=True)
    rating = models.CharField(max_length=400, blank=True)
    releaseDate = models.DateTimeField(null=True, blank=True)
    reviews = models.CharField(max_length=400, blank=True)
    runtime = models.CharField(max_length=400, blank=True)
    storyline = models.CharField(max_length=400, blank=True)
    year = models.CharField(max_length=400, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ('title',)


class Embeddable(models.Model):
    # the hash
    # will look things up by this
    h = models.CharField(max_length=64)
    # store the filenames and some titles for the things
    refFile = models.CharField(max_length=200, blank=True)
    refFileName = models.CharField(max_length=200, blank=True)
    compFile = models.CharField(max_length=200, blank=True)
    compFileName = models.CharField(max_length=200, blank=True)

    nickName = models.CharField(max_length=200, default="My super wordshift.")

    # two options here, which can be blank
    # this stores a full text, which is comma separated for the lines (up to four lines)
    # separate by the @-sign
    customFullText = models.CharField(max_length=600, blank=True)
    # this stores just a title
    customTitleText = models.CharField(max_length=200, blank=True)

    # the idea here is that we can let the embed page know whether this is
    # coming from the user page, or from the
    contextFlag = models.CharField(max_length=200, blank=True)

    # for the user-created embeds, so we can query by them
    author = models.ForeignKey('twython_django.TwitterProfile', null=True, on_delete=models.CASCADE)

    # let's also add some more information about them
    createdDate = models.DateTimeField(null=True, blank=True)
    updatedDate = models.DateTimeField(null=True, blank=True)

    # a special list of words to exclude, comma separted
    stopWords = models.CharField(max_length=600, blank=True)

    lang = models.CharField(max_length=40)

    def __str__(self):
        return self.nickName


class Contact(models.Model):
    name = models.CharField(max_length=100, blank=True)
    email = models.CharField(max_length=100, blank=True)
    comment = models.TextField(max_length=1000, blank=True)
