// const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const currentTempEl = document.getElementById("current-temp");
const currentTemperature = document.getElementById("current-temperature")
const currentTempIcon = document.getElementById("current-temp-icon");
const feelsLike = document.getElementById("feels-like");
const windSpeed = document.getElementById("windSpeedInKm");
const visibilit_y = document.getElementById("visibility");
const pressure_d = document.getElementById("pressure_d");
const humidity_d = document.getElementById("humidity_d");
const dew_point_d = document.getElementById("dew_point_d");
const weatherForecastEl = document.getElementById("weather-forecast");
const weatherHourForecastEl = document.getElementById("weather-hour-forecast");
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "561bfd9d873911a97dc832bdc611bfb7";

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

const proxy = "https://cors-anywhere.herokuapp.com/";

searchInput.addEventListener("submit",(e)=>{
  if(e==="Enter")
  getWeather(searchInput.value);
});

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  getWeather(searchInput.value);
  searchInput.value = "";
});



const getWeather = async (city) => {
  try {
    
    const responses = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
      { mode: "cors" }
    );
    const weatherData = await responses.json();
     console.log(weatherData.coord);
    let { lon,lat } = weatherData.coord;
    console.log(lat);
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
     timezone.innerHTML = weatherData.name +" / "+weatherData.sys.country;
    
    
  } catch (error) {
    console.log(error);
    alert("city not found");
  }
};



setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  document.getElementById("update-time").innerHTML = "Updated as of "+ (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) + ":" + (minutes < 10 ? "0" + minutes : minutes) + " " + `<span id="am-pm">${ampm}</span>`;

  // dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });

  });
}

showCityName();

function showCityName()
{
  navigator.geolocation.getCurrentPosition((success) => {
    
    let { latitude, longitude } = success.coords;
    fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=3&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        let [city_data] = data;
        
        timezone.innerHTML = city_data.name +" / "+city_data.country;
        
      });

  });

}


function showWeatherData(data) {
  let {dew_point, humidity, pressure, sunrise, sunset, wind_speed,feels_like,visibility,temp} = data.current;
  currentTempIcon.innerHTML = `<img src="http://openweathermap.org/img/wn//${
    data.current.weather[0].icon
  }@4x.png" alt="weather icon" id="current-temp-icon">`
  document.getElementById("weather-desc").innerHTML = data.current.weather[0].main;

  // Table data

  feelsLike.innerHTML = "Feels like "+Math.floor(feels_like)+"&#176";
  windSpeed.innerHTML = "Wind "+String(wind_speed)+"km/h";
  visibilit_y.innerHTML = "Visibility "+visibility/1000+"km";
  
  pressure_d.innerHTML = "Pressure "+pressure+"mb";
  humidity_d.innerHTML = "Humidity "+humidity+"%";
  dew_point_d.innerHTML = "Dew Point "+Math.floor(dew_point)+"&#176";
  
 
  currentTemperature.innerHTML = `<span>${Math.floor(temp)}&#176</span>`
  setInterval(() => { currentTemperature.innerHTML = `<span>${Math.floor(temp)}&#176</span>`}, 100000);
  let otherDayForcast = "";

  data.daily.forEach((day, idx) =>{
    
   if (idx == 7) 
   {
      
   }
   else 
  {

      let night1 = Math.floor(day.temp.night);
      let day1 = Math.floor(day.temp.day);
      
      otherDayForcast += `
            
            <div class="weather-forecast-item">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("ddd, DD MMM")} </div>
                
                   
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${night1}&#176;C</div>
                <div class="temp">Day - ${day1}&#176;C</div>
                <div class="W_desc">${day.weather[0].description}</div>
            </div>
            
            `;
  }
  });
  
  weatherForecastEl.innerHTML = otherDayForcast;



// hourly data add


let otherhourfourcast = " ";
data.hourly.forEach((hr, idx) =>{
    
  if (idx<=10) 
 {

     let temp1 = Math.floor(hr.temp);
     otherhourfourcast += `
          
           <div class="weather-forecast-item">
               <div class="day">${window.moment(hr.dt * 1000).format("h:mm a")}</div>
               
               <img src="http://openweathermap.org/img/wn/${
                  hr.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
               <div class="temp">Temp - ${temp1}&#176;C</div>
               <div class="temp">Humidity - ${hr.humidity}&#176;C</div>
               <div class="W_desc">${hr.weather[0].description}</div>
           </div>
           
           `;
 }
 });
 
 weatherHourForecastEl.innerHTML =otherhourfourcast;



// hourly data add end 






}



