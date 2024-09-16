// import React, { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { County } from '../types/County';

// interface MapProps {
//   selectedCounty: County | null;
//   filters: { nationella: boolean; ingetAvtal: boolean };
//   onCountySelect: (county: County) => void;
//   center: [number, number];
//   zoom: number;
// }

// const Map: React.FC<MapProps> = ({
//   selectedCounty,
//   filters,
//   onCountySelect,
//   center,
//   zoom,
// }) => {
//   const mapRef = useRef<L.Map | null>(null);
//   const mapContainerRef = useRef<HTMLDivElement>(null);
//   const markerRef = useRef<L.CircleMarker | null>(null);

//   useEffect(() => {
//     if (mapContainerRef.current && !mapRef.current) {
//       mapRef.current = L.map(mapContainerRef.current).setView(center, zoom);

//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution:
//           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       }).addTo(mapRef.current);
//     }

//     return () => {
//       if (mapRef.current) {
//         mapRef.current.remove();
//         mapRef.current = null;
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (mapRef.current) {
//       mapRef.current.setView(center, zoom);
//     }
//   }, [center, zoom]);

//   useEffect(() => {
//     if (mapRef.current && selectedCounty) {
//       if (markerRef.current) {
//         mapRef.current.removeLayer(markerRef.current);
//       }

//       markerRef.current = L.circleMarker(
//         selectedCounty.center as L.LatLngExpression,
//         {
//           radius: 8,
//           fillColor: selectedCounty.hasAgreement ? '#00ff00' : '#ff0000',
//           color: '#000',
//           weight: 1,
//           opacity: 1,
//           fillOpacity: 0.8,
//         },
//       )
//         .addTo(mapRef.current)
//         .bindPopup(
//           `
//           <b>${selectedCounty.name}</b><br>
//           Population: ${selectedCounty.population}<br>
//           Area: ${selectedCounty.area} km²<br>
//           ${selectedCounty.hasAgreement ? 'Has Agreement' : 'No Agreement'}
//         `,
//         )
//         .openPopup();

//       mapRef.current.setView(selectedCounty.center as L.LatLngExpression, zoom);
//     }
//   }, [selectedCounty, zoom]);

//   return (
//     <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
//   );
// };

// export default Map;

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { County } from '../types/County';
import { Kommun } from '../types/Kommun';

interface MapProps {
  selectedLocation: County | Kommun | null;
  filters: { nationella: boolean; ingetAvtal: boolean };
  onLocationSelect: (location: County | Kommun) => void;  // Add this
  center: [number, number];  // Ensure this is a tuple type
  zoom: number;
}

const Map: React.FC<MapProps> = ({
  selectedLocation,
  filters,
  onLocationSelect,
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
    if (mapRef.current && selectedLocation) {
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
      }

      markerRef.current = L.circleMarker(
        selectedLocation.center as L.LatLngExpression,
        {
          radius: 8,
          fillColor: selectedLocation.hasAgreement ? '#00ff00' : '#ff0000',
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        },
      )
        .addTo(mapRef.current)
        .bindPopup(
          `
          <b>${selectedLocation.name}</b><br>
          Population: ${selectedLocation.population}<br>
          Area: ${selectedLocation.area} km²<br>
          ${selectedLocation.hasAgreement ? 'Has Agreement' : 'No Agreement'}
        `,
        )
        .openPopup();

      mapRef.current.setView(selectedLocation.center as L.LatLngExpression, zoom);
    }
  }, [selectedLocation, zoom]);

  return (
    <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
  );
};

export default Map;
