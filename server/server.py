from urllib.parse import unquote
import requests
from io import BytesIO
import json
from os import sendfile
from flask_sqlalchemy import SQLAlchemy
from dataclasses import dataclass
from flask_restful import Api
from flask import Flask, jsonify, request, render_template, session
from flask_cors import CORS
from flask_session import Session

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

# Specify the CLIENT_ID of the app that accesses the backend:
CLIENT_ID = "YOUR_CLIENT_ID"
API_KEY = "YOUR_API_KEY"

# if the configuration file does not exist, create it
# read the client id from the file system
try:
    with open('./configuration.json', 'r') as f:
        data = json.load(f)
        CLIENT_ID = data['client_id']
        API_KEY = data['api_key']
except:
    print("configuration file not found")
    # create the configuration file
    data = {'client_id': CLIENT_ID, 'api_key': API_KEY}
    with open('./configuration.json', 'w') as f:
        json.dump(data, f)


# start a webapi
app = Flask(__name__)
# enable CORS...only necessary for development
CORS(app, supports_credentials=True)


# use sessions to store the user id
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = 3600
Session(app)

# Either 'SQLALCHEMY_DATABASE_URI' or 'SQLALCHEMY_BINDS' must be set
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jbc.sqlite'

api = Api(app)
db = SQLAlchemy(app)


@app.route('/', methods=['GET', 'POST'])
def index_ux():
    return render_template('index.html')


@app.route('/collage.html', methods=['GET', 'POST'])
def collage_ux():
    if request.method == 'POST':

        # get the data from the form
        id = request.form['id']
        note = request.form['note']
        title = request.form['title']

        collage = Collage(id=id, note=note, title=title)
        return render_template('collage.html', collage=collage)
    return render_template('collage.html')


@dataclass
class Collage(db.Model):
    __tablename__ = "collages"

    id: str
    data: str
    clipPaths: str
    note: str
    title: str

    userid = db.Column(db.Text)
    id = db.Column(db.Text, primary_key=True)
    data = db.Column(db.Text)
    clipPaths = db.Column(db.Text)
    note = db.Column(db.Text)
    title = db.Column(db.Text)


@app.route('/collage/', methods=['GET'])
def collages():
    userid = session.get('userid')
    if userid is None:
        return jsonify({"error": "user not logged in"}), 401

    result = Collage.query.filter_by(userid=userid)

    # limit what is transmitted to just ids
    # result = [{"id": x.id, "title": x.title, "note": x.note} for x in result]
    result = [r.id for r in result]

    response = jsonify(result)
    return response


@app.route('/collage/<string:id>')
def getCollage(id):
    userid = session.get('userid')
    if userid is None:
        return jsonify({"error": "user not logged in"}), 401

    result = Collage.query.filter_by(userid=userid, id=id).first()

    if result is None:
        return jsonify({"error": "collage not found"}), 404

    data = result.data
    if data is not None:
        # parse the json data
        data = json.loads(data)
        # return the data
        result.data = data

    clipPaths = result.clipPaths
    if clipPaths is not None:
        # parse the json data
        clipPaths = json.loads(clipPaths)
        # return the data
        result.clipPaths = clipPaths

    return jsonify(result)


@app.route('/collage/', methods=['POST'])
def create_collage():
    userid = session.get('userid')
    if userid is None:
        return jsonify({"error": "user not logged in"}), 401

    requestData = request.get_json()
    id = requestData['id']
    note = requestData['note']
    title = requestData['title']
    data = requestData['data']

    if data is not None:
        data = json.dumps(data)

    clipPaths = requestData['clipPaths']

    if clipPaths is not None:
        clipPaths = json.dumps(clipPaths)

    collage = Collage(userid=userid, id=id, data=data,
                      clipPaths=clipPaths, note=note, title=title)

    match = Collage.query.filter_by(userid=userid, id=id).first()

    if match is None:
        db.session.add(collage)
        db.session.commit()
        return jsonify({"message": "collage created"}), 201
    else:
        match.clipPaths = clipPaths
        match.data = data
        match.note = note
        match.title = title
        # save changes
        db.session.merge(match)
        db.session.commit()
        return jsonify({"message": "collage updated"}), 200


@app.route('/client_id', methods=['GET'])
def getClientId():
    return jsonify({'client_id': CLIENT_ID})


# route with a single query parameter for the url
@app.route('/proxy/<path:url>', methods=['GET'])
def proxy(url):
    # decode twice, see https://github.com/pallets/flask/issues/900
    url = unquote(url)
    response = requests.get(url)
    # return the image
    return response.content, 200, {'Content-Type': 'image/jpeg'}


@app.route('/login', methods=['POST'])
def validateRequest():
    # Specify the CLIENT_ID of the app that accesses the backend:
    print(f"validateRequest")
    requestData = request.get_json()
    print(f"requestData: {requestData}")
    idtoken = requestData['credential']
    idinfo = id_token.verify_oauth2_token(
        idtoken, google_requests.Request(), CLIENT_ID, clock_skew_in_seconds=6000)
    print(f"idinfo: {idinfo}")
    if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
        raise ValueError('Wrong issuer.')
    # ID token is valid. Get the user's Google Account ID from the decoded token.
    userid = idinfo['sub']
    print(f"userid: {userid}")
    picture = idinfo['picture']
    email = idinfo['email']

    # save the userid in a server side session
    session['userid'] = userid

    # make the session work across cross-origin requests
    session.permanent = True

    # convert the picture, email, userid into a json object
    # and return it to the client
    return jsonify({'picture': picture, 'email': email, 'userid': userid, 'apiKey': API_KEY})


with app.app_context():
    db.create_all()

############################################
# waitress-serve --port=5500 --call 'server:create_app'
############################################


def create_app():
    return app


if __name__ == '__main__':
    # start the server
    create_app().run(debug=True, host='localhost', port=5000)
