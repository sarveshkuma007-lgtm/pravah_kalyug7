import React from 'react';
import {
  LayoutDashboard,
  Waves,
  Map,
  TrendingUp,
  BellRing,
  Navigation,
  Home,
  BarChart3,
  Shield,
  Radio,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export type NavigationPage =
  | 'dashboard'
  | 'dam-monitoring'
  | 'live-map'
  | 'flood-prediction'
  | 'alerts'
  | 'safe-routes'
  | 'shelters'
  | 'analytics';

interface SidebarProps {
  activePage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  criticalCount?: number;
  id?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  isOpen,
  onCloseMobile,
  criticalCount = 2,
  id = 'left-sidebar',
}) => {
  const { t } = useLanguage();

  const navItems = [
    {
      id: 'dashboard',
      label: t('nav.dashboard', 'National Dashboard'),
      icon: LayoutDashboard,
    },
    {
      id: 'live-map',
      label: t('nav.map', 'Live GIS Map & Inundation'),
      icon: Map,
      badge: 'Interactive',
    },
    {
      id: 'dam-monitoring',
      label: t('nav.damMonitoring', 'Dam Telemetry & Sluices'),
      icon: Waves,
    },
    {
      id: 'flood-prediction',
      label: t('nav.floodPrediction', 'AI Flood Crest Prediction'),
      icon: TrendingUp,
      badge: '94% Acc',
    },
    {
      id: 'alerts',
      label: t('nav.alerts', 'Emergency Red Alerts'),
      icon: BellRing,
      count: criticalCount,
    },
    {
      id: 'safe-routes',
      label: t('nav.safeRoutes', 'Safe Evacuation Routes'),
      icon: Navigation,
    },
    {
      id: 'shelters',
      label: t('nav.shelters', 'Relief Shelters & Camps'),
      icon: Home,
    },
    {
      id: 'analytics',
      label: t('nav.analytics', 'Hydrological Analytics'),
      icon: BarChart3,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        id={id}
        className={`fixed top-16 bottom-0 left-0 z-30 w-64 bg-[#07111f] border-r border-sky-500/20 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-cyan-400/80">
            Operations & Early Warning
          </div>

          {navItems.map((item) => {
            const isActive = activePage === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                id={`${id}-nav-${item.id}`}
                type="button"
                onClick={() => {
                  onNavigate(item.id as NavigationPage);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-600/30 text-red-400 border border-red-500/40 animate-pulse">
                    {item.count}
                  </span>
                )}

                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info box */}
        <div className="p-4 border-t border-slate-800/80 bg-[#050b14]/60">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                SIH • PRAVAH GRID
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Central Water Commission & State Disaster Management telemetry active across 10 major Indian river basins.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
