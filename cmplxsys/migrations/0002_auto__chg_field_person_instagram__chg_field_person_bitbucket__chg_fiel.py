# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'Person.instagram'
        db.alter_column(u'cmplxsys_person', 'instagram', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

        # Changing field 'Person.bitbucket'
        db.alter_column(u'cmplxsys_person', 'bitbucket', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

        # Changing field 'Person.strava'
        db.alter_column(u'cmplxsys_person', 'strava', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

        # Changing field 'Person.pinterest'
        db.alter_column(u'cmplxsys_person', 'pinterest', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

        # Changing field 'Person.webpage'
        db.alter_column(u'cmplxsys_person', 'webpage', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

        # Changing field 'Person.youtube'
        db.alter_column(u'cmplxsys_person', 'youtube', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

        # Changing field 'Person.twitter'
        db.alter_column(u'cmplxsys_person', 'twitter', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

        # Changing field 'Person.vine'
        db.alter_column(u'cmplxsys_person', 'vine', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

        # Changing field 'Person.linkedin'
        db.alter_column(u'cmplxsys_person', 'linkedin', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

        # Changing field 'Person.github'
        db.alter_column(u'cmplxsys_person', 'github', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

        # Changing field 'Person.plus'
        db.alter_column(u'cmplxsys_person', 'plus', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

        # Changing field 'Person.stackoverflow'
        db.alter_column(u'cmplxsys_person', 'stackoverflow', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

        # Changing field 'Person.facebook'
        db.alter_column(u'cmplxsys_person', 'facebook', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

        # Changing field 'Person.scholar'
        db.alter_column(u'cmplxsys_person', 'scholar', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

    def backwards(self, orm):

        # User chose to not deal with backwards NULL issues for 'Person.instagram'
        raise RuntimeError("Cannot reverse this migration. 'Person.instagram' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration
        # Changing field 'Person.instagram'
        db.alter_column(u'cmplxsys_person', 'instagram', self.gf('django.db.models.fields.CharField')(max_length=200))

        # User chose to not deal with backwards NULL issues for 'Person.bitbucket'
        raise RuntimeError("Cannot reverse this migration. 'Person.bitbucket' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration
        # Changing field 'Person.bitbucket'
        db.alter_column(u'cmplxsys_person', 'bitbucket', self.gf('django.db.models.fields.CharField')(max_length=200))

        # User chose to not deal with backwards NULL issues for 'Person.strava'
        raise RuntimeError("Cannot reverse this migration. 'Person.strava' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration
        # Changing field 'Person.strava'
        db.alter_column(u'cmplxsys_person', 'strava', self.gf('django.db.models.fields.CharField')(max_length=200))

        # User chose to not deal with backwards NULL issues for 'Person.pinterest'
        raise RuntimeError("Cannot reverse this migration. 'Person.pinterest' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration
        # Changing field 'Person.pinterest'
        db.alter_column(u'cmplxsys_person', 'pinterest', self.gf('django.db.models.fields.CharField')(max_length=200))

        # User chose to not deal with backwards NULL issues for 'Person.webpage'
        raise RuntimeError("Cannot reverse this migration. 'Person.webpage' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration
        # Changing field 'Person.webpage'
        db.alter_column(u'cmplxsys_person', 'webpage', self.gf('django.db.models.fields.CharField')(max_length=200))

        # User chose to not deal with backwards NULL issues for 'Person.youtube'
        raise RuntimeError("Cannot reverse this migration. 'Person.youtube' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration
        # Changing field 'Person.youtube'
        db.alter_column(u'cmplxsys_person', 'youtube', self.gf('django.db.models.fields.CharField')(max_length=200))

        # User chose to not deal with backwards NULL issues for 'Person.twitter'
        raise RuntimeError("Cannot reverse this migration. 'Person.twitter' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration
        # Changing field 'Person.twitter'
        db.alter_column(u'cmplxsys_person', 'twitter', self.gf('django.db.models.fields.CharField')(max_length=200))

        # User chose to not deal with backwards NULL issues for 'Person.vine'
        raise RuntimeError("Cannot reverse this migration. 'Person.vine' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration
        # Changing field 'Person.vine'
        db.alter_column(u'cmplxsys_person', 'vine', self.gf('django.db.models.fields.CharField')(max_length=200))

        # User chose to not deal with backwards NULL issues for 'Person.linkedin'
        raise RuntimeError("Cannot reverse this migration. 'Person.linkedin' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration
        # Changing field 'Person.linkedin'
        db.alter_column(u'cmplxsys_person', 'linkedin', self.gf('django.db.models.fields.CharField')(max_length=200))

        # User chose to not deal with backwards NULL issues for 'Person.github'
        raise RuntimeError("Cannot reverse this migration. 'Person.github' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration
        # Changing field 'Person.github'
        db.alter_column(u'cmplxsys_person', 'github', self.gf('django.db.models.fields.CharField')(max_length=200))

        # User chose to not deal with backwards NULL issues for 'Person.plus'
        raise RuntimeError("Cannot reverse this migration. 'Person.plus' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration
        # Changing field 'Person.plus'
        db.alter_column(u'cmplxsys_person', 'plus', self.gf('django.db.models.fields.CharField')(max_length=200))

        # User chose to not deal with backwards NULL issues for 'Person.stackoverflow'
        raise RuntimeError("Cannot reverse this migration. 'Person.stackoverflow' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration
        # Changing field 'Person.stackoverflow'
        db.alter_column(u'cmplxsys_person', 'stackoverflow', self.gf('django.db.models.fields.CharField')(max_length=200))

        # User chose to not deal with backwards NULL issues for 'Person.facebook'
        raise RuntimeError("Cannot reverse this migration. 'Person.facebook' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration
        # Changing field 'Person.facebook'
        db.alter_column(u'cmplxsys_person', 'facebook', self.gf('django.db.models.fields.CharField')(max_length=200))

        # User chose to not deal with backwards NULL issues for 'Person.scholar'
        raise RuntimeError("Cannot reverse this migration. 'Person.scholar' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration
        # Changing field 'Person.scholar'
        db.alter_column(u'cmplxsys_person', 'scholar', self.gf('django.db.models.fields.CharField')(max_length=200))

    models = {
        u'cmplxsys.person': {
            'Meta': {'object_name': 'Person'},
            'affiliation': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'bitbucket': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'facebook': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'github': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'instagram': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'linkedin': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'pinterest': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'plus': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'scholar': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'stackoverflow': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'strava': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'twitter': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'uname': ('django.db.models.fields.CharField', [], {'max_length': '6'}),
            'vine': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'webpage': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'youtube': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['cmplxsys']