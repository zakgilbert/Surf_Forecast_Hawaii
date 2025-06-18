from report import *
from power import *
from forecast import *
from tide import *
from marine_forecast import *
from waveModel import *
from histogram import *
import time
import argparse

app = Flask(__name__)

@app.route('/report/<string:id>')
def report(id):
    return getReport(id)

@app.route('/power/<string:id>')
def power(id):
    return getSwellPower(id)

@app.route('/forecast/<string:id>')
def forecast(id):
    return getForecast(id)

@app.route('/marine-forecast')
def marineForecast():
    return get_marine_forecast()

@app.route('/tide/<string:id>/<string:begin_date>/<string:end_date>/<string:time_zone>')
def tide(id, begin_date,end_date,time_zone):
    return getTide(id, begin_date,end_date,time_zone)

@app.route('/histogram')
def histogram():
    return getHistogram()
    

@app.route('/wave-model/<string:id>/<string:mode>')
def waveModel(id, mode):
    return getWaveModelImages(id, mode)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", "-p", type=int, default=5000, help="Port to run server on")
    args = parser.parse_args()
    app.run(host="0.0.0.0", port=args.port)  # Change the port to 5001

    

  