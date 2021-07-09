/* Utility Functions For Weather Web App */


/* 
    Get date in format year-month-day where year is 4-digits, month & day
    are 2-digits
*/
export function getYearMonthDay() {
    const d = new Date();
    let [year, month, day] = [d.getFullYear(), d.getMonth(), d.getDate()];
    month++;
    if (month < 10) {
        month = `0${month}`;
    }
    if (day < 10) {
        day = `0${day}`;
    }
    return `${year}-${month}-${day}`;
}


/* 
    Create the string used for the "temp" class div containing the tempearture
    of the widget
*/
export function correctTemp(temp) {
    /* temp is in Fahrenheit*/
    const unit = localStorage.getItem('unit');
    if (unit == 'F') {
        return `${temp}&deg;F`
    }
    temp = (temp - 32) * 5 / 9;
    return `${Math.round(temp)}&deg;C`
}


/* 
    Get all elements with "temp" class do conversions if the new temperature 
    unit is different than the old temperature unit 
*/
export function updateTemperature() {
    const currUnit = localStorage.getItem('unit');
    const tempArray = document.querySelectorAll('.temp');
    const prevUnit = tempArray[0].innerHTML.split('°')[1];
    if (currUnit == prevUnit) {
        return false;
    }
    tempArray.forEach(entry => {
        let temp = entry.innerHTML.split('°')[0];
        if (currUnit == 'C') {
            temp = (temp - 32) * 5 / 9;
            entry.innerHTML = `${Math.round(temp)}&deg;C`;
        } else {
            temp = (temp * 9 / 5) + 32;
            entry.innerHTML = `${Math.round(temp)}&deg;F`;
        }
    });
    console.log(`Updated previous temperature in ${prevUnit} into ${currUnit}.`)
}