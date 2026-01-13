import React from 'react';
import { Link } from 'react-router-dom';
import formatDate from '../utils/formatDate';
import getMovieTypes from '../utils/getMovieTypes';

const RecommendedMovieCard = ({ movie, hallNumber }) => {
  const movieTypes = getMovieTypes(movie.id);
  
  return (
    <Link to={`/movie/${movie.id}`} className='block'>
      <div className='bg-white shadow-md rounded-lg overflow-hidden flex hover:shadow-lg transition-shadow'>
        <div className='relative w-1/2 h-72'>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className='w-full h-full object-cover' 
          />
        </div>
        <div className='p-2 flex-1 flex flex-col justify-between'>
          <div>
            <h3 className='text-[14px] font-semibold text-left'>{movie.title}</h3>
            <div className='flex flex-wrap gap-1 mt-1'>
              {movieTypes.map((type) => (
                <span
                  key={type}
                  className='text-[10px] bg-blue-500 text-white px-1 py-0.5 rounded'
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
          <div className='text-left text-xs'> 
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
            <div className='mt-1'>
              <span className='text-red-500 text-[11px] font-semibold'>Select showtime</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecommendedMovieCard;
