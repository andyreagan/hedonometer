# coding: utf-8
import json
from hedonometer.models import Timeseries, Happs, Event
from pathlib import Path
events = json.loads(Path('scripts/events.json').read_text())
len(events)
events[0]
for e in events:
    t = Timeseries.objects.get(title=e['timeseries'])
    h = Happs.objects.get(timeseries=t, date=e['date'])
    ev = Event(happs=h, importance=e['importance'], x=e['x'], y=e['y'], shorter=e['shorter'], longer=e['longer'], wiki=e['wiki'])
    ev.save()
    
