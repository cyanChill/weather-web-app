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
const celsiusradio = document.querySelector("#celsius");
const fahrenheitradio = document.querySelector("#fahrenheit");
const updatebanner = document.querySelector("#updateindicator");
const updateButton = document.querySelector("#updatebutton");

/* Global Variables */
let headerinterval;
let widgetinterval;
let tempunits;

/* Event Listeners */
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("location")) {
    defaultinitialization();
  }
  textfield.value = localStorage.getItem("location");
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
  localStorage.setItem("unit", this.dataset.unit);
  tempunits = this.dataset.unit;
  updateTemperature();
}

updateButton.addEventListener("click", () => {
  updateButton.setAttribute("disabled", "true");
  updateButtonActions();
});

async function startup() {
  updateHeader();
  calibrateHeaderUpdateInterval();

  fetchUnits();

  await updateHourlyWidgets(localStorage.getItem("forecastlink"));
  await updateWeeklyWidgets(localStorage.getItem("forecastlink"));
  calibrateWidgetUpdateInterval();

  console.log("Completed Web App Setup");
}

/* General Initialization Functions */
function defaultinitialization() {
  localStorage.setItem("location", "NYC, New York");
  localStorage.setItem("unit", "F");
  localStorage.setItem("forecastlink", "https://api.weather.gov/gridpoints/OKX/32,34/forecast");
}

function updateHeader() {
  const location = localStorage.getItem("location");
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
  await updateHourlyWidgets(localStorage.getItem("forecastlink"));
  await updateWeeklyWidgets(localStorage.getItem("forecastlink"));
}

function calibrateWidgetUpdateInterval() {
  const d = new Date();
  setTimeout(async () => {
    updateWidgets();
    widgetinterval = setInterval(updateWidgets, 3600000);
  }, (60 - d.getMinutes()) * 60000);
}

function fetchUnits() {
  if (localStorage.getItem("unit") == "F") {
    celsiusradio.removeAttribute("checked");
    fahrenheitradio.setAttribute("checked", "true");
    tempunits = "F";
  } else {
    fahrenheitradio.removeAttribute("checked");
    celsiusradio.setAttribute("checked", "true");
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
  if (txtcontents.length != 2) {
    return updateBanner("error", "Error: Invalid Location");
  }
  const city = txtcontents[0].replace(" ", "%20");
  const region = txtcontents[1].trim().toLowerCase();
  let coordresults, forecastlink;

  if (!states.includes(region)) {
    return updateBanner("error", "Error: Invalid Location");
  }

  updatebanner.classList.add("hidden");

  coordresults = await fetchCoordinates(city, region);
  if (coordresults == null) {
    return updateBanner("error", "Error: Failed to Fetch Location");
  }

  if (coordresults[0] == localStorage.getItem("location")) {
    return updateBanner("error", "Error: Same Location");
  }
  localStorage.setItem("location", coordresults[0]);

  forecastlink = await fetchWeatherLinks(coordresults[1], coordresults[2]);
  localStorage.setItem("forecastlink", forecastlink);

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
  /*
    localStorage.setItem('hourlyWidgets', hourlytab.innerHTML);
    localStorage.setItem('lastupdate', `${date.toDateString()} ${date.getHours()}`);
    */
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
  /*
    localStorage.setItem('weeklyWidgets', weeklytab.innerHTML);
    localStorage.setItem('lastupdate', `${currdate.toDateString()} ${currdate.getHours()}`);
    */
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
