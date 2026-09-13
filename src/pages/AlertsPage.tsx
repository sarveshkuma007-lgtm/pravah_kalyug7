import React, { useState } from 'react';
import {
  BellRing,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle,
  Filter,
  PhoneCall,
  Search,
} from 'lucide-react';
import { EmergencyAlert, AlertSeverity } from '../types';
import { AlertCard } from '../components/AlertCard';

interface AlertsPageProps {
  alerts: EmergencyAlert[];
  onSelectDam?: (damId: string) => void;
  onOpenSOSModal: () => void;
  id?: string;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  onSelectDam,
  onOpenSOSModal,
  id = 'alerts-page',
}) => {
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredAlerts = alerts.filter((alert) => {
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const matches =
        alert.title.toLowerCase().includes(q) ||
        alert.damName.toLowerCase().includes(q) ||
        alert.description.toLowerCase().includes(q) ||
        alert.affectedDistricts.some((d) => d.toLowerCase().includes(q));
      if (!matches) return false;
    }
    return true;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;

  return (
    <div id={id} className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#091527]/90 backdrop-blur-xl border border-sky-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950/80 text-red-300 border border-red-500/40">
              {criticalCount} CRITICAL RED ALERTS ACTIVE
            </span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Emergency Evacuation & Spillway Bulletins
          </h2>
          <p className="text-xs text-slate-400">
            Official disaster warnings issued by Central Water Commission and State Disaster Authorities.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenSOSModal}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
        >
          <PhoneCall className="w-4 h-4" />
          <span>NATIONAL SOS DIRECTORY</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#091527]/80 border border-slate-800">
        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['all', 'critical', 'warning', 'advisory', 'resolved'] as const).map((sev) => {
            const isSelected = severityFilter === sev;
            return (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                  isSelected
                    ? sev === 'critical'
                      ? 'bg-red-600 text-white shadow-md'
                      : sev === 'warning'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-cyan-500 text-sky-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search district, dam..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-[#091527]/50 rounded-2xl border border-slate-800">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No alerts found matching filter criteria</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onSelectDam={onSelectDam}
            />
          ))
        )}
      </div>
    </div>
  );
};
