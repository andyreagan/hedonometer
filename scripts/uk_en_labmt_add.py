# coding: utf-8
from hedonometer.models import Word, WordList
import datetime
w = WordList(date=datetime.datetime.today(), title='labMT-uk-ru', language='uk', reference='tbd', referencetitle='tbd', showindropdown=False, showinfulllist=False)
w.save()
w = WordList(date=datetime.datetime.today(), title='labMT-uk-ru-hashtags', language='uk', reference='tbd', referencetitle='tbd', showindropdown=False, showinfulllist=False)
w.save()
import pandas as pd
d = pd.read_csv('scripts/uk_en_labmt.txt', sep=' ')
assert d.loc[d.en.isnull(), :].shape[0] == 0
assert d.loc[d.score.isnull(), :].shape[0] == 0
assert d.loc[d.uk.isnull(), :].shape[0] == 0
wn = WordList.objects.get(title='labMT-uk-ru')

for i, word in d.iterrows():
    Word(wordlist=wn, word=word.uk, word_english=word.en, rank=i, happs=float(word.score), stdDev=0.0, stopword=False).save()

for i, word in d.iterrows():
    Word(wordlist=w, word=word.uk, word_english=word.en, rank=i, happs=float(word.score), stdDev=0.0, stopword=False).save()

for i, word in d.iterrows():
    Word(wordlist=w, word='#'+word.uk, word_english='#'+word.en, rank=d.shape[0]+i, happs=float(word.score), stdDev=0.0, stopword=False).save()

