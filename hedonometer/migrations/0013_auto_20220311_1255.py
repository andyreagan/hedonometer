# Generated by Django 3.1.13 on 2022-03-11 17:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hedonometer', '0012_wordlist_dimension'),
    ]

    operations = [
        migrations.AddField(
            model_name='wordlist',
            name='dimension_modifier_down',
            field=models.CharField(default='sadder', max_length=80),
        ),
        migrations.AddField(
            model_name='wordlist',
            name='dimension_modifier_up',
            field=models.CharField(default='happier', max_length=80),
        ),
    ]