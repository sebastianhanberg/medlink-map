// import React, { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { County } from '../types/County';
// import { Kommun } from '../types/Kommun';

// interface MapProps {
//   selectedLocation: County | Kommun | null;
//   filters: { nationella: boolean; ingetAvtal: boolean };
//   onLocationSelect: (location: County | Kommun) => void;  // Add this
//   center: [number, number];  // Ensure this is a tuple type
//   zoom: number;
// }

// const Map: React.FC<MapProps> = ({
//   selectedLocation,
//   filters,
//   onLocationSelect,
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
//     if (mapRef.current && selectedLocation) {
//       if (markerRef.current) {
//         mapRef.current.removeLayer(markerRef.current);
//       }
  
//       markerRef.current = L.circleMarker(
//         selectedLocation.center as L.LatLngExpression,
//         {
//           radius: 28,
//           fillColor: selectedLocation.hasAgreement ? '#34D399' : '#F87171', // Green for agreement, red for no agreement
//           color: '#000',
//           weight: 1,
//           opacity: 1,
//           fillOpacity: 0.8,
//         },
//       )
//         .addTo(mapRef.current)
//         .bindPopup(
//           `
//           <b>${selectedLocation.name}</b><br>
          
//           ${selectedLocation.hasAgreement ? 'Har avtal' : 'Inget avtal'}
//           <br>
//           ${selectedLocation.isRegion ? 'Region' : 'Kommun'}
          
//           ${selectedLocation.additionalInfo ? `<br>${selectedLocation.additionalInfo}` : ''}
//         `,
//         )
//         .openPopup();
  
//       mapRef.current.setView(selectedLocation.center as L.LatLngExpression, zoom);
//     }
//   }, [selectedLocation, zoom]);

//   return (
//     <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
//   );
// };

// export default Map;

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { County } from '../types/County';
import { Kommun } from '../types/Kommun';

interface MapProps {
  locations: (County | Kommun)[];
  center: [number, number];
  zoom: number;
  selectedLocation: County | Kommun | null;
  onLocationSelect: (location: County | Kommun) => void;
}

const Map: React.FC<MapProps> = ({
  locations,
  center,
  zoom,
  selectedLocation,
  onLocationSelect,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const [manualZoom, setManualZoom] = useState(false); // Track whether the user has manually zoomed in

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = L.map('map').setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      mapRef.current.on('zoomend', () => {
        setManualZoom(true); // Mark that the user has manually zoomed in/out
      });
    }

    if (markersLayer.current) {
      markersLayer.current.clearLayers();
    } else {
      markersLayer.current = L.layerGroup().addTo(mapRef.current);
    }

    locations.forEach((location) => {
      const isSelected = selectedLocation && location.name === selectedLocation.name;

      // Define marker colors based on conditions
      const fillColor = isSelected ? '#85C1E9' : (location.hasAgreement ? '#1E8449' : '#E74C3C');
      const markerSize = isSelected ? 18 : 10; // Larger if selected
      const borderColor = '#1B4F72'; // Darker border color for visibility

      const markerOptions = {
        radius: markerSize,
        fillColor: fillColor,
        color: borderColor,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      };

      const marker = L.circleMarker(location.center as L.LatLngExpression, markerOptions)
        .on('click', () => {
          onLocationSelect(location);
          const currentZoom = mapRef.current?.getZoom();
          const newZoom = manualZoom ? currentZoom : 12; // Don't zoom out if the user has zoomed manually
          mapRef.current?.setView(location.center as L.LatLngExpression, newZoom); // Set zoom level to 12
          marker.openPopup(); // Open the popup on first click
        })
        .on('mouseover', () => {
          marker.openPopup(); // Show popup on hover
        })
        .on('mouseout', () => {
          marker.closePopup(); // Hide popup on mouse out
        })
        .bindPopup(
          `
          <b>${location.name}</b><br>
          ${location.hasAgreement ? 'Har avtal' : 'Inget avtal'}
          <br>
          ${location.isRegion ? 'Region' : 'Kommun'}
          <br>
          ${location.additionalInfo ? `<br>${location.additionalInfo}` : ''}
        `,
        );

      // Add a number icon for locations with additional info
      if (location.additionalInfo) {
        const iconHtml = `<div class="bg-black text-white rounded-full w-4 h-4 flex items-center justify-center">1</div>`;
        const icon = L.divIcon({
          html: iconHtml,
          className: '',
        });
        L.marker(location.center as L.LatLngExpression, { icon }).addTo(markersLayer.current!);
      }

      markersLayer.current?.addLayer(marker);
    });
  }, [locations, selectedLocation]);

  // Ensure the map zooms in on the selected search result with higher zoom level (like 12)
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      const currentZoom = mapRef.current?.getZoom();
      const newZoom = manualZoom ? currentZoom : 12; // Set zoom level to 12, or retain manual zoom
      mapRef.current.setView(selectedLocation.center as L.LatLngExpression, newZoom); // Zoom in on the selected location
    }
  }, [selectedLocation]);

  return <div id="map" style={{ height: '100%', width: '100%' }} />;
};

export default Map;
