# Generated by Django 3.0 on 2020-04-14 15:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hedonometer', '0003_auto_20200414_1114'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wordlist',
            name='language',
            field=models.CharField(default='en', max_length=2),
        ),
    ]
