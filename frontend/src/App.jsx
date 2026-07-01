import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import WeatherHistory from "./components/WeatherHistory";
import MapView from "./components/MapView";
import PMABadge from "./components/PMABadge";
import "./App.css";

const API_BASE = "http://localhost:8000/api/weather";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [coords, setCoords] = useState(null);
  const [bgClass, setBgClass] = useState("bg-clear");

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/searches/`);
      setHistory(res.data);
    } catch (e) {
      console.error("History fetch error:", e);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const setBackground = (description) => {
    const desc = description?.toLowerCase() || "";
    if (desc.includes("rain") || desc.includes("drizzle")) setBgClass("bg-rain");
    else if (desc.includes("cloud")) setBgClass("bg-cloud");
    else if (desc.includes("snow")) setBgClass("bg-snow");
    else if (desc.includes("thunder")) setBgClass("bg-thunder");
    else if (desc.includes("clear")) setBgClass("bg-clear");
    else setBgClass("bg-default");
  };

  const handleSearch = async (location) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`${API_BASE}/current/?location=${location}`),
        axios.get(`${API_BASE}/forecast/?location=${location}`)
      ]);
      setWeather(weatherRes.data);
      setForecast(forecastRes.data);
      setCoords({ lat: weatherRes.data.coord.lat, lon: weatherRes.data.coord.lon });
      setBackground(weatherRes.data.weather[0].description);
      await axios.post(`${API_BASE}/searches/`, {
        location: weatherRes.data.name,
        country: weatherRes.data.sys.country,
        temperature: weatherRes.data.main.temp,
        feels_like: weatherRes.data.main.feels_like,
        humidity: weatherRes.data.main.humidity,
        wind_speed: weatherRes.data.wind.speed,
        description: weatherRes.data.weather[0].description,
        icon: weatherRes.data.weather[0].icon,
        latitude: weatherRes.data.coord.lat,
        longitude: weatherRes.data.coord.lon,
      });
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationDetect = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`${API_BASE}/current/?lat=${lat}&lon=${lon}`),
        axios.get(`${API_BASE}/forecast/?lat=${lat}&lon=${lon}`)
      ]);
      setWeather(weatherRes.data);
      setForecast(forecastRes.data);
      setCoords({ lat, lon });
      setBackground(weatherRes.data.weather[0].description);
      await axios.post(`${API_BASE}/searches/`, {
        location: weatherRes.data.name,
        country: weatherRes.data.sys.country,
        temperature: weatherRes.data.main.temp,
        feels_like: weatherRes.data.main.feels_like,
        humidity: weatherRes.data.main.humidity,
        wind_speed: weatherRes.data.wind.speed,
        description: weatherRes.data.weather[0].description,
        icon: weatherRes.data.weather[0].icon,
        latitude: lat,
        longitude: lon,
      });
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.error || "Could not get weather for your location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app ${bgClass}`}>
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} />
        ))}
      </div>

      <div className="container">
        <header className="header">
          <div className="header-left">
            <div className="logo">
              <span className="logo-icon">🌤️</span>
              <span className="logo-text">WeatherAI</span>
            </div>
            <span className="logo-sub">Built by Ajay Dammalapati</span>
          </div>
          <PMABadge />
        </header>

        <section className="hero">
          <h1 className="hero-title">
            Real-Time Weather
            <span className="gradient-text"> Intelligence</span>
          </h1>
          <p className="hero-subtitle">
            Search any city, ZIP code, landmark, or use your current location
          </p>
          <SearchBar onSearch={handleSearch} onLocationDetect={handleLocationDetect} loading={loading} />
        </section>

        {error && (
          <div className="error-card">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="error-close">✕</button>
          </div>
        )}

        {loading && (
          <div className="skeleton-wrapper">
            <div className="skeleton skeleton-card" />
            <div className="skeleton skeleton-forecast" />
          </div>
        )}

        {weather && !loading && (
          <>
            <WeatherCard weather={weather} />
            {forecast && <ForecastCard forecast={forecast} />}
            {coords && <MapView lat={coords.lat} lon={coords.lon} city={weather.name} />}
          </>
        )}

        <WeatherHistory history={history} onRefresh={fetchHistory} apiBase={API_BASE} />

        <footer className="footer">
          <div className="footer-content">
            <h3>About PM Accelerator</h3>
            <p>
              PM Accelerator is a global AI product development program where engineers,
              designers, and product managers collaborate to build real-world AI products
              from 0 to 1. With mentors from Google, Amazon, Apple, and Meta, PMA has
              launched 50+ AI products across 7+ cohorts, helping interns land roles at
              top companies worldwide.
            </p>
            <a
              href="https://www.linkedin.com/school/product-manager-accelerator/"
              target="_blank"
              rel="noreferrer"
              className="pma-link"
            >
              🔗 Visit PM Accelerator on LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}