from django.conf.urls import url
from django.views.generic import TemplateView
from twython_django.views import begin_auth, logout, thanks, user_timeline, happs

# your_app = name of your root djang app.
urlpatterns = [
    # First leg of the authentication journey...
    url(r'^login/?$', begin_auth, name="twitter_login"),

    # Logout, if need be
    url(r'^logout/?$', logout, name="twitter_logout"),  # Calling logout and what not

    # This is where they're redirected to after authorizing - we'll
    # further (silently) redirect them again here after storing tokens and such.
    url(r'^thanks/?$', thanks, name="twitter_callback"),

    # An example view using a Twython method with proper OAuth credentials. Clone
    # this view and url definition to get the rest of your desired pages/functionality.
    url(r'^user_timeline/?$', user_timeline, name="twitter_timeline"),
    url(r'^happiness/?$', happs, name="happs"),
    url(r'^show-me-the-happs.html',
        TemplateView.as_view(template_name='twython_django/signin.html'),
        name='api')
]
