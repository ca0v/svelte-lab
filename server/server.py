import json
from flask_sqlalchemy import SQLAlchemy
from dataclasses import dataclass
from flask_restful import Api
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS

# start a webapi
app = Flask(__name__)

# fix Access to fetch at 'http://localhost:5000/collage' from origin 'http://localhost:5174' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
CORS(app)

# Response to preflight request doesn't pass access control check: Redirect is not allowed for a preflight request.
app.config['CORS_SUPPORTS_CREDENTIALS'] = True


# Flask-WTF requires an encryption key - the string can be anything
app.config['SECRET_KEY'] = "fdd89hf3809fdjkhidf409ruvn-0q325873-4 hfg"

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
        db.session.add(collage)
        db.session.commit()
    return render_template('collage.html')


@dataclass
class Collage(db.Model):
    __tablename__ = "collages"

    id: str
    data: str
    note: str
    title: str

    id = db.Column(db.Text, primary_key=True)
    data = db.Column(db.Text)
    note = db.Column(db.Text)
    title = db.Column(db.Text)


@ app.route('/collage/', methods=['GET'])
def collages():
    result = Collage.query.all()
    # limit what is transmitted to just ids
    # result = [{"id": x.id, "title": x.title, "note": x.note} for x in result]
    result = [r.id for r in result]

    response = jsonify(result)
    return response


@ app.route('/collage/<string:id>')
def getCollage(id):
    result = Collage.query.filter_by(id=id).first()

    data = result.data
    if data is not None:
        # parse the json data
        data = json.loads(data)
        # return the data
        result.data = data

    if result is None:
        return jsonify({"error": "collage not found"}), 404

    return jsonify(result)


@ app.route('/collage/', methods=['POST'])
def create_collage():
    requestData = request.get_json()
    id = requestData['id']
    note = requestData['note']
    title = requestData['title']
    data = json.dumps(requestData['data'])

    collage = Collage(id=id, data=data, note=note, title=title)

    match = Collage.query.filter_by(id=id).first()

    if match is None:
        db.session.add(collage)
        db.session.commit()
        return jsonify({"message": "collage created"}), 201
    else:
        match.data = data
        match.note = note
        match.title = title
        # save changes
        db.session.merge(match)
        db.session.commit()
        return jsonify({"message": "collage updated"}), 200


with app.app_context():
    db.create_all()

# start the server
app.run(debug=True, host='localhost', port=5000)
