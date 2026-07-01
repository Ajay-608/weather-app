export default function WeatherCard({ weather }) {
  const { name, sys, main, weather: weatherInfo, wind, visibility } = weather;
  const icon = weatherInfo[0].icon;
  const description = weatherInfo[0].description;

  const formatTime = (unix) => new Date(unix * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const getHeatLevel = (temp) => {
    if (temp > 35) return { level: "Extreme", color: "#FF4444" };
    if (temp > 30) return { level: "High", color: "#FF8800" };
    if (temp > 20) return { level: "Moderate", color: "#FFCC00" };
    return { level: "Low", color: "#44CC44" };
  };

  const heatInfo = getHeatLevel(main.temp);

  return (
    <div className="weather-card glass-card">
      <div className="weather-card-top">
        <div className="weather-location">
          <h2 className="city-name">{name}</h2>
          <span className="country-badge">{sys.country}</span>
          <p className="weather-desc">{description}</p>
          <p className="weather-date">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="weather-icon-wrapper">
          <img src={`https://openweathermap.org/img/wn/${icon}@4x.png`} alt={description} className="weather-icon-large" />
        </div>
      </div>

      <div className="temp-display">
        <span className="temp-main">{Math.round(main.temp)}°</span>
        <span className="temp-unit">C</span>
        <span className="feels-like">Feels like {Math.round(main.feels_like)}°C</span>
      </div>

      <div className="weather-stats">
        {[
          { icon: "💧", value: `${main.humidity}%`, label: "Humidity" },
          { icon: "💨", value: `${wind.speed} m/s`, label: "Wind Speed" },
          { icon: "👁️", value: `${(visibility / 1000).toFixed(1)} km`, label: "Visibility" },
          { icon: "🌡️", value: `${main.pressure} hPa`, label: "Pressure" },
          { icon: "🌅", value: formatTime(sys.sunrise), label: "Sunrise" },
          { icon: "🌇", value: formatTime(sys.sunset), label: "Sunset" },
          { icon: "🔥", value: heatInfo.level, label: "Heat Level", color: heatInfo.color },
          { icon: "❄️", value: `${Math.round(main.temp_min)}° / ${Math.round(main.temp_max)}°`, label: "Min / Max" },
        ].map((stat, i) => (
          <div key={i} className="stat-item">
            <span className="stat-icon">{stat.icon}</span>
            <span className="stat-value" style={stat.color ? { color: stat.color } : {}}>{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}