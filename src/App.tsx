import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { LocationSelector } from './components/LocationSelector';
import { DurationSelector } from './components/DurationSelector';
import { WeatherResult } from './components/WeatherResult';
import { AppProvider } from './contexts/AppContext';

const App: React.FC = () => {
  const [step, setStep] = useState<'location' | 'duration' | 'result'>('location');
  
  return (
    <AppProvider>
      <Layout>
        {step === 'location' && <LocationSelector onComplete={() => setStep('duration')} />}
        {step === 'duration' && <DurationSelector onComplete={() => setStep('result')} onBack={() => setStep('location')} />}
        {step === 'result' && <WeatherResult onRestart={() => setStep('location')} />}
      </Layout>
    </AppProvider>
  );
};

export default App;