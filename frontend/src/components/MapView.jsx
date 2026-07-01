import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapView({ lat, lon, city }) {
  return (
    <div className="map-section">
      <h3 className="section-title">
        <span>📍</span> Location Map
      </h3>
      <div className="map-wrapper glass-card">
        <MapContainer
          center={[lat, lon]}
          zoom={10}
          style={{ height: "350px", width: "100%", borderRadius: "16px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker position={[lat, lon]}>
            <Popup>
              <strong>{city}</strong><br />
              Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}