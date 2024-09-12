import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { County } from '../types/County';

interface SearchBarProps {
  onSearch: (county: County | null) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement actual search logic here
    console.log('Searching for:', query);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center w-full">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Sök uppdrag, kompetens eller ort..."
        className="flex-grow text-lg py-2 px-4"
      />
      <Button type="submit" className="ml-2 text-lg py-2 px-6">
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
