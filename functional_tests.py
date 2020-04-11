# inspiration: https://www.obeythetestinggoat.com/book/chapter_01.html
from selenium import webdriver
import unittest


class NewVisitorTest(unittest.TestCase):
    def setUp(self):
        self.browser = webdriver.Chrome()

    def tearDown(self):
        self.browser.quit()



class TimeseriesTest(unittest.TestCase):
    def setUp(self):
        self.browser = webdriver.Chrome()
        from hedonometer.models import Timeseries, Happs, Event
        import datetime
        Timeseries.objects.all().delete()
        Event.objects.all().delete()
        Happs.objects.all().delete()

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

        h = Happs(timeseries=t_rt, date=(datetime.date(2016,12,25)), value=6.0, frequency=0)
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
        h = Happs(timeseries=t_rt, date=(datetime.date(2017,12,25)), value=6.0, frequency=0)
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
        h = Happs(timeseries=t_rt, date=(datetime.date(2018,12,25)), value=6.0, frequency=0)
        h.save()

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