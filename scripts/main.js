import { getYearMonthDay, correctTemp, updateTemperature } from "./utilityfunc.js";
import { fetchCoordinates, fetchWeatherLinks, fetchWeatherData } from "./apifetchfunc.js";
import { states, weatherStates } from "./const.js";

/* Page Header Element */
const locationheader = document.querySelector("#timeplace");

/* Selector Buttons Elements */
const tabBtns = document.querySelectorAll(".selectorbuttons");

/* Content Elements */
const hourlytab = document.querySelector("#hourlycontent");
const hourlymainwidget = document.querySelector("#hourlymainwidget");
const hourlyminorwidget = document.querySelector("#hourlyminorwidgets");
const weeklytab = document.querySelector("#weeklycontent");
const weeklymainwidget = document.querySelector("#weeklymainwidget");
const weeklyminorwidget = document.querySelector("#weeklyminorwidgets");
const settingstab = document.querySelector("#settingscontent");

/* Settings Page Elements */
const textfield = document.querySelector("#textinputfield");
const unitRadioBtns = document.querySelectorAll(".units");
const updatebanner = document.querySelector("#updateindicator");
const updateButton = document.querySelector("#updatebutton");

/* Global Variables */
let headerinterval;
let widgetinterval;
let tempunits = "F";
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
    hourlytab.classList.remove("hidden");
  } else if (currentTab === "weekly") {
    weeklytab.classList.remove("hidden");
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
  tempunits = this.dataset.unit;
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

  await updateHourlyWidgets(forecastLink);
  await updateWeeklyWidgets(forecastLink);
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
  await updateHourlyWidgets(forecastLink);
  await updateWeeklyWidgets(forecastLink);
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
    tempunits = "C";
  }
}

/* Prepare for Visual Change */
function clearVisuals() {
  tabBtns.forEach((tab) => {
    tab.classList.remove("selected");
  });
  hourlytab.classList.add("hidden");
  weeklytab.classList.add("hidden");
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
  await updateHourlyWidgets(forecastlink);
  await updateWeeklyWidgets(forecastlink);

  return updateBanner("success", "Updated Location Successfully!");
}

async function updateHourlyWidgets(link) {
  const weatherdata = await fetchWeatherData(link, "/hourly");
  const d = getYearMonthDay();
  const date = new Date();

  let mainwidget = false;
  hourlymainwidget.innerHTML = "";
  hourlyminorwidget.innerHTML = "";

  let total = 0;

  weatherdata.every((entry) => {
    const startTime = entry.startTime.slice(0, 16).split("T");
    if (
      (startTime[0] == d && date.getHours() > parseInt(startTime[1].slice(0, 2))) ||
      (total == 0 && startTime[0] != d)
    ) {
      /* Filter out the times that passed already*/
      return true;
    }

    if (startTime[0] == d || total < 12) {
      const temp = entry.temperature;
      const weatherSummary = entry.shortForecast;
      const isDaytime = entry.isDaytime;
      const d = new Date(entry.startTime);
      const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const action = createWeatherWidget(
        [hourlymainwidget, hourlyminorwidget],
        time,
        mainwidget,
        temp,
        weatherSummary,
        "",
        isDaytime
      );

      if (action == 2) {
        mainwidget = true;
      }
      total++;
      return true;
    }
  });
  console.log(
    `Updated Hourly Widgets ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  );
}

async function updateWeeklyWidgets(link) {
  const unfilteredweatherdata = await fetchWeatherData(link);
  const d = getYearMonthDay();
  const currdate = new Date();
  const weatherdata = unfilteredweatherdata.filter((entry) => {
    const date = entry.startTime.slice(0, 10);
    return entry.name.toLowerCase().indexOf("night") == -1 && date != d;
  });

  let mainwidget = false;
  weeklymainwidget.innerHTML = "";
  weeklyminorwidget.innerHTML = "";

  weatherdata.forEach((entry) => {
    let date = new Date(entry.startTime);
    date = date.toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" });
    const temp = entry.temperature;
    const weatherSummary = entry.shortForecast;
    const detailSummary = entry.detailedForecast;
    let precipitation = "0%";
    if (detailSummary.toLowerCase().indexOf("precipitation") != -1) {
      precipitation = detailSummary.split("precipitation is ")[1].split(".")[0];
    }

    const action = createWeatherWidget(
      [weeklymainwidget, weeklyminorwidget],
      date,
      mainwidget,
      temp,
      weatherSummary,
      precipitation
    );
    if (action == 2) {
      mainwidget = true;
    }
  });

  console.log(
    `Updated Weekly Widgets ${currdate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`
  );
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
  const divDT = document.createElement("div");
  const [pDate, pTemp, pSum, pPre] = [
    document.createElement("p"),
    document.createElement("p"),
    document.createElement("p"),
    document.createElement("p"),
  ];

  if (!mainwidget) {
    divwidget.classList.add("bigwidget");
  } else {
    divwidget.classList.add("smallwidget");
  }
  divDT.classList.add("datetemp");

  pDate.classList.add("date");
  pDate.innerHTML = date;
  pTemp.classList.add("temp");
  pTemp.innerHTML = correctTemp(temp);
  divDT.append(pDate, pTemp);

  pSum.classList.add("weathersummary");
  pSum.innerHTML = weatherSummary;

  divwidget.classList.add(defineBackground(weatherSummary, isDayTime));

  if (precipitation != "" && precipitation != "0%") {
    pPre.classList.add("precipitation");
    pPre.innerHTML = `Precipitation: ${precipitation}`;
    divwidget.append(divDT, pSum, pPre);
  } else {
    divwidget.classList.add("noprecip");
    divwidget.append(divDT, pSum);
  }

  if (!mainwidget) {
    widgettype[0].append(divwidget);
    return 2;
  } else {
    widgettype[1].append(divwidget);
    return 1;
  }
}

function defineBackground(weatherSummary, isDayTime) {
  let result = "";
  let weatherSum = weatherSummary.toLowerCase();

  weatherStates.forEach((entry) => {
    if (typeof entry == "string") {
      if (weatherSum.indexOf(entry) != -1) {
        result += entry;
      }
    } else {
      let include = 0;
      entry.forEach((entry2) => {
        if (weatherSum.indexOf(entry2) != -1) {
          include++;
        }
      });
      if (include > 0) {
        result += entry[0];
      }
    }
  });

  if (isDayTime == true) {
    return `${result}day`;
  }
  return `${result}night`;
}
