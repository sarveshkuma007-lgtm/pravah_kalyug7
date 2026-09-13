import React, { useState, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  MapPin,
  Home,
  ShieldAlert,
  AlertTriangle,
  Radio,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Dam, FloodZone, Shelter, EvacuationRoute, GeoCoordinates } from '../types';
import { DamMarker } from './DamMarker';
import { mapsService } from '../services/mapsService';

interface MapViewProps {
  dams: Dam[];
  floodZones: FloodZone[];
  shelters: Shelter[];
  userLocation: GeoCoordinates;
  activeRoute?: EvacuationRoute | null;
  selectedDam?: Dam | null;
  onSelectDam?: (dam: Dam) => void;
  onSelectShelter?: (shelter: Shelter) => void;
  id?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  dams,
  floodZones,
  shelters,
  userLocation,
  activeRoute,
  selectedDam,
  onSelectDam,
  onSelectShelter,
  id = 'interactive-map-view',
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Layer Visibility Filters
  const [showDangerZones, setShowDangerZones] = useState(true);
  const [showWarningZones, setShowWarningZones] = useState(true);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showDams, setShowDams] = useState(true);

  // SVG Dimension canvas
  const canvasWidth = 1000;
  const canvasHeight = 700;

  // Project coordinates for user
  const userSvgPos = useMemo(
    () => mapsService.projectCoordinateToSvg(userLocation, canvasWidth, canvasHeight),
    [userLocation]
  );

  // Project coordinates for Dams
  const damSvgList = useMemo(() => {
    return dams.map((dam) => ({
      dam,
      pos: mapsService.projectCoordinateToSvg(dam.coordinates, canvasWidth, canvasHeight),
    }));
  }, [dams]);

  // Project coordinates for Shelters
  const shelterSvgList = useMemo(() => {
    return shelters.map((shelter) => ({
      shelter,
      pos: mapsService.projectCoordinateToSvg(shelter.coordinates, canvasWidth, canvasHeight),
    }));
  }, [shelters]);

  // Project coordinates for Flood Zones
  const floodZoneSvgList = useMemo(() => {
    return floodZones.map((zone) => {
      const center = mapsService.projectCoordinateToSvg(zone.center, canvasWidth, canvasHeight);
      const points = zone.coordinates.map((c) =>
        mapsService.projectCoordinateToSvg(c, canvasWidth, canvasHeight)
      );
      const pathString = points.reduce(
        (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
        ''
      ) + ' Z';
      return { zone, center, pathString };
    });
  }, [floodZones]);

  // Project active route line
  const routePathString = useMemo(() => {
    if (!activeRoute || !activeRoute.waypoints.length) return null;
    const pts = activeRoute.waypoints.map((w) =>
      mapsService.projectCoordinateToSvg(w, canvasWidth, canvasHeight)
    );
    return pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  }, [activeRoute]);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div
      id={id}
      className="relative w-full h-full min-h-[520px] rounded-2xl bg-[#060e1a] border border-sky-500/30 overflow-hidden shadow-2xl select-none"
    >
      {/* Top Map Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Layer filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#081322]/90 backdrop-blur-md border border-slate-700/80 pointer-events-auto shadow-lg">
          <button
            type="button"
            onClick={() => setShowDangerZones(!showDangerZones)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showDangerZones
                ? 'bg-red-900/60 text-red-200 border border-red-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Red Danger Zones"
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Danger Zones</span>
          </button>

          <button
            type="button"
            onClick={() => setShowWarningZones(!showWarningZones)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showWarningZones
                ? 'bg-amber-900/60 text-amber-200 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Moderate Warning Zones"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Warning Zones</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSafeZones(!showSafeZones)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showSafeZones
                ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Safe Relief Assembly Zones"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Safe Zones</span>
          </button>

          <button
            type="button"
            onClick={() => setShowShelters(!showShelters)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showShelters
                ? 'bg-teal-900/60 text-teal-200 border border-teal-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Shelters"
          >
            <Home className="w-3 h-3" />
            <span>Shelters</span>
          </button>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#081322]/90 backdrop-blur-md border border-slate-700/80 pointer-events-auto shadow-lg">
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.3, 3.5))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.3, 0.7))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetView}
            className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono text-cyan-400 px-1 font-bold">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>
      </div>

      {/* SVG Canvas Stage */}
      <svg
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          {/* Subtle Grid Pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0f2238" strokeWidth="0.8" />
          </pattern>

          {/* Glowing Filters */}
          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#06b6d4" floodOpacity="0.8" />
          </filter>
          <filter id="dangerGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ef4444" floodOpacity="0.6" />
          </filter>

          {/* Gradients */}
          <linearGradient id="dangerFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#991b1b" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="warningFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="safeFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Pan and Zoom Transformation Group */}
        <g
          transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}
          style={{ transformOrigin: 'center' }}
        >
          {/* Background Grid */}
          <rect x="0" y="0" width={canvasWidth} height={canvasHeight} fill="#060e1a" />
          <rect x="0" y="0" width={canvasWidth} height={canvasHeight} fill="url(#grid)" />

          {/* Simulated Major River Basin Channels */}
          <g opacity="0.35">
            {/* Ganga Basin */}
            <path
              d="M 330 190 Q 420 220 540 260 T 780 320"
              fill="none"
              stroke="#0284c7"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Narmada */}
            <path
              d="M 230 400 Q 320 395 440 390"
              fill="none"
              stroke="#0284c7"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Mahanadi */}
            <path
              d="M 520 390 Q 600 400 680 410"
              fill="none"
              stroke="#0284c7"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Krishna & Godavari */}
            <path
              d="M 280 480 Q 420 490 600 520"
              fill="none"
              stroke="#0284c7"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Periyar (South) */}
            <path
              d="M 310 630 Q 325 640 335 660"
              fill="none"
              stroke="#0284c7"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          {/* 1. FLOOD ZONES (Red Danger, Yellow Warning, Green Safe) */}
          <g id="flood-zones-layer">
            {floodZoneSvgList.map(({ zone, pathString, center }) => {
              if (zone.level === 'high' && !showDangerZones) return null;
              if (zone.level === 'moderate' && !showWarningZones) return null;
              if (zone.level === 'safe' && !showSafeZones) return null;

              const styleConfig = {
                high: {
                  fill: 'url(#dangerFill)',
                  stroke: '#ef4444',
                  filter: 'url(#dangerGlow)',
                  labelColor: '#fca5a5',
                  bgBadge: '#7f1d1d',
                },
                moderate: {
                  fill: 'url(#warningFill)',
                  stroke: '#f59e0b',
                  filter: '',
                  labelColor: '#fde68a',
                  bgBadge: '#78350f',
                },
                safe: {
                  fill: 'url(#safeFill)',
                  stroke: '#10b981',
                  filter: '',
                  labelColor: '#a7f3d0',
                  bgBadge: '#064e3b',
                },
              }[zone.level];

              return (
                <g key={zone.id} className="group cursor-pointer">
                  {/* Polygon outline & fill */}
                  <path
                    d={pathString}
                    fill={styleConfig.fill}
                    stroke={styleConfig.stroke}
                    strokeWidth="2"
                    strokeDasharray={zone.level === 'safe' ? '4 2' : 'none'}
                    className={zone.level === 'high' ? 'animate-pulse' : ''}
                  />

                  {/* Centered label */}
                  <g transform={`translate(${center.x}, ${center.y})`}>
                    <rect
                      x="-65"
                      y="-11"
                      width="130"
                      height="22"
                      rx="6"
                      fill={styleConfig.bgBadge}
                      stroke={styleConfig.stroke}
                      strokeWidth="1"
                      opacity="0.9"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={styleConfig.labelColor}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="system-ui, sans-serif"
                    >
                      {zone.level.toUpperCase()} ZONE ({zone.district.split('&')[0].trim()})
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* 2. RECOMMENDED EVACUATION ROUTE (BLUE) */}
          {routePathString && (
            <g id="evacuation-route-layer">
              {/* Outer neon glow tube */}
              <path
                d={routePathString}
                fill="none"
                stroke="#0284c7"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
              />
              {/* Vibrant cyan core line */}
              <path
                d={routePathString}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#routeGlow)"
              />
              {/* Pulsing route waypoints */}
              {activeRoute?.waypoints.map((w, idx) => {
                const pt = mapsService.projectCoordinateToSvg(w, canvasWidth, canvasHeight);
                return (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill="#38bdf8"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                );
              })}
            </g>
          )}

          {/* 3. RELIEF SHELTERS (Green Home Markers) */}
          {showShelters && (
            <g id="shelters-layer">
              {shelterSvgList.map(({ shelter, pos }) => (
                <g
                  key={shelter.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={() => onSelectShelter && onSelectShelter(shelter)}
                >
                  <circle r="9" fill="#047857" stroke="#34d399" strokeWidth="2" />
                  {/* Miniature roof icon */}
                  <path d="M -4 1 L 0 -4 L 4 1" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                  <rect x="-3" y="1" width="6" height="4" fill="#ffffff" />

                  {/* Shelter Tooltip on hover */}
                  <g transform="translate(12, -4)" className="opacity-80 group-hover:opacity-100">
                    <rect
                      x="0"
                      y="-9"
                      width={shelter.name.length * 5.2 + 10}
                      height="16"
                      rx="4"
                      fill="#062e22"
                      stroke="#34d399"
                      strokeWidth="1"
                    />
                    <text x="5" y="3" fill="#a7f3d0" fontSize="8" fontWeight="bold">
                      {shelter.name}
                    </text>
                  </g>
                </g>
              ))}
            </g>
          )}

          {/* 4. DAM MARKERS */}
          {showDams && (
            <g id="dams-layer">
              {damSvgList.map(({ dam, pos }) => (
                <DamMarker
                  key={dam.id}
                  dam={dam}
                  x={pos.x}
                  y={pos.y}
                  isSelected={selectedDam?.id === dam.id}
                  onClick={onSelectDam}
                />
              ))}
            </g>
          )}

          {/* 5. CURRENT USER GPS LOCATION PIN */}
          <g
            id="user-gps-pin"
            transform={`translate(${userSvgPos.x}, ${userSvgPos.y})`}
            className="cursor-pointer"
          >
            {/* Pulsing Radar concentric rings */}
            <circle r="22" fill="none" stroke="#38bdf8" strokeWidth="1" className="animate-ping opacity-40" />
            <circle r="14" fill="#0284c7" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1.5" />
            <circle r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />

            {/* "You Are Here" Label */}
            <g transform="translate(0, -16)">
              <rect x="-42" y="-12" width="84" height="18" rx="5" fill="#0369a1" stroke="#bae6fd" strokeWidth="1" />
              <text x="0" y="0.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="extrabold">
                YOU ARE HERE
              </text>
            </g>
          </g>
        </g>
      </svg>

      {/* Floating Status Watermark */}
      <div className="absolute bottom-3 left-4 z-10 flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-[#071322]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 pointer-events-none">
        <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>CWC Live Radar • Coordinates Lat: {userLocation.lat.toFixed(3)}, Lng: {userLocation.lng.toFixed(3)}</span>
      </div>
    </div>
  );
};
