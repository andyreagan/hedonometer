# -*- coding: utf-8 -*-
# Generated by Django 1.11.28 on 2020-03-31 14:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hedonometer', '0002_auto_20200331_0943'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='timeseries',
            name='endDate',
        ),
        migrations.RemoveField(
            model_name='timeseries',
            name='ignoreWords',
        ),
        migrations.RemoveField(
            model_name='timeseries',
            name='regionID',
        ),
        migrations.RemoveField(
            model_name='timeseries',
            name='startDate',
        ),
        migrations.AddField(
            model_name='timeseries',
            name='directory',
            field=models.CharField(default='', help_text='Name of the directory for this particular time series.', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='timeseries',
            name='scoreList',
            field=models.CharField(default='labMTscores-english-covid.csv', help_text='Name of the csv of scores.', max_length=100),
        ),
        migrations.AddField(
            model_name='timeseries',
            name='shiftDir',
            field=models.CharField(default='shifts', help_text='Directory name with daily pre-shifted word vectors (as subdir of `directory`).', max_length=100),
        ),
        migrations.AddField(
            model_name='timeseries',
            name='stopWordList',
            field=models.CharField(blank=True, default='stopwords.csv', help_text='Name of the csv of words to exclude.', max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='timeseries',
            name='wordList',
            field=models.CharField(default='labMTwords-english-covid.csv', help_text='Name of the csv of words.', max_length=100),
        ),
        migrations.AddField(
            model_name='timeseries',
            name='wordListEnglish',
            field=models.CharField(default='labMTwords-english-covid.csv', help_text='Name of the csv of words in English.', max_length=100),
        ),
        migrations.AddField(
            model_name='timeseries',
            name='wordVecDir',
            field=models.CharField(default='word-vectors', help_text='Directory name with daily word vectors (as subdir of `directory`).', max_length=100),
        ),
        migrations.AlterField(
            model_name='timeseries',
            name='mediaFlag',
            field=models.CharField(default='all', help_text='use "all", "rt", or "nort"', max_length=5),
        ),
        migrations.AlterField(
            model_name='timeseries',
            name='sumHappsFile',
            field=models.CharField(default='sumhapps.csv', help_text='Name of the CSV with date,happs for the full time series.', max_length=100),
        ),
        migrations.AlterField(
            model_name='timeseries',
            name='title',
            field=models.CharField(help_text='Title to use in the URL.', max_length=100),
        ),
    ]
