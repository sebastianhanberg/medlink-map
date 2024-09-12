import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { County } from '../types/County';

interface CountyInfoProps {
  county: County | null;
}

const CountyInfo: React.FC<CountyInfoProps> = ({ county }) => {
  if (!county) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>County Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Select a county to view its information.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{county.properties.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Population: {county.properties.population}</p>
        <p>Area: {county.properties.area} km²</p>
        {/* Add more county information here */}
      </CardContent>
    </Card>
  );
};

export default CountyInfo;
