# Generated by Django 3.1.13 on 2022-03-08 21:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hedonometer', '0011_delete_embeddable'),
    ]

    operations = [
        migrations.AddField(
            model_name='wordlist',
            name='dimension',
            field=models.CharField(default='happiness', max_length=80),
        ),
    ]
