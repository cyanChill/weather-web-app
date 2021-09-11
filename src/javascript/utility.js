import { getUnixTime, fromUnixTime, format } from "date-fns";

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

// Checks if something is an object
function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
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
    hour: format(new Date(dateFromUnixTime), "h':00' aaa"),
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

// Turn a string into title case
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.replace(word[0], word[0].toUpperCase()))
    .join(" ");
}

// Get the correct units for the inputted value in relation to current page settings
function getCorrectUnits(value, type) {
  const currentUnit = localStorage.getItem('unit') || "F";
  if (type === "temperature") {

  } else if (type === "wind-speed") {

  } else if (type === "visibility") {
    
  }
  return value;
}

export {
  isValidCity,
  getCoords,
  getLocationName,
  filterData,
  reformateData,
  toTitleCase,
  getCorrectUnits,
};
