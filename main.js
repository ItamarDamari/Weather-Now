"use strict";

(function () {

    // Access to button and click event:
    const chooseCityBtn = document.getElementById("chooseCityBtn");
    chooseCityBtn.addEventListener("click", displayRemoteData);

    // Access to input and enter event:
    const cityBox = document.getElementById("cityBox");
    cityBox.addEventListener("keypress", event => event = event.key === "Enter" ? displayRemoteData() : false)
    cityBox.focus();
    
    async function displayRemoteData() {
        try {

            // Validate input:
            validateCity(cityBox.value);
            
            // Display spinner when data loading:
            getSpinnerButton();
            
            // Get weather as object:
            const apiKey = `61a08a3f5f24486095b205705230712`;
            const weather = await getJson(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityBox.value}`);
            
            // Display weather:
            displayWeather(weather);
            
            // Hiding spinner when data loading:
            hideSpinnerButton();
            
            // Clear input:
            cityBox.value = "";

            // Remove focus from city box:
            cityBox.blur();
        }
        catch (err) {
            // If input word not correct:
            if (err.message === "Cannot read properties of undefined (reading 'condition')") {
                // Hiding spinner when data loading:
                hideSpinnerButton();

                setTimeout(()=>alert("Error: Enter an exact city name (Spell the word correctly)."), 100);
                cityBox.focus();
                return;
            }
            if (err.message === "Failed to fetch") {
                setTimeout(()=>alert("Error: Unstable connection."), 100);
                // Hiding spinner when data loading:
                hideSpinnerButton();
                cityBox.focus();
                return;
            }
            
            setTimeout(()=>alert("Error: Some error! Please try again." + err.message), 100);
            hideSpinnerButton();
            cityBox.focus();
        }
    }

    // Json fetch function:
    async function getJson(url) {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }

    // Validate input:
    function validateCity(city) {
        if (city === "") throw new Error("Fill a city.");
        if (!isNaN(city)) throw new Error("City must be a word.");
    }

    // Display weather:
    function displayWeather(weather) {

        const weatherNow = document.getElementById("weatherNow");

        let html = `
            <div class="card-body">
                <img class="card-title" id="weatherIcon" src="${weather.current.condition.icon}"></img>
                <div id="temperatureBox">${weather.current.temp_c}&#8451;</div>
                <div id="cloudDescription">${weather.current.condition.text}</div>
                <a class="icon-link icon-link-hover" id="locationIcon" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-geo-alt">
                        <path
                            d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                    </svg>
                    <span class="card-text" id="cityCountryBox">${weather.location.name} ${weather.location.country}</span><br>
                </a>
            </div>
            <div class="cardFeelLikeHumidity">
                <div class="feelLike">
                    <img class="card-title" id="temperatureIcon" src="assets/images/Feel like.png" width="30px"></img>
                    <span id="feelsLikeBox">${weather.current.feelslike_c}&#8451;</span><br>
                    <span>Feels like</span>
                </div>
                <div class="borderBetween"></div>
                <div class="humidity">
                    <img class="card-title" src="assets/images/Humidity.png" width="30px"></img>
                    <span id="humidityBox">${weather.current.humidity}%</span><br>
                    <span>Humidity</span>
                </div>
            </div>
        `;
        weatherNow.innerHTML = html;
    }

    // Get spinner when await for data from API:
    function getSpinnerButton() {
        const chooseCityBtn = document.getElementById("chooseCityBtn");
        if(chooseCityBtn.innerText === "Check Weather") {
            chooseCityBtn.innerHTML = `
                <span class="spinner-grow spinner-grow-sm text-secondary" role="status" aria-hidden="true"></span>
                <span class="sr-only text-secondary" id="chooseCityBtn">Loading...</span>
                `;
        }
        else 
            chooseCityBtn.innerHTML = `Check Weather`;
    }

    // Hide spinner:
    function hideSpinnerButton() {
        const chooseCityBtn = document.getElementById("chooseCityBtn");
        chooseCityBtn.innerHTML = `Check Weather`;
    }
})();