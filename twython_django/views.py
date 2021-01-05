from django.contrib.auth import authenticate, login, logout as django_logout
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from django.conf import settings
from django.urls import reverse
from django.shortcuts import render
from django.template import Context

from twython import Twython
from labMTsimple.storyLab import *
from labMTsimple.speedy import *

User = get_user_model()

# If you've got your own Profile setup, see the note in the models file
# about adapting this to your own setup.

def logout(request, redirect_url=settings.LOGOUT_REDIRECT_URL):
    """
        Nothing hilariously hidden here, logs a user out. Strip this out if your
        application already has hooks to handle this.
    """
    django_logout(request)
    # return HttpResponseRedirect(request.build_absolute_uri(redirect_url))
    # this should still be set from the login...
    next_url = request.session.get('next_url', redirect_url)
    return HttpResponseRedirect(next_url)


def begin_auth(request):
    """The view function that initiates the entire handshake.

    For the most part, this is 100% drag and drop.
    """
    # Instantiate Twython with the first leg of our trip.
    twitter = Twython(settings.TWITTER_KEY, settings.TWITTER_SECRET)

    # Request an authorization url to send the user to...
    # callback_url = request.build_absolute_uri(reverse('twython_django.views.thanks'))
    callback_url = "http://hedonometer.org/twitter/thanks/"
    auth_props = twitter.get_authentication_tokens(callback_url)

    # Then send them over there, durh.
    request.session['request_token'] = auth_props

    request.session['next_url'] = request.GET.get('next','/harrypotter.html')

    return HttpResponseRedirect(auth_props['auth_url'])


def thanks(request, redirect_url=settings.LOGIN_REDIRECT_URL):
    """A user gets redirected here after hitting Twitter and authorizing your app to use their data.

    This is the view that stores the tokens you want
    for querying data. Pay attention to this.

    """
    # Now that we've got the magic tokens back from Twitter, we need to exchange
    # for permanent ones and store them...

    oauth_token = request.session['request_token']['oauth_token']
    oauth_token_secret = request.session['request_token']['oauth_token_secret']
    twitter = Twython(settings.TWITTER_KEY, settings.TWITTER_SECRET,
                      oauth_token, oauth_token_secret)

    # Retrieve the tokens we want...
    authorized_tokens = twitter.get_authorized_tokens(request.GET['oauth_verifier'])

    print(authorized_tokens)

    user,created = User.objects.get_or_create(username=authorized_tokens['screen_name'],defaults={"email":"fjdsfn@jfndjfn.com", "password":authorized_tokens['oauth_token_secret']})

    print(user)
    print(created)
    # make sure that the password is the same as the one we're going to use to log in
    if not created:
        user.set_password(authorized_tokens['oauth_token_secret'])
        user.save()

    profile,profileCreated = TwitterProfile.objects.get_or_create(user=user,defaults={"oauth_token": authorized_tokens['oauth_token'], "oauth_secret": authorized_tokens['oauth_token_secret']})

    print(profile)
    print(profileCreated)

    authenticateduser = authenticate(
        username=authorized_tokens['screen_name'],
        password=authorized_tokens['oauth_token_secret']
        )

    login(request, authenticateduser)

    print(request.session)
    print(request.session['next_url'])

    next_url = request.session.get('next_url', redirect_url)
    return HttpResponseRedirect(next_url)

def user_timeline(request):
    """An example view with Twython/OAuth hooks/calls to fetch data about the user in question."""

    user = request.user.twitterprofile
    twitter = Twython(settings.TWITTER_KEY, settings.TWITTER_SECRET,
                      user.oauth_token, user.oauth_secret)
    user_tweets = twitter.get_home_timeline()

    return render('twython_django/tweets.html', {'tweets': user_tweets})

import codecs
from re import findall,UNICODE
my_LabMT = LabMT()

def dictify(wordVec):
    '''Turn a word list into a word,count hash.'''
    thedict = dict()
    for word in wordVec:
        thedict[word] = 1
    return thedict

def listify(long_string,lang="en"):
    """Make a list of words from a string."""

    replaceStrings = ["---","--","''"]
    for replaceString in replaceStrings:
        long_string = long_string.replace(replaceString," ")
    words = [x.lower() for x in findall(r"[\w\@\#\'\&\]\*\-\/\[\=\;]+",long_string,flags=UNICODE)]

    return words

def happs(request):
    """An example view with Twython/OAuth hooks/calls to fetch data about the user in question."""

    user = request.user.twitterprofile
    twitter = Twython(settings.TWITTER_KEY, settings.TWITTER_SECRET,
                      user.oauth_token, user.oauth_secret)
    # user_tweets = twitter.get_home_timeline()
    user_tweets = twitter.get_user_timeline(count=200)
    f = codecs.open(settings.ABSOLUTE_DATA_PATH+"/embeds/rawtext/"+user.oauth_token+".json","w","utf8")
    rawtext = u""
    for tweet in user_tweets:
        f.write(tweet["text"])
        f.write("\n")
        rawtext += tweet["text"]
        rawtext += "\n"
    f.close()

    # turn it into a dict
    ref_words = listify(rawtext)
    ref_dict = dictify(ref_words)

    # score it
    textValence = my_LabMT.score(ref_dict)
    textFvec = my_LabMT.wordVecify(ref_dict)

    f = open(settings.ABSOLUTE_DATA_PATH+"/embeds/word-vectors/"+user.oauth_token+".csv","w")
    f.write("\n".join(map(str,textFvec)))
    f.close()

    # return render('twython_django/tweets.html', {'tweets': user_tweets,"token":user.oauth_token})

    # return render('twython_django/tweets.html', {'tweets': user_tweets,"token":user.oauth_token})

    filenames = {'refFile': '/data/word-vectors/vacc/2015-12-08-prev7.csv',
                 'compFile': '/data/embeds/word-vectors/'+user.oauth_token+'.csv',
    }

    # logger.debug(filenames)
    # logger.debug(Context(filenames))

    # now pass those into the view
    return render(request, 'hedonometer/shifttest.html', Context(filenames))

