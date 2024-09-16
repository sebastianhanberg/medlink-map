export interface Kommun {
    id: number;
    name: string;
    center: number[];
    population: number;
    area: number;
    isRegion: boolean;
    hasAgreement: boolean;
    additionalInfo?: string;
  }
  