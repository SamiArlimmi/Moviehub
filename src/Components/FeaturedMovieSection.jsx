import React from 'react';
import { Play, Info, Star, Calendar, Clock } from 'lucide-react';
import '../css/FeaturedMovieSection.css';

const FeaturedMovieSection = ({ movie, onPlayClick, onInfoClick }) => {
  // Tjek om film eksisterer
  if (!movie) {
    return (
      <div className="featured-movie-error">
        <h2>No movie data available</h2>
      </div>
    );
  }

  // Byg billede URL'er
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : 'https://via.placeholder.com/1280x720/333/fff?text=No+Backdrop';

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450/666/fff?text=No+Poster';

  // Håndter både film og TV-serier - RETTET
  const title = movie.title || movie.name || 'Unknown Title';
  const releaseDate = movie.release_date || movie.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : 'TBA';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  // Afgør om det er en TV-serie eller film
  const isTV = movie.name || movie.first_air_date;
  const mediaType = isTV ? 'Series' : 'Movie';

  // Håndter spilletid for TV-serier (brug episode_run_time eller standard)
  const runtime = movie.runtime ||
    (movie.episode_run_time && movie.episode_run_time[0]) ||
    (isTV ? '45' : '120');

  return (
    <section className="featured-movie">
      {/* Baggrundsbillede sektion */}
      <div className="featured-movie__backdrop">
        <img
          src={backdropUrl}
          alt={title}
          className="featured-movie__backdrop-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1280x720/333/fff?text=Backdrop+Error';
          }}
        />
        {/* Mørkt overlay */}
        <div className="featured-movie__overlay" />
      </div>

      {/* Hovedindhold container */}
      <div className="featured-movie__content">
        {/* Filmplakat */}
        <div className="featured-movie__poster">
          <img
            src={posterUrl}
            alt={`${title} Poster`}
            className="featured-movie__poster-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x450/666/fff?text=Poster+Error';
            }}
          />
        </div>

        {/* Filminformation */}
        <div className="featured-movie__info">
          {/* Fremhævet film badge */}
          <div className="featured-movie__badge">
            Featured {mediaType}
          </div>

          {/* Filmtitel */}
          <h2 className="featured-movie__title">
            {title}
          </h2>

          {/* Film metadata */}
          <div className="featured-movie__meta">
            <div className="featured-movie__meta-item">
              <Star size={16} className="featured-movie__meta-icon" />
              <span>{rating}</span>
            </div>
            <div className="featured-movie__meta-item">
              <Calendar size={16} className="featured-movie__meta-icon" />
              <span>{releaseYear}</span>
            </div>
            <div className="featured-movie__meta-item">
              <Clock size={16} className="featured-movie__meta-icon" />
              <span>{runtime} {isTV ? 'mins/ep' : 'mins'}</span>
            </div>
          </div>

          {/* Filmbeskrivelse */}
          <p className="featured-movie__overview">
            {movie.overview ?
              (movie.overview.length > 200 ?
                movie.overview.substring(0, 200) + '...' :
                movie.overview
              ) :
              `An exciting ${mediaType.toLowerCase()} experience awaits you with this featured ${mediaType.toLowerCase()}.`
            }
          </p>

          {/* Handlingsknapper */}
          <div className="featured-movie__actions">
            <button
              className="featured-movie__btn featured-movie__btn--primary"
              onClick={() => onPlayClick?.(movie)}
            >
              <Play size={20} fill="currentColor" />
              Watch Trailer
            </button>

            <button
              className="featured-movie__btn featured-movie__btn--secondary"
              onClick={() => onInfoClick?.(movie)}
            >
              <Info size={20} />
              More Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMovieSection;