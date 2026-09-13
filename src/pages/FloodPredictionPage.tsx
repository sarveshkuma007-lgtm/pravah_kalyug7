import React, { useState } from 'react';
import {
  TrendingUp,
  BrainCircuit,
  Clock,
  Users,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Droplets,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Dam, FloodPredictionModel } from '../types';
import { floodPredictionService } from '../services/floodPredictionService';
import { formatDischargeCusecs, formatIndianNumber } from '../utils/formatters';

interface FloodPredictionPageProps {
  dams: Dam[];
  selectedDam: Dam;
  onSelectDam: (dam: Dam) => void;
  id?: string;
}

export const FloodPredictionPage: React.FC<FloodPredictionPageProps> = ({
  dams,
  selectedDam,
  onSelectDam,
  id = 'flood-prediction-page',
}) => {
  const [activeHorizon, setActiveHorizon] = useState<6 | 12 | 24 | 48>(24);

  // Generate real-time prediction model for selected dam
  const prediction = floodPredictionService.generatePredictionForDam(selectedDam);

  const trendBadge = {
    rapid_rise: { text: 'Rapid Torrential Rise', bg: 'bg-red-950/80 text-red-300 border-red-500/50' },
    steady_rise: { text: 'Steady Monsoon Inflow', bg: 'bg-amber-950/80 text-amber-300 border-amber-500/50' },
    plateau: { text: 'Inflow Peak Plateau', bg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50' },
    falling: { text: 'Receding Flood Inflow', bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' },
  }[prediction.inflowTrend];

  return (
    <div id={id} className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#091527]/90 backdrop-blur-xl border border-sky-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              AI HYDROLOGICAL INFERENCE ENGINE (CONFIDENCE: {prediction.aiConfidenceScore}%)
            </span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Predictive Flood Crest & Inundation Modeler
          </h2>
          <p className="text-xs text-slate-400">
            Machine learning runoff simulation trained on 40 years of CWC gauge telemetry and satellite precipitation.
          </p>
        </div>

        {/* Forecast Horizon Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-700">
          {([6, 12, 24, 48] as const).map((hours) => (
            <button
              key={hours}
              type="button"
              onClick={() => setActiveHorizon(hours)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeHorizon === hours
                  ? 'bg-cyan-500 text-sky-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {hours}h Horizon
            </button>
          ))}
        </div>
      </div>

      {/* Dam Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {dams.map((dam) => {
          const isSelected = dam.id === selectedDam.id;
          return (
            <button
              key={dam.id}
              type="button"
              onClick={() => onSelectDam(dam)}
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500 text-sky-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-[#091527] text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {dam.name}
            </button>
          );
        })}
      </div>

      {/* Primary Forecast Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Inflow Trend Card */}
        <div className="p-5 rounded-2xl bg-[#091527]/85 backdrop-blur-xl border border-sky-500/20">
          <span className="text-xs font-semibold text-slate-400 uppercase">Inflow Curve Trend</span>
          <div className="mt-2">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${trendBadge.bg}`}
            >
              {trendBadge.text}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2.5">
            Current: {formatDischargeCusecs(selectedDam.telemetry.currentInflowCusecs)}
          </p>
        </div>

        {/* Projected Peak Inflow */}
        <div className="p-5 rounded-2xl bg-[#091527]/85 backdrop-blur-xl border border-sky-500/20">
          <span className="text-xs font-semibold text-slate-400 uppercase">Projected Peak Inflow</span>
          <div className="text-2xl font-mono font-black text-white mt-1">
            {formatDischargeCusecs(prediction.projectedPeakInflowCusecs)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Expected crest within next {activeHorizon} hours
          </p>
        </div>

        {/* Estimated Time to Overflow / Spill */}
        <div className="p-5 rounded-2xl bg-[#091527]/85 backdrop-blur-xl border border-sky-500/20">
          <span className="text-xs font-semibold text-slate-400 uppercase">Time to Spill Margin</span>
          <div className="text-2xl font-mono font-black text-amber-400 mt-1 flex items-center gap-1.5">
            <Clock className="w-5 h-5" />
            <span>
              {prediction.estimatedTimeToSpillHours ? `${prediction.estimatedTimeToSpillHours} Hours` : 'Controlled'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Until reservoir touches critical 100% capacity
          </p>
        </div>

        {/* Downstream Population at Risk */}
        <div className="p-5 rounded-2xl bg-[#091527]/85 backdrop-blur-xl border border-sky-500/20">
          <span className="text-xs font-semibold text-slate-400 uppercase">Downstream At-Risk Population</span>
          <div className="text-2xl font-mono font-black text-rose-300 mt-1 flex items-center gap-1.5">
            <Users className="w-5 h-5 text-rose-400" />
            <span>~{formatIndianNumber(prediction.affectedPopulationEstimate)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Across {selectedDam.downstreamDistricts.length} vulnerable administrative districts
          </p>
        </div>
      </div>

      {/* AI Prescriptive Action Directive */}
      <div className="p-6 rounded-2xl bg-[#0a1b33]/90 backdrop-blur-xl border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-400">
          <BrainCircuit className="w-5 h-5" />
          <h3 className="text-base font-bold text-white tracking-tight">
            AI Automated Reservoir Dispatch Recommendations ({selectedDam.name})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 uppercase font-semibold">Recommended Outflow Sluice Release</span>
            <div className="text-2xl font-mono font-black text-cyan-300">
              {formatDischargeCusecs(prediction.recommendedReleaseRateCusecs)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Maintains reservoir freeboard safety while staggering flood peaks downstream to avoid simultaneous tributary confluence surges.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 uppercase font-semibold">Wave Arrival Time Window</span>
            <div className="text-lg font-bold text-amber-300">
              {prediction.floodArrivalEta}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Calculated based on hydraulic Manning equation across the downstream river cross-sections and riverbed roughness index.
            </p>
          </div>
        </div>

        {/* Action Protocol Checklist */}
        <div className="pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
            Disaster Authority Action Checklist
          </h4>
          <div className="space-y-2">
            {prediction.aiRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
