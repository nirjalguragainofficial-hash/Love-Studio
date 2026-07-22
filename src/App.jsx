import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Onboarding from './pages/Onboarding';
import Chat from './pages/Chat';
import Journal from './pages/Journal';

function App() {
  const [companionData, setCompanionData] = useState(() => {
    const saved = localStorage.getItem('loveStudio_companion');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (companionData) {
      localStorage.setItem('loveStudio_companion', JSON.stringify(companionData));
    }
  }, [companionData]);

  return (
    <Router>
      <div className="app-wrapper">
        <Routes>
          <Route 
            path="/onboarding" 
            element={<Onboarding setCompanionData={setCompanionData} />} 
          />
          <Route 
            path="/chat" 
            element={companionData ? <Chat companionData={companionData} /> : <Navigate to="/onboarding" />} 
          />
          <Route 
            path="/journal" 
            element={companionData ? <Journal companionData={companionData} /> : <Navigate to="/onboarding" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={companionData ? "/chat" : "/onboarding"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
