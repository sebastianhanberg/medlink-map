import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; type: 'kommun' | 'region' }[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1); // Index of the highlighted suggestion

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 1) {
        try {
          const countiesResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/counties/suggestions?query=${query}`,
          );
          const kommunerResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/kommuner/suggestions?query=${query}`,
          );
          const results = [
            ...countiesResponse.data.map((county: any) => ({ ...county, type: 'region' })),
            ...kommunerResponse.data.map((kommun: any) => ({ ...kommun, type: 'kommun' })),
          ];
          setSuggestions(results);
          setSelectedIndex(-1); // Reset index on new search
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setSelectedIndex(-1); // Reset index if query is too short
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      const selectedSuggestion = suggestions[selectedIndex].name;
      setQuery(''); // Reset the query
      onSearch(selectedSuggestion);
      setSuggestions([]); // Clear suggestions
    } else if (query.length > 0) {
      onSearch(query);
      setSuggestions([]); // Clear suggestions
      setQuery(''); // Reset the query
    }
    setSelectedIndex(-1); // Reset index
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery('');
    onSearch(suggestion);
    setSuggestions([]); // Clear suggestions
    setSelectedIndex(-1); // Reset index
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      // Move down in the suggestion list
      setSelectedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === 'ArrowUp') {
      // Move up in the suggestion list
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
    } else if (e.key === 'Enter') {
      // If Enter is pressed, select the highlighted suggestion
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        const selectedSuggestion = suggestions[selectedIndex].name;
        setQuery(selectedSuggestion);
        onSearch(selectedSuggestion);
        setSuggestions([]); // Clear suggestions
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-grow mr-4">
      <div className="flex">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sök kommun eller region..."
          onKeyDown={handleKeyDown} // Listen for key events
          className="flex-grow"
        />
        <Button type="submit" className="ml-2">
          Sök
        </Button>
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`px-4 py-2 cursor-pointer ${
                index === selectedIndex ? 'bg-teal-200' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion.name)}
            >
              <span>{suggestion.name}</span>
              <span className="ml-2 text-sm text-gray-500">
                {suggestion.type === 'kommun' ? 'Kommun' : 'Region'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBar;
