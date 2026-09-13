import React from 'react';
import {
  Waves,
  ShieldAlert,
  Search,
  Menu,
  X,
  Radio,
  User,
  LogOut,
  Bell,
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../hooks/useLanguage';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onOpenEmergencySOS: () => void;
  onSearchChange?: (term: string) => void;
  activeSearchTerm?: string;
  user?: { name: string; role: string } | null;
  onLogout?: () => void;
  unreadAlertCount?: number;
  id?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  onOpenEmergencySOS,
  onSearchChange,
  activeSearchTerm = '',
  user,
  onLogout,
  unreadAlertCount = 2,
  id = 'top-navbar',
}) => {
  const { t } = useLanguage();

  return (
    <header
      id={id}
      className="sticky top-0 z-30 w-full h-16 bg-[#060e1a]/90 backdrop-blur-xl border-b border-sky-500/20 px-4 sm:px-6 flex items-center justify-between"
    >
      {/* Left: Mobile Toggle & Brand Logo */}
      <div className="flex items-center gap-3">
        <button
          id={`${id}-sidebar-toggle`}
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Waves className="w-5 h-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#060e1a] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white">
                PRAVAH <span className="text-cyan-400 font-extrabold text-sm sm:text-base">प्रवाह</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
                <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                CWC RADAR ONLINE
              </span>
            </div>
            <p className="hidden md:block text-[10px] text-slate-400 font-medium">
              National Dam Safety & Real-Time Flood Intelligence System
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Global Search Bar */}
      {onSearchChange && (
        <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id={`${id}-search-input`}
              type="text"
              value={activeSearchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search dams, rivers, districts, basins..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/70 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
      )}

      {/* Right Controls: SOS, Language, Alerts, User Profile */}
      <div className="flex items-center gap-2.5">
        {/* Emergency SOS Button */}
        <button
          id={`${id}-sos-btn`}
          type="button"
          onClick={onOpenEmergencySOS}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs tracking-wide shadow-md shadow-red-600/30 animate-pulse transition-all cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>SOS</span>
        </button>

        {/* Language Selector */}
        <LanguageSelector id={`${id}-lang-selector`} />

        {/* User profile / Logout */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-200 line-clamp-1">{user.name}</span>
              <span className="text-[10px] text-cyan-400 capitalize">{user.role}</span>
            </div>
            {onLogout && (
              <button
                id={`${id}-logout-btn`}
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
            <User className="w-4 h-4" />
          </div>
        )}
      </div>
    </header>
  );
};
