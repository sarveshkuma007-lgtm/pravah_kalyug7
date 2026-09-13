import React from 'react';
import { Waves, Radio } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  id?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Synchronizing National Hydrological Radar & Dam Telemetry...',
  id = 'loading-screen',
}) => {
  return (
    <div
      id={id}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050b14] text-white p-6"
    >
      <div className="relative flex items-center justify-center mb-8">
        {/* Pulsing rings */}
        <div className="absolute w-36 h-36 rounded-full border border-cyan-500/20 animate-ping opacity-25" />
        <div className="absolute w-28 h-28 rounded-full border border-sky-400/40 animate-pulse" />
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-600/30 to-cyan-500/30 border border-cyan-400/40 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(56,189,248,0.25)]">
          <Waves className="w-10 h-10 text-cyan-400 animate-pulse" />
        </div>
      </div>

      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
            CWC • NDMA • DISASTER GRID
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
          PRAVAH <span className="text-cyan-400">INTELLIGENCE</span>
        </h2>
        <p className="text-sm text-slate-400 font-medium leading-relaxed">{message}</p>
      </div>

      <div className="mt-8 w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-400 animate-pulse" />
      </div>
    </div>
  );
};
