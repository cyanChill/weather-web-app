import { getCorrectUnitFormat } from "./utility";

/* Code that handles updating the units used */
const units = (function () {
  const fahrenheitBtn = document.getElementById("fahrenheit");
  const celsiusBtn = document.getElementById("celsius");

  fahrenheitBtn.addEventListener("click", () => {
    updateUnit("F");
  });

  celsiusBtn.addEventListener("click", () => {
    updateUnit("C");
  });

  function updateUnit(unit) {
    if (localStorage.getItem("unit") === unit) return;

    localStorage.setItem("unit", unit);
    showSelectedUnit();
    updateDOMUnits();
  }

  function showSelectedUnit() {
    const unit = localStorage.getItem("unit");
    fahrenheitBtn.classList.remove("selected");
    celsiusBtn.classList.remove("selected");
    if (unit === "F") fahrenheitBtn.classList.add("selected");
    else celsiusBtn.classList.add("selected");
  }

  async function updateDOMUnits() {
    const windSpeedSec = document.querySelector("#wind-speed .value");
    const windSpeedVal = +windSpeedSec.textContent.match(/\d+\.?\d*/)[0];
    windSpeedSec.textContent = getCorrectUnitFormat(windSpeedVal, "wind-speed");

    const tempSec = document.querySelector("#curr-temp .temp");
    const tempVal = +tempSec.textContent.split("°")[0];
    tempSec.textContent = getCorrectUnitFormat(tempVal, "temperature");

    const hourTempeartures = document.querySelectorAll(".hour-temp");
    const lowTempeartures = document.querySelectorAll(".temp-low");
    const hiTempeartures = document.querySelectorAll(".temp-hi");

    massUpdateTemps([hourTempeartures, lowTempeartures, hiTempeartures]);
  }

  function massUpdateTemps(tempItemNodesGroups) {
    if (!Array.isArray(tempItemNodesGroups)) tempItemNodesGroups = [tempItemNodesGroups];

    tempItemNodesGroups.forEach((tempType) => {
      tempType.forEach((temp) => {
        const val = +temp.textContent.split("°")[0];
        temp.textContent = getCorrectUnitFormat(val, "temperature");
      });
    });
  }

  return { showSelectedUnit };
})();

export default units;