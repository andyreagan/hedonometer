# Create your views here.
from django.shortcuts import render, get_object_or_404

# Create your views here.
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext, loader
from django.core.urlresolvers import reverse

def index(request):
    return render(request, 'vaccv/index.html')

import subprocess

def detail(request, directory):
    # if 'rm' in directory:
    #     directory = 'Sorry, you have an rm in your directory name. Security risk'

    # verify that we can use ssh
    # imagelist = subprocess.check_output('ssh -i ~/.ssh/id_rsa areagan@bluemoon-user1.uvm.edu "pwd"',shell=True).split('/n')
    subprocess.call('mkdir -p /usr/share/nginx/wiki/mysite/mysite/static/vaccv/{0}'.format(directory),shell=True)

    # imagelist = subprocess.check_output('scp -i ~/.ssh/id_rsa areagan@bluemoon-user1.uvm.edu:{0} /usr/share/nginx/wiki/mysite/vaccv/clone{0}'.format(directory),shell=True).split('/n')
    for itype in ['png','jpg','svg']:
        subprocess.call('rsync -avz -e \'ssh -i /home/user0/.ssh/id_rsa\' areagan@bluemoon-user1.uvm.edu:/{0}/*.{1} /usr/share/nginx/wiki/mysite/mysite/static/vaccv/{0}'.format(directory,itype),shell=True)
    imagelist = []
    for itype in ['png','jpg','svg']:
        try:
            tmp = subprocess.check_output('cd /usr/share/nginx/wiki/mysite/mysite/static/vaccv/{0}; ls -1 *.{1}'.format(directory,itype),shell=True).split('\n')[0:-1]
            imagelist = imagelist + tmp
        except:
            pass

    # subprocess.check_output('mkdir -p ',shell=True)
    # subprocess.call('rsync ',shell=True)

    return render(request, 'vaccv/detail.html', {'imagelist': imagelist, 'directory': directory})
