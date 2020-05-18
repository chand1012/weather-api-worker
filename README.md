# Weather Worker

This was a simple project meant for me to teach myself how to use a serverless system, in this case [Cloudflare Workers](https://workers.cloudflare.com/). This acts as middle ware for `https://api.weather.gov/`, so it will only work for the US and its territories.

# To use

Simply submit a `POST` request to the url at `https://weather-api.chand1012.workers.dev/`. Here is a cURL example:

`curl -XPOST -H "Content-type: application/json" -d '{"lat": 38.9, "lng": -77}' 'https://weather-api.chand1012.workers.dev'`

Python Example:

```Python
import requests

lat = 41
lng = -71

req = requests.post("https://weather-api.chand1012.workers.dev/", headers={'content-type':'application/json'}, json={'lat':lat, 'lng':lng})

print(req.json())
```

This will return the forecasts for the next 7 days for the given forecast. If you want a simple python class with functions to work with this, here is the snippet of code I use for my [Discord Weather Bot](https://github.com/chand1012/discord-weather-bot):

```Python
class WorkerWeatherSearch():
    def __init__(self):
        self.lat = 41.08
        self.lng = -81.51
        self.base_url = "https://weather-api.chand1012.workers.dev"
        self.json = None
        self.forecasts = []

    def search(self, lat, lng):
        self.lat = lat
        self.lng = lng
        req = requests.post(self.base_url, headers={'content-type':'application/json'}, json={'lat':lat, 'lng':lng})
        self.json = req.json()
        self.forecasts = self.json['properties']['periods']
        return self.json
```
