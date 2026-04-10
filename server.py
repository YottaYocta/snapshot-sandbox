from flask import Flask, send_from_directory, abort, make_response
from flask_cors import CORS
import os

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "https://app.paper.design"}})

@app.route('/')
def root():
    return send_from_directory("dist", "index.html")

@app.route('/<path:path>')
def serve(path):
    file_path = os.path.join("dist", path)

    if os.path.exists(file_path):
        response = make_response(send_from_directory("dist", path))
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Cross-Origin-Resource-Policy"] = "cross-origin"
        return response

    return abort(404)

app.run(port=8000, debug=True)
