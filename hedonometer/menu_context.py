import itertools

from .models import Timeseries, WordList

def include_timeseries_wordlist_menus(context):
    timeseries_objects = Timeseries.objects.filter(showindropdown=True)
    timeseries_grouped = {key: list(values) for key, values in itertools.groupby(Timeseries.objects.all(), lambda x: x.wordList.language_long())}
    wordlist_objects = WordList.objects.filter(showindropdown=True)

    return {'timeseries_objects': timeseries_objects,
            'timeseries_grouped': timeseries_grouped,
            'wordlist_objects': wordlist_objects}