# Generated by Django 3.0.5 on 2021-01-05 20:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hedonometer', '0009_happs_exclude'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='embeddable',
            name='author',
        ),
    ]
