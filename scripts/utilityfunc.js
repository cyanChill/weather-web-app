/* Utility Functions For Weather Web App */

export function getNiceDate() {
  const d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() < 9 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
  let day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
  let hour = d.getHours();
  let niceHour = hour < 9 ? hour + 1 : hour;
  let minutes = d.getMinutes() + 1;
  let niceMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return { year, month, day, hour, niceHour, minutes, niceMinutes };
}

/* 
    Create the string used for the "temp" class div containing the tempearture
    of the widget
*/
export function correctTemp(temp) {
  /* temp is in Fahrenheit*/
  const unit = localStorage.getItem("unit");
  if (unit == "F") {
    return `${temp}&deg;F`;
  }
  temp = ((temp - 32) * 5) / 9;
  return `${Math.round(temp)}&deg;C`;
}

/* 
    Get all elements with "temp" class do conversions if the new temperature 
    unit is different than the old temperature unit 
*/
export function updateTemperature() {
  const currUnit = localStorage.getItem("unit");
  const tempArray = document.querySelectorAll(".temp");
  const prevUnit = tempArray[0].innerHTML.split("°")[1];
  if (currUnit == prevUnit) {
    return false;
  }
  tempArray.forEach((entry) => {
    let temp = entry.innerHTML.split("°")[0];
    if (currUnit == "C") {
      temp = ((temp - 32) * 5) / 9;
      entry.innerHTML = `${Math.round(temp)}&deg;C`;
    } else {
      temp = (temp * 9) / 5 + 32;
      entry.innerHTML = `${Math.round(temp)}&deg;F`;
    }
  });
  console.log(`Updated previous temperature in ${prevUnit} into ${currUnit}.`);
}
