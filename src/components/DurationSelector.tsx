import React from 'react';
import { Clock, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { Button } from './ui/Button';
import { ActivityIcon } from './icons/ActivityIcon';

interface DurationSelectorProps {
  onComplete: () => void;
  onBack: () => void;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({ onComplete, onBack }) => {
  const { duration, setDuration, locationName } = useAppContext();
  const durations = [10, 20, 30, 45, 60];
  
  const handleContinue = () => {
    onComplete();
  };
  
  return (
    <div className="animate-fadeIn">
      <Button 
        onClick={onBack}
        className="mb-4 bg-transparent hover:bg-white/10 text-white flex items-center gap-1"
      >
        <ArrowLeft size={16} />
        Retour
      </Button>
      
      <h2 className="text-2xl font-bold mb-2 text-center">Combien de temps?</h2>
      <p className="text-center mb-6 text-blue-100">
        À {locationName}, tu prévois de sortir pendant...
      </p>
      
      <div className="mb-8 grid grid-cols-3 gap-3">
        {durations.map((mins) => (
          <button
            key={mins}
            onClick={() => setDuration(mins)}
            className={`
              relative p-4 rounded-xl transition-all duration-200 flex flex-col items-center
              ${duration === mins 
                ? 'bg-yellow-400 text-blue-900 shadow-lg scale-105 font-bold' 
                : 'bg-white/20 hover:bg-white/30'
              }
            `}
          >
            <span className="text-xl">{mins}</span>
            <span className="text-sm">min</span>
            {duration === mins && (
              <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">
                ✓
              </div>
            )}
          </button>
        ))}
      </div>
      
      <div className="flex justify-center mb-6">
        <ActivityIcon activity="bike" size={150} />
      </div>
      
      <div className="flex items-center justify-center gap-4 mb-4">
        <Clock size={24} className="text-yellow-300" />
        <div className="text-xl font-semibold">
          {duration} minutes
        </div>
      </div>
      
      <Button
        onClick={handleContinue}
        className="w-full py-4 bg-green-500 hover:bg-green-600 text-white text-lg"
      >
        Vérifier la météo
      </Button>
    </div>
  );
};