/* For the sake of initializing the event listeners */
import forecastControlBtn from "./javascript/futureWeatherBtns";
import dragScrolling from "./javascript/dragScroll";
import units from "./javascript/unitButtons";
import pageTimer from "./javascript/pageTime";

import { updatePageContents } from "./javascript/pageUpdate";
import { updateSessionCache } from "./javascript/utility";
let location = localStorage.getItem("locationName") || "new york";

// Initialization
(async function () {
  units.showSelectedUnit();
  pageTimer.intialize();

  updatePageContents(location, { initialCall: true }).then((data) =>
    updateSessionCache("cachedInfo", data)
  );
})();

/* Form Submission */
const searchForm = document.getElementById("search-bar");
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  location = e.target["search-field"].value;

  const newRecievedInfo = updatePageContents(location);
  e.target.reset();

  if (newRecievedInfo) {
    updateSessionCache("cachedInfo", newRecievedInfo);
  }
});
