import toastModule from "./toast";

import { getWeatherInfoFor } from "./apiFetch";
import { filterData, reformateData } from "./utility";
import { fillCurrTemp, fillLocationInfo, setDailyWidgets, setHourlyWidgets } from "./domElements";

async function updatePageContents(location, config) {
  const recievedInfo = await getWeatherInfoFor(location, { initialCall: true });

  if (!recievedInfo) return;

  const filteredHourly = filterData(recievedInfo.hourlyWeather);
  const filteredDaily = filterData(recievedInfo.dailyWeather);

  const formatedCurrent = reformateData(recievedInfo.currentWeather);
  const formatedHourly = filteredHourly.map((data) => reformateData(data));
  const formatedDaily = filteredDaily.map((data) => reformateData(data));

  fillCurrTemp(formatedCurrent);
  fillLocationInfo(recievedInfo.location, formatedCurrent);

  setHourlyWidgets(formatedHourly);
  setDailyWidgets(formatedDaily);

  localStorage.setItem("locationName", recievedInfo.location);

  if (!config.initialCall) {
    const msg = `Now displaying weather information for ${recievedInfo.location}.`;
    toastModule.displayToast(msg, "success");
  }

  return {
    ...recievedInfo,
    hourlyWeather: filteredHourly,
    dailyWeather: filteredDaily,
  };
}

export { updatePageContents };
