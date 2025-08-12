import React from 'react';
import './css/App.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

import { Routes, Route } from 'react-router-dom';
import NavBar from './Components/NavBar.jsx';
import Home from './Pages/Home.jsx';
import Favorites from './Pages/Favorites.jsx';
import Search from './Pages/Search.jsx';
import { FavoritesProvider } from './Context/FavoritesContext.jsx';
import { AuthProvider } from './Context/AuthContext.jsx';
import Login from './Pages/Login.jsx';
import Movies from './Pages/Movies.jsx';
import Series from './Pages/Series.jsx';
import Profile from './Pages/Profile.jsx';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <FavoritesProvider>
          <div className="app">
            <NavBar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/series" element={<Series />} />
                <Route path="/search" element={<Search />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>
          </div>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;