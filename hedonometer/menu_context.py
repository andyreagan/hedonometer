from .models import Timeseries, WordList


def include_timeseries_wordlist_menus(context):
    timeseries_objects = Timeseries.objects.all()
    wordlist_objects = WordList.objects.all()

    return {'timeseries_objects': timeseries_objects,
            'wordlist_objects': wordlist_objects}