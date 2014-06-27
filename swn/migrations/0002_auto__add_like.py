# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Like'
        db.create_table(u'swn_like', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('swn', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['swn.Swn'])),
            ('pub_date', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'swn', ['Like'])


    def backwards(self, orm):
        # Deleting model 'Like'
        db.delete_table(u'swn_like')


    models = {
        u'swn.like': {
            'Meta': {'object_name': 'Like'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'pub_date': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'swn': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['swn.Swn']"})
        },
        u'swn.swn': {
            'Meta': {'object_name': 'Swn'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'pub_date': ('django.db.models.fields.DateTimeField', [], {}),
            'text': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'topic': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['swn.Topic']"}),
            'votes': ('django.db.models.fields.IntegerField', [], {'default': '1'})
        },
        u'swn.topic': {
            'Meta': {'object_name': 'Topic'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'pub_date': ('django.db.models.fields.DateTimeField', [], {}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['swn']