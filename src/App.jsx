import React from 'react'
import './css/App.css'; // Hvis du er i src/
import MovieDetail from './Components/MovieDetail.jsx'
import Home from './Pages/Home.jsx'
import Favorites from './Pages/Favorites.jsx'  // <- tilføj denne linje
import { Routes, Route } from 'react-router-dom';
import NavBar from './Components/NavBar.jsx'

function App() {
  return (
    <div>
      <NavBar />
      <main className='main-content'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </div>
  );
}

export default App
