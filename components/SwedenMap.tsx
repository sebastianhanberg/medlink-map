import React from 'react';

interface County {
  id: string;
  name: string;
  color?: string;
  tag?: string;
}

interface SwedenMapProps {
  counties: County[];
  onCountyClick: (id: string) => void;
}

const SwedenMap: React.FC<SwedenMapProps> = ({ counties, onCountyClick }) => {
  return (
    <svg viewBox="0 0 500 800" xmlns="http://www.w3.org/2000/svg">
      {/* This is a simplified example. You'll need to add paths for each county */}
      <path
        d="M200 100 L250 150 L200 200 Z"
        fill={counties.find(c => c.id === 'stockholm')?.color || '#ccc'}
        onClick={() => onCountyClick('stockholm')}
      />
      {/* Add more paths for other counties */}
    </svg>
  );
};

export default SwedenMap;