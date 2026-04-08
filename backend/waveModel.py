import requests
import base64
from flask import jsonify
from cache_config import cache

# Shared headers for upstream requests
HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

# Function to fetch image for a given hour (hr)
@cache.memoize(timeout=1800)
def getWaveModel(loc, hr, mode):
    print(f"RUNNING getWaveModel {loc} {hr} {mode}")

    if hr == 0:
        hr_formatted = "00"
    else:
        hr_formatted = str(hr)

    url = f'http://www.stormsurfing.com/stormuser2/images/grib/{loc}_{mode}_{hr_formatted}hr.png'

    try:
        response = requests.get(url, headers=HEADERS, timeout=15)

        if response.status_code != 200:
            print(f"Error fetching image for hour {hr_formatted}: {response.status_code}")
            return None

        image_base64 = base64.b64encode(response.content).decode('utf-8')
        return image_base64

    except requests.exceptions.Timeout:
        print(f"Timeout fetching image for hour {hr_formatted}: {url}")
        return None

    except requests.exceptions.ConnectionError as e:
        print(f"Connection error fetching image for hour {hr_formatted}: {e}")
        return None

    except requests.exceptions.RequestException as e:
        print(f"Request exception fetching image for hour {hr_formatted}: {e}")
        return None

    except Exception as e:
        print(f"Unexpected error fetching image for hour {hr_formatted}: {e}")
        return None


def getWaveModelImages(loc, mode):
    print(f"RUNNING getWaveModelImages {loc} {mode}")

    images = []

    for hr in range(0, 186, 6):
        image_base64 = getWaveModel(loc, hr, mode)

        if image_base64:
            images.append(image_base64)

    return jsonify({'images': images})