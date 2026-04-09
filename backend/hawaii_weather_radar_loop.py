import requests
import base64
from flask import jsonify
from cache_config import cache

@cache.memoize(timeout=1800)
def getHawaiiWeatherRadarRendering(id):
    print(f"RUNNING getHawaiiWeatherRadarRendering {id}")
    url = f'https://radar.weather.gov/ridge/standard/{id}_loop.gif'
    print(url)
    response = requests.get(url)

    if response.status_code != 200:
        print(f"Error Fetching image: {response.status_code}")
        return None
    
    image_base64 = base64.b64encode(response.content).decode('utf-8')
    return jsonify({'image': image_base64})


if __name__ == "__main__":
    print(getHawaiiWeatherRadarRendering("tpw").status_code)