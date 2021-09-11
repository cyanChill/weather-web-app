function isValidCity(cityname) {
  const regex = /[a-z\-\s]/g;
  return regex.test(cityname);
}

function getCoords(weatherObj) {
  return [weatherObj.coord.lon, weatherObj.coord.lat];
}

function getLocationName(weatherObj) {
  /* Only for weatherObj from the currentWeather API call */
  return weatherObj.name;
}

function filterData() {
  /* 
    Use date-fns functions to do the date comparison stuff
    - Use it it filter out the information based on if it's after today
    
    - Or since the times are in unix time stamp, get our current unix time stamp and compare; returning the ones that are after 
  */
  return;
}

function reformateData(weatherObj) {
  /* 
    Input: Object from either "WEATHER_JSON.current" or on of the objects in the array of "WEATHER_JSON.hourly" or "WEATHER_JSON.daily"
  */
  /* 
    Things we want to reformate / return [prob use Array.map]:
    - Format "WEATHER_OBJ.dt" into the day (Monday, Tuesday, etc.) and the time (ie: 4:00 pm) [using date-fns]
    - Temp from "WEATHER_OBJ.temp" [For CURRENT & HOURLY]
    - Min & Max Temperature (be 2 different properties in our return object)
      - Min Temp from "WEATHER_OBJ.temp.min"
      - Max Temp from "WEATHER_OBJ.temp.max"
      - IMPORTANT TO CHECK TO SEE IF "WEATHER_OBJ.temp" is an object before doing this
    - Humidity from "WEATHER_OBJ.humidity"
    - Dew point from "WEATHER_OBJ.dew_point"
    - Wind speed from "WEATHER_OBJ.wind_speed"
    - Visibility from "WEATHER_OBJ.visibility"
    - Precipitation probability form "WEATHER_OBJ.pop"
    - Weather information from "WEATHER_OBJ.weather"

  */
  return;
}

export { isValidCity, getCoords, getLocationName, filterData, reformateData };
