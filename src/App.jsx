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
import NotFound from './Components/NotFound.jsx';

// Importer context-udbydere for at dele data mellem komponenter
import { FavoritesProvider } from './Context/FavoritesContext.jsx';
import { AuthProvider } from './Context/AuthContext.jsx';

// Main App-funktion – Dette er rodkomponenten i vores applikation
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        {/* FavoritesProvider wrapper hele appen for at styre favoritfilm"*/}
        <FavoritesProvider>
          {/* Main app container div */}
          <div className="app">

            {/* Navigation bar - vises på hver side*/}
            <NavBar />

            {/* Hovedindholdsområdet, hvor de forskellige sider renderes */}
            <main className="main-content">

              {/* Routes bestemmer, hvilken komponent der renderes for hver URL */}
              <Routes>
                {/* Home-page vises, når brugeren går til "/" */}
                <Route path="/" element={<Home />} />

                {/* Movies page - viser alle film */}
                <Route path="/movies" element={<Movies />} />

                {/* TV Series page - viser alle serier */}
                <Route path="/series" element={<Series />} />

                {/* Search page - hvor bruger can søge efter film/series*/}
                <Route path="/search" element={<Search />} />

                {/* Settings page - hvor brugeren kan ændre indstillinger */}
                <Route path="/settings" element={<Settings />} />

                {/* Favorites page - viser brugerens favoritfilm */}
                <Route path="/favorites" element={<Favorites />} />

                {/* Profile page - viser brugerens profiloplysninger */}
                <Route path="/profile" element={<Profile />} />

                {/* Login page - for brugere, der ikke er logget ind */}
                <Route path="/login" element={<Login />} />

                <Route path="/notfound" element={<NotFound />} />
              </Routes>

            </main>
          </div>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Eksport  App component så det kan bruges i andre filer
export default App;