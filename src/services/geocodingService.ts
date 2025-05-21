const NOMINATIM_CACHE: Record<string, string> = {};
const GEOCODING_CACHE: Record<string, Array<{ latitude: number; longitude: number; name: string }>> = {};

interface GeocodingResult {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
  admin1?: string;
}

export const geocodeLocation = async (
  query: string
): Promise<Array<{ latitude: number; longitude: number; name: string }>> => {
  const key = query.toLowerCase();

  if (GEOCODING_CACHE[key]) {
    return GEOCODING_CACHE[key];
  }

  try {
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
    url.searchParams.append('name', query);
    url.searchParams.append('count', '5');
    url.searchParams.append('language', 'fr');
    url.searchParams.append('format', 'json');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error('Failed to geocode location');
    }

    const data = await response.json();

    if (!data.results?.length) {
      throw new Error('Location not found');
    }

    const locations = data.results.map((result: GeocodingResult) => {
      const locationName = [result.name, result.admin1, result.country]
        .filter(Boolean)
        .join(', ');
      return {
        latitude: result.latitude,
        longitude: result.longitude,
        name: locationName
      };
    });

    GEOCODING_CACHE[key] = locations;

    return locations;
  } catch (error) {
    console.error('Error in geocoding service:', error);
    throw error;
  }
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  const cacheKey = `${latitude},${longitude}`;

  if (NOMINATIM_CACHE[cacheKey]) {
    return NOMINATIM_CACHE[cacheKey];
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=fr`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RainCheckApp/1.0'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to reverse geocode');
    }

    const data = await response.json();

    let locationName = '';

    if (data.address) {
      locationName =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.suburb ||
        data.display_name.split(',')[0];
    }

    const finalName = locationName || 'votre position';
    NOMINATIM_CACHE[cacheKey] = finalName;

    return finalName;
  } catch (error) {
    console.error('Error in geocoding service:', error);
    return 'votre position';
  }
};
