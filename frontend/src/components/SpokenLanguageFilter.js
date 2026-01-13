import React, { useEffect, useState } from 'react';

const SpokenLanguageFilter = ({ onLanguageSelect }) => {
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ko', name: 'Korean' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ar', name: 'Arabic' },
  ];

  useEffect(() => {
    onLanguageSelect(selectedLanguages);
  }, [selectedLanguages, onLanguageSelect]);

  const handleLanguageToggle = (language) => {
    setSelectedLanguages((prev) =>
      prev.some((l) => l.code === language.code)
        ? prev.filter((l) => l.code !== language.code)
        : [...prev, language],
    );
  };

  const handleRemoveLanguage = (language) => {
    setSelectedLanguages((prev) => prev.filter((l) => l.code !== language.code));
  };

  return (
    <div className='mb-4'>
      <div className='relative inline-block w-full'>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className='w-full bg-purple-500 hover:bg-purple-700 text-white rounded px-3 py-2 text-sm font-semibold'
        >
          Filter by Language {selectedLanguages.length > 0 && `(${selectedLanguages.length})`}
        </button>
        {showDropdown && (
          <div className='absolute top-full left-0 right-0 bg-white border border-gray-300 rounded mt-1 shadow-lg z-10 max-h-64 overflow-y-auto'>
            {languages.map((language) => (
              <label
                key={language.code}
                className='flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer'
              >
                <input
                  type='checkbox'
                  checked={selectedLanguages.some((l) => l.code === language.code)}
                  onChange={() => handleLanguageToggle(language)}
                  className='mr-2'
                />
                <span className='text-sm'>{language.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {selectedLanguages.length > 0 && (
        <div className='mt-3 flex flex-wrap gap-2'>
          {selectedLanguages.map((language) => (
            <div
              key={language.code}
              className='bg-purple-500 text-white px-3 py-1 rounded text-sm flex items-center gap-2'
            >
              {language.name}
              <button
                onClick={() => handleRemoveLanguage(language)}
                className='ml-1 hover:font-bold'
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpokenLanguageFilter;
