// import React, { useState, useEffect } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import axios from 'axios';

// interface SearchBarProps {
//   onSearch: (query: string) => void;
// }

// const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
//   const [query, setQuery] = useState('');
//   const [suggestions, setSuggestions] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       if (query.length > 1) {
//         try {
//           const response = await axios.get(
//             `${process.env.NEXT_PUBLIC_API_URL}/counties/suggestions?query=${query}`,
//           );
//           setSuggestions(response.data.map((county: any) => county.name));
//         } catch (error) {
//           console.error('Error fetching suggestions:', error);
//         }
//       } else {
//         setSuggestions([]);
//       }
//     };

//     fetchSuggestions();
//   }, [query]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSearch(query);
//     setQuery(''); // Clear the search bar
//     setSuggestions([]); // Clear suggestions
//   };

//   return (
//     <form onSubmit={handleSubmit} className="relative flex-grow mr-4">
//       <div className="flex">
//         <Input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Sök län eller region..."
//           className="flex-grow"
//         />
//         <Button type="submit" className="ml-2">
//           Sök
//         </Button>
//       </div>
//       {suggestions.length > 0 && (
//         <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
//           {suggestions.map((suggestion, index) => (
//             <li
//               key={index}
//               className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//               onClick={() => {
//                 setQuery(suggestion);
//                 onSearch(suggestion);
//               }}
//             >
//               {suggestion}
//             </li>
//           ))}
//         </ul>
//       )}
//     </form>
//   );
// };

// export default SearchBar;

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

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
          const results = [...countiesResponse.data, ...kommunerResponse.data];
          setSuggestions(results.map((location: any) => location.name));
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setQuery(''); // Clear the search bar
    setSuggestions([]); // Clear suggestions
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-grow mr-4">
      <div className="flex">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sök kommun eller region..."
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
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setQuery(suggestion);
                onSearch(suggestion);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBar;
