import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";

// Fix Leaflet's default icon issue in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Coordinates {
  lat: number;
  lng: number;
}

interface Activity {
  name: string;
  longitude: number;
  latitude: number;
  type: string;
  description: string;
}

// Props interface for ClickableMap
interface ClickableMapProps {
  markers: Coordinates[];
  setMarkers: (markers: Coordinates[]) => void;
}

// Updated ClickableMap to receive props from parent
function ClickableMap({ markers, setMarkers }: ClickableMapProps) {
  useMapEvents({
    dblclick(e) {
      const newMarker: Coordinates = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };
      setMarkers([...markers, newMarker]);
      console.log(`Clicked at: ${e.latlng.lat}, ${e.latlng.lng}`);
    },
  });

  return (
    <>
      {markers.map((position, idx) => (
        <Marker
          key={idx}
          position={[position.lat, position.lng]}
          icon={greenIcon}
        >
          <Popup>
            <strong>Coordinates:</strong>
            <br />
            Latitude: {position.lat.toFixed(6)}
            <br />
            Longitude: {position.lng.toFixed(6)}
            <br />
            <button
              className="marker-button"
              onClick={() => setMarkers(markers.filter((_, i) => i !== idx))}
            >
              Remove
            </button>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function InteractiveMap() {
  // Single source of truth for all markers
  const [markers, setMarkers] = useState<Coordinates[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to prepare data for backend
  const prepareMarkersForBackend = () => {
    return {
      points: markers.map((m) => [m.lng, m.lat]),
    };
  };

  // Function to send data to backend
  const sendToBackend = async () => {
    if (markers.length === 0) {
      alert("Please add at least one marker on the map!");
      return;
    }

    const dataToSend = prepareMarkersForBackend();
    console.log("Sending to backend:", dataToSend);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/coordinates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Backend response:", result);

        if (result.status === "success" && result.recommended_places) {
          setActivities(result.recommended_places);
          alert(`Found ${result.recommended_places.length} activities!`);
        } else {
          alert("No activities found");
          setActivities([]);
        }
      } else {
        throw new Error("Failed to send data");
      }
    } catch (error) {
      console.error("Error sending to backend:", error);
      alert("Failed to send coordinates to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      {/* Map */}
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[48.8575, 2.3514]} icon={redIcon}>
          <Popup>
            Base: <br />
            Paris
          </Popup>
        </Marker>

        {/* User-added markers (green) */}
        <ClickableMap markers={markers} setMarkers={setMarkers} />

        {/* Activity markers (blue) */}
        {activities.map((activity, idx) => (
          <Marker
            key={`activity-${idx}`}
            position={[activity.latitude, activity.longitude]}
            icon={blueIcon}
          >
            <Popup>
              <div style={{ minWidth: "200px" }}>
                <strong style={{ fontSize: "16px", color: "#667eea" }}>
                  {activity.name}
                </strong>
                <br />
                <span
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    fontStyle: "italic",
                  }}
                >
                  {activity.type}
                </span>
                <br />
                <br />
                <p style={{ margin: "8px 0", fontSize: "14px" }}>
                  {activity.description}
                </p>
                <hr style={{ margin: "8px 0" }} />
                <small style={{ color: "#888" }}>
                  📍 {activity.latitude.toFixed(4)},{" "}
                  {activity.longitude.toFixed(4)}
                </small>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Coordinates Box - Bottom Right Corner */}
      <div style={styles.coordinatesBox}>
        <div style={styles.coordinatesHeader}>
          <strong>Selected Coordinates ({markers.length})</strong>
        </div>

        <div style={styles.coordinatesList}>
          {markers.length === 0 ? (
            <div style={styles.emptyMessage}>No coordinates selected</div>
          ) : (
            markers.map((marker, index) => (
              <div key={index} style={styles.coordinateItem}>
                <span style={styles.markerNumber}>📍 {index + 1}:</span>
                <span style={styles.coordinateText}>
                  {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                </span>
              </div>
            ))
          )}
        </div>

        <button
          onClick={sendToBackend}
          disabled={markers.length === 0 || loading}
          style={{
            ...styles.sendButton,
            ...(markers.length > 0 && !loading
              ? styles.sendButtonActive
              : styles.sendButtonDisabled),
          }}
        >
          {loading ? "Loading..." : "Find Activities"}
        </button>

        {markers.length > 0 && (
          <button onClick={() => setMarkers([])} style={styles.clearButton}>
            Clear All
          </button>
        )}

        {activities.length > 0 && (
          <div style={styles.activityCount}>
            ✨ {activities.length} activities found
          </div>
        )}
      </div>
    </div>
  );
}

// Styles for the coordinates box
const styles = {
  coordinatesBox: {
    position: "absolute" as "absolute",
    bottom: "20px",
    right: "20px",
    width: "300px",
    backgroundColor: "#000000",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    border: "1px solid #333",
    zIndex: 1000,
  },
  coordinatesHeader: {
    color: "#ffffff",
    fontSize: "14px",
    marginBottom: "12px",
    borderBottom: "1px solid #444",
    paddingBottom: "8px",
  },
  coordinatesList: {
    maxHeight: "200px",
    overflowY: "auto" as "auto",
    marginBottom: "12px",
  },
  coordinateItem: {
    display: "flex",
    alignItems: "center",
    padding: "6px 0",
    borderBottom: "1px solid #333",
    fontSize: "12px",
  },
  markerNumber: {
    color: "#667eea",
    fontWeight: "600",
    marginRight: "8px",
    minWidth: "40px",
  },
  coordinateText: {
    color: "#ffffff",
    fontFamily: "monospace",
  },
  emptyMessage: {
    color: "#888",
    fontStyle: "italic",
    fontSize: "12px",
    textAlign: "center" as "center",
    padding: "8px 0",
  },
  sendButton: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "8px",
    transition: "all 0.3s ease",
  },
  sendButtonActive: {
    backgroundColor: "#667eea",
    color: "white",
  },
  sendButtonDisabled: {
    backgroundColor: "#444",
    color: "#888",
    cursor: "not-allowed",
  },
  clearButton: {
    width: "100%",
    padding: "8px",
    backgroundColor: "#e53e3e",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
  },
  activityCount: {
    marginTop: "12px",
    padding: "8px",
    backgroundColor: "#667eea",
    borderRadius: "6px",
    textAlign: "center" as "center",
    fontSize: "12px",
    fontWeight: "600",
  },
};
