# Generated by Django 3.0.5 on 2020-04-14 19:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hedonometer', '0006_auto_20200414_1451'),
    ]

    operations = [
        migrations.AddField(
            model_name='timeseries',
            name='wordList',
            field=models.ForeignKey(default='labMT-en-v2', on_delete=django.db.models.deletion.CASCADE, to='hedonometer.WordList', to_field='title'),
        ),
    ]
