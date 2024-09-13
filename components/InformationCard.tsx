import React from 'react';
import { County } from '../types/County';

interface InformationCardProps {
  county: County;
}

const InformationCard: React.FC<InformationCardProps> = ({ county }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">{county.name}</h2>
      <p className="mb-2">Population: {county.population}</p>
      <p className="mb-2">Area: {county.area} km²</p>
      <p className="font-bold">
        {county.hasAgreement ? 'Har avtal' : 'Inget avtal'}
      </p>
      {/* Add more county information here */}
    </div>
  );
};

export default InformationCard;
