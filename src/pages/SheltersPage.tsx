import React, { useState } from 'react';
import { Home, Search, Bed, Stethoscope, Phone, Filter, ShieldCheck } from 'lucide-react';
import { Shelter, GeoCoordinates } from '../types';
import { ShelterCard } from '../components/ShelterCard';
import { locationService } from '../services/locationService';

interface SheltersPageProps {
  shelters: Shelter[];
  userLocation: GeoCoordinates;
  onNavigateToShelter: (shelter: Shelter) => void;
  id?: string;
}

export const SheltersPage: React.FC<SheltersPageProps> = ({
  shelters,
  userLocation,
  onNavigateToShelter,
  id = 'shelters-page',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');

  const states = ['All', ...Array.from(new Set(shelters.map((s) => s.state)))];

  const filteredShelters = shelters.filter((s) => {
    if (selectedState !== 'All' && s.state !== selectedState) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matches =
        s.name.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });

  const totalBeds = shelters.reduce((acc, s) => acc + s.capacity, 0);
  const freeBeds = shelters.reduce((acc, s) => acc + s.availableBeds, 0);

  return (
    <div id={id} className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#091527]/90 backdrop-blur-xl border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              NDMA VERIFIED SAFE ASSEMBLY CENTERS
            </span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Relief Camps & Flood Disaster Shelters
          </h2>
          <p className="text-xs text-slate-400">
            Emergency shelters equipped with 24x7 medical teams, food stocks, safe water purification, and backup power.
          </p>
        </div>

        {/* Global Bed Stats Strip */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <div className="px-3">
            <span className="text-[10px] text-slate-400 block uppercase">Total Bed Capacity</span>
            <span className="text-sm font-mono font-bold text-white">{totalBeds.toLocaleString('en-IN')}</span>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div className="px-3">
            <span className="text-[10px] text-emerald-400 block uppercase">Available Beds</span>
            <span className="text-sm font-mono font-bold text-emerald-300">{freeBeds.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#091527]/80 border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {states.map((state) => (
            <button
              key={state}
              type="button"
              onClick={() => setSelectedState(state)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedState === state
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {state}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shelter name or city..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShelters.map((shelter) => {
          const dist = locationService.calculateDistanceKm(userLocation, shelter.coordinates);
          return (
            <ShelterCard
              key={shelter.id}
              shelter={shelter}
              distanceKm={dist}
              onNavigateTo={onNavigateToShelter}
            />
          );
        })}
      </div>
    </div>
  );
};
