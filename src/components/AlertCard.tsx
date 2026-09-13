import React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle, Clock, Users, MapPin, ArrowRight } from 'lucide-react';
import { EmergencyAlert } from '../types';
import { getAlertSeverityClasses, formatIndianNumber } from '../utils/formatters';

interface AlertCardProps {
  alert: EmergencyAlert;
  onSelectDam?: (damId: string) => void;
  id?: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onSelectDam, id }) => {
  const styling = getAlertSeverityClasses(alert.severity);

  const SeverityIcon = {
    critical: ShieldAlert,
    warning: AlertTriangle,
    advisory: Info,
    resolved: CheckCircle,
  }[alert.severity];

  const formattedTime = new Date(alert.issuedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      id={id || `alert-card-${alert.id}`}
      className={`p-5 rounded-2xl bg-[#0a1728]/90 backdrop-blur-xl border transition-all duration-200 ${styling.border} hover:bg-[#0d1d33]`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${styling.bg} ${styling.text} ${styling.border}`}
          >
            <SeverityIcon className="w-3.5 h-3.5" />
            <span>{alert.severity}</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formattedTime}
          </span>
        </div>

        <span className="text-[11px] font-semibold text-cyan-400/90 tracking-wide bg-cyan-950/40 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
          {alert.source}
        </span>
      </div>

      <h4 className="text-base font-bold text-white tracking-tight mb-2">{alert.title}</h4>
      <p className="text-xs text-slate-300 leading-relaxed mb-3.5">{alert.description}</p>

      {/* Action Required Box */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs mb-3.5">
        <strong className="text-cyan-300 block mb-0.5 font-semibold">Recommended Evacuation Protocol:</strong>
        <span className="text-slate-300">{alert.actionRequired}</span>
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="line-clamp-1">
            Impact: <strong className="text-slate-200">{alert.affectedDistricts.join(', ')}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {alert.estimatedAffectedPopulation > 0 && (
            <div className="flex items-center gap-1 text-slate-300">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>~{formatIndianNumber(alert.estimatedAffectedPopulation)} at risk</span>
            </div>
          )}

          {onSelectDam && (
            <button
              type="button"
              onClick={() => onSelectDam(alert.damId)}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
            >
              <span>Inspect Dam</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
