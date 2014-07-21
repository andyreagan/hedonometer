# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Word'
        db.create_table(u'hedonometer_word', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('word', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('rank', self.gf('django.db.models.fields.IntegerField')()),
            ('happs', self.gf('django.db.models.fields.FloatField')()),
            ('stdDev', self.gf('django.db.models.fields.FloatField')()),
            ('twitterRank', self.gf('django.db.models.fields.IntegerField')()),
            ('googleBooksRank', self.gf('django.db.models.fields.IntegerField')()),
            ('newYorkTimesRank', self.gf('django.db.models.fields.IntegerField')()),
            ('lyricsRank', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'hedonometer', ['Word'])


    def backwards(self, orm):
        # Deleting model 'Word'
        db.delete_table(u'hedonometer_word')


    models = {
        u'hedonometer.book': {
            'Meta': {'ordering': "('author',)", 'object_name': 'Book'},
            'author': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'filename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'happs': ('django.db.models.fields.FloatField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'length': ('django.db.models.fields.IntegerField', [], {}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'hedonometer.event': {
            'Meta': {'ordering': "('date',)", 'object_name': 'Event'},
            'caption': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'date': ('django.db.models.fields.DateTimeField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'imagelink': ('django.db.models.fields.URLField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'importance': ('django.db.models.fields.IntegerField', [], {}),
            'longer': ('django.db.models.fields.TextField', [], {'max_length': '200'}),
            'picture': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'shorter': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'value': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'wiki': ('django.db.models.fields.URLField', [], {'max_length': '200'}),
            'x': ('django.db.models.fields.IntegerField', [], {'max_length': '4'}),
            'y': ('django.db.models.fields.IntegerField', [], {'max_length': '4'})
        },
        u'hedonometer.happs': {
            'Meta': {'object_name': 'Happs'},
            'date': ('django.db.models.fields.DateTimeField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'value': ('django.db.models.fields.FloatField', [], {})
        },
        u'hedonometer.word': {
            'Meta': {'object_name': 'Word'},
            'googleBooksRank': ('django.db.models.fields.IntegerField', [], {}),
            'happs': ('django.db.models.fields.FloatField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lyricsRank': ('django.db.models.fields.IntegerField', [], {}),
            'newYorkTimesRank': ('django.db.models.fields.IntegerField', [], {}),
            'rank': ('django.db.models.fields.IntegerField', [], {}),
            'stdDev': ('django.db.models.fields.FloatField', [], {}),
            'twitterRank': ('django.db.models.fields.IntegerField', [], {}),
            'word': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['hedonometer']