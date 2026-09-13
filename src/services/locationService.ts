import { GeoCoordinates, Dam, Shelter, FloodZone } from '../types';
import { INITIAL_DAMS } from '../data/dams';
import { INITIAL_SHELTERS } from '../data/shelters';
import { INITIAL_FLOOD_ZONES } from '../data/floodZones';

// Default reference location (e.g. Rishikesh / Haridwar Ganga basin river plain near Tehri)
export const DEFAULT_USER_LOCATION: GeoCoordinates = {
  lat: 30.1033,
  lng: 78.2947,
};

export class LocationService {
  /**
   * Calculate distance between two GPS coordinates in kilometers using Haversine formula
   */
  public calculateDistanceKm(coord1: GeoCoordinates, coord2: GeoCoordinates): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(coord2.lat - coord1.lat);
    const dLng = this.deg2rad(coord2.lng - coord1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(coord1.lat)) *
        Math.cos(this.deg2rad(coord2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Request user coordinates from browser with robust fallback
   */
  public async getUserLocation(): Promise<GeoCoordinates> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(DEFAULT_USER_LOCATION);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Fallback on denial or timeout
          resolve(DEFAULT_USER_LOCATION);
        },
        { timeout: 6000, enableHighAccuracy: true }
      );
    });
  }

  /**
   * Find the closest dam to a coordinate
   */
  public getNearestDam(coordinates: GeoCoordinates, dams: Dam[] = INITIAL_DAMS): { dam: Dam; distanceKm: number } {
    let nearestDam = dams[0];
    let minDistance = this.calculateDistanceKm(coordinates, dams[0].coordinates);

    for (let i = 1; i < dams.length; i++) {
      const dist = this.calculateDistanceKm(coordinates, dams[i].coordinates);
      if (dist < minDistance) {
        minDistance = dist;
        nearestDam = dams[i];
      }
    }

    return { dam: nearestDam, distanceKm: minDistance };
  }

  /**
   * Find nearest operational shelter to user
   */
  public getNearestShelter(
    coordinates: GeoCoordinates,
    shelters: Shelter[] = INITIAL_SHELTERS
  ): { shelter: Shelter; distanceKm: number } {
    let nearest = shelters[0];
    let minDistance = this.calculateDistanceKm(coordinates, shelters[0].coordinates);

    for (let i = 1; i < shelters.length; i++) {
      const dist = this.calculateDistanceKm(coordinates, shelters[i].coordinates);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = shelters[i];
      }
    }

    return { shelter: nearest, distanceKm: minDistance };
  }

  /**
   * Find nearest flood zone and check proximity
   */
  public getNearestFloodZone(
    coordinates: GeoCoordinates,
    zones: FloodZone[] = INITIAL_FLOOD_ZONES
  ): { zone: FloodZone; distanceKm: number; isInsideOrNear: boolean } {
    let nearest = zones[0];
    let minDistance = this.calculateDistanceKm(coordinates, zones[0].center);

    for (let i = 1; i < zones.length; i++) {
      const dist = this.calculateDistanceKm(coordinates, zones[i].center);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = zones[i];
      }
    }

    // Considered inside/near if within ~25 km of center
    const isInsideOrNear = minDistance < 25;

    return { zone: nearest, distanceKm: minDistance, isInsideOrNear };
  }
}

export const locationService = new LocationService();
