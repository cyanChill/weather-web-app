import { getCorrectUnits, toTitleCase } from "./utility";

function createWeatherCard(time, weatherObj) {
  const weatherCard = document.createElement("div");
  weatherCard.classList = "weather-card container-style";

  const timeLabel = document.createElement("p");
  timeLabel.classList = "time";
  timeLabel.textContent = time === "hour" ? weatherObj.hour : time === "day" ? weatherObj.day : "";

  const cardImg = document.createElement("img");
  const description = toTitleCase(weatherObj.weatherInfo.description);
  cardImg.src = `images/${weatherObj.weatherInfo.icon}.png`;
  cardImg.alt = `${description} weather image`;
  cardImg.classList = "weather-img";

  const hourTempLabel = document.createElement("p");
  hourTempLabel.className = "hour-temp";
  hourTempLabel.textContent = getCorrectUnits(weatherObj.currTemp, "temperature");

  const tempHiLabel = document.createElement("p");
  tempHiLabel.classList = "temp-hi";
  tempHiLabel.textContent = getCorrectUnits(weatherObj.maxTemp, "temperature");

  const tempLowLabel = document.createElement("p");
  tempLowLabel.classList = "temp-low";
  tempLowLabel.textContent = getCorrectUnits(weatherObj.minTemp, "temperature");

  const precipLabel = document.createElement("p");
  precipLabel.classList = "precip";
  precipLabel.textContent = `${weatherObj.precipProb}%`;

  weatherCard.appendChild(timeLabel);
  weatherCard.appendChild(cardImg);
  if (time === "hour") {
    weatherCard.appendChild(hourTempLabel);
  } else if (time === "day") {
    weatherCard.appendChild(tempHiLabel);
    weatherCard.appendChild(tempLowLabel);
  }
  weatherCard.appendChild(precipLabel);

  return weatherCard;
}

export { createWeatherCard };
