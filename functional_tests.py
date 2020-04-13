# inspiration: https://www.obeythetestinggoat.com/book/chapter_01.html
from selenium import webdriver
import unittest
import requests
import json


class NewVisitorTest(unittest.TestCase):
    def setUp(self):
        self.browser = webdriver.Chrome()

    def tearDown(self):
        self.browser.quit()



class TimeseriesTest(unittest.TestCase):
    def setUp(self):
        self.browser = webdriver.Chrome()
        from hedonometer.models import Timeseries, Happs, Event, WordList, Word
        import datetime
        Timeseries.objects.all().delete()
        Event.objects.all().delete()
        Happs.objects.all().delete()
        WordList.objects.all().delete()
        Word.objects.all().delete()

        # https://arxiv.org/abs/1108.5192
        wl = WordList(title="labMT-en-v1", date="2011-08-25", language="en", reference="https://arxiv.org/abs/1108.5192", referencetitle="Positivity of the English language")
        wl.save()
        DATA_DIR = '../hedonometer-data-munging/labMT'
        with open(os.path.join(DATA_DIR, "labMTwords-english.csv"), "r") as f:
            labMTwords = f.read().strip().split("\n")
        with open(os.path.join(DATA_DIR, "labMTscores-english.csv"), "r") as f:
            labMTscores = f.read().strip().split("\n")
        with open(os.path.join(DATA_DIR, "labMTscoresStd-english.csv"), "r") as f:
            labMTscoresStd = f.read().strip().split("\n")
        for i, (word, score, std) in enumerate(zip(labMTwords, labMTscores, labMTscoresStd)):
            w = Word(wordlist=wl, word=word, word_english=word, rank=i, happs=float(score), stdDev=float(std))
            w.save()
        shortcodes = {'arabic': 'ar', 'chinese': 'zh', 'french': 'fr', 'german': 'de', 'hindi': 'hi', 'indonesian': 'id', 'korean': 'ko', 'pashto': 'ps', 'portuguese': 'pt', 'russian': 'ru', 'spanish': 'es', 'urdu': 'ur'}
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
            for i, (word, wordEn, score, std) in enumerate(zip(labMTwords, labMTwordsEn, labMTscores, labMTscoresStd)):
                w = Word(wordlist=wl, word=word, word_english=wordEn, rank=i, happs=float(score), stdDev=float(std))
                w.save()


        r = requests.get("http://hedonometer.org/api/v1/happiness/?timeseries__title=en_rt")
        x = json.loads(r.content)

        t_rt = Timeseries(
            title='en_rt',
            directory='storywrangler_en_rt',
            language='english',
            mediaFlag='All Tweets',
            wordList='labMTwords-english-covid.csv',
            scoreList='labMTscores-english-covid.csv',
            sourceDir='/users/j/m/jminot/scratch/labmt/storywrangler_v2/storywrangler_en_rt/count_vec'
        )
        t_rt.save()
        t = Timeseries(
            title='en_all',
            directory='storywrangler_en_all',
            language='english',
            mediaFlag='All Tweets',
            wordList='labMTwords-english-covid.csv',
            scoreList='labMTscores-english-covid.csv',
            sourceDir='/users/j/m/jminot/scratch/labmt/storywrangler_v2/storywrangler_en_all/count_vec'
        )
        t.save()

        for h in x["objects"]:
            Happs(timeseries=t_rt, date=datetime.datetime.strptime(h["date"], "%Y-%m-%d"), value=float(h["happiness"]), frequency=h["frequency"]).save()

        e = Event(happs=Happs.objects.get(timeseries=t_rt, date=datetime.date(2016,12,25)),
                  importance = 100,
                  caption="xx",
                  picture="xx",
                  imagelink="xx",
                  x = 10,
                  y = -100,
                  shorter = "Christmas",
                  longer = "Christmas",
                  wiki = "http://en.wikipedia.org/wiki/Christmas",
        )
        e.save()
        e = Event(happs=Happs.objects.get(timeseries=t_rt, date=(datetime.date(2017,12,25))),
                  importance = 100,
                  caption="xx",
                  picture="xx",
                  imagelink="xx",
                  x = 10,
                  y = -100,
                  shorter = "Christmas",
                  longer = "Christmas",
                  wiki = "http://en.wikipedia.org/wiki/Christmas",
        )
        e.save()

        h = Happs(timeseries=t, date=(datetime.date(2016,12,25)), value=6.0, frequency=0)
        h.save()
        h = Happs(timeseries=t, date=(datetime.date(2017,12,25)), value=6.0, frequency=0)
        h.save()
        h = Happs(timeseries=t, date=(datetime.date(2018,12,25)), value=6.0, frequency=0)
        h.save()
        h = Happs(timeseries=t, date=(datetime.date(2019,12,23)), value=6.0, frequency=0)
        h.save()
        h = Happs(timeseries=t, date=(datetime.date(2019,12,24)), value=6.1, frequency=0)
        h.save()
        h = Happs(timeseries=t, date=(datetime.date(2019,12,25)), value=6.2, frequency=0)
        h.save()

        e = Event(happs=h,
                  importance = 100,
                  caption="xx",
                  picture="xx",
                  imagelink="xx",
                  x = 10,
                  y = -100,
                  shorter = "Christmas",
                  longer = "Christmas",
                  wiki = "http://en.wikipedia.org/wiki/Christmas",
        )
        e.save()

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