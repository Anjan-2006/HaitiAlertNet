

import { Language, DisasterType, ReliefResource, ResourceCategory, ReportStatus, UserReport, DisasterZone, NewsArticle } from './types';

export const APP_NAME = "HaitiAlertNet"; // Changed from DisasterConnect

// Haiti Coordinates
export const HAITI_CENTER: [number, number] = [18.9712, -72.2852]; // Approx center of Haiti
export const HAITI_INITIAL_ZOOM = 8;
export const HAITI_BOUNDS: [[number, number], [number, number]] = [[18.0, -74.5], [20.1, -71.6]];
export const DEFAULT_USER_REPORT_ZONE_RADIUS = 500; // 500 meters radius for user-reported zones

export interface HaitiRegion {
  name: string; // Translatable key
  value: string; // Stable value for storing/filtering
  coordinates: { lat: number; lng: number };
}

export const HAITI_REGIONS: HaitiRegion[] = [
  // Departments (original 10)
  { name: "Artibonite", value: "Artibonite", coordinates: { lat: 19.4500, lng: -72.6833 } },
  { name: "Centre", value: "Centre", coordinates: { lat: 19.1500, lng: -72.0167 } },
  { name: "Grand'Anse", value: "Grand'Anse", coordinates: { lat: 18.6500, lng: -74.1167 } },
  { name: "Nippes", value: "Nippes", coordinates: { lat: 18.4425, lng: -73.0872 } },
  { name: "Nord", value: "Nord", coordinates: { lat: 19.7528, lng: -72.1944 } },
  { name: "Nord-Est", value: "Nord-Est", coordinates: { lat: 19.6667, lng: -71.8333 } },
  { name: "Nord-Ouest", value: "Nord-Ouest", coordinates: { lat: 19.9333, lng: -72.8333 } },
  { name: "Ouest", value: "Ouest", coordinates: { lat: 18.5944, lng: -72.3074 } },
  { name: "Sud", value: "Sud", coordinates: { lat: 18.2000, lng: -73.7500 } },
  { name: "Sud-Est", value: "Sud-Est", coordinates: { lat: 18.2345, lng: -72.5347 } },

  // Added Specific Locations
  { name: "Léogâne", value: "Léogâne", coordinates: { lat: 18.5104, lng: -72.6337 } },
  { name: "Petit Paradis", value: "Petit Paradis", coordinates: { lat: 18.5030, lng: -72.6070 } },
  { name: "Gressier", value: "Gressier", coordinates: { lat: 18.5500, lng: -72.5167 } },
  { name: "Chardonnières", value: "Chardonnières", coordinates: { lat: 18.2736, lng: -74.1500 } },
  { name: "Petit Trou de Nippes", value: "Petit Trou de Nippes", coordinates: { lat: 18.5083, lng: -73.5083 } },
  { name: "Corail", value: "Corail", coordinates: { lat: 18.5667, lng: -73.8833 } },
  { name: "Môle Saint-Nicolas", value: "Môle Saint-Nicolas", coordinates: { lat: 19.8000, lng: -73.3667 } },
  { name: "Anse-à-Veau", value: "Anse-à-Veau", coordinates: { lat: 18.5000, lng: -73.3500 } },
  { name: "Jérémie", value: "Jérémie", coordinates: { lat: 18.6500, lng: -74.1167 } }, // Same as Grand'Anse dept, but specific
  { name: "Cité Soleil", value: "Cité Soleil", coordinates: { lat: 18.5780, lng: -72.3377 } },
  { name: "Morne-à-Chandelle (Jacmel Vicinity)", value: "Morne-à-Chandelle", coordinates: { lat: 18.2345, lng: -72.5347 } }, // Using Jacmel's coords
  { name: "Petit-Goâve", value: "Petit-Goâve", coordinates: { lat: 18.4333, lng: -72.8667 } },
  { name: "Port-de-Paix", value: "Port-de-Paix", coordinates: { lat: 19.9333, lng: -72.8333 } }, // Same as Nord-Ouest dept
  { name: "Cap-Haïtien", value: "Cap-Haïtien", coordinates: { lat: 19.7528, lng: -72.1944 } }, // Same as Nord dept
  { name: "Les Abricots", value: "Les Abricots", coordinates: { lat: 18.6333, lng: -74.3167 } },
  { name: "Saint-Louis-du-Sud", value: "Saint-Louis-du-Sud", coordinates: { lat: 18.2667, lng: -73.5500 } },
  { name: "Baradères", value: "Baradères", coordinates: { lat: 18.4833, lng: -73.6333 } },
  { name: "Cavaillon", value: "Cavaillon", coordinates: { lat: 18.3000, lng: -73.6667 } },
  { name: "Fonds-des-Nègres", value: "Fonds-des-Nègres", coordinates: { lat: 18.4167, lng: -73.3000 } },
  { name: "Tiburon", value: "Tiburon", coordinates: { lat: 18.3167, lng: -74.3833 } }, // For "Tiburon Peninsula central"
];


export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ht', name: 'Kreyòl ayisyen' }, 
  { code: 'fr', name: 'Français' }, 
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'bn', name: 'বাংলা' },
];

export const DEFAULT_LANGUAGE = 'en';

export const DISASTER_TYPES: DisasterType[] = [
  DisasterType.Flood,
  DisasterType.Earthquake,
  DisasterType.Fire,
  DisasterType.Hurricane,
  DisasterType.Storm,
  DisasterType.Landslide,
  DisasterType.Other,
];

export const DISASTER_TYPE_IMAGE_URLS: Record<DisasterType, string> = {
  [DisasterType.Flood]: 'https://images.pexels.com/photos/753619/pexels-photo-753619.jpeg',
  [DisasterType.Earthquake]: 'https://cdn.britannica.com/34/127134-050-49EC55CD/Building-foundation-earthquake-Japan-Kobe-January-1995.jpg',
  [DisasterType.Fire]: 'https://www.hdwallpapers.in/download/fire_red_orange_dark_4k_5k_hd_fire-3840x2160.jpg',
  [DisasterType.Hurricane]: 'https://www.shutterstock.com/shutterstock/videos/3539883861/thumb/1.jpg?ip=x480',
  [DisasterType.Storm]: 'https://i.pinimg.com/736x/cd/19/cd/cd19cd3e1fec0a0d3290812942ab2d27.jpg',
  [DisasterType.Landslide]: 'https://t3.ftcdn.net/jpg/01/38/22/68/360_F_138226873_ciwW3PX7AAVs8yGmmzDxAXHk9ryW8bBb.jpg',
  [DisasterType.Other]: 'https://mountainhouse.com/cdn/shop/articles/key-west-storm-featured-image_1024x.jpg?v=1687570146',
};


export const INITIAL_MOCK_REPORTS: UserReport[] = [
  {
    id: 'HTreport1',
    type: DisasterType.Flood,
    description: 'Flooding in Cité Soleil after heavy rains. Roads are blocked.',
    location: { lat: 18.5780, lng: -72.3377 }, 
    locationText: 'Cité Soleil', 
    photoUrl: DISASTER_TYPE_IMAGE_URLS[DisasterType.Flood],
    photoPreview: DISASTER_TYPE_IMAGE_URLS[DisasterType.Flood],
    timestamp: new Date(Date.now() - 3600 * 1000 * 3), 
    status: ReportStatus.Verified,
    submitter: 'Jean P.',
  },
  {
    id: 'HTreport2',
    type: DisasterType.Earthquake,
    description: 'Minor tremors felt in Jacmel. Some cracks in older buildings.',
    location: { lat: 18.2345, lng: -72.5347 }, 
    locationText: 'Sud-Est', 
    photoUrl: DISASTER_TYPE_IMAGE_URLS[DisasterType.Earthquake],
    photoPreview: DISASTER_TYPE_IMAGE_URLS[DisasterType.Earthquake],
    timestamp: new Date(Date.now() - 3600 * 1000 * 1), 
    status: ReportStatus.UnderReview,
  },
  {
    id: 'HTreport3',
    type: DisasterType.Storm,
    description: 'Strong winds and rain in Cap-Haïtien. Power outages reported.',
    location: { lat: 19.7528, lng: -72.1944 }, 
    locationText: 'Cap-Haïtien', 
    photoUrl: DISASTER_TYPE_IMAGE_URLS[DisasterType.Storm],
    photoPreview: DISASTER_TYPE_IMAGE_URLS[DisasterType.Storm],
    timestamp: new Date(Date.now() - 3600 * 1000 * 6), 
    status: ReportStatus.New,
  }
];

export const INITIAL_MOCK_RESOURCES: ReliefResource[] = [
  {
    id: 'HThospital1',
    name: 'City General Hospital (HUEH)',
    category: ResourceCategory.Medical,
    location: { lat: 18.5393, lng: -72.3365 }, 
    address: '123 Healthcare Avenue, Central District, Port-au-Prince',
    contact: '+509-11-2567-8900',
    operatingHours: '24/7',
    icon: 'fa-solid fa-hospital', // General icon for category
    description: 'Multi-specialty hospital with full emergency services and trauma center. Recently renovated wing for critical care.',
    availabilityStatus: 'Available',
    currentCapacity: 85,
    maxCapacity: 200,
    services: ['Emergency', 'ICU', 'Surgery', 'Ambulance', 'Pediatrics'],
    distanceKm: 1.2,
    lastUpdateTime: new Date(Date.now() - (1000 * 60 * 5)), // 5 minutes ago
  },
  {
    id: 'HTclinic1',
    name: 'Community Health Clinic',
    category: ResourceCategory.Medical,
    location: { lat: 18.5517, lng: -72.3029 },
    address: '654 Health Street, South District, Delmas',
    contact: '+509-11-2567-8904',
    operatingHours: '9:00 AM - 5:00 PM',
    icon: 'fa-solid fa-clinic-medical',
    description: 'Primary healthcare facility providing basic medical services, vaccinations, and maternal care.',
    availabilityStatus: 'Full',
    currentCapacity: 50,
    maxCapacity: 50,
    services: ['Basic Treatment', 'First Aid', 'Medication', 'Vaccination'],
    distanceKm: 3.2,
    lastUpdateTime: new Date(Date.now() - (1000 * 60 * 18)), // 18 minutes ago
  },
  {
    id: 'HTfoodcenter1',
    name: 'Hope Food Pantry - Delmas',
    category: ResourceCategory.Food,
    location: { lat: 18.5480, lng: -72.3005 }, 
    address: '789 Charity Road, Delmas 33, Port-au-Prince',
    contact: '+509-22-3333-4444',
    operatingHours: '10 AM - 2 PM (Mon-Fri)',
    icon: 'fa-solid fa-utensils',
    description: 'Provides essential food rations including rice, beans, and cooking oil to families in need.',
    availabilityStatus: 'Available',
    currentCapacity: 150, // e.g., number of families served today
    maxCapacity: 200,   // e.g., target families per day
    services: ['Dry Rations', 'Nutrition Advice'],
    distanceKm: 2.5,
    lastUpdateTime: new Date(Date.now() - (1000 * 60 * 60 * 2)), // 2 hours ago
  },
  {
    id: 'HTshelter1',
    name: 'Safe Haven Community Shelter',
    category: ResourceCategory.Shelter,
    location: { lat: 18.5338, lng: -72.4096 }, 
    address: '456 Safe Route, Carrefour, near Mariani',
    contact: '+509-44-5555-6666',
    operatingHours: '24/7',
    icon: 'fa-solid fa-house-chimney-user',
    description: 'Temporary shelter providing cots, blankets, and basic hygiene kits for displaced individuals.',
    availabilityStatus: 'Limited',
    currentCapacity: 80,
    maxCapacity: 100,
    services: ['Beds', 'Meals', 'First Aid Post'],
    distanceKm: 5.1,
    lastUpdateTime: new Date(Date.now() - (1000 * 60 * 30)), // 30 minutes ago
  },
  {
    id: 'HTwater1',
    name: 'AquaPure Water Station - Léogâne',
    category: ResourceCategory.Water,
    location: { lat: 18.5104, lng: -72.6337 }, 
    address: 'Near central market, Léogâne',
    contact: 'Local committee: +509-55-7777-8888',
    operatingHours: '8 AM - 6 PM',
    icon: 'fa-solid fa-water', // Updated icon
    description: 'Community access point for purified drinking water. Bring your own containers.',
    availabilityStatus: 'Available',
    // Capacity for water source could mean liters available or flow rate
    currentCapacity: 5000, // Liters available
    maxCapacity: 10000, // Total daily capacity
    services: ['Potable Water', 'Container Refill'],
    distanceKm: 10.3,
    lastUpdateTime: new Date(Date.now() - (1000 * 60 * 60 * 1)), // 1 hour ago
  },
  {
    id: 'HTemergency1',
    name: 'Rapid Response Paramedics',
    category: ResourceCategory.EmergencyServices,
    location: { lat: 18.56, lng: -72.32 }, // Central dispatch, not a fixed point for public visit
    address: 'Serves Port-au-Prince Metropolitan Area',
    contact: 'Emergency Hotline: 118',
    operatingHours: '24/7',
    icon: 'fa-solid fa-truck-medical',
    description: 'Mobile emergency medical services. Dispatch available for critical situations.',
    availabilityStatus: 'Available', // Represents team availability
    currentCapacity: 3, // Number of available units
    maxCapacity: 5,   // Total units
    services: ['Ambulance Transport', 'On-site Triage', 'Emergency Medical Care'],
    distanceKm: 0, // N/A or calculated to incident
    lastUpdateTime: new Date(Date.now() - (1000 * 60 * 2)), // 2 minutes ago
  }
];

export const INITIAL_MOCK_DISASTER_ZONES: DisasterZone[] = [
  {
    id: 'HTzone1',
    name: 'Artibonite Flood Plain',
    type: DisasterType.Flood,
    area: [ 
      { lat: 19.20, lng: -72.70 }, { lat: 19.25, lng: -72.65 },
      { lat: 19.18, lng: -72.50 }, { lat: 19.10, lng: -72.60 },
    ],
    severity: 'High',
    lastUpdated: new Date(Date.now() - 3600 * 1000 * 24 * 2), 
    description: 'Large agricultural area prone to seasonal flooding from the Artibonite River.'
  },
  {
    id: 'HTzone2',
    name: 'Enriquillo-Plantain Garden Fault Zone Risk Area',
    type: DisasterType.Earthquake,
    area: [
      { lat: 18.40, lng: -73.00 }, { lat: 18.42, lng: -72.90 },
      { lat: 18.45, lng: -72.80 }, { lat: 18.48, lng: -72.70 },
      { lat: 18.50, lng: -72.60 }, { lat: 18.51, lng: -72.50 },
      { lat: 18.505, lng: -72.50 }, { lat: 18.495, lng: -72.60 },
      { lat: 18.475, lng: -72.70 }, { lat: 18.445, lng: -72.80 },
      { lat: 18.415, lng: -72.90 }, { lat: 18.395, lng: -73.00 },
    ],
    severity: 'High',
    lastUpdated: new Date(Date.now() - 3600 * 1000 * 24 * 30), 
    description: 'Area along a major fault line with high seismic risk.'
  },
   {
    id: 'HTzone3',
    name: 'Coastal Storm Surge Zone - South',
    type: DisasterType.Storm,
    area: { center: { lat: 18.15, lng: -73.80 }, radius: 20000 }, 
    severity: 'Medium',
    lastUpdated: new Date(Date.now() - 3600 * 1000 * 24 * 5), 
    description: 'Southern coastal region vulnerable to storm surges during hurricane season.'
  }
];

export const MOCK_NEWS_HAITI: NewsArticle[] = [
  {
    id: "news1",
    title: "Heavy Rains Cause Flooding in Northern Haiti",
    description: "Several communities in the Nord Department are facing severe flooding after days of torrential rainfall. Emergency services are on alert.\n\nFurther details indicate that roads are impassable and several homes have been damaged. The local population is seeking shelter on higher ground.",
    imageUrl: "https://picsum.photos/seed/HTnewsFlood/400/200",
    source: "Haiti Libre",
    link: "#", 
    publishedDate: new Date(Date.now() - 3600 * 1000 * 5), 
    disasterTypeTags: [DisasterType.Flood, DisasterType.Storm]
  },
  {
    id: "news2",
    title: "Earthquake Preparedness Drills in Port-au-Prince Schools",
    description: "Local authorities and NGOs are conducting earthquake preparedness drills in schools across the capital to improve safety awareness.\n\nThese drills include 'drop, cover, and hold on' exercises and evacuation plans. The initiative aims to reduce casualties in the event of a seismic event.",
    imageUrl: "https://picsum.photos/seed/HTnewsQuake/400/200",
    source: "Le Nouvelliste",
    link: "#", 
    publishedDate: new Date(Date.now() - 3600 * 1000 * 24 * 1), 
    disasterTypeTags: [DisasterType.Earthquake]
  },
  // ... other news articles
];


export const TRANSLATIONS: { [langCode: string]: { [key: string]: string } } = {
  en: {
    missionStatement: "Empowering communities through real-time disaster alerts, verified reports, and accessible relief resources.",
    reportDisaster: "Report a Disaster",
    findHelp: "Find Help",
    viewLiveMap: "View Live Map",
    liveMapDashboard: "Live Map Dashboard",
    liveDisasterMapTitle: "Live Disaster Map", // For map page H1
    liveDisasterMapSubtitle: "Real-time view of disasters, relief resources, and community reports in your area.",
    filtersTitle: "Filters", // For map page sidebar
    interactiveMapViewTitle: "Interactive Map View", // For map page map section
    lastUpdatedTimestamp: "Last updated: {time}",
    legendTitle: "Legend",
    criticalAlertLegend: "Critical Alert", // Old, to be replaced by specific items
    availableResourceLegend: "Available Resource", // Old
    limitedCapacityLegend: "Limited Capacity", // Old
    filterByDisasterType: "Filter by Disaster Type:",
    filterBySeverity: "Filter by Severity/Status:", 
    allTypes: "All Types",
    allStatuses: "All Statuses",
    all: "All", // For map page main filter
    disasters: "Disasters", // For map page main filter
    hospitals: "Hospitals",
    foodCenters: "Food Centers",
    shelters: "Shelters",
    waterSources: "Water Sources",
    reportDisasterPage: "Report a Disaster",
    disasterType: "Disaster Type",
    selectDisasterType: "Select Disaster Type",
    description: "Description",
    enterDescription: "Enter a detailed description of the event...",
    location: "Location",
    selectRegion: "Select Region/City",
    useCurrentLocation: "Use Current Location",
    uploadPhoto: "Upload Photo (Optional)",
    contactInfoOptional: "Contact Info (Optional for follow-up)",
    enterContactInfo: "Enter your email or phone number",
    submitReport: "Submit Report",
    reliefResources: "Relief Resources", // Page Title
    reliefResourcesSubtitle: "Find nearby hospitals, shelters, food centers, and emergency services with real-time availability.",
    searchResourcesTitle: "Search Resources", // Sidebar title
    searchByNameOrService: "Search by name or service...", // Placeholder
    categoriesTitle: "Categories", // Sidebar title
    allResources: "All Resources", // Category filter
    'Medical Facilities': "Medical Facilities", // Category filter & resource type
    'Food Security': "Food Security", // Category filter & resource type
    'Shelters': "Shelters", // Category filter & resource type
    'Water Source': "Water Source", // Category filter & resource type
    'Emergency Services': "Emergency Services", // Category filter & resource type
    sortByTitle: "Sort By", // Sidebar title
    name: "Name", // Sort option & general use
    distance: "Distance", // Sort option
    availability: "Availability", // Sort option & general use
    status: "Status", 
    adminVerificationPanel: "Admin Verification Panel",
    tagReportAs: "Tag Report As:",
    verified: "Verified",
    underReview: "Under Review",
    duplicate: "Duplicate",
    updateStatus: "Update Status",
    aboutUs: "About Us",
    contactInfo: "Contact Info",
    socialMedia: "Social Media",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    joinAsVolunteer: "Join as a Volunteer",
    home: "Home",
    map: "Map",
    report: "Report",
    resources: "Resources",
    admin: "Admin",
    language: "Language",
    fontSize: "Font Size",
    contrastMode: "Contrast Mode",
    aiAssist: "Get AI Assistance",
    aiHelpfulTip: "AI Suggested Tip:",
    aiSummary: "AI Summary:",
    reportSubmittedSuccess: "Report submitted successfully!",
    reportSubmittedMapSuccess: "Report submitted! It will appear on the map and admin panel shortly.",
    reportSubmittedVoiceConfirmation: "Your report has been submitted and is being processed.",
    errorFetchingLocation: "Error fetching location. Please enter manually.",
    errorSubmittingReport: "Error submitting report. Please try again.",
    errorGemini: "Error fetching AI assistance. Please try again.",
    fetchingLocation: "Fetching location...",
    submittingReport: "Submitting report for processing...",
    generatingAiHelp: "Generating AI assistance...",
    noReportsFound: "No reports match your filters.",
    noResourcesFound: "No resources found match your criteria.",
    operatingHours: "Operating Hours",
    contact: "Contact",
    submittedBy: "Submitted by",
    submittedOn: "Submitted on",
    currentFilters: "Current Filters:",
    clearFilters: "Clear Filters",
    filters: "Filters",
    activeReports: "Active Reports",
    interactiveMapPlaceholder:"Interactive map displaying reports and resources will appear here.",
    mapInfo: "Map focused on Haiti. Pins represent disaster reports (colored by status) and relief resources (icons). Click pins for details.",
    reportDetails: "Report Details",
    resourceDetails: "Resource Details",
    address: "Address",
    keyFeatures: "Key Features",
    featureLiveMapDesc: "Visualize real-time disaster zones, user reports, and critical resources like hospitals and shelters on an interactive map.",
    citizenReporting: "Citizen Reporting",
    featureReportDesc: "Empower community members to submit disaster reports with details, GPS location, and photos, directly contributing to situational awareness.",
    verifiedInformationOld: "Verified Information",
    featureVerifiedDesc: "Access verified information and reports tagged by administrators and NGO partners, ensuring reliability during critical times.",
    resourceLocator: "Resource Locator",
    featureResourceDesc: "Quickly find nearby medical facilities, food centers, and shelters with updated availability and contact information.",
    multilingualAccess: "Multilingual Access",
    featureMultilingualDesc: "Accessible to diverse communities with support for multiple languages, ensuring inclusivity.",
    accessibilityFocused: "Accessibility Focused",
    featureAccessibilityDesc: "Designed with accessibility in mind, featuring adjustable font sizes and high-contrast modes for users with visual impairments.",
    fillRequiredFields: "Please fill in all required fields (Disaster Type, Description, and Region/City).",
    enterDescriptionForAI: "Please enter a description for AI assistance.",
    aiAssistanceGenerated: "AI assistance generated successfully!",
    clearAiHelp: "Clear AI Help",
    aiSuggestedType: "AI Suggested Type",
    enterLocationManually: "E.g., Address, City or Lat, Lon",
    locationFetched: "Location fetched successfully.",
    findNearbyHelp: "Find essential services like medical aid, food, and shelter near you.",
    searchByNameAddress: "Search by name, address, availability...",
    viewOnMap: "View on Map",
    tryAdjustingFilters: "Try adjusting your search terms or filters.",
    manageReportsDesc: "Review and verify citizen-submitted disaster reports.",
    reviewAndVerify: "Review & Verify",
    verifyReport: "Verify Report",
    currentStatus: "Current Status",
    haitiFocusMessage: "Map is currently focused on Haiti.",
    toggleLayers: "Toggle Layers",
    toggleDisasterZones: "Disaster Zones",
    toggleUserReports: "User Reports",
    toggleWaterSources: "Water Sources",
    filterReports: "Filter Reports",
    mapControls: "Map Controls",
    searchLocationPlaceholder: "Search location in Haiti...",
    gpsLock: "My Location",
    gpsUnlock: "Unlock GPS",
    gpsError: "Could not get GPS location.",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    disasterZone: "Disaster Zone",
    affectedArea: "Affected Area",
    severity: "Severity",
    lastUpdated: "Last Updated", // General term for timestamps
    Flood: "Flood",
    Earthquake: "Earthquake",
    Fire: "Fire",
    Hurricane: "Hurricane",
    Storm: "Storm",
    Landslide: "Landslide",
    Other: "Other",
    New: "New",
    settings: "Settings",
    liveDisasterNews: "Live Disaster News",
    filterByNewsType: "Filter News by Type:",
    readMore: "Read More",
    noNewsArticlesFound: "No news articles found matching your criteria.",
    disasterImage: "Image related to the disaster or resource",
    newsImageAlt: "Image related to news article",
    userReportedZoneName: "Reported {type} Area",
    userReportedZoneDescription: "This zone was automatically generated from a user report regarding a {type} event.",
    takeActionNow: "Take Action Now",
    emergencyAlertsTitle: "Emergency Alerts",
    emergencyAlertsSubtitle: "Stay informed about critical situations in Haiti. Receive real-time updates and safety advisories.",
    viewAlertsButton: "View Alerts",
    howWeHelpTitle: "How We Help Communities",
    howWeHelpSubtitle: "Our platform combines cutting-edge technology with community collaboration to create a comprehensive disaster response ecosystem.",
    realTimeAlertsTitle: "Real-time Alerts",
    realTimeAlertsDesc: "Get instant notifications about disasters in your area with precise location data and severity levels.",
    communityReportsTitle: "Community Reports",
    communityReportsDesc: "Share and receive verified disaster reports from locals who are on the ground.",
    resourceMappingTitle: "Resource Mapping",
    resourceMappingDesc: "Find nearby hospitals, shelters, and food centers with real-time availability updates.",
    verifiedInformationTitle: "Verified Information",
    verifiedInformationDesc: "All reports are verified by our partner NGOs and local authorities for accuracy.",
    emergencyContactsTitle: "Emergency Contact Numbers",
    police: "Police",
    ambulance: "Ambulance",
    disasterMgmt: "Disaster Mgmt.",
    articleNotFound: "News article not found.",
    backToHome: "Back to Home",
    fullStoryDetails: "Read Full Story at Source",
    // ReliefResourcesPage specific
    capacity: "Capacity",
    servicesAvailable: "Services Available",
    callNow: "Call Now",
    getDirections: "Get Directions",
    availableTag: "Available",
    limitedTag: "Limited",
    fullTag: "Full",
    unknownTag: "Unknown",
    updatedMinutesAgo: "Updated {minutes} minutes ago",
    updatedHoursAgo: "Updated {hours} hours ago",
    updatedDaysAgo: "Updated {days} days ago",
    updatedOnDate: "Updated on {date}",
    // Haitian Regions from HAITI_REGIONS
    Artibonite: "Artibonite",
    Centre: "Centre",
    "Grand'Anse": "Grand'Anse",
    Nippes: "Nippes",
    Nord: "North", 
    "Nord-Est": "North-East", 
    "Nord-Ouest": "North-West", 
    Ouest: "West", 
    Sud: "South", 
    "Sud-Est": "South-East",
    // Added specific locations
    "Léogâne": "Léogâne",
    "Petit Paradis": "Petit Paradis",
    "Gressier": "Gressier",
    "Chardonnières": "Chardonnières",
    "Petit Trou de Nippes": "Petit Trou de Nippes",
    "Corail": "Corail",
    "Môle Saint-Nicolas": "Môle Saint-Nicolas",
    "Anse-à-Veau": "Anse-à-Veau",
    "Jérémie": "Jérémie",
    "Cité Soleil": "Cité Soleil",
    "Morne-à-Chandelle": "Morne-à-Chandelle (Jacmel Vicinity)",
    "Petit-Goâve": "Petit-Goâve",
    "Port-de-Paix": "Port-de-Paix",
    "Cap-Haïtien": "Cap-Haïtien",
    "Les Abricots": "Les Abricots",
    "Saint-Louis-du-Sud": "Saint-Louis-du-Sud",
    "Baradères": "Baradères",
    "Cavaillon": "Cavaillon",
    "Fonds-des-Nègres": "Fonds-des-Nègres",
    "Tiburon": "Tiburon",
    adminSmsDispatched: "Administrative alert SMS to {phoneNumber} dispatched for report {reportId}.",
    // New legend keys for LiveMapPage
    legendUserReports: "User Reports",
    legendReportVerified: "Verified Report",
    legendReportUnderReview: "Report Under Review",
    legendReportNew: "New Report",
    legendReliefResources: "Relief Resources",
    legendMedicalFacility: "Medical Facility",
    legendShelter: "Shelter",
    legendWaterSource: "Water Source", // For new water icon
    legendDisasterZones: "Disaster Zones",
    legendZoneHigh: "High Severity Zone",
    legendZoneMedium: "Medium Severity Zone",
    legendZoneLow: "Low Severity Zone",
  },
  ht: { // Kreyòl ayisyen
    selectRegion: "Chwazi Rejyon/Vil", // Updated
    Artibonite: "Latibonit",
    Centre: "Sant",
    "Grand'Anse": "Grandans",
    Nippes: "Nip",
    Nord: "Nò",
    "Nord-Est": "Nòdès",
    "Nord-Ouest": "Nòdwès",
    Ouest: "Lwès",
    Sud: "Sid",
    "Sud-Est": "Sidès",
    fillRequiredFields: "Tanpri ranpli tout chan obligatwa yo (Kalite Dezas, Deskripsyon, ak Rejyon/Vil).",
    "Léogâne": "Leyogàn",
    // Other new locations would need Kreyòl translations
  },
  fr: { // Français
    selectRegion: "Sélectionner une Région/Ville", // Updated
    Artibonite: "Artibonite",
    Centre: "Centre",
    "Grand'Anse": "Grand'Anse",
    Nippes: "Nippes",
    Nord: "Nord",
    "Nord-Est": "Nord-Est",
    "Nord-Ouest": "Nord-Ouest",
    Ouest: "Ouest",
    Sud: "Sud",
    "Sud-Est": "Sud-Est",
    fillRequiredFields: "Veuillez remplir tous les champs obligatoires (Type de catastrophe, Description et Région/Ville).",
    "Léogâne": "Léogâne",
    // Other new locations would need French translations
  },
  // hi, ta, bn would also need these, but for brevity, I'll skip adding all region translations.
  // The auto-fill logic will handle fallbacks.
};

// Auto-fill missing translations with English fallbacks
Object.keys(TRANSLATIONS.en).forEach(key => {
  Object.keys(TRANSLATIONS).forEach(langCode => {
    if (langCode !== 'en' && !TRANSLATIONS[langCode][key]) {
      TRANSLATIONS[langCode][key] = TRANSLATIONS.en[key]; 
    }
  });
});


export const GEMINI_API_KEY = process.env.API_KEY || "YOUR_API_KEY_HERE"; 
export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';