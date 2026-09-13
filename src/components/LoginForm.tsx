import React, { useState } from 'react';
import { Shield, User, Lock, ArrowRight, CheckCircle2, Waves, Building2 } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginFormProps {
  onLoginSuccess: (user: UserProfile) => void;
  id?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, id = 'login-form' }) => {
  const [email, setEmail] = useState('officer.tehri@cwc.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<'dam_engineer' | 'disaster_official' | 'citizen'>('dam_engineer');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: UserProfile = {
      id: 'usr-001',
      name: role === 'dam_engineer' ? 'Er. Rajesh Varma' : role === 'disaster_official' ? 'Commandant Vikram Negi' : 'Aarav Sharma',
      email: email,
      role: role === 'dam_engineer' ? 'officer' : role === 'disaster_official' ? 'admin' : 'citizen',
      assignedDamId: role === 'dam_engineer' ? 'dam-002' : undefined,
    };
    onLoginSuccess(mockUser);
  };

  const handleQuickDemo = (demoRole: 'dam_engineer' | 'disaster_official' | 'citizen') => {
    const roleMap = {
      dam_engineer: {
        id: 'usr-eng-1',
        name: 'Er. Rajesh Varma (Chief Dam Engineer)',
        email: 'rajesh.varma@cwc.gov.in',
        role: 'officer' as const,
        assignedDamId: 'dam-002',
      },
      disaster_official: {
        id: 'usr-ndrf-1',
        name: 'Commandant Vikram Negi (NDRF 8th Battalion)',
        email: 'vikram.negi@ndrf.gov.in',
        role: 'admin' as const,
      },
      citizen: {
        id: 'usr-cit-1',
        name: 'Aarav Sharma (Resident, Haridwar District)',
        email: 'aarav.sharma@gmail.com',
        role: 'citizen' as const,
      },
    }[demoRole];

    onLoginSuccess(roleMap);
  };

  return (
    <div
      id={id}
      className="w-full max-w-md p-8 rounded-3xl bg-[#081527]/90 backdrop-blur-2xl border border-sky-500/30 shadow-[0_15px_50px_rgba(0,0,0,0.6)] space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 border border-cyan-400/40 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.3)]">
          <Waves className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight">Portal Authentication</h3>
        <p className="text-xs text-slate-400">
          Sign in to PRAVAH Command, Sluice Control, & Disaster Evacuation Grid
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
        <button
          type="button"
          onClick={() => setRole('dam_engineer')}
          className={`py-2 px-1 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer ${
            role === 'dam_engineer'
              ? 'bg-cyan-500 text-sky-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Dam Engineer
        </button>
        <button
          type="button"
          onClick={() => setRole('disaster_official')}
          className={`py-2 px-1 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer ${
            role === 'disaster_official'
              ? 'bg-cyan-500 text-sky-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          NDRF Official
        </button>
        <button
          type="button"
          onClick={() => setRole('citizen')}
          className={`py-2 px-1 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer ${
            role === 'citizen'
              ? 'bg-cyan-500 text-sky-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Citizen
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleCustomLogin} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">Official Email ID</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">Access Credential</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
        >
          <span>AUTHENTICATE & ENTER</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* 1-Click Fast Persona Switcher */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
          ⚡ 1-Click Demo Personas
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('dam_engineer')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-medium text-cyan-300 text-center transition-colors cursor-pointer"
          >
            Dam Engineer
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('disaster_official')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-medium text-amber-300 text-center transition-colors cursor-pointer"
          >
            NDRF Head
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('citizen')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-medium text-emerald-300 text-center transition-colors cursor-pointer"
          >
            Resident
          </button>
        </div>
      </div>
    </div>
  );
};
