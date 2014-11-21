# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding M2M table for field director on 'Movie'
        m2m_table_name = db.shorten_name(u'hedonometer_movie_director')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('movie', models.ForeignKey(orm[u'hedonometer.movie'], null=False)),
            ('director', models.ForeignKey(orm[u'hedonometer.director'], null=False))
        ))
        db.create_unique(m2m_table_name, ['movie_id', 'director_id'])

        # Adding M2M table for field actor on 'Movie'
        m2m_table_name = db.shorten_name(u'hedonometer_movie_actor')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('movie', models.ForeignKey(orm[u'hedonometer.movie'], null=False)),
            ('actor', models.ForeignKey(orm[u'hedonometer.actor'], null=False))
        ))
        db.create_unique(m2m_table_name, ['movie_id', 'actor_id'])

        # Adding M2M table for field writer on 'Movie'
        m2m_table_name = db.shorten_name(u'hedonometer_movie_writer')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('movie', models.ForeignKey(orm[u'hedonometer.movie'], null=False)),
            ('writer', models.ForeignKey(orm[u'hedonometer.writer'], null=False))
        ))
        db.create_unique(m2m_table_name, ['movie_id', 'writer_id'])


    def backwards(self, orm):
        # Removing M2M table for field director on 'Movie'
        db.delete_table(db.shorten_name(u'hedonometer_movie_director'))

        # Removing M2M table for field actor on 'Movie'
        db.delete_table(db.shorten_name(u'hedonometer_movie_actor'))

        # Removing M2M table for field writer on 'Movie'
        db.delete_table(db.shorten_name(u'hedonometer_movie_writer'))


    models = {
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
            'compFile': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'compFileName': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'contextFlag': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'customFullText': ('django.db.models.fields.CharField', [], {'max_length': '600', 'null': 'True', 'blank': 'True'}),
            'customTitleText': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'h': ('django.db.models.fields.CharField', [], {'max_length': '64'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'refFile': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'refFileName': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'})
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
            'filename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'happs': ('django.db.models.fields.FloatField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ignorewords': ('django.db.models.fields.CharField', [], {'max_length': '400'}),
            'image': ('django.db.models.fields.URLField', [], {'max_length': '200'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'length': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'wiki': ('django.db.models.fields.URLField', [], {'max_length': '200'}),
            'writer': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['hedonometer.Writer']", 'symmetrical': 'False'})
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
        }
    }

    complete_apps = ['hedonometer']