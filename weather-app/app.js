document.getElementById('getWeatherBtn').addEventListener('click', function() {
    let city = document.getElementById('cityInput').value;
    getWeather(city);
    saveCity(city);
});

document.getElementById('getForecastBtn').addEventListener('click', function() {
    let city = document.getElementById('cityInput').value;
    getForecast(city);
});

function getWeather(city) {
    const apiKey = '0faa2fffbd7850892811bcbdad1eec91'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404") {
                alert("Город не найден");
                return;
            }
            document.getElementById('cityName').innerText = `Погода в ${data.name}`;
            document.getElementById('temperature').innerText = `Температура: ${data.main.temp}°C`;
            document.getElementById('description').innerText = `Описание: ${data.weather[0].description}`;
        })
        .catch(error => {
            alert("Ошибка при получении данных");
            console.error(error);
        });
}

function getForecast(city) {
    const apiKey = '0faa2fffbd7850892811bcbdad1eec91';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=ru`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let forecastHtml = '';
            const forecasts = {};

            // Сохраняем прогнозы по датам
            data.list.forEach(item => {
                const date = new Date(item.dt * 1000).toLocaleDateString('ru-RU');
                if (!forecasts[date]) {
                    forecasts[date] = [];
                }
                forecasts[date].push({
                    temp: item.main.temp,
                    description: item.weather[0].description
                });
            });

            // Формируем HTML для прогноза
            for (const [date, values] of Object.entries(forecasts)) {
                const avgTemp = (values.reduce((sum, value) => sum + value.temp, 0) / values.length).toFixed(2);
                const description = values[0].description; // Или можно добавить дополнительную логику
                forecastHtml += `${date}: ${avgTemp}°C, ${description}<br>`;
            }

            document.getElementById('forecast').innerHTML = forecastHtml;
        })
        .catch(error => {
            alert("Ошибка при получении прогноза");
            console.error(error);
        });
}

function saveCity(city) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem('cities', JSON.stringify(cities));
        displayCities();
    }
}

function displayCities() {
    const citiesList = document.getElementById('citiesList');
    citiesList.innerHTML = ''; // Очищаем предыдущий список

    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        citiesList.appendChild(li);
    });
}

// Отображаем города при загрузке страницы
window.onload = displayCities;