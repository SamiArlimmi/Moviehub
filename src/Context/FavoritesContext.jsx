import React, { createContext, useContext, useState, useEffect } from 'react';

// Opret favorites context
const FavoritesContext = createContext();

// Custom hook til at bruge favorites context i andre komponenter
export const useFavorites = () => {
    const context = useContext(FavoritesContext);

    // Tjek om hook bruges inden for FavoritesProvider
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }

    return context;
};

// FavoritesProvider komponent der håndterer favorite film state
export const FavoritesProvider = ({ children }) => {
    // State til at gemme array af favorite film
    const [favorites, setFavorites] = useState([]);

    // State til at tracke om bruger er logget ind
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // State til at gemme bruger information
    const [user, setUser] = useState(null);

    // Tjek authentication status når komponent mounts
    useEffect(() => {
        const checkAuthStatus = () => {
            // Tjek for bruger data i localStorage
            const userData = localStorage.getItem('user');

            if (userData) {
                try {
                    // Parse bruger data fra localStorage
                    const parsedUser = JSON.parse(userData);
                    console.log('User found in localStorage:', parsedUser);

                    // Sæt authentication state
                    setIsAuthenticated(true);
                    setUser(parsedUser);

                    // Indlæs brugerens favorite film
                    loadFavorites();
                } catch (error) {
                    // Håndter fejl ved parsing af bruger data
                    console.error('Error parsing user data:', error);
                    setIsAuthenticated(false);
                    setUser(null);
                    setFavorites([]);
                }
            } else {
                // Ingen bruger data fundet
                console.log('No user data found in localStorage');
                setIsAuthenticated(false);
                setUser(null);
                setFavorites([]);
            }
        };

        checkAuthStatus();
    }, []);

    // Indlæs favorites fra localStorage (kun hvis authenticated)
    const loadFavorites = () => {
        try {
            const savedFavorites = localStorage.getItem('movieFavorites');
            if (savedFavorites) {
                setFavorites(JSON.parse(savedFavorites));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
            setFavorites([]);
        }
    };

    // Gem favorites til localStorage
    const saveFavorites = (favoritesToSave) => {
        try {
            localStorage.setItem('movieFavorites', JSON.stringify(favoritesToSave));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    };

    // Login funktion - sæt bruger som authenticated
    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
        loadFavorites();
    };

    // Logout funktion - ryd alle data
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('movieFavorites');
        setIsAuthenticated(false);
        setUser(null);
        setFavorites([]);
    };

    // Tjek om en film er i favorites
    const isFavorite = (movieId) => {
        if (!isAuthenticated) return false;

        // Find film i favorites array baseret på ID
        return favorites.some(movie => movie.id === movieId);
    };

    // Tilføj eller fjern film fra favorites (kun hvis authenticated)
    const toggleFavorite = (movie) => {
        console.log('toggleFavorite called:', { isAuthenticated, movieTitle: movie.title });

        // Kræv authentication for at gemme favorites
        if (!isAuthenticated) {
            console.log('Not authenticated, showing login prompt');
            return false; // Indikerer at action ikke blev udført
        }

        // Tjek om filmen allerede er i favorites
        const movieExists = favorites.some(fav => fav.id === movie.id);
        let updatedFavorites;

        if (movieExists) {
            // Fjern fra favorites
            updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
            console.log('Removed from favorites:', movie.title);
        } else {
            // Tilføj til favorites med timestamp
            const movieToAdd = {
                ...movie,
                addedAt: new Date().toISOString() // Gem hvornår det blev tilføjet
            };
            updatedFavorites = [...favorites, movieToAdd];
            console.log('Added to favorites:', movie.title);
        }

        // Opdater state og gem til localStorage
        setFavorites(updatedFavorites);
        saveFavorites(updatedFavorites);
        return true; // Indikerer at action blev udført succesfuldt
    };

    // Ryd alle favorites
    const clearFavorites = () => {
        if (!isAuthenticated) return false;

        setFavorites([]);
        localStorage.removeItem('movieFavorites');
        return true;
    };

    // Beregn antal favorites (kun hvis authenticated)
    const favoritesCount = isAuthenticated ? favorites.length : 0;

    // Debug log af favorites context state
    console.log('FavoritesContext state:', {
        isAuthenticated,
        user: user?.name || 'none',
        favoritesCount
    });

    // Værdi objekt der bliver delt med alle child komponenter
    const value = {
        favorites, // Array af favorite film
        isAuthenticated, // Boolean om bruger er logget ind
        user, // Bruger data objekt
        isFavorite, // Funktion til at tjekke om film er favorite
        toggleFavorite, // Funktion til at tilføje/fjerne favorites
        clearFavorites, // Funktion til at rydde alle favorites
        favoritesCount, // Antal favorite film
        login, // Login funktion
        logout // Logout funktion
    };

    // Provider komponent der wrapper children og giver adgang til context
    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};