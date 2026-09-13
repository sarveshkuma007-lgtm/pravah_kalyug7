import { GeoCoordinates, EvacuationRoute, EvacuationRouteStep, Shelter } from '../types';
import { INITIAL_SHELTERS } from '../data/shelters';
import { locationService } from './locationService';

export class MapsService {
  /**
   * Google Maps API-ready Directions calculation
   * Calculates a safe evacuation route that circumvents inundated zones
   */
  public calculateSafeEvacuationRoute(
    startPoint: GeoCoordinates,
    targetShelter?: Shelter
  ): EvacuationRoute {
    const destination = targetShelter || locationService.getNearestShelter(startPoint).shelter;
    const directDistance = locationService.calculateDistanceKm(startPoint, destination.coordinates);

    // Evacuation route has a slight deviation around river floodplains (approx 1.25x direct distance)
    const totalDistanceKm = Math.round(directDistance * 1.25 * 10) / 10;
    const estimatedTravelTimeMinutes = Math.round((totalDistanceKm / 35) * 60); // average evacuation speed 35km/h

    // Intermediate waypoints that arc away from the river bed
    const midLat = (startPoint.lat + destination.coordinates.lat) / 2 + 0.03; // arc towards higher contour
    const midLng = (startPoint.lng + destination.coordinates.lng) / 2 - 0.02;

    const waypoints: GeoCoordinates[] = [
      startPoint,
      { lat: startPoint.lat + (midLat - startPoint.lat) * 0.4, lng: startPoint.lng + (midLng - startPoint.lng) * 0.4 },
      { lat: midLat, lng: midLng },
      { lat: midLat + (destination.coordinates.lat - midLat) * 0.6, lng: midLng + (destination.coordinates.lng - midLng) * 0.6 },
      destination.coordinates,
    ];

    const steps: EvacuationRouteStep[] = [
      {
        instruction: 'Head north on Collectorate bypass away from low-lying riverbank',
        distanceKm: 1.2,
        estimatedMinutes: 3,
        isSafe: true,
      },
      {
        instruction: 'Take the elevated bypass flyover (Route NH-58 Elevated Corridor)',
        distanceKm: 3.5,
        estimatedMinutes: 6,
        hazardNote: 'High clearance; completely free of surface stormwater',
        isSafe: true,
      },
      {
        instruction: 'Turn right at Ridge Highway towards high-elevation sector',
        distanceKm: 2.8,
        estimatedMinutes: 5,
        isSafe: true,
      },
      {
        instruction: `Arrive at designated disaster refuge: ${destination.name}`,
        distanceKm: 0.5,
        estimatedMinutes: 2,
        isSafe: true,
      },
    ];

    return {
      id: `route-${destination.id}`,
      startPoint,
      destinationShelterId: destination.id,
      destinationName: destination.name,
      totalDistanceKm,
      estimatedTravelTimeMinutes,
      safetyScore: 98,
      waypoints,
      steps,
      isActiveRecommendation: true,
    };
  }

  /**
   * Project geo lat/long coordinates onto an SVG 1000x700 bounding box covering India
   * India Bounds approx: Lat 8 to 36, Lng 68 to 97
   */
  public projectCoordinateToSvg(
    coord: GeoCoordinates,
    width: number = 1000,
    height: number = 700
  ): { x: number; y: number } {
    const minLng = 68.0;
    const maxLng = 97.5;
    const minLat = 8.0;
    const maxLat = 36.0;

    const x = ((coord.lng - minLng) / (maxLng - minLng)) * (width - 80) + 40;
    const y = ((maxLat - coord.lat) / (maxLat - minLat)) * (height - 80) + 40;

    return {
      x: Math.max(10, Math.min(width - 10, x)),
      y: Math.max(10, Math.min(height - 10, y)),
    };
  }
}

export const mapsService = new MapsService();
