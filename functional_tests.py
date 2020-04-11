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
        Happs.objects.all().delete()
        h = Happs(timeseries=t, date=(datetime.date(2019,12,25)), value=6.5, frequency=0)
        h.save()
        Event.objects.all().delete()
        e = Event(timeseries=t, date=(datetime.date(2019,12,25)), value="6.0",
                  importance = 100,
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