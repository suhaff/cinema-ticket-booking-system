function login(userData) {
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('userId', userData.userId);
  localStorage.setItem('userName', userData.userName);
  localStorage.setItem('userGenres', userData.genres);
}

function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('user');
  localStorage.removeItem('userId');    
  localStorage.removeItem('userName');
  localStorage.removeItem('userGenres');

  window.location.href = '/';
}

function isLoggedIn() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export { isLoggedIn, login, logout };
