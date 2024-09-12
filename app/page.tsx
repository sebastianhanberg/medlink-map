'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SearchBar from '../components/SearchBar';
import FilterModal from '../components/FilterModal';
import CountyInfo from '../components/CountyInfo';
import { County } from '../types/County';
import { Button } from '@/components/ui/button';

// Dynamically import the Map component with no SSR
const Map = dynamic(() => import('../components/Map'), { ssr: false });

const MainPage: React.FC = () => {
  const [searchedCounty, setSearchedCounty] = useState<County | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    nationella: false,
    ingetAvtal: false,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex-grow mr-4">
            <SearchBar onSearch={setSearchedCounty} />
          </div>
          <Button onClick={() => setIsFilterModalOpen(true)}>Filter</Button>
        </div>
      </header>
      <main className="flex-grow flex">
        <div className="w-2/5 p-4 overflow-auto">
          <CountyInfo county={searchedCounty} />
        </div>
        <div className="w-3/5 p-4">
          {isClient && (
            <Map searchedCounty={searchedCounty} filters={filters} />
          )}
        </div>
      </main>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};

export default MainPage;
