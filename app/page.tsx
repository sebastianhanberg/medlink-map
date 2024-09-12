import React from 'react';
import SearchBar from '../components/SearchBar';
import Map from '../components/Map';
import InfoBox from '../components/InfoBox'; // new component for displaying county info

export default function Home() {
  return (
    <main
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 3fr 1fr',
        gridTemplateRows: 'auto 1fr',
        height: '100vh',
        gap: '10px',
      }}
    >
      {/* First row */}
      <header
        style={{ gridColumn: '1 / 4', textAlign: 'center', padding: '10px 0' }}
      >
        <h1>Sweden Map Dashboard</h1>
      </header>

      {/* Second row - Left column for search bar */}
      <section style={{ gridColumn: '1 / 2', padding: '10px' }}>
        <SearchBar />
      </section>

      {/* Second row - Center column for map */}
      <section style={{ gridColumn: '2 / 3', padding: '10px' }}>
        <Map />
      </section>

      {/* Second row - Right column for displaying county info */}
      <section style={{ gridColumn: '3 / 4', padding: '10px' }}>
        <InfoBox />
      </section>
    </main>
  );
}
