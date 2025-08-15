import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Import AuthContext

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

// FavoritesProvider komponent der hÃ¥ndterer favorite film state
export const FavoritesProvider = ({ children }) => {
    // State til at gemme array af favorite film
    const [favorites, setFavorites] = useState([]);

    // Get authentication state from AuthContext
    const { isAuthenticated, user, logout: authLogout } = useAuth();

    // Debug log to see when auth changes
    useEffect(() => {
        console.log('🔄 FavoritesContext: Auth state changed!', {
            isAuthenticated,
            user: user?.name || 'none',
            userEmail: user?.email || 'none'
        });

        if (isAuthenticated && user) {
            console.log('✅ User is authenticated, loading favorites...');
            loadFavorites();
        } else {
            console.log('❌ User not authenticated, clearing favorites...');
            setFavorites([]);
        }
    }, [isAuthenticated, user]);

    // Also add a direct check on mount to catch any timing issues
    useEffect(() => {
        console.log('🚀 FavoritesContext: Initial mount check');

        // Small delay to ensure AuthContext has loaded
        const checkAuth = setTimeout(() => {
            console.log('⏰ Delayed auth check:', { isAuthenticated, user: user?.name });
            if (isAuthenticated && user) {
                loadFavorites();
            }
        }, 100);

        return () => clearTimeout(checkAuth);
    }, []);

    // IndlÃ¦s favorites fra localStorage
    const loadFavorites = () => {
        try {
            const savedFavorites = localStorage.getItem('movieFavorites');
            if (savedFavorites) {
                const parsedFavorites = JSON.parse(savedFavorites);
                console.log('📚 FavoritesContext: Loaded favorites:', parsedFavorites.length, 'movies');
                console.log('📚 Favorite titles:', parsedFavorites.map(f => f.title));
                setFavorites(parsedFavorites);
            } else {
                console.log('📚 FavoritesContext: No saved favorites found in localStorage');
                setFavorites([]);
            }
        } catch (error) {
            console.error('❌ Error loading favorites:', error);
            setFavorites([]);
        }
    };

    // Gem favorites til localStorage
    const saveFavorites = (favoritesToSave) => {
        try {
            localStorage.setItem('movieFavorites', JSON.stringify(favoritesToSave));
            console.log('💾 FavoritesContext: Saved favorites:', favoritesToSave.length, 'movies');
        } catch (error) {
            console.error('❌ Error saving favorites:', error);
        }
    };

    // Logout funktion
    const logout = () => {
        console.log('👋 FavoritesContext: Logging out, clearing favorites');
        localStorage.removeItem('movieFavorites');
        setFavorites([]);
        authLogout();
    };

    // Tjek om en film er i favorites
    const isFavorite = (movieId) => {
        const result = favorites.some(movie => movie.id === movieId);
        console.log(`❤️ isFavorite check for movie ${movieId}:`, result);
        return result;
    };

    // TilfÃ¸j eller fjern film fra favorites
    const toggleFavorite = (movie) => {
        console.log('🎬 toggleFavorite called with movie:', movie.title);
        console.log('🔒 Current auth state:', {
            isAuthenticated,
            user: user?.name || 'none',
            userExists: !!user
        });

        // DETAILED authentication check
        if (!isAuthenticated) {
            console.log('❌ FAILED: Not authenticated (isAuthenticated = false)');
            return false;
        }

        if (!user) {
            console.log('❌ FAILED: No user object (user = null/undefined)');
            return false;
        }

        console.log('✅ PASSED: Authentication checks passed');
        console.log('📊 Current favorites count:', favorites.length);

        // Tjek om filmen allerede er i favorites
        const movieExists = favorites.some(fav => fav.id === movie.id);
        let updatedFavorites;

        if (movieExists) {
            // Fjern fra favorites
            updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
            console.log('➖ Removed from favorites:', movie.title);
        } else {
            // TilfÃ¸j til favorites med timestamp
            const movieToAdd = {
                ...movie,
                addedAt: new Date().toISOString()
            };
            updatedFavorites = [...favorites, movieToAdd];
            console.log('➕ Added to favorites:', movie.title);
        }

        // Opdater state og gem til localStorage
        setFavorites(updatedFavorites);
        saveFavorites(updatedFavorites);

        console.log('🎯 Toggle successful! New favorites count:', updatedFavorites.length);
        return true;
    };

    // Ryd alle favorites
    const clearFavorites = () => {
        if (!isAuthenticated) {
            console.log('❌ Cannot clear favorites: Not authenticated');
            return false;
        }

        console.log('🗑️ Clearing all favorites');
        setFavorites([]);
        localStorage.removeItem('movieFavorites');
        return true;
    };

    // Beregn antal favorites
    const favoritesCount = favorites.length;

    // Debug state changes
    useEffect(() => {
        console.log('📊 FavoritesContext state summary:', {
            isAuthenticated,
            user: user?.name || 'none',
            favoritesCount,
            favoritesList: favorites.map(f => f.title)
        });
    }, [isAuthenticated, user, favoritesCount, favorites]);

    // VÃ¦rdi objekt der bliver delt med alle child komponenter
    const value = {
        favorites,
        isAuthenticated, // From AuthContext
        user, // From AuthContext
        isFavorite,
        toggleFavorite,
        clearFavorites,
        favoritesCount,
        logout
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};