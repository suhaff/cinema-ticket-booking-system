function getMovieTypes(movieId) {
  // Since TMDB doesn't provide movie types (IMAX, 2D, 3D) directly,
  // we use a seeded approach to randomly assign types based on movie ID
  // This creates consistent results for the same movie
  const selectedTypes = [];
  
  // Always include 2D
  selectedTypes.push('2D');
  
  let seed = movieId % 7;
  
  // Seed-based selection for additional types
  if (seed % 2 === 0) {
    selectedTypes.push('3D');
  }
  
  if (seed % 3 === 0) {
    selectedTypes.push('IMAX');
  }
  
  return selectedTypes;
}

export default getMovieTypes;
