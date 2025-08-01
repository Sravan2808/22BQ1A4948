import React from 'react';
import ShortenForm from './components/ShortenForm';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <ShortenForm />
    </div>
  );
};

export default App;
