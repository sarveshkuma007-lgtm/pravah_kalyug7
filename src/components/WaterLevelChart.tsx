import React from 'react';
import { Dam } from '../types';

interface WaterLevelChartProps {
  dam: Dam;
  id?: string;
}

export const WaterLevelChart: React.FC<WaterLevelChartProps> = ({ dam, id = 'water-level-chart' }) => {
  const history = dam.telemetry.historicalLevels;

  if (!history || history.length === 0) {
    return null;
  }

  const values = history.map((h) => h.levelMeters);
  const minVal = Math.floor(Math.min(...values, dam.telemetry.warningLevelMeters * 0.95));
  const maxVal = Math.ceil(Math.max(...values, dam.telemetry.fullReservoirLevelMeters * 1.02));
  const range = maxVal - minVal || 1;

  // Generate SVG path coordinates (width: 500, height: 180)
  const width = 500;
  const height = 180;
  const paddingX = 30;
  const paddingY = 20;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const points = history.map((h, i) => {
    const x = paddingX + (i / (history.length - 1)) * chartWidth;
    const y = height - paddingY - ((h.levelMeters - minVal) / range) * chartHeight;
    return { x, y, level: h.levelMeters, date: h.date };
  });

  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  // Warning & danger line Y coordinates
  const dangerY = height - paddingY - ((dam.telemetry.dangerLevelMeters - minVal) / range) * chartHeight;
  const warningY = height - paddingY - ((dam.telemetry.warningLevelMeters - minVal) / range) * chartHeight;

  return (
    <div id={id} className="p-5 rounded-2xl bg-[#091527]/85 backdrop-blur-xl border border-sky-500/20 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white tracking-tight">
            Water Level Elevation Trend (7-Day Telemetry)
          </h4>
          <span className="text-xs text-slate-400">
            {dam.name} • Elevation in meters Above Mean Sea Level (MSL)
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-red-400">
            <span className="w-2 h-0.5 bg-red-500" /> Danger: {dam.telemetry.dangerLevelMeters}m
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-0.5 bg-amber-500" /> Warning: {dam.telemetry.warningLevelMeters}m
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 select-none">
          <defs>
            <linearGradient id="waterLevelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#1e293b" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#1e293b" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#334155" />

          {/* Danger line */}
          {dangerY >= paddingY && dangerY <= height - paddingY && (
            <g>
              <line
                x1={paddingX}
                y1={dangerY}
                x2={width - paddingX}
                y2={dangerY}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />
              <text x={width - paddingX - 4} y={dangerY - 4} fill="#ef4444" fontSize="9" textAnchor="end" fontFamily="monospace">
                Danger
              </text>
            </g>
          )}

          {/* Warning line */}
          {warningY >= paddingY && warningY <= height - paddingY && (
            <g>
              <line
                x1={paddingX}
                y1={warningY}
                x2={width - paddingX}
                y2={warningY}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />
              <text x={width - paddingX - 4} y={warningY - 4} fill="#f59e0b" fontSize="9" textAnchor="end" fontFamily="monospace">
                Warning
              </text>
            </g>
          )}

          {/* Area under curve */}
          <path d={areaPath} fill="url(#waterLevelGrad)" />

          {/* Water level curve */}
          <path d={linePath} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Points */}
          {points.map((p, idx) => (
            <g key={idx} className="group">
              <circle cx={p.x} cy={p.y} r="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <text
                x={p.x}
                y={p.y - 8}
                fill="#f8fafc"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {p.level}m
              </text>
              <text
                x={p.x}
                y={height - 6}
                fill="#94a3b8"
                fontSize="8"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {p.date.split('-').slice(1).join('/')}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
