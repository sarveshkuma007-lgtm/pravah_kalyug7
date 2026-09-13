import React from 'react';
import {
  Waves,
  ShieldAlert,
  AlertTriangle,
  Radio,
  ArrowRight,
  TrendingUp,
  Map,
  Compass,
  Activity,
  Droplets,
  Calendar,
} from 'lucide-react';
import { Dam, EmergencyAlert, Shelter } from '../types';
import { StatCard } from '../components/StatCard';
import { DamCard } from '../components/DamCard';
import { AlertCard } from '../components/AlertCard';
import { WeatherWidget } from '../components/WeatherWidget';
import { FloodRiskChart } from '../components/FloodRiskChart';
import { weatherService } from '../services/weatherService';
import { useLanguage } from '../hooks/useLanguage';
import { formatDischargeCusecs } from '../utils/formatters';

interface DashboardPageProps {
  dams: Dam[];
  alerts: EmergencyAlert[];
  shelters: Shelter[];
  selectedDam: Dam;
  onSelectDam: (dam: Dam) => void;
  onNavigateToPage: (page: any) => void;
  onOpenSOSModal: () => void;
  id?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  dams,
  alerts,
  shelters,
  selectedDam,
  onSelectDam,
  onNavigateToPage,
  onOpenSOSModal,
  id = 'dashboard-page',
}) => {
  const { t } = useLanguage();
  const weather = weatherService.getWeatherForDam(selectedDam.id);

  // Statistics
  const totalDams = dams.length;
  const criticalDams = dams.filter((d) => d.status === 'critical');
  const warningDams = dams.filter((d) => d.status === 'warning');
  const totalInflow = dams.reduce((acc, d) => acc + d.telemetry.currentInflowCusecs, 0);
  const activeAlerts = alerts.filter((a) => a.severity === 'critical' || a.severity === 'warning');

  return (
    <div id={id} className="space-y-6 pb-12">
      {/* Top Banner Alert if Critical dams exist */}
      {criticalDams.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/90 via-red-900/80 to-rose-950/80 border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-red-600 text-white shrink-0 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-red-200 bg-red-600/60 px-2 py-0.5 rounded">
                  RED ALERT ACTIVE
                </span>
                <span className="text-xs text-red-300 font-mono">
                  {criticalDams.length} Reservoirs Breaching Danger Limits
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Immediate Downstream Evacuation Warnings: {criticalDams.map((d) => d.name).join(', ')}
              </h3>
              <p className="text-xs text-red-200/90 mt-0.5">
                Spillway discharges exceed channel thresholds. NDRF battalions mobilized.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onNavigateToPage('live-map')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-red-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Map className="w-4 h-4" />
              <span>GIS Inundation Map</span>
            </button>
            <button
              type="button"
              onClick={onOpenSOSModal}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>SOS Helpline</span>
            </button>
          </div>
        </div>
      )}

      {/* 4 Primary Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-critical"
          title={t('dashboard.criticalDams', 'Critical High-Risk Dams')}
          value={criticalDams.length}
          subtitle="Reservoirs breaching danger elevation"
          icon={ShieldAlert}
          variant="red"
          trend="+1 Today"
          trendDirection="up"
          onClick={() => onNavigateToPage('alerts')}
        />

        <StatCard
          id="stat-warning"
          title="Warning Stage Reservoirs"
          value={warningDams.length}
          subtitle="Approaching full reservoir limit"
          icon={AlertTriangle}
          variant="amber"
          trend="Stable"
          trendDirection="neutral"
          onClick={() => onNavigateToPage('dam-monitoring')}
        />

        <StatCard
          id="stat-inflow"
          title={t('dashboard.inflowRate', 'Total National Basin Inflow')}
          value={formatDischargeCusecs(totalInflow)}
          subtitle="Sum of active catchment runoff"
          icon={Droplets}
          variant="cyan"
          trend="Monsoon Surge"
          trendDirection="up"
          onClick={() => onNavigateToPage('analytics')}
        />

        <StatCard
          id="stat-dams-active"
          title={t('dashboard.totalDams', 'Monitored Dams & Sluices')}
          value={totalDams}
          subtitle="100% telemetry online across India"
          icon={Activity}
          variant="emerald"
          onClick={() => onNavigateToPage('dam-monitoring')}
        />
      </div>

      {/* Quick Access Evacuation Router Callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0a1e38] via-[#0d274a] to-[#071930] border border-cyan-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              Disaster Risk Geolocation
            </span>
            <h3 className="text-lg font-bold text-white">
              Check Your Proximity to High-Danger Inundation Zones
            </h3>
            <p className="text-xs text-slate-300">
              PRAVAH continuously calculates shortest, non-flooded road corridors to verified relief shelters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => onNavigateToPage('safe-routes')}
            className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-sky-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <span>CALCULATE SAFE ROUTE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2-Column Section: Top Dams Grid vs Inflow Comparison Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High Risk Dams */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">
                National Reservoir Telemetry Feed
              </h3>
              <p className="text-xs text-slate-400">
                Active live telemetry from major river basins (Bhakra, Tehri, Sardar Sarovar, Idukki...)
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToPage('dam-monitoring')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All {totalDams} Dams</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dams.slice(0, 4).map((dam) => (
              <DamCard
                key={dam.id}
                dam={dam}
                isSelected={selectedDam.id === dam.id}
                onSelect={(d) => {
                  onSelectDam(d);
                  onNavigateToPage('dam-monitoring');
                }}
                onViewOnMap={() => {
                  onSelectDam(dam);
                  onNavigateToPage('live-map');
                }}
              />
            ))}
          </div>
        </div>

        {/* Right 1 Col: Weather & Discharge Comparison */}
        <div className="space-y-6">
          <WeatherWidget weather={weather} />
          <FloodRiskChart dams={dams} />
        </div>
      </div>

      {/* Recent Alerts Feed Preview */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-white tracking-tight">Active Emergency Bulletins</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-red-950 text-red-400 border border-red-500/40">
              {activeAlerts.length} Active
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToPage('alerts')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>All Alerts Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.slice(0, 2).map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onSelectDam={(id) => {
                const targetDam = dams.find((d) => d.id === id);
                if (targetDam) {
                  onSelectDam(targetDam);
                  onNavigateToPage('dam-monitoring');
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
