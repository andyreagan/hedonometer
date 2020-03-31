from selenium import webdriver
import unittest


class NewVisitorTest(unittest.TestCase):
    def setUp(self):
        self.browser = webdriver.Chrome()

    def tearDown(self):
        self.browser.quit()

    def test_can_get_homepage(self):
        # Check out the homepage
        self.browser.get('http://127.0.0.1:8000/index.html')
        self.assertIn('Hedonometer', self.browser.title)


class TimeseriesTest(unittest.TestCase):
    def setUp(self):
        self.browser = webdriver.Chrome()
        # from hedonometer.models import Timeseries
        # Timeseries.objects.all().delete()
        # Timeseries(
        #     title='main',
        #     directory='storywrangler_covid',
        #     language='english',
        #     mediaFlag='all'
        # ).save()

    def tearDown(self):
        self.browser.quit()

    def test_can_get_homepage(self):
        # Check out the homepage
        self.browser.get('http://127.0.0.1:8000/timeseries/main/')
        self.assertIn('Hedonometer', self.browser.title)


if __name__ == '__main__':
    unittest.main(warnings='ignore')