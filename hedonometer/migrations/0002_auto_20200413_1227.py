# Generated by Django 3.0.5 on 2020-04-13 16:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('hedonometer', '0001_initial'),
        ('twython_django', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='embeddable',
            name='author',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='twython_django.TwitterProfile'),
        ),
        migrations.AddField(
            model_name='band',
            name='albums',
            field=models.ManyToManyField(to='hedonometer.Album'),
        ),
        migrations.AddField(
            model_name='album',
            name='songs',
            field=models.ManyToManyField(to='hedonometer.Song'),
        ),
        migrations.CreateModel(
            name='HappsEvent',
            fields=[
            ],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('hedonometer.happs',),
        ),
    ]