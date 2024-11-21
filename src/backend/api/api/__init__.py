'''
web
'''
from apiflask import APIFlask
from flask import Flask, url_for
from flask_mail import Mail
from celery import Celery
import os
from flask_cors import CORS


class ReverseProxied(object):
    '''Wrap the application in this middleware and configure the 
    front-end server to add these headers, to let you quietly bind 
    this to a URL other than / and to an HTTP scheme that is 
    different than what is used locally.

    In nginx:
    location /myprefix {
        proxy_pass http://192.168.0.1:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Scheme $scheme;
        proxy_set_header X-Script-Name /myprefix;
        }

    :param app: the WSGI application
    '''
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        script_name = environ.get('HTTP_X_SCRIPT_NAME', '')
        if script_name:
            environ['SCRIPT_NAME'] = script_name
            path_info = environ['PATH_INFO']
            if path_info.startswith(script_name):
                environ['PATH_INFO'] = path_info[len(script_name):]

        scheme = environ.get('HTTP_X_SCHEME', '')
        if scheme:
            environ['wsgi.url_scheme'] = scheme
        return self.app(environ, start_response)

# from werkzeug.middleware.proxy_fix import ProxyFix
app = Flask(__name__)

# app = APIFlask(__name__, title='The api of Neuropeptide tools')
# # app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_host=1)
# app.wsgi_app = ReverseProxied(app.wsgi_app)

# app.config['SYNC_LOCAL_SPEC'] = True
# app.config['LOCAL_SPEC_PATH'] = os.path.join(app.root_path, 'openapi.json')

# app.config['DESCRIPTION'] = 'The api of Neuropeptide tools'
# app.servers = [
#                 {
#                     'name': 'Production Server',
#                     'url': 'http://bioinfo.isyslab.info/DeepNeuropePred'
#                 }
#             ]

# app.config['REDOC_STANDALONE_JS'] = 'https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js'
# app.config['SWAGGER_UI_CSS'] = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.11.1/swagger-ui.css'

# app.config['SWAGGER_UI_BUNDLE_JS']= 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.11.1/swagger-ui-bundle.js'
# app.config['SWAGGER_UI_STANDALONE_PRESET_JS'] = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.11.1/swagger-ui-standalone-preset.js'

CORS(app)
cors = CORS(app, resource={
    r"/*":{
        "origins":"*"
    }
})

app.config['MAIL_SERVER'] = 'smtp.qq.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USERNAME'] = '798306069@qq.com'
app.config['MAIL_PASSWORD'] = 'rfdssslugycnbcah'
app.config['MAIL_DEFAULT_SENDER'] = 'isyslab@foxmail.com'

mail = Mail(app)

celery_app = Celery(app.name,include=['api.tasks'])
celery_app.config_from_object('api.celery_config')

from api import views