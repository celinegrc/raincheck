import React, { ReactNode } from 'react';
import { CloudSun } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-blue-500 font-sans text-white">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <header className="text-center mb-6 pt-4">
          <div className="flex items-center justify-center mb-3">
            <CloudSun size={40} className="text-yellow-300 mr-2" strokeWidth={2.5} />
            <h1 className="text-3xl font-bold tracking-tight">
              Est-ce que j'ai le temps avant la pluie?
            </h1>
          </div>
          <p className="text-blue-100 text-lg">
            Sors tranquille, ou prends ton parapluie! 🌂
          </p>
        </header>
        
        <main className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
          {children}
        </main>
        
        <footer className="text-center text-blue-100 text-sm">
          <div className="h-16 bg-white/30 backdrop-blur-sm rounded-lg mb-4 flex items-center justify-center">
            <p>Espace réservé pour les publicités</p>
          </div>
          <p>© 2025 Météo Fun • Une app pour toute la famille</p>
        </footer>
      </div>
    </div>
  );
};