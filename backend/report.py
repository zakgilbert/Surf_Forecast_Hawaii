import requests
import pandas as pd
from BuoyReading import *
from util import *
from datetime import datetime, timedelta

def getReport(id):
    url = f'https://www.ndbc.noaa.gov/data/realtime2/{id}.spec'  # Replace with the URL of the file you want to download
    print("--------------------------------------")
    print(url)
    print("--------------------------------------")

    response = requests.get(url)
    toolTips = [
        "Current Time",
        "Wave Height",
        "Swell Height",
        "Swell Period",
        "Wind Wave Height",
        "Wind Wave Period",
        "Swell Direction",
        "Wind Wave Direction",
        "Wave Steepness",
        "Average Wave Period",
        "Mean Wave Direction"
    ]

    if response.status_code != 200:
        return [f'Error: {response.status_code}']

    reports = response.text.splitlines()
    cols = reports[0].split()
    rows = []
    columns = []
    # Skip all comment lines starting with '#'
    reports = [line for line in reports if not line.startswith('#')]


    # Define the time window of interest (last 48 hours)
    cutoff_time = datetime.utcnow() - timedelta(days=2)

    print(reports)
    for report in reports:
        row = report.split()
       
        # TODO: NOAA uses 'MM' as a placeholder for some kind of error in the data, have to look into it more. 
        if 'MM' in row:
            # print(f"Skipping row due to 'MM' value: {row}")
            continue

        row[cols.index('WVHT')] = meters_feet(row[cols.index('WVHT')])
        row[cols.index('SwH')] = meters_feet(row[cols.index('SwH')])
        row[cols.index('WWH')] = meters_feet(row[cols.index('WWH')])

        # Parse the date and time of the report
        report_time = datetime(
            int(row[cols.index('#YY')]),
            int(row[cols.index('MM')]), 
            int(row[cols.index('DD')]), 
            int(row[cols.index('hh')]),
            int(row[cols.index('mm')])
        )

        # Filter rows based on the cutoff time
        if report_time >= cutoff_time:
            d_to_hawaii_time = hawaii_12_hour(report_time)
            del row[:5]
            row.insert(0, d_to_hawaii_time)
            rows.append(row)

    del cols[:5]
    cols.insert(0, 'Time')

    for col, toolTip in zip(cols, toolTips):
        columns.append({'value': col, 'toolTip': toolTip})

    return {
        "cols": columns,
        "rows": rows
    }