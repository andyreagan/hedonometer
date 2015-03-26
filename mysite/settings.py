"""
Django settings for mysite project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('DJ_SECRET_KEY')


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DJ_DEBUG') in ['TRUE','1','true','True']
 
TEMPLATE_DEBUG = DEBUG

TEMPLATE_DIRS = [os.path.join(BASE_DIR,'templates')]

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.request",
    "django.core.context_processors.static",
    "django.core.context_processors.tz",
    "django.contrib.messages.context_processors.messages",
    "sekizai.context_processors.sekizai",
)

ALLOWED_HOSTS = [
    '.hedonometer.org',
    '.hedonometer.org.',
]

SITE_ID = 1

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
#     'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'hedonometer',
    'django.contrib.humanize',
    'south',
    'tastypie',
    'twython_django',
    'dbbackup',
)

# the following 6 are for twitter logins
TWITTER_KEY = os.getenv('HEDO_APP_KEY')
TWITTER_SECRET = os.getenv('HEDO_APP_SECRET')

LOGIN_URL='/twitter/login'
LOGOUT_URL='/twitter/logout'
# just a default.
# we'll try to send the user back to the page which they logged in from
LOGIN_REDIRECT_URL='/twitter/user_timeline'
# also just a default
LOGOUT_REDIRECT_URL='/index.html'

AUTHENTICATION_BACKENDS = ('django.contrib.auth.backends.ModelBackend',)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # this doesn't allow iframes from our site
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'mysite.urls'

WSGI_APPLICATION = 'mysite.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': os.getenv('DJ_DB_ENGINE'),
        'NAME': os.getenv('DJ_DB_NAME'),
        'USER': os.getenv('DJ_DB_USER'),
        'PASSWORD': os.getenv('DJ_DB_PASSWORD'),
        'HOST': os.getenv('DJ_DB_HOST'),
        'PORT': os.getenv('DJ_DB_PORT'),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/New_York'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.getenv('DJ_STATIC_ROOT')

ABSOLUTE_DATA_PATH = os.getenv('DJ_ABSOLUTE_DATA_PATH')

# # from http://ianalexandr.com/blog/getting-started-with-django-logging-in-5-minutes.html
# # settings.py
# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'formatters': {
#         'verbose': {
#             'format' : "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
#             'datefmt' : "%d/%b/%Y %H:%M:%S"
#         },
#         'simple': {
#             'format': '%(levelname)s %(message)s'
#         },
#     },
#     'handlers': {
#         'file': {
#             'level': 'DEBUG',
#             'class': 'logging.FileHandler',
#             'filename': 'mysite.log',
#             'formatter': 'verbose'
#         },
#     },
#     'loggers': {
#         'django': {
#             'handlers':['file'],
#             'propagate': True,
#             'level':'DEBUG',
#         },
#         'hedonometer': {
#             'handlers': ['file'],
#             'level': 'DEBUG',
#         },
#     }
# }



