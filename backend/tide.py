import requests

def getTide(begin_date, end_date, station, time_zone):
   # url = f'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&begin_date={begin_date}&end_date={end_date}&datum=MLLW&station={station}&time_zone={time_zone}&units=english&interval=hilo&format=json'
   # url = f'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&begin_date=20241106&end_date=20241107&datum=MLLW&station=1611683&time_zone=LST&units=english&interval=hilo&format=json'
   url = f'https://forecast.weather.gov/product.php?site=HFO&issuedby=HFO&product=SRF&format=TXT&version=1&glossary=0'
   response = requests.get(url)
   print (response.text)
   return response

getTide('20241106','20241107', '1611683', 'LST')
