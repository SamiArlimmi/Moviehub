import React, { useEffect, useState } from 'react';
import "../css/MediaModal.css"; // Ensure you have this CSS file for styling    
import {
    getMovieTrailers,
    getMovieDetails,
    getMovieCredits,
    getSeriesTrailers,
    getSeriesDetails,
    getSeriesCredits
} from '../services/api';

function MediaModal({ item, onClose, mediaType }) {

    // Guard against missing item
    if (!item) {
        console.log('MediaModal: No item provided');
        return null;
    }

    const [trailers, setTrailers] = useState([]);
    const [showTrailer, setShowTrailer] = useState(false);
    const [loadingTrailers, setLoadingTrailers] = useState(false);
    const [itemDetails, setItemDetails] = useState(item); // Initialize with item
    const [credits, setCredits] = useState({ cast: [], crew: [] });
    const [error, setError] = useState(null);

    // Improved media type detection
    const isMovie = mediaType === 'movie' ||
        (!mediaType && item?.title && !item?.name && !item?.first_air_date);
    const isSeries = mediaType === 'tv' || mediaType === 'series' ||
        (!mediaType && (item?.name || item?.first_air_date) && !item?.title);

    // Helper functions to get the correct properties for both movies and TV series
    const getTitle = () => {
        return item.title || item.name || item.original_title || item.original_name || 'Unknown Title';
    };

    const getReleaseDate = () => {
        return item.release_date || item.first_air_date;
    };

    const getYear = () => {
        const date = getReleaseDate();
        return date ? new Date(date).getFullYear() : '';
    };

    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    // Fetch details, credits and trailers when item changes
    useEffect(() => {
        if (!item?.id) return;

        let isMounted = true;

        async function fetchData() {
            try {
                setError(null);
                setLoadingTrailers(true);

                let detailsData = null;
                let creditsData = { cast: [], crew: [] };
                let trailersData = [];

                if (isMovie) {
                    try {
                        const [details, credits, trailers] = await Promise.allSettled([
                            getMovieDetails(item.id),
                            getMovieCredits(item.id),
                            getMovieTrailers(item.id)
                        ]);

                        detailsData = details.status === 'fulfilled' ? details.value : null;
                        creditsData = credits.status === 'fulfilled' ? credits.value : { cast: [], crew: [] };
                        trailersData = trailers.status === 'fulfilled' ? trailers.value : [];
                    } catch (err) {
                        console.error('Error fetching movie data:', err);
                    }
                } else if (isSeries) {
                    try {
                        const [details, credits, trailers] = await Promise.allSettled([
                            getSeriesDetails(item.id),
                            getSeriesCredits(item.id),
                            getSeriesTrailers(item.id)
                        ]);

                        detailsData = details.status === 'fulfilled' ? details.value : null;
                        creditsData = credits.status === 'fulfilled' ? credits.value : { cast: [], crew: [] };
                        trailersData = trailers.status === 'fulfilled' ? trailers.value : [];
                    } catch (err) {
                        console.error('Error fetching series data:', err);
                    }
                }

                if (!isMounted) return;

                // Update state with fetched data, fallback to original item
                setItemDetails(detailsData || item);
                setCredits(creditsData || { cast: [], crew: [] });
                setTrailers(trailersData || []);

            } catch (err) {
                if (!isMounted) return;
                console.error('Error fetching media data:', err);
                setError('Could not load details right now.');
                setItemDetails(item);
            } finally {
                if (isMounted) {
                    setLoadingTrailers(false);
                }
            }
        }

        fetchData();
        return () => {
            isMounted = false;
        };
    }, [item?.id, isMovie, isSeries]);

    const handleCloseModal = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
    };

    const handleOverlayClick = (e) => {
        // Only close if clicking the backdrop itself
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const displayItem = itemDetails || item;
    const displayTitle = displayItem.title || displayItem.name || displayItem.original_title || displayItem.original_name || 'Unknown Title';
    const displayReleaseDate = displayItem.release_date || displayItem.first_air_date;

    return (
        <div className="modal-backdrop" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleCloseModal} aria-label="Close">
                    ×
                </button>

                {/* Backdrop Image */}
                {displayItem?.backdrop_path && (
                    <div
                        className="modal-backdrop-image"
                        style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${displayItem.backdrop_path})`
                        }}
                    >
                        <div className="modal-backdrop-overlay"></div>
                    </div>
                )}

                <div className="modal-scrollable-content">
                    <div className="modal-body">
                        {/* Poster Section */}
                        <div className="modal-poster-section">
                            {displayItem?.poster_path ? (
                                <img
                                    className="modal-poster"
                                    src={`https://image.tmdb.org/t/p/w500${displayItem.poster_path}`}
                                    alt={displayTitle}
                                    loading="lazy"
                                />
                            ) : (
                                <div className="modal-poster-placeholder">
                                    <div className="no-image-icon">🎬</div>
                                    <div className="no-image-text">No Image</div>
                                </div>
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="modal-info-section">
                            {/* Header */}
                            <div className="modal-header">
                                <h1 className="modal-title">{displayTitle}</h1>
                                {displayItem?.tagline && (
                                    <p className="modal-tagline">{displayItem.tagline}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="modal-actions">
                                {trailers?.length > 0 && (
                                    <button
                                        className="action-btn"
                                        onClick={() => setShowTrailer(true)}
                                    >
                                        <span className="btn-icon">▶</span>
                                        Watch Trailer
                                    </button>
                                )}

                                {displayItem?.homepage && (
                                    <a
                                        href={displayItem.homepage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="action-btn"
                                    >
                                        <span className="btn-icon">🌐</span>
                                        Visit Website
                                    </a>
                                )}
                            </div>

                            {/* Meta Information */}
                            <div className="modal-meta">
                                {displayReleaseDate && (
                                    <div className="modal-meta-item">
                                        <span className="meta-label">
                                            {isSeries ? 'First Air Date:' : 'Release Date:'}
                                        </span>
                                        <span className="meta-value">
                                            {new Date(displayReleaseDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}

                                {displayItem?.vote_average && (
                                    <div className="modal-meta-item">
                                        <span className="meta-label">Rating:</span>
                                        <span className={`modal-score ${displayItem.vote_average >= 7 ? 'score--good' :
                                            displayItem.vote_average >= 5 ? 'score--meh' : 'score--bad'
                                            }`}>
                                            {displayItem.vote_average.toFixed(1)}
                                        </span>
                                    </div>
                                )}

                                {isSeries && displayItem?.number_of_seasons && (
                                    <div className="modal-meta-item">
                                        <span className="meta-label">Seasons:</span>
                                        <span className="meta-value">{displayItem.number_of_seasons}</span>
                                    </div>
                                )}

                                {isSeries && displayItem?.number_of_episodes && (
                                    <div className="modal-meta-item">
                                        <span className="meta-label">Episodes:</span>
                                        <span className="meta-value">{displayItem.number_of_episodes}</span>
                                    </div>
                                )}

                                {isMovie && displayItem?.runtime && (
                                    <div className="modal-meta-item">
                                        <span className="meta-label">Runtime:</span>
                                        <span className="meta-value">{displayItem.runtime} min</span>
                                    </div>
                                )}

                                {displayItem?.genres && displayItem.genres.length > 0 && (
                                    <div className="modal-meta-item">
                                        <span className="meta-label">Genres:</span>
                                        <div className="genre-tags">
                                            {displayItem.genres.map((genre, index) => (
                                                <span key={genre.id || index} className="genre-tag">
                                                    {genre.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {displayItem?.status && (
                                    <div className="modal-meta-item">
                                        <span className="meta-label">Status:</span>
                                        <span className="meta-value">{displayItem.status}</span>
                                    </div>
                                )}
                            </div>

                            {/* Overview */}
                            {displayItem?.overview && (
                                <div className="modal-overview">
                                    <h3>Overview</h3>
                                    <p>{displayItem.overview}</p>
                                </div>
                            )}

                            {/* Cast Section */}
                            {credits?.cast?.length > 0 && (
                                <div className="modal-cast-section">
                                    <h3>Top Cast</h3>
                                    <div className="cast-grid">
                                        {credits.cast.slice(0, 12).map((actor) => (
                                            <div className="cast-member" key={actor.cast_id || actor.credit_id || actor.id}>
                                                {actor.profile_path ? (
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                                        alt={actor.name}
                                                        className="cast-photo"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="cast-photo-placeholder">
                                                        <span role="img" aria-label="person">👤</span>
                                                    </div>
                                                )}
                                                <div className="cast-info">
                                                    <p className="cast-name">{actor.name}</p>
                                                    <p className="cast-character">{actor.character}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Loading State */}
                            {loadingTrailers && (
                                <div className="loading-indicator">Loading details...</div>
                            )}

                            {/* Error State */}
                            {error && (
                                <div className="media-error">
                                    <p>{error}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Trailer Modal */}
                {showTrailer && trailers?.[0]?.key && (
                    <div className="trailer-section">
                        <div className="trailer-header">
                            <h3>Trailer - {displayTitle}</h3>
                            <button
                                className="trailer-close"
                                onClick={() => setShowTrailer(false)}
                                aria-label="Close trailer"
                            >
                                ×
                            </button>
                        </div>
                        <div className="trailer-container">
                            <iframe
                                title={`${displayTitle} Trailer`}
                                src={`https://www.youtube.com/embed/${trailers[0].key}?autoplay=1`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MediaModal;