import { Feature, Geometry } from 'geojson';

export interface County extends Feature {
  properties: {
    name: string;
    population: number;
    area: number;
  };
  geometry: Geometry;
}
