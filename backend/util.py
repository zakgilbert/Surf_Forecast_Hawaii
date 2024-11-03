import pytz

def meters_feet(meter):
    return round(float(meter) * 3.281, 1 )

def hawaii_12_hour(d):
    return d.replace(tzinfo=pytz.UTC).astimezone(pytz.timezone("Pacific/Honolulu")).strftime("%Y-%m-%d %I:%M %p")
