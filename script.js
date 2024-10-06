const searchInput = document.querySelector('.search-container input');
const API_KEY = "1efabf925f5f43f0ac3233422242608";
const temperatureText = document.querySelector('.weather-info h2');
const descriptionText = document.querySelector('.weather-info p');
const weatherImg = document.querySelector('.weather-info img');
const hourlyWeatherDiv = document.querySelector('.weather-time .weather-list');
const locationBtn = document.querySelector('.search-container button');

const weatherCodes = {
    clear:[1000],
    clouds:[1003,1006,1009],
    mist:[1030,1135,1147],
    rain:[1240,1063,1150,1153,1168,1171,1180,1183,1201,1243,1246,1273,1276],
    moderate_heavy_rain: [1186,1189,1192,1195,1243,1246],
    snow: [1066,1069,1072,1114,1117,1204,1210,1213,1216,1219,1222,1225,1237,1249,1252,1255,1258,1261,1264,1279,1282],
    thunder: [1087,1279,1282],
    thunder_rain: [1273,1276],
}

const displayHourForecast = (hourlyData) => {
    const currentHour = new Date().setMinutes(0,0,0);
    const next24Hour = currentHour + 24 * 60 * 60 * 1000;

    const next24HoursData = hourlyData.filter(({time}) => {
        const forecastTime = new Date(time).getTime();
        return forecastTime >= currentHour && forecastTime <= next24Hour;
    });

    hourlyWeatherDiv.innerHTML = next24HoursData.map(item => {
        const temperature = Math.floor(item.temp_c);
        const time = item.time.split(" ")[1].substring(0, 5);
        const weaterIcon = Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(item.condition.code));
        return `<li class="time">
                    <p>${time}</p>
                    <img src="images/${weaterIcon}.svg" alt="">
                    <p>${temperature}°</p>
                </li>`;
    }).join("");
}
const getWeatherDetails = async (API_URL) => {
    
    try{
        document.body.classList.remove('show-no-results');
        const response = await fetch(API_URL);
        const data = await response.json();

        const temperature = Math.floor(data.current.temp_c);
        const description = data.current.condition.text;
        const weaterIcon = Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(data.current.condition.code));

        temperatureText.innerHTML = `${temperature}<span>°C</span>`;
        descriptionText.innerText = description;
        weatherImg.src = `images/${weaterIcon}.svg`;


        const combinedHourlyData = [...data.forecast.forecastday[0].hour];
        displayHourForecast(combinedHourlyData);

        searchInput.value = data.location.name;
        console.log(data);
    } catch(error){
        document.body.classList.add('show-no-results');
    }
}
searchInput.addEventListener('keyup',(e) => {
    const cityName = searchInput.value.trim();
    if(e.key == "Enter" && cityName){
        setWeatherRequest(cityName);
    }
});

const setWeatherRequest = (cityName) =>{
    const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}`;
    getWeatherDetails(API_URL);
}
setWeatherRequest("oran");
locationBtn.addEventListener('click', ()=> {
    navigator.geolocation.getCurrentPosition(position => {
        const {latitude, longitude} = position.coords;
        const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=2`;
        getWeatherDetails(API_URL); 
    },error => {
        alert('Location access denied. Please enable permission to use this feature.');
    })
});