# inspiration: https://www.obeythetestinggoat.com/book/chapter_01.html
import datetime
import os
from selenium import webdriver
import unittest
import requests
import json
import django

os.environ["DJANGO_SETTINGS_MODULE"] = 'mysite.settings'
django.setup()

from hedonometer.models import Timeseries, Happs, Event, WordList, Word

shortcodes = {
    "arabic": "ar",
    "chinese": "zh",
    "english": "en",
    "french": "fr",
    "german": "de",
    "hindi": "hi",
    "indonesian": "id",
    "korean": "ko",
    "pashto": "ps",
    "portuguese": "pt",
    "russian": "ru",
    "spanish": "es",
    "urdu": "ur",
}
shortcodes_reverse = {y: x for x, y in shortcodes.items()}


def clear_all():
    Event.objects.all().delete()
    Happs.objects.all().delete()
    Timeseries.objects.all().delete()
    WordList.objects.all().delete()
    Word.objects.all().delete()


def load_wordlists(DATA_DIR='../hedonometer-data-munging/labMT', max_words=100):
    # https://arxiv.org/abs/1108.5192
    wl = WordList(title="labMT-en-v1", date="2011-08-25", language="en", reference="https://arxiv.org/abs/1108.5192", referencetitle="Positivity of the English language")
    wl.save()

    with open(os.path.join(DATA_DIR, "labMTwords-english.csv"), "r") as f:
        labMTwords = f.read().strip().split("\n")
    with open(os.path.join(DATA_DIR, "labMTscores-english.csv"), "r") as f:
        labMTscores = f.read().strip().split("\n")
    with open(os.path.join(DATA_DIR, "labMTscoresStd-english.csv"), "r") as f:
        labMTscoresStd = f.read().strip().split("\n")
    for i, (word, score, std) in enumerate(list(zip(labMTwords, labMTscores, labMTscoresStd))[:max_words]):
        w = Word(wordlist=wl, word=word, word_english=word, rank=i, happs=float(score), stdDev=float(std))
        w.save()

    for lang in {'arabic', 'chinese', 'french', 'german', 'hindi', 'indonesian', 'korean', 'pashto', 'portuguese', 'russian', 'spanish', 'urdu'}:
        shortcode = shortcodes[lang]
        # https://arxiv.org/abs/1406.3855
        wl = WordList(title="labMT-"+shortcode+"-v1", date="2014-06-14", language=shortcode, reference="https://arxiv.org/abs/1406.3855", referencetitle="Human language reveals a universal positivity bias")
        wl.save()
        with open(os.path.join(DATA_DIR, "labMTwords-"+lang+".csv"), "r") as f:
            labMTwords = f.read().strip().split("\n")
        with open(os.path.join(DATA_DIR, "labMTwordsEn-"+lang+".csv"), "r") as f:
            labMTwordsEn = f.read().strip().split("\n")
        with open(os.path.join(DATA_DIR, "labMTscores-"+lang+".csv"), "r") as f:
            labMTscores = f.read().strip().split("\n")
        if os.path.isfile(os.path.join(DATA_DIR, "labMTscoresStd-"+lang+".csv")):
            with open(os.path.join(DATA_DIR, "labMTscoresStd-"+lang+".csv"), "r") as f:
                labMTscoresStd = f.read().strip().split("\n")
        else:
            labMTscoresStd = ["-1" for i in range(len(labMTscores))]
        for i, (word, wordEn, score, std) in enumerate(list(zip(labMTwords, labMTwordsEn, labMTscores, labMTscoresStd))[:max_words]):
            # print(wl.title, word, wordEn, score, std)
            w = Word(wordlist=wl, word=word, word_english=wordEn, rank=i, happs=float(score), stdDev=float(std))
            w.save()
            # print(wl.title, word, wordEn, score, std)

    for lang in {'english', 'spanish', 'arabic', 'chinese', 'french', 'german', 'indonesian', 'korean', 'portuguese', 'russian'}:
    # for lang in {'spanish'}:
        shortcode = shortcodes[lang]
        wl, created = WordList.objects.get_or_create(title="labMT-"+shortcode+"-v2", date="2020-03-28", language=shortcode, reference="https://arxiv.org/abs/2003.12614", referencetitle="How the world's collective attention is being paid to a pandemic: COVID-19 related 1-gram time series for 24 languages on Twitter")
        wl.save()
        if not created:
            wl.word_set.all().delete()
        wl_h, created = WordList.objects.get_or_create(title="labMT-"+shortcode+"-v2-hashtags", date="2020-03-28", language=shortcode, reference="https://arxiv.org/abs/2003.12614", referencetitle="How the world's collective attention is being paid to a pandemic: COVID-19 related 1-gram time series for 24 languages on Twitter")
        wl_h.save()
        if not created:
            wl_h.word_set.all().delete()

        with open(os.path.join(DATA_DIR, "labMTwords-"+lang+"-v2-2020-03-28.csv"), "r") as f:
            labMTwords = f.read().strip().split("\n")
        if os.path.isfile(os.path.join(DATA_DIR, "labMTwordsEn-"+lang+"-v2-2020-03-28.csv")):
            with open(os.path.join(DATA_DIR, "labMTwordsEn-"+lang+"-v2-2020-03-28.csv"), "r") as f:
                labMTwordsEn = f.read().strip().split("\n")
        else:
            labMTwordsEn = labMTwords
        with open(os.path.join(DATA_DIR, "labMTscores-"+lang+"-v2-2020-03-28.csv"), "r") as f:
            labMTscores = f.read().strip().split("\n")
        if os.path.isfile(os.path.join(DATA_DIR, "labMTscoresStd-"+lang+"-v2-2020-03-28.csv")):
            with open(os.path.join(DATA_DIR, "labMTscoresStd-"+lang+"-v2-2020-03-28.csv"), "r") as f:
                labMTscoresStd = f.read().strip().split("\n")
        else:
            labMTscoresStd = ["-1" for i in range(len(labMTscores))]

        for i, (word, wordEn, score, std) in enumerate(list(zip(labMTwords, labMTwordsEn, labMTscores, labMTscoresStd))[:max_words]):
            # print(wl.title, word, wordEn, score, std)
            w = Word(wordlist=wl, word=word, word_english=wordEn, rank=i, happs=float(score), stdDev=float(std))
            w.save()
            w = Word(wordlist=wl_h, word=word, word_english=wordEn, rank=i, happs=float(score), stdDev=float(std))
            w.save()
            w = Word(wordlist=wl_h, word=("#" + word), word_english=("#" + wordEn), rank=(len(labMTwords) + i), happs=float(score), stdDev=float(std))
            w.save()
            # print(wl.title, word, wordEn, score, std)


def create_timeseries():
    for lang in {('en', 'english')}:
        for set_ in {('all', 'All Tweets'), ('rt', 'Only Retweets'), ('no_rt', 'All original Tweets')}:
            short = '_'.join([lang[0], set_[0]])
            t = Timeseries(
                title=short,
                directory='storywrangler_' + short,
                mediaFlag=set_[1],
                showindropdown=(set_[0] == 'all'),
                wordList=WordList.objects.get(title="labMT-"+lang[0]+"-v2"),
                sourceDir='/users/j/m/jminot/scratch/labmt/storywrangler_v2/storywrangler_' + short + '/count_vec'
            )
            t.save()
    langs = {"ar", "de", "es", "fr", "id", "ko", "pt", "ru"}
    for lang in langs:
        for set_ in {('all', 'All Tweets'), ('rt', 'Only Retweets'), ('no_rt', 'All original Tweets')}:
            short = '_'.join([lang, set_[0]])
            wl = WordList.objects.get(title="labMT-"+lang+"-v2-hashtags")
            print(wl)
            t = Timeseries(
                title=short,
                directory='storywrangler_' + short,
                mediaFlag=set_[1],
                showindropdown=(set_[0] == 'all'),
                wordList=wl,
                sourceDir='/users/j/m/jminot/scratch/labmt/storywrangler_v2/other_langs/storywrangler_' + short + '/count_vec'
            )
            t.save()
            print('mkdir -p storywrangler_' + short + " shifts")
            print('mkdir -p storywrangler_' + short + " word-vectors")

def create_happs():
    for t in Timeseries.objects.all():
        r = requests.get("http://hedonometer.org/api/v1/happiness/?timeseries__title=" + t.title)
        x = json.loads(r.content)
        for h in x["objects"]:
            Happs(timeseries=t, date=datetime.datetime.strptime(h["date"], "%Y-%m-%d"), value=float(h["happiness"]), frequency=h["frequency"]).save()


def create_events():
    for t in Timeseries.objects.all():
        r = requests.get("http://hedonometer.org/api/v1/events/?happs__timeseries__title=" + t.title)
        x = json.loads(r.content)
        for e in x['objects']:
            e = Event(happs=Happs.objects.get(timeseries=t, date=e['happs']['date']),
                      importance = e['importance'],
                      x = e['x'],
                      y = e['y'],
                      shorter = e['shorter'],
                      longer = e['longer'],
                      wiki = e['wiki'],
            )
            e.save()


def create_all():
    load_wordlists(max_words=100)
    create_timeseries()
    create_happs()
    create_events()


class NewVisitorTest(unittest.TestCase):
    def setUp(self):
        self.browser = webdriver.Chrome()

    def tearDown(self):
        self.browser.quit()



class TimeseriesTest(unittest.TestCase):
    def setUp(self):
        self.browser = webdriver.Chrome()

    def tearDown(self):
        self.browser.quit()

    def test_can_get_homepage(self):
        # Check out the homepage
        self.browser.get('http://127.0.0.1:8000/timeseries/en_all/')
        self.assertIn('Hedonometer', self.browser.title)

    def test_index_redirect(self):
        # Check out the homepage
        self.browser.get('http://127.0.0.1:8000/index.html')
        self.assertIn('Hedonometer', self.browser.title)
        self.assertEquals('http://127.0.0.1:8000/timeseries/en_all/', self.browser.title)


if __name__ == '__main__':
    # clear_all()
    # create_all()
    unittest.main(warnings='ignore')
