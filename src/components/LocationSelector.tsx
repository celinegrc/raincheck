import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Locate } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { reverseGeocode, geocodeLocation } from '../services/geocodingService';
import { Button } from './ui/Button';

interface LocationSelectorProps {
  onComplete: () => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({ onComplete }) => {
  const { setLocation, setLocationName } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [manualLocation, setManualLocation] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Array<{ latitude: number; longitude: number; name: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  // Debounce pour limiter les appels API pendant la saisie
  useEffect(() => {
    if (manualLocation.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await geocodeLocation(manualLocation);
        setSuggestions(results);
        setShowSuggestions(true);
        setError(null);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [manualLocation]);

  // Gestion clavier (flèches + entrée)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        selectSuggestion(suggestions[highlightIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: { latitude: number; longitude: number; name: string }) => {
    setManualLocation(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightIndex(-1);
    setLocation({ latitude: suggestion.latitude, longitude: suggestion.longitude });
    setLocationName(suggestion.name);
    onComplete();
  };

  const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "L'accès à la localisation a été refusé. Pour utiliser cette fonctionnalité, autorise l'accès à ta position dans les paramètres de ton navigateur.";
      case error.POSITION_UNAVAILABLE:
        return "Impossible d'obtenir ta position. Vérifie que la localisation est activée sur ton appareil ou essaie d'entrer ta position manuellement.";
      case error.TIMEOUT:
        return "La demande de localisation a expiré. Vérifie ta connexion internet et réessaie.";
      default:
        return "Une erreur est survenue lors de la détection de ta position. Essaie d'entrer ta position manuellement.";
    }
  };

  const detectLocation = async () => {
    setLoading(true);
    setError(null);

    if (!('geolocation' in navigator)) {
      setError("Ton navigateur ne supporte pas la géolocalisation. Essaie d'entrer ta position manuellement.");
      setLoading(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error: GeolocationPositionError) => reject(error),
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });

      try {
        const placeName = await reverseGeocode(latitude, longitude);
        setLocationName(placeName);
        onComplete();
      } catch (geocodeError) {
        console.error('Error during reverse geocoding:', geocodeError);
        setError("Position détectée, mais impossible de déterminer le nom de l'endroit. Tu peux essayer d'entrer ta position manuellement.");
      }
    } catch (err) {
      console.error('Geolocation error:', err);
      if (err instanceof GeolocationPositionError) {
        setError(getGeolocationErrorMessage(err));
      } else {
        setError("Une erreur inattendue est survenue. Essaie d'entrer ta position manuellement.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualLocation.trim()) return;

    // Chercher dans les suggestions la ville exacte
    const match = suggestions.find(s => s.name.toLowerCase() === manualLocation.toLowerCase());
    if (match) {
      selectSuggestion(match);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await geocodeLocation(manualLocation);
      if (results.length === 1) {
        selectSuggestion(results[0]);
      } else if (results.length > 1) {
        setSuggestions(results);
        setShowSuggestions(true);
        setLoading(false);
        setError("Plusieurs résultats trouvés, choisis dans la liste ci-dessous.");
      } else {
        setError("Impossible de trouver cet endroit. Vérifie l'orthographe ou essaie un autre lieu proche.");
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      setError("Impossible de trouver cet endroit. Vérifie l'orthographe ou essaie un autre lieu proche.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn relative" style={{ maxWidth: 400, margin: 'auto' }}>
      <h2 className="text-2xl font-bold mb-6 text-center">Où es-tu? 📍</h2>

      <div className="space-y-6">
        <Button
          onClick={detectLocation}
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 text-lg"
        >
          <Locate className={loading ? 'animate-spin' : 'animate-pulse'} size={20} />
          {loading ? 'Détection en cours...' : 'Utiliser ma position actuelle'}
        </Button>

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-white/30"></div>
          <span className="px-3 text-white/70">ou</span>
          <div className="flex-grow h-px bg-white/30"></div>
        </div>

        <form onSubmit={handleManualSubmit} autoComplete="off">
          <div className="mb-4 relative">
            <label htmlFor="location" className="block mb-2 font-medium">
              Entre ta ville ou ton quartier:
            </label>
            <div className="flex">
              <div className="bg-white/20 rounded-l-lg px-3 flex items-center">
                <MapPin size={20} />
              </div>
              <input
                type="text"
                id="location"
                placeholder="ex: Paris, Bordeaux, Lyon..."
                className="flex-1 rounded-r-lg bg-white/30 border-0 p-3 text-lg focus:ring-2 focus:ring-yellow-300 focus:bg-white/50 outline-none transition-all"
                value={manualLocation}
                onChange={(e) => {
                  setManualLocation(e.target.value);
                  setError(null);
                  setShowSuggestions(true);
                }}
                onKeyDown={handleKeyDown}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // délai pour click sur suggestion
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              />
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <ul
                ref={suggestionsRef}
                className="absolute z-10 bg-white text-black w-full rounded-b-lg max-h-60 overflow-y-auto border border-gray-300"
              >
                {suggestions.map((s, idx) => (
                  <li
                    key={`${s.name}-${idx}`}
                    className={`cursor-pointer px-4 py-2 hover:bg-yellow-300 ${
                      highlightIndex === idx ? 'bg-yellow-300 font-semibold' : ''
                    }`}
                    onMouseDown={() => selectSuggestion(s)} // use onMouseDown pour éviter blur avant click
                    onMouseEnter={() => setHighlightIndex(idx)}
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || !manualLocation.trim()}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Continuer
          </Button>
        </form>

        {error && (
          <div className="bg-red-500/20 text-red-100 p-4 rounded-lg mt-4 animate-fadeIn">
            <p className="font-medium mb-1">⚠️ Erreur de localisation</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};
