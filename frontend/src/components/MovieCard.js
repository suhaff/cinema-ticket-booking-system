import React from 'react';
import { Link } from 'react-router-dom';
import formatDate from '../utils/formatDate';
import getMovieTypes from '../utils/getMovieTypes';

const MovieCard = ({ movie, hallNumber }) => {
  const movieTypes = getMovieTypes(movie.id);
  
  return (
    <Link to={`/movie/${movie.id}`} className='block'>
      <div className='bg-white shadow-md rounded-lg overflow-hidden flex h-96 hover:shadow-lg transition-shadow'>
        <div className='relative w-1/2'>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className='w-full h-full object-cover'
          />
        </div>
        <div className='p-4 flex-1 flex flex-col justify-between'>
          <div>
            <h3 className='text-2xl font-semibold text-left'>{movie.title}</h3>
            <div className='flex flex-wrap gap-1 mt-2'>
              {movieTypes.map((type) => (
                <span
                  key={type}
                  className='text-xs bg-blue-500 text-white px-2 py-1 rounded'
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
          <div className='text-left text-sm'>
            <div>
              <span className='text-gray-500'>
                Release Date: {formatDate(movie.release_date)}
              </span>
            </div>
            <div>
              <span className='text-gray-500'>
                Rating: {movie.vote_average.toFixed(1)}
              </span>
            </div>
            <div className='mt-2'>
              <span className='text-red-500 font-semibold'>Click to select showtime</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
