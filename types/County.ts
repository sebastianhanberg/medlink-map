export interface County {
  id: number;
  name: string;
  center: [number, number]; // Latitude and longitude
 
  isRegion: boolean;
  hasAgreement: boolean;
  additionalInfo?: string;
}
