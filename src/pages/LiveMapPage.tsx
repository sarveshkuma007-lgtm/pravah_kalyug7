import React, { useState } from 'react';
import {
  Map,
  Compass,
  Layers,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Navigation,
  RefreshCw,
  LocateFixed,
  MapPin,
} from 'lucide-react';
import { Dam, FloodZone, Shelter, EvacuationRoute, GeoCoordinates } from '../types';
import { MapView } from '../components/MapView';
import { MapLegend } from '../components/MapLegend';
import { SafeRoutePanel } from '../components/SafeRoutePanel';
import { DamDetailsCard } from '../components/DamDetailsCard';
import { ShelterCard } from '../components/ShelterCard';
import { mapsService } from '../services/mapsService';
import { locationService } from '../services/locationService';

interface LiveMapPageProps {
  dams: Dam[];
  floodZones: FloodZone[];
  shelters: Shelter[];
  userLocation: GeoCoordinates;
  activeRoute?: EvacuationRoute | null;
  onClearActiveRoute?: () => void;
  onSetActiveRoute?: (route: EvacuationRoute) => void;
  selectedDam?: Dam | null;
  onSelectDam?: (dam: Dam) => void;
  onUpdateUserLocation?: (coords: GeoCoordinates) => void;
  id?: string;
}

export const LiveMapPage: React.FC<LiveMapPageProps> = ({
  dams,
  floodZones,
  shelters,
  userLocation,
  activeRoute,
  onClearActiveRoute,
  onSetActiveRoute,
  selectedDam,
  onSelectDam,
  onUpdateUserLocation,
  id = 'live-map-page',
}) => {
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [safetyCheckResult, setSafetyCheckResult] = useState<string | null>(null);

  // Quick preset locations to test different scenarios
  const testLocations = [
    { label: 'Rishikesh (Ganga High Inundation)', coords: { lat: 30.1033, lng: 78.2947 } },
    { label: 'Bharuch (Narmada Basin Watch)', coords: { lat: 21.7051, lng: 72.9959 } },
    { label: 'Dehradun Plateau (Safe High Ridge)', coords: { lat: 30.34, lng: 78.04 } },
    { label: 'Aluva (Periyar Surge Zone)', coords: { lat: 10.1076, lng: 76.3516 } },
  ];

  // Perform "Am I Safe?" assessment
  const handleSafetyCheck = () => {
    const assessment = locationService.getNearestFloodZone(userLocation, floodZones);
    const nearestDam = locationService.getNearestDam(userLocation, dams);

    if (assessment.isInsideOrNear && assessment.zone.level === 'high') {
      setSafetyCheckResult(
        `⚠️ HIGH RISK: You are within ${assessment.distanceKm.toFixed(1)} km of "${assessment.zone.name}" (Red Inundation Zone). Nearest dam is ${nearestDam.dam.name}. Immediate relocation to shelter advised.`
      );
    } else if (assessment.isInsideOrNear && assessment.zone.level === 'moderate') {
      setSafetyCheckResult(
        `⚠️ MODERATE WARNING: Located approx ${assessment.distanceKm.toFixed(1)} km from "${assessment.zone.name}". Water levels rising. Stay prepared.`
      );
    } else {
      setSafetyCheckResult(
        `✅ SAFE: Your location is outside active riverbed flood zones. Nearest flood margin is ${assessment.distanceKm.toFixed(1)} km away.`
      );
    }
  };

  const handleCalculateRouteToShelter = (shelter: Shelter) => {
    const route = mapsService.calculateSafeEvacuationRoute(userLocation, shelter);
    if (onSetActiveRoute) {
      onSetActiveRoute(route);
    }
  };

  return (
    <div id={id} className="space-y-4 pb-12">
      {/* Top Banner with Quick Location Presets & "Am I Safe?" instant trigger */}
      <div className="p-4 rounded-2xl bg-[#091527]/90 backdrop-blur-xl border border-sky-500/20 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Live GIS Cartography & Inundation Modeler
            </h2>
            <p className="text-xs text-slate-400">
              User GPS: <strong className="text-cyan-300 font-mono">{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Preset Location Dropdown / Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">Test Preset:</span>
            {testLocations.map((loc) => (
              <button
                key={loc.label}
                type="button"
                onClick={() => {
                  if (onUpdateUserLocation) onUpdateUserLocation(loc.coords);
                  setSafetyCheckResult(null);
                }}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 transition-colors cursor-pointer"
              >
                {loc.label.split(' ')[0]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSafetyCheck}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-sky-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>"Am I Safe?" Check</span>
          </button>
        </div>
      </div>

      {/* Safety Check Modal/Alert banner if triggered */}
      {safetyCheckResult && (
        <div className="p-4 rounded-xl bg-sky-950/80 border border-cyan-400/40 text-xs text-white flex items-start justify-between gap-3 animate-in fade-in">
          <div className="leading-relaxed">{safetyCheckResult}</div>
          <button
            type="button"
            onClick={() => setSafetyCheckResult(null)}
            className="text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Map View Area */}
      <div className="relative w-full h-[650px]">
        <MapView
          dams={dams}
          floodZones={floodZones}
          shelters={shelters}
          userLocation={userLocation}
          activeRoute={activeRoute}
          selectedDam={selectedDam}
          onSelectDam={onSelectDam}
          onSelectShelter={(sh) => setSelectedShelter(sh)}
        />

        {/* Overlay Left: Legend */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
          <MapLegend />
        </div>

        {/* Overlay Floating: Active Route Panel (if calculated) */}
        {activeRoute && (
          <div className="absolute top-16 left-4 z-20 pointer-events-auto">
            <SafeRoutePanel
              route={activeRoute}
              onClose={() => {
                if (onClearActiveRoute) onClearActiveRoute();
              }}
            />
          </div>
        )}

        {/* Overlay Floating: Selected Dam Quick Telemetry Inspector */}
        {selectedDam && !activeRoute && (
          <div className="absolute top-16 left-4 z-20 pointer-events-auto max-w-md w-full">
            <DamDetailsCard
              dam={selectedDam}
              onClose={() => onSelectDam && onSelectDam(dams[0])}
            />
          </div>
        )}

        {/* Overlay Floating: Selected Shelter Inspector */}
        {selectedShelter && (
          <div className="absolute top-16 left-4 z-20 pointer-events-auto max-w-sm w-full">
            <ShelterCard
              shelter={selectedShelter}
              distanceKm={locationService.calculateDistanceKm(userLocation, selectedShelter.coordinates)}
              onNavigateTo={handleCalculateRouteToShelter}
            />
          </div>
        )}
      </div>
    </div>
  );
};
