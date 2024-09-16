
'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SearchBar from '../components/SearchBar';
import InformationCard from '../components/InformationCard';
import { County } from '../types/County';
import { Kommun } from '../types/Kommun';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function MainPage() {
  const [selectedLocation, setSelectedLocation] = useState<County | Kommun | null>(null);
  const [allLocations, setAllLocations] = useState<(County | Kommun)[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<(County | Kommun)[]>([]);
  const [filters, setFilters] = useState({
    nationella: false,
    ingetAvtal: false,
  });
  const [mapCenter, setMapCenter] = useState<[number, number]>([62.0, 15.0]);  // Ensure it's a tuple
  const [mapZoom, setMapZoom] = useState(5);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAllLocations();
  }, []);

  useEffect(() => {
    filterLocations();
  }, [filters, allLocations]);

  const fetchAllLocations = async () => {
    try {
      const countiesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/counties`);
      const kommunerResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/kommuner`);
      
      setAllLocations([...countiesResponse.data, ...kommunerResponse.data]);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const filterLocations = () => {
    if (filters.nationella && !filters.ingetAvtal) {
      setFilteredLocations(allLocations.filter((location) => location.hasAgreement));
    } else if (!filters.nationella && filters.ingetAvtal) {
      setFilteredLocations(allLocations.filter((location) => !location.hasAgreement));
    } else {
      setFilteredLocations([]);
    }
  };

  const handleSearch = async (query: string) => {
    if (isEditing) {
      const confirmSearch = window.confirm(
        'You have unsaved changes. Are you sure you want to search for a new location?',
      );
      if (!confirmSearch) {
        return;
      }
    }

    try {
      const countyResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/counties/search?query=${query}`);
      const kommunResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/kommuner/search?query=${query}`);
      
      const searchResult = [...countyResponse.data, ...kommunResponse.data];

      if (searchResult.length > 0) {
        const location = searchResult[0];
        setSelectedLocation(location);
        setMapCenter(location.center as [number, number]);  // Ensure tuple type
        setMapZoom(8);
      }
    } catch (error) {
      console.error('Error searching for location:', error);
    }
  };

  const handleFilterChange = (filterName: 'nationella' | 'ingetAvtal') => {
    setFilters((prev) => {
      const newFilters = { ...prev, [filterName]: !prev[filterName] };
      // Ensure only one filter is active at a time
      if (filterName === 'nationella' && newFilters.nationella) {
        newFilters.ingetAvtal = false;
      } else if (filterName === 'ingetAvtal' && newFilters.ingetAvtal) {
        newFilters.nationella = false;
      }
      return newFilters;
    });
  };

  const handleLocationUpdate = async (updatedLocation: County | Kommun) => {
    try {
      const endpoint =
        updatedLocation.isRegion // Use the appropriate API endpoint based on type
          ? `${process.env.NEXT_PUBLIC_API_URL}/counties/${updatedLocation.id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/kommuner/${updatedLocation.id}`;
  
      const response = await axios.put(endpoint, updatedLocation);
      setSelectedLocation(response.data);
      setAllLocations((prevLocations) =>
        prevLocations.map((location) =>
          location.id === response.data.id ? response.data : location
        )
      );
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const handleLocationSelect = (location: County | Kommun) => {
    setSelectedLocation(location);
    setMapCenter(location.center as [number, number]);  // Ensure tuple type
    setMapZoom(8);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-white shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-teal-700">medlink</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Regioner</Button>
              <Button variant="outline">Kommuner</Button>
              <Button variant="medlink">
                Profil
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <SearchBar onSearch={handleSearch} />
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="nationella"
                  checked={filters.nationella}
                  onCheckedChange={() => handleFilterChange('nationella')}
                />
                <label htmlFor="nationella">Nationella</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ingetAvtal"
                  checked={filters.ingetAvtal}
                  onCheckedChange={() => handleFilterChange('ingetAvtal')}
                />
                <label htmlFor="ingetAvtal">Inget avtal</label>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow flex">
      <div className="w-1/3 p-4 overflow-auto">
  {filteredLocations.length > 0
    ? filteredLocations.map((location) => (
        <div
          key={location.id}
          className={`mb-4 cursor-pointer p-4 rounded-lg shadow-md ${
            location.isRegion ? 'bg-blue-50' : 'bg-green-50'
          }`}
          onClick={() => handleLocationSelect(location)}
        >
          <h3 className="font-bold">{location.name}</h3>
          <p className="text-sm text-gray-600">{location.isRegion ? 'Region' : 'Kommun'}</p>
          <p className={`font-bold ${location.hasAgreement ? 'text-green-500' : 'text-red-500'}`}>
            {location.hasAgreement ? 'Har avtal' : 'Inget avtal'}
          </p>
        </div>
      ))
    : selectedLocation && (
        <InformationCard
          location={selectedLocation}
          onUpdate={handleLocationUpdate}
          onEditStateChange={setIsEditing}
        />
      )}
</div>
        <div className="w-2/3 p-4">
          <Map
            selectedLocation={selectedLocation}
            filters={filters}
            onLocationSelect={handleLocationSelect}  // Pass down the prop
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </main>
    </div>
  );
}
