//obliger d'importer le hook
import { useState } from 'react'
//path de l'image : './assets/react.svg'
//alias : reactLogo
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//fichier App.css c'est pour le css du component
//import './App.css'

//"const App = () => {}" equivalent de declaration "function App () {}"
//declare un component
function App() {
  
  return (
    <div className="card-container">
      <Card title="Star wark"/>
      <Card title="avatar"/>
      <Card title="Hulk"/>
    </div>

  )
}

function Card({title}) {
  //hasLiked : nom de la variable, le state, ce que je vais regarder
  //setHasLiked : la fonction qui va modifier le state, la variable
  //bonne pratique : nomVariable, setNomVariable
  //useState(false) : false est la valeur par default de hasLiked (initialState)
  const [hasLiked, setHasLiked] = useState(false);

  return (
    <div className="card">
      <h2>{title}</h2>
      <button onClick={() => setHasLiked(!hasLiked)}>
        {hasLiked ? 'Liked': 'Like'}
      </button>
    </div>
  )
}

export default App
