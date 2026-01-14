import React, { useState } from 'react';
import { FaEdit, FaUser, FaLock, FaTicketAlt, FaFilm, FaTimes } from 'react-icons/fa';
import BookingHistory from './BookingHistory'; 

const Profile = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    password: '' 
  });

  if (!user) return <div className="text-center mt-10">Please log in to view settings.</div>;

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Update to Backend:", formData);
    // This is where you will call your Spring Boot update endpoint later
    setIsModalOpen(false);
    alert("Profile Update Request Sent!");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 space-y-6 relative">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Personal info</h1>
      
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
          <InfoRow icon={<FaUser />} label="Name" value={`${user.name} ${user.surname || ''}`} />
          <InfoRow icon={<FaTicketAlt />} label="Email" value={user.email} />
          <InfoRow icon={<FaLock />} label="Password" value="••••••••" />
        </div>
      </div>

      {/* --- UPDATE MODAL UI --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">Update Basic Info</h3>
              <FaTimes className="cursor-pointer text-gray-400 hover:text-red-500" onClick={() => setIsModalOpen(false)} />
            </div>
            
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
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
          <FaEdit className="text-gray-400 cursor-pointer hover:text-red-500" />
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {['Action', 'Comedy', 'Horror'].map(genre => (
              <span key={genre} className="px-4 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium border border-red-100">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: MY FAVOURITES */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-medium">My Favourites</h2>
          <FaFilm className="text-gray-400" />
        </div>
        <div className="p-10 text-center text-gray-400 italic">
          No favorite movies added yet.
        </div>
      </div>

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