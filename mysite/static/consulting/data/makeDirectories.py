# set up the directories from the keywords file
#
# need to replace spaces with -, remove the 's, and escape the &

import codecs
import subprocess
import re

if __name__ == '__main__':
    f = codecs.open('keywords.txt','r','utf8')
    keywords = [line.rstrip().lower() for line in f]
    f.close()
    
    count = 0
    for keyword in keywords:
        # print keyword
        # print 'mkdir -p /users/a/r/areagan/fun/twitter/unilever/keywords/{0}/tweets'.format(re.sub('\'','',re.sub('\s','-',keyword)))
        # subprocess.call('mkdir -p /usr/share/nginx/wiki/mysite/mysite/static/consulting/data/keywords/{0}/'.format(re.sub('&','\&',re.sub('\'','',re.sub('\s','-',keyword)))),shell=True)
        # subprocess.call('\\rm /users/a/r/areagan/fun/twitter/unilever/keywords/{0}/tweets/*'.format(re.sub('&','\&',re.sub('\'','',re.sub('\s','-',keyword)))),shell=True)
        print "\"{0}\": {1},".format(keyword,count)
        count+=1




