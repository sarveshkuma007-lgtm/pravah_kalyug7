import React from 'react';
import { Dam } from '../types';

interface DamMarkerProps {
  dam: Dam;
  x: number;
  y: number;
  isSelected?: boolean;
  onClick?: (dam: Dam) => void;
  id?: string;
}

export const DamMarker: React.FC<DamMarkerProps> = ({
  dam,
  x,
  y,
  isSelected = false,
  onClick,
  id,
}) => {
  const riskColor = {
    critical: '#ef4444',
    warning: '#f59e0b',
    normal: '#06b6d4',
  }[dam.status];

  return (
    <g
      id={id || `marker-${dam.id}`}
      transform={`translate(${x}, ${y})`}
      className="cursor-pointer group select-none"
      onClick={() => onClick && onClick(dam)}
    >
      {/* Animated Ping Ring for Critical/Warning */}
      {dam.status === 'critical' && (
        <circle r="18" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping opacity-60" />
      )}
      {dam.status === 'warning' && (
        <circle r="14" fill="none" stroke="#f59e0b" strokeWidth="1" className="animate-ping opacity-40" />
      )}

      {/* Selected Halo */}
      {isSelected && (
        <circle r="16" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3 3" />
      )}

      {/* Main pin body */}
      <circle r="10" fill="#0b1a2e" stroke={riskColor} strokeWidth="2.5" className="drop-shadow-lg group-hover:scale-110 transition-transform" />
      <circle r="4" fill={riskColor} />

      {/* Label Badge */}
      <g transform="translate(14, -2)" className="pointer-events-none">
        <rect
          x="0"
          y="-12"
          width={dam.name.length * 7 + 16}
          height="20"
          rx="5"
          fill="#061220"
          stroke={riskColor}
          strokeWidth="1"
          opacity="0.9"
        />
        <text
          x="8"
          y="2"
          fill="#ffffff"
          fontSize="10"
          fontWeight="bold"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {dam.name}
        </text>
      </g>
    </g>
  );
};
