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

interface Coordinates {
  lat: number;
  lng: number;
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
        <Marker key={idx} position={[position.lat, position.lng]}>
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

  // Function to prepare data for backend
  const prepareMarkersForBackend = () => {
    return {
      city: "Paris", // You can make this dynamic later
      coordinates: markers.map((m) => ({
        latitude: m.lat,
        longitude: m.lng,
      })),
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

    try {
      // Replace with your actual backend URL
      const response = await fetch("http://localhost:5000/api/coordinates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Backend response:", result);
        alert("Coordinates sent successfully!");
      } else {
        throw new Error("Failed to send data");
      }
    } catch (error) {
      console.error("Error sending to backend:", error);
      alert("Failed to send coordinates to backend");
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
        {/* Pass markers state to ClickableMap */}
        <ClickableMap markers={markers} setMarkers={setMarkers} />
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
          disabled={markers.length === 0}
          style={{
            ...styles.sendButton,
            ...(markers.length > 0
              ? styles.sendButtonActive
              : styles.sendButtonDisabled),
          }}
        >
          Send Coordinates
        </button>

        {markers.length > 0 && (
          <button onClick={() => setMarkers([])} style={styles.clearButton}>
            Clear All
          </button>
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
};
