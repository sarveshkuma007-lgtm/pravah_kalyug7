import React from 'react';
import {
  Waves,
  Search,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import { Dam, DamRiskStatus } from '../types';
import { DamCard } from '../components/DamCard';
import { DamDetailsCard } from '../components/DamDetailsCard';
import { WaterLevelChart } from '../components/WaterLevelChart';
import { INDIAN_STATES, RIVER_BASINS } from '../utils/constants';

interface DamMonitoringPageProps {
  dams: Dam[];
  filteredDams: Dam[];
  selectedDam: Dam;
  onSelectDam: (dam: Dam) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedState: string;
  onStateChange: (s: string) => void;
  selectedBasin: string;
  onBasinChange: (b: string) => void;
  selectedRisk: DamRiskStatus | 'all';
  onRiskChange: (r: DamRiskStatus | 'all') => void;
  onRefreshTelemetry: () => void;
  onNavigateToMap: () => void;
  id?: string;
}

export const DamMonitoringPage: React.FC<DamMonitoringPageProps> = ({
  dams,
  filteredDams,
  selectedDam,
  onSelectDam,
  searchQuery,
  onSearchChange,
  selectedState,
  onStateChange,
  selectedBasin,
  onBasinChange,
  selectedRisk,
  onRiskChange,
  onRefreshTelemetry,
  onNavigateToMap,
  id = 'dam-monitoring-page',
}) => {
  return (
    <div id={id} className="space-y-6 pb-12">
      {/* Header & Filter Bar */}
      <div className="p-5 rounded-2xl bg-[#091527]/90 backdrop-blur-xl border border-sky-500/20 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              National Dam Safety & Sluice Gate Telemetry
            </h2>
            <p className="text-xs text-slate-400">
              Live automated sensors tracking water level elevation, freeboard margins, and radial gate discharges.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefreshTelemetry}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Poll Sensors</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToMap}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-sky-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* Filters Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search dam, river, state..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* State Dropdown */}
          <select
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state} className="bg-[#091527] text-white">
                {state}
              </option>
            ))}
          </select>

          {/* Basin Dropdown */}
          <select
            value={selectedBasin}
            onChange={(e) => onBasinChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {RIVER_BASINS.map((basin) => (
              <option key={basin} value={basin} className="bg-[#091527] text-white">
                {basin}
              </option>
            ))}
          </select>

          {/* Risk Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-700/80">
            {(['all', 'critical', 'warning', 'normal'] as const).map((risk) => (
              <button
                key={risk}
                type="button"
                onClick={() => onRiskChange(risk)}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  selectedRisk === risk
                    ? 'bg-cyan-500 text-sky-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Dam Detailed Telemetry & Trend Chart */}
      {selectedDam && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DamDetailsCard
              dam={selectedDam}
              onViewOnMap={onNavigateToMap}
            />
          </div>
          <div>
            <WaterLevelChart dam={selectedDam} />
          </div>
        </div>
      )}

      {/* Dam Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-white">{filteredDams.length}</strong> of {dams.length} dams
          </span>
          {selectedRisk !== 'all' && (
            <span className="capitalize font-mono text-cyan-400">Filtered: {selectedRisk} status</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDams.map((dam) => (
            <DamCard
              key={dam.id}
              dam={dam}
              isSelected={selectedDam?.id === dam.id}
              onSelect={onSelectDam}
              onViewOnMap={() => {
                onSelectDam(dam);
                onNavigateToMap();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
