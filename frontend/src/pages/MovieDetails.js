import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FetchMovieDetails from '../API/GetMovieDetails';
import MovieSessions from '../mockData/MovieSessions';
import SeatPlan from '../components/SeatPlan';
import formatDate from '../utils/formatDate';
import formatRuntime from '../utils/formatRuntime';
import getMovieTypes from '../utils/getMovieTypes';
import getSeatPlan from '../API/GetSeatPlan';

const MovieDetails = ({ user, setUser }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [movieSessions, setMovieSessions] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);


  const API_KEY = process.env.REACT_APP_API_KEY || '';

  useEffect(() => {
    const fetchData = async () => {
      const movieData = await FetchMovieDetails(id, API_KEY);
      setMovie(movieData);
    };

    fetchData();
  }, [id, API_KEY]);

  useEffect(() => {
    if (movie) {
      // Generate sessions for the first hall (hallNumber = 0)
      const sessions = MovieSessions(movie, 0);
      setMovieSessions(sessions);

      // Check if there's a previously selected session in localStorage
      const storedSession = JSON.parse(localStorage.getItem('movieSession'));
      if (storedSession && storedSession.movieId === movie.id) {
        setSelectedSession(storedSession);
      }
    }
  }, [movie]);

  useEffect(() => {
    const fetchAllOccupancy = async () => {
      if (movie) {
        // Generate initial mock sessions
        const initialSessions = MovieSessions(movie, 0);

        // Fetch real occupancy for all sessions in parallel
        const sessionsWithData = await Promise.all(
          initialSessions.map(async (session) => {
            try {
              const occupiedData = await getSeatPlan(movie.id, session);
              const count = occupiedData ? occupiedData.length : 0;
              const percent = (count / 64) * 100;
              return { ...session, occupancy: percent };
            } catch (err) {
              return { ...session, occupancy: 0 };
            }
          })
        );

        setMovieSessions(sessionsWithData);

        // Restore previously selected session if it exists
        const storedSession = JSON.parse(localStorage.getItem('movieSession'));
        if (storedSession && storedSession.movieId === movie.id) {
          setSelectedSession(storedSession);
        }
      }
    };

    fetchAllOccupancy();
  }, [movie]);

  useEffect(() => {
    if (user && user.favorites) {
      const favoritesArray = user.favorites.split(',');
      setIsFavorite(favoritesArray.includes(id.toString()));
    } else {
      setIsFavorite(false);
    }
  }, [id, user]);

  const toggleFavorite = async () => {
    const latestUser = JSON.parse(localStorage.getItem('user'));
    const currentFavs = latestUser?.favorites || "";

    let favArray = currentFavs ? currentFavs.split(',') : [];

    const movieIdStr = id.toString();
    const isAlreadyFav = favArray.includes(movieIdStr);

    if (isAlreadyFav) {
      favArray = favArray.filter(favId => favId !== movieIdStr);
    } else {
      if (!favArray.includes(movieIdStr)) {
        favArray.push(movieIdStr);
      }
    }

    const newFavString = favArray.join(',');

    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...latestUser,
          favorites: newFavString
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();

        // 3. Sync everything back
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('userFavorites', updatedUser.favorites);
        setIsFavorite(!isAlreadyFav);

        alert(isAlreadyFav ? "Removed!" : "Added! ❤️");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSessionSelect = (session) => {
    console.log('Selected session:', session);
    const sessionData = {
      ...session,
      movieId: movie.id,
    };
    setSelectedSession(sessionData);
    localStorage.setItem('movieSession', JSON.stringify(sessionData));
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  const movieTypes = getMovieTypes(movie.id);
  const topCast = movie.credits?.cast?.slice(0, 5) || [];


  return (
    <div>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-5xl mx-auto'>
          <div className='flex flex-wrap justify-center items-start'>
            <div className='w-full md:w-1/2 lg:w-1/3 flex justify-center mb-8 md:mb-0'>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className='w-full h-auto rounded'
              />
            </div>
            <div className='w-full md:w-1/2 lg:w-2/3 px-6 text-left'>
              <h2 className='text-3xl font-semibold'>{movie.title}</h2>
              <div className='flex flex-wrap gap-2 mt-2 mb-4'>
                {movieTypes.map((type) => (
                  <span
                    key={type}
                    className='text-xs bg-blue-500 text-white px-2 py-1 rounded'
                  >
                    {type}
                  </span>
                ))}
              </div>
              <p className='text-gray-800 mt-2 text-justify text-sm md:text-sm lg:text-base'>
                {movie.overview}
              </p>
              <p className='text-gray-800 mt-2 text-sm md:text-sm lg:text-base'>
                <b>Genres:</b>{' '}
                {movie.genres.map((genre) => genre.name).join(', ')}
              </p>
              <p className='text-gray-800 mt-2 text-sm md:text-sm lg:text-base'>
                <b>Tagline:</b> {movie.tagline}
              </p>
              <p className='text-gray-800 mt-1 text-sm md:text-sm lg:text-base'>
                <b>Runtime:</b> {formatRuntime(movie.runtime)}
              </p>
              <p className='text-gray-800 mt-1 text-sm md:text-sm lg:text-base'>
                <b>Rating:</b> {movie.vote_average.toFixed(1)}
              </p>
              <p className='text-gray-800 mt-2 text-sm md:text-sm lg:text-base'>
                <b>Release Date:</b> {formatDate(movie.release_date)}
              </p>
              {topCast.length > 0 && (
                <p className='text-gray-800 mt-2 text-sm md:text-sm lg:text-base'>
                  <b>Cast:</b> {topCast.map((actor) => actor.name).join(', ')}
                </p>
              )}
              <p className='text-gray-800 mt-2 text-sm md:text-sm lg:text-base'>
                <b>Production Companies:</b>{' '}
                {movie.production_companies
                  .map((company) => company.name)
                  .join(', ')}
              </p>
              <p className='text-gray-800 mt-2 text-sm md:text-sm lg:text-base'>
                <b>Production Countries:</b>{' '}
                {movie.production_countries
                  .map((country) => country.name)
                  .join(', ')}
              </p>
              <p className='text-gray-800 mt-2 text-sm md:text-sm lg:text-base'>
                <b>Spoken Languages:</b>{' '}
                {movie.spoken_languages
                  .map((lang) => lang.english_name)
                  .join(', ')}
              </p>
              <p className='text-gray-800 mt-2 text-sm md:text-sm lg:text-base'>
                <b>Budget:</b> ${movie.budget.toLocaleString()}
              </p>
              <p className='text-gray-800 mt-2 text-sm md:text-sm lg:text-base'>
                <b>Revenue:</b> ${movie.revenue.toLocaleString()}
              </p>
              <a
                className='text-blue-500 mt-2 block'
                href={movie.homepage}
                target='_blank'
                rel='noopener noreferrer'
              >
                Visit Homepage
              </a>
              <button
                onClick={toggleFavorite}
                className={`flex items-center mt-4 space-x-2 px-6 py-2 rounded-lg font-bold transition ${isFavorite ? 'bg-red-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                  }`}
              >
                {isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Showtime Selection Grid */}
      <div className='container mx-auto px-4 py-8 bg-gray-50'>
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-2xl font-semibold mb-6 text-center text-gray-800'>
            Select a Showtime
          </h2>

          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
            {movieSessions.map((session, index) => {
              // Real occupancy logic
              const occupancy = session.occupancy || 0;
              const isSelected = selectedSession?.time === session.time;

              // Dynamic status object
              let status = { label: 'Available', color: 'text-green-600', icon: '🎟️' };
              if (occupancy >= 80) {
                status = { label: 'Almost Full', color: 'text-red-600', icon: '🔥' };
              } else if (occupancy >= 40) {
                status = { label: 'Filling Fast', color: 'text-orange-500', icon: '✨' };
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSessionSelect(session)}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center relative overflow-hidden group ${isSelected
                    ? 'border-red-500 bg-red-50 shadow-md transform scale-105'
                    : 'border-gray-200 bg-white hover:border-red-300'
                    }`}
                >
                  {/* Time Display */}
                  <div className='text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors'>
                    {session.time}
                  </div>

                  {/* Popularity/Availability Badge */}
                  <div className={`text-[10px] uppercase tracking-wider font-extrabold mt-1 ${status.color}`}>
                    {status.icon} {status.label}
                  </div>

                  {/* Language/Format Info */}
                  <div className='text-[10px] text-gray-500 mt-1 italic font-medium'>
                    {session.language}
                  </div>

                  <div className='text-[9px] text-gray-400 mt-0.5'>
                    {Math.round(64 - (64 * occupancy / 100))} seats left
                  </div>

                  {/* The Occupancy Progress Bar */}
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-100">
                    <div
                      className={`h-full transition-all duration-700 ease-out ${occupancy > 80 ? 'bg-red-500' : 'bg-green-500'
                        }`}
                      style={{ width: `${occupancy}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedSession && <SeatPlan movie={movie} selectedSession={selectedSession} user={user} />}
    </div >
  );
};

export default MovieDetails;
