const fetch = require('node-fetch')
const DEFAULT_HEADERS = {'Accept-Encoding': 'gzip, deflate', 'Accept': '*/*', 'Connection': 'keep-alive', 'User-Agent': 'node-fetch'};


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'POST') {
    const { headers } = request
    const body = await request.json()
    const contentType = headers.get('content-type')
    if (contentType === null) {
      return new Response('Bad Request', {
        status: 400,
      })
    }
    if (contentType.includes('application/json')) {
      let returnData = await getWeatherData(body)
      return new Response(JSON.stringify(returnData), {
        status: 200,
      })
    } else {
      return new Response('Bad Request', {
        status: 400,
      })
    }
  }
}

async function getWeatherData(data) {
  const getForecastURL = 'https://api.weather.gov/points/' + data.lat+ ',' + data.lng;
  // console.log(getForecastURL);
  let latlngResp = await fetch(getForecastURL, {method: 'GET', headers: DEFAULT_HEADERS});
  const forecastNode = await latlngResp.json();
  const forecastURL = forecastNode.properties.forecast;
  // console.log(forecastURL);
  let forecastResp = await fetch(forecastURL, {method: 'GET', headers: DEFAULT_HEADERS});
  let returnForecast = await forecastResp.json();
  return returnForecast;
}