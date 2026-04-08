
import requests
from bs4 import BeautifulSoup
import re
from cache_config import cache

@cache.memoize(timeout=1800)
def get_marine_forecast():
    print("RUNNING get_marine_forecast")
    url = "https://www.ndbc.noaa.gov/data/Forecasts/FZHW50.PHFO.html"
    try:
        # Fetch the HTML content
        response = requests.get(url)
        response.raise_for_status()

        # Parse HTML content
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Extract the plain text
        forecast_text = soup.get_text(separator="\n").strip()

        # Define the pattern to identify the sections to split on
        pattern = r"PHZ\d{3}-\d{6}"

        # Split the forecast text based on the pattern and filter out any empty strings
        sections = re.split(pattern, forecast_text)
        sections = [section.strip() for section in sections if section.strip()]

        return sections

    except requests.exceptions.RequestException as e:
        print("Error fetching the data:", e)
        return None
