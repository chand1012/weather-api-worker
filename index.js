const fetch = require('node-fetch')
const DEFAULT_HEADERS = {
  'Accept-Encoding': 'gzip, deflate',
  Accept: '*/*',
  Connection: 'keep-alive',
  'User-Agent': 'node-fetch',
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
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
        let returnData = null

        returnData = await getWeatherData(body)

        if (returnData !== null) {
          return new Response(JSON.stringify(returnData), {
            status: 200,
          })
        } else {
          return new Response('{}', {
            status: 500,
          })
        }
      } else {
        return new Response(JSON.stringify({ error: 'Bad Request' }), {
          status: 400,
        })
      }
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err || err.stack }), {
      status: 400,
    })
  }
}

async function getWeatherData(data) {
  const getForecastURL =
    'https://api.weather.gov/points/' + data.lat + ',' + data.lng
  let latlngResp = await fetch(getForecastURL, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
  })
  const forecastNode = await latlngResp.json()
  const forecastURL = forecastNode.properties.forecast
  let forecastResp = await fetch(forecastURL, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
  })
  let returnForecast = await forecastResp.json()
  return returnForecast
}
