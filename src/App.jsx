import React from 'react';
import './css/App.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

import { Routes, Route } from 'react-router-dom';
import NavBar from './Components/NavBar.jsx';
import Home from './Pages/Home.jsx';
import Favorites from './Pages/Favorites.jsx';
import Playlists from './Components/Playlist/Playlist.jsx'; // Add this import
import Search from './Pages/Search.jsx';
import { FavoritesProvider } from './Context/FavoritesContext.jsx';
import { PlaylistProvider } from './Context/PlaylistContext.jsx'; // Add this import
import { AuthProvider } from './Context/AuthContext.jsx';
import Login from './Pages/Login.jsx';
import Movies from './Pages/Movies.jsx';
import Series from './Pages/Series.jsx';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <FavoritesProvider>
          <PlaylistProvider> {/* Add this wrapper */}
            <div className="app">
              <NavBar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/movies" element={<Movies />} />
                  <Route path="/series" element={<Series />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/playlists" element={<Playlists />} /> {/* Add this route */}
                  <Route path="/login" element={<Login />} />
                </Routes>
              </main>
            </div>
          </PlaylistProvider> {/* Close the wrapper */}
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;