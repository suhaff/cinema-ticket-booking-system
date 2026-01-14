import React, { useState, useRef, useEffect } from 'react';
import Register from '../API/Register';

function RegistrationForm({ onClose }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    genres:[],
  });
  const formRef = useRef(null);

const GENRE_OPTIONS = [
  { id: 28, name: 'Action', emoji: '💥' },
  { id: 12, name: 'Adventure', emoji: '🏞️' },
  { id: 16, name: 'Animation', emoji: '📽️' },
  { id: 35, name: 'Comedy', emoji: '😂' },
  { id: 10751, name: 'Family', emoji: '❤️' },
  { id: 14, name: 'Fantasy', emoji: '🧙‍♂️' },
  { id: 9648, name: 'Mystery', emoji: '🔍' },
  { id: 878, name: 'Sci-Fi', emoji: '🤖' },
  { id: 18, name: 'Drama', emoji: '🎭' },
  { id: 27, name: 'Horror', emoji: '👻' },
  { id: 53, name: 'Thriller', emoji: '😱' },
  { id: 10402, name: 'Music', emoji: '🎵' },
  { id: 36, name: 'History', emoji: '📜' },
  { id: 10752, name: 'War', emoji: '⚔️' },
  { id: 10749, name: 'Romance', emoji: '💑' },
  { id: 80, name: 'Crime', emoji: '🔫' }
];

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      onClose();
    }
  };

  const toggleGenre = (genreId) => {
    const updated = formData.genres.includes(genreId)
      ? formData.genres.filter(id => id !== genreId)
      : [...formData.genres, genreId];
    setFormData({ ...formData, genres: updated });
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await Register(BASE_URL, formData);
    if (success) {
      onClose();
      setFormData({
        name: '',
        surname: '',
        email: '',
        phone: '',
        password: '',
        genres:[],
      });
    }
  };

  return (
    <div className='container mx-auto my-auto p-10' ref={formRef}>
      <form onSubmit={handleSubmit} className='max-w-md mx-auto'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Create Account</h2>
        <div className='space-y-4'>
          <label
            htmlFor='name'
            className='block text-gray-700 text-sm mb-2'
          ></label>
          <input
            type='text'
            id='name'
            name='name'
            placeholder='Name'
            value={formData.name}
            onChange={handleChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='surname'
            className='block text-gray-700 text-sm mb-2'
          ></label>
          <input
            type='text'
            id='surname'
            name='surname'
            placeholder='Surname'
            value={formData.surname}
            onChange={handleChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block text-gray-700 text-sm mb-2'
          ></label>
          <input
            type='email'
            id='email'
            name='email'
            placeholder='Email Address'
            value={formData.email}
            onChange={handleChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='password'
            className='block text-gray-700 text-sm mb-2'
          ></label>
          <input
            type='password'
            id='password'
            name='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
          <div className='mb-6 text-left'>
          <label className='block text-gray-700 text-md font-bold mt-6'>
            Select your favorite genres:
          </label>
          <span className='text-gray-400 text-xs mb-4 font-normal'>(Optional)</span>
          <div className='grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 border rounded bg-gray-50'>
            {GENRE_OPTIONS.map((genre) => (
              <label key={genre.id} className='flex items-center space-x-2 cursor-pointer hover:bg-white p-1 rounded'>
                <input
                  type='checkbox'
                  checked={formData.genres.includes(genre.id)}
                  onChange={() => toggleGenre(genre.id)}
                  className='text-red-500 rounded'
                />
                <span className='text-sm font-medium text-gray-600'>{genre.emoji} {genre.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className='text-center'>
          <button
            type='submit'
            className='bg-red-500 hover:bg-red-700 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            Join
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistrationForm;
