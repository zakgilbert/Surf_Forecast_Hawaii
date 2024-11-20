import requests
import base64
from flask import Flask,jsonify

# Function to fetch image for a given hour (hr)
def getWaveModel(loc, hr, mode):
    # Only add a leading zero for hour 0, but not for other single-digit hours
    if hr == 0:
        hr_formatted = f"00"
    else:
        hr_formatted = str(hr)  # Remove leading zero for hours like 06, 12, etc.
    
    url = f'http://www.stormsurfing.com/stormuser2/images/grib/{loc}_{mode}_{hr_formatted}hr.png'
    response = requests.get(url)
    
    # If the image is not found, log and skip this image
    if response.status_code != 200:
        print(f"Error fetching image for hour {hr_formatted}: {response.status_code}")
        return None  # Return None if the image cannot be fetched
    
    # Convert image content to base64
    image_base64 = base64.b64encode(response.content).decode('utf-8')
    # print(f"Fetched image content for hour {hr_formatted}: {len(response.content)} bytes")
    
    return image_base64

def getWaveModelImages(id, mode):
    images = []
    # Loop over hours from 0 to 180 in 6-hour increments
    for hr in range(0, 186, 6):
        image_base64 = getWaveModel(id, hr, mode)
        
        if image_base64:  # Only append if the image was fetched successfully
            images.append(image_base64)
        
        # Optionally, you can add a delay between requests (e.g., 1 second)
    return jsonify({'images': images})