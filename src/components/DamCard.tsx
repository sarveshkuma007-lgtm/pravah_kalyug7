import React from 'react';
import { Waves, ArrowDownRight, ArrowUpRight, ShieldCheck, AlertCircle, AlertTriangle, MapPin, Gauge } from 'lucide-react';
import { Dam } from '../types';
import { getRiskBadgeClasses, formatDischargeCusecs } from '../utils/formatters';
import { calculateDamRisk } from '../utils/riskCalculator';

interface DamCardProps {
  dam: Dam;
  onSelect?: (dam: Dam) => void;
  onViewOnMap?: (dam: Dam) => void;
  isSelected?: boolean;
  id?: string;
}

export const DamCard: React.FC<DamCardProps> = ({
  dam,
  onSelect,
  onViewOnMap,
  isSelected = false,
  id,
}) => {
  const riskAssessment = calculateDamRisk(dam.telemetry);
  const badge = getRiskBadgeClasses(dam.status);

  return (
    <div
      id={id || `dam-card-${dam.id}`}
      className={`relative p-5 rounded-2xl bg-[#091527]/85 backdrop-blur-xl border transition-all duration-200 flex flex-col justify-between ${
        isSelected
          ? 'border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
          : 'border-slate-800/90 hover:border-sky-500/40 hover:bg-[#0c1c33]/90'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-cyan-400/90 font-medium mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {dam.district}, {dam.state}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{dam.name}</h3>
            <span className="text-xs text-slate-400">{dam.river} • {dam.riverBasin}</span>
          </div>

          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border shrink-0 ${badge.bg} ${badge.text} ${badge.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            <span>{badge.label}</span>
          </span>
        </div>

        {/* Water Level Gauge Progress */}
        <div className="my-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-cyan-400" />
              Water Level vs FRL
            </span>
            <span className="font-mono font-bold text-white">
              {dam.telemetry.waterLevelMeters}m / {dam.telemetry.fullReservoirLevelMeters}m
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                riskAssessment.capacityPercentage > 95
                  ? 'bg-gradient-to-r from-red-600 to-rose-500 shadow-[0_0_8px_#ef4444]'
                  : riskAssessment.capacityPercentage > 85
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-sky-500 to-cyan-400'
              }`}
              style={{ width: `${Math.min(100, riskAssessment.capacityPercentage)}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-400 font-mono">
            <span>Storage: {riskAssessment.capacityPercentage}%</span>
            <span>Freeboard: {riskAssessment.freeboardMeters}m</span>
          </div>
        </div>

        {/* Inflow vs Outflow grid */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase font-medium flex items-center gap-1">
              <ArrowDownRight className="w-3 h-3 text-cyan-400" />
              <span>Current Inflow</span>
            </div>
            <div className="font-mono font-bold text-white text-sm mt-0.5">
              {formatDischargeCusecs(dam.telemetry.currentInflowCusecs)}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase font-medium flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-amber-400" />
              <span>Outflow Discharge</span>
            </div>
            <div className="font-mono font-bold text-white text-sm mt-0.5">
              {formatDischargeCusecs(dam.telemetry.currentOutflowCusecs)}
            </div>
          </div>
        </div>

        {/* Bottom indicators: Gates & Rainfall */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2">
          <span className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Gates: <strong className="text-slate-200">{dam.telemetry.gatesOpen}/{dam.telemetry.totalGates}</strong>
            </span>
          </span>
          <span>
            24h Rain: <strong className="text-cyan-300 font-mono">{dam.telemetry.rainfall24hMm}mm</strong>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
        {onSelect && (
          <button
            type="button"
            onClick={() => onSelect(dam)}
            className="flex-1 py-2 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 text-xs font-semibold border border-cyan-500/20 transition-all cursor-pointer text-center"
          >
            Telemetry Details
          </button>
        )}
        {onViewOnMap && (
          <button
            type="button"
            onClick={() => onViewOnMap(dam)}
            className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            title="Locate on Map"
          >
            Map
          </button>
        )}
      </div>
    </div>
  );
};
