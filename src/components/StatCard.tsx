import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  variant?: 'cyan' | 'red' | 'amber' | 'emerald' | 'slate';
  id?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendDirection = 'neutral',
  variant = 'cyan',
  id,
  onClick,
}) => {
  const variantStyles = {
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-400/40',
      glow: 'shadow-[0_4px_20px_rgba(6,182,212,0.08)]',
      iconBg: 'bg-cyan-500/10 text-cyan-400',
      valueColor: 'text-white',
    },
    red: {
      border: 'border-red-500/30 hover:border-red-400/60',
      glow: 'shadow-[0_4px_20px_rgba(239,68,68,0.12)]',
      iconBg: 'bg-red-500/15 text-red-400',
      valueColor: 'text-red-300',
    },
    amber: {
      border: 'border-amber-500/30 hover:border-amber-400/50',
      glow: 'shadow-[0_4px_20px_rgba(245,158,11,0.1)]',
      iconBg: 'bg-amber-500/15 text-amber-400',
      valueColor: 'text-amber-300',
    },
    emerald: {
      border: 'border-emerald-500/25 hover:border-emerald-400/50',
      glow: 'shadow-[0_4px_20px_rgba(16,185,129,0.08)]',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      valueColor: 'text-emerald-300',
    },
    slate: {
      border: 'border-slate-800 hover:border-slate-700',
      glow: '',
      iconBg: 'bg-slate-800 text-slate-300',
      valueColor: 'text-slate-100',
    },
  }[variant];

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative p-5 rounded-2xl bg-[#091527]/80 backdrop-blur-xl border transition-all duration-200 ${variantStyles.border} ${variantStyles.glow} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 block mb-1">
            {title}
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${variantStyles.valueColor}`}>
              {value}
            </span>
            {trend && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  trendDirection === 'up'
                    ? 'bg-red-950/60 text-red-400'
                    : trendDirection === 'down'
                    ? 'bg-emerald-950/60 text-emerald-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-xl ${variantStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {subtitle && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="line-clamp-1">{subtitle}</span>
        </div>
      )}
    </div>
  );
};
