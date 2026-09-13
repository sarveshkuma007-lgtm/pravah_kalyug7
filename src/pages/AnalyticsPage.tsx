import React from 'react';
import {
  BarChart3,
  Activity,
  Droplets,
  Shield,
  Waves,
  ArrowDownRight,
  ArrowUpRight,
  CloudRain,
} from 'lucide-react';
import { Dam } from '../types';
import { WaterLevelChart } from '../components/WaterLevelChart';
import { FloodRiskChart } from '../components/FloodRiskChart';
import { WeatherWidget } from '../components/WeatherWidget';
import { weatherService } from '../services/weatherService';
import { formatDischargeCusecs } from '../utils/formatters';

interface AnalyticsPageProps {
  dams: Dam[];
  selectedDam: Dam;
  onSelectDam: (dam: Dam) => void;
  id?: string;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  dams,
  selectedDam,
  onSelectDam,
  id = 'analytics-page',
}) => {
  const compositeWeather = weatherService.getCompositeWeather();

  const totalInflow = dams.reduce((acc, d) => acc + d.telemetry.currentInflowCusecs, 0);
  const totalOutflow = dams.reduce((acc, d) => acc + d.telemetry.currentOutflowCusecs, 0);
  const avgHealth = Math.round(
    dams.reduce((acc, d) => acc + d.telemetry.damHealthScore, 0) / dams.length
  );
  const avgSeismic = Math.round(
    dams.reduce((acc, d) => acc + d.telemetry.seismicStabilityScore, 0) / dams.length
  );

  return (
    <div id={id} className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#091527]/90 backdrop-blur-xl border border-sky-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            National Hydrological & Reservoir Telemetry Analytics
          </h2>
          <p className="text-xs text-slate-400">
            Real-time composite telemetry aggregated across 10 major Indian river basins and Central Water Commission river gauges.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Average Dam Health</span>
            <span className="text-base font-mono font-bold text-emerald-400">{avgHealth}%</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Seismic Stability</span>
            <span className="text-base font-mono font-bold text-cyan-400">{avgSeismic}%</span>
          </div>
        </div>
      </div>

      {/* Top Hydrological Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#091527]/85 border border-sky-500/20">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total National Inflow</span>
          <div className="text-2xl font-mono font-black text-cyan-300 mt-1 flex items-center gap-1.5">
            <ArrowDownRight className="w-5 h-5 text-cyan-400" />
            <span>{formatDischargeCusecs(totalInflow)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Aggregated surface runoff from active monsoon depressions
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#091527]/85 border border-sky-500/20">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Controlled Spillway Outflow</span>
          <div className="text-2xl font-mono font-black text-amber-300 mt-1 flex items-center gap-1.5">
            <ArrowUpRight className="w-5 h-5 text-amber-400" />
            <span>{formatDischargeCusecs(totalOutflow)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Regulated flood routing across 187 active sluice gates
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#091527]/85 border border-sky-500/20">
          <span className="text-xs text-slate-400 uppercase font-semibold">Catchment Rainfall Intensity</span>
          <div className="text-2xl font-mono font-black text-sky-300 mt-1 flex items-center gap-1.5">
            <CloudRain className="w-5 h-5 text-sky-400" />
            <span>{compositeWeather.rainfallRateMmH} mm/h</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            24h Total Accumulated: {compositeWeather.accumulatedRainfall24hMm} mm
          </p>
        </div>
      </div>

      {/* Charts Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FloodRiskChart dams={dams} />
        <WaterLevelChart dam={selectedDam} />
      </div>

      {/* Reservoir Storage Capacities Matrix */}
      <div className="p-6 rounded-2xl bg-[#091527]/90 border border-sky-500/20 space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight">
          Reservoir Live Storage Matrix (Current Level vs Full Reservoir Level)
        </h3>

        <div className="space-y-3">
          {dams.map((dam) => {
            const pct = Math.round(
              (dam.telemetry.waterLevelMeters / dam.telemetry.fullReservoirLevelMeters) * 100
            );

            return (
              <div
                key={dam.id}
                onClick={() => onSelectDam(dam)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedDam.id === dam.id
                    ? 'bg-slate-900 border-cyan-400'
                    : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{dam.name}</span>
                    <span className="text-slate-400 text-[11px]">({dam.river}, {dam.state})</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-cyan-300">
                    {dam.telemetry.waterLevelMeters}m / {dam.telemetry.fullReservoirLevelMeters}m ({pct}%)
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      pct > 96
                        ? 'bg-red-500'
                        : pct > 85
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-sky-500 to-cyan-400'
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
