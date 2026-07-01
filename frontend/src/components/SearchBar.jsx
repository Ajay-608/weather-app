import { useState } from "react";

export default function SearchBar({ onSearch, onLocationDetect, loading }) {
  const [input, setInput] = useState("");
  const [detecting, setDetecting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onSearch(input.trim());
  };

  const handleDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationDetect(pos.coords.latitude, pos.coords.longitude);
        setDetecting(false);
      },
      () => {
        alert("Unable to detect location. Please allow location access.");
        setDetecting(false);
      }
    );
  };

  return (
    <div className="search-wrapper">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter city, ZIP code, landmark, or coordinates..."
            className="search-input"
            disabled={loading}
          />
          {input && (
            <button type="button" onClick={() => setInput("")} className="clear-btn">✕</button>
          )}
        </div>
        <button type="submit" className="search-btn" disabled={loading || !input.trim()}>
          {loading ? <span className="spinner" /> : "Search"}
        </button>
      </form>

      <button onClick={handleDetect} className="location-btn" disabled={detecting || loading}>
        {detecting ? <><span className="spinner" /> Detecting...</> : <><span>📍</span> Use My Location</>}
      </button>

      <div className="search-hints">
        <span>Try:</span>
        {["London", "New York", "Mumbai", "Tokyo", "10001"].map((hint) => (
          <button key={hint} onClick={() => onSearch(hint)} className="hint-chip" disabled={loading}>
            {hint}
          </button>
        ))}
      </div>
    </div>
  );
}