import React from 'react';
import { Play, Info, Star, Calendar, Clock } from 'lucide-react';
import '../css/FeaturedMovieSection.css';

const FeaturedMovieSection = ({ movie, onPlayClick, onInfoClick }) => {
  // Check if movie exists
  if (!movie) {
    return (
      <div className="featured-movie-error">
        <h2>No movie data available</h2>
      </div>
    );
  }

  // Build image URLs
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : 'https://via.placeholder.com/1280x720/333/fff?text=No+Backdrop';

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450/666/fff?text=No+Poster';

  // Extract year and rating
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <section className="featured-movie">
      {/* Background image section */}
      <div className="featured-movie__backdrop">
        <img
          src={backdropUrl}
          alt={movie.title || 'Featured Movie'}
          className="featured-movie__backdrop-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1280x720/333/fff?text=Backdrop+Error';
          }}
        />
        {/* Dark overlay */}
        <div className="featured-movie__overlay" />
      </div>

      {/* Main content container */}
      <div className="featured-movie__content">
        {/* Movie poster */}
        <div className="featured-movie__poster">
          <img
            src={posterUrl}
            alt={movie.title || 'Movie Poster'}
            className="featured-movie__poster-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x450/666/fff?text=Poster+Error';
            }}
          />
        </div>

        {/* Movie information */}
        <div className="featured-movie__info">
          {/* Featured movie badge */}
          <div className="featured-movie__badge">
            Fremhævet Film
          </div>

          {/* Movie title */}
          <h2 className="featured-movie__title">
            {movie.title || 'Unknown Title'}
          </h2>

          {/* Movie metadata */}
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
              <span>{movie.runtime || '120'} min</span>
            </div>
          </div>

          {/* Movie description */}
          <p className="featured-movie__overview">
            {movie.overview ?
              (movie.overview.length > 200 ?
                movie.overview.substring(0, 200) + '...' :
                movie.overview
              ) :
              'En spændende biografoplevelse venter dig med denne fremhævede film.'
            }
          </p>

          {/* Action buttons */}
          <div className="featured-movie__actions">
            <button
              className="featured-movie__btn featured-movie__btn--primary"
              onClick={() => onPlayClick?.(movie)}
            >
              <Play size={20} fill="currentColor" />
              Se Trailer
            </button>

            <button
              className="featured-movie__btn featured-movie__btn--secondary"
              onClick={() => onInfoClick?.(movie)}
            >
              <Info size={20} />
              Mere Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMovieSection;