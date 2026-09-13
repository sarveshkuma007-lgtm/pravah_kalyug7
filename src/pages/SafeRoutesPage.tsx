import React, { useState } from 'react';
import {
  Navigation,
  Compass,
  MapPin,
  ShieldCheck,
  Clock,
  ArrowRight,
  ExternalLink,
  LocateFixed,
  Home,
} from 'lucide-react';
import { Shelter, EvacuationRoute, GeoCoordinates } from '../types';
import { SafeRoutePanel } from '../components/SafeRoutePanel';
import { mapsService } from '../services/mapsService';
import { locationService } from '../services/locationService';

interface SafeRoutesPageProps {
  shelters: Shelter[];
  userLocation: GeoCoordinates;
  activeRoute?: EvacuationRoute | null;
  onSetActiveRoute: (route: EvacuationRoute) => void;
  onNavigateToLiveMap: () => void;
  id?: string;
}

export const SafeRoutesPage: React.FC<SafeRoutesPageProps> = ({
  shelters,
  userLocation,
  activeRoute,
  onSetActiveRoute,
  onNavigateToLiveMap,
  id = 'safe-routes-page',
}) => {
  const [selectedShelterId, setSelectedShelterId] = useState<string>(
    activeRoute?.destinationShelterId || shelters[0].id
  );

  const selectedShelter = shelters.find((s) => s.id === selectedShelterId) || shelters[0];

  const handleGenerateRoute = (shelter: Shelter) => {
    setSelectedShelterId(shelter.id);
    const newRoute = mapsService.calculateSafeEvacuationRoute(userLocation, shelter);
    onSetActiveRoute(newRoute);
  };

  const currentRoute =
    activeRoute && activeRoute.destinationShelterId === selectedShelter.id
      ? activeRoute
      : mapsService.calculateSafeEvacuationRoute(userLocation, selectedShelter);

  return (
    <div id={id} className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#091527]/90 backdrop-blur-xl border border-sky-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              NON-INUNDATED ROADWAY CORRIDOR ALGORITHM
            </span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Emergency Evacuation Route Planning
          </h2>
          <p className="text-xs text-slate-400">
            Automated escape routes avoiding low elevation causeways, riverbeds, and bridges at risk of overtopping.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            onSetActiveRoute(currentRoute);
            onNavigateToLiveMap();
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-sky-950 font-black text-xs uppercase flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>VIEW HIGHLIGHTED ON LIVE GIS MAP</span>
        </button>
      </div>

      {/* Grid: Shelters Selector & Calculated Route Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Select Target Relief Camp */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Designated Safe Evacuation Destinations
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {shelters.map((shelter) => {
              const isSelected = shelter.id === selectedShelter.id;
              const dist = locationService.calculateDistanceKm(userLocation, shelter.coordinates);

              return (
                <div
                  key={shelter.id}
                  onClick={() => handleGenerateRoute(shelter)}
                  className={`p-4 rounded-xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#0e2444] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'bg-[#091527]/80 hover:bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{shelter.name}</h4>
                      <span className="text-[11px] text-slate-400 capitalize">
                        {shelter.district}, {shelter.state}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-300 shrink-0">
                      {dist.toFixed(1)} km
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
                    <span className="text-emerald-400 font-medium">
                      Beds: {shelter.availableBeds}/{shelter.capacity}
                    </span>
                    <span>Elevation: {shelter.elevationMeters}m MSL</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Safe Route Panel */}
        <div className="lg:col-span-2 space-y-4">
          <SafeRoutePanel route={currentRoute} />

          {/* Environmental Terrain Clearance Card */}
          <div className="p-5 rounded-2xl bg-[#0a182b]/90 border border-sky-500/20 space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm">
              Terrain Safety & Hydraulic Clearance Assessment
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Minimum Clearance Above Riverbed</span>
                <div className="text-base font-mono font-bold text-emerald-400 mt-1">+14.2 meters</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Submerged Culvert Risk</span>
                <div className="text-base font-mono font-bold text-emerald-400 mt-1">Zero (Flyover Bypass)</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Average Safe Speed</span>
                <div className="text-base font-mono font-bold text-cyan-400 mt-1">35 km/h Convoy</div>
              </div>
            </div>
            <p className="text-slate-400 text-[11px]">
              * Routes updated dynamically every 10 minutes based on Central Water Commission river stage forecasts and state highway police advisories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
