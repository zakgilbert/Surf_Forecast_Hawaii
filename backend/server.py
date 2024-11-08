from flask import Flask
from report import *
from power import *
from forecast import *
from tide import *

app = Flask(__name__)

@app.route('/report/<string:id>')
def report(id):
    return getReport(id)

@app.route('/power/<string:id>')
def power(id):
    return getSwellPower(id)

@app.route('/forecast')
def forecast():
    return getForecast()

@app.route('/tide/<string:id>/<string:begin_date>/<string:end_date>/<string:time_zone>')
def tide(id, begin_date,end_date,time_zone):
    return getTide(id, begin_date,end_date,time_zone)

if __name__ == "__main__":
    app.run(debug=True)