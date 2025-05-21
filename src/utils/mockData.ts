// This file provides mock weather data when the API call fails
// It ensures the app can always display something

export const simulateWeatherData = (
  lat: number,
  lon: number,
  durationMinutes: number
) => {
  // Generate a semi-random weather pattern based on coordinates
  // (for demo purposes only)
  const latSeed = Math.abs(Math.sin(lat));
  const lonSeed = Math.abs(Math.cos(lon));
  const randomSeed = (latSeed + lonSeed) / 2;
  
  // Current temperature between 10 and 25°C
  const currentTemp = Math.round(10 + (randomSeed * 15));
  
  // Rain probability increases with longer durations
  const durationFactor = durationMinutes / 60; // 0 to 1 scale
  const rainProbability = randomSeed * 100 * (1 + durationFactor);
  
  let willRain: 'low' | 'medium' | 'high';
  
  if (rainProbability < 30) {
    willRain = 'low';
  } else if (rainProbability < 60) {
    willRain = 'medium';
  } else {
    willRain = 'high';
  }
  
  return { willRain, currentTemp };
};