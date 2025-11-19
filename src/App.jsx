import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainApp from './App_Neon';
import ViewerScreen from './screens/ViewerScreen';
import HostScreen from './screens/HostScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/viewer" element={<ViewerScreen />} />
        <Route path="/host" element={<HostScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
