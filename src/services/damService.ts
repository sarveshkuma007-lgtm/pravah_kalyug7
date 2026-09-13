import { Dam, DamRiskStatus } from '../types';
import { INITIAL_DAMS } from '../data/dams';

export class DamService {
  private dams: Dam[] = [...INITIAL_DAMS];

  public getAllDams(): Dam[] {
    return [...this.dams];
  }

  public getDamById(id: string): Dam | undefined {
    return this.dams.find((d) => d.id === id);
  }

  public filterDams(filters: {
    search?: string;
    state?: string;
    riverBasin?: string;
    status?: DamRiskStatus | 'all';
  }): Dam[] {
    return this.dams.filter((dam) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesSearch =
          dam.name.toLowerCase().includes(query) ||
          dam.river.toLowerCase().includes(query) ||
          dam.state.toLowerCase().includes(query) ||
          dam.district.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (filters.state && filters.state !== 'All States') {
        if (dam.state !== filters.state) return false;
      }

      if (filters.riverBasin && filters.riverBasin !== 'All Basins') {
        if (dam.riverBasin !== filters.riverBasin) return false;
      }

      if (filters.status && filters.status !== 'all') {
        if (dam.status !== filters.status) return false;
      }

      return true;
    });
  }

  public getSummaryStatistics() {
    const total = this.dams.length;
    const normal = this.dams.filter((d) => d.status === 'normal').length;
    const warning = this.dams.filter((d) => d.status === 'warning').length;
    const critical = this.dams.filter((d) => d.status === 'critical').length;
    const totalInflow = this.dams.reduce((acc, d) => acc + d.telemetry.currentInflowCusecs, 0);
    const totalOutflow = this.dams.reduce((acc, d) => acc + d.telemetry.currentOutflowCusecs, 0);

    return {
      total,
      normal,
      warning,
      critical,
      totalInflow,
      totalOutflow,
    };
  }

  /**
   * Simulate a live telemetry tick (micro-fluctuations)
   */
  public simulateTelemetryPulse(): Dam[] {
    this.dams = this.dams.map((dam) => {
      const deltaInflow = (Math.random() - 0.48) * 1200;
      const deltaOutflow = (Math.random() - 0.5) * 800;
      const newInflow = Math.max(1000, Math.round(dam.telemetry.currentInflowCusecs + deltaInflow));
      const newOutflow = Math.max(800, Math.round(dam.telemetry.currentOutflowCusecs + deltaOutflow));

      // slight water level fluctuation
      const levelDelta = (newInflow - newOutflow) * 0.0000003;
      const newLevel = Math.round((dam.telemetry.waterLevelMeters + levelDelta) * 100) / 100;

      return {
        ...dam,
        telemetry: {
          ...dam.telemetry,
          waterLevelMeters: newLevel,
          currentInflowCusecs: newInflow,
          currentOutflowCusecs: newOutflow,
          lastUpdated: new Date().toISOString(),
        },
      };
    });
    return [...this.dams];
  }
}

export const damService = new DamService();
