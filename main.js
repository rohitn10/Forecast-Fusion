// main.js

const searchButton = document.getElementById('search-button');
const searchBox = document.querySelector('.search-box');
const cityElement = document.querySelector('.city');
const dateElement = document.querySelector('.date');
const temperatureElement = document.querySelector('.temperature');
const weatherElement = document.querySelector('.weather');
const hiLowElement = document.querySelector('.hi-low');
const autocompleteElement = document.getElementById('autocomplete-options');

// Function to update the UI with weather data
function updateUI(weatherData)
{
    cityElement.textContent = `${weatherData.name}, ${weatherData.sys.country}`;

    const currentDate = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    dateElement.textContent = currentDate.toLocaleDateString('en-US', options);

    temperatureElement.innerHTML = `${Math.round(weatherData.main.temp)}<span>°F</span>`;
    weatherElement.textContent = weatherData.weather[0].description;
    hiLowElement.textContent = `H:${Math.round(weatherData.main.temp_max)}° L:${Math.round(weatherData.main.temp_min)}°`;

    // Clear the search box
    searchBox.value = '';
}

// Function to fetch weather data
async function fetchWeatherData(city) {
    if (!city) return;

    const apiKey = 'd43ea3992ddf8f58f414d6988a84e044';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    //const weatherCondition = weatherData.weather[0].main;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            updateUI(data);
        } else {
            console.error('Error fetching weather data:', data.message);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Event listener for search button click
searchButton.addEventListener('click', () => {
    const city = searchBox.value.trim();
    fetchWeatherData(city);
});

// Event listener for Enter key press in the search box
searchBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const city = searchBox.value.trim();
        fetchWeatherData(city);
    }
});

// Initial weather data for a default city
async function fetchDefaultWeatherData() {
    const defaultCity = 'Gainesville';
    fetchWeatherData(defaultCity);
}

// Update the event listener for the search box keypress event
searchBox.addEventListener('input', async () => {
    const input = searchBox.value.trim();

    if (input.length >= 2) { // Only start fetching options when user types at least 2 characters
        const apiKey = 'd43ea3992ddf8f58f414d6988a84e044';
        const optionsApiUrl = `https://api.openweathermap.org/data/2.5/find?q=${input}&units=imperial&appid=${apiKey}`;

        try {
            const response = await fetch(optionsApiUrl);
            const data = await response.json();
            if (response.ok) {
                autocompleteOptions.innerHTML = ''; // Clear previous options
                data.list.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.name;
                    autocompleteOptions.appendChild(option);
                });
            } else {
                console.error('Error fetching autocomplete options:', data.message);
            }
        } catch (error) {
            console.error('Error fetching autocomplete options:', error);
        }
    } else {
        autocompleteOptions.innerHTML = ''; // Clear options when input is less than 2 characters
    }
});

/*async function fetchBackgroundImage(weatherCondition) {
    const pexelsApiKey = 'Uz1sFnJiSZu3iKYarLHQfHJ4MZG1qfnj9jMDqj8NySr76q8Sgt3ItuTx';

    // Map weather conditions to Pexels search keywords
    const weatherKeywords = {
        Clear: 'sunny',
        Clouds: 'cloudy',
        Rain: 'rainy',
        Thunderstorms: 'thunder'
        // Add more mappings as needed
    };

    const searchKeyword = weatherKeywords[weatherCondition] || 'landscape'; // Default to 'landscape' if no mapping is found

    try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${searchKeyword}&per_page=1&page=${Math.floor(Math.random() * 100) + 1}`, {
            headers: {
                Authorization: `Bearer ${pexelsApiKey}`,
            },
        });
        const data = await response.json();

        if (response.ok && data.photos && data.photos.length > 0) {
            const randomImage = data.photos[0];
            const backgroundImageUrl = randomImage.src.original;

            // Set the background image
            document.body.style.backgroundImage = `url('${backgroundImageUrl}')`;
        } else {
            console.error('Error fetching background image:', data);
        }
    } catch (error) {
        console.error('Error fetching background image:', error);
    }
}*/

// Fetch initial weather data
fetchDefaultWeatherData();

// After updating the UI, call fetchBackgroundImage
//fetchBackgroundImage(weatherCondition);