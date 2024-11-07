import json
import requests

def split_forecast_to_objects(text):
    # Split the text based on the delimiter '$$'
    segments = text.split("$$")
    
    # Process each segment into a dictionary, excluding empty segments
    forecast_objects = [
        {
            "segment_number": i + 1,
            "forecast_text": segment.strip()
        }
        for i, segment in enumerate(segments) if segment.strip()
    ]
    
    return forecast_objects


def getForecast():
   url = f'https://www.weather.gov/source/hfo/xml/SurfState.xml'
   response = requests.get(url)
   return split_forecast_to_objects(response.text)


