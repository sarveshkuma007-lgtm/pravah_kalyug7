/**
 * PRAVAH - National Dam Safety & Flood Evacuation Intelligence
 * Core Type Definitions
 */

export type DamRiskStatus = 'normal' | 'warning' | 'critical';

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface DamTelemetry {
  waterLevelMeters: number;
  fullReservoirLevelMeters: number;
  dangerLevelMeters: number;
  warningLevelMeters: number;
  liveCapacityMCM: number;
  grossCapacityMCM: number;
  currentInflowCusecs: number;
  currentOutflowCusecs: number;
  gatesOpen: number;
  totalGates: number;
  rainfall24hMm: number;
  seismicStabilityScore: number; // 0 - 100
  damHealthScore: number; // 0 - 100
  lastUpdated: string;
}

export interface WaterLevelHistoryPoint {
  date: string;
  waterLevel: number;
  inflow: number;
  outflow: number;
  rainfall: number;
}

export interface Dam {
  id: string;
  name: string;
  state: string;
  district: string;
  riverBasin: string;
  river: string;
  coordinates: GeoCoordinates;
  status: DamRiskStatus;
  type: string;
  commissionedYear: number;
  heightMeters: number;
  lengthMeters: number;
  telemetry: DamTelemetry;
  history: WaterLevelHistoryPoint[];
  downstreamDistricts: string[];
  alertLevelDescription: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'advisory' | 'resolved';

export interface EmergencyAlert {
  id: string;
  damId: string;
  damName: string;
  title: string;
  severity: AlertSeverity;
  description: string;
  actionRequired: string;
  affectedDistricts: string[];
  estimatedAffectedPopulation: number;
  issuedAt: string;
  source: string; // e.g., 'Central Water Commission', 'NDRF', 'SDMA'
  evacuationStatus: 'standby' | 'active' | 'mandatory' | 'lifted';
}

export interface Shelter {
  id: string;
  name: string;
  type: 'cyclone_shelter' | 'community_center' | 'school' | 'stadium' | 'relief_camp';
  state: string;
  district: string;
  coordinates: GeoCoordinates;
  capacity: number;
  currentOccupancy: number;
  availableBeds: number;
  medicalTeamOnSite: boolean;
  foodWaterStockDays: number;
  emergencyContact: string;
  status: 'operational' | 'near_capacity' | 'full';
  elevationMeters: number;
  address: string;
}

export type FloodDangerLevel = 'high' | 'moderate' | 'safe';

export interface FloodZone {
  id: string;
  name: string;
  riverBasin: string;
  district: string;
  state: string;
  level: FloodDangerLevel; // 'high' = red, 'moderate' = yellow, 'safe' = green
  inundationProbability: number; // 0 - 100
  projectedPeakTime: string;
  riskDescription: string;
  coordinates: GeoCoordinates[]; // Polygon boundary points
  center: GeoCoordinates;
}

export interface EvacuationRouteStep {
  instruction: string;
  distanceKm: number;
  estimatedMinutes: number;
  hazardNote?: string;
  isSafe: boolean;
}

export interface EvacuationRoute {
  id: string;
  startPoint: GeoCoordinates;
  destinationShelterId: string;
  destinationName: string;
  totalDistanceKm: number;
  estimatedTravelTimeMinutes: number;
  safetyScore: number; // 0 - 100
  waypoints: GeoCoordinates[];
  steps: EvacuationRouteStep[];
  isActiveRecommendation: boolean;
}

export interface WeatherTelemetry {
  locationName: string;
  state: string;
  temperatureCelsius: number;
  humidityPercentage: number;
  windSpeedKmh: number;
  windDirection: string;
  rainfallRateMmH: number;
  accumulatedRainfall24hMm: number;
  forecastSummary: string;
  condition: 'clear' | 'cloudy' | 'rain' | 'heavy_rain' | 'thunderstorm';
  hourlyForecast: {
    time: string;
    rainfallMm: number;
    tempC: number;
  }[];
}

export interface FloodPredictionModel {
  damId: string;
  damName: string;
  predictionHorizonHours: number;
  inflowTrend: 'rapid_rise' | 'steady_rise' | 'plateau' | 'falling';
  projectedPeakInflowCusecs: number;
  estimatedTimeToSpillHours: number | null;
  floodArrivalEta: string;
  affectedPopulationEstimate: number;
  recommendedReleaseRateCusecs: number;
  aiConfidenceScore: number; // percentage
  aiRecommendations: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionPayload?: {
    type: 'NAVIGATE_MAP_ROUTE';
    shelterId?: string;
    damId?: string;
    focusCoordinates?: GeoCoordinates;
    highlightRoute?: boolean;
    routeId?: string;
  };
}

export interface MapViewState {
  center: GeoCoordinates;
  zoom: number;
  selectedDamId: string | null;
  selectedShelterId: string | null;
  selectedFloodZoneId: string | null;
  highlightedRouteId: string | null;
  userLocation: GeoCoordinates | null;
  filterRisk: 'all' | 'critical' | 'warning' | 'normal';
  showShelters: boolean;
  showFloodZones: boolean;
  showRainRadar: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'officer' | 'admin' | 'citizen';
  assignedDamId?: string;
  department?: string;
  state?: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  user: {
    id: string;
    name: string;
    emailOrMobile: string;
    role: 'disaster_officer' | 'field_inspector' | 'citizen_guest';
    department?: string;
    state?: string;
  } | null;
}

export type SupportedLanguage = 
  | 'en' // English
  | 'hi' // Hindi
  | 'bn' // Bengali
  | 'te' // Telugu
  | 'mr' // Marathi
  | 'ta' // Tamil
  | 'gu' // Gujarati
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'pa' // Punjabi
  | 'od' // Odia
  | 'as'; // Assamese

export type PageView =
  | 'splash'
  | 'login'
  | 'dashboard'
  | 'dam-monitoring'
  | 'live-map'
  | 'flood-prediction'
  | 'weather-forecast'
  | 'alerts'
  | 'safe-routes'
  | 'all-dams'
  | 'reports'
  | 'settings';
