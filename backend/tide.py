import requests
from flask import jsonify
from collections import defaultdict
from datetime import datetime
from cache_config import cache

@cache.memoize(timeout=21600)
def getTide(station_id, begin_date, end_date, time_zone):
    print(f"RUNNING getTide {id} {begin_date} {end_date} {time_zone}")
    url = f'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&begin_date={begin_date}&end_date={end_date}&datum=MLLW&station={station_id}&time_zone={time_zone}&units=english&interval=hilo&format=json'
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"error": "Failed to retrieve data"}), response.status_code

    data = response.json()

    # Group predictions by date
    predictions_by_day = defaultdict(list)
    for prediction in data.get('predictions', []):
        date_str = prediction['t']
        date_only = datetime.strptime(date_str, "%Y-%m-%d %H:%M").date()
        predictions_by_day[str(date_only)].append(prediction)

    # Convert defaultdict to a regular dictionary
    grouped_data = dict(predictions_by_day)

    return jsonify(grouped_data)
