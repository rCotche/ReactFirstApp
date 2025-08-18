import React, { useEffect, useState } from 'react'
import Search from './components/search'

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  //searchTerm : nom de la variable, le state, ce que je vais regarder
  //setSearchTerm : la fonction qui va modifier le state, la variable
  //bonne pratique : nomVariable, setNomVariable
  //useState('') : '' est la valeur par default de hasLiked (initialState)
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      //fonction fetch : get the data from apis
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('reseponse : Failed to fetch movies');
      }

      const data = await response.json();
      if (data.Response == 'False') {
        setErrorMessage(data.Error || 'data response : Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
    } catch (error) {
      console.log(`Error fetching movies (console): ${error}`)
      setErrorMessage('try catch block : Error fetching movies, try later')
    } finally {
      setIsLoading(false);
    }
  }

  //sera utilise qu'une seul fois au chargement car
  //on a mis une dependence vide
  useEffect(() => {
    fetchMovies();
  }, [])

  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="HeroBackground" />
          <h1>Touvez les <span className='text-gradient'>films</span> rapidement</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (<p className="text-white">
            Loading...
          </p>) : errorMessage ? (<p className="text-red-500">
            {errorMessage}
          </p>) : (<ul>
            {movieList.map((movie) => (
              <p className="text-white">{movie.title}</p>
            ))}
          </ul>)}
        </section>
      </div>
    </main>
  )
}

export default App