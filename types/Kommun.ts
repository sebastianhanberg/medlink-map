export interface Kommun {
    id: number;
    name: string;
    center: number[];
    
    isRegion: boolean;
    hasAgreement: boolean;
    additionalInfo?: string;
  }
  