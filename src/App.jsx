import React, { useState } from 'react'
import Search from './components/search'

const App = () => {
  //searchTerm : nom de la variable, le state, ce que je vais regarder
  //setSearchTerm : la fonction qui va modifier le state, la variable
  //bonne pratique : nomVariable, setNomVariable
  //useState('') : '' est la valeur par default de hasLiked (initialState)
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <main>
      <div className='pattern'/>
      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="HeroBackground"/>
          <h1>Touvez les <span className='text-gradient'>films</span> rapidement</h1>
        </header>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        <h1>{searchTerm}</h1>
      </div>
    </main>
  )
}

export default App