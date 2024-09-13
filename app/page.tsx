'use client';
import React, { useState } from 'react';
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
  const [filters, setFilters] = useState({
    nationella: false,
    ingetAvtal: false,
  });
  const [mapCenter, setMapCenter] = useState<[number, number]>([62.0, 15.0]);
  const [mapZoom, setMapZoom] = useState(5);

  const handleSearch = async (query: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/counties/search?query=${query}`,
      );
      if (response.data) {
        setSelectedCounty(response.data);
        setMapCenter(response.data.center);
        setMapZoom(8);
      }
    } catch (error) {
      console.error('Error searching for county:', error);
    }
  };

  const handleFilterChange = (filterName: 'nationella' | 'ingetAvtal') => {
    setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
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
          {selectedCounty && <InformationCard county={selectedCounty} />}
        </div>
        <div className="w-2/3 p-4">
          <Map
            selectedCounty={selectedCounty}
            filters={filters}
            onCountySelect={setSelectedCounty}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </main>
    </div>
  );
}
