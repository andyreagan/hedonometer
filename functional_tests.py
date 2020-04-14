# inspiration: https://www.obeythetestinggoat.com/book/chapter_01.html
from selenium import webdriver
import unittest
import requests
import json
from hedonometer.models import Timeseries, Happs, Event, WordList, Word
import datetime
import os


def load_wordlists(DATA_DIR='../hedonometer-data-munging/labMT', max_words=1000):
    WordList.objects.all().delete()
    Word.objects.all().delete()

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

    shortcodes = {'arabic': 'ar', 'chinese': 'zh', 'english': 'en', 'french': 'fr', 'german': 'de', 'hindi': 'hi', 'indonesian': 'id', 'korean': 'ko', 'pashto': 'ps', 'portuguese': 'pt', 'russian': 'ru', 'spanish': 'es', 'urdu': 'ur'}
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

    for lang in {'english', 'spanish'}:
        shortcode = shortcodes[lang]
        wl = WordList(title="labMT-"+shortcode+"-v2", date="2020-03-28", language=shortcode, reference="https://arxiv.org/abs/2003.12614", referencetitle="How the world's collective attention is being paid to a pandemic: COVID-19 related 1-gram time series for 24 languages on Twitter")
        wl.save()
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

        wl_h = WordList(title="labMT-"+shortcode+"-v2-hashtags", date="2020-03-28", language=shortcode, reference="https://arxiv.org/abs/2003.12614", referencetitle="How the world's collective attention is being paid to a pandemic: COVID-19 related 1-gram time series for 24 languages on Twitter")
        wl_h.save()

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
    Timeseries.objects.all().delete()
    for lang in {('en', 'english'), ('es', 'spanish')}:
        for set_ in {('all', 'All Tweets'), ('rt', 'All original Tweets'), ('no_rt', 'Only Retweets')}:
            short = '_'.join([lang[0], set_[0]])
            t = Timeseries(
                title=short,
                directory='storywrangler_' + short,
                language=lang[0],
                mediaFlag=set_[1],
                wordList='labMTwords-'+ lang[1] +'-covid.csv',
                scoreList='labMTscores-'+ lang[1] +'-covid.csv',
                sourceDir='/users/j/m/jminot/scratch/labmt/storywrangler_v2/storywrangler_' + short + '/count_vec'
            )
            t.save()


def create_happs():
    Happs.objects.all().delete()
    for t in Timeseries.objects.all():
        r = requests.get("http://hedonometer.org/api/v1/happiness/?timeseries__title=" + t.title)
        x = json.loads(r.content)
        for h in x["objects"]:
            Happs(timeseries=t, date=datetime.datetime.strptime(h["date"], "%Y-%m-%d"), value=float(h["happiness"]), frequency=h["frequency"]).save()


def create_events():
    Event.objects.all().delete()
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
        self.browser.get('http://127.0.0.1:8000/timeseries/main/')
        self.assertIn('Hedonometer', self.browser.title)

    def test_index_redirect(self):
        # Check out the homepage
        self.browser.get('http://127.0.0.1:8000/index.html')
        self.assertIn('Hedonometer', self.browser.title)
        self.assertEquals('http://127.0.0.1:8000/timeseries/main/', self.browser.title)


if __name__ == '__main__':
    unittest.main(warnings='ignore')
