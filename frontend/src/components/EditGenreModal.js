import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { GENRE_OPTIONS } from '../utils/GenreOption';

const GenreModal = ({ isOpen, onClose, currentGenres, onSave }) => {
  const [selectedIds, setSelectedIds] = useState(
    currentGenres ? currentGenres.split(',').map(Number) : []
  );

  if (!isOpen) return null;

  const toggleGenre = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800">Update Preferences</h3>
          <FaTimes className="cursor-pointer text-gray-400 hover:text-red-500" onClick={onClose} />
        </div>

        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {GENRE_OPTIONS.map((genre) => (
            <button
              key={genre.id}
              onClick={() => toggleGenre(genre.id)}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                selectedIds.includes(genre.id)
                  ? 'bg-red-500 text-white border-red-500 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
              }`}
            >
              {genre.emoji} {genre.name}
            </button>
          ))}
        </div>

        <div className="p-6 border-t flex space-x-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button 
            onClick={() => onSave(selectedIds)} 
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            Update Genres
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenreModal;