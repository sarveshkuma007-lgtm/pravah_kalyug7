import { FloodPredictionModel, Dam } from '../types';
import { INITIAL_DAMS } from '../data/dams';

export class FloodPredictionService {
  public generatePredictionForDam(dam: Dam): FloodPredictionModel {
    const netInflowOutflow = dam.telemetry.currentInflowCusecs - dam.telemetry.currentOutflowCusecs;
    const capacityRatio = dam.telemetry.waterLevelMeters / dam.telemetry.fullReservoirLevelMeters;

    let inflowTrend: 'rapid_rise' | 'steady_rise' | 'plateau' | 'falling' = 'steady_rise';
    if (netInflowOutflow > 40000) {
      inflowTrend = 'rapid_rise';
    } else if (netInflowOutflow < -10000) {
      inflowTrend = 'falling';
    } else if (Math.abs(netInflowOutflow) < 5000) {
      inflowTrend = 'plateau';
    }

    const projectedPeakInflowCusecs = Math.round(
      dam.telemetry.currentInflowCusecs * (1 + (dam.telemetry.rainfall24hMm / 300))
    );

    let estimatedTimeToSpillHours: number | null = null;
    if (netInflowOutflow > 0 && dam.telemetry.waterLevelMeters < dam.telemetry.fullReservoirLevelMeters) {
      const remainingMeters = dam.telemetry.fullReservoirLevelMeters - dam.telemetry.waterLevelMeters;
      estimatedTimeToSpillHours = Math.max(1, Math.round((remainingMeters / 0.15) * 10) / 10);
    }

    const floodArrivalEta =
      dam.status === 'critical'
        ? 'High surge arrival within 3.5 - 5.0 hours'
        : dam.status === 'warning'
        ? 'Secondary wave expected in 8 - 14 hours'
        : 'Inflow within regular channel capacities for next 48h';

    const affectedPopulationEstimate =
      dam.status === 'critical'
        ? dam.downstreamDistricts.length * 48000
        : dam.status === 'warning'
        ? dam.downstreamDistricts.length * 16000
        : 0;

    const recommendedReleaseRateCusecs = Math.round(
      dam.telemetry.currentInflowCusecs * 0.92
    );

    const aiConfidenceScore = 93.8;

    const aiRecommendations = [
      `Pre-deplete reservoir storage by gradually increasing spillway discharge to ${recommendedReleaseRateCusecs.toLocaleString('en-IN')} cusecs.`,
      `Issue automated SMS and broadcast warning siren alerts across ${dam.downstreamDistricts.join(', ')}.`,
      `Activate river gauge telemetry at 15-minute telemetry intervals instead of standard 1-hour polling.`,
      `Alert NDRF battalions and preposition motor-inflatable boats (FRP) at low-lying river bridges.`,
      `Halt all riverbed extraction and sand dredging activities immediately.`,
    ];

    return {
      damId: dam.id,
      damName: dam.name,
      predictionHorizonHours: 24,
      inflowTrend,
      projectedPeakInflowCusecs,
      estimatedTimeToSpillHours,
      floodArrivalEta,
      affectedPopulationEstimate,
      recommendedReleaseRateCusecs,
      aiConfidenceScore,
      aiRecommendations,
    };
  }

  public getAllPredictions(): FloodPredictionModel[] {
    return INITIAL_DAMS.map((dam) => this.generatePredictionForDam(dam));
  }
}

export const floodPredictionService = new FloodPredictionService();
