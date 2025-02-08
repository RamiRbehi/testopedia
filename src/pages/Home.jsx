import { useContext } from 'react';
import { Link } from 'react-router-dom';
import LanguageContext from '../contexts/LanguageContext';

const translations = {
  en: {
    title: "Welcome to Testopedia",
    button: "Start Learning",
  },
  fr: {
    title: "Bienvenue aux Testopedia",
    button: "Commencer à Apprendre",
  }
};

function Home() {
  const { language } = useContext(LanguageContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-indigo-900 mb-8">
            {translations[language].title}
          </h1>
          <Link
            to="/flashcards/chapter1"
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-indigo-700 transition-colors duration-300"
          >
            {translations[language].button}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;