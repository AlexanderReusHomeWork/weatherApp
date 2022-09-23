var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var WeatherAppTS = /** @class */ (function () {
    function WeatherAppTS(apiKeyWeather, apiKeyLocation) {
        var _this = this;
        this.city = document.querySelector(".city");
        this.todayWeather = document.querySelector(".today-container-temp");
        this.weatherDetails = document.querySelector(".today-container-details");
        this.weatherHum = document.querySelector(".today-container-hum");
        this.todayForecast = document.querySelector(".today-forecast");
        this.searchInput = document.getElementById("city-search");
        this.form = document.querySelector(".search-form");
        this.getCityEvent = function (e) {
            e.preventDefault();
            if (_this.searchInput.value === "") {
                _this.renderErrorMsg("Please enter a city");
            }
            fetch("https://api.opencagedata.com/geocode/v1/json?q=".concat(_this.searchInput.value.trim(), "&key=").concat(_this.API_KEY_LOCATION, "&language=en&pretty=1&no_annotations=1"))
                .then(function (res) { return res.json(); })
                .then(function (data) {
                var _a = data.results[0].geometry, lat = _a.lat, lng = _a.lng;
                _this.getWeatherData(lat, lng);
            })["catch"](function (_) { return _this.renderErrorMsg("Such city doesn`t exist"); });
        };
        this.getPosition = function () {
            navigator.geolocation.getCurrentPosition(_this.onSuccess, _this.onError);
        };
        this.renderErrorMsg = function (msg) {
            var errorMsgContainer = document.querySelector(".search-form-error");
            errorMsgContainer.textContent = msg;
            errorMsgContainer.classList.remove("none");
            errorMsgContainer.classList.add("errorMsg");
            setTimeout(function () {
                errorMsgContainer.classList.add("none");
            }, 3000);
        };
        this.renderData = function (cityProp, country, currentTemp, feelsLike, humidity, pressure, visibility, windSpeed, weather, description, list) {
            var forecast = [];
            for (var i = 0; i < list.length; i++) {
                if (i === 0)
                    continue;
                forecast.push(list[i]);
            }
            var cityHTML = "\n      <p>".concat(cityProp, ",").concat(country, "</p>\n      ");
            var tempHTML = "\n            <p>".concat(currentTemp, "</p>\n            <span>\u00B0C</span>\n          ");
            var weatherDetHTML = "\n            <h2>".concat(weather, "</h2>\n            <p>Feels like: <span>").concat(feelsLike, "</span></p>\n            <p>Pressure: <span>").concat(pressure, "</span></p>\n            <p>Humidity: <span>").concat(humidity, "%</span></p>\n          ");
            var weatherDet2HTML = "\n            <p>Wind: <span>".concat(windSpeed, "km/h</span></p>\n            <p>Visibility: <span>").concat(visibility / 1000, "km</span></p>\n            <p>Description: <span>").concat(description, "</span></p>\n        ");
            var dailyForecastHTML = forecast.map(function (elem) {
                var _a = {
                    temp: elem.main.temp,
                    weather: elem.weather[0].icon,
                    time: elem.dt_txt
                }, temp = _a.temp, weather = _a.weather, time = _a.time;
                return "\n        <div>\n        <span style=\"color:".concat(temp > 20 ? "#fc5353" : "#5f5ae4", "\">").concat(temp, "\u00B0</span>\n        <img src=\"http://openweathermap.org/img/wn/").concat(weather, "@2x.png\" scr=\"weather-icon\"/>\n        <p>").concat(time, "</p>\n        </div>\n        ");
            });
            _this.city.innerHTML = "";
            _this.todayWeather.innerText = "";
            _this.weatherDetails.innerHTML = "";
            _this.weatherHum.innerHTML = "";
            _this.todayForecast.innerHTML = "";
            _this.city.insertAdjacentHTML("afterbegin", cityHTML);
            _this.todayWeather.insertAdjacentHTML("afterbegin", tempHTML);
            _this.weatherDetails.insertAdjacentHTML("afterbegin", weatherDetHTML);
            _this.weatherHum.insertAdjacentHTML("afterbegin", weatherDet2HTML);
            _this.todayForecast.insertAdjacentHTML("afterbegin", dailyForecastHTML.join(""));
        };
        this.getWeatherData = function (latitude, longitude) { return __awaiter(_this, void 0, void 0, function () {
            var res, data, _a, cityProp, country, currentTemp, feelsLike, humidity, pressure, visibility, windSpeed, weather, description, list, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("https://api.openweathermap.org/data/2.5/forecast?lat=".concat(latitude, "&lon=").concat(longitude, "&id=524901&appid=").concat(this.API_KEY_WEATHER, "&units=metric&cnt=6"))];
                    case 1:
                        res = _b.sent();
                        if (!res.ok)
                            throw new Error("Something went wrong");
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _b.sent();
                        _a = {
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
                            list: data.list
                        }, cityProp = _a.cityProp, country = _a.country, currentTemp = _a.currentTemp, feelsLike = _a.feelsLike, humidity = _a.humidity, pressure = _a.pressure, visibility = _a.visibility, windSpeed = _a.windSpeed, weather = _a.weather, description = _a.description, list = _a.list;
                        this.renderData(cityProp, country, currentTemp, feelsLike, humidity, pressure, visibility, windSpeed, weather, description, list);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        console.log(err_1.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.onSuccess = function (position) {
            var _a = position.coords, latitude = _a.latitude, longitude = _a.longitude;
            _this.getWeatherData(latitude, longitude);
        };
        this.onError = function () {
            var err = document.querySelector(".city");
            var errorMsgHTML = "\n      <h2 style=\"color:#fc5353\">Please turn on your geolocation for app to work properly</h2>\n      ";
            err.insertAdjacentHTML("afterbegin", errorMsgHTML);
        };
        this.API_KEY_WEATHER = apiKeyWeather;
        this.API_KEY_LOCATION = apiKeyLocation;
        this.form.addEventListener("submit", this.getCityEvent);
    }
    return WeatherAppTS;
}());
var appTS = new WeatherAppTS("02b462b89c44372685da70c8e38eba1b", "695f04fe03e3469192ed31e883367c13");
appTS.getPosition();
