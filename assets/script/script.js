
let cityInput = document.querySelector("#userInput");
let searchBtn = document.querySelector("#searchBtn");
let quickSearchBtn = document.querySelectorAll("#cityList .btn-outline-info");
let forecastContainerDiv = document.querySelector("#futureForecast");
forecastContainerDiv.setAttribute('class', 'd-flex justify-content-between')
let currentWeatherDataDiv = document.querySelector("#currentDay");
let currentWeatherDataContainer = document.createElement("div");
let forecastContainer;

let nameEl = document.createElement("h3");
let conditionEl = document.createElement("p")
let currentTempEl = document.createElement("p");
let currentFeelsLikeEl = document.createElement("p");
let currentWindConditionsEl = document.createElement("p");
let currentHumidityEl = document.createElement("p");
let iconEl = document.createElement("img");

let currentWeatherData, forecastData;
let lat, lon;
let userInput;
let dayData= {};

function quickSearch(){
    for (let i = 0;i < quickSearchBtn.length;i++) {
        quickSearchBtn[i].addEventListener('click', function(){
            getWeatherFromName(quickSearchBtn[i].name)
            hideElements(quickSearchBtn[i]);
        })
    }
};



quickSearch();

function getWeatherFromName(cityName) {
    console.log(cityName);
    fetch("http://api.openweathermap.org/geo/1.0/direct?q="+ cityName +"&appid=c8d4606f9672457e7814fdfb0230ecef")
        .then(function(response) {
        return response.json();
        })
        .then(function(data){
        lat = data[0].lat;
        lon = data[0].lon;
        getWeatherFromCoords(lat,lon);
      })

};

function getCoordsFromInput() {
    userInput = cityInput.value;
    if (!userInput) {
     return Promise.reject("User input is empty");
    } else {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q="+ userInput +"&appid=c8d4606f9672457e7814fdfb0230ecef")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        lat = data[0].lat;
        lon = data[0].lon;
        return getWeatherFromCoords(lat, lon);
    })}
};

function getWeatherFromCoords(lat,lon) {
    fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon="+ lon +"&appid=c8d4606f9672457e7814fdfb0230ecef&units=imperial")
    .then(function (response) {
        return response.json();
        
    })
    .then(function (weather) {
        currentWeatherData = weather;
        console.log(currentWeatherData);
        return fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon="+ lon +"&appid=c8d4606f9672457e7814fdfb0230ecef&units=imperial");
    })
    .then(function (response) {
    return response.json();
    })
    .then(function (forecast) {
        forecastData = forecast;
        console.log(forecastData);
        displaycurrentWeather(currentWeatherData);
        getForecast(forecastData);
    })};


searchBtn.addEventListener('click', function() {
    getCoordsFromInput();
    hideElements();
});

function getWindDirection() {
    let deg = currentWeatherData.wind.deg;
    let windDirection = '';
    if (deg>337.5) 
    {windDirection= 'N'}
    else if (deg>292.5) 
    {windDirection= 'NW'}
    else if (deg>247.5) 
    {windDirection= 'W'}
    else if (deg>202.5) 
    {windDirection= 'SW'}
    else if (deg>157.5) 
    {windDirection= 'S';}
    else if (deg>122.5) 
    {windDirection= 'SE'}
    else if (deg>67.5) 
    {windDirection= 'E'}
    else if (deg>22.5) 
    {windDirection= 'NE'}
    else (deg<22.5 && deg>=0) 
    {windDirection= 'N'}
    return windDirection;
};


function displaycurrentWeather() {
    currentWeatherDataContainer.setAttribute("class", "border border-1 p-2 rounded-2")
    let nameVal = currentWeatherData.name;
    let iconEl = document.createElement("img");
    let icon = currentWeatherData.weather[0].icon;
    let iconSrc = ("https://openweathermap.org/img/wn/" + icon + ".png");
    let condition = currentWeatherData.weather[0].description;
    let temp = Math.floor(currentWeatherData.main.temp);
    let feelsLike = Math.floor(currentWeatherData.main.feels_like);
    let humidity = Math.floor(currentWeatherData.main.humidity);
    let windSpeed = Math.floor(currentWeatherData.wind.speed);
    
    nameEl.textContent = nameVal;
    iconEl.setAttribute('src',iconSrc);
    conditionEl.textContent = condition;
    currentTempEl.textContent = ("Temperature: " + temp + " F");
    currentFeelsLikeEl.textContent= ("Feels like: " + feelsLike + " F");
    currentHumidityEl.textContent = ("Humidity: " + humidity + "%");
    currentWindConditionsEl.textContent = (windSpeed + " MPH from the " + getWindDirection(currentWeatherData));

    currentWeatherDataDiv.append(currentWeatherDataContainer);
    currentWeatherDataContainer.append(
        nameEl,conditionEl,currentTempEl,currentFeelsLikeEl,currentHumidityEl,currentWindConditionsEl);
    nameEl.appendChild(iconEl);
    
};

function getForecast() {
    forecastData = forecastData.list;
    let dailyForecast = [];
    for (let i = 0; i<forecastData.length;i+=8) {
        dayData = forecastData[i];
        dailyForecast.push(dayData);
    }
    console.log(dailyForecast);
    return displayForecast(dailyForecast);
;}



function displayForecast(dailyForecast) {
    let icon,date,iconSrc,temp,condition,windSpeed,humidity;
    for (i=0;i<dailyForecast.length; i++) {
        forecastContainer = document.createElement("div");
        icon = dailyForecast[i].weather[0].icon;
        iconSrc = ("https://openweathermap.org/img/wn/" + icon + ".png");
        date = dailyForecast[i].dt_txt.split(' ');
        temp = Math.floor(dailyForecast[i].main.temp);
        condition = dailyForecast[i].weather[0].description;
        windSpeed = Math.floor(dailyForecast[i].wind.speed);
        humidity = Math.floor(dailyForecast[i].main.humidity);
        
        
        let dayEl = document.createElement('h3');
        let tempEl = document.createElement('p');
        let conditionEl = document.createElement('p')
        let iconEl = document.createElement("img");
        let windSpeedEl = document.createElement('p');
        let humidityEl = document.createElement('p');

        iconEl.setAttribute('src',iconSrc);
        dayEl.textContent = date[0];
        tempEl.textContent = ('expected temp: '+ temp + 'F');
        conditionEl.textContent = condition;
        windSpeedEl.textContent = ('Wind: '+ windSpeed + " MPH");
        humidityEl.textContent = (humidity + "% humidity");

        forecastContainer.setAttribute('class', 'p-2 border border-1 rounded-2')
        dayEl.appendChild(iconEl);
        forecastContainer.append(dayEl,tempEl,conditionEl,windSpeedEl,humidityEl);
        forecastContainerDiv.append(forecastContainer);
    }
};

function hideElements() {
    forecastContainerDiv.innerHTML= '';
};

