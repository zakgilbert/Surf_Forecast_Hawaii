import requests
from flask import jsonify

def getTide(station_id, begin_date, end_date, time_zone):
    url = f'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&begin_date={begin_date}&end_date={end_date}&datum=MLLW&station={station_id}&time_zone={time_zone}&units=english&interval=hilo&format=json'
    response = requests.get(url)

    if response.status_code != 200:
       return jsonify({"error": "Failed to retrieve data"}), response.status_code

    data = response.json()
    return jsonify(data)

