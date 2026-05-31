from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import os
from django.urls import reverse_lazy

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')

DEBUG = True

ALLOWED_HOSTS = []
INSTALLED_APPS = [
    'unfold',
    'unfold.contrib.filters',
    'unfold.contrib.forms',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'rest_framework',
    'markdownx',
    'users',
    'courses',
    'quizzes',
    'corsheaders',
    'ckeditor',
]
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

CORS_ALLOWED_ORIGINS = [
    'http://localhost:4200',
]

CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full',
        'height': 400,
    }
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

AUTH_USER_MODEL = 'users.User'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {'class': 'logging.StreamHandler'},
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}

SITE_ID = 1

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': ['profile', 'email'],
        'AUTH_PARAMS': {'access_type': 'online'},
        'APP': {
            'client_id': os.getenv('GOOGLE_CLIENT_ID'),
            'secret': os.getenv('GOOGLE_CLIENT_SECRET'),
        }
    }
}

LOGIN_REDIRECT_URL = 'http://localhost:4200/auth/callback'

UNFOLD = {
    "SITE_TITLE": "PyPath",
    "SITE_HEADER": ">_ PyPath",
    "SITE_URL": "http://localhost:4200",
    "SITE_ICON": None,
    "DASHBOARD_CALLBACK": None,
    "SHOW_THEME_SWITCH": True,
    "LOGIN": {
        "image": None,
        "redirect_after": None,
    },

    "STYLES": [],
    "SCRIPTS": [],
    "COLORS": {
        "primary": {
            "50": "250 245 255",
            "100": "243 232 255",
            "200": "233 213 255",
            "300": "216 180 254",
            "400": "192 132 252",
            "500": "168 85 247",
            "600": "124 106 247",
            "700": "109 90 247",
            "800": "91 74 247",
            "900": "76 62 247",
            "950": "59 48 247",
        },
    },
    "EXTENSIONS": {
        "modeltranslation": {
            "flags": {},
        },
    },
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": True,
        "navigation": [
            {
                "title": "Навігація",
                "separator": True,
                "items": [
                    {
                        "title": "Дашборд",
                        "icon": "dashboard",
                        "link": reverse_lazy("admin:index"),
                    },
                ],
            },
            {
                "title": "Користувачі",
                "separator": True,
                "items": [
                    {
                        "title": "Користувачі",
                        "icon": "people",
                        "link": reverse_lazy("admin:users_user_changelist"),
                    },
                ],
            },
            {
                "title": "Курси",
                "separator": True,
                "items": [
                    {
                        "title": "Курси",
                        "icon": "school",
                        "link": reverse_lazy("admin:courses_course_changelist"),
                    },
                    {
                        "title": "Теми",
                        "icon": "category",
                        "link": reverse_lazy("admin:courses_topic_changelist"),
                    },
                    {
                        "title": "Уроки",
                        "icon": "article",
                        "link": reverse_lazy("admin:courses_lesson_changelist"),
                    },
                ],
            },
            {
                "title": "Тести",
                "separator": True,
                "items": [
                    {
                        "title": "Тести",
                        "icon": "quiz",
                        "link": reverse_lazy("admin:quizzes_quiz_changelist"),
                    },
                    {
                        "title": "Питання",
                        "icon": "help",
                        "link": reverse_lazy("admin:quizzes_question_changelist"),
                    },
                ],
            },
        ],
    },
}