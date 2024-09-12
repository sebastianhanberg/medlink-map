'use client';

import React, { useState } from 'react';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', query);
  };

  return (
    <form
      onSubmit={handleSearch}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search counties..."
        style={{ marginBottom: '10px', padding: '5px' }}
      />
      <button type="submit" style={{ padding: '5px' }}>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
