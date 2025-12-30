import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default icon issues in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const donationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const nearestIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [30, 48], // Slightly larger
  iconAnchor: [15, 48],
  popupAnchor: [1, -40],
  shadowSize: [41, 41]
});

// Component to update map view bounds
function MapUpdater({ center, locations }) {
  const map = useMap();

  useEffect(() => {
    if (!center) return;

    const bounds = L.latLngBounds([center]);

    locations.forEach(loc => {
      if (loc.lat && loc.lng) {
        bounds.extend([loc.lat, loc.lng]);
      }
    });

    if (locations.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView(center, 13);
    }
  }, [center, locations, map]);

  return null;
}

export default function DonationMap({ donations = [], userLocation }) {
  const defaultLocation = [23.2567, 77.4170]; // Bhopal fallback
  const center = userLocation && userLocation.lat && userLocation.lng
    ? [userLocation.lat, userLocation.lng]
    : defaultLocation;

  // Filter valid donations
  const validDonations = donations.filter(d => d.latitude && d.longitude);

  // Identify nearest donation (assuming sorted by distance, or find min distance)
  // If donations are sorted by distance from backend, the first one is nearest.
  // Otherwise we'd need to calculate. Assuming backend sort for now as per previous turn.
  const nearestDonationId = validDonations.length > 0 ? validDonations[0].id : null;

  const donationLocations = validDonations.map(d => ({ lat: d.latitude, lng: d.longitude }));

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%', minHeight: '500px' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater center={center} locations={donationLocations} />

      {/* User Location */}
      <Marker position={center} icon={userIcon}>
        <Popup>
          <div className="text-center">
            <strong className="text-blue-600">Your Location</strong>
            <p className="text-xs text-gray-500">Search Radius Center</p>
          </div>
        </Popup>
      </Marker>

      {/* Radius Circle (e.g., 5km) */}
      <Circle
        center={center}
        pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue', weight: 1 }}
        radius={5000}
      />

      {/* Donation Markers */}
      {validDonations.map((donation) => {
        const isNearest = donation.id === nearestDonationId;
        return (
          <Marker
            key={donation.id}
            position={[donation.latitude, donation.longitude]}
            icon={isNearest ? nearestIcon : donationIcon}
            zIndexOffset={isNearest ? 1000 : 0} // Bring nearest to front
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className={`text-sm font-bold mb-1 ${isNearest ? 'text-green-600' : 'text-gray-800'}`}>
                  {isNearest ? "★ Nearest Donation" : "Donation Available"}
                </div>

                {donation.image && (
                  <img
                    src={donation.image}
                    alt="Food"
                    className="w-full h-24 object-cover rounded-md mb-2"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                )}

                <h3 className="font-semibold text-base">{donation.foodType || "Food Item"}</h3>
                <p className="text-sm text-gray-600 mb-1">{donation.items && donation.items.join(", ")}</p>

                <div className="flex justify-between text-xs text-gray-500 mt-2 border-t pt-2">
                  <span>Qty: {donation.quantity}</span>
                  {donation.distance && (
                    <span className="font-bold text-blue-600">{donation.distance.toFixed(2)} km away</span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}