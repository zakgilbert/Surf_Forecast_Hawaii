import requests
import pandas as pd
from BuoyReading import *
from util import *
import datetime

def getReport(id):

    url = f'https://www.ndbc.noaa.gov/data/realtime2/{id}.spec'  # Replace with the URL of the file you want to download

    response = requests.get(url)

    toolTips = [
        "Curent Time",
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

    if response.status_code == 200:
        reports = response.text.splitlines()
        cols = reports[0].split()
        rows = []
        columns = []
        del reports[:2]
        for report in reports:
            row = report.split()
            
            row[cols.index('WVHT')] = meters_feet(row[cols.index('WVHT')])
            row[cols.index('SwH')] = meters_feet(row[cols.index('SwH')])
            row[cols.index('WWH')] = meters_feet(row[cols.index('WWH')])

            d = datetime.datetime(int(row[cols.index('#YY')]),
                                  int(row[cols.index('MM')]), 
                                  int(row[cols.index('DD')]), 
                                  int(row[cols.index('hh')]),
                                  int(row[cols.index('mm')]))
            
            d_to_hawaii_time = hawaii_12_hour(d)
            del row[:5]
            row.insert(0, d_to_hawaii_time)
            rows.append(row)

        del cols[:5]
        cols.insert(0, 'Time')

        for col, toolTip in zip(cols, toolTips):
            c = {
                'value': col,
                'toolTip': toolTip
            }
            columns.append(c)
        return {
            "cols": columns,
            "rows": rows
        }

    else:
        return [f'Error: {response.status_code}']
