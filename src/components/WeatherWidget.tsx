import React from 'react';
import { CloudRain, Wind, Droplets, Thermometer, CloudLightning, Sun, Cloud } from 'lucide-react';
import { WeatherTelemetry } from '../types';

interface WeatherWidgetProps {
  weather: WeatherTelemetry;
  id?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, id = 'weather-widget' }) => {
  const ConditionIcon = {
    clear: Sun,
    cloudy: Cloud,
    rain: CloudRain,
    heavy_rain: CloudRain,
    thunderstorm: CloudLightning,
  }[weather.condition] || CloudRain;

  return (
    <div
      id={id}
      className="p-5 rounded-2xl bg-[#091527]/85 backdrop-blur-xl border border-sky-500/20 shadow-lg space-y-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Doppler Radar & Catchment Weather
          </span>
          <h4 className="text-base font-bold text-white mt-0.5">{weather.locationName}</h4>
          <span className="text-xs text-slate-400">{weather.forecastSummary}</span>
        </div>
        <div className="p-3 rounded-xl bg-sky-500/10 text-cyan-400 border border-sky-500/20">
          <ConditionIcon className="w-6 h-6" />
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase">
            <Thermometer className="w-3 h-3 text-amber-400" />
            <span>Temp</span>
          </div>
          <div className="text-lg font-mono font-bold text-white mt-0.5">
            {weather.temperatureCelsius}°C
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase">
            <Droplets className="w-3 h-3 text-cyan-400" />
            <span>Humidity</span>
          </div>
          <div className="text-lg font-mono font-bold text-white mt-0.5">
            {weather.humidityPercentage}%
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase">
            <Wind className="w-3 h-3 text-teal-400" />
            <span>Wind</span>
          </div>
          <div className="text-lg font-mono font-bold text-white mt-0.5">
            {weather.windSpeedKmh} <span className="text-xs text-slate-400">km/h</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase">
            <CloudRain className="w-3 h-3 text-sky-400" />
            <span>Rain Rate</span>
          </div>
          <div className="text-lg font-mono font-bold text-sky-300 mt-0.5">
            {weather.rainfallRateMmH} <span className="text-xs text-slate-400">mm/h</span>
          </div>
        </div>
      </div>

      {/* Hourly Rainfall Forecast Histogram */}
      {weather.hourlyForecast && weather.hourlyForecast.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span>Precipitation Timeline (Next 12 Hours)</span>
            <span className="font-mono text-cyan-400 font-semibold">
              24h Total: {weather.accumulatedRainfall24hMm} mm
            </span>
          </div>

          <div className="flex items-end justify-between gap-1.5 h-16 pt-2 px-1 bg-slate-900/40 rounded-xl border border-slate-800">
            {weather.hourlyForecast.map((hour, idx) => {
              const maxRain = Math.max(...weather.hourlyForecast.map((h) => h.rainfallMm), 10);
              const heightPct = Math.max(15, (hour.rainfallMm / maxRain) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div
                    className="w-full max-w-[20px] rounded-t-md bg-gradient-to-t from-sky-600 to-cyan-400 group-hover:brightness-125 transition-all"
                    style={{ height: `${heightPct}%` }}
                    title={`${hour.time}: ${hour.rainfallMm} mm`}
                  />
                  <span className="text-[9px] font-mono text-slate-400 mt-1">{hour.time.split(':')[0]}h</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
