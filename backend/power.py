import requests
import json
import pytz
from datetime import datetime, timedelta

def getSwellPower(id):
    url = f'https://www.ndbc.noaa.gov/data/5day2/{id}_5day.spectral'
    response = requests.get(url)

    if response.status_code == 200:
        # Split data by lines
        lines = response.text.strip().splitlines()

        # Initialize containers for datetime, energy values, and frequencies
        data_dict = {}
        current_datetime = None

        # Define the timezone for Hawaii
        hawaii_tz = pytz.timezone("Pacific/Honolulu")

        # Get the current time in Hawaii
        current_hawaii_time = datetime.now(hawaii_tz)

        # Calculate the cutoff time for two days ago
        cutoff_time = current_hawaii_time - timedelta(days=2)

        # Iterate over lines to find datetimes, energy values, and frequencies
        for line in lines:
            parts = line.split()
            
            # Check if the line is a datetime (based on its length and format)
            if len(parts) == 6 and parts[0].isdigit():
                datetime_str = f"{parts[0]}-{parts[1]}-{parts[2]} {parts[3]}:{parts[4]}"
                dt_utc = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M").replace(tzinfo=pytz.UTC)
                dt_hawaii = dt_utc.astimezone(hawaii_tz)

                # Check if the datetime in Hawaii is within the last two days
                if dt_hawaii >= cutoff_time:
                    formatted_hawaii_time = dt_hawaii.strftime("%Y-%m-%d %I:%M %p")
                    data_dict[formatted_hawaii_time] = []
                    current_datetime = formatted_hawaii_time
                    print(f"Parsed datetime: {formatted_hawaii_time}")  # Debugging output

            elif current_datetime and len(parts) >= 3:  # Data line with frequency and energy
                try:
                    # Extract frequency (first column) and energy (third column)
                    frequency = float(parts[0])
                    energy_value = float(parts[2])
                    cord1 = int(parts[5])
                    cord2 = int(parts[5])

                    # Append a dictionary with frequency and energy to the current datetime's list
                    data_dict[current_datetime].append({
                        "frequency": frequency,
                        "energy": energy_value,
                        "cord1": cord1,
                        "cord2": cord2,
                    })

                except ValueError:
                    print(f"ValueError: Could not convert values from line: {line}")
                    continue  # Skip lines that don't match expected format

        # Create an array of objects with only the highest energy value per datetime
        output_data = []
        for dt_hawaii, values in data_dict.items():
            if values:  # Only proceed if there are values
                max_energy_data = max(values, key=lambda x: x["energy"])  # Find entry with max energy
                max_energy = max_energy_data["energy"]
                frequency_of_max_energy = max_energy_data["frequency"]

                # Add data to the output
                output_data.append({
                    "dataTime": dt_hawaii,
                    "value": max_energy,
                    "frequency": frequency_of_max_energy,
                    "values": values
                })

        # Convert to JSON
        json_output = json.dumps(output_data, indent=4)
        print(json_output)
        return json_output
    else:
        return [f'Error: {response.status_code}']

