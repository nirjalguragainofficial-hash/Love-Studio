import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Onboarding from './pages/Onboarding';
import Chat from './pages/Chat';
import Journal from './pages/Journal';

function App() {
  // Persist companion data in localStorage so it survives page refreshes
  const [companionData, setCompanionData] = useState(() => {
    const saved = localStorage.getItem('loveStudio_companion');
    return saved ? JSON.parse(saved) : null;
  });

  // Synchronize companion data to local storage on changes
  useEffect(() => {
    if (companionData) {
      localStorage.setItem('loveStudio_companion', JSON.stringify(companionData));
    } else {
      localStorage.removeItem('loveStudio_companion');
    }
  }, [companionData]);

  return (
    <Router>
      <div className="app-wrapper">
        <Routes>
          {/* Onboarding: shown when no companion is set up */}
          <Route 
            path="/onboarding" 
            element={<Onboarding setCompanionData={setCompanionData} />} 
          />
          {/* Chat: main screen, redirects to onboarding if companion not configured */}
          <Route 
            path="/chat" 
            element={companionData ? <Chat companionData={companionData} setCompanionData={setCompanionData} /> : <Navigate to="/onboarding" />} 
          />
          {/* Journal: private notes, also guarded by companion setup */}
          <Route 
            path="/journal" 
            element={companionData ? <Journal companionData={companionData} /> : <Navigate to="/onboarding" />} 
          />
          {/* Root: redirect to chat or onboarding depending on setup state */}
          <Route 
            path="/" 
            element={<Navigate to={companionData ? "/chat" : "/onboarding"} />} 
          />
          {/* Catch-all 404 route */}
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
