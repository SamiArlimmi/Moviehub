// MovieDetail.jsx
// Dette komponent viser et enkelt film kort med poster, bedømmelse og favorit knap
import React from 'react';
import { useFavorites } from '../Context/FavoritesContext';
import '../css/MovieDetail.css';

// TMDB bedømmelse komponent
function TMDBRating({ rating, size = 48, className = "" }) {
    // Konverter bedømmelse til procent (TMDB bedømmelser er ud af 10)
    const percentage = rating ? Math.round(rating * 10) : 0;

    // Vis intet hvis der ikke er nogen bedømmelse
    if (!rating || rating === 0) {
        return (
            <div className="tmdb-score no-rating" style={{ '--size': `${size}px` }}>
                NR
            </div>
        );
    }

    return (
        <div
            className="tmdb-score"
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

// Hjælpe funktioner til at formatere data
function formatReleaseDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).getFullYear().toString();
}

function formatMovieRating(vote_average) {
    if (!vote_average || vote_average === 0) return null;
    return parseFloat(vote_average);
}

// Hjælpe funktioner til at få korrekte egenskaber for både film og TV serier
function getTitle(item) {
    return item.title || item.name || item.displayTitle || 'Ingen Titel';
}

function getReleaseDate(item) {
    return item.release_date || item.first_air_date;
}

function getMediaType(item) {
    // Tjek om det er en TV serie
    if (item.name || item.first_air_date || item.number_of_seasons) {
        return 'tv';
    }
    // Standard til film
    return 'movie';
}

function MovieDetail({ movie, onMovieClick }) {
    // Få favorit funktioner fra context
    const { isFavorite, toggleFavorite, isAuthenticated } = useFavorites();
    const isLiked = isFavorite(movie.id);

    // Få den korrekte titel og udgivelsesdato for både film og TV serier
    const title = getTitle(movie);
    const releaseDate = getReleaseDate(movie);
    const mediaType = getMediaType(movie);

    // Håndter klik på film kortet
    const handleClick = (e) => {
        // Forhindrer hjerte knap klik i at udløse film detaljer
        if (e.target.closest('.favorite-btn')) {
            return;
        }

        if (onMovieClick) {
            onMovieClick(movie);
        }
    };

    // Håndter favorit knap klik
    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Tjek om brugeren er logget ind
        if (!isAuthenticated) {
            alert('Log venligst ind for at tilføje elementer til favoritter!');
            return;
        }

        // Toggle favorit status
        const success = toggleFavorite(movie);
        if (!success) {
            console.log('Kunne ikke skifte favorit');
        }
    };

    return (
        <div className="movie-detail" onClick={handleClick}>
            {/* Poster billede container */}
            <div className="movie-poster-container">
                {/* Film poster billede */}
                <img
                    src={movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : '/placeholder-poster.jpg'
                    }
                    alt={title}
                    className="movie-poster"
                    loading="lazy"
                />

                {/* TMDB bedømmelse cirkel */}
                <TMDBRating
                    rating={formatMovieRating(movie.vote_average)}
                    size={48}
                />

                {/* Favorit hjerte knap */}
                <button
                    className={`favorite-btn ${isLiked ? 'liked' : ''} ${!isAuthenticated ? 'disabled' : ''}`}
                    onClick={handleFavoriteClick}
                    aria-label={isLiked ? 'Fjern fra favoritter' : 'Tilføj til favoritter'}
                    title={isAuthenticated
                        ? (isLiked ? 'Fjern fra favoritter' : 'Tilføj til favoritter')
                        : 'Log ind for at tilføje til favoritter'
                    }
                >
                    <span className="heart-icon">
                        {isLiked ? '❤️' : '🤍'}
                    </span>
                </button>

                {/* Overlay med afspil knap der vises ved hover */}
                <div className="movie-overlay">
                    <button className="play-button" aria-label="Se detaljer">
                        <span>▶</span>
                    </button>
                </div>
            </div>

            {/* Film information sektion */}
            <div className="movie-info">
                {/* Film titel */}
                <h3 className="movie-title">{title}</h3>

                {/* Udgivelsesår */}
                <p className="movie-year">{formatReleaseDate(releaseDate)}</p>

                {/* Genre information */}
                <p className="movie-genre">
                    {movie.genre_names && movie.genre_names.length > 0 ?
                        movie.genre_names[0] :
                        movie.genres && movie.genres.length > 0 ?
                            movie.genres[0].name :
                            'Genre ikke tilgængelig'
                    }
                </p>
            </div>
        </div>
    );
}

export default MovieDetail;