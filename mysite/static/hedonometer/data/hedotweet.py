from twython import Twython, TwythonError
from sys import argv
import datetime

if __name__ == '__main__':

    d = argv[1]
    date = datetime.datetime.strptime(d,'%Y-%m-%d')
    print date

    f = open('word-vectors/{0}-sumhapps.csv'.format(date.strftime('%Y-%m-%d')),'r')
    tmp = f.readline().rstrip()
    f.close()
    happs = float(tmp.split(',')[1])
    print happs

    prevhapps = [0.0 for i in xrange(7)]
    prevdate = date
    for i in xrange(7):
        prevdate = prevdate-datetime.timedelta(days=1)
        f = open('word-vectors/{0}-sumhapps.csv'.format(prevdate.strftime('%Y-%m-%d')),'r')
        tmp = f.readline().rstrip()
        f.close()
        phapps = float(tmp.split(',')[1])
        print phapps
        prevhapps[i] = phapps

    avhapps = sum(prevhapps)/7.0
    print avhapps

    if happs > avhapps:
        updown = 'happier'
    else:
        updown = 'less happy'
    
    link = "http://hedonometer.org/index.html?date={0}".format(date.strftime('%Y-%m-%d'))

    tweet='the average happiness for Twitter on {0} was {1:.2f}. why this day was {2} than the last 7 days: {3}'.format(date.strftime('%A, %B %d, %Y'),happs,updown,link)

    # store the keys somewhere (so I can share this script)
    f = open('keys','r')
    APP_KEY = f.readline().rstrip()
    APP_SECRET = f.readline().rstrip()
    OAUTH_TOKEN = f.readline().rstrip()
    OAUTH_TOKEN_SECRET = f.readline().rstrip()
    f.close()

    twitter = Twython(APP_KEY,APP_SECRET,OAUTH_TOKEN,OAUTH_TOKEN_SECRET)

    try:
        twitter.update_status(status=tweet)
    except TwythonError as e:
        print e

    print tweet
