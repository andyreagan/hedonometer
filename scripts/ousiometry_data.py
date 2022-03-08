# coding: utf-8
from hedonometer.models import Word, WordList
import datetime
import pandas as pd
get_ipython().system('pip install pandas')
import pandas as pd
d = pd.read_csv('scripts/ousiometry_data.tsv', sep='\t')
d.shape
get_ipython().run_line_magic('less', 'scripts/ousiometry_data.tsv')
' '.join(d.columns)
all(d['structure.1'] == d['structure'])
d = d.loc[:, d.columns[:-1]].copy()
d.head()
for dimension in d.columns[1:];
for dimension in d.columns[1:]:
    w = WordList(date=datetime.datetime.today(), title='ousio-'+dimension, language='en', reference='https://arxiv.org/abs/2110.06847', referencetitle='Ousiometrics and Telegnomics: The essence of meaning conforms to a two-dimensional powerful-weak and dangerous-safe framework with diverse corpora presenting a safety bias', showindropdown=False, showinfulllist=False)
    w.save()
    for i, word in d.iterrows():
        Word(wordlist=w, word=word.word, word_english=word.word, rank=i, happs=float(word[dimension]), stdDev=0.0, stopword=False).save()
        
get_ipython().run_line_magic('save', 'scripts/ousiometry_data.py 1-14')
