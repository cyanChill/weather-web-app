/* Code that handles displaying the "future" weather data [hourly & daily weather] */

const forecastControlBtn = (function () {
  const hourlyBtn = document.getElementById("hourly");
  const dailyBtn = document.getElementById("daily");

  const hourlyData = document.getElementById("hourly-weather");
  const dailyData = document.getElementById("daily-weather");

  hourlyBtn.addEventListener("click", () => {
    showWeatherData("hourly");
  });

  dailyBtn.addEventListener("click", () => {
    showWeatherData("daily");
  });

  function showWeatherData(type) {
    hourlyData.classList.add("hidden");
    dailyData.classList.add("hidden");
    hourlyBtn.classList.remove("selected");
    dailyBtn.classList.remove("selected");

    if (type === "hourly") {
      hourlyBtn.classList.add("selected");
      hourlyData.classList.remove("hidden");
    } else if (type === "daily") {
      dailyBtn.classList.add("selected");
      dailyData.classList.remove("hidden");
    }
  }
})();

export default forecastControlBtn;
