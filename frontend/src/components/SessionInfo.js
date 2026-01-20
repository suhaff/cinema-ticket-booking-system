import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SessionInfo = ({ movieSessions, movieId }) => {
  const [recommendedTime, setRecommendedTime] = useState(null);

  useEffect(() => {
    if (movieSessions && movieSessions.length > 0) {
      const sorted = [...movieSessions].sort((a, b) => {
        if (a.occupancy !== undefined && b.occupancy !== undefined) {
          return a.occupancy - b.occupancy;
        }
        return 0;
      });

      setRecommendedTime(sorted[0]?.time);
    }
  }, [movieSessions]);

  const handleSessionSelect = (session) => {
    localStorage.setItem(
      'movieSession',
      JSON.stringify({
        ...session,
        movieId: movieId,
      })
    );
  };

  return (
    <Link to={`/movie/${movieId}`} className="container">
      <ul>
        {movieSessions.map((session, index) => {
          const isRecommended = session.time === recommendedTime;

          return (
            <li key={index}>
              <button
                onClick={() => handleSessionSelect(session)}
                className={`
                  w-full border rounded-lg text-left text-white text-sm 
                  font-semibold p-1 my-1 flex items-center space-x-2 transition-all
                  ${
                    isRecommended
                      ? "bg-red-600 border-2 border-yellow-300 shadow-lg scale-[1.02]"
                      : "bg-red-500 hover:bg-red-600"
                  }
                `}
              >
                <span>{session.time}</span>
                <span className="border rounded px-1">
                  {session.language}
                </span>

                {isRecommended && (
                  <span className="ml-auto text-yellow-300 font-bold text-xs">
                    ⭐ Recommended
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </Link>
  );
};

export default SessionInfo;
