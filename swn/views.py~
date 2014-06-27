# Create your views here.
from django.shortcuts import render, get_object_or_404, render_to_response
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext, loader
from django.core.urlresolvers import reverse
import json
from swn.models import Topic,Swn,Like
from django.utils import timezone

def index(request):
    latest_topic_list = Topic.objects.order_by('-pub_date')[:5]
    context = {'latest_topic_list': latest_topic_list}
    return render(request, 'swn/index.html', context)

def detail(request, swn_id):
    topic = get_object_or_404(Topic, pk=swn_id)
    # return render(request, 'swn/detail.html', {'topic': topic})
    return render_to_response('swn/detail.html', {'topic': topic}, context_instance=RequestContext(request))

# this function should take webpage input and return it straight to jquery
# or if there is no additional data, just return the webpage
def voteswn(request, swn_id):
    if 'client_response' in request.POST:
        x = request.POST['client_response']
        like = Like(swn=Swn.objects.get(pk=x),pub_date=timezone.now())
        like.save()
        response_dict = {}
        response_dict.update({'server_response': x, 'count': Like.objects.filter(swn=Swn.objects.get(pk=x)).count()})
        return HttpResponse(json.dumps(response_dict),mimetype='application/javascript')
    else:
        topic = get_object_or_404(Topic, pk=swn_id)
        return render_to_response('swn/detail.html', {'topic': topic}, context_instance=RequestContext(request))

def addswn(request, swn_id):
    if 'client_response' in request.POST:
        x = request.POST['client_response']
        response_dict = {'status_code': 2}
        if len(x.split(' ')) > 6:
            response_dict['status_code'] = 1
        elif len(x.split(' ')) < 6:
            response_dict['status_code'] = 0
        else:
            swn = Swn(text=x,topic=Topic.objects.get(pk=swn_id),pub_date=timezone.now())
            swn.save()
        # response_dict.update({'server_response': x, 'count': Like.objects.filter(swn=Swn.objects.get(pk=x)).count()})
        return HttpResponse(json.dumps(response_dict),mimetype='application/javascript')
        # topic = get_object_or_404(Topic, pk=swn_id)
        # return render_to_response('swn/detail.html', {'topic': topic}, context_instance=RequestContext(request))
    else:
        topic = get_object_or_404(Topic, pk=swn_id)
        return render_to_response('swn/detail.html', {'topic': topic}, context_instance=RequestContext(request))


