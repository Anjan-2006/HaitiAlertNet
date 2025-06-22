

export enum Page {
  Home = 'Home',
  LiveMap = 'LiveMap',
  ReportDisaster = 'ReportDisaster',
  ReliefResources = 'ReliefResources',
  AdminVerification = 'AdminVerification',
  NewsDetail = 'NewsDetail', 
}

export enum DisasterType {
  Flood = 'Flood',
  Earthquake = 'Earthquake',
  Fire = 'Fire',
  Hurricane = 'Hurricane', 
  Storm = 'Storm', 
  Landslide = 'Landslide',
  Other = 'Other',
}

export enum ReportStatus {
  Verified = 'Verified',
  UnderReview = 'Under Review',
  Duplicate = 'Duplicate',
  New = 'New',
}

export interface UserReport {
  id: string;
  type: DisasterType;
  description: string;
  location: { lat: number; lng: number } | null; 
  locationText?: string;
  photoUrl?: string; 
  photoPreview?: string; 
  contact?: string;
  timestamp: Date;
  status: ReportStatus;
  submitter?: string; 
}

export type UserReportSubmissionData = Omit<UserReport, 'id' | 'timestamp' | 'status' | 'submitter'>;


export enum ResourceCategory {
  Medical = 'Medical Facilities',
  Food = 'Food Security',
  Shelter = 'Shelters',
  Water = 'Water Source', 
  EmergencyServices = 'Emergency Services', // Added
}

export interface ReliefResource {
  id: string;
  name: string;
  category: ResourceCategory;
  location: { lat: number; lng: number };
  address: string;
  contact: string;
  operatingHours?: string;
  icon: string; // Keep for general icon, or decide if specific icons per detail are better
  
  // New/Enhanced fields for detailed UI
  description?: string; // Added for more context
  availabilityStatus: 'Available' | 'Limited' | 'Full' | 'Unknown'; // More specific
  currentCapacity?: number;
  maxCapacity?: number;
  services?: string[]; // List of services offered
  distanceKm?: number; // Calculated or mock distance
  lastUpdateTime?: Date; // Timestamp for when the info was last updated

  // Deprecating old fields if fully replaced
  // availability: string; // Replaced by availabilityStatus, currentCapacity, maxCapacity
  specificDetails?: { // This could be flattened or used for extra non-standard info
    bedAvailability?: string; // Potentially derived from capacity fields
    mealAvailability?: string; 
    shelterCapacity?: string; // Potentially derived from capacity fields
    waterQuality?: string; 
  };
}

export interface DisasterZone {
  id: string;
  name: string;
  type: DisasterType; 
  area: { lat: number; lng: number }[] | { center: { lat: number; lng: number }, radius: number }; 
  severity: 'High' | 'Medium' | 'Low';
  lastUpdated: Date;
  description?: string;
}

export type PointOfInterest =
  | (UserReport & { itemType: 'report' })
  | (ReliefResource & { itemType: 'resource' })
  | (DisasterZone & { itemType: 'zone' });


export interface Language {
  code: string;
  name: string;
}

export interface Translations {
  [key: string]: {
    [key:string]: string;
  };
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  source: string;
  link: string;
  publishedDate: Date;
  disasterTypeTags?: DisasterType[];
}

export interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  language: string;
  setLanguage: (langCode: string) => void;
  translate: (key: string, substitutions?: {[key: string]: string}) => string;
  fontSize: number;
  setFontSize: (size: number) => void;
  contrastMode: boolean;
  setContrastMode: (enabled: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  reports: UserReport[];
  addReport: (reportData: UserReportSubmissionData) => void;
  updateReportStatus: (reportId: string, status: ReportStatus) => void; 
  mockResources: ReliefResource[]; 
  mockDisasterZones: DisasterZone[]; 
  selectedNewsArticle: NewsArticle | null; 
  setSelectedNewsArticle: (article: NewsArticle | null) => void; 
}
