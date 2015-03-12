# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Event.region'
        db.add_column(u'hedonometer_event', 'region',
                      self.gf('django.db.models.fields.CharField')(default='world', max_length=100),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'Event.region'
        db.delete_column(u'hedonometer_event', 'region')


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Group']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Permission']"}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'hedonometer.actor': {
            'Meta': {'object_name': 'Actor'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'hedonometer.book': {
            'Meta': {'ordering': "('author',)", 'object_name': 'Book'},
            'author': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'filename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'happs': ('django.db.models.fields.FloatField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ignorewords': ('django.db.models.fields.CharField', [], {'max_length': '400'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'length': ('django.db.models.fields.IntegerField', [], {}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'wiki': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        },
        u'hedonometer.director': {
            'Meta': {'object_name': 'Director'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'hedonometer.embeddable': {
            'Meta': {'object_name': 'Embeddable'},
            'author': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['twython_django.TwitterProfile']", 'null': 'True'}),
            'compFile': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'compFileName': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'contextFlag': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'createdDate': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'customFullText': ('django.db.models.fields.CharField', [], {'max_length': '600', 'null': 'True', 'blank': 'True'}),
            'customTitleText': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'h': ('django.db.models.fields.CharField', [], {'max_length': '64'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lang': ('django.db.models.fields.CharField', [], {'max_length': '40'}),
            'refFile': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'refFileName': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'stopWords': ('django.db.models.fields.CharField', [], {'max_length': '600', 'null': 'True', 'blank': 'True'}),
            'updatedDate': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'})
        },
        u'hedonometer.event': {
            'Meta': {'ordering': "('date',)", 'object_name': 'Event'},
            'caption': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'date': ('django.db.models.fields.DateTimeField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'imagelink': ('django.db.models.fields.URLField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'importance': ('django.db.models.fields.IntegerField', [], {}),
            'lang': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'longer': ('django.db.models.fields.TextField', [], {'max_length': '200'}),
            'picture': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'region': ('django.db.models.fields.CharField', [], {'default': "'world'", 'max_length': '100'}),
            'shorter': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'value': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'wiki': ('django.db.models.fields.URLField', [], {'max_length': '200'}),
            'x': ('django.db.models.fields.IntegerField', [], {'max_length': '4'}),
            'y': ('django.db.models.fields.IntegerField', [], {'max_length': '4'})
        },
        u'hedonometer.geohapps': {
            'Meta': {'object_name': 'GeoHapps'},
            'date': ('django.db.models.fields.DateTimeField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'stateId': ('django.db.models.fields.IntegerField', [], {}),
            'stateName': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'value': ('django.db.models.fields.FloatField', [], {})
        },
        u'hedonometer.happs': {
            'Meta': {'object_name': 'Happs'},
            'date': ('django.db.models.fields.DateTimeField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lang': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'value': ('django.db.models.fields.FloatField', [], {})
        },
        u'hedonometer.movie': {
            'Meta': {'ordering': "('title',)", 'object_name': 'Movie'},
            'actor': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['hedonometer.Actor']", 'symmetrical': 'False'}),
            'director': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['hedonometer.Director']", 'symmetrical': 'False'}),
            'exclude': ('django.db.models.fields.BooleanField', [], {}),
            'excludeReason': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'filename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'genre': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            'happs': ('django.db.models.fields.FloatField', [], {}),
            'happsDiff': ('django.db.models.fields.FloatField', [], {}),
            'happsEnd': ('django.db.models.fields.FloatField', [], {}),
            'happsMax': ('django.db.models.fields.FloatField', [], {}),
            'happsMin': ('django.db.models.fields.FloatField', [], {}),
            'happsStart': ('django.db.models.fields.FloatField', [], {}),
            'happsVariance': ('django.db.models.fields.FloatField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ignorewords': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            'image': ('django.db.models.fields.URLField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'imdbid': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            'keywords': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'length': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'metascore': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            'rating': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            'releaseDate': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'reviews': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            'runtime': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            'score': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'storyline': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'titleraw': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'wiki': ('django.db.models.fields.URLField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'writer': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['hedonometer.Writer']", 'symmetrical': 'False'}),
            'year': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'})
        },
        u'hedonometer.nyt': {
            'Meta': {'ordering': "('genre',)", 'object_name': 'NYT'},
            'filename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'genre': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'happs': ('django.db.models.fields.FloatField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ignorewords': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'numwords': ('django.db.models.fields.FloatField', [], {}),
            'variance': ('django.db.models.fields.FloatField', [], {})
        },
        u'hedonometer.timeseries': {
            'Meta': {'ordering': "('title',)", 'object_name': 'Timeseries'},
            'customLongTitle': ('django.db.models.fields.CharField', [], {'default': "'Average Happiness for Twitter'", 'max_length': '200'}),
            'endDate': ('django.db.models.fields.DateTimeField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ignoreWords': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'mediaFlag': ('django.db.models.fields.CharField', [], {'default': "'Tweets'", 'max_length': '50'}),
            'regionID': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'startDate': ('django.db.models.fields.DateTimeField', [], {}),
            'sumHappsFile': ('django.db.models.fields.CharField', [], {'default': "'sumhapps.csv'", 'max_length': '100'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '100'})
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
        },
        u'hedonometer.writer': {
            'Meta': {'object_name': 'Writer'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'twython_django.twitterprofile': {
            'Meta': {'object_name': 'TwitterProfile'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'oauth_secret': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'oauth_token': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['auth.User']", 'unique': 'True'})
        }
    }

    complete_apps = ['hedonometer']