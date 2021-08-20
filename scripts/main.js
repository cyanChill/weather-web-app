import { getNiceDate, correctTemp, updateTemperature } from "./utilityfunc.js";
import { fetchCoordinates, fetchWeatherLinks, fetchWeatherData } from "./apifetchfunc.js";
import { states, weatherStates } from "./const.js";

/* Page Header Element */
const locationheader = document.querySelector("#timeplace");

/* Selector Buttons Elements */
const tabBtns = document.querySelectorAll(".selectorbuttons");

/* Content Elements */
const hrtab = document.querySelector("#hourlycontent");
const hrmainwidget = document.querySelector("#hourlymainwidget");
const hrminorwidget = document.querySelector("#hourlyminorwidgets");
const wktab = document.querySelector("#weeklycontent");
const wkmainwidget = document.querySelector("#weeklymainwidget");
const wkminorwidget = document.querySelector("#weeklyminorwidgets");
const settingstab = document.querySelector("#settingscontent");

/* Settings Page Elements */
const textfield = document.querySelector("#textinputfield");
const unitRadioBtns = document.querySelectorAll(".units");
const updatebanner = document.querySelector("#updateindicator");
const updateButton = document.querySelector("#updatebutton");

/* Global Variables */
let headerinterval;
let widgetinterval;
let location = localStorage.getItem("location");
let forecastLink = localStorage.getItem("forecastlink");
let unit = localStorage.getItem("unit");

/* Event Listeners */
document.addEventListener("DOMContentLoaded", () => {
  if (!location) {
    defaultinitialization();
  }
  textfield.value = location;
  startup();
});

/* Selector Button Actions */
tabBtns.forEach((tab) => {
  tab.addEventListener("click", handleTabChange);
});

function handleTabChange() {
  clearVisuals();
  this.classList.add("selected");
  const currentTab = this.dataset.tab;
  if (currentTab === "hourly") {
    hrtab.classList.remove("hidden");
  } else if (currentTab === "weekly") {
    wktab.classList.remove("hidden");
  } else if (currentTab === "settings") {
    settingstab.classList.remove("hidden");
  }
}

/* Settings */
unitRadioBtns.forEach((radio) => {
  radio.addEventListener("click", updateTempUnit);
});

function updateTempUnit() {
  updateLocalStorage("unit", this.dataset.unit);
  updateTemperature();
}

updateButton.addEventListener("click", () => {
  updateButton.toggleAttribute("disabled");
  updateButtonActions();
});

async function startup() {
  updateHeader();
  calibrateHeaderUpdateInterval();

  fetchUnits();

  updateWidgets();
  calibrateWidgetUpdateInterval();

  console.log("Completed Web App Setup");
}

/* General Initialization Functions */
function defaultinitialization() {
  updateLocalStorage("location", "NYC, New York");
  updateLocalStorage("unit", "F");
  updateLocalStorage("forecastlink", "https://api.weather.gov/gridpoints/OKX/32,34/forecast");
}

function updateHeader() {
  const d = new Date();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  locationheader.innerHTML = `The time now is ${time}. Weather shown for ${location}.`;
}

function calibrateHeaderUpdateInterval() {
  const d = new Date();
  setTimeout(() => {
    updateHeader();
    headerinterval = setInterval(updateHeader, 60000);
  }, (60 - d.getSeconds()) * 1000);
}

async function updateWidgets() {
  await updateWeatherWidgets(forecastLink, "hourly");
  await updateWeatherWidgets(forecastLink, "weekly");
}

function calibrateWidgetUpdateInterval() {
  const d = new Date();
  setTimeout(async () => {
    updateWidgets();
    widgetinterval = setInterval(updateWidgets, 3600000);
  }, (60 - d.getMinutes()) * 60000);
}

function fetchUnits() {
  if (unit === "C") {
    unitRadioBtns.forEach((radio) => {
      radio.toggleAttribute("checked");
    });
  }
}

/* Prepare for Visual Change */
function clearVisuals() {
  tabBtns.forEach((tab) => {
    tab.classList.remove("selected");
  });
  hrtab.classList.add("hidden");
  wktab.classList.add("hidden");
  settingstab.classList.add("hidden");
}

/* Update Local Storage & Global Variable */
function updateLocalStorage(key, value) {
  localStorage.setItem(key, value);
  if (key === "location") {
    location = value;
  } else if (key === "forecastlink") {
    forecastLink = value;
  } else if (key === "unit") {
    unit = value;
  }
}

/* Settings Functions */
function updateBanner(status, msg) {
  updatebanner.innerHTML = msg;
  updatebanner.classList.remove("error", "success", "hidden");
  updatebanner.classList.add(status);
  updateButton.removeAttribute("disabled");
  return false;
}

async function updateButtonActions() {
  const txtcontents = textfield.value.split(",");
  const [city, state] = [txtcontents[0], txtcontents[1].trim().toLowerCase()];

  if (txtcontents.length != 2 || !states.includes(state)) {
    return updateBanner("error", "Error: Invalid Location");
  }
  updatebanner.classList.add("hidden");

  let coordresults = await fetchCoordinates(city, state);
  if (coordresults === null) {
    return updateBanner("error", "Error: Failed to Fetch Location");
  }
  if (coordresults[0] === location) {
    return updateBanner("error", "Error: Same Location");
  }
  updateLocalStorage("location", coordresults[0]);

  let forecastlink = await fetchWeatherLinks(coordresults[1], coordresults[2]);
  updateLocalStorage("forecastlink", forecastlink);

  updateHeader();
  await updateWidgets();

  return updateBanner("success", "Updated Location Successfully!");
}

function createWeatherWidget(
  widgettype,
  date,
  mainwidget,
  temp,
  weatherSummary,
  precipitation = "",
  isDayTime = true
) {
  const divwidget = document.createElement("div");
  const widgetType = !mainwidget ? "bigwidget" : "smallwidget";
  const widgetBkg = defineWidgetBkg(weatherSummary, isDayTime);
  const hasPrecip = precipitation != "" && precipitation != "0%" ? "" : "noprecip";
  divwidget.classList = `${widgetType} ${widgetBkg} ${hasPrecip}`;
  divwidget.innerHTML = `
    <div class="datetemp">
        <p class="date">${date}</p>
        <p class="temp">${correctTemp(temp)}</p>
    </div>
    <p class="weathersummary">${weatherSummary}</p>
    ${!hasPrecip ? `<p class="precipitation">Precipitation: ${precipitation}</p>` : ""}
  `;
  !mainwidget ? widgettype[0].append(divwidget) : widgettype[1].append(divwidget);
}

/* Returns a CSS Class Representing Weather Widget Background */
function defineWidgetBkg(weatherSummary, isDayTime) {
  let result = "";
  let weatherSum = weatherSummary.toLowerCase();

  weatherStates.forEach((entry) => {
    if (typeof entry == "string") {
      if (weatherSum.indexOf(entry) != -1) {
        result += entry;
      }
    } else {
      result += entry.some((arrEntry) => {
        return weatherSum.indexOf(arrEntry) != -1;
      })
        ? entry[0]
        : "";
    }
  });

  if (isDayTime == true) {
    return `${result}day`;
  }
  return `${result}night`;
}

async function updateWeatherWidgets(link, type = "") {
  const isHourly = type === "hourly";
  const subdomain = isHourly ? "/hourly" : "";

  let weatherdata = await fetchWeatherData(link, subdomain);
  const currDate = getNiceDate();
  const dateYMD = `${currDate.year}-${currDate.month}-${currDate.day}`;

  let mainwidget = false;
  if (isHourly) {
    hrmainwidget.innerHTML = "";
    hrminorwidget.innerHTML = "";
  } else {
    wkmainwidget.innerHTML = "";
    wkminorwidget.innerHTML = "";
  }

  /* Weekly Widget Exclusive */
  if (!isHourly) {
    const unfilteredweatherdata = weatherdata;
    weatherdata = unfilteredweatherdata.filter((entry) => {
      const date = entry.startTime.slice(0, 10);
      return entry.name.toLowerCase().indexOf("night") === -1 && date !== dateYMD && date > dateYMD;
    });
  }

  let widgetCnt = 0; /* Hourly Widget Exclusive */

  weatherdata.forEach((entry) => {
    const [startDate, startTime] = entry.startTime.slice(0, 16).split("T");
    const startHour = startTime.slice(0, 2);

    /* Skip entry if data is for current date but past hour or past date */
    if (
      (startDate === dateYMD && currDate.hour > parseInt(startHour)) ||
      (widgetCnt === 0 && startDate < dateYMD)
    ) {
      return;
    }

    if (startDate === dateYMD || widgetCnt < 12 || !isHourly) {
      const temp = entry.temperature;
      const weatherSummary = entry.shortForecast;
      const detailSummary = entry.detailedForecast.toLowerCase();
      const isDaytime = entry.isDaytime;
      let precipitation = "0%";

      // Get the percentage value from the detailed summary
      if (detailSummary.indexOf("precipitation") != -1) {
        precipitation = detailSummary.split("precipitation is ")[1].split(".")[0];
      }

      let date = new Date(entry.startTime);
      const dateStr = date.toLocaleDateString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const currTab = isHourly ? [hrmainwidget, hrminorwidget] : [wkmainwidget, wkminorwidget];
      const timeParam = isHourly ? timeStr : dateStr;
      const precipParam = isHourly ? "" : precipitation;

      createWeatherWidget(
        currTab,
        timeParam,
        mainwidget,
        temp,
        weatherSummary,
        precipParam,
        isDaytime
      );

      mainwidget = true;
      widgetCnt++;
    }
  });
  console.log(
    `Updated ${isHourly ? "Hourly" : "Weekly"} Widgets ${currDate.niceHour}:${currDate.niceMinutes}`
  );
}
