import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime, timedelta
from collections import defaultdict
import pytz

def getHistogram(duration_hours=0):
    """Fetch wave data and return a histogram of 1-ft wave height bins (e.g., 0–1 ft, 1–2 ft, ...)."""

    def fetch_data(url):
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        pre_tag = soup.find('pre', text=lambda t: t and 'Time(UTC)' in t)
        return pre_tag.get_text() if pre_tag else ""

    def process_wave_data(data_text):
        lines = data_text.splitlines()
        lines = [line.strip() for line in lines if line.strip() and not line.startswith("Time(UTC)")]

        zero_crossings = []
        parsed_lines = []

        for line in lines:
            parts = line.split()
            if len(parts) == 4:
                try:
                    time, _, _, v = parts
                    v = int(v)
                    parsed_lines.append((time, v))
                except ValueError:
                    continue

        for i in range(len(parsed_lines) - 1):
            t1, v1 = parsed_lines[i]
            t2, v2 = parsed_lines[i + 1]
            if v1 <= 0 < v2:
                zero_crossings.append(i)

        wave_heights = []

        for i in range(len(zero_crossings) - 1):
            start = zero_crossings[i]
            end = zero_crossings[i + 1]
            if end > start:
                crest = max(v for _, v in parsed_lines[start:end+1])
                trough = min(v for _, v in parsed_lines[start:end+1])
                wave_height_cm = abs(crest - trough)
                wave_height_ft = wave_height_cm * 0.0328084  # Convert cm to ft
                wave_heights.append(wave_height_ft)

        return wave_heights

    # Use Hawaii time
    hawaii = pytz.timezone("Pacific/Honolulu")
    now = datetime.now(hawaii)

    # Determine time range
    if duration_hours == 0:
        start = now - timedelta(minutes=30)
        intervals = [start]
    else:
        start = now - timedelta(hours=duration_hours)
        intervals = []
        while start < now:
            intervals.append(start)
            start += timedelta(minutes=30)

    # Build URLs
    urls = []
    for dt_time in intervals:
        dt = dt_time.strftime("%Y%m%d%H%M")
        url = f"https://cdip.ucsd.edu/themes/cdip?d2=p70&pb=1&tz=HST&ll=1&un=1&u2=s:202:v:wave_histogram:st:1:max_frq:0.33:dt:{dt}:t:data"
        urls.append(url)

    # Fetch and combine data
    data_text = ""
    for url in urls:
        data_text += fetch_data(url)

    # Process wave heights
    wave_heights = process_wave_data(data_text)

    # Build histogram with bin ranges like "2–3ft"
    histogram = defaultdict(int)
    for h in wave_heights:
        bin_start = int(h // 1)
        bin_label = f"{bin_start}–{bin_start + 1}ft"
        histogram[bin_label] += 1

    return json.dumps({"histogram": dict(histogram)}, indent=2)

# Debug output
if __name__ == "__main__":
    print(getHistogram(0))  # Call with 0 to test 30-minute fetch
