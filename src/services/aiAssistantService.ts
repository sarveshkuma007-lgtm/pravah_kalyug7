import { ChatMessage, GeoCoordinates } from '../types';
import { damService } from './damService';
import { locationService } from './locationService';
import { mapsService } from './mapsService';
import { weatherService } from './weatherService';

export interface ChatbotProcessResult {
  message: ChatMessage;
  navigatePage?: 'live-map' | 'dam-monitoring' | 'alerts' | 'safe-routes';
  highlightRouteId?: string;
  focusCoordinates?: GeoCoordinates;
}

export class AIAssistantService {
  public async processUserPrompt(
    userText: string,
    userLocation: GeoCoordinates
  ): Promise<ChatbotProcessResult> {
    const textLower = userText.toLowerCase().trim();
    const nearestDamData = locationService.getNearestDam(userLocation);
    const nearestShelterData = locationService.getNearestShelter(userLocation);
    const floodZoneData = locationService.getNearestFloodZone(userLocation);

    // 1. "Am I safe?" or safety inquiries
    if (
      textLower.includes('am i safe') ||
      textLower.includes('safe?') ||
      textLower.includes('kya main surakshit') ||
      textLower.includes('is it safe') ||
      textLower.includes('safety status')
    ) {
      let riskResponse = '';
      if (floodZoneData.isInsideOrNear && floodZoneData.zone.level === 'high') {
        riskResponse = `⚠️ CRITICAL: Your location is currently within ${floodZoneData.distanceKm.toFixed(1)} km of an active HIGH DANGER flood zone (${floodZoneData.zone.name}). You are in an area vulnerable to inundation. Please prepare for immediate relocation to higher ground or a relief shelter. Type "Show me a safe route" for immediate navigation.`;
      } else if (floodZoneData.isInsideOrNear && floodZoneData.zone.level === 'moderate') {
        riskResponse = `⚠️ ALERT: Your location is currently in a MODERATE WARNING zone (${floodZoneData.zone.name}, approx ${floodZoneData.distanceKm.toFixed(1)} km away). Nearest dam is ${nearestDamData.dam.name} (${nearestDamData.dam.status.toUpperCase()} status). Please remain alert, avoid low-lying bridges, and monitor official warnings.`;
      } else {
        riskResponse = `✅ You are currently in a SAFE ELEVATION zone. The nearest flood zone (${floodZoneData.zone.name}) is ${floodZoneData.distanceKm.toFixed(1)} km away. The nearest dam, ${nearestDamData.dam.name}, is ${nearestDamData.distanceKm.toFixed(1)} km away with current water level at ${nearestDamData.dam.telemetry.waterLevelMeters}m.`;
      }

      return {
        message: {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: riskResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      };
    }

    // 2. "Show me a safe route" / "Show me the safest route" / "evacuate" / "safe path"
    if (
      textLower.includes('safe route') ||
      textLower.includes('safest route') ||
      textLower.includes('evacuate') ||
      textLower.includes('surakshit rasta') ||
      textLower.includes('shelter route') ||
      textLower.includes('directions')
    ) {
      const calculatedRoute = mapsService.calculateSafeEvacuationRoute(
        userLocation,
        nearestShelterData.shelter
      );

      const replyText = `🧭 SAFEST EVACUATION ROUTE CALCULATED:
• Recommended Destination: ${nearestShelterData.shelter.name} (${nearestShelterData.shelter.type.replace('_', ' ')})
• Distance: ${calculatedRoute.totalDistanceKm} km (~${calculatedRoute.estimatedTravelTimeMinutes} mins)
• Available Beds: ${nearestShelterData.shelter.availableBeds} / ${nearestShelterData.shelter.capacity}
• Route Safety Index: ${calculatedRoute.safetyScore}/100

I am redirecting you to the Live Interactive Map. The recommended evacuation path is highlighted in BLUE, danger zones in RED, moderate zones in YELLOW, and safe assembly areas in GREEN.`;

      return {
        message: {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionPayload: {
            type: 'NAVIGATE_MAP_ROUTE',
            shelterId: nearestShelterData.shelter.id,
            focusCoordinates: nearestShelterData.shelter.coordinates,
            highlightRoute: true,
            routeId: calculatedRoute.id,
          },
        },
        navigatePage: 'live-map',
        highlightRouteId: calculatedRoute.id,
        focusCoordinates: nearestShelterData.shelter.coordinates,
      };
    }

    // 3. Nearest shelter inquiry
    if (
      textLower.includes('shelter') ||
      textLower.includes('relief camp') ||
      textLower.includes('ashray') ||
      textLower.includes('camp')
    ) {
      const shelter = nearestShelterData.shelter;
      const text = `🏠 The nearest relief facility is **${shelter.name}** located ${nearestShelterData.distanceKm.toFixed(1)} km away in ${shelter.district}, ${shelter.state}.
• Available Beds: ${shelter.availableBeds} (Capacity: ${shelter.capacity})
• Medical Team: ${shelter.medicalTeamOnSite ? 'Yes, Available 24x7' : 'On Standby'}
• Food & Water Supplies: Sufficient for ${shelter.foodWaterStockDays} days
• Emergency Contact: ${shelter.emergencyContact}
• Elevation: ${shelter.elevationMeters}m MSL

Would you like me to map out the safest route to this shelter?`;

      return {
        message: {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      };
    }

    // 4. Dam query (e.g. Tehri, Sardar Sarovar, Idukki, Hirakud)
    const dams = damService.getAllDams();
    const matchedDam = dams.find(
      (d) =>
        textLower.includes(d.name.toLowerCase()) ||
        textLower.includes(d.river.toLowerCase()) ||
        textLower.includes(d.district.toLowerCase())
    );

    if (matchedDam) {
      const weather = weatherService.getWeatherForDam(matchedDam.id);
      const text = `🌊 **${matchedDam.name}** (${matchedDam.state}) Status Report:
• Risk Level: **${matchedDam.status.toUpperCase()}**
• Current Water Level: ${matchedDam.telemetry.waterLevelMeters}m (FRL: ${matchedDam.telemetry.fullReservoirLevelMeters}m)
• Current Inflow: ${matchedDam.telemetry.currentInflowCusecs.toLocaleString('en-IN')} cusecs
• Current Outflow: ${matchedDam.telemetry.currentOutflowCusecs.toLocaleString('en-IN')} cusecs
• Open Sluice Gates: ${matchedDam.telemetry.gatesOpen} / ${matchedDam.telemetry.totalGates}
• Catchment Rain (24h): ${matchedDam.telemetry.rainfall24hMm} mm (${weather.condition})
• Downstream Districts on Watch: ${matchedDam.downstreamDistricts.join(', ')}

${matchedDam.alertLevelDescription}`;

      return {
        message: {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      };
    }

    // 5. Weather inquiry
    if (
      textLower.includes('weather') ||
      textLower.includes('rain') ||
      textLower.includes('monsoon') ||
      textLower.includes('mausam')
    ) {
      const weather = weatherService.getCompositeWeather();
      const text = `🌧️ **Catchment Weather Briefing:**
• Precipitation: ${weather.rainfallRateMmH} mm/hr (24h accumulated: ${weather.accumulatedRainfall24hMm} mm)
• Wind: ${weather.windSpeedKmh} km/h ${weather.windDirection}
• Humidity: ${weather.humidityPercentage}%
• Forecast: ${weather.forecastSummary}`;

      return {
        message: {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      };
    }

    // 6. Generic emergency or assistance response
    const defaultText = `Hello, I am PRAVAH AI, your disaster intelligence assistant.
I am continuously analyzing live telemetry across Indian reservoirs, Doppler precipitation radars, and floodplains.

You can ask me:
1. **"Am I safe?"** - To analyze your real-time GPS location against flood risk zones.
2. **"Show me the safest route"** - To calculate an evacuation path avoiding inundated areas and plot it on the Live Map.
3. **"Tehri Dam status"** or any other dam name - To view live water levels, inflows, and gate operations.
4. **"Nearest relief shelter"** - To check nearest relief camps, available beds, and medical readiness.`;

    return {
      message: {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: defaultText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    };
  }
}

export const aiAssistantService = new AIAssistantService();
