const dragScrolling = (function () {
  const hourlyWeatherContainer = document.getElementById("hourly-weather");
  const dailyWeatherContainer = document.getElementById("daily-weather");

  let grabbing = false;

  [hourlyWeatherContainer, dailyWeatherContainer].forEach((container) => {
    container.addEventListener("mousedown", (e) => {
      grabbing = true;
    });

    container.addEventListener("mouseup", () => {
      grabbing = false;
    });

    container.addEventListener("mouseleave", () => {
      grabbing = false;
    });

    container.addEventListener("mousemove", (e) => {
      if (grabbing) {
        if (
          container.scrollLeft - e.movementX <= 0 ||
          container.scrollLeft - e.movementX > container.scrollWidth - container.clientWidth
        )
          return;
        container.scrollBy(-e.movementX, 0);
      }
    });
  });
})();

export default dragScrolling;
