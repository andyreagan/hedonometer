# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding M2M table for field people on 'Funding'
        m2m_table_name = db.shorten_name(u'cmplxsys_funding_people')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('funding', models.ForeignKey(orm[u'cmplxsys.funding'], null=False)),
            ('person', models.ForeignKey(orm[u'cmplxsys.person'], null=False))
        ))
        db.create_unique(m2m_table_name, ['funding_id', 'person_id'])

        # Removing M2M table for field paper on 'Press'
        db.delete_table(db.shorten_name(u'cmplxsys_press_paper'))

        # Adding M2M table for field papers on 'Press'
        m2m_table_name = db.shorten_name(u'cmplxsys_press_papers')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('press', models.ForeignKey(orm[u'cmplxsys.press'], null=False)),
            ('paper', models.ForeignKey(orm[u'cmplxsys.paper'], null=False))
        ))
        db.create_unique(m2m_table_name, ['press_id', 'paper_id'])

        # Adding M2M table for field projects on 'Press'
        m2m_table_name = db.shorten_name(u'cmplxsys_press_projects')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('press', models.ForeignKey(orm[u'cmplxsys.press'], null=False)),
            ('project', models.ForeignKey(orm[u'cmplxsys.project'], null=False))
        ))
        db.create_unique(m2m_table_name, ['press_id', 'project_id'])

        # Adding M2M table for field people on 'Press'
        m2m_table_name = db.shorten_name(u'cmplxsys_press_people')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('press', models.ForeignKey(orm[u'cmplxsys.press'], null=False)),
            ('person', models.ForeignKey(orm[u'cmplxsys.person'], null=False))
        ))
        db.create_unique(m2m_table_name, ['press_id', 'person_id'])


        # Changing field 'Paper.logline'
        db.alter_column(u'cmplxsys_paper', 'logline', self.gf('django.db.models.fields.CharField')(max_length=500, null=True))
        # Adding field 'Person.blurb'
        db.add_column(u'cmplxsys_person', 'blurb',
                      self.gf('django.db.models.fields.TextField')(default='', null=True, blank=True),
                      keep_default=False)


    def backwards(self, orm):
        # Removing M2M table for field people on 'Funding'
        db.delete_table(db.shorten_name(u'cmplxsys_funding_people'))

        # Adding M2M table for field paper on 'Press'
        m2m_table_name = db.shorten_name(u'cmplxsys_press_paper')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('press', models.ForeignKey(orm[u'cmplxsys.press'], null=False)),
            ('paper', models.ForeignKey(orm[u'cmplxsys.paper'], null=False))
        ))
        db.create_unique(m2m_table_name, ['press_id', 'paper_id'])

        # Removing M2M table for field papers on 'Press'
        db.delete_table(db.shorten_name(u'cmplxsys_press_papers'))

        # Removing M2M table for field projects on 'Press'
        db.delete_table(db.shorten_name(u'cmplxsys_press_projects'))

        # Removing M2M table for field people on 'Press'
        db.delete_table(db.shorten_name(u'cmplxsys_press_people'))


        # Changing field 'Paper.logline'
        db.alter_column(u'cmplxsys_paper', 'logline', self.gf('django.db.models.fields.CharField')(default='', max_length=500))
        # Deleting field 'Person.blurb'
        db.delete_column(u'cmplxsys_person', 'blurb')


    models = {
        u'cmplxsys.course': {
            'Meta': {'object_name': 'Course'},
            'description': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '2000'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'imagelink': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'logline': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '500'}),
            'nextoffering': ('django.db.models.fields.DateTimeField', [], {}),
            'numtimesoffered': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'shortcode': ('django.db.models.fields.CharField', [], {'default': "'CSYS 500.'", 'max_length': '500'}),
            'students': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "'courses_taught'", 'blank': 'True', 'to': u"orm['cmplxsys.Person']"}),
            'teachers': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'courses_taken'", 'symmetrical': 'False', 'to': u"orm['cmplxsys.Person']"}),
            'title': ('django.db.models.fields.CharField', [], {'default': "'Learn all the things.'", 'max_length': '500'}),
            'url': ('django.db.models.fields.CharField', [], {'default': "'http://www.uvm.edu/~bagrow'", 'max_length': '2000'})
        },
        u'cmplxsys.funding': {
            'Meta': {'object_name': 'Funding'},
            'enddate': ('django.db.models.fields.DateTimeField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'longdescription': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'people': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['cmplxsys.Person']", 'symmetrical': 'False', 'blank': 'True'}),
            'project': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['cmplxsys.Project']", 'symmetrical': 'False', 'blank': 'True'}),
            'shortdescription': ('django.db.models.fields.CharField', [], {'max_length': '1000', 'null': 'True', 'blank': 'True'}),
            'source': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'startdate': ('django.db.models.fields.DateTimeField', [], {}),
            'title': ('django.db.models.fields.CharField', [], {'default': "'100M Award.'", 'max_length': '500'}),
            'url': ('django.db.models.fields.CharField', [], {'default': "'http://www.nsf.gov'", 'max_length': '2000'})
        },
        u'cmplxsys.paper': {
            'Meta': {'object_name': 'Paper'},
            'abstract': ('django.db.models.fields.TextField', [], {'default': "'There are none.'"}),
            'arxiv': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'arxivlink': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'authors': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['cmplxsys.Person']", 'symmetrical': 'False'}),
            'bibref': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'fromclass': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['cmplxsys.Course']", 'symmetrical': 'False', 'blank': 'True'}),
            'googlescholarlink': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'img': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'journal': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'journalpagelink': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'logline': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'}),
            'onlineappendices': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'pages': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'preprintlink': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'supplementarylink': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'timescited': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '500'}),
            'titlelink': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'volume': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'year': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'})
        },
        u'cmplxsys.person': {
            'Meta': {'ordering': "('uname',)", 'object_name': 'Person'},
            'affiliation': ('django.db.models.fields.CharField', [], {'default': "'University of Vermont'", 'max_length': '200'}),
            'bitbucket': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'blurb': ('django.db.models.fields.TextField', [], {'default': "''", 'null': 'True', 'blank': 'True'}),
            'facebook': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'first': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'fullname': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'github': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'instagram': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'last': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'linkedin': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'middle': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'pinterest': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'plus': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'scholar': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'stackoverflow': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'strava': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'sur': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'twitter': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'uname': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'vine': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'webpage': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'youtube': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True', 'blank': 'True'})
        },
        u'cmplxsys.press': {
            'Meta': {'object_name': 'Press'},
            'author': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'date': ('django.db.models.fields.DateTimeField', [], {}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'imagelink': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'organization': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'papers': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['cmplxsys.Paper']", 'symmetrical': 'False', 'blank': 'True'}),
            'people': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['cmplxsys.Person']", 'symmetrical': 'False', 'blank': 'True'}),
            'projects': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['cmplxsys.Project']", 'symmetrical': 'False', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'default': "'UVM Researcher catapaults into fame.'", 'max_length': '500'}),
            'url': ('django.db.models.fields.CharField', [], {'default': "'http://www.nytimes.com'", 'max_length': '2000'})
        },
        u'cmplxsys.project': {
            'Meta': {'object_name': 'Project'},
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'people': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['cmplxsys.Person']", 'symmetrical': 'False'}),
            'title': ('django.db.models.fields.CharField', [], {'default': "'Earth shattering project.'", 'max_length': '500'})
        }
    }

    complete_apps = ['cmplxsys']