// import React, { useEffect } from 'react';
// import { MapContainer, TileLayer, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import { County } from '../types/County';

// interface MapProps {
//   selectedCounty: County | null;
//   filters: { nationella: boolean; ingetAvtal: boolean };
//   onCountySelect: (county: County) => void;
//   center: [number, number];
//   zoom: number;
// }

// function MapUpdater({
//   center,
//   zoom,
// }: {
//   center: [number, number];
//   zoom: number;
// }) {
//   const map = useMap();
//   useEffect(() => {
//     map.setView(center, zoom);
//   }, [center, zoom, map]);
//   return null;
// }

// const Map: React.FC<MapProps> = ({
//   selectedCounty,
//   filters,
//   onCountySelect,
//   center,
//   zoom,
// }) => {
//   return (
//     <MapContainer
//       center={center}
//       zoom={zoom}
//       style={{ height: '100%', width: '100%' }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//       <MapUpdater center={center} zoom={zoom} />
//       {/* Add markers or other map elements here */}
//     </MapContainer>
//   );
// };

// export default Map;

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { County } from '../types/County';

interface MapProps {
  selectedCounty: County | null;
  filters: { nationella: boolean; ingetAvtal: boolean };
  onCountySelect: (county: County) => void;
  center: [number, number];
  zoom: number;
}

const Map: React.FC<MapProps> = ({
  selectedCounty,
  filters,
  onCountySelect,
  center,
  zoom,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  useEffect(() => {
    if (mapRef.current && selectedCounty) {
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
      }

      markerRef.current = L.circleMarker(
        selectedCounty.center as L.LatLngExpression,
        {
          radius: 8,
          fillColor: selectedCounty.hasAgreement ? '#00ff00' : '#ff0000',
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        },
      )
        .addTo(mapRef.current)
        .bindPopup(
          `
          <b>${selectedCounty.name}</b><br>
          Population: ${selectedCounty.population}<br>
          Area: ${selectedCounty.area} km²<br>
          ${selectedCounty.hasAgreement ? 'Has Agreement' : 'No Agreement'}
        `,
        )
        .openPopup();

      mapRef.current.setView(selectedCounty.center as L.LatLngExpression, zoom);
    }
  }, [selectedCounty, zoom]);

  return (
    <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
  );
};

export default Map;
