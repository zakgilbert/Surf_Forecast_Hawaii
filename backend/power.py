import requests
import pandas as pd
import json
from BuoyReading import *
from util import *
import datetime
from io import StringIO

def getSwellPower(id):
    url = f'https://www.ndbc.noaa.gov/data/5day2/{id}_5day.spectral'

    response = requests.get(url)

    if response.status_code == 200:
        # Split data by lines
        lines = response.text.strip().splitlines()

        # Initialize containers for datetime and energy values
        data_dict = {}
        current_datetime = None

        # Iterate over lines to find datetimes and energy values
        for line in lines:
            parts = line.split()
    
            # Check if the line is a datetime (based on its length and format)
            if len(parts) == 6 and parts[0].isdigit():
                # Concatenate date and time parts to use as dictionary key
                current_datetime = f"{parts[0]}-{parts[1]}-{parts[2]} {parts[3]}:{parts[4]}"
                data_dict[current_datetime] = []  # Initialize list for this datetime
            elif current_datetime and len(parts) >= 3:  # Data line with energy value
                try:
                    # Append the energy value to the current datetime list
                    energy_value = float(parts[2])
                    data_dict[current_datetime].append(energy_value)
                except ValueError:
                    continue  # Skip lines that don't match expected format

        # Create an array of objects with only the highest energy value per datetime
        output_data = []
        for dt, energies in data_dict.items():
            if energies:  # Only proceed if there are energy values
                max_energy = max(energies)
                output_data.append({"dataTime": dt, "value": max_energy})
        
        # Convert to JSON
        json_output = json.dumps(output_data, indent=4)
        return json_output
    else:
        return [f'Error: {response.status_code}']

    
##getSwellPower('51001')