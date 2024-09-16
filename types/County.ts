export interface County {
  id: number;
  name: string;
  center: [number, number]; // Latitude and longitude
  population: number;
  area: number;
  isRegion: boolean;
  hasAgreement: boolean;
  additionalInfo?: string;
}
