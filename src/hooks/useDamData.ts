import { useState, useEffect, useCallback, useMemo } from 'react';
import { Dam, DamRiskStatus } from '../types';
import { damService } from '../services/damService';

export function useDamData() {
  const [dams, setDams] = useState<Dam[]>(() => damService.getAllDams());
  const [selectedDamId, setSelectedDamId] = useState<string | null>('dam-002'); // Default Tehri (Critical)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedBasin, setSelectedBasin] = useState('All Basins');
  const [selectedRisk, setSelectedRisk] = useState<DamRiskStatus | 'all'>('all');
  const [isLiveTelemetryActive, setIsLiveTelemetryActive] = useState(true);

  // Periodic telemetry pulse every 5 seconds to simulate live sensory feeds
  useEffect(() => {
    if (!isLiveTelemetryActive) return;

    const interval = setInterval(() => {
      const updated = damService.simulateTelemetryPulse();
      setDams(updated);
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveTelemetryActive]);

  const filteredDams = useMemo(() => {
    return damService.filterDams({
      search: searchQuery,
      state: selectedState,
      riverBasin: selectedBasin,
      status: selectedRisk,
    });
  }, [dams, searchQuery, selectedState, selectedBasin, selectedRisk]);

  const selectedDam = useMemo(() => {
    return dams.find((d) => d.id === selectedDamId) || dams[0];
  }, [dams, selectedDamId]);

  const stats = useMemo(() => {
    return damService.getSummaryStatistics();
  }, [dams]);

  const refreshTelemetry = useCallback(() => {
    const updated = damService.simulateTelemetryPulse();
    setDams(updated);
  }, []);

  return {
    dams,
    filteredDams,
    selectedDam,
    selectedDamId,
    setSelectedDamId,
    searchQuery,
    setSearchQuery,
    selectedState,
    setSelectedState,
    selectedBasin,
    setSelectedBasin,
    selectedRisk,
    setSelectedRisk,
    stats,
    isLiveTelemetryActive,
    setIsLiveTelemetryActive,
    refreshTelemetry,
  };
}
