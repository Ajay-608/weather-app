export default function ForecastCard({ forecast }) {
  const dailyForecasts = forecast.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  ).slice(0, 5);

  const getDayName = (dt_txt) => new Date(dt_txt).toLocaleDateString("en-US", { weekday: "short" });
  const getDate = (dt_txt) => new Date(dt_txt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="forecast-section">
      <h3 className="section-title"><span>📅</span> 5-Day Forecast</h3>
      <div className="forecast-grid">
        {dailyForecasts.map((item, index) => (
          <div key={index} className="forecast-card glass-card">
            <span className="forecast-day">{getDayName(item.dt_txt)}</span>
            <span className="forecast-date">{getDate(item.dt_txt)}</span>
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt={item.weather[0].description}
              className="forecast-icon"
            />
            <span className="forecast-desc">{item.weather[0].description}</span>
            <div className="forecast-temps">
              <span className="forecast-temp-max">{Math.round(item.main.temp_max)}°</span>
              <span className="forecast-temp-min">{Math.round(item.main.temp_min)}°</span>
            </div>
            <div className="forecast-details">
              <span>💧 {item.main.humidity}%</span>
              <span>💨 {item.wind.speed}m/s</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}