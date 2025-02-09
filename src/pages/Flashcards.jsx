import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, LightBulbIcon } from '@heroicons/react/24/solid';
import Header from '../components/Header';
import { flashcardsData } from '../data';
import LanguageContext from '../contexts/LanguageContext';

function Flashcards() {
  const { chapter } = useParams();
  const { language } = useContext(LanguageContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [dragStartX, setDragStartX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);


  const translations = {
    en: {
      clickToFlip: "Click to flip the card (or press Enter)",
      // shuffleOn: "Shuffle mode is on",
      shuffleOff: "Turn shuffle off",
      shuffle: "Shuffle",
      hint: "Hint",
      hideHint: "Hide hint",
      hintContinue: "...",
      swipeHint: "Swipe left or right to change cards"
    },
    fr: {
      clickToFlip: "Cliquez pour retourner la carte (ou appuyez sur Entrée)",
      // shuffleOn: "Mode mélange activé",
      shuffleOff: "Désactiver le mélange",
      shuffle: "Mélanger",
      hint: "Indice",
      hideHint: "Masquer l'indice",
      hintContinue: "...",
      swipeHint: "Glissez à gauche ou à droite pour changer de carte"
    }
  };

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the standard md breakpoint
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const chapterData = flashcardsData[chapter] || [];
    setCards(chapterData);
    setOriginalOrder(chapterData);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsShuffled(false);
  }, [chapter]);

    // Add keyboard navigation
    useEffect(() => {
      if (!isMobile) {
      const handleKeyPress = (e) => {
        switch (e.key) {
          case 'ArrowLeft':
            handlePrevious();
            break;
          case 'ArrowRight':
            handleNext();
            break;
          case 'Enter':
            setIsFlipped(prev => !prev);
            break;
          default:
            break;
        }
      };
  
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
    }, [cards.length, isMobile]); // Only re-add listener when cards array changes

  const getFirstFiveWords = (text) => {
    const words = text.split(' ');
    return words.slice(0, 5).join(' ') + (words.length > 5 ? ' ' + translations[language].hintContinue : '');
  };

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    if (isShuffled) {
      // Return to original order
      setCards(originalOrder);
      setIsShuffled(false);
    } else {
      // Shuffle cards
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setIsShuffled(true);
    }
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex(0);
  };

  const handleDragStart = (event, info) => {
    if (isMobile) {
     setDragStartX(info.point.x);
    }
  };

  const handleDragEnd = (event, info) => {
    if (isMobile) {
      const dragEndX = info.point.x;
      const dragDistance = dragEndX - dragStartX;
      const minSwipeDistance = 50; // I set the minimum distance for a swipe
      
      if (Math.abs(dragDistance) >= minSwipeDistance) {
        if (dragDistance > 0) {
          handlePrevious();
        } else {
          handleNext();
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* {isShuffled && (
            <div className="text-center mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {translations[language].shuffleOn}
              </span>
            </div>
          )} */}

          <motion.div
            className={`flip-card w-full h-[70vh] lg:h-96 mb-8 ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            dragElastic={0.2}
          >
            <motion.div
              className="flip-card-inner"
              initial={false}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flip-card-front bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHint(!showHint);
                  }}
                  className="absolute left-4 top-4 p-2 rounded-full bg-yellow-700 text-white hover:bg-yellow-400 transition-colors"
                  title={translations[language].hint}
                >
                  <LightBulbIcon className="h-5 w-5" />
                </button>

                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-12 top-4 bg-yellow-50 ml-5 p-2 rounded-lg w-fit max-w-sm "
                    >
                      <p className="text-sm text-gray-700">
                        {getFirstFiveWords(cards[currentIndex]?.back[language] || '')}
                      </p>
                    </motion.div>
                  )}      
                </AnimatePresence>
                
                <h2 className="text-2xl font-bold text-center mt-auto">
                     {cards[currentIndex]?.front[language]}
                   </h2>

                {!isMobile && (
                  <p className="text-sm text-gray-500 text-black bg-sky-100 rounded-lg w-fit max-w-sm mt-auto">
                  {translations[language].clickToFlip}
                </p>
                )}
                {isMobile &&(
                  <p className='text-xs text-gray-500 bg-sky-100 rounded-lg w-fit max-w-sm mt-auto'>
                    {translations[language].swipeHint}
                  </p>
                )}
              </div>

              <div className="flip-card-back bg-indigo-600 text-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center w-fit">
                <p className="xl:text-xl sm:text-sm text-center mt-auto">
                  {cards[currentIndex]?.back[language]}
                </p>

                {!isMobile && (
                  <p className="text-sm text-gray-500 bg-sky-100 rounded-lg w-fit max-w-sm opacity-75 mt-auto">
                  {translations[language].clickToFlip}
                </p>
                )}

                {isMobile && (
                  <p className='text-xs opacity-50 text-gray-500 bg-sky-100 rounded-lg w-fit max-w-sm mt-auto'>
                    {translations[language].swipeHint}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>

          {!isMobile && (
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            
            <button
              onClick={handleShuffle}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${
                isShuffled ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
              }`}
              title={isShuffled ? translations[language].shuffleOff : translations[language].shuffle}
            >
              {isShuffled ? translations[language].shuffleOff : translations[language].shuffle}
            </button>

            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>
          )}
        </div>
      </div>
      <div className="mt-auto text-center text-white text-sm tracking-wide" style={{ color: 'rgba(0,0,0,1)' }}>
        Project by Rami Ben Taieb © {new Date().getFullYear()}
      </div>
    </div>
  );
}

export default Flashcards;