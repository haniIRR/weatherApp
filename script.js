var cityname = document.getElementById("cityname");
var date = document.getElementById("date");
var teprature = document.getElementById("teprature");
var pressure = document.getElementById("pressure");
var windspeed = document.getElementById("windspeed");
var humidity = document.getElementById("humidity");
var searchbtn = document.getElementById("searchbtn");
var locationbtn = document.getElementById("locationbtn");

let apiKey = "ef33161de3bc499aab9104524261707";
let BaseURL = "https://api.weatherapi.com/v1";

let city = "Tehran";

function LoadBase() {
  console.log(city);

  fetch(`${BaseURL}/current.json?key=${apiKey}&q=${city}`)
    .then((res) => {
      return res.json();
    })
    .then((d) => {
      console.log(d);
      UpdateUI(d);
    })
    .catch((rej) => {
      console.log(rej);
    });
}
LoadBase();
forecast();

function formattedDate(date) {
  date = new Date(date.replace(" ", "T"));

  return (
    date.toLocaleDateString("en-US", {
      weekday: "long",
    }) +
    " • " +
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  );
}

function debounce(func, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
var searchinput = document.getElementById("searchinput");
var suggestion = document.getElementById("suggestion");
let debounceSearch = debounce(searchCity, 2000);
searchinput.addEventListener("input", function (e) {
  debounceSearch(e.target.value);
});
// searchinput.addEventListener("keydown", function () {
//   debounceLoad();
//   // LoadBase();
//   forecast();
// });

function searchCity(value) {
  if (value.trim() == "") {
    suggestion.innerHTML = `
        <div class="suggest-empty">
          No city found
        </div>
      `;

    return;
  }
  fetch(`${BaseURL}/search.json?key=${apiKey}&q=${value}`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      suggestion.innerText = "";
      res.forEach((c) => {
        let div = document.createElement("div");
        div.classList.add("suggest-item");
        div.innerHTML = `${c.name} , ${c.country}`;
        div.addEventListener("click", function () {
          searchinput.value = c.name;
          suggestion.innerHTML = "";
          window.city = city.name;
          LoadBase();
          forecast();
        });
        suggestion.append(div);
      });
    });
}

function UpdateUI(res) {
  cityname.innerText = res.location.name;
  date.innerText = formattedDate(res.current.last_updated);
  teprature.innerText = res.current.temp_c;
  pressure.innerText = res.current.pressure_in;
  windspeed.innerText = res.current.wind_kph;
  humidity = res.current.humidity;
}

function forecast() {
  fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // UpdateUI(data);
      CreateForecast(data);
    });
  function CreateForecast(data) {
    forecastList.innerHTML = "";

    data.forecast.forecastday.forEach((element) => {
      let card = document.createElement("div");

      card.classList.add("forecast-card");

      let date = new Date(element.date);

      let day = date.toLocaleDateString("en-US", {
        weekday: "short",
      });

      let fullDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      card.innerHTML = `
          <div class="forecast-date">
            <strong>${day}</strong>
            <span>${fullDate}</span>
          </div>
    
          <div class="forecast-weather">
            <img 
              src="https:${element.day.condition.icon}" 
              alt="${element.day.condition.text}"
            />
    
            <span>${element.day.condition.text}</span>
          </div>
    
          <div class="forecast-temperature">
            <strong>${Math.round(element.day.maxtemp_c)}°</strong>
            <span>${Math.round(element.day.mintemp_c)}°</span>
          </div>
        `;

      forecastList.append(card);
    });
  }
}
locationbtn.addEventListener("click", function () {
  var loc = console.log(loc);
});
const lll = navigator.geolocation.getCurrentPosition(
  function (position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    city = `${latitude},${longitude}`;
    LoadBase();
    forecast();
  },
  function (error) {
    console.log(error);
  }
);

{
  /* <div class="card blue">
<div
  style="
    display: flex;
    justify-content: flex-start;
    align-items: center;
  "
>
  <div class="date">
    <span class="day"> 13 </span>
    <span class="weekday">Mon</span>
  </div>
  <img
    src=""
    alt=""
    id="statusImageThreeDayAgo"
    style="
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin: 0 20px;
    "
  />
  <p id="statusImageThreeDayAgo">hhhhhhhhh</p>
</div>
<div>
  <h3 style="color: rgba(259, 79, 79)" id="highDegreeThreeDayAgo">
    12 c
  </h3>
  <h3 style="color: rgba(85, 85, 252)" id="lowDegreeThreeDayAgo">
    7 c
  </h3>
</div>
</div> */
}
