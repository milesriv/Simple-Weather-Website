//USING geolocation API and Weather API

window.addEventListener("load", myLoad);
let LS = window.localStorage;
let date = new Date();

function myLoad() {
    let lblToday = document.getElementById("today");
    let lblLastAccess = document.getElementById("lastAccess");

    lblToday.textContent = date.toDateString();

    let strLA = LS.getItem("lastAccess");

    //If user had previously accessed weather, set previous date. If not, do nothing.
    if (strLA != null) {
        lblLastAccess.textContent = strLA;
    }
}

let btnGetWeather = document.getElementById("Weather");
btnGetWeather.addEventListener("click", getPosition);
let errMsg = document.getElementById("errMsg");

function getPosition() {
    //Set todays date into Local Storage "lastAccess" field
    LS.setItem("lastAccess", date.toDateString());

    //Check if browser supports geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(retrieveWeather);
    } else {
        errMsg.textContent = "Geolocation is not supported by this browser.";
    }
}

function retrieveWeather(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let weatherURL = 'http://api.openweathermap.org/data/2.5/weather?lat=' +
        latitude + '&lon=' +
        longitude + '&units=imperial&appid=b231606340553d9174136f7f083904b3';

    let myRequest = new XMLHttpRequest();
    myRequest.open("GET", weatherURL);
    myRequest.onload = function () {
        if (myRequest.status >= 200 && myRequest.status < 400) {
            let myResponse = myRequest.responseText;
            let weatherData = JSON.parse(myResponse);
            displayWeather(weatherData);
        } else {
            alert("ERROR - could not load weather data: " + weatherURL);
        }
    }
    myRequest.send();
}

function displayWeather(data) {
    let lblCity = document.getElementById('City');
    let lblCurrent = document.getElementById('Current');
    let lblConditions = document.getElementById('Conditions');
    let lblHi = document.getElementById('HiTemp');
    let lblLow = document.getElementById('LoTemp');
    let lblRise = document.getElementById('Sunrise');
    let lblSet = document.getElementById('Sunset');

    lblCity.textContent = data.name;
    lblConditions.textContent = data.weather[0].main;
    lblCurrent.textContent = Math.round(data.main.temp);
    lblHi.textContent = Math.round(data.main.temp_max);
    lblLow.textContent = Math.round(data.main.temp_min);

    let sunrise = new Date(1000 * data.sys.sunrise);
    let riseMinutes = sunrise.getMinutes();

    //Check if minutes is less than 10 and add a preceding 0 if so
    if (riseMinutes < 10) {
        lblRise.textContent = sunrise.getHours() + ':' + '0' + sunrise.getMinutes() + 'am';
    } else {
        lblRise.textContent = sunrise.getHours() + ':' + sunrise.getMinutes() + 'am';
    }

    let sunset = new Date(1000 * data.sys.sunset);
    let setHour = sunset.getHours();
    let setMinutes = sunset.getMinutes();

    //12-Hour Format
    if (setHour > 12) {
        setHour -= 12;
    }

    //Check if minutes is less than 10 and add a preceding 0 if so
    if (setMinutes < 10) {
        lblSet.textContent = setHour + ':' + "0" + setMinutes + 'pm';
    } else {
        lblSet.textContent = setHour + ':' + setMinutes + 'pm';
    }
}


/* Weather Data Format (JSON)  
{"coord":{"lon":139,"lat":35},
"sys":{"country":"JP","sunrise":1369769524,"sunset":1369821049},
"weather":[{"id":804,"main":"clouds","description":"overcast clouds","icon":"04n"}],
"main":{"temp":289.5,"humidity":89,"pressure":1013,"temp_min":287.04,"temp_max":292.04},
"wind":{"speed":7.31,"deg":187.002},
"rain":{"3h":0},
"clouds":{"all":92},
"dt":1369824698,
"id":1851632,
"name":"Shuzenji",
"cod":200} 
*/
