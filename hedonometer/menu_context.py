import itertools

from .models import Timeseries, WordList

def include_timeseries_wordlist_menus(context):
    happs_timeseries_objects = Timeseries.objects.exclude(title__contains='ousio', showindropdown=False)
    happs_timeseries_grouped = {key: list(values) for key, values in itertools.groupby(Timeseries.objects.exclude(title__contains='ousio'), lambda x: x.wordList.language_long())}
    wordlist_objects = WordList.objects.filter(showindropdown=True)
    ousio_timeseries_objects = Timeseries.objects.filter(title__contains='ousio', showindropdown=True)
    ousio_timeseries_grouped = {key: list(values) for key, values in itertools.groupby(Timeseries.objects.filter(title__contains='ousio'), lambda x: x.wordList.language_long())}


    return {
        'timeseries_objects': happs_timeseries_objects,
        'timeseries_grouped': happs_timeseries_grouped,
        'wordlist_objects': wordlist_objects,
        'ousio_timeseries_objects': ousio_timeseries_objects,
        'ousio_timeseries_grouped': ousio_timeseries_grouped,
    }
