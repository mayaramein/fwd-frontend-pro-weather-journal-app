const API_key = '&appid=c63dac31932c09755c4bd095c7c7b524';
const API_base = 'https://api.openweathermap.org/data/2.5/weather?'

/* Global Variables */
const zipCode = document.getElementById('zip');
const feelings = document.getElementById('feelings');
const country = document.getElementById('country');
const generate = document.getElementById('generate');
const dateEntry = document.getElementById('date');
const tempEntry = document.getElementById('temp');
const contentEntry = document.getElementById('content');

const modalContainer = document.querySelector('.modal_container');
const modal = document.querySelector('.modal p');
const modal_close = document.querySelector('.modal_close');

const userData = {};
let errors = '';

console.log(zipCode.value, country.value, feelings.value);

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

const postData = async (url = '', data = {}) => {
    console.log(data);
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        console.log(newData);
        return newData;
    } catch (error) {
        console.log("error", error);
        generateModal('Something went wrong please try again later.')
    }
}

const checkIsInvalid = () => {
    const invalidZipCode = zipCode.value == '' || isNaN(Number(zipCode.value));
    const invalidFeeling = feelings.value.trim().length < 3;
    const invalidCountryCode = (country.value.trim().length != 2 || country.value.match(/[0-9]/g) != null);

    if (invalidFeeling && invalidCountryCode && (invalidZipCode)) {
        errors = 'Add a valid zip code number, two letters country code and describe your feeling';
        generateModal(errors);
        console.log(errors)
    } else if (invalidFeeling && invalidCountryCode) {
        errors = 'Describe your feeling and add two letters country code';
        generateModal(errors);
        console.log(errors)
    } else if (invalidCountryCode) {
        errors = 'Enter a valid two letters country code';
        generateModal(errors);
        console.log(errors)
    } else if ((invalidZipCode)) {
        errors = 'Enter a valid zip code number';
        generateModal(errors);
        console.log(errors)
    } else if (invalidFeeling) {
        errors = 'Describe your feeling';
        generateModal(errors);
        console.log(errors)
    } else if ((invalidZipCode) && invalidCountryCode) {
        errors = 'Enter a valid zip code number andtwo letters country code';
        generateModal(errors);
        console.log(errors)
    } else {
        errors = '';
    }
}

const getWeatherData = async (url = '', data = {}) => {
    checkIsInvalid();

    if (errors == '') {
       const zipCode = `zip=${zipCode.value},`;
       const country_code = `${(country.value).toLowerCase()}`;
        const response = await fetch(API_base+zipCode+country_code+API_key);

        try {
            const newData = await response.json();
            console.log(newData);

             // set the input data to post them
            userData.zipCode = zipCode.value;
            userData.country = country.value;
            userData.feelings = feelings.value;
            userData.temperature = `${(newData.main.temp - 273.15).toFixed(1)} °C`;
            userData.date = newDate;

            console.log(userData);
            // post data to server
            postData('/projectData', userData).then(updateUI('/projectData'))

            return newData;

        } catch (error) {
            console.log("error", error);
            generateModal('Something went wrong, try again later.')
        }
    }
}

const updateUI = async(url = '', data = {}) => {
    const response = await fetch(url);
    try {
        const newData = await response.json();
        dateEntry.innerHTML = newData.date;
        tempEntry.innerHTML =  newData.temperature;
        contentEntry.innerHTML = `<p>country ${newData.country}.</p> <p>feelings: ${newData.feelings}</p> <p>zipCode: ${newData.zipCode}</p>`
        console.log('UI', newData);

    } catch (error) {
        console.log("error", error);
        generateModal('Something went wrong, try again later.')
    }

}

generate.addEventListener('click', getWeatherData)

const generateModal = (errormsg) => {
    modal.innerHTML = errormsg;
    modalContainer.style.display = 'block';
}

modal_close.addEventListener('click', (e) => {
    modalContainer.style.display = 'none';
})