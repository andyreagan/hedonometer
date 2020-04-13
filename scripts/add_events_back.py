# coding: utf-8
from hedonometer.models import *
import pickle
with open("events.pkl", "rb") as f:
    events = pickle.loads(f.read())
    
len(events)
Timeseries.get(title="en_all")
t = Timeseries.objets.get(title="en_all")
t
t = Timeseries.objects.get(title="en_all")
t
events[0]
for ev in events[:10]:
    print(ev[0])
    
for ev in events[:10]:
    print(ev[0])
    h = Happs.objects.get(timeseries=t, date=ev[0])
    print(h)
    
for ev in events[:10]:
    print(ev[0])
    h = Happs.objects.get(timeseries=t, date=ev[0])
    print(h)
    e = Event(happs=h, importance=ev[2], caption=e[3], picture=e[4], x=e[5], y=e[6], shorter=e[7], longer=e[8], wiki=e[9], imagelink=e[10])
for e in events[:10]:
    print(ev[0])
    h = Happs.objects.get(timeseries=t, date=e[0])
    print(h)
    ev = Event(happs=h, importance=e[2], caption=e[3], picture=e[4], x=e[5], y=e[6], shorter=e[7], longer=e[8], wiki=e[9], imagelink=e[10])
for e in events[:10]:
    print(e[0])
    h = Happs.objects.get(timeseries=t, date=e[0])
    print(h)
    ev = Event(happs=h, importance=e[2], caption=e[3], picture=e[4], x=e[5], y=e[6], shorter=e[7], longer=e[8], wiki=e[9], imagelink=e[10])
for e in events[:10]:
    print(e[0])
    h = Happs.objects.get(timeseries=t, date=e[0])
    print(h)
    ev = Event(happs=h, importance=e[2], caption=e[3], picture=e[4], x=e[5], y=e[6], shorter=e[7], longer=e[8], wiki=e[9], imagelink=e[10])
    ev.save()
    
for e in events[10:]:
    print(e[0])
    h = Happs.objects.get(timeseries=t, date=e[0])
    print(h)
    ev = Event(happs=h, importance=e[2], caption=e[3], picture=e[4], x=e[5], y=e[6], shorter=e[7], longer=e[8], wiki=e[9], imagelink=e[10])
    ev.save()
    
for e in events:
    print(e[0])
    h = Happs.objects.get(timeseries=t, date=e[0])
    print(h)
    ev = Event(happs=h, importance=e[2], caption=e[3], picture=e[4], x=e[5], y=e[6], shorter=e[7], longer=e[8], wiki=e[9], imagelink=e[10])
    try:
        ev.save()
    except:
        pass
        
    
t = Timeseries.objects.get(title="en_rt")
for e in events:
    print(e[0])
    h = Happs.objects.get(timeseries=t, date=e[0])
    print(h)
    ev = Event(happs=h, importance=e[2], caption=e[3], picture=e[4], x=e[5], y=e[6], shorter=e[7], longer=e[8], wiki=e[9], imagelink=e[10])
    try:
        ev.save()
    except:
        pass
        
    
t = Timeseries.objects.get(title="en_no_rt")
for e in events:
    print(e[0])
    h = Happs.objects.get(timeseries=t, date=e[0])
    print(h)
    ev = Event(happs=h, importance=e[2], caption=e[3], picture=e[4], x=e[5], y=e[6], shorter=e[7], longer=e[8], wiki=e[9], imagelink=e[10])
    try:
        ev.save()
    except:
        pass
        
    
