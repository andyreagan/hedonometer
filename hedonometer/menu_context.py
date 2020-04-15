from .models import Timeseries, WordList


def include_timeseries_wordlist_menus(context):
    timeseries_objects = Timeseries.objects.filter(showindropdown=True)
    wordlist_objects = WordList.objects.filter(showindropdown=True)

    return {'timeseries_objects': timeseries_objects,
            'wordlist_objects': wordlist_objects}