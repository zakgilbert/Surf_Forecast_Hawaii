import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime, timedelta
from collections import defaultdict
import pytz
import statistics

def getHistogram(duration_hours, id):
    """Fetch wave data and return histogram, largest wave, and significant wave stats."""

    def fetch_data(url):
        print(f"Fetching: {url}")
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        pre_tag = soup.find('pre', text=lambda t: t and 'Time(UTC)' in t)
        text = pre_tag.get_text() if pre_tag else ""
        print("=== RAW DATA (first 500 chars) ===")
        print(text[:500])
        print("=== END RAW ===\n")
        return text

    def process_wave_data(data_text):
        lines = data_text.splitlines()
        lines = [line.strip() for line in lines if line.strip() and not line.startswith("Time(UTC)")]
        print(f"Total non-header lines: {len(lines)}")

        zero_crossings = []
        parsed_lines = []

        for line in lines:
            parts = line.split()
            if len(parts) >= 4:
                try:
                    time_str = parts[0]
                    v = int(parts[3])
                    timestamp = datetime.strptime(time_str, "%Y%m%d%H%M%S").replace(tzinfo=pytz.utc)
                    parsed_lines.append((timestamp, v))
                except ValueError:
                    print(f"Skipping line: {line}")
                    continue

        print(f"Parsed lines: {len(parsed_lines)}")
        if parsed_lines:
            print(f"First timestamp: {parsed_lines[0][0]}")
            print(f"Last timestamp:  {parsed_lines[-1][0]}")

        # Find zero-crossings
        for i in range(len(parsed_lines) - 1):
            _, v1 = parsed_lines[i]
            _, v2 = parsed_lines[i + 1]
            if (v1 <= 0 < v2) or (v1 >= 0 > v2):
                zero_crossings.append(i)

        print(f"Zero crossings found: {len(zero_crossings)}")

        wave_heights = []
        wave_periods = []

        for i in range(len(zero_crossings) - 1):
            start = zero_crossings[i]
            end = zero_crossings[i + 1]
            if end > start:
                crest = max(v for _, v in parsed_lines[start:end+1])
                trough = min(v for _, v in parsed_lines[start:end+1])
                wave_height_cm = abs(crest - trough)
                wave_height_ft = wave_height_cm * 0.0328084
                wave_heights.append(wave_height_ft)

                # Period
                t_start = parsed_lines[start][0]
                t_end = parsed_lines[end][0]
                period_sec = (t_end - t_start).total_seconds()
                wave_periods.append(period_sec)

        print(f"Total waves calculated: {len(wave_heights)}")
        if wave_heights:
            print(f"First 5 wave heights (ft): {[round(h, 2) for h in wave_heights[:5]]}")

        if parsed_lines:
            return wave_heights, wave_periods, parsed_lines[0][0], parsed_lines[-1][0]
        else:
            return [], [], None, None

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
        url = f'https://cdip.ucsd.edu/themes/cdip?d2=p70&pb=1&tz=HST&ll=1&un=1&u2=s:{id}:v:wave_histogram:st:1:max_frq:0.33:dt:{dt}:t:data'
        urls.append(url)

    # Fetch and combine all data
    data_text = ""
    for url in urls:
        data_text += fetch_data(url)

    # Process wave heights and get timestamps
    wave_heights, wave_periods, data_start, data_end = process_wave_data(data_text)

    # Histogram
    histogram = defaultdict(int)
    for h in wave_heights:
        bin_start = int(h // 1)
        bin_label = f"{bin_start}–{bin_start + 1}ft"
        histogram[bin_label] += 1

    # Significant Wave Height (average of top 1/3)
    sorted_heights = sorted(wave_heights)
    n = len(sorted_heights)
    top_third_heights = sorted_heights[-n//3:] if n else []
    sig_wave_height = round(statistics.mean(top_third_heights), 2) if top_third_heights else None

    # Significant Period (average of durations of top 1/3 waves)
    top_indices = sorted(range(n), key=lambda i: wave_heights[i])[-n//3:] if n else []
    top_periods = [wave_periods[i] for i in top_indices]
    sig_period = round(statistics.mean(top_periods), 2) if top_periods else None

    print("\n=== HISTOGRAM ===")
    for k in sorted(histogram):
        print(f"{k}: {histogram[k]}")
    print("=================\n")

    # Format times
    if data_start and data_end:
        start_utc = data_start.isoformat()
        end_utc = data_end.isoformat()
        start_hst_str = data_start.astimezone(hawaii).strftime("%B %d, %Y %I:%M %p HST")
        end_hst_str = data_end.astimezone(hawaii).strftime("%B %d, %Y %I:%M %p HST")
    else:
        start_utc = end_utc = None
        start_hst_str = end_hst_str = "N/A"

    return json.dumps({
        "histogram": dict(histogram),
        "waveCount": n,
        "largestWave": round(max(wave_heights), 2) if wave_heights else None,
        "significantHeight": sig_wave_height,
        "significantPeriod": sig_period,
        "startUTC": start_utc,
        "endUTC": end_utc,
        "startHST": start_hst_str,
        "endHST": end_hst_str
    }, indent=2)

# Run if called directly
if __name__ == "__main__":
    print(getHistogram(0, 202))
