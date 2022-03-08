"""
Django settings for mysite project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

SECRET_KEY = os.getenv('DJ_SECRET_KEY')

DEBUG = os.getenv('DJ_DEBUG') in ['TRUE','1','true','True']

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR,'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
		'django.template.context_processors.request',
                'django.contrib.messages.context_processors.messages',
                'hedonometer.menu_context.include_timeseries_wordlist_menus',
            ],
        },
    },
]

ALLOWED_HOSTS = [
    '.hedonometer.org',
    '.hedonometer.org.',
]
if DEBUG:
    ALLOWED_HOSTS.append('127.0.0.1')

SITE_ID = 1

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'hedonometer',
    'django.contrib.humanize',
    'tastypie',
)

AUTHENTICATION_BACKENDS = ('django.contrib.auth.backends.ModelBackend',)

MIDDLEWARE = (
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

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'America/New_York'
USE_I18N = True
USE_L10N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.getenv('DJ_STATIC_ROOT')

ABSOLUTE_DATA_PATH = os.getenv('DJ_ABSOLUTE_DATA_PATH')
