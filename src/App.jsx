import React from 'react';
import './css/App.css';

// Import Material-UI components for styling
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

// Import React Router components for navigation mellem pages
import { Routes, Route } from 'react-router-dom';

// Import all our page components
import NavBar from './Components/NavBar.jsx';
import Home from './Pages/Home.jsx';
import Favorites from './Pages/Favorites.jsx';
import Search from './Pages/Search.jsx';
import Login from './Pages/Login.jsx';
import Movies from './Pages/Movies.jsx';
import Series from './Pages/Series.jsx';
import Profile from './Pages/Profile.jsx';
import Settings from './Pages/Settings.jsx';

// Import context providers til at dele data mellem components
import { FavoritesProvider } from './Context/FavoritesContext.jsx';
import { AuthProvider } from './Context/AuthContext.jsx';

// Main App function - This is the root component of our application
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        {/* FavoritesProvider wraps everything to manage favorite movies */}
        <FavoritesProvider>
          {/* Main app container div */}
          <div className="app">

            {/* Navigation bar - shows on every page */}
            <NavBar />

            {/* Main content area where different pages will be displayed */}
            <main className="main-content">

              {/* Routes define which component shows for each URL */}
              <Routes>
                {/* Home page - shows when user visits "/" */}
                <Route path="/" element={<Home />} />

                {/* Movies page - shows all movies */}
                <Route path="/movies" element={<Movies />} />

                {/* TV Series page - shows all series */}
                <Route path="/series" element={<Series />} />

                {/* Search page - where users can search for movies */}
                <Route path="/search" element={<Search />} />

                <Route path="/settings" element={<Settings />} />

                {/* Favorites page - shows user's favorite movies */}
                <Route path="/favorites" element={<Favorites />} />

                {/* Profile page - shows user information */}
                <Route path="/profile" element={<Profile />} />

                {/* Login page - where users sign in */}
                <Route path="/login" element={<Login />} />
              </Routes>

            </main>
          </div>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Export the App component so it can be used in other files
export default App;