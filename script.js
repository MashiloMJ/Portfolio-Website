const downloadCvButton = document.getElementById('downloadCv');
const weatherLocation = document.getElementById('weatherLocation');
const weatherDescription = document.getElementById('weatherDescription');
const weatherTemp = document.getElementById('weatherTemp');
const weatherDate = document.getElementById('weatherDate');

if (downloadCvButton) {
  downloadCvButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = 'files/cv.pdf';
    link.download = 'cv.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

const weatherCodeMap = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail'
};

function formatSouthAfricaDate(timezone) {
  const now = new Date();
  return now.toLocaleString('en-ZA', {
    timeZone: timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

function updateFooterWeather(locationLabel, code, temperature, timezone = 'Africa/Johannesburg') {
  if (weatherLocation) weatherLocation.textContent = locationLabel;
  if (weatherDescription) weatherDescription.textContent = `${weatherCodeMap[code] || 'Unknown weather'} (${code})`;
  if (weatherTemp) weatherTemp.textContent = `${temperature.toFixed(1)}°C`;
  if (weatherDate) weatherDate.textContent = formatSouthAfricaDate(timezone);
}

function fetchWeather(latitude, longitude, label) {
  const timezone = 'Africa/Johannesburg';
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=${encodeURIComponent(timezone)}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.current_weather) {
        updateFooterWeather(label, data.current_weather.weathercode, data.current_weather.temperature, timezone);
      } else {
        updateFooterWeather(label, 0, 0, timezone);
        weatherDescription.textContent = 'Weather data not available.';
      }
    })
    .catch(() => {
      updateFooterWeather(label, 0, 0, timezone);
      weatherDescription.textContent = 'Unable to load weather information.';
    });
}

function loadWeather() {
  if (!navigator.geolocation) {
    updateFooterWeather('South Africa (default)', 0, 0);
    weatherDescription.textContent = 'Geolocation not supported; using default South African location.';
    weatherTemp.textContent = '';
    weatherDate.textContent = formatSouthAfricaDate('Africa/Johannesburg');
    fetchWeather(-26.2041, 28.0473, 'Johannesburg, South Africa');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeather(latitude, longitude, 'Your location');
    },
    () => {
      fetchWeather(-26.2041, 28.0473, 'Johannesburg, South Africa');
    },
    {
      timeout: 10000,
      maximumAge: 300000
    }
  );
}

loadWeather();
