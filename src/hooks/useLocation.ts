import { useState, useEffect, useCallback } from 'react';
import { GeoCoordinates, Dam, Shelter, FloodZone } from '../types';
import { locationService, DEFAULT_USER_LOCATION } from '../services/locationService';
import { damService } from '../services/damService';
import { INITIAL_SHELTERS } from '../data/shelters';
import { INITIAL_FLOOD_ZONES } from '../data/floodZones';

export function useLocation() {
  const [coordinates, setCoordinates] = useState<GeoCoordinates>(DEFAULT_USER_LOCATION);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const coords = await locationService.getUserLocation();
      setCoordinates(coords);
    } catch (err: any) {
      setError(err?.message || 'Unable to retrieve location');
      setCoordinates(DEFAULT_USER_LOCATION);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial request
    requestLocation();
  }, [requestLocation]);

  const nearestDam = locationService.getNearestDam(coordinates, damService.getAllDams());
  const nearestShelter = locationService.getNearestShelter(coordinates, INITIAL_SHELTERS);
  const nearestFloodZone = locationService.getNearestFloodZone(coordinates, INITIAL_FLOOD_ZONES);

  const setManualLocation = useCallback((newCoords: GeoCoordinates) => {
    setCoordinates(newCoords);
  }, []);

  return {
    coordinates,
    isLoading,
    error,
    nearestDam,
    nearestShelter,
    nearestFloodZone,
    requestLocation,
    setManualLocation,
  };
}
