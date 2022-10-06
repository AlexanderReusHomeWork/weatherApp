interface IOpenCageData {
  documentation: string;
  licenses: object[];
  rate: object;
  results: ICity[];
  status: object;
  stay_informed: string;
  thanks: string;
  timestamp: object;
  total_results: number;
}
interface ICity {
  bounds: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  components: object;
  confidence: number;
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
}

interface IOpenweathermap {
  city: {
    coords: { lat: number; lon: number };
    country: string;
    id: number;
    name: string;
    population: number;
    sunrise: number;
    sunset: number;
    timezone: number;
  };
  cnt: number;
  cod: string;
  list: IWeatherList[];
  message: number;
}

interface IWeatherList {
  clouds: { all: number };
  dt: number;
  dt_txt: string;
  main: {
    feels_like: number;
    grnd_level: number;
    humidity: number;
    pressure: number;
    sea_level: number;
    temp: number;
    temp_kf: number;
    temp_max: number;
    temp_min: number;
  };
  pop: number;
  sys: { pod: string };
  visibility: number;
  weather: {
    description: string;
    icon: string;
    id: number;
    main: string;
  }[];
  wind: {
    deg: number;
    gust: number;
    speed: number;
  };
}
interface IGeolocationPosition<T> {
  coords: {
    accuracy: number;
    altitude: T;
    altitudeAccuracy: T;
    heading: T;
    latitude: number;
    longitude: number;
    speed: T;
  };
  timestamp: number;
}

class WeatherAppTS {
  private API_KEY_WEATHER: string;
  private API_KEY_LOCATION: string;
  private locCoords: any;

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
  private locationsRender = document.querySelector(
    ".search-form-locations"
  ) as HTMLElement;
  private locationsContainer = document.querySelector(
    ".search-form-locations-container"
  ) as HTMLBodyElement;
  private loader = document.querySelector(".lds-ellipsis") as HTMLBodyElement;

  constructor(apiKeyWeather: string, apiKeyLocation: string) {
    this.API_KEY_WEATHER = apiKeyWeather;
    this.API_KEY_LOCATION = apiKeyLocation;

    this.form.addEventListener("submit", this.weatherIntermediary);
    this.searchInput.addEventListener("keyup", this.timer);
  }

  getCityEvent = () => {
    fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${this.searchInput.value.trim()}&key=${
        this.API_KEY_LOCATION
      }&language=en&pretty=1&no_annotations=1`
    )
      .then((res) => res.json())
      .then((data: IOpenCageData) => {
        const cityResult: ICity[] = data.results;
        this.displayLocationsRes(cityResult);
      })
      .catch((_) => this.renderErrorMsg("Such city does`nt exist"));
  };

  debounce = (callback: Function, ms: number): Function => {
    let timer: ReturnType<typeof setTimeout>;

    return function (this: WeatherAppTS, ...args: any) {
      clearTimeout(timer);
      timer = setTimeout(() => callback.apply(this, args), ms);
    };
  };

  timer = (e: KeyboardEvent) => {
    if (e.key === "Backspace") {
      this.locationsContainer.innerHTML = "";
    }
    if (!this.searchInput.value) {
      this.locationsRender.classList.add("none");
    }
    this.loader.classList.remove("none");
    this.locationsRender.classList.remove("none");
    const timerDebounce = this.debounce(this.getCityEvent, 1000);
    timerDebounce();
  };

  displayLocationsRes = (city: ICity[]) => {
    if (this.searchInput.value === "") {
      this.locationsRender.classList.add("none");
      this.locationsContainer.innerHTML = "";
    }
    const firstCity = city[0].geometry;
    this.locCoords = firstCity;
    const citiesArr = city.map((res: ICity) => {
      return `<p style='margin-top:5px'>${res.formatted}</p>`;
    });
    if (citiesArr.length > 0) {
      this.loader.classList.add("none");
      this.locationsContainer.insertAdjacentHTML(
        "afterbegin",
        citiesArr.join("")
      );
      this.locationsContainer.addEventListener("click", (e: any) => {
        const chosenLocation = e.target.closest("p").textContent;
        const filteredCity = city.filter(
          (elem) => elem.formatted === chosenLocation
        );
        const locationCoords = filteredCity[0].geometry;
        this.locCoords = locationCoords;
        if (!chosenLocation) return;
        this.searchInput.value = chosenLocation;
        this.locationsContainer.innerHTML = "";
        this.locationsRender.classList.add("none");
      });
    } else {
      this.loader.classList.remove("none");
    }
  };

  weatherIntermediary = (e: Event) => {
    e.preventDefault();
    if (this.searchInput.value === "") {
      this.renderErrorMsg("Please enter a location");
      return;
    }
    if (!this.locCoords) {
      this.locationsRender.classList.add("none");
      this.renderErrorMsg("Enter a valid location");
      return;
    }
    this.searchInput.value = "";
    const { lat, lng } = this.locCoords;
    this.getWeatherData(lat, lng);
    this.locationsRender.classList.add("none");
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
    list: IWeatherList[]
  ) => {
    const forecast: IWeatherList[] = [];
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
    const dailyForecastHTML = forecast.map((elem) => {
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

      const data: IOpenweathermap = await res.json();
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
      this.locCoords = null;
    } catch (err: any) {
      console.log(err.message);
    }
  };

  onSuccess = (position: IGeolocationPosition<null | number>) => {
    const { latitude, longitude } = position.coords;
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
