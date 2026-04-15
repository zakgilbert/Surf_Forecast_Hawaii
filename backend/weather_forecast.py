
import requests
import re
from bs4 import BeautifulSoup
from cache_config import cache

@cache.memoize(timeout=1800)
def getWeatherForecast():
    print("RUNNING get_weather_forecast")
    url = "https://forecast.weather.gov/product.php?site=HFO&issuedby=HFO&product=ZFP&format=txt"
    try:
        response = requests.get(url)
        response.raise_for_status()

        # Extract content inside <pre>...</pre>
        match = re.search(r"<pre.*?>(.*?)</pre>", response.text, re.DOTALL)
        text = match.group(1) if match else response.text

        parts = text.split("$$")
        parts = [p.strip() for p in parts if p.strip()]

        return parts

    except requests.exceptions.RequestException as e:
        print("Error fetching the data:", e)
        return None
