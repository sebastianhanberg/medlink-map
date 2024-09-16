'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SearchBar from '../components/SearchBar';
import InformationCard from '../components/InformationCard';
import { County } from '../types/County';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function MainPage() {
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [allCounties, setAllCounties] = useState<County[]>([]);
  const [filteredCounties, setFilteredCounties] = useState<County[]>([]);
  const [filters, setFilters] = useState({
    nationella: false,
    ingetAvtal: false,
  });
  const [mapCenter, setMapCenter] = useState<[number, number]>([62.0, 15.0]);
  const [mapZoom, setMapZoom] = useState(5);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAllCounties();
  }, []);

  useEffect(() => {
    filterCounties();
  }, [filters, allCounties]);

  const fetchAllCounties = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/counties`,
      );
      setAllCounties(response.data);
    } catch (error) {
      console.error('Error fetching counties:', error);
    }
  };

  const filterCounties = () => {
    if (filters.nationella && !filters.ingetAvtal) {
      setFilteredCounties(allCounties.filter((county) => county.hasAgreement));
    } else if (!filters.nationella && filters.ingetAvtal) {
      setFilteredCounties(allCounties.filter((county) => !county.hasAgreement));
    } else {
      setFilteredCounties([]);
    }
  };

  const handleSearch = async (query: string) => {
    if (isEditing) {
      const confirmSearch = window.confirm(
        'You have unsaved changes. Are you sure you want to search for a new county?',
      );
      if (!confirmSearch) {
        return;
      }
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/counties/search?query=${query}`,
      );
      if (response.data && response.data.length > 0) {
        const county = response.data[0];
        setSelectedCounty(county);
        setMapCenter(county.center);
        setMapZoom(8);
      }
    } catch (error) {
      console.error('Error searching for county:', error);
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

  const handleCountyUpdate = async (updatedCounty: County) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/counties/${updatedCounty.id}`,
        updatedCounty,
      );
      setSelectedCounty(response.data);
      setAllCounties((prevCounties) =>
        prevCounties.map((county) =>
          county.id === response.data.id ? response.data : county,
        ),
      );
    } catch (error) {
      console.error('Error updating county:', error);
    }
  };

  const handleCountySelect = (county: County) => {
    setSelectedCounty(county);
    setMapCenter(county.center);
    setMapZoom(8);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-white shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-teal-700">medlink</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Sök uppdrag</Button>
              <Button variant="outline">Tidrapportering</Button>
              <Button variant="outline" className="rounded-full">
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
          {filteredCounties.length > 0
            ? filteredCounties.map((county) => (
                <div
                  key={county.id}
                  className="mb-4 cursor-pointer"
                  onClick={() => handleCountySelect(county)}
                >
                  <h3 className="font-bold">{county.name}</h3>
                  <p>{county.hasAgreement ? 'Har avtal' : 'Inget avtal'}</p>
                </div>
              ))
            : selectedCounty && (
                <InformationCard
                  county={selectedCounty}
                  onUpdate={handleCountyUpdate}
                  onEditStateChange={setIsEditing}
                />
              )}
        </div>
        <div className="w-2/3 p-4">
          <Map
            selectedCounty={selectedCounty}
            filters={filters}
            onCountySelect={handleCountySelect}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </main>
    </div>
  );
}
