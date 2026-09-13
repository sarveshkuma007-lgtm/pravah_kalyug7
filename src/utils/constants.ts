import { SupportedLanguage } from '../types';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'od', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
];

export const EMERGENCY_CONTACTS = [
  { name: 'National Disaster Management Authority (NDMA)', number: '1078', type: 'Toll-Free Helpline' },
  { name: 'National Disaster Response Force (NDRF)', number: '011-24363260', type: 'Headquarters' },
  { name: 'Central Water Commission (CWC) Flood Control Room', number: '011-26106523', type: 'Hydrology Control' },
  { name: 'Emergency Medical Services (Ambulance)', number: '108', type: 'Emergency Health' },
  { name: 'Police Emergency Response Support System', number: '112', type: 'National ERSS' },
  { name: 'State Flood Emergency Operation Center (SEOC)', number: '1070', type: 'State Level' },
];

export const DEFAULT_MAP_CENTER = {
  lat: 21.8129,
  lng: 78.9629, // Center of India
};

export const RIVER_BASINS = [
  'All Basins',
  'Ganga Basin',
  'Brahmaputra Basin',
  'Narmada Basin',
  'Godavari Basin',
  'Krishna Basin',
  'Mahanadi Basin',
  'Cauvery Basin',
  'Indus & Tributaries',
  'Tapi Basin',
  'Periyar Basin',
];

export const INDIAN_STATES = [
  'All States',
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Gujarat',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];
