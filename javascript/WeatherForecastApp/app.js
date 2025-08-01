const API_KEY = 'Your-Api-Key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const currentTitle = document.getElementById('currentTitle');
const currentTemp = document.getElementById('currentTemp');
const currentIcon = document.getElementById('currentIcon');
const currentDesc = document.getElementById('currentDesc');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const currentDate = document.getElementById('currentDate');
const forecastContainer = document.getElementById('forecastContainer');

const weatherIcons = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
};

const weekDays = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

window.addEventListener('load', () => {
    getWeatherByCity('İstanbul');
});

// input şehir alma kısmı
async function searchWeather() {
    const cityName = cityInput.value.trim();
    if (!cityName) {
        alert('Lütfen bir şehir adı girin!');
        return;
    } 
    await getWeatherByCity(cityName); // Hava durumu getirme fonksiyonu
}

async function getWeatherByCity(cityName) {
    try {
        const geoResponse = await fetch(`${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
        
        if (!geoResponse.ok) {
            throw new Error('Şehir bulunamadı!');
        }
        
        const geoData = await geoResponse.json();
        const { lat, lon } = geoData.coord;
        
        await Promise.all([
            getCurrentWeather(lat, lon, cityName),
            getForecast(lat, lon)
        ]);
        
    } catch (error) {
        console.error('Hata:', error);
        alert('Hava durumu bilgisi alınamadı: ' + error.message);
    }
}

// anlık hava durumu getirme 
async function getCurrentWeather(lat, lon, cityName) {
    try {
        const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        
        currentTitle.textContent = `Current Weather in ${cityName}`;
        currentTemp.textContent = `${Math.round(data.main.temp)}°C`;
        currentIcon.textContent = weatherIcons[data.weather[0].icon] || '☁️';
        currentDesc.textContent = data.weather[0].description
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
        windSpeed.textContent = `Wind speed: ${data.wind.speed}km/h`;
        
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        currentDate.textContent = now.toLocaleDateString('en-US', options);
        
    } catch (error) {
        console.error('Mevcut hava durumu alınamadı:', error);
    }
}

// 5 günlük hava durumu
async function getForecast(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        const dailyForecasts = [];
        const processedDates = new Set();
        
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateString = date.toDateString(); 
            if (!processedDates.has(dateString) && dailyForecasts.length < 5) {
                const hour = date.getHours();
                if (hour >= 11 && hour <= 15) { 
                    dailyForecasts.push({
                        date: date,
                        temp: Math.round(item.main.temp),
                        icon: item.weather[0].icon,
                        description: item.weather[0].description
                    });
                    processedDates.add(dateString);
                }
            }
        });
        displayForecast(dailyForecasts);  
    } catch (error) {
        console.error('Hava durumu tahmini alınamadı:', error);
    }
}

// 5 günlük tahmini göster
function displayForecast(forecasts) {
    forecastContainer.innerHTML = '';
    
    forecasts.forEach(forecast => {
        const dayElement = document.createElement('div');
        dayElement.className = 'forecast-day';
        
        const dayName = weekDays[forecast.date.getDay()];
        const temp = `${forecast.temp}°C`;
        const icon = weatherIcons[forecast.icon] || '☁️';
        const description = forecast.description
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');   
        dayElement.innerHTML = `
            <div class="day-name">${dayName}</div>
            <div class="day-temp">${temp}</div>
            <div class="day-icon">${icon}</div>
            <div class="day-desc">${description}</div>
        `;     
        forecastContainer.appendChild(dayElement);
    });
}
