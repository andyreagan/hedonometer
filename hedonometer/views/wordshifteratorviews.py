from django.shortcuts import render
from django.views.generic import View
from django.template import Context

from hedonometer.models import Embeddable

from labMTsimple.storyLab import *
from labMTsimple.speedy import *
import datetime
import hashlib

from django.conf import settings

def listify(long_string,lang="en"):
    """Make a list of words from a string."""

    replaceStrings = ["---","--","''"]
    for replaceString in replaceStrings:
        long_string = long_string.replace(replaceString," ")
    words = [x.lower() for x in re.findall(r"[\w\@\#\'\&\]\*\-\/\[\=\;]+",long_string,flags=re.UNICODE)]

    return words

def dictify(word_list,lang="en"):
    """Take a list of words, return word dict."""

    my_dict = dict()
    
    for word in word_list:
        if word in my_dict:
            my_dict[word] += 1
        else:
            my_dict[u(word)] = 1

    return my_dict

class main(View):
    # this is the over view
    def get(self, request):
        # m = Embeddable.objects.get(h="blank")
        
        all_embeds = Embeddable.objects.all()
        
        # if request.user:
        #     my_embeds = Embeddable.objects.filter(author=request.user.twitterprofile).order_by("-updatedDate")
        # else:
        #     my_embeds = all_embeds

        my_embeds = Embeddable.objects.filter(author=request.user.twitterprofile).order_by("-updatedDate")
        
        return render(request, 'hedonometer/wordshifterator/overview.html',{"new": False, "state": "", "filltexbt": "", "submittext": "Generate Wordshift", "return_link": "/wordshifterator/", "my_shifts": my_embeds})
    
    # this post makes a new one
    def post(self, request):
        r = hashlib.md5()
        r.update(request.POST.get("refText","none").encode('utf-8'))

        c = hashlib.md5()
        c.update(request.POST.get("compText","none").encode('utf-8'))
        
        digest = r.hexdigest()+c.hexdigest()

        # lang = "english"
        # labMT,labMTvector,labMTwordList = emotionFileReader(stopval=0.0,filename='labMT2'+lang+'.txt',returnVector=True)
        my_LabMT = LabMT()

        # write the file
        f = open(settings.ABSOLUTE_DATA_PATH+"/embeds/rawtext/"+r.hexdigest()+".txt","w")
        f.write(request.POST.get("refText","blank").encode('utf-8'))
        f.close()

        # turn it into a dict
        ref_words = listify(request.POST.get("refText","not found"))
        ref_dict = dictify(ref_words)

        # score it
        textValence = my_LabMT.score(ref_dict)
        textFvec = my_LabMT.wordVecify(ref_dict)
        
        f = open(settings.ABSOLUTE_DATA_PATH+"/embeds/word-vectors/"+r.hexdigest()+".csv","w")
        f.write("\n".join(map(str,textFvec)))
        f.close()
        
        f = open(settings.ABSOLUTE_DATA_PATH+"/embeds/rawtext/"+c.hexdigest()+".txt","w")
        f.write(request.POST.get("compText","blank").encode('utf-8'))
        f.close()

        # turn it into a dict
        comp_words = listify(request.POST.get("compText","not found"))
        comp_dict = dictify(comp_words)

        # score it
        textValence = my_LabMT.score(comp_dict)
        textFvec = my_LabMT.wordVecify(comp_dict)
        
        f = open(settings.ABSOLUTE_DATA_PATH+"/embeds/word-vectors/"+c.hexdigest()+".csv","w")
        f.write("\n".join(map(str,textFvec)))
        f.close()


        # generate a database model
        m = Embeddable(h=r.hexdigest()+c.hexdigest(),
                       refFile="/data/embeds/word-vectors/"+r.hexdigest()+".csv",
                       refFileName=request.POST.get("refTitle","notitle"),
                       compFile="/data/embeds/word-vectors/"+c.hexdigest()+".csv",
                       compFileName=request.POST.get("compTitle","notitle"),
                       customTitleText=request.POST.get("titleInput","notitle"),
                       customFullText="",
                       author=request.user.twitterprofile,
                       contextFlag="wordshifterator",
                       createdDate=datetime.datetime.now(),
                       updatedDate=datetime.datetime.now(),
                       stopWords=request.POST.get("stopWordInput",""),
        )
        # .objects.filter(h__exact=some_hash)
        
        m.save()

        filenames = {
            "refFile": m.refFile,
            "compFile": m.compFile,
            "fhash": m.h,
        }

        return render(request, 'hedonometer/wordshifterator/view.html', {"my_shift": m,})

class viewwordshift(View):
    # this shows the edit
    def get(self, request, some_hash):
        m = Embeddable.objects.get(h=some_hash)
        return render(request, 'hedonometer/wordshifterator/view.html', {"my_shift": m,})

class sharewordshift(View):
    # this shows the edit
    def get(self, request, some_hash):
        m = Embeddable.objects.get(h=some_hash)
        return render(request, 'hedonometer/wordshifterator/share.html', {"my_shift": m,})

class editwordshift(View):
    # this shows the edit
    def get(self, request, some_hash):
        # return the edit page
        # will need to pass the model info in...
        m = Embeddable.objects.get(h=some_hash)
        
        # ALSO 
        # need to change the title, and the submit button
        # both the text of the submit button, and make it point back to this page
        return render(request, 'hedonometer/wordshifterator/edit.html',{"model": m, "new": False, "state": "disabled", "filltext": "(we don't keep your text)", "submittext": "Save", "return_link": "/wordshifterator/edit/"+some_hash+"/"})

    # and this saves an edit
    def post(self, request, some_hash):
        # get the object
        m = Embeddable.objects.get(h=some_hash)
        # pass it back in

        m.refFileName=request.POST.get("refTitle",m.refFileName)
        m.compFileName=request.POST.get("compTitle",m.compFileName)
        m.customTitleText=request.POST.get("titleInput",m.customTitleText)
        m.editedDate=datetime.datetime.now()
        m.stopWords=request.POST.get("stopWordInput","")
        
        m.save()

        filenames = {
            "refFile": m.refFile,
            "compFile": m.compFile,
            "fhash": m.h,
        }

        return render(request, 'hedonometer/wordshifterator/view.html',Context(filenames))



