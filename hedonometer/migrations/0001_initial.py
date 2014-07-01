# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Event'
        db.create_table(u'hedonometer_event', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('date', self.gf('django.db.models.fields.DateTimeField')()),
            ('value', self.gf('django.db.models.fields.CharField')(max_length=20)),
            ('importance', self.gf('django.db.models.fields.CharField')(max_length=20)),
            ('caption', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('picture', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('x', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('y', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('shorter', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('longer', self.gf('django.db.models.fields.TextField')(max_length=200)),
            ('wiki', self.gf('django.db.models.fields.CharField')(max_length=500)),
        ))
        db.send_create_signal(u'hedonometer', ['Event'])


    def backwards(self, orm):
        # Deleting model 'Event'
        db.delete_table(u'hedonometer_event')


    models = {
        u'hedonometer.event': {
            'Meta': {'ordering': "('date',)", 'object_name': 'Event'},
            'caption': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'date': ('django.db.models.fields.DateTimeField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'importance': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'longer': ('django.db.models.fields.TextField', [], {'max_length': '200'}),
            'picture': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'shorter': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'value': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'wiki': ('django.db.models.fields.CharField', [], {'max_length': '500'}),
            'x': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'y': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['hedonometer']