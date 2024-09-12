'use client';

import React from 'react';

interface InfoBoxProps {
  county?: { name: string; color?: string; tag?: string };
}

const InfoBox: React.FC<InfoBoxProps> = ({ county }) => {
  if (!county) {
    return <div>Click on a county to see more information!</div>;
  }

  return (
    <div>
      <h2>{county.name}</h2>
      <p>
        Color:{' '}
        <span
          style={{
            backgroundColor: county.color,
            padding: '5px',
            borderRadius: '3px',
          }}
        >
          {county.color}
        </span>
      </p>
      <p>Tag: {county.tag || 'No tag available'}</p>
    </div>
  );
};

export default InfoBox;
