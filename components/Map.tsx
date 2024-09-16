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
          radius: 28,
          fillColor: selectedLocation.hasAgreement ? '#34D399' : '#F87171', // Green for agreement, red for no agreement
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
          
          ${selectedLocation.hasAgreement ? 'Har avtal' : 'Inget avtal'}
          <br>
          ${selectedLocation.isRegion ? 'Region' : 'Kommun'}
          
          ${selectedLocation.additionalInfo ? `<br>${selectedLocation.additionalInfo}` : ''}
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
