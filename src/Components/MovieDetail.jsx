import React, { useState, useEffect } from 'react';
import { useFavorites } from '../Context/FavoritesContext';
import { usePlaylist } from '../Context/PlaylistContext';
import MovieRating from './MovieRating';
import '../css/MovieDetail.css';

function MovieDetail({ movie, onMovieClick, onAddToPlaylist, showAddedDate, showRating = false }) {
    const { isFavorite, toggleFavorite, isAuthenticated, favorites } = useFavorites();
    const { getUserRating } = usePlaylist();

    // Local state to track favorite status for immediate visual feedback
    const [isLocalFavorite, setIsLocalFavorite] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    if (!movie) return null;

    // Update local favorite state when context changes
    useEffect(() => {
        if (isAuthenticated && isFavorite) {
            const favStatus = isFavorite(movie.id);
            setIsLocalFavorite(favStatus);
        } else {
            setIsLocalFavorite(false);
        }
    }, [movie.id, isAuthenticated, isFavorite, favorites]);

    // Handle different media types (movie vs series)
    const getTitle = () => {
        return movie.title || movie.name || movie.original_title || movie.original_name || 'Unknown Title';
    };

    const getReleaseYear = () => {
        const date = movie.release_date || movie.first_air_date;
        return date ? new Date(date).getFullYear() : '';
    };

    const getPosterUrl = () => {
        if (!movie.poster_path) return '/placeholder-poster.jpg';
        return `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
    };

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onMovieClick && typeof onMovieClick === 'function') {
            onMovieClick(movie);
        }
    };

    const handleFavoriteClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            alert('Please log in to add favorites');
            return;
        }

        if (isToggling) {
            return;
        }

        setIsToggling(true);

        try {
            // Optimistic update - change visual immediately
            setIsLocalFavorite(!isLocalFavorite);

            // Call the actual toggle function
            if (toggleFavorite && typeof toggleFavorite === 'function') {
                const result = await toggleFavorite(movie);

                // Verify the state after toggle with a small delay
                setTimeout(() => {
                    if (isFavorite) {
                        const newStatus = isFavorite(movie.id);
                        setIsLocalFavorite(newStatus);
                    }
                }, 100);
            } else {
                // Revert optimistic update if no toggle function
                setIsLocalFavorite(isLocalFavorite);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            // Revert optimistic update on error
            setIsLocalFavorite(isLocalFavorite);
        } finally {
            setIsToggling(false);
        }
    };

    const handleAddToPlaylist = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            alert('Please log in to create playlists');
            return;
        }

        if (onAddToPlaylist) {
            onAddToPlaylist(movie);
        }
    };

    const userRating = getUserRating ? getUserRating(movie.id) : null;

    return (
        <div className="movie-detail" onClick={handleClick}>
            <div className="movie-poster-container">
                <img
                    className="movie-poster"
                    src={getPosterUrl()}
                    alt={getTitle()}
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = '/placeholder-poster.jpg';
                    }}
                />

                {/* Overlay with play button */}
                <div className="movie-overlay">
                    <div className="play-button">
                        <span>▶</span>
                    </div>
                </div>

                {/* Enhanced Favorite button with visual feedback */}
                <button
                    className={`favorite-btn ${isLocalFavorite ? 'favorited' : ''} ${!isAuthenticated ? 'disabled' : ''} ${isToggling ? 'toggling' : ''}`}
                    onClick={handleFavoriteClick}
                    disabled={isToggling}
                    aria-label={isLocalFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    title={!isAuthenticated ? 'Login to add favorites' : (isLocalFavorite ? 'Remove from favorites' : 'Add to favorites')}
                >
                    {isToggling ? '⏳' : (isLocalFavorite ? '❤️' : '🤍')}
                </button>

                {/* User Rating Display - Only show if showRating is true */}
                {showRating && userRating && (
                    <div className="user-rating-badge">
                        <span>★ {userRating}</span>
                    </div>
                )}
            </div>

            <div className="movie-info">
                <h3 className="movie-title">{getTitle()}</h3>
                {getReleaseYear() && (
                    <span className="movie-year">({getReleaseYear()})</span>
                )}
                {movie.vote_average && (
                    <div className="movie-rating">
                        <span className="star">⭐</span>
                        <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                )}

                {/* Show added date if requested */}
                {showAddedDate && movie.addedAt && (
                    <div className="added-date">
                        Added {new Date(movie.addedAt).toLocaleDateString()}
                    </div>
                )}

                {/* Enhanced actions for authenticated users - Only show rating in favorites */}
                {isAuthenticated && (
                    <div className="movie-actions">
                        {onAddToPlaylist && (
                            <button
                                className="add-to-playlist-btn"
                                onClick={handleAddToPlaylist}
                                title="Add to playlist"
                            >
                                <span className="btn-icon">📋</span>
                                Add to Playlist
                            </button>
                        )}
                        {/* Only show rating component if showRating is true (favorites page) */}
                        {showRating && getUserRating && (
                            <div className="rating-section">
                                <MovieRating movie={movie} size="small" showLabel={false} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovieDetail;