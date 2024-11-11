import requests

def split_forecast_to_objects(text):
    # Split the text based on the delimiter '$$'
    segments = text.split("$$")
    
    # Initialize the list to hold forecast objects
    forecast_objects = []
    
    # Handle splitting of segment 1 around the word "Kauai"
    if len(segments) > 1:
        segment_1 = segments[1].split("Kauai", 1)  # Split only on the first occurrence of "Kauai"
        if len(segment_1) > 1:
            # Create two segments based on "Kauai"
            forecast_objects = [segment_1[0].strip(), "Kauai" + segment_1[1].strip()]
        else:
            forecast_objects = [segments[1].strip()]  # If "Kauai" isn't found, just use the full segment
    
    # Process the remaining segments, skipping the first one
    for segment in segments[2:]:
        if segment.strip():
            forecast_objects.append(segment.strip())
    
    # Remove everything before "Surf Zone Forecast for Hawaii" in the first forecast object
    if len(forecast_objects) > 0:
        srfhfo_index = forecast_objects[0].find("Surf Zone Forecast for Hawaii")
        if srfhfo_index != -1:
            forecast_objects[0] = forecast_objects[0][srfhfo_index:].strip()
    
    return forecast_objects


def getForecast(id):
    # Convert the id to an integer
    try:
        id = int(id)
    except ValueError:
        return {"error": "Invalid id, must be an integer."}
    
    url = f'https://www.weather.gov/source/hfo/xml/SurfState.xml'
    response = requests.get(url)
    
    if response.status_code != 200:
        return {"error": f"Error: {response.status_code}"}
    
    forecast_objects = split_forecast_to_objects(response.text)
    
    # Check if the id is within range of the forecast_objects list
    if 0 <= id < len(forecast_objects):
        # Return the requested forecast segment as a dictionary
        return {"forecast": forecast_objects[id]}
    else:
        return {"error": f"Invalid id {id}. Valid range is from 0 to {len(forecast_objects) - 1}."}
