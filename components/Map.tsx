import React from 'react';
import { County } from '../types/County';

interface MapProps {
  searchedCounty: County | null;
  filters: { nationella: boolean; ingetAvtal: boolean };
}

const Map: React.FC<MapProps> = ({ searchedCounty, filters }) => {
  if (typeof window === 'undefined') {
    return null; // Return null on the server side
  }

  // Import Leaflet components only on the client side
  const { MapContainer, TileLayer, GeoJSON, useMap } = require('react-leaflet');
  const L = require('leaflet');

  // ... rest of your Map component code ...

  return (
    <MapContainer
      center={[62.0, 15.0]}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* ... rest of your map JSX ... */}
    </MapContainer>
  );
};

export default Map;
