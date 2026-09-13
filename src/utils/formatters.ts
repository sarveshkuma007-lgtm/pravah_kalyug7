import { DamRiskStatus, AlertSeverity, FloodDangerLevel } from '../types';

/**
 * Format numbers into Indian numbering system (e.g., Lakhs, Crores)
 */
export function formatIndianNumber(num: number): string {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `${(num / 100000).toFixed(2)} Lakh`;
  }
  return num.toLocaleString('en-IN');
}

export function formatWaterLevel(meters: number): string {
  return `${meters.toFixed(2)} m`;
}

export function formatCapacityMCM(mcm: number): string {
  return `${mcm.toLocaleString('en-IN')} MCM`;
}

export function formatDischargeCusecs(cusecs: number): string {
  return `${cusecs.toLocaleString('en-IN')} cusec`;
}

export function formatRainfall(mm: number): string {
  return `${mm.toFixed(1)} mm`;
}

export function formatDistanceKm(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function formatDurationMinutes(mins: number): string {
  if (mins < 60) {
    return `${Math.round(mins)} mins`;
  }
  const hours = Math.floor(mins / 60);
  const remaining = Math.round(mins % 60);
  return `${hours}h ${remaining}m`;
}

export function getRiskBadgeClasses(status: DamRiskStatus): {
  bg: string;
  text: string;
  border: string;
  dot: string;
  label: string;
} {
  switch (status) {
    case 'critical':
      return {
        bg: 'bg-red-950/70',
        text: 'text-red-400',
        border: 'border-red-500/50',
        dot: 'bg-red-500 shadow-[0_0_8px_#ef4444]',
        label: 'CRITICAL DANGER',
      };
    case 'warning':
      return {
        bg: 'bg-amber-950/70',
        text: 'text-amber-400',
        border: 'border-amber-500/50',
        dot: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
        label: 'WARNING LEVEL',
      };
    case 'normal':
    default:
      return {
        bg: 'bg-emerald-950/70',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        dot: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
        label: 'NORMAL / SAFE',
      };
  }
}

export function getAlertSeverityClasses(severity: AlertSeverity): {
  bg: string;
  text: string;
  border: string;
} {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-red-950/60',
        text: 'text-red-300',
        border: 'border-red-600/50',
      };
    case 'warning':
      return {
        bg: 'bg-amber-950/60',
        text: 'text-amber-300',
        border: 'border-amber-600/50',
      };
    case 'advisory':
      return {
        bg: 'bg-sky-950/60',
        text: 'text-sky-300',
        border: 'border-sky-600/50',
      };
    case 'resolved':
      return {
        bg: 'bg-emerald-950/60',
        text: 'text-emerald-300',
        border: 'border-emerald-600/50',
      };
  }
}

export function getDangerLevelColor(level: FloodDangerLevel): string {
  switch (level) {
    case 'high':
      return '#ef4444'; // Red
    case 'moderate':
      return '#eab308'; // Yellow
    case 'safe':
      return '#22c55e'; // Green
  }
}
