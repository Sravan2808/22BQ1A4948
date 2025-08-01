import React, { useState } from 'react';
import ShortenForm from './components/ShortenForm';
import UrlStats from './components/UrlStats';
import { Link, BarChart3 } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shorten' | 'stats'>('shorten');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
      
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('shorten')}
              className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all ${
                activeTab === 'shorten'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Link className="w-4 h-4" />
              Shorten URL
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all ${
                activeTab === 'stats'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Statistics
            </button>
          </div>
        </div>

        
        <div className="flex justify-center">
          {activeTab === 'shorten' ? <ShortenForm /> : <UrlStats />}
        </div>

        
        <div className="text-center mt-12 text-gray-600">
          <p className="text-sm">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;