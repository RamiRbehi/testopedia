import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Flashcards from './pages/Flashcards';
import LanguageContext from './contexts/LanguageContext';

function App() {
  const [language, setLanguage] = useState('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flashcards/:chapter" element={<Flashcards />} />
        </Routes>
      </Router>
        {/* <div className="mt-auto py-2 text-center text-white text-sm tracking-wide" style={{ color: 'rgba(0,0,0,1)' }}>
        Project by Rami Ben Taieb © {new Date().getFullYear()}
      </div> */}
    </LanguageContext.Provider>
  );
}

export default App;