import { Fragment, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import LanguageContext from '../contexts/LanguageContext';

const translations = {
  en: {
    chapters: "Chapters",
    chapter: "Chapter",
    language: "Language",
  },
  fr: {
    chapters: "Chapitres",
    chapter: "Chapitre",
    language: "Langue",
  }
};

function Header() {
  const { language, setLanguage } = useContext(LanguageContext);
  const { chapter } = useParams();
  
  const currentChapter = chapter ? chapter.replace('chapter', '') : '';

  const chapters = [1, 2, 3, 4, 5, 6].map((num) => ({
    name: `${translations[language].chapter} ${num}`,
    href: `/flashcards/chapter${num}`,
  }));

  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
          Testopedia
          </Link>

          <div className="flex items-center gap-4">
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-3 px-4 py-2 text-indigo-600 hover:text-indigo-900">
                {currentChapter 
                  ? `${translations[language].chapter} ${currentChapter}`
                  : translations[language].chapters}
                <ChevronDownIcon className="h-5 w-5" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                  {chapters.map((chapter) => (
                    <Menu.Item key={chapter.href}>
                      {({ active }) => (
                        <Link
                          to={chapter.href}
                          className={`${
                            active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                          } block px-4 py-2`}
                        >
                          {chapter.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>

            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-900"
            >
              {language === 'en' ? 'FR' : 'EN'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header