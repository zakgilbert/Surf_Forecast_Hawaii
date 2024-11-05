import requests
import json
from datetime import datetime, timedelta
import pytz  # Import pytz for timezone conversions

def getSwellPower(id):
    url = f'https://www.ndbc.noaa.gov/data/5day2/{id}_5day.spectral'

    response = requests.get(url)

    if response.status_code == 200:
        # Split data by lines
        lines = response.text.strip().splitlines()

        # Initialize containers for datetime and energy values
        data_dict = {}
        current_datetime = None

        # Define the timezone for Hawaii
        hawaii_tz = pytz.timezone("Pacific/Honolulu")

        # Get the current time in Hawaii
        current_hawaii_time = datetime.now(hawaii_tz)

        # Calculate the cutoff time for two days ago
        cutoff_time = current_hawaii_time - timedelta(days=2)

        # Iterate over lines to find datetimes and energy values
        for line in lines:
            parts = line.split()
            
            # Check if the line is a datetime (based on its length and format)
            if len(parts) == 6 and parts[0].isdigit():
                # Concatenate date and time parts to create a datetime string
                datetime_str = f"{parts[0]}-{parts[1]}-{parts[2]} {parts[3]}:{parts[4]}"
                
                # Parse the datetime string and convert to UTC
                dt_utc = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M").replace(tzinfo=pytz.UTC)
                
                # Convert to Hawaii time
                dt_hawaii = dt_utc.astimezone(hawaii_tz)
                
                # Check if the datetime in Hawaii is within the last two days
                if dt_hawaii >= cutoff_time:
                    # Format the datetime in 12-hour format
                    formatted_hawaii_time = dt_hawaii.strftime("%Y-%m-%d %I:%M %p")

                    # Initialize list for this datetime in Hawaii time format
                    data_dict[formatted_hawaii_time] = []  # Ensure it's initialized to a list
                    current_datetime = formatted_hawaii_time  # Update current_datetime to the new one

            elif current_datetime and len(parts) >= 3:  # Data line with energy value
                try:
                    # Append the energy value to the current datetime list
                    energy_value = float(parts[2])
                    data_dict[current_datetime].append(energy_value)  # Use the formatted Hawaii time as the key

                except ValueError:
                    print(f"ValueError: Could not convert energy value from line: {line}")  # Debugging
                    continue  # Skip lines that don't match expected format

        # Create an array of objects with only the highest energy value per datetime
        output_data = []
        for dt_hawaii, energies in data_dict.items():
            if energies:  # Only proceed if there are energy values
                max_energy = max(energies)
                output_data.append({"dataTime": dt_hawaii, "value": max_energy})

        # Convert to JSON
        json_output = json.dumps(output_data, indent=4)
        print(json_output)
        return json_output
    else:
        return [f'Error: {response.status_code}']