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
        <div className="absolute bottom-1 left-5 right-5 flex justify-center items-center text-white text-sm tracking-wide" style={{ color: 'rgba(0,0,0,01)' }}>
        Project by Rami Ben Taieb © {new Date().getFullYear()}
      </div>
      </Router>
    </LanguageContext.Provider>
  );
}

export default App;