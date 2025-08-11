import React, { createContext, useContext, useState, useEffect } from 'react';

const PlaylistContext = createContext();

export function usePlaylist() {
    const context = useContext(PlaylistContext);
    if (!context) {
        throw new Error('usePlaylist must be used within a PlaylistProvider');
    }
    return context;
}

export function PlaylistProvider({ children }) {
    const [playlists, setPlaylists] = useState([]);
    const [userRatings, setUserRatings] = useState({});

    // Load playlists and ratings from localStorage on mount
    useEffect(() => {
        const savedPlaylists = localStorage.getItem('moviePlaylists');
        const savedRatings = localStorage.getItem('userMovieRatings');

        if (savedPlaylists) {
            try {
                setPlaylists(JSON.parse(savedPlaylists));
            } catch (error) {
                console.error('Error loading playlists:', error);
            }
        }

        if (savedRatings) {
            try {
                setUserRatings(JSON.parse(savedRatings));
            } catch (error) {
                console.error('Error loading ratings:', error);
            }
        }
    }, []);

    // Save playlists to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('moviePlaylists', JSON.stringify(playlists));
    }, [playlists]);

    // Save ratings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('userMovieRatings', JSON.stringify(userRatings));
    }, [userRatings]);

    // Create a new playlist
    const createPlaylist = (name, description = '') => {
        const newPlaylist = {
            id: Date.now().toString(),
            name: name.trim(),
            description: description.trim(),
            movies: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setPlaylists(prev => [...prev, newPlaylist]);
        return newPlaylist;
    };

    // Delete a playlist
    const deletePlaylist = (playlistId) => {
        setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
    };

    // Update playlist details
    const updatePlaylist = (playlistId, updates) => {
        setPlaylists(prev => prev.map(playlist =>
            playlist.id === playlistId
                ? { ...playlist, ...updates, updatedAt: new Date().toISOString() }
                : playlist
        ));
    };

    // Add movie to playlist
    const addToPlaylist = (playlistId, movie) => {
        setPlaylists(prev => prev.map(playlist => {
            if (playlist.id === playlistId) {
                // Check if movie is already in playlist
                const isAlreadyInPlaylist = playlist.movies.some(m => m.id === movie.id);
                if (isAlreadyInPlaylist) {
                    return playlist;
                }

                const updatedMovies = [...playlist.movies, {
                    ...movie,
                    addedAt: new Date().toISOString()
                }];

                return {
                    ...playlist,
                    movies: updatedMovies,
                    updatedAt: new Date().toISOString()
                };
            }
            return playlist;
        }));
    };

    // Remove movie from playlist
    const removeFromPlaylist = (playlistId, movieId) => {
        setPlaylists(prev => prev.map(playlist => {
            if (playlist.id === playlistId) {
                return {
                    ...playlist,
                    movies: playlist.movies.filter(movie => movie.id !== movieId),
                    updatedAt: new Date().toISOString()
                };
            }
            return playlist;
        }));
    };

    // Check if movie is in a specific playlist
    const isInPlaylist = (playlistId, movieId) => {
        const playlist = playlists.find(p => p.id === playlistId);
        return playlist ? playlist.movies.some(movie => movie.id === movieId) : false;
    };

    // Get playlists containing a specific movie
    const getPlaylistsWithMovie = (movieId) => {
        return playlists.filter(playlist =>
            playlist.movies.some(movie => movie.id === movieId)
        );
    };

    // Rating functions
    const rateMovie = (movieId, rating) => {
        if (rating < 1 || rating > 10) {
            throw new Error('Rating must be between 1 and 10');
        }

        setUserRatings(prev => ({
            ...prev,
            [movieId]: {
                rating,
                ratedAt: new Date().toISOString()
            }
        }));
    };

    // Remove rating
    const removeRating = (movieId) => {
        setUserRatings(prev => {
            const updated = { ...prev };
            delete updated[movieId];
            return updated;
        });
    };

    // Get user rating for a movie
    const getUserRating = (movieId) => {
        return userRatings[movieId]?.rating || null;
    };

    // Get all rated movies
    const getRatedMovies = () => {
        return Object.entries(userRatings).map(([movieId, data]) => ({
            movieId: parseInt(movieId),
            rating: data.rating,
            ratedAt: data.ratedAt
        }));
    };

    // Get statistics
    const getPlaylistStats = () => {
        const totalPlaylists = playlists.length;
        const totalMoviesInPlaylists = playlists.reduce((acc, playlist) => acc + playlist.movies.length, 0);
        const totalRatings = Object.keys(userRatings).length;
        const averageRating = totalRatings > 0
            ? Object.values(userRatings).reduce((acc, data) => acc + data.rating, 0) / totalRatings
            : 0;

        return {
            totalPlaylists,
            totalMoviesInPlaylists,
            totalRatings,
            averageRating: Math.round(averageRating * 10) / 10
        };
    };

    const value = {
        // Playlist state
        playlists,

        // Playlist actions
        createPlaylist,
        deletePlaylist,
        updatePlaylist,
        addToPlaylist,
        removeFromPlaylist,
        isInPlaylist,
        getPlaylistsWithMovie,

        // Rating state
        userRatings,

        // Rating actions
        rateMovie,
        removeRating,
        getUserRating,
        getRatedMovies,

        // Statistics
        getPlaylistStats
    };

    return (
        <PlaylistContext.Provider value={value}>
            {children}
        </PlaylistContext.Provider>
    );
}