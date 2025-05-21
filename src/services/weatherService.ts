import { addMinutes, format, parseISO } from 'date-fns';
import { simulateWeatherData } from '../utils/mockData';

interface WeatherForecast {
  willRain: 'low' | 'medium' | 'high';
  currentTemp: number;
}

export const getWeatherForecast = async (
  lat: number, 
  lon: number, 
  durationMinutes: number
): Promise<WeatherForecast> => {
  try {
    const now = new Date();
    const end = addMinutes(now, durationMinutes);
    
    // Format dates pour l'API
    const startDate = format(now, 'yyyy-MM-dd');
    const endDate = format(end, 'yyyy-MM-dd');
    
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    
    // Paramètres de la requête
    const params = {
      latitude: lat.toFixed(4),
      longitude: lon.toFixed(4),
      hourly: 'temperature_2m,precipitation_probability',
      current_weather: 'true',
      timezone: 'auto',
      start_date: startDate,
      end_date: endDate
    };
    
    // Ajout des paramètres à l'URL
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Weather API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Vérification des données essentielles
    if (!data.hourly?.precipitation_probability || !data.current_weather?.temperature) {
      console.error('Invalid API response structure:', data);
      throw new Error('Invalid data structure received from API');
    }
    
    // Filtrer les probabilités de pluie entre now et end
    const startTime = now.getTime();
    const endTime = end.getTime();

    const precipitationProbabilities: number[] = [];

    for (let i = 0; i < data.hourly.time.length; i++) {
      const hourTime = parseISO(data.hourly.time[i]).getTime();
      
      if (hourTime >= startTime && hourTime <= endTime) {
        precipitationProbabilities.push(data.hourly.precipitation_probability[i]);
      }
    }

    const maxProbability = precipitationProbabilities.length > 0
      ? Math.max(...precipitationProbabilities)
      : 0; // fallback si pas de données

    // Définir le niveau de risque pluie
    let willRain: 'low' | 'medium' | 'high';

    if (maxProbability < 30) {
      willRain = 'low';
    } else if (maxProbability < 60) {
      willRain = 'medium';
    } else {
      willRain = 'high';
    }
    
    // Température actuelle arrondie
    const currentTemp = Math.round(data.current_weather.temperature);
    
    return { willRain, currentTemp };
  } catch (error) {
    console.error('Error in weather service:', error);
    // Fallback sur données simulées si échec API
    return simulateWeatherData(lat, lon, durationMinutes);
  }
};
