import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { County } from '../types/County';

interface MapProps {
  selectedCounty: County | null;
  filters: { nationella: boolean; ingetAvtal: boolean };
  onCountySelect: (county: County) => void;
  center: [number, number];
  zoom: number;
}

function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const Map: React.FC<MapProps> = ({
  selectedCounty,
  filters,
  onCountySelect,
  center,
  zoom,
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapUpdater center={center} zoom={zoom} />
      {/* Add markers or other map elements here */}
    </MapContainer>
  );
};

export default Map;
