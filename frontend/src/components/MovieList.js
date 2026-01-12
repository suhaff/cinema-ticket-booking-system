import React, { useEffect, useState } from 'react';
import FetchMoviesByGenre from '../API/FetchMoviesByGenre';
import FetchMoviesBySearch from '../API/FetchMoviesBySearch';
import { isLoggedIn } from '../utils/Auth';
import Genres from './Genre';
import MovieCard from './MovieCard';
import RecommendedMovies from './RecommendedMovies';
import SpokenLanguageFilter from './SpokenLanguageFilter';

const MovieList = ({ searchText }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const userLoggedIn = isLoggedIn();

  const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN || '';

  useEffect(() => {
    const fetchMoviesBySearch = async () => {
      if (searchText) {
        const response = await FetchMoviesBySearch(
          ACCESS_TOKEN,
          page,
          searchText,
        );
        if (response) {
          const { filteredMovies, totalPages } = response;
          setMovies(filteredMovies);
          setTotalPages(totalPages);
        }
      }
    };

    const fetchMoviesByGenre = async () => {
      if (!searchText) {
        const genreIds = selectedGenres.map((g) => g.id);
        const response = await FetchMoviesByGenre(ACCESS_TOKEN, page, genreIds);
        if (response) {
          const { filteredMovies, totalPages } = response;
          setMovies(filteredMovies);
          setTotalPages(totalPages);
        }
      }
    };

    fetchMoviesBySearch();
    fetchMoviesByGenre();
  }, [page, selectedGenres, searchText, ACCESS_TOKEN]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Filter movies based on cast and language selections
  const filteredMovies = movies.filter((movie) => {
    // Cast filter (for now, we'll just show all movies as cast filtering requires additional API calls)
    // In a production app, you would fetch cast data and compare

    // Language filter
    if (selectedLanguages.length > 0) {
      const movieLanguageCodes = (movie.original_language || '').toLowerCase();
      const matchesLanguage = selectedLanguages.some(
        (lang) => lang.code === movieLanguageCodes,
      );
      if (!matchesLanguage) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className='container mx-auto px-4 py-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        <Genres onGenreSelect={setSelectedGenres} />
        <SpokenLanguageFilter onLanguageSelect={setSelectedLanguages} />
      </div>

      {userLoggedIn && (
        <div>
          <RecommendedMovies />
        </div>
      )}

      <h1 className='text-left font-bold mb-4'>All Movies</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {filteredMovies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} hallNumber={index} />
        ))}
      </div>
      {filteredMovies.length === 0 && movies.length > 0 && (
        <div className='text-center py-8'>
          <p className='text-gray-500'>
            No movies match your selected filters.
          </p>
        </div>
      )}
      <div className='flex justify-center mt-4'>
        <button
          onClick={handlePrevPage}
          className={`bg-red-500 hover:bg-red-700 text-white rounded px-3 py-1 text-sm font-semibold mx-2 my-2 cursor-pointer ${
            page === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className={`bg-red-500 hover:bg-red-700 text-white rounded px-3 py-1 text-sm font-semibold mx-2 my-2 cursor-pointer ${
            page === totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MovieList;
