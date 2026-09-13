import React from 'react';
import { Waves, Radio, ShieldCheck, ArrowRight, Activity, Map, BellRing } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

interface SplashScreenProps {
  onEnter: () => void;
  id?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter, id = 'splash-screen' }) => {
  return (
    <div
      id={id}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#040913] text-white p-6 sm:p-10 overflow-y-auto"
    >
      {/* Top bar with accreditation & language */}
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-cyan-400">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>GOVERNMENT OF INDIA • CWC • NDMA EARLY WARNING</span>
        </div>
        <LanguageSelector id={`${id}-lang`} />
      </div>

      {/* Main hero card */}
      <div className="w-full max-w-3xl mx-auto my-auto py-10 flex flex-col items-center text-center space-y-6">
        {/* Animated Radar Icon */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-44 h-44 rounded-full border border-cyan-500/20 animate-ping opacity-30" />
          <div className="absolute w-32 h-32 rounded-full border border-sky-400/40 animate-pulse" />
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center border-2 border-cyan-200/50 shadow-[0_0_50px_rgba(6,182,212,0.4)]">
            <Waves className="w-12 h-12 text-white" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SMART INDIA HACKATHON • NATIONAL HYDROLOGICAL PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            PRAVAH <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300">प्रवाह</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
            Real-time Dam Safety Monitoring, Inundation GIS Mapping, and AI Evacuation Intelligence for saving lives across vulnerable Indian river basins.
          </p>
        </div>

        {/* 3 Core Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl pt-2 text-left">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="p-2 w-fit rounded-lg bg-cyan-500/10 text-cyan-400 mb-2">
              <Activity className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Live Reservoir Sensors</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Automated water level, inflow/outflow, and radial sluice gate tracking.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-400 mb-2">
              <Map className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Interactive GIS Risk Map</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Red high-danger inundation zones, yellow warning buffers, and green safe areas.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Evacuation Router</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Turn-by-turn routes to safe relief shelters avoiding submerged roads.
            </p>
          </div>
        </div>

        {/* Enter Button */}
        <div className="pt-4 w-full max-w-xs">
          <button
            id={`${id}-enter-btn`}
            type="button"
            onClick={onEnter}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-[#061220] font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <span>LAUNCH DASHBOARD</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 border-t border-slate-800/60 pt-4">
        <span>© 2026 PRAVAH Disaster Intelligence System • SIH Edition</span>
        <span>Central Water Commission (CWC) • National Disaster Management Authority (NDMA)</span>
      </div>
    </div>
  );
};
