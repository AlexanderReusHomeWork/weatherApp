class WeatherAppTS {
  private API_KEY_WEATHER: string;
  private API_KEY_LOCATION: string;
  constructor(apiKeyWeather: string, apiKeyLocation: string) {
    this.API_KEY_WEATHER = apiKeyWeather;
    this.API_KEY_LOCATION = apiKeyLocation;
    const form = document.querySelector(".search-form") as HTMLFormElement;

    form.addEventListener("submit", (e: any) => {
      e.preventDefault();
      const searchInput = document.getElementById(
        "city-search"
      ) as HTMLInputElement;

      if (searchInput.value === "") {
        const errorMsgContainer = document.querySelector(
          ".search-form-error"
        ) as HTMLElement;
        errorMsgContainer.textContent = "Please enter a city"; //не применяются стили
        errorMsgContainer.classList.remove("none");
        setTimeout(() => {
          errorMsgContainer.classList.add("none");
        }, 3000);
      }

      fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${searchInput.value.trim()}&key=${
          this.API_KEY_LOCATION
        }&language=en&pretty=1&no_annotations=1`
      )
        .then((res) => res.json())
        .then((data) => {
          const { lat, lng } = data.results[0].geometry;
          this.getWeatherData(lat, lng);
        })
        .catch((err) => console.log(err.message));
    });
  }

  getPosition = () => {
    navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError);
  };

  renderData = (
    cityProp: string,
    country: string,
    currentTemp: number,
    feelsLike: number,
    humidity: number,
    pressure: number,
    visibility: number,
    windSpeed: number,
    weather: string,
    description: string,
    list: object[]
  ) => {
    const city = document.querySelector(".city") as HTMLBodyElement;
    const todayWeather = document.querySelector(
      ".today-container-temp"
    ) as HTMLBodyElement;
    const weatherDetails = document.querySelector(
      ".today-container-details"
    ) as HTMLBodyElement;
    const weatherHum = document.querySelector(
      ".today-container-hum"
    ) as HTMLBodyElement;
    const todayForecast = document.querySelector(
      ".today-forecast"
    ) as HTMLBodyElement;

    const forecast: object[] = [];
    for (let i = 0; i < list.length; i++) {
      if (i === 0) continue;
      forecast.push(list[i]);
    }

    const cityHTML = `
      <p>${cityProp},${country}</p>
      `;
    const tempHTML = `
            <p>${currentTemp}</p>
            <span>°C</span>
          `;
    const weatherDetHTML = `
            <h2>${weather}</h2>
            <p>Feels line: <span>${feelsLike}</span></p>
            <p>Pressure: <span>${pressure}</span></p>
            <p>Humidity: <span>${humidity}%</span></p>
          `;
    const weatherDet2HTML = `
            <p>Wind: <span>${windSpeed}km/h</span></p>
            <p>Visibility: <span>${visibility / 1000}km</span></p>
            <p>Description: <span>${description}</span></p>
        `;
    const dailyForecastHTML = forecast.map((elem: any) => {
      const {
        temp,
        weather,
        time,
      }: { temp: number; weather: string; time: string } = {
        temp: elem.main.temp,
        weather: elem.weather[0].icon,
        time: elem.dt_txt,
      };

      return `
        <div>
        <span style="color:${temp > 20 ? "#fc5353" : "#5f5ae4"}">${temp}°</span>
        <img src="http://openweathermap.org/img/wn/${weather}@2x.png" scr="weather-icon"/>
        <p>${time}</p>
        </div>
        `;
    });

    city.innerHTML = "";
    todayWeather.innerText = "";
    weatherDetails.innerHTML = "";
    weatherHum.innerHTML = "";
    todayForecast.innerHTML = "";

    city.insertAdjacentHTML("afterbegin", cityHTML);
    todayWeather.insertAdjacentHTML("afterbegin", tempHTML);
    weatherDetails.insertAdjacentHTML("afterbegin", weatherDetHTML);
    weatherHum.insertAdjacentHTML("afterbegin", weatherDet2HTML);
    todayForecast.insertAdjacentHTML("afterbegin", dailyForecastHTML.join(""));
  };

  getWeatherData = async (latitude: number, longitude: number) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&id=524901&appid=${this.API_KEY_WEATHER}&units=metric&cnt=6`
      );

      if (!res.ok) throw new Error("Something went wrong");

      const data = await res.json();
      const {
        cityProp,
        country,
        currentTemp,
        feelsLike,
        humidity,
        pressure,
        visibility,
        windSpeed,
        weather,
        description,
        list,
      }: {
        cityProp: string;
        country: string;
        currentTemp: number;
        feelsLike: number;
        humidity: number;
        pressure: number;
        visibility: number;
        windSpeed: number;
        weather: string;
        description: string;
        list: object[];
      } = {
        cityProp: data.city.name,
        country: data.city.country,
        currentTemp: data.list[0].main.temp,
        feelsLike: data.list[0].main.feels_like,
        humidity: data.list[0].main.humidity,
        pressure: data.list[0].main.pressure,
        visibility: data.list[0].visibility,
        windSpeed: data.list[0].wind.speed,
        weather: data.list[0].weather[0].main,
        description: data.list[0].weather[0].description,
        list: data.list,
      };
      this.renderData(
        cityProp,
        country,
        currentTemp,
        feelsLike,
        humidity,
        pressure,
        visibility,
        windSpeed,
        weather,
        description,
        list
      );
    } catch (err: any) {
      console.log(err.message);
    }
  };

  onSuccess = (position: any) => {
    const { latitude, longitude }: { latitude: number; longitude: number } =
      position.coords;
    this.getWeatherData(latitude, longitude);
  };

  onError = () => {
    const err = document.querySelector(".city") as HTMLBodyElement;
    const errorMsgHTML = `
      <h2 style="color:#fc5353">Please turn on your geolocation for app to work properly</h2>
      `;
    err.insertAdjacentHTML("afterbegin", errorMsgHTML);
  };
}

const appTS = new WeatherAppTS(
  "02b462b89c44372685da70c8e38eba1b",
  "695f04fe03e3469192ed31e883367c13"
);
appTS.getPosition();
