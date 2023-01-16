var apiKey = 'b7f1309d0593f6a6760651a040ca97d0'
var history = JSON.parse(window.localStorage.getItem('city')) || []
var userInput = ''

var cityName = document.getElementById('textInput')
var mainCityName = document.getElementById('mainCityName')
var humidity = document.getElementById('mainHum')
var mainTemp = document.getElementById('mainTemp')
var feelsLike = document.getElementById('feelsLike')
var mainWind = document.getElementById('mainWind')
var forecast = document.getElementById('forecast')
var forecastID = document.getElementById('forecastTextID')
var buttonDiv = document.querySelector('.list-group')
var clearHistory = $('#clear-history')
var date = document.getElementById('today')
var image = document.getElementById('image')

var searchButton = document.getElementById('submitBtn')
searchButton.addEventListener('click', fetchWeather)
var searchHistory = JSON.parse(localStorage.getItem('cityHistory')) || []

for (let index = 0; index < searchHistory.length; index++) {
  var previousButton = document.createElement('button')
  previousButton.textContent = searchHistory[index]
  buttonDiv.appendChild(previousButton)
  previousButton.addEventListener('click', fetchWeather)
}

//check the city exists
//append the button to the html (the div for the buttons
//push cityName.value into history array.
// Button for new search
//create a button and set the inner text to cityName.value
// Button on last search items

function fetchWeather(event) {
  event.preventDefault()
  //will create a button if the city name is not blank, and will not add a new city if it exists as a button.
  console.log(event)
  var cities = ''
  if (event.target.localName == 'button' && event.target.innerText !== 'Go') {
    cities = event.target.textContent
  } else {
    cities = cityName.value
    if (
      cityName.value !== '' &&
      searchHistory.includes(cityName.value) == false
    ) {
      var previousButton = document.createElement('button')
      previousButton.textContent = cityName.value
      buttonDiv.appendChild(previousButton)
      searchHistory.push(cityName.value)
      localStorage.setItem('cityHistory', JSON.stringify(searchHistory))
    }
  }

  var url = `https://api.openweathermap.org/data/2.5/forecast?q=${cities}&appid=${apiKey}`
  console.log(url)

  fetch(url)
    .then((res) => {
      return res.json()
    })

    .then((data) => {
      console.log(data)
      //converting temp to Fahrenhit
      var tempF = Math.floor((data.list[0].main.temp - 273.15) * 1.8 + 32)
      mainCityName.textContent = cities
      date.textContent = 'Date: ' + data.list[0].dt_txt.split(' ')[0]
      //date.textContent = 'Date:'.text(today.format('MMM D, YYYY'))
      image.src =
        'http://openweathermap.org/img/w/' +
        data.list[0].weather[0].icon +
        '.png'
      mainTemp.textContent = 'Temperature: ' + tempF + ' °F'
      feelsLike.textContent = 'Feels Like: ' + tempF + ' °F'
      humidity.textContent = 'Humidity: ' + data.list[0].main.humidity + ' %'
      mainWind.textContent = 'Wind Speed: ' + data.list[0].wind.speed + ' mph'
      forecast.textContent = 'forecast ' + data.list[0].forecast
      forecastID.textContent = ' Predicted 5-Day Forecast' // + data.list[0].forecastID

      //for loop to create cards for the next 4 days
      var newForecast = ''

      for (let i = 0; i < 4; i++) {
        var temp = Math.floor(
          (data.list[(i + 1) * 8].main.temp - 273.15) * 1.8 + 32,
        )
        var card = `
        <div id="weatherInfoCard" class="card ml-3 mt-2 card border-info mb-3">

          <div class="card-body" style="background-color: #cce5ff"> 
          <p class="card-text"> Date: ${
            data.list[(i + 1) * 8].dt_txt.split(' ')[0]
          }
          </p>
          </div>

          <div class="card-body" style="background-color: #cce5ff"> 
          <img src='http://openweathermap.org/img/w/${
            data.list[(i + 1) * 8].weather[0].icon
          }.png'> </img>
          </div>

          <div class="card-body" style="background-color: #cce5ff"> 
          <p class="card-text"> Temperature: ${temp} °F
          </p>
          </div>

          <div class="card-body" style="background-color: #cce5ff"> 
          <p class="card-text"> Temperature: ${temp} °F
          </p>
          </div>

          <div class="card-body" style="background-color: #cce5ff"> 
            <p class="card-text">  Humidity: ${
              data.list[(i + 1) * 8].main.humidity
            } %
            </p>
          </div>
          
          <div class="card-body" style="background-color: #cce5ff"> 
            <p class="card-text"> Wind Speed: ${
              data.list[(i + 1) * 8].wind.speed
            } mph
            </p>
          </div>
        </div>
           `
        newForecast += card
      }

      forecast.innerHTML = newForecast
    })
}
