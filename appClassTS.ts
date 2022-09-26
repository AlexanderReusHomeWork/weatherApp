class WeatherAppTS {
  private API_KEY_WEATHER: string;
  private API_KEY_LOCATION: string;

  private city = document.querySelector(".city") as HTMLBodyElement;
  private todayWeather = document.querySelector(
    ".today-container-temp"
  ) as HTMLBodyElement;
  private weatherDetails = document.querySelector(
    ".today-container-details"
  ) as HTMLBodyElement;
  private weatherHum = document.querySelector(
    ".today-container-hum"
  ) as HTMLBodyElement;
  private todayForecast = document.querySelector(
    ".today-forecast"
  ) as HTMLBodyElement;
  private searchInput = document.getElementById(
    "city-search"
  ) as HTMLInputElement;
  private form = document.querySelector(".search-form") as HTMLFormElement;

  constructor(apiKeyWeather: string, apiKeyLocation: string) {
    this.API_KEY_WEATHER = apiKeyWeather;
    this.API_KEY_LOCATION = apiKeyLocation;

    this.form.addEventListener("submit", this.getCityEvent);
  }

  getCityEvent = (e: any) => {
    e.preventDefault();

    if (this.searchInput.value === "") {
      this.renderErrorMsg("Please enter a city");
      return;
    }

    fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${this.searchInput.value.trim()}&key=${
        this.API_KEY_LOCATION
      }&language=en&pretty=1&no_annotations=1`
    )
      .then((res) => res.json())
      .then((data) => {
        const { lat, lng } = data.results[0].geometry;
        this.getWeatherData(lat, lng);
      })
      .catch((_) => this.renderErrorMsg("Such city doesn`t exist"));
  };

  getPosition = () => {
    navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError);
  };

  renderErrorMsg = (msg: string) => {
    const errorMsgContainer = document.querySelector(
      ".search-form-error"
    ) as HTMLElement;
    errorMsgContainer.textContent = msg;
    errorMsgContainer.classList.remove("none");
    errorMsgContainer.classList.add("errorMsg");
    setTimeout(() => {
      errorMsgContainer.classList.add("none");
    }, 3000);
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
    const forecast: object[] = [];
    for (let i = 0; i < list.length; i++) {
      if (i === 0) continue;
      forecast.push(list[i]);
    }

    const cityHTML = `
      <p>${cityProp}, ${country}</p>
      `;
    const tempHTML = `
            <p>${currentTemp}</p>
            <span>°C</span>
          `;
    const weatherDetHTML = `
            <h2>${weather}</h2>
            <p>Feels like: <span>${feelsLike}</span></p>
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

    this.city.innerHTML = "";
    this.todayWeather.innerText = "";
    this.weatherDetails.innerHTML = "";
    this.weatherHum.innerHTML = "";
    this.todayForecast.innerHTML = "";

    this.city.insertAdjacentHTML("afterbegin", cityHTML);
    this.todayWeather.insertAdjacentHTML("afterbegin", tempHTML);
    this.weatherDetails.insertAdjacentHTML("afterbegin", weatherDetHTML);
    this.weatherHum.insertAdjacentHTML("afterbegin", weatherDet2HTML);
    this.todayForecast.insertAdjacentHTML(
      "afterbegin",
      dailyForecastHTML.join("")
    );
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
