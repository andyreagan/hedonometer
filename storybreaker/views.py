from django.shortcuts import render
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext, loader
from django.core.urlresolvers import reverse

import subprocess
import re

def api(request, call):
    # if 'rm' in directory:
    #     directory = 'Sorry, you have an rm in your directory name. Security risk'

    # verify that we can use ssh
    # imagelist = subprocess.check_output('ssh -i ~/.ssh/id_rsa areagan@bluemoon-user1.uvm.edu "pwd"',shell=True).split('/n')
    # subprocess.call('mkdir -p /usr/share/nginx/wiki/mysite/mysite/static/vaccv/{0}'.format(directory),shell=True)

    # imagelist = subprocess.check_output('scp -i ~/.ssh/id_rsa areagan@bluemoon-user1.uvm.edu:{0} /usr/share/nginx/wiki/mysite/vaccv/clone{0}'.format(directory),shell=True).split('/n')
    # for itype in ['png','jpg','svg']:
    #     subprocess.call('rsync -avz -e \'ssh -i /home/user0/.ssh/id_rsa\' areagan@bluemoon-user1.uvm.edu:/{0}/*.{1} /usr/share/nginx/wiki/mysite/mysite/static/vaccv/{0}'.format(directory,itype),shell=True)
    # imagelist = []
    # for itype in ['png','jpg','svg']:
    #     try:
    #         tmp = subprocess.check_output('cd /usr/share/nginx/wiki/mysite/mysite/static/vaccv/{0}; ls -1 *.{1}'.format(directory,itype),shell=True).split('\n')[0:-1]
    #         imagelist = imagelist + tmp
    #     except:
    #         pass

    # subprocess.check_output('mkdir -p ',shell=True)
    # subprocess.call('rsync ',shell=True)

    apirequest = call.split('/')
    requestlen = len(apirequest[0])
    [requestscript,starttime,endtime,lang,box,phrase] = apirequest
    # langs = [x for x in lang.split(',')]
    # boxs = [re.replace(x,'-','/') for x in box.split(',')]
    # phrass = [x for x in phrase.split(',')]
    fullcall = "{0}.pl start={1} end={2} languages=[{3}] boxes=[{4}] phrases=[{5}] -V".format(requestscript,starttime,endtime,lang,box,phrase)
    # timeseries = subprocess.check_output('ssh -i  ~/.ssh/id_rsa areagan@bluemoon-user1.uvm.edu "/gpfs1/arch/x86_64/python2.7.5/bin/python /users/a/r/areagan/fun/twitter/jake/examplecall/test.py"',shell=True).split('/n')
    rawOutput = subprocess.check_output('ssh -i  ~/.ssh/id_rsa areagan@bluemoon-user1.uvm.edu "/usr/bin/perl /users/a/r/areagan/fun/twitter/jake/examplecall/{0}"'.format(fullcall),shell=True)
    
    # get rid of header with [1:-1]
    # split insides on tab
    timeseries = [x.split('\t') for x in rawOutput.split('\n')[1:-1]]

    return render(request, 'storybreaker/api.html', {'timeseries': timeseries, 'call': fullcall,})


