from django.shortcuts import render
from django.views.generic import View
from django.shortcuts import get_object_or_404

from hedonometer.models import Book,Movie

from hedonometer.models import GutenbergBook,GutenbergAuthor

from datetime import datetime

class movielist(View):
     # return all of the annotations for a book
    def get(self, request):
        movie_list = Movie.objects.all()
        return render(request, 'hedonometer/movielist.html',{"movie_list": movie_list})

class rankedmovielist(View):
    # return all of the annotations for a book
    def get(self, request):
        # movie_list = Movie.objects.all().exclude(exclude=True).order_by('-happs')
        # return render(request, 'hedonometer/movielist-ranked.html',{"movie_list": movie_list})
        return render(request, 'hedonometer/movielist-ranked.html')

class booklist(View):
     # return all of the annotations for a book
    def get(self, request):
        book_list = Book.objects.all()
        return render(request, 'hedonometer/books/booklist.html',{"book_list": book_list})

class annotation(View):
     # return all of the annotations for a book
    def get(self, request, book):
        # print book
        # print request
        # print request.session
        # print request.user.twitterprofile
        # can just redirect to this view
        # with a URL parameter
        # return HttpResponseRedirect("/harrypotter.html?book="+book)
        # but why not just render the template
        return render(request, 'hedonometer/books/harrypotter.html',{"book": book})

class gutenberg_paper(View):
    # return all of the annotations for a book

    def get(self, request, book):
        gutbook = get_object_or_404(GutenbergBook,gutenberg_id=book)
        return render(request, 'hedonometer/books/v3.html',{"book": gutbook})


class movieannotation(View):
    def get(self, request, movie):
        m = Movie.objects.filter(title__exact=movie)[0]
        try:
            f = open("/usr/share/nginx/data/moviedata/rawer/"+m.filename+".html.end.beg","r");
            fulltext = f.read()
            f.close()
        except:
            fulltext = "fulltext not found, please report to @hedonometer :)"

        return render(request, 'hedonometer/movie.html',{"movie": movie, "fulltext": fulltext})

