import requests
import base64
from flask import jsonify

def getHurricaneRendering(mode, width, height):
    print(mode)
    url = f'https://cdn.star.nesdis.noaa.gov/GOES18/ABI/SECTOR/{mode}/GEOCOLOR/GOES18-{mode.upper()}-GEOCOLOR-{width}x{height}.gif'
    print(url)
    response = requests.get(url)

    if response.status_code != 200:
        print(f"Error Fetching image: {response.status_code}")
        return None
    
    image_base64 = base64.b64encode(response.content).decode('utf-8')
    return jsonify({'image': image_base64})


if __name__ == "__main__":
    print(getHurricaneRendering("tpw").status_code)