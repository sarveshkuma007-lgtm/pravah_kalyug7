import React from 'react';
import { Navigation, Clock, ShieldCheck, AlertCircle, ArrowRight, CheckCircle2, MapPin, X } from 'lucide-react';
import { EvacuationRoute } from '../types';

interface SafeRoutePanelProps {
  route: EvacuationRoute;
  onClose?: () => void;
  id?: string;
}

export const SafeRoutePanel: React.FC<SafeRoutePanelProps> = ({ route, onClose, id = 'safe-route-panel' }) => {
  return (
    <div
      id={id}
      className="p-5 rounded-2xl bg-[#091527]/95 backdrop-blur-2xl border border-cyan-500/40 shadow-2xl space-y-4 max-w-md w-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Safe Evacuation Corridor
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SAFETY: {route.safetyScore}%
              </span>
            </div>
            <h4 className="text-base font-bold text-white tracking-tight">{route.destinationName}</h4>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Total Distance</span>
          <div className="text-lg font-mono font-bold text-white mt-0.5">
            {route.totalDistanceKm} <span className="text-xs font-normal text-slate-400">km</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Estimated ETA</span>
          <div className="text-lg font-mono font-bold text-cyan-300 mt-0.5 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>~{route.estimatedTravelTimeMinutes} mins</span>
          </div>
        </div>
      </div>

      {/* Turn-by-Turn Guidance */}
      <div>
        <div className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">
          Turn-by-Turn Evacuation Waypoints
        </div>

        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {route.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs flex items-start gap-2.5"
            >
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                {idx + 1}
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-slate-200 font-medium">{step.instruction}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>{step.distanceKm} km</span>
                  <span>•</span>
                  <span>~{step.estimatedMinutes} mins</span>
                  {step.isSafe && (
                    <span className="text-emerald-400 flex items-center gap-0.5 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Elevated & Inundation-Free
                    </span>
                  )}
                </div>
                {step.hazardNote && (
                  <div className="text-[10px] text-amber-300/90 pt-0.5">
                    ⚠️ {step.hazardNote}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-[11px] text-cyan-200 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>This route strictly avoids low-elevation riverbanks and submerged causeways.</span>
      </div>
    </div>
  );
};
