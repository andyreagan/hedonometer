from django.shortcuts import render
from django.views.generic import View

from hedonometer.models import Embeddable

from labMTsimple.storyLab import emotionFileReader,emotion
import datetime
import hashlib

class diy(View):
    def get(self, request):
        # m = Embeddable.objects.get(h="blank")
        return render(request, 'hedonometer/diy-compare.html',{"new": True, "state": "", "filltext": "", "submittext": "Generate Wordshift", "return_link": "/wordshifterator/"})
    
    def post(self, request):
        r = hashlib.md5()
        r.update(request.POST.get("refText","none").encode('utf-8'))

        c = hashlib.md5()
        c.update(request.POST.get("compText","none").encode('utf-8'))
        
        digest = r.hexdigest()+c.hexdigest()

        lang = "english"
        labMT,labMTvector,labMTwordList = emotionFileReader(stopval=0.0,filename='labMT2'+lang+'.txt',returnVector=True)

        f = open(ABSOLUTE_DATA_PATH+"/embeds/rawtext/"+r.hexdigest()+".txt","w")
        f.write(request.POST.get("refText","blank").encode('utf-8'))
        f.close()
        textValence,textFvec = emotion(request.POST.get("refText","tmp"),labMT,shift=True,happsList=labMTvector)
        f = open(ABSOLUTE_DATA_PATH+"/embeds/word-vectors/"+r.hexdigest()+".csv","w")
        f.write(",".join(map(str,textFvec)))
        f.close()
        
        f = open(ABSOLUTE_DATA_PATH+"/embeds/rawtext/"+c.hexdigest()+".txt","w")
        f.write(request.POST.get("compText","blank").encode('utf-8'))
        f.close()
        textValence,textFvec = emotion(request.POST.get("compText","tmp"),labMT,shift=True,happsList=labMTvector)
        f = open(ABSOLUTE_DATA_PATH+"/embeds/word-vectors/"+c.hexdigest()+".csv","w")
        f.write(",".join(map(str,textFvec)))
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
                       stopWords=request.POST.get("stopWordInput",""),
        )
        # .objects.filter(h__exact=some_hash)
        
        m.save()

        filenames = {
            "refFile": m.refFile,
            "compFile": m.compFile,
            "fhash": m.h,
        }

        return render(request, 'hedonometer/diy-result.html',Context(filenames))

class editwordshift(View):
    def get(self, request, some_hash):
        # return the edit page
        # will need to pass the model info in...
        m = Embeddable.objects.get(h=some_hash)
        
        # ALSO 
        # need to change the title, and the submit button
        # both the text of the submit button, and make it point back to this page
        return render(request, 'hedonometer/diy-compare.html',{"model": m, "new": False, "state": "disabled", "filltext": "(we don't keep your text)", "submittext": "Save", "return_link": "/wordshifterator/edit/"+some_hash+"/"})

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

        return render(request, 'hedonometer/diy-result.html',Context(filenames))


