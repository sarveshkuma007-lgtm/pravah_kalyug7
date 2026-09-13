import React from 'react';
import {
  Waves,
  Shield,
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  X,
  MapPin,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { Dam } from '../types';
import { getRiskBadgeClasses, formatDischargeCusecs, formatCapacityMCM } from '../utils/formatters';
import { calculateDamRisk } from '../utils/riskCalculator';

interface DamDetailsCardProps {
  dam: Dam;
  onClose?: () => void;
  onViewOnMap?: (dam: Dam) => void;
  id?: string;
}

export const DamDetailsCard: React.FC<DamDetailsCardProps> = ({
  dam,
  onClose,
  onViewOnMap,
  id = 'dam-details-card',
}) => {
  const risk = calculateDamRisk(dam.telemetry);
  const badge = getRiskBadgeClasses(dam.status);

  return (
    <div
      id={id}
      className="p-6 rounded-2xl bg-[#091527]/95 backdrop-blur-2xl border border-sky-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${badge.bg} ${badge.text} ${badge.border}`}
            >
              <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
              <span>{badge.label}</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {dam.id}</span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">{dam.name}</h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1 text-cyan-400">
              <MapPin className="w-3.5 h-3.5" />
              {dam.district}, {dam.state}
            </span>
            <span>•</span>
            <span>River: <strong className="text-slate-200">{dam.river}</strong></span>
            <span>•</span>
            <span>Basin: <strong className="text-slate-200">{dam.riverBasin}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onViewOnMap && (
            <button
              type="button"
              onClick={() => onViewOnMap(dam)}
              className="p-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer"
              title="Pinpoint on Map"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Hydraulic Critical Gauge Stack */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Waves className="w-4 h-4" />
            Reservoir Elevation & Critical Thresholds
          </span>
          <span className="text-xs font-mono font-bold text-white">
            Current: {dam.telemetry.waterLevelMeters} m
          </span>
        </div>

        {/* Level bar representation */}
        <div className="relative pt-6 pb-2">
          {/* Danger mark */}
          <div
            className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center z-10"
            style={{
              left: `${Math.min(
                100,
                (dam.telemetry.dangerLevelMeters / dam.telemetry.fullReservoirLevelMeters) * 100
              )}%`,
            }}
          >
            <span className="text-[9px] font-mono font-bold text-red-400 bg-red-950/80 px-1 py-0.5 rounded border border-red-500/40">
              DANGER {dam.telemetry.dangerLevelMeters}m
            </span>
            <div className="w-0.5 h-3 bg-red-500" />
          </div>

          <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                dam.status === 'critical'
                  ? 'bg-gradient-to-r from-red-600 via-rose-500 to-red-400 shadow-[0_0_12px_#ef4444]'
                  : dam.status === 'warning'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-sky-500 to-cyan-400'
              }`}
              style={{ width: `${risk.capacityPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] text-slate-400">Full Reservoir (FRL)</div>
            <div className="font-mono font-bold text-slate-200 mt-0.5">
              {dam.telemetry.fullReservoirLevelMeters} m
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] text-amber-400">Warning Level</div>
            <div className="font-mono font-bold text-amber-300 mt-0.5">
              {dam.telemetry.warningLevelMeters} m
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] text-red-400">Danger Threshold</div>
            <div className="font-mono font-bold text-red-300 mt-0.5">
              {dam.telemetry.dangerLevelMeters} m
            </div>
          </div>
        </div>
      </div>

      {/* Discharge & Inflow Dual Monitor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <ArrowDownRight className="w-4 h-4 text-cyan-400" />
              Incoming Inflow
            </span>
            <span className="text-[10px] text-cyan-400/80 font-mono">Telemetry Sensor</span>
          </div>
          <div className="text-xl font-mono font-black text-white">
            {formatDischargeCusecs(dam.telemetry.currentInflowCusecs)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            24h Catchment Rain: <strong className="text-cyan-300">{dam.telemetry.rainfall24hMm} mm</strong>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
              Spillway Discharge
            </span>
            <span className="text-[10px] text-amber-400/80 font-mono">Radial Gates</span>
          </div>
          <div className="text-xl font-mono font-black text-white">
            {formatDischargeCusecs(dam.telemetry.currentOutflowCusecs)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Active Gates: <strong className="text-amber-300">{dam.telemetry.gatesOpen} of {dam.telemetry.totalGates}</strong>
          </div>
        </div>
      </div>

      {/* Structural & Capacity Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Gross Capacity</div>
          <div className="font-mono font-bold text-white text-sm mt-0.5">
            {formatCapacityMCM(dam.telemetry.grossCapacityMCM)}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Live Storage</div>
          <div className="font-mono font-bold text-white text-sm mt-0.5">
            {formatCapacityMCM(dam.telemetry.liveCapacityMCM)}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Dam Health Score</div>
          <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            {dam.telemetry.damHealthScore}%
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Seismic Stability</div>
          <div className="font-mono font-bold text-cyan-400 text-sm mt-0.5 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" />
            {dam.telemetry.seismicStabilityScore}%
          </div>
        </div>
      </div>

      {/* Downstream Vulnerability Alert Notice */}
      <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/20 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-sky-300">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Downstream Districts In Undated Flood Impact Zone:</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          {dam.downstreamDistricts.join(', ')}
        </p>
        <div className="text-[11px] text-slate-400 italic pt-1">
          {dam.alertLevelDescription}
        </div>
      </div>
    </div>
  );
};
