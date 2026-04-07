from flask import Flask, Blueprint
from report import *
from power import *
from forecast import *
from tide import *
from marine_forecast import *
from waveModel import *
from histogram import *
from hurricane import *
import argparse

app = Flask(__name__)
api = Blueprint('api', __name__, url_prefix='/api')

@api.route('/report/<string:id>')
def report(id):
    return getReport(id)

@api.route('/power/<string:id>')
def power(id):
    return getSwellPower(id)

@api.route('/forecast/<string:id>')
def forecast(id):
    return getForecast(id)

@api.route('/marine-forecast')
def marineForecast():
    return get_marine_forecast()

@api.route('/tide/<string:id>/<string:begin_date>/<string:end_date>/<string:time_zone>')
def tide(id, begin_date, end_date, time_zone):
    return getTide(id, begin_date, end_date, time_zone)

@api.route('/histogram/<string:id>')
def histogram(id):
    return getHistogram(0, id)

@api.route('/wave-model/<string:id>/<string:mode>')
def waveModel(id, mode):
    return getWaveModelImages(id, mode)

@api.route('/hurricane/<string:mode>/<string:width>/<string:height>')
def hurricane(mode, width, height):
    return getHurricaneRendering(mode, width, height)

app.register_blueprint(api)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", "-p", type=int, default=5000, help="Port to run server on")
    args = parser.parse_args()
    app.run(host="0.0.0.0", port=args.port)    

  