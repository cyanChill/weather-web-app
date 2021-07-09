/* Fetch API Functions For Weather Web App */


/* 
    Gets the coordinate of the inputted location using the arcgis geocode 
    api
*/
export async function fetchCoordinates(city, state) {
    state.replace(' ', '%20');
    const response = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?City=${city}&Region=${state}&countryCode=USA&maxLocations=1&outFields=address,location&f=pjson`);

    const data = await response.json();
    
    if (data.candidates.length == 0) {
        return null;
    }

    const dataset = data.candidates[0];
    // Returns address, latitude, longitude
    return [dataset.address, dataset.location.y, dataset.location.x];
}


/* 
    Get the forecast link data using the previously obtained longitude
    and latitude values
*/
export async function fetchWeatherLinks(latitude, longitude) {
    const response = await fetch(`https://api.weather.gov/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`);

    const data = await response.json();
    // Returns weekly forecast link
    return data.properties.forecast;
}


/* 
    Get the .json data from the obtained forecast link data, can use a 
    second argument containing '/hourly' to get the hourly forecast data 
*/
export async function fetchWeatherData(link, subdomain='') {
    let retry = 3;
    let response = await fetch(`${link}${subdomain}`);
    while (response.ok == false && retry > 0) {
        response = await fetch(`${link}${subdomain}`);
        retry--;
    }
    /*
    if (retry == 0) {
        return null;
    }
    */
    const data = await response.json();
    // Returns array of weather data
    if (data.properties.periods.length > 14) {
        return data.properties.periods.slice(0,24);
    }
    return data.properties.periods;
}