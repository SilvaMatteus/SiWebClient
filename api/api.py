#!flask/bin/python
# API

from resource.user_resource import user_blueprint
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)

app.register_blueprint(user_blueprint)

CORS(app)

if __name__ == '__main__':
    app.run(debug=True)
