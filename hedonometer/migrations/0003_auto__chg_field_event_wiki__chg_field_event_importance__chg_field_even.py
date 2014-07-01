# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'Event.wiki'
        db.alter_column(u'hedonometer_event', 'wiki', self.gf('django.db.models.fields.URLField')(max_length=200))

        # Changing field 'Event.importance'
        db.alter_column(u'hedonometer_event', 'importance', self.gf('django.db.models.fields.IntegerField')())

        # Changing field 'Event.y'
        db.alter_column(u'hedonometer_event', 'y', self.gf('django.db.models.fields.IntegerField')(max_length=4))

        # Changing field 'Event.x'
        db.alter_column(u'hedonometer_event', 'x', self.gf('django.db.models.fields.IntegerField')(max_length=4))

    def backwards(self, orm):

        # Changing field 'Event.wiki'
        db.alter_column(u'hedonometer_event', 'wiki', self.gf('django.db.models.fields.CharField')(max_length=500))

        # Changing field 'Event.importance'
        db.alter_column(u'hedonometer_event', 'importance', self.gf('django.db.models.fields.CharField')(max_length=4))

        # Changing field 'Event.y'
        db.alter_column(u'hedonometer_event', 'y', self.gf('django.db.models.fields.CharField')(max_length=4))

        # Changing field 'Event.x'
        db.alter_column(u'hedonometer_event', 'x', self.gf('django.db.models.fields.CharField')(max_length=4))

    models = {
        u'hedonometer.event': {
            'Meta': {'ordering': "('date',)", 'object_name': 'Event'},
            'caption': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'date': ('django.db.models.fields.DateTimeField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'importance': ('django.db.models.fields.IntegerField', [], {}),
            'longer': ('django.db.models.fields.TextField', [], {'max_length': '200'}),
            'picture': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'shorter': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'value': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'wiki': ('django.db.models.fields.URLField', [], {'max_length': '200'}),
            'x': ('django.db.models.fields.IntegerField', [], {'max_length': '4'}),
            'y': ('django.db.models.fields.IntegerField', [], {'max_length': '4'})
        }
    }

    complete_apps = ['hedonometer']