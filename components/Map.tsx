'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Map: React.FC = () => {
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer center={[62.0, 15.0]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* GeoJSON layer will be added here once we have the data */}
      </MapContainer>
    </div>
  );
};

export default Map;