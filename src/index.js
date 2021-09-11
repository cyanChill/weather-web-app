/* Section for hourly */

/* Section for 7-day */

/* 
    Icon attribute 
    <div>Icons made by <a href="https://www.flaticon.com/authors/kirill-kazachek" title="Kirill Kazachek">Kirill Kazachek</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
*/

import { getWeatherInfoFor } from "./javascript/apiFetch";

(async function () {
  const recievedInfo = await getWeatherInfoFor("new york");

  console.log(recievedInfo);
})();

/* 
    Listen to form submit 
    - Pass query to "fetchWeather"
    - From that, do manipulation to get correct info on hourly and daily weather
*/
