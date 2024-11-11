from flask import Flask
from report import *
from power import *
from forecast import *
from tide import *
from marine_forecast import *
from waveModel import *
import time

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

@app.route('/wave-model/<string:id>')
def waveModel(id):
    images = []
    # Loop over hours from 0 to 180 in 6-hour increments
    for hr in range(0, 186, 6):
        image_base64 = getWaveModel(id, hr)
        
        if image_base64:  # Only append if the image was fetched successfully
            images.append(image_base64)
        
        # Optionally, you can add a delay between requests (e.g., 1 second)
    return jsonify({'images': images})

if __name__ == "__main__":
    app.run(debug=True)
    
    
url = f'http://www.stormsurfing.com/stormuser2/images/grib/npac_per_54hr.png'