from django.shortcuts import render
from django.views.generic import View

from twython_django.models import Annotation
from twython_django.models import MovieAnnotation
from hedonometer.models import Book,Movie

class movielist(View):
     # return all of the annotations for a book
    def get(self, request):
        movie_list = Movie.objects.all()
        return render(request, 'hedonometer/movielist.html',{"movie_list": movie_list})

class rankedmovielist(View):
    # return all of the annotations for a book
    def get(self, request):
        movie_list = Movie.objects.all().exclude(exclude=True).order_by('-happs')
        return render(request, 'hedonometer/movielist-ranked.html',{"movie_list": movie_list})



class booklist(View):
     # return all of the annotations for a book
    def get(self, request):
        book_list = Book.objects.all()
        return render(request, 'hedonometer/booklist.html',{"book_list": book_list})

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
        return render(request, 'hedonometer/harrypotter.html',{"book": book})
    
    # accept an annotation
    def post(self, request, book):
        # print request.POST.get("tweetflag","none")
        # print request.POST.get("annotation","none")
        # print request.POST.get("point","none")
        b = Book.objects.filter(title__exact=book)[0]
        # print request.user.twitterprofile
        
        queryset = Annotation.objects.filter(book=b,position=request.POST.get("point","none"))
        # vote for an annotation
        # check on the POST data for a vote
        vote = False
        for q in queryset:
            id = q.id
            if request.POST.get(str(id),"none") != "none":
                # print "casting a vote"
                vote = True
                q.votes += 1
                q.save()
                break

        # create a new annotation
        if not vote:
            # print "making a new annotation"
            a = Annotation(book=b,user=request.user.twitterprofile,position=request.POST.get("point","none"),annotation=request.POST.get("annotation","none"),tweeted=request.POST.get("tweetflag","notset"),date=datetime.datetime.now(),votes=1,winner="0")
            # save it
            a.save()

        # check for the winner, always
        winner = 0
        mostvotes = 0

        if len(queryset) > 0:
            for i in xrange(len(queryset)):
                annotation = queryset[i]
                annotation.winner = "0"
                if int(annotation.votes) > mostvotes:
                    mostvotes = int(annotation.votes)
                    winner = i
    
            queryset[winner].winner = "1"
            queryset[winner].save()
        else:
            a.winner = "1"
            a.save()

        # return HttpResponse("this will also be the book page, with a new annotation")
        return render(request, 'hedonometer/harrypotter.html',{"book": book})

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
    
    # accept an annotation
    def post(self, request, movie):
        m = Movie.objects.filter(title__exact=movie)[0]
        # print request.user.twitterprofile
        
        queryset = MovieAnnotation.objects.filter(movie=m,position=request.POST.get("point","none"))
        # vote for an annotation
        # check on the POST data for a vote
        vote = False
        for q in queryset:
            id = q.id
            if request.POST.get(str(id),"none") != "none":
                # print "casting a vote"
                vote = True
                q.votes += 1
                q.save()
                break

        # create a new annotation
        if not vote:
            # print "making a new annotation"
            a = MovieAnnotation(movie=m,
                                user=request.user.twitterprofile,
                                position=request.POST.get("point","none"),
                                annotation=request.POST.get("annotation","none"),
                                tweeted=request.POST.get("tweetflag","notset"),
                                window=request.POST.get("window","2000"),
                                date=datetime.datetime.now(),
                                votes=1,
                                winner="0")
            # save it
            a.save()

        # check for the winner, always
        winner = 0
        mostvotes = 0

        if len(queryset) > 0:
            for i in xrange(len(queryset)):
                annotation = queryset[i]
                annotation.winner = "0"
                if int(annotation.votes) > mostvotes:
                    mostvotes = int(annotation.votes)
                    winner = i
    
            queryset[winner].winner = "1"
            queryset[winner].save()
        else:
            a.winner = "1"
            a.save()

        # return HttpResponse("this will also be the book page, with a new annotation")
        return render(request, 'hedonometer/movie.html',{"movie": movie})
