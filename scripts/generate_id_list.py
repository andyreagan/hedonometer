# coding: utf-8
from hedonometer.models import *
max([g.gutenberg_id for g in GutenbergBook.objects.all()])
q = GutenbergBook.objects.filter(exclude=False,length__gt=10000,length__lte=200000,downloads__gte=150,numUniqWords__gt=1000,numUniqWords__lt=18000,lang_code_id=0)
a
q
len(q)
q = GutenbergBook.objects.filter(exclude=False,length__gt=10000,length__lte=200000,downloads__gte=150,numUniqWords__gt=1000,numUniqWords__lt=18000,lang_code_id=0)
ids_used = [g.gutenberg_id for g in q]
ids_used
f = open("hedonometer/static/hedonometer/gut_ids.txt","w")
ids_used = ["{0:.0f}".format(g.gutenberg_id) for g in q]
ids_used[:10]
f.write("\n".join(ids_used))
f.close()
q = GutenbergBook.objects.filter(exclude=False,length__gt=10000,length__lte=200000,downloads__gte=150,numUniqWords__gt=1000,numUniqWords__lt=18000,lang_code_id=0)
get_ipython().magic(u'save generate_id_list 1-16')
