import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface AppContextType {
  location: Coordinates | null;
  setLocation: (location: Coordinates | null) => void;
  locationName: string;
  setLocationName: (name: string) => void;
  duration: number;
  setDuration: (minutes: number) => void;
  temperature: number | null;
  setTemperature: (temp: number | null) => void;
  rainPrediction: 'safe' | 'possible' | 'rain' | null;
  setRainPrediction: (prediction: 'safe' | 'possible' | 'rain' | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [duration, setDuration] = useState<number>(30);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [rainPrediction, setRainPrediction] = useState<'safe' | 'possible' | 'rain' | null>(null);

  return (
    <AppContext.Provider
      value={{
        location,
        setLocation,
        locationName,
        setLocationName,
        duration,
        setDuration,
        temperature,
        setTemperature,
        rainPrediction,
        setRainPrediction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};