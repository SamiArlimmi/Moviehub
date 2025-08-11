import React from 'react';
import { useFavorites } from '../Context/FavoritesContext';
import '../css/MovieDetail.css';

// TMDB Rating Component (inline for simplicity)
function TMDBRating({ rating, size = 48, className = "" }) {
    // Convert rating to percentage (TMDB ratings are out of 10)
    const percentage = rating ? Math.round(rating * 10) : 0;

    // Don't render if no rating
    if (!rating || rating === 0) {
        return (
            <div
                className={`tmdb-score no-rating ${className}`}
                style={{ '--size': `${size}px` }}
            >
                NR
            </div>
        );
    }

    return (
        <div
            className={`tmdb-score ${className}`}
            data-score={percentage}
            style={{
                '--size': `${size}px`,
                '--percentage': percentage
            }}
        >
            <span className="tmdb-score__value">
                {percentage}<sup>%</sup>
            </span>
        </div>
    );
}

// Utility functions
function formatReleaseDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).getFullYear().toString();
}

function formatMovieRating(vote_average) {
    if (!vote_average || vote_average === 0) return null;
    return parseFloat(vote_average);
}

// Helper functions to get correct properties for both movies and TV series
function getTitle(item) {
    return item.title || item.name || item.displayTitle || 'No Title';
}

function getReleaseDate(item) {
    return item.release_date || item.first_air_date;
}

function getMediaType(item) {
    // Check if it's a TV series
    if (item.name || item.first_air_date || item.number_of_seasons) {
        return 'tv';
    }
    // Default to movie
    return 'movie';
}

function MovieDetail({ movie, onMovieClick }) {
    const { isFavorite, toggleFavorite, isAuthenticated } = useFavorites();
    const isLiked = isFavorite(movie.id);

    // Get the correct title and release date for both movies and TV series
    const title = getTitle(movie);
    const releaseDate = getReleaseDate(movie);
    const mediaType = getMediaType(movie);

    const handleClick = (e) => {
        // Prevent the heart button click from triggering movie details
        if (e.target.closest('.favorite-btn')) {
            return;
        }

        if (onMovieClick) {
            onMovieClick(movie);
        }
    };

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            // You could show a toast notification here or redirect to login
            alert('Please log in to add items to favorites!');
            return;
        }

        const success = toggleFavorite(movie);
        if (!success) {
            console.log('Failed to toggle favorite');
        }
    };

    return (
        <div className="movie-detail" onClick={handleClick}>
            <div className="movie-poster-container">
                <img
                    src={movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : '/placeholder-poster.jpg'
                    }
                    alt={title}
                    className="movie-poster"
                    loading="lazy"
                />

                {/* Enhanced TMDB Rating - replaces old rating display */}
                <TMDBRating
                    rating={formatMovieRating(movie.vote_average)}
                    size={48}
                />

                {/* Favorite Button */}
                <button
                    className={`favorite-btn ${isLiked ? 'liked' : ''} ${!isAuthenticated ? 'disabled' : ''}`}
                    onClick={handleFavoriteClick}
                    aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                    title={isAuthenticated
                        ? (isLiked ? 'Remove from favorites' : 'Add to favorites')
                        : 'Login to add to favorites'
                    }
                >
                    <span className="heart-icon">
                        {isLiked ? '❤️' : '🤍'}
                    </span>
                </button>

                <div className="movie-overlay">
                    <button className="play-button" aria-label="View details">
                        <span>▶</span>
                    </button>
                </div>
            </div>

            <div className="movie-info">
                <h3 className="movie-title">{title}</h3>
                {/* Clean year format without parentheses - works for both movies and TV series */}
                <p className="movie-year">{formatReleaseDate(releaseDate)}</p>
                <p className="movie-genre">
                    {movie.genre_names && movie.genre_names.length > 0 ?
                        movie.genre_names[0] :
                        movie.genres && movie.genres.length > 0 ?
                            movie.genres[0].name :
                            'Genre not available'
                    }
                </p>
            </div>
        </div>
    );
}

export default MovieDetail;