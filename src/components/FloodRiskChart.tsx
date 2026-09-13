import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Dam } from '../types';
import { formatDischargeCusecs } from '../utils/formatters';

interface FloodRiskChartProps {
  dams: Dam[];
  id?: string;
}

export const FloodRiskChart: React.FC<FloodRiskChartProps> = ({ dams, id = 'flood-risk-chart' }) => {
  // Take top 5 dams by current inflow volume
  const sortedDams = [...dams]
    .sort((a, b) => b.telemetry.currentInflowCusecs - a.telemetry.currentInflowCusecs)
    .slice(0, 5);

  const maxDischarge = Math.max(
    ...sortedDams.map((d) => Math.max(d.telemetry.currentInflowCusecs, d.telemetry.currentOutflowCusecs)),
    100000
  );

  return (
    <div id={id} className="p-5 rounded-2xl bg-[#091527]/85 backdrop-blur-xl border border-sky-500/20 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white tracking-tight">
            High Inflow vs Outflow Discharge Comparison
          </h4>
          <span className="text-xs text-slate-400">
            Top 5 Hydrological Basins under Active Surge (Cusecs)
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-cyan-400 font-medium">
            <span className="w-2.5 h-2.5 rounded bg-cyan-400" /> Inflow
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-medium">
            <span className="w-2.5 h-2.5 rounded bg-amber-400" /> Spillway Outflow
          </span>
        </div>
      </div>

      <div className="space-y-3.5 pt-1">
        {sortedDams.map((dam) => {
          const inflowPct = (dam.telemetry.currentInflowCusecs / maxDischarge) * 100;
          const outflowPct = (dam.telemetry.currentOutflowCusecs / maxDischarge) * 100;

          return (
            <div key={dam.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">
                  {dam.name} <span className="text-slate-400 text-[10px]">({dam.river})</span>
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  In: <strong className="text-cyan-300">{formatDischargeCusecs(dam.telemetry.currentInflowCusecs)}</strong> | Out:{' '}
                  <strong className="text-amber-300">{formatDischargeCusecs(dam.telemetry.currentOutflowCusecs)}</strong>
                </span>
              </div>

              {/* Dual bar */}
              <div className="space-y-1">
                {/* Inflow bar */}
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-600 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(4, inflowPct))}%` }}
                  />
                </div>
                {/* Outflow bar */}
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(4, outflowPct))}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
