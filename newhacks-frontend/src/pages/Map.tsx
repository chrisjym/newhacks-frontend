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

function ClickableMap() {
  const [markers, setMarkers] = useState<Array<[number, number]>>([]);
  useMapEvents({
    dblclick(e) {
      const newMarker: [number, number] = [e.latlng.lat, e.latlng.lng];
      setMarkers([...markers, newMarker]);
      console.log(`Clicked at: ${e.latlng.lat}, ${e.latlng.lng}`);
    },
  });

  return (
    <>
      {markers.map((position, idx) => (
        <Marker key={idx} position={position}>
          <Popup>
            <strong>Coordinates:</strong>
            <br />
            Latitude: {position[0].toFixed(6)}
            <br />
            Longitude: {position[1].toFixed(6)}
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
  const [markers, setMarkers] = useState<Coordinates[]>([]);

  const prepareMarkersForBackend = () => {
    return {
      city: "Paris",
      coordinates: markers.map((m) => ({
        latitude: m.lat,
        longitude: m.lng,
      })),
    };
  };

  //backend fetch logic

  return (
    <div style={{ height: "100%", width: "100%" }}>
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
        <ClickableMap />
      </MapContainer>
    </div>
  );
}
