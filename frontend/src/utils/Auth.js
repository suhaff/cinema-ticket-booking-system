function login(userData) {
  const idToSave = userData.id || userData.userId; 
  const nameToSave = userData.name || userData.userName;

  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('userId', idToSave); 
  localStorage.setItem('userName', nameToSave);
  localStorage.setItem('userGenres', userData.genres || "");
  localStorage.setItem('userFavorites', userData.favorites || "");
}

function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('user');
  localStorage.removeItem('userId');    
  localStorage.removeItem('userName');
  localStorage.removeItem('userGenres');
  localStorage.removeItem('userFavorites');

  window.location.href = '/';
}

function isLoggedIn() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export { isLoggedIn, login, logout };
