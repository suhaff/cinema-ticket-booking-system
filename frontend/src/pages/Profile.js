import React, { useState, useEffect } from 'react';
import { FaEdit, FaUser, FaLock, FaTicketAlt, FaFilm, FaTimes } from 'react-icons/fa';
import BookingHistory from './BookingHistory'; 
import GenreModal from '../components/EditGenreModal';
import RemoveFavoriteModal from '../components/RemoveFavourtieModal';
import FetchMovieDetails from '../API/GetMovieDetails';
import { GENRE_OPTIONS } from '../utils/GenreOption';

const Profile = ({ user, setUser }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '' ,
  });
  const [modalError, setModalError] = useState('');
  const [loadingFavs, setLoadingFavs] = useState(false);
  const API_KEY = process.env.REACT_APP_API_KEY || '';

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId || !user) {
    setUserData(null);
    setLoading(false);
    return;
    }
    
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/${userId}`);
        const data = await response.json();
        console.log("Fetched Profile Data:", data);
        setUserData(data);
        setFormData({
          name: data.name,
          surname: data.surname,
          email: data.email,
          password: ''
        });
      } catch (error) {
          console.error("Error fetching profile:", error);
      } finally {
          setLoading(false);
      }
  };

  fetchProfile();
  }, [user]);

  useEffect(() => {
    const loadFavoriteMovies = async () => {
      if (user && user.favorites && user.favorites.trim() !== "") {
        setLoadingFavs(true);
        const ids = user.favorites.split(',').filter(id => id.trim() !== "");
        
        try {
          const movieDataPromises = ids.map(id => FetchMovieDetails(id, API_KEY));
          const results = await Promise.all(movieDataPromises);
          
          setFavoriteMovies(results.filter(m => m !== null));
        } catch (error) {
          console.error("Error loading favorite movies:", error);
        } finally {
          setLoadingFavs(false);
        }
      } else {
        setFavoriteMovies([]);
      }
    };

    loadFavoriteMovies();
  }, [user?.favorites, API_KEY]);

  const triggerDeleteModal = (movie) => {
    setMovieToDelete(movie);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!movieToDelete) return;

    const currentFavs = user.favorites || "";
    const updatedFavs = currentFavs
        .split(',')
        .filter(id => id !== movieToDelete.id.toString())
        .join(',');

    try {
        const response = await fetch(`http://localhost:8080/api/v1/users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ...user, 
                favorites: updatedFavs 
            }),
        });

        if (response.ok) {
            const updatedUser = await response.json();
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setShowDeleteModal(false);
            setMovieToDelete(null);
        }
    } catch (err) {
        console.error("Failed to remove favorite:", err);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    const userId = localStorage.getItem('userId');

    if (formData.password && formData.password.length < 8) {
        setModalError("Password must be at least 8 characters long.");
        return; // Stop the function here
    }

    try {
        const response = await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        });

        if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setIsModalOpen(false);
        setFormData({ ...formData, password: '' });
        alert("Update successful!");
        } else {
        const msg = await response.text();
        setModalError(msg || "Update failed.");
        }
    } catch (err) {
        setModalError("Connection error.");
    }
  };



  const renderGenres = () => {
    if (!userData?.genres || userData.genres.trim() === "") {
        return (
        <div className="flex flex-col items-center py-4 w-full">
            <p className="text-gray-400 italic text-md">Your genre preferences is empty</p>
            <button 
                onClick={() => setIsGenreModalOpen(true)} // Make sure this state name matches!
                className="text-red-500 text-xs font-bold mt-1 hover:underline"
                >
                + Add your preferences
            </button>
        </div>
        );
    }

    const ids = userData.genres.split(',').map(Number);
    return ids.map(id => {
        const genre = GENRE_OPTIONS.find(g => g.id === id);
        return genre ? (
        <span key={id} className="px-4 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium border border-red-100">
            {genre.emoji} {genre.name}
        </span>
        ) : null;
    });
  };

  const handleGenreUpdate = async (selectedIdsArray) => {
    const genreString = selectedIdsArray.join(',');
    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...userData, 
          genres: genreString 
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser);
        setIsGenreModalOpen(false);
        localStorage.setItem('userGenres', genreString);
        setIsGenreModalOpen(false);
        alert("Genre preferences updated successfully!");
      }
      else {
      alert("Failed to update preferences. Please try again.");
    }
    } catch (err) {
      console.error("Failed to update genres", err);
      alert("Connection error. Could not save genres.");
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading your profile...</div>;
  if (!userData) return <div className="text-center mt-10">Please log in to view settings.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 space-y-6 relative">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Personal information</h1>
      
      {/* SECTION 1: ACCOUNT DETAILS (UC-1) */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-medium">Basic info</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center text-gray-400 hover:text-red-500 transition"
          >
            <span className="mr-2 text-sm">Edit</span>
            <FaEdit />
          </button>
        </div>
        
        <div className="divide-y divide-gray-100">
          <InfoRow icon={<FaUser />} label="Name" value={`${userData.name} ${userData.surname || ''}`} />
          <InfoRow icon={<FaTicketAlt />} label="Email" value={userData.email} />
          <InfoRow icon={<FaLock />} label="Password" value="••••••••" />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">Update Basic Info</h3>
              <FaTimes className="cursor-pointer text-gray-400 hover:text-red-500" onClick={() => setIsModalOpen(false)} />
            </div>
            
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">First Name</label>
                <input 
                  type="text" 
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Surname</label>
                <input 
                  type="text" 
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 outline-none"
                  value={formData.surname}
                  onChange={(e) => setFormData({...formData, surname: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">New Password (Optional)</label>
                <input 
                  type="password" 
                  placeholder="Leave blank to keep current"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 outline-none"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              {modalError && (
                <p className=" text-red-600 p-2 rounded-lg text-sm mb-4">
                    {modalError}
                </p>
                )}
              
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 2: GENRE PREFERENCES (UC-3) */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-medium">Genre Preferences</h2>
          <button onClick={() => setIsGenreModalOpen(true)}>
            <FaEdit className="text-gray-400 cursor-pointer hover:text-red-500" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {renderGenres()}
          </div>
        </div>
      </div>

      <GenreModal 
        isOpen={isGenreModalOpen}
        onClose={() => setIsGenreModalOpen(false)}
        currentGenres={userData?.genres}
        onSave={handleGenreUpdate}
      />

      {/* SECTION 3: MY FAVOURITES */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-medium">My Favourites ({favoriteMovies.length})</h2>
          <FaFilm className="text-gray-400" />
        </div>

        <div className="p-6">
          {loadingFavs ? (
            <div className="text-center py-10 text-gray-400">Loading favorites...</div>
          ) : favoriteMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {favoriteMovies.map((movie) => (
                <div key={movie.id} className="relative group">
                  <a href={`/movie/${movie.id}`} className="block">
                    <div className="overflow-hidden rounded-lg shadow-md transition-shadow duration-300">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-gray-800 truncate">{movie.title}</h3>
                  </a>
                  
                  <button 
                    onClick={() => triggerDeleteModal(movie)}
                    className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-gray-400 italic text-sm">No favorite movies added yet.</div>
          )}
        </div>
      </div>
      <RemoveFavoriteModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        movieName={movieToDelete?.title}
        posterPath={movieToDelete?.poster_path}
      />

      {/* SECTION 4: BOOKING HISTORY (UC-2) */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-medium">Booking History</h2>
          <FaTicketAlt className="text-gray-400" />
        </div>
        <div className="p-4">
          <BookingHistory user={user} />
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center p-6 hover:bg-gray-50 transition cursor-pointer">
    <div className="w-10 text-gray-400">{icon}</div>
    <div className="w-1/3 text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</div>
    <div className="flex-grow text-gray-800">{value}</div>
    <div className="text-gray-400 text-xl font-light">›</div>
  </div>
);

export default Profile;