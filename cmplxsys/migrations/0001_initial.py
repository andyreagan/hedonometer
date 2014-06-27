# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Person'
        db.create_table(u'cmplxsys_person', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('uname', self.gf('django.db.models.fields.CharField')(max_length=6)),
            ('affiliation', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('webpage', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('linkedin', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('twitter', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('strava', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('facebook', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('youtube', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('vine', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('instagram', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('scholar', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('github', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('bitbucket', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('stackoverflow', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('plus', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('pinterest', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal(u'cmplxsys', ['Person'])


    def backwards(self, orm):
        # Deleting model 'Person'
        db.delete_table(u'cmplxsys_person')


    models = {
        u'cmplxsys.person': {
            'Meta': {'object_name': 'Person'},
            'affiliation': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'bitbucket': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'facebook': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'github': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'instagram': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'linkedin': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'pinterest': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'plus': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'scholar': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'stackoverflow': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'strava': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'twitter': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'uname': ('django.db.models.fields.CharField', [], {'max_length': '6'}),
            'vine': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'webpage': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'youtube': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['cmplxsys']