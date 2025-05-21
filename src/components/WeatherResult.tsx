import React, { useEffect, useState } from 'react';
import { RefreshCw, ThermometerSun, MapPin } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { getWeatherForecast } from '../services/weatherService';
import { Button } from './ui/Button';
import { WeatherAnimation } from './animations/WeatherAnimation';

interface WeatherResultProps {
  onRestart: () => void;
}

export const WeatherResult: React.FC<WeatherResultProps> = ({ onRestart }) => {
  const { 
    location, 
    locationName, 
    duration, 
    setTemperature, 
    temperature,
    rainPrediction, 
    setRainPrediction 
  } = useAppContext();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    const fetchWeather = async () => {
      if (!location) {
        setError("Position non disponible. Veuillez réessayer.");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const { willRain, currentTemp } = await getWeatherForecast(
          location.latitude,
          location.longitude,
          duration
        );
        
        setTemperature(currentTemp);
        
        if (willRain === 'high') {
          setRainPrediction('rain');
        } else if (willRain === 'medium') {
          setRainPrediction('possible');
        } else {
          setRainPrediction('safe');
        }
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError("Impossible de récupérer les prévisions météo.");
        
        // Retry up to 3 times with exponential backoff
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            fetchWeather();
          }, Math.pow(2, retryCount) * 1000);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
  }, [location, duration, setRainPrediction, setTemperature, retryCount]);
  
  const getResultContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin mb-4 mx-auto">
            <RefreshCw size={40} />
          </div>
          <p>Analyse des nuages en cours...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-400/20 p-4 rounded-lg text-center">
          <p>{error}</p>
          <Button onClick={onRestart} className="mt-4 bg-blue-500">
            Recommencer
          </Button>
        </div>
      );
    }
    
    if (!rainPrediction) return null;
    
    const results = {
      safe: {
        title: "Tu peux y aller tranquille! 😎",
        description: "Pas de pluie prévue pour les prochaines minutes.",
        color: "bg-green-500",
        textColor: "text-green-900"
      },
      possible: {
        title: "Tu risques quelques gouttes... 💧",
        description: "Il pourrait y avoir un peu de pluie. Prends peut-être un petit parapluie?",
        color: "bg-yellow-400",
        textColor: "text-yellow-900"
      },
      rain: {
        title: "Mauvaise idée... ça va mouiller! 🌧️",
        description: "De la pluie est prévue. Mieux vaut reporter ton activité!",
        color: "bg-red-500",
        textColor: "text-red-900"
      }
    };
    
    const result = results[rainPrediction];
    
    return (
      <div className={`rounded-xl p-6 ${result.color} animate-fadeInUp`}>
        <h3 className={`text-2xl font-bold mb-2 ${result.textColor}`}>
          {result.title}
        </h3>
        <p className={`mb-4 ${result.textColor}`}>
          {result.description}
        </p>
        
        <div className="flex justify-center mb-4">
          <WeatherAnimation type={rainPrediction} />
        </div>
        
        {temperature !== null && (
          <div className="flex flex-col gap-2 bg-white/30 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-center gap-2">
              <ThermometerSun size={24} />
              <span className="text-xl font-bold">{temperature}°C</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <MapPin size={16} />
              <span>{locationName}</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-3 mt-6">
          <Button onClick={onRestart} className="bg-white text-blue-800 hover:bg-blue-100">
            Recommencer
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {loading ? 'Vérification...' : 'Résultat'}
      </h2>
      
      {getResultContent()}
    </div>
  );
};