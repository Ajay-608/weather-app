import { useState } from "react";
import axios from "axios";

export default function WeatherHistory({ history, onRefresh, apiBase }) {
  const [editingId, setEditingId] = useState(null);
  const [editNotes, setEditNotes] = useState("");
  const [editLocation, setEditLocation] = useState("");

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await axios.delete(`${apiBase}/searches/${id}/`);
      onRefresh();
    } catch (e) {
      alert("Failed to delete record.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditNotes(item.notes || "");
    setEditLocation(item.location);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.patch(`${apiBase}/searches/${id}/`, {
        notes: editNotes,
        location: editLocation
      });
      setEditingId(null);
      onRefresh();
    } catch (e) {
      alert("Failed to update record.");
    }
  };

  const handleExport = (format) => {
    window.open(`${apiBase}/searches/export_${format}/`, "_blank");
  };

  if (history.length === 0) return (
    <div className="history-section">
      <h3 className="section-title"><span>📋</span> Search History</h3>
      <div className="empty-history glass-card">
        <span className="empty-icon">🔍</span>
        <p>No searches yet. Search for a city to get started!</p>
      </div>
    </div>
  );

  return (
    <div className="history-section">
      <div className="history-header">
        <h3 className="section-title"><span>📋</span> Search History</h3>
        <div className="export-buttons">
          <span className="export-label">Export:</span>
          <button onClick={() => handleExport("json")} className="export-btn json-btn">JSON</button>
          <button onClick={() => handleExport("csv")} className="export-btn csv-btn">CSV</button>
          <button onClick={() => handleExport("xml")} className="export-btn xml-btn">XML</button>
        </div>
      </div>

      <div className="history-table-wrapper glass-card">
        <table className="history-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Temp</th>
              <th>Humidity</th>
              <th>Wind</th>
              <th>Description</th>
              <th>Searched At</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="history-row">
                <td>
                  {editingId === item.id ? (
                    <input
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <span className="location-cell">
                      <img
                        src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                        alt=""
                        className="history-icon"
                      />
                      {item.location}, {item.country}
                    </span>
                  )}
                </td>
                <td className="temp-cell">{Math.round(item.temperature)}°C</td>
                <td>{item.humidity}%</td>
                <td>{item.wind_speed} m/s</td>
                <td className="desc-cell">{item.description}</td>
                <td className="date-cell">
                  {new Date(item.searched_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </td>
                <td>
                  {editingId === item.id ? (
                    <input
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="edit-input"
                      placeholder="Add notes..."
                    />
                  ) : (
                    <span className="notes-cell">{item.notes || "—"}</span>
                  )}
                </td>
                <td className="actions-cell">
                  {editingId === item.id ? (
                    <>
                      <button onClick={() => handleUpdate(item.id)} className="action-btn save-btn">✓</button>
                      <button onClick={() => setEditingId(null)} className="action-btn cancel-btn">✕</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(item)} className="action-btn edit-btn">✏️</button>
                      <button onClick={() => handleDelete(item.id)} className="action-btn delete-btn">🗑️</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}