import { getUnixTime, fromUnixTime, format } from "date-fns";

// Checks if something is an object
function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

// Turn a string into title case
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.replace(word[0], word[0].toUpperCase()))
    .join(" ");
}

// Get the correct units for the inputted value in relation to current page settings
function getCorrectUnitFormat(value, type, fromAPI = false) {
  const currentUnit = localStorage.getItem("unit") || "F";
  switch (type) {
    case "temperature":
      if (currentUnit === "C") {
        value = ((value - 32) * 5) / 9;
      } else if (!fromAPI) {
        value = (value * 9) / 5 + 32;
      }
      return `${Math.round(value)}°${currentUnit}`;
    case "wind-speed":
      if (currentUnit === "C") {
        value = value * 1.609;
      } else if (!fromAPI) {
        value = value / 1.609;
      }
      return `${value.toFixed(1)}${currentUnit === "F" ? "mph" : "km/h"}`;
    case "visibility":
      if (value < 1000) {
        return `${value}m`;
      } else {
        return `${Math.round(value / 1000)}km`;
      }
    case "precipitation":
      return `${value * 100}%`;
    default:
      return value;
  }
}

// Updates the session cache of an item
function updateSessionCache(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

// Simply function to see if an inputed city contains only letters, spaces, or hythens
function isValidCity(cityname) {
  const regex = /[a-z\-\s]/g;
  return regex.test(cityname);
}

// Organize and return coordinate values in an object
function getCoords(weatherObj) {
  return { lon: weatherObj.coord.lon, lat: weatherObj.coord.lat };
}

// "Syntatic sugar"
function getLocationName(weatherObj) {
  /* Only for weatherObj from the currentWeather API call */
  return weatherObj.name;
}

// Returns an array of weather objects where the time their data is valid is after the current time
function filterData(weatherObjs) {
  const currUnix = getUnixTime(new Date());
  // If we get a singular weather object instead of an array of weather objects
  if (!Array.isArray(weatherObjs)) weatherObjs = [weatherObjs];

  return weatherObjs.filter((weatherObj) => {
    return weatherObj.dt > currUnix;
  });
}

// Returns the necessary data in a format that's easy to use
function reformateData(weatherObj) {
  const dateFromUnixTime = fromUnixTime(weatherObj.dt);
  const tempIsObj = isObject(weatherObj.temp);

  return {
    day: format(new Date(dateFromUnixTime), "EEEE"),
    hour: format(new Date(dateFromUnixTime), "h aaa"),
    currTemp: !tempIsObj ? weatherObj.temp : weatherObj.temp.day,
    minTemp: !tempIsObj ? weatherObj.temp : weatherObj.temp.min,
    maxTemp: !tempIsObj ? weatherObj.temp : weatherObj.temp.max,
    precipProb: weatherObj.pop || 0,
    humidity: weatherObj.humidity,
    windSpeed: weatherObj.wind_speed,
    visibility: weatherObj.visibility,
    weatherInfo: weatherObj.weather[0],
  };
}

export {
  isValidCity,
  getCoords,
  getLocationName,
  isObject,
  filterData,
  reformateData,
  toTitleCase,
  getCorrectUnitFormat,
  updateSessionCache,
};
