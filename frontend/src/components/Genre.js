import React, { useEffect, useState } from 'react';
import FetchGenres from '../API/GetGenres';
import removeNonCinemaGenres from '../utils/removeNonCinemaGenres';

const Genres = ({ onGenreSelect }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN || '';

  useEffect(() => {
    const fetchData = async () => {
      const fetchedGenres = await FetchGenres(ACCESS_TOKEN);
      const filteredGenres = removeNonCinemaGenres(fetchedGenres);
      setGenres(filteredGenres);
    };

    fetchData();
  }, [ACCESS_TOKEN]);

  useEffect(() => {
    onGenreSelect(selectedGenres);
  }, [selectedGenres, onGenreSelect]);

  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) =>
      prev.some((g) => g.id === genre.id)
        ? prev.filter((g) => g.id !== genre.id)
        : [...prev, genre],
    );
  };

  const handleRemoveGenre = (genre) => {
    setSelectedGenres((prev) => prev.filter((g) => g.id !== genre.id));
  };

  const genreEmojis = {
    28: '💥', // Action
    12: '🏞️', // Adventure
    16: '📽️', // Animation
    35: '😂', // Comedy
    10751: '❤️', // Family
    14: '🧙‍♂️', // Fantasy
    9648: '🔍', // Mystery
    878: '🤖', // Science Fiction
    18: '🎭', // Drama
    27: '👻', // Horror
    53: '😱', // Thriller
    10402: '🎵', // Music
    36: '📜', // History
    10752: '⚔️', // War
    10749: '💑', // Romance
    80: '🔫', // Crime
  };

  return (
    <div className='mb-4'>
      <div className='relative inline-block w-full'>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className='w-full bg-red-500 hover:bg-red-700 text-white rounded px-3 py-2 text-sm font-semibold'
        >
          Filter by Genre {selectedGenres.length > 0 && `(${selectedGenres.length})`}
        </button>
        {showDropdown && (
          <div className='absolute top-full left-0 right-0 bg-white border border-gray-300 rounded mt-1 shadow-lg z-10 max-h-64 overflow-y-auto'>
            {genres.map((genre) => (
              <label
                key={genre.id}
                className='flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer'
              >
                <input
                  type='checkbox'
                  checked={selectedGenres.some((g) => g.id === genre.id)}
                  onChange={() => handleGenreToggle(genre)}
                  className='mr-2'
                />
                <span className='text-sm'>
                  {genreEmojis[genre.id]} {genre.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
      {selectedGenres.length > 0 && (
        <div className='mt-3 flex flex-wrap gap-2'>
          {selectedGenres.map((genre) => (
            <div
              key={genre.id}
              className='bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center gap-2'
            >
              {genreEmojis[genre.id]} {genre.name}
              <button
                onClick={() => handleRemoveGenre(genre)}
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

export default Genres;
