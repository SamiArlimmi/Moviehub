import React from 'react';
import { Play, Info, Star, Calendar, Clock } from 'lucide-react';

const FeaturedMovieSection = ({ movie, onPlayClick, onInfoClick }) => {
  if (!movie) return null;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : '/api/placeholder/1280/720';

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/api/placeholder/500/750';

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <section className="featured-movie">
      <div className="featured-movie__backdrop">
        <img
          src={backdropUrl}
          alt={movie.title}
          className="featured-movie__backdrop-image"
        />
        <div className="featured-movie__overlay" />
      </div>

      <div className="featured-movie__content">
        <div className="featured-movie__poster">
          <img
            src={posterUrl}
            alt={movie.title}
            className="featured-movie__poster-image"
          />
        </div>

        <div className="featured-movie__info">
          <div className="featured-movie__badge">Featured Movie</div>

          <h2 className="featured-movie__title">{movie.title}</h2>

          <div className="featured-movie__meta">
            <div className="featured-movie__meta-item">
              <Star className="featured-movie__meta-icon" size={16} />
              <span>{rating}</span>
            </div>
            <div className="featured-movie__meta-item">
              <Calendar className="featured-movie__meta-icon" size={16} />
              <span>{releaseYear}</span>
            </div>
            <div className="featured-movie__meta-item">
              <Clock className="featured-movie__meta-icon" size={16} />
              <span>{movie.runtime || '120'} min</span>
            </div>
          </div>

          <p className="featured-movie__overview">
            {movie.overview ?
              (movie.overview.length > 200 ?
                movie.overview.substring(0, 200) + '...' :
                movie.overview
              ) :
              'An exciting cinematic experience awaits you with this featured film.'
            }
          </p>

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