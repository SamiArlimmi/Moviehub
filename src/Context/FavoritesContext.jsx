import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // Check authentication status on mount
    useEffect(() => {
        const checkAuthStatus = () => {
            // Check for user data (your system stores user info directly)
            const userData = localStorage.getItem('user');

            if (userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    console.log('User found in localStorage:', parsedUser);
                    setIsAuthenticated(true);
                    setUser(parsedUser);
                    loadFavorites();
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    setIsAuthenticated(false);
                    setUser(null);
                    setFavorites([]);
                }
            } else {
                console.log('No user data found in localStorage');
                setIsAuthenticated(false);
                setUser(null);
                setFavorites([]);
            }
        };

        checkAuthStatus();
    }, []);

    // Load favorites from localStorage (only if authenticated)
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

    // Save favorites to localStorage
    const saveFavorites = (favoritesToSave) => {
        try {
            localStorage.setItem('movieFavorites', JSON.stringify(favoritesToSave));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    };

    // Login function (adapted for your system)
    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
        loadFavorites();
    };

    // Logout function (adapted for your system)
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('movieFavorites');
        setIsAuthenticated(false);
        setUser(null);
        setFavorites([]);
    };

    // Check if a movie is in favorites
    const isFavorite = (movieId) => {
        if (!isAuthenticated) return false;
        return favorites.some(movie => movie.id === movieId);
    };

    // Add or remove movie from favorites (only if authenticated)
    const toggleFavorite = (movie) => {
        console.log('toggleFavorite called:', { isAuthenticated, movieTitle: movie.title });

        if (!isAuthenticated) {
            console.log('Not authenticated, showing login prompt');
            return false;
        }

        const movieExists = favorites.some(fav => fav.id === movie.id);
        let updatedFavorites;

        if (movieExists) {
            // Remove from favorites
            updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
            console.log('Removed from favorites:', movie.title);
        } else {
            // Add to favorites with timestamp
            const movieToAdd = {
                ...movie,
                addedAt: new Date().toISOString()
            };
            updatedFavorites = [...favorites, movieToAdd];
            console.log('Added to favorites:', movie.title);
        }

        setFavorites(updatedFavorites);
        saveFavorites(updatedFavorites);
        return true; // Action was performed successfully
    };

    // Clear all favorites
    const clearFavorites = () => {
        if (!isAuthenticated) return false;

        setFavorites([]);
        localStorage.removeItem('movieFavorites');
        return true;
    };

    // Get favorites count
    const favoritesCount = isAuthenticated ? favorites.length : 0;

    console.log('FavoritesContext state:', {
        isAuthenticated,
        user: user?.name || 'none',
        favoritesCount
    });

    const value = {
        favorites,
        isAuthenticated,
        user,
        isFavorite,
        toggleFavorite,
        clearFavorites,
        favoritesCount,
        login,
        logout
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};