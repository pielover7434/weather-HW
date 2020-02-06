//
const apikey = '546a7ebb47d9c9dc0bc4048445447f40'

const city_list = []

const getDate = (int) => {
  return moment.unix(int).format('MM/DD/YYYY')
}
const iconURL = (icon_code) => {
  return `http://openweathermap.org/img/wn/${icon_code}@2x.png`
}
const getForecast = (id) => {
  $.get(`http://api.openweathermap.org/data/2.5/forecast?id=${id}&APPID=${apikey}`)
    .then((res) => {
      const forecastArr = res.list
      const day1 = forecastArr[5]
      const day2 = forecastArr[13]
      const day3 = forecastArr[21]
      const day4 = forecastArr[29]
      const day5 = forecastArr[37]
      const forecast = [day1, day2, day3, day4, day5]
      console.log(forecast)
      $('#forecast').html('')
      forecast.forEach((day) => {
        const cardDay = $('<div>')
        const date = getDate(day.dt)
        cardDay.addClass('col s12 m12')
        cardDay.html(`
                      <div class="card-panel">
                        <span class="">
                          <div class="row">
                            <div class="col s12 m3">
                              <h6>${date}</h6>
                            </div>
                            <div class="col s12 m3">
                              <h6>Temp: ${convertTemp(day.main.temp)}°F</h6>
                            </div>
                            <div class="col s12 m3">
                              <h6>Humidity: ${day.main.humidity}%</h6>
                            </div>
                            <div class="col s12 m3">
                              <img src="${iconURL(day.weather[0].icon)}" alt="${day.weather[0].main}" height="42" width="42">
                              <h6>${day.weather[0].main}</h6>
                            </div>
                          </div>
                        </span>
                      </div>
        `)
        $('#forecast').append(cardDay)
      })
    })
    .catch(error => console.error(error))
}

const getUV = (lon, lat) => {
  $.get(`http://api.openweathermap.org/data/2.5/uvi?appid=${apikey}&lat=${lat}&lon=${lon}`)
    .then((uvInfo) => {
      const UV = uvInfo.value
      let badge
      if (UV >= 0 && UV <= 2.99) {
        // low
        badge = `<span class="badge green white-text">${UV}</span>`
      } else if (UV >= 3 && UV <= 5.99) {
        // medium
        badge = `<span class="badge yellow white-text">${UV}</span>`
      } else if (UV >= 6 && UV <= 7.99) {
        // high
        badge = `<span class="badge orange white-text">${UV}</span>`
      } else if (UV >= 8 && UV <= 10.99) {
        // very high
        badge = `<span class="badge red white-text">${UV}</span>`
      } else if (UV >= 11) {
        // extremely high
        badge = `<span class="badge purple white-text">${UV}</span>`
      }
      $('#curUV').html(badge)
      console.log(UV)
    })
    .catch(error => console.error(error))
}

const renderList = () => {
  $('#listCities').html('')
  city_list.forEach((item) => {
    $('#listCities').append(`<a href="#!" id="${item}" class="collection-item">${item}</a>`)
  })
}

const getCurrentWeather = (city) => {
  $.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apikey}`)
    .then((weatherInfo) => {
      console.log(weatherInfo)
      $('#icon').html(`<img src="${iconURL(weatherInfo.weather[0].icon)}" alt="${weatherInfo.weather[0].main}" height="42" width="42">`)
      $('#curNameDate').text(`${weatherInfo.name} - (${getDate(weatherInfo.dt)})`)
      $('#curTemp').text(`Temperature: ${convertTemp(weatherInfo.main.temp)}°F`)
      $('#uvtitle').text('UV Index:')
      $('#curHumid').text(`Humidity: ${weatherInfo.main.humidity}%`)
      getUV(weatherInfo.coord.lon, weatherInfo.coord.lat)
      getForecast(weatherInfo.id)
    })
    .catch(error => console.error(error))
}
const convertTemp = (int) => {
  // (parseInt(kelvin)−273.15) × 9 / 5 + 32
  let k = parseInt(int)
  k = k - 273.15
  k = k * 9
  k = k / 5
  k = k + 32
  return Math.max(Math.round(k * 10) / 10, 2.8).toFixed(2)
}

$('#btnSearch').on('click', (e) => {
  e.preventDefault()
  console.log('ping')
  const cityName = $('#searchCity').val()
  getCurrentWeather(cityName)
  city_list.push(cityName)
  renderList()
})

$(document).on('click', (e) => {
  if (e.target.className === 'collection-item') {
    getCurrentWeather(e.target.id)
  }
})
