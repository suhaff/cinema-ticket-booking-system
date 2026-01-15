import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './layout/Footer';
import NavBar from './layout/NavBar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import BookingConfirmation from './pages/BookingConfirmation';
import BookingHistory from './pages/BookingHistory';
import Profile from './pages/Profile';
import { isLoggedIn, login, logout } from './utils/Auth';
import { AuthProvider } from './utils/AuthContext';

function App() {
  const [searchText, setSearchText] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = isLoggedIn();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const handleSearch = (searchQuery) => {
    setSearchText(searchQuery);
  };

  const handleLogin = (userData) => {
    const normalizedUser = {
      ...userData,
      id: userData.userId || userData.id, 
      name: userData.userName || userData.name,
      favorites: userData.favorites || ""
    };

    setUser(normalizedUser);
    login(normalizedUser);
  };

  const handleLogout = () => {
    setUser(null);
    logout();
  };

  return (
    <div className='App'>
      <AuthProvider>
      <BrowserRouter>
        <NavBar
          user={user}
          onSearch={handleSearch}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        <Routes>
          <Route
            path='/'
            element={<Home searchText={searchText} user={user} setUser={setUser} />}
          />
          <Route path='/movie/:id' element={<MovieDetails user={user} setUser={setUser} />} />
          <Route path='/booking-confirmation/:orderId' element={<BookingConfirmation />} />
          <Route path='/booking-history' element={<BookingHistory />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
