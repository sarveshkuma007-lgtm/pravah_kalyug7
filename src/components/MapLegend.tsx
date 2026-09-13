import React from 'react';
import { Layers, ShieldCheck, AlertTriangle, ShieldAlert, Home, Navigation, MapPin } from 'lucide-react';

interface MapLegendProps {
  id?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({ id = 'map-legend' }) => {
  return (
    <div
      id={id}
      className="p-3.5 rounded-xl bg-[#071322]/90 backdrop-blur-xl border border-sky-500/20 shadow-xl text-xs space-y-2.5 max-w-xs"
    >
      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-cyan-400 border-b border-slate-800 pb-1.5">
        <Layers className="w-3.5 h-3.5" />
        <span>Map Cartography Layers & Risk Index</span>
      </div>

      <div className="space-y-2">
        {/* Flood Inundation Zones */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Flood Risk Zones</span>
          <div className="grid grid-cols-1 gap-1">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-red-500/30 border-2 border-red-500" />
              <span className="text-red-300 font-medium text-[11px]">High Danger Inundation (Red Zone)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-amber-500/30 border-2 border-amber-500" />
              <span className="text-amber-300 font-medium text-[11px]">Moderate Warning (Yellow Zone)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500/30 border-2 border-emerald-500" />
              <span className="text-emerald-300 font-medium text-[11px]">Safe Relief Assembly (Green Zone)</span>
            </div>
          </div>
        </div>

        {/* Route and Pins */}
        <div className="space-y-1 pt-1 border-t border-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Telemetry & Nav Points</span>
          <div className="grid grid-cols-1 gap-1">
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />
              <span className="text-cyan-300 font-medium text-[11px]">Recommended Evacuation Path (Blue)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-sky-500 border border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <span className="text-slate-300 text-[11px]">Active Dam Monitoring Sensor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-emerald-700 border border-emerald-400 flex items-center justify-center text-[9px] text-white">
                <Home className="w-2.5 h-2.5" />
              </div>
              <span className="text-slate-300 text-[11px]">Designated Relief Shelter</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-600 border border-white flex items-center justify-center animate-ping">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <span className="text-slate-300 text-[11px]">Current User GPS Location</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
