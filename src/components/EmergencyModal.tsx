import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, X, Radio, BellRing, Navigation } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../utils/constants';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSafeRoute?: () => void;
  id?: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onNavigateSafeRoute,
  id = 'emergency-sos-modal',
}) => {
  if (!isOpen) return null;

  return (
    <div
      id={id}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id={`${id}-container`}
        className="relative w-full max-w-xl rounded-2xl bg-[#0d1829] border border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.3)] overflow-hidden"
      >
        {/* Urgent header bar */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 animate-pulse">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold tracking-wide">NATIONAL DISASTER SOS PORTAL</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-red-700 uppercase animate-pulse">
                  PRIORITY 1
                </span>
              </div>
              <p className="text-xs text-red-100">Direct link to Central Water Commission & NDRF Command</p>
            </div>
          </div>
          <button
            id={`${id}-close-btn`}
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Quick Action Alert */}
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs text-red-200 leading-relaxed">
              <strong className="font-semibold text-red-100 block mb-1">
                FLASH FLOOD & SPILLWAY EVACUATION DIRECTIVE:
              </strong>
              If you are in a downstream riverbed or low-lying ghat area, move immediately towards designated high-elevation shelters. Do not drive through flooded causeways.
            </div>
          </div>

          {/* Direct Evacuation Route Button */}
          {onNavigateSafeRoute && (
            <button
              id={`${id}-route-btn`}
              type="button"
              onClick={() => {
                onClose();
                onNavigateSafeRoute();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>MAP SAFEST EVACUATION ROUTE NOW</span>
            </button>
          )}

          {/* Emergency Helplines Grid */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>Official Emergency Helplines (Toll-Free & 24x7 Control Rooms)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EMERGENCY_CONTACTS.map((contact) => (
                <a
                  key={contact.name}
                  id={`${id}-call-${contact.number}`}
                  href={`tel:${contact.number.replace(/[^0-9]/g, '')}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-700/60 transition-all group cursor-pointer"
                >
                  <div className="flex flex-col pr-2">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white line-clamp-1">
                      {contact.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{contact.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-600/20 text-red-400 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono font-bold">{contact.number}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Automated Broadcast Notice */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <BellRing className="w-3.5 h-3.5" />
              <span>Broadcast Network Active</span>
            </div>
            <p>
              District Disaster Management Authorities (DDMA) have triggered cell-broadcast siren bursts to mobile towers in vulnerable floodplains. Keep mobile phones charged.
            </p>
          </div>
        </div>

        <div className="px-6 py-3 bg-[#08101d] border-t border-slate-800 flex justify-end">
          <button
            id={`${id}-dismiss-btn`}
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
          >
            Dismiss SOS Window
          </button>
        </div>
      </div>
    </div>
  );
};
