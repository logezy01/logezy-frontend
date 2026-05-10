import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getImageUrl } from '../../lib/imageUrl';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createCustomIcon = (type) => L.divIcon({
  className: '',
  html: `<div style="background:${type === 'location' ? '#3A7D44' : '#E8472A'};color:white;padding:4px 8px;border-radius:20px;font-size:11px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;">${type === 'location' ? 'Location' : 'Vente'}</div>`,
  iconAnchor: [40, 20],
});

function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 13);
  }, [center, map]);
  return null;
}

const formatPrice = (price, period) => {
  const formatted = new Intl.NumberFormat('fr-FR').format(price);
  return period ? `${formatted} FCFA/${period}` : `${formatted} FCFA`;
};

export default function MapView({
  listings = [],
  center = [6.3654, 2.4183],
  zoom = 12,
  height = '500px'
}) {
  const getCoverImage = (listing) => {
    const img = listing.listing_images?.find(i => i.is_cover)?.image_url;
    return getImageUrl(img);
  };

  const withCoords = listings.filter(l => l.latitude && l.longitude);
  const withoutCoords = listings.filter(l => !l.latitude || !l.longitude);

  return (
    <div
      style={{ height, position: 'relative' }}
      className="rounded-card overflow-hidden border border-[#E2E8F0] dark:border-[#2A2A2A]"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={center} />

        {withCoords.map(listing => (
          <Marker
            key={listing.id}
            position={[parseFloat(listing.latitude), parseFloat(listing.longitude)]}
            icon={createCustomIcon(listing.type)}
          >
            <Popup maxWidth={220}>
              <div style={{ padding: '4px' }}>
                <div style={{ height: '120px', background: '#f3f4f6', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' }}>
                  {getCoverImage(listing) ? (
                    <img
                      src={getCoverImage(listing)}
                      alt={listing.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                      🏠
                    </div>
                  )}
                </div>

                <p style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '4px', lineHeight: '1.3' }}>
                  {listing.title}
                </p>

                <p style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                  📍 {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}
                </p>

                <p style={{ fontWeight: '900', fontSize: '13px', color: '#3A7D44', marginBottom: '8px' }}>
                  {formatPrice(listing.price, listing.price_period)}
                </p>

                <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#666', marginBottom: '8px' }}>
                  {listing.bedrooms > 0 && (
                    <span>🛏 {listing.bedrooms}</span>
                  )}
                  {listing.bathrooms > 0 && (
                    <span>🚿 {listing.bathrooms}</span>
                  )}
                  {listing.area && (
                    <span>📐 {listing.area}m²</span>
                  )}
                </div>

                <button
                  onClick={() => { window.location.href = `/annonces/${listing.id}`; }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    background: '#3A7D44',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Voir l'annonce
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {withoutCoords.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'white',
            fontSize: '11px',
            color: '#666',
            padding: '6px 12px',
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
          }}
        >
          {withoutCoords.length} annonce(s) sans localisation
        </div>
      )}
    </div>
  );
}