from os import listdir
from os.path import isfile, join
import sys
import json
from re import findall,UNICODE
from django.utils.encoding import smart_text,smart_bytes

# import os
# sys.path.append('/Users/andyreagan/projects/2014/09-books/database')
# os.environ.setdefault('DJANGO_SETTINGS_MODULE','gutenbergdb.settings')
# import django
# django.setup()

import sys, os
sys.path.append('/home/prod/app')
os.environ['DJANGO_SETTINGS_MODULE'] = 'mysite.settings'
from django.conf import settings

from hedonometer.models import GutenbergAuthor,GutenbergBook

# # first, go extract all of the authors, with the PK
# all_authors = Author.objects.all()
# for a in all_authors[:10]:
#     print((a.pk, a.fullname, a.note, a.gutenberg_id))
# all_author_json = [{"pk": a.pk, "fullname": a.fullname, "note": a.note, "gutenberg_id": a.gutenberg_id} for a in all_authors]
f = open("all_author_info.json","r")
all_authors = json.loads(f.read())
f.close()

all_author_ids = dict()
for a in all_authors:
    if a["pk"] in all_author_ids:
        if all_author_ids[a["pk"]] != a["gutenberg_id"]:
            print("weird")
    else:
        all_author_ids[a["pk"]] = a["gutenberg_id"]

# print("ripping through the authors")

# for a in all_authors:
#     # print((a["pk"], a["fullname"], a["note"], a["gutenberg_id"],))

#     if len(GutenbergAuthor.objects.filter(gutenberg_id=a["gutenberg_id"])) == 0:
#         if len(a["fullname"]) > 90:
#             a["fullname"] = a["fullname"][:90]
#         a_o = GutenbergAuthor(fullname=a["fullname"].encode("unicode_escape"),
#                               note=a["note"],
#                               gutenberg_id=a["gutenberg_id"])
#         a_o.save()
    
#         # if a_o.pk != a["pk"]:
#         #     print(a_o.pk,a["pk"])

# print"done")

# # first, go extract all of the authors, with the PK
# all_books = Book.objects.all()
# for b in all_books[:10]:
#     print((b.pk, b.title,))

# all_book_json = [{"title": b.title,
#                   "authors": [a.pk for a in b.authors.all()],
#                   "language": b.language,
#                   "lang_code_id": b.lang_code_id,
#                   "downloads": b.downloads,
#                   "gutenberg_id": b.gutenberg_id,
#                   "mobi_file_path": b.mobi_file_path,
#                   "epub_file_path": b.epub_file_path,
#                   "txt_file_path": b.txt_file_path,
#                   "expanded_folder_path": b.expanded_folder_path,
#                   "length": b.length,
#                   "numUniqWords": b.numUniqWords,
#                   "ignorewords": b.ignorewords,
#                   "exclude": b.exclude,
#                   "excludeReason": b.excludeReason,}
#                  for b in all_books]

f = open("all_book_info.json","r")
all_book_json = json.loads(f.read())
f.close()

    # title = 
    # pickle_object = 
    # authors = 
    # language = 
    # lang_code_id = 
    # downloads = 
    # gutenberg_id = 
    # mobi_file_path = 
    # epub_file_path = 
    # txt_file_path = 
    # expanded_folder_path = 
    # length = 
    # numUniqWords = 
    # ignorewords = 
    # wiki = 
    # scaling_exponent = 
    # scaling_exponent_top100 = 
    # exclude = 
    # excludeReason =

# the unicode escape makes some titles too long
# so just ignore the truncation warning...
from warnings import filterwarnings
import MySQLdb as Database
filterwarnings('ignore', category = Database.Warning)    

for b in all_book_json:
    print(b["gutenberg_id"])
    if len(b["title"]) > 100:
        b["title"] = b["title"][:100]
    gb = GutenbergBook(title=b["title"].encode("unicode_escape"),
                       language=b["language"],
                       lang_code_id=b["lang_code_id"],
                       downloads=b["downloads"],
                       gutenberg_id=b["gutenberg_id"],
                       mobi_file_path=b["mobi_file_path"],
                       epub_file_path=b["epub_file_path"],
                       txt_file_path=b["txt_file_path"],
                       expanded_folder_path=b["expanded_folder_path"],
                       length=b["length"],
                       numUniqWords=b["numUniqWords"],
                       ignorewords=b["ignorewords"],
                       exclude=b["exclude"],
                       excludeReason=b["excludeReason"],)
    gb.save()
    for apk in b["authors"]:
        gid = all_author_ids[apk]
        # print(gid)
        a = GutenbergAuthor.objects.get(gutenberg_id=gid)
        # print(a)
        gb.authors.add(a)
        gb.save()
