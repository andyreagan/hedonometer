# -*- coding: utf-8 -*-
# Generated by Django 1.11.28 on 2020-04-01 18:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hedonometer', '0007_auto_20200331_1629'),
    ]

    operations = [
        migrations.AlterField(
            model_name='timeseries',
            name='customLongTitle',
            field=models.CharField(default='Average Happiness for Twitter', help_text='Title on the webpage.', max_length=200),
        ),
        migrations.AlterField(
            model_name='timeseries',
            name='language',
            field=models.CharField(help_text='Second underlined part of the subtitle.', max_length=100),
        ),
        migrations.AlterField(
            model_name='timeseries',
            name='mediaFlag',
            field=models.CharField(default='All tweets', help_text='Describe the type of data. First part of the subtitle.', max_length=50),
        ),
    ]
