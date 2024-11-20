import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime, timedelta

def getHistogram(duration_hours=1):
    """Fetch wave data for the past 'duration_hours' (default: 5 hours), process it, and return structured JSON."""
    
    def fetch_data(url):
        """Fetch and extract raw data from the provided URL."""
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        pre_tag = soup.find('pre', text=lambda t: t and 'Time(UTC)' in t)
        return pre_tag.get_text() if pre_tag else ""

    def process_wave_data(data_text):
        """Process wave data to calculate wave heights using the crest-to-trough method."""
        # Split the data into lines and clean up
        lines = data_text.splitlines()
        lines = [line.strip() for line in lines if line.strip() and not line.startswith("Time(UTC)")]

        wave_data = []
        zero_crossings = []
        all_data = []

        # Collect all raw data with heights in feet
        for line in lines:
            parts = line.split()
            if len(parts) == 4:
                try:
                    time, _, _, V = parts
                    V = int(V)
                    wave_height_ft = abs(V) * 0.0328084  # Convert cm to feet
                    all_data.append({"time": time, "height": wave_height_ft})
                except ValueError:
                    continue

        # Identify zero up-crossings based on vertical (V) component
        for i in range(len(lines) - 1):
            current_line = lines[i].split()
            next_line = lines[i + 1].split()

            if len(current_line) == 4 and len(next_line) == 4:
                try:
                    current_time, _, _, V1 = current_line
                    next_time, _, _, V2 = next_line
                    V1, V2 = int(V1), int(V2)

                    # Detect a zero up-crossing
                    if V1 <= 0 < V2:
                        zero_crossings.append((current_time, V1))
                except ValueError:
                    continue

        # Calculate wave heights from crest-to-trough differences
        for i in range(len(zero_crossings) - 1):
            start_time, _ = zero_crossings[i]
            end_time, _ = zero_crossings[i + 1]

            # Extract the crest (maximum) and trough (minimum) in this range
            crest, trough = None, None
            for line in lines:
                parts = line.split()
                if len(parts) == 4:
                    time, _, _, V = parts
                    try:
                        V = int(V)
                        if start_time <= time <= end_time:
                            crest = max(crest, V) if crest is not None else V
                            trough = min(trough, V) if trough is not None else V
                    except ValueError:
                        continue

            # Calculate wave height (crest-to-trough difference)
            if crest is not None and trough is not None:
                wave_height_cm = abs(crest - trough)
                wave_height_ft = wave_height_cm * 0.0328084
                wave_data.append({
                    "start_time": start_time,
                    "end_time": end_time,
                    "wave_height_ft": wave_height_ft
                })

        return wave_data, all_data

    # Generate the list of URLs for the past 'duration_hours' in 30-minute intervals
    urls = []
    current_time_obj = datetime.utcnow()
    start_time_obj = current_time_obj - timedelta(hours=duration_hours)

    while start_time_obj < current_time_obj:
        dt_param = start_time_obj.strftime("%Y%m%d%H%M")
        url = f"https://cdip.ucsd.edu/themes/cdip?d2=p70&pb=1&tz=HST&ll=1&un=1&u2=s:202:v:wave_histogram:st:1:max_frq:0.33:dt:{dt_param}:t:data"
        urls.append(url)
        start_time_obj += timedelta(minutes=30)

    # Fetch and combine data from all generated URLs
    combined_data_text = ""
    for url in urls:
        combined_data_text += fetch_data(url)

    # Process the combined data using the crest-to-trough method
    waves, all_data = process_wave_data(combined_data_text)

    # Construct the final JSON structure
    result = {
        "waves": waves,
        "allData": all_data
    }

    return json.dumps(result, indent=2)
