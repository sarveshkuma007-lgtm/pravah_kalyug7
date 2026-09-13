import { WeatherTelemetry } from '../types';
import { MOCK_WEATHER_REPORTS } from '../data/mockWeather';

export class WeatherService {
  public getWeatherForDam(damId: string): WeatherTelemetry {
    return MOCK_WEATHER_REPORTS[damId] || MOCK_WEATHER_REPORTS['default'];
  }

  public getCompositeWeather(): WeatherTelemetry {
    return MOCK_WEATHER_REPORTS['default'];
  }

  public getAllWeatherReports(): Record<string, WeatherTelemetry> {
    return MOCK_WEATHER_REPORTS;
  }
}

export const weatherService = new WeatherService();
