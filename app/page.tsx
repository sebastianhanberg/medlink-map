import React from 'react';
import Map from '../components/Map';
import SearchBar from '../components/SearchBar';

export default function Home() {
  return (
    <main>
      <h1>Sweden Map Dashboard</h1>
      <SearchBar />
      <Map />
    </main>
  );
}