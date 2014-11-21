# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Movie.genre'
        db.add_column(u'hedonometer_movie', 'genre',
                      self.gf('django.db.models.fields.CharField')(max_length=400, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Movie.imdbid'
        db.add_column(u'hedonometer_movie', 'imdbid',
                      self.gf('django.db.models.fields.CharField')(max_length=400, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Movie.keywords'
        db.add_column(u'hedonometer_movie', 'keywords',
                      self.gf('django.db.models.fields.CharField')(max_length=400, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Movie.metascore'
        db.add_column(u'hedonometer_movie', 'metascore',
                      self.gf('django.db.models.fields.CharField')(max_length=400, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Movie.rating'
        db.add_column(u'hedonometer_movie', 'rating',
                      self.gf('django.db.models.fields.CharField')(max_length=400, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Movie.releaseDate'
        db.add_column(u'hedonometer_movie', 'releaseDate',
                      self.gf('django.db.models.fields.DateTimeField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'Movie.reviews'
        db.add_column(u'hedonometer_movie', 'reviews',
                      self.gf('django.db.models.fields.CharField')(max_length=400, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Movie.runtime'
        db.add_column(u'hedonometer_movie', 'runtime',
                      self.gf('django.db.models.fields.CharField')(max_length=400, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Movie.storyline'
        db.add_column(u'hedonometer_movie', 'storyline',
                      self.gf('django.db.models.fields.CharField')(max_length=400, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Movie.year'
        db.add_column(u'hedonometer_movie', 'year',
                      self.gf('django.db.models.fields.CharField')(max_length=400, null=True, blank=True),
                      keep_default=False)


        # Changing field 'Movie.wiki'
        db.alter_column(u'hedonometer_movie', 'wiki', self.gf('django.db.models.fields.URLField')(max_length=200, null=True))

        # Changing field 'Movie.language'
        db.alter_column(u'hedonometer_movie', 'language', self.gf('django.db.models.fields.CharField')(max_length=100, null=True))

        # Changing field 'Movie.image'
        db.alter_column(u'hedonometer_movie', 'image', self.gf('django.db.models.fields.URLField')(max_length=200, null=True))

        # Changing field 'Movie.length'
        db.alter_column(u'hedonometer_movie', 'length', self.gf('django.db.models.fields.CharField')(max_length=100, null=True))

        # Changing field 'Movie.ignorewords'
        db.alter_column(u'hedonometer_movie', 'ignorewords', self.gf('django.db.models.fields.CharField')(max_length=400, null=True))

    def backwards(self, orm):
        # Deleting field 'Movie.genre'
        db.delete_column(u'hedonometer_movie', 'genre')

        # Deleting field 'Movie.imdbid'
        db.delete_column(u'hedonometer_movie', 'imdbid')

        # Deleting field 'Movie.keywords'
        db.delete_column(u'hedonometer_movie', 'keywords')

        # Deleting field 'Movie.metascore'
        db.delete_column(u'hedonometer_movie', 'metascore')

        # Deleting field 'Movie.rating'
        db.delete_column(u'hedonometer_movie', 'rating')

        # Deleting field 'Movie.releaseDate'
        db.delete_column(u'hedonometer_movie', 'releaseDate')

        # Deleting field 'Movie.reviews'
        db.delete_column(u'hedonometer_movie', 'reviews')

        # Deleting field 'Movie.runtime'
        db.delete_column(u'hedonometer_movie', 'runtime')

        # Deleting field 'Movie.storyline'
        db.delete_column(u'hedonometer_movie', 'storyline')

        # Deleting field 'Movie.year'
        db.delete_column(u'hedonometer_movie', 'year')


        # Changing field 'Movie.wiki'
        db.alter_column(u'hedonometer_movie', 'wiki', self.gf('django.db.models.fields.URLField')(default='none', max_length=200))

        # Changing field 'Movie.language'
        db.alter_column(u'hedonometer_movie', 'language', self.gf('django.db.models.fields.CharField')(default='english', max_length=100))

        # Changing field 'Movie.image'
        db.alter_column(u'hedonometer_movie', 'image', self.gf('django.db.models.fields.URLField')(default='http://imdb.org', max_length=200))

        # Changing field 'Movie.length'
        db.alter_column(u'hedonometer_movie', 'length', self.gf('django.db.models.fields.CharField')(default='0', max_length=100))

        # Changing field 'Movie.ignorewords'
        db.alter_column(u'hedonometer_movie', 'ignorewords', self.gf('django.db.models.fields.CharField')(default='nig,nigger,niggaz,niggers', max_length=400))

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
            'genre': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            'happs': ('django.db.models.fields.FloatField', [], {}),
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
            'storyline': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'wiki': ('django.db.models.fields.URLField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'writer': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['hedonometer.Writer']", 'symmetrical': 'False'}),
            'year': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'})
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