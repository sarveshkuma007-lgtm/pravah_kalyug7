import { DamTelemetry, DamRiskStatus } from '../types';

export interface CalculatedRiskAssessment {
  status: DamRiskStatus;
  capacityPercentage: number;
  freeboardMeters: number;
  inflowOutflowDelta: number; // positive means reservoir filling
  hoursUntilDangerLevel: number | null;
  riskScore: number; // 0 to 100
  riskSummary: string;
}

export function calculateDamRisk(telemetry: DamTelemetry): CalculatedRiskAssessment {
  const capacityPercentage = Math.min(
    100,
    Math.max(0, (telemetry.waterLevelMeters / telemetry.fullReservoirLevelMeters) * 100)
  );

  const freeboardMeters = Math.max(0, telemetry.fullReservoirLevelMeters - telemetry.waterLevelMeters);
  const inflowOutflowDelta = telemetry.currentInflowCusecs - telemetry.currentOutflowCusecs;

  let riskScore = 0;

  // Level factor (up to 45 points)
  if (telemetry.waterLevelMeters >= telemetry.dangerLevelMeters) {
    riskScore += 45;
  } else if (telemetry.waterLevelMeters >= telemetry.warningLevelMeters) {
    const range = telemetry.dangerLevelMeters - telemetry.warningLevelMeters;
    const progress = (telemetry.waterLevelMeters - telemetry.warningLevelMeters) / (range || 1);
    riskScore += 25 + progress * 20;
  } else {
    riskScore += (telemetry.waterLevelMeters / telemetry.warningLevelMeters) * 20;
  }

  // Inflow vs Outflow rate (up to 25 points)
  if (inflowOutflowDelta > 50000) {
    riskScore += 25;
  } else if (inflowOutflowDelta > 20000) {
    riskScore += 18;
  } else if (inflowOutflowDelta > 5000) {
    riskScore += 10;
  }

  // Rainfall factor (up to 20 points)
  if (telemetry.rainfall24hMm > 150) {
    riskScore += 20;
  } else if (telemetry.rainfall24hMm > 80) {
    riskScore += 14;
  } else if (telemetry.rainfall24hMm > 40) {
    riskScore += 8;
  }

  // Structural / Gates factor (up to 10 points)
  const gatesOpenRatio = telemetry.gatesOpen / (telemetry.totalGates || 1);
  if (gatesOpenRatio > 0.8) {
    riskScore += 10;
  } else if (gatesOpenRatio > 0.4) {
    riskScore += 5;
  }

  riskScore = Math.min(100, Math.round(riskScore));

  let status: DamRiskStatus = 'normal';
  let riskSummary = 'Reservoir operations within regulated safe hydraulic parameters.';

  if (riskScore >= 70 || telemetry.waterLevelMeters >= telemetry.dangerLevelMeters) {
    status = 'critical';
    riskSummary = 'CRITICAL: Water level has breached threshold or high rapid inflow detected. Emergency discharge active.';
  } else if (riskScore >= 45 || telemetry.waterLevelMeters >= telemetry.warningLevelMeters) {
    status = 'warning';
    riskSummary = 'WARNING: Water level approaching Full Reservoir Level (FRL). Catchment heavy precipitation alert.';
  }

  // Compute hours until danger level if rising
  let hoursUntilDangerLevel: number | null = null;
  if (inflowOutflowDelta > 0 && telemetry.waterLevelMeters < telemetry.dangerLevelMeters) {
    // Approx rate of rise (rough conversion: 10,000 cusec net rise ~ 0.05m per hour for large reservoirs)
    const riseRateMetersPerHour = (inflowOutflowDelta / 10000) * 0.04;
    if (riseRateMetersPerHour > 0) {
      const remainingMeters = telemetry.dangerLevelMeters - telemetry.waterLevelMeters;
      hoursUntilDangerLevel = Math.max(0.5, Math.round((remainingMeters / riseRateMetersPerHour) * 10) / 10);
    }
  }

  return {
    status,
    capacityPercentage: Math.round(capacityPercentage * 10) / 10,
    freeboardMeters: Math.round(freeboardMeters * 100) / 100,
    inflowOutflowDelta,
    hoursUntilDangerLevel,
    riskScore,
    riskSummary,
  };
}
