import React from 'react';
import { Cloud, CloudRain, Sun } from 'lucide-react';

interface WeatherAnimationProps {
  type: 'safe' | 'possible' | 'rain';
}

export const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ type }) => {
  if (type === 'safe') {
    return (
      <div className="relative h-40 w-40">
        <div className="absolute inset-0 flex items-center justify-center animate-bounce-slow">
          <Sun size={100} className="text-yellow-300" />
        </div>
      </div>
    );
  }
  
  if (type === 'possible') {
    return (
      <div className="relative h-40 w-40">
        <div className="absolute inset-0 flex items-center justify-center">
          <Sun size={80} className="text-yellow-300 absolute" />
          <div className="absolute right-0 top-10 animate-float">
            <Cloud size={60} className="text-gray-200" />
          </div>
        </div>
      </div>
    );
  }
  
  if (type === 'rain') {
    return (
      <div className="relative h-40 w-40">
        <div className="absolute inset-0 flex items-center justify-center animate-float">
          <CloudRain size={100} className="text-gray-200" />
          <div className="absolute bottom-0 left-10 animate-rain">
            <div className="h-2 w-1 bg-blue-400 rounded mb-1"></div>
            <div className="h-2 w-1 bg-blue-400 rounded mb-1"></div>
            <div className="h-2 w-1 bg-blue-400 rounded"></div>
          </div>
          <div className="absolute bottom-0 left-16 animate-rain animation-delay-200">
            <div className="h-2 w-1 bg-blue-400 rounded mb-1"></div>
            <div className="h-2 w-1 bg-blue-400 rounded mb-1"></div>
            <div className="h-2 w-1 bg-blue-400 rounded"></div>
          </div>
          <div className="absolute bottom-0 left-22 animate-rain animation-delay-400">
            <div className="h-2 w-1 bg-blue-400 rounded mb-1"></div>
            <div className="h-2 w-1 bg-blue-400 rounded mb-1"></div>
            <div className="h-2 w-1 bg-blue-400 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};