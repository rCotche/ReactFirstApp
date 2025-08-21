import React, { useEffect, useState } from 'react'
import Search from './components/search'
import Spinner from './components/spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
//
import { getTrendingMovies, updateSearchCount } from './appwrite.js'

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
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);

  // Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      //encodeURIComponent : permet que le query soit pris en compte
      // meme si il y a des caracteres speciaux, eg. espace
      const endpoint = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

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

      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log(`Error fetching movies (console): ${error}`)
      setErrorMessage('try catch block : Error fetching movies, try later')
    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  //sera utilise lorsque searchterm sera modifie
  //on a mis une dependence sur le state, la variable....searchTerm
  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm])

  //pour chaque fonction qui fetc de la data un useeffect
  useEffect(() => {
    loadTrendingMovies();
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

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (<Spinner/>) : errorMessage ? (<p className="text-red-500">
            {errorMessage}
          </p>) : (<ul>
            {movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>)}
        </section>
      </div>
    </main>
  )
}

export default App