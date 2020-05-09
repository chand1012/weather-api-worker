var fetch = require('node-fetch')

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
      return new Response(returnData, {
        status: 200,
      })
    } else {
      // reject it
      return new Response('Bad Request', {
        status: 400,
      })
    }
  }
}

async function getWeatherData(data) {
  const getForecastURL = 'https://api.weather.gov/points/' + data.lat+ ',' + data.lng;
  let latlngResp = await fetch(getForecastURL, {method: 'GET'});
  const forecastURL = await latlngResp.text();
  console.log(forecastURL);
  return forecastURL;
  // let forecastResp = await fetch(forecastURL);
  // return forecastResp.json();
}
