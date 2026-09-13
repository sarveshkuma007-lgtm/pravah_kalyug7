import React from 'react';
import { Home, Bed, Stethoscope, Utensils, Phone, Navigation, ShieldCheck, MapPin } from 'lucide-react';
import { Shelter } from '../types';

interface ShelterCardProps {
  shelter: Shelter;
  distanceKm?: number;
  onNavigateTo?: (shelter: Shelter) => void;
  id?: string;
}

export const ShelterCard: React.FC<ShelterCardProps> = ({
  shelter,
  distanceKm,
  onNavigateTo,
  id,
}) => {
  const occupancyPercentage = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);

  return (
    <div
      id={id || `shelter-card-${shelter.id}`}
      className="p-5 rounded-2xl bg-[#091527]/85 backdrop-blur-xl border border-emerald-500/30 shadow-lg hover:border-emerald-400/50 transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {shelter.district}, {shelter.state}
              </span>
            </div>
            <h4 className="text-base font-bold text-white tracking-tight">{shelter.name}</h4>
            <span className="text-[11px] text-slate-400 capitalize">{shelter.type.replace('_', ' ')} Refuge</span>
          </div>

          {distanceKm !== undefined && (
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 shrink-0">
              {distanceKm.toFixed(1)} km away
            </span>
          )}
        </div>

        {/* Capacity Bar */}
        <div className="my-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-emerald-400" />
              Bed Availability
            </span>
            <span className="font-mono font-bold text-emerald-300">
              {shelter.availableBeds} Free / {shelter.capacity} Total
            </span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                occupancyPercentage > 90
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-400'
              }`}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400 font-mono">
            <span>Occupied: {shelter.currentOccupancy} ({occupancyPercentage}%)</span>
            <span>Elevation: {shelter.elevationMeters}m MSL</span>
          </div>
        </div>

        {/* Facility Badges */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center gap-2">
            <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300 text-[11px]">
              {shelter.medicalTeamOnSite ? 'Medical Team Active' : 'Standby Medic'}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center gap-2">
            <Utensils className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300 text-[11px]">
              {shelter.foodWaterStockDays} Days Rations
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 mb-3 line-clamp-1">
          📍 {shelter.address}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
        <a
          href={`tel:${shelter.emergencyContact.replace(/[^0-9]/g, '')}`}
          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Phone className="w-3 h-3 text-cyan-400" />
          <span>Call Shelter</span>
        </a>

        {onNavigateTo && (
          <button
            type="button"
            onClick={() => onNavigateTo(shelter)}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/30 transition-all cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Map Evacuation Path</span>
          </button>
        )}
      </div>
    </div>
  );
};
