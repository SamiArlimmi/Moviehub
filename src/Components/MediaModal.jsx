// MediaModal.jsx
// Dette komponent viser en modal med detaljerede informationer om en film eller TV serie
import React, { useEffect, useState } from 'react';
import "../css/MediaModal.css";
import {
    getMovieTrailers,
    getMovieDetails,
    getMovieCredits,
    getSeriesTrailers,
    getSeriesDetails,
    getSeriesCredits
} from '../services/api';

function MediaModal({ item, onClose, mediaType }) {

    // Tjek om der er et element at vise
    if (!item) {
        console.log('MediaModal: No item provided');
        return null;
    }

    // State variabler til at styre modal indhold
    const [trailers, setTrailers] = useState([]); // Array af trailere
    const [showTrailer, setShowTrailer] = useState(false); // Om trailer skal vises
    const [loadingTrailers, setLoadingTrailers] = useState(false); // Loading state
    const [itemDetails, setItemDetails] = useState(item); // Detaljerede informationer
    const [credits, setCredits] = useState({ cast: [], crew: [] }); // Skuespillere og crew
    const [error, setError] = useState(null); // Fejl beskeder

    // Forbedret media type detektion - find ud af om det er film eller TV serie
    const isMovie = mediaType === 'movie' ||
        (!mediaType && item?.title && !item?.name && !item?.first_air_date);
    const isSeries = mediaType === 'tv' || mediaType === 'series' ||
        (!mediaType && (item?.name || item?.first_air_date) && !item?.title);

    // Hjælpe funktioner til at få korrekte egenskaber for både film og TV serier
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

    // Luk modal når Escape taste trykkes
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        // Tilføj event listener og skjul body scroll
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        // Cleanup når komponenten unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    // Hent detaljer, credits og trailere når element ændres
    useEffect(() => {
        if (!item?.id) return;

        let isMounted = true; // Flag til at forhindre state updates efter unmount

        async function fetchData() {
            try {
                setError(null);
                setLoadingTrailers(true);

                // Variabler til at gemme hentet data
                let detailsData = null;
                let creditsData = { cast: [], crew: [] };
                let trailersData = [];

                // Hent data baseret på om det er en film
                if (isMovie) {
                    try {
                        const [details, credits, trailers] = await Promise.allSettled([
                            getMovieDetails(item.id),
                            getMovieCredits(item.id),
                            getMovieTrailers(item.id)
                        ]);

                        // Gem resultaterne hvis de lykkedes
                        detailsData = details.status === 'fulfilled' ? details.value : null;
                        creditsData = credits.status === 'fulfilled' ? credits.value : { cast: [], crew: [] };
                        trailersData = trailers.status === 'fulfilled' ? trailers.value : [];
                    } catch (err) {
                        console.error('Error fetching movie data:', err);
                    }
                } else if (isSeries) {
                    // Hent data for TV serier
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

                // Opdater kun state hvis komponenten stadig er mounted
                if (!isMounted) return;

                // Opdater state med hentet data, fallback til originalt element
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

    // Håndter luk modal knap
    const handleCloseModal = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
    };

    // Håndter klik på baggrund (overlay)
    const handleOverlayClick = (e) => {
        // Luk kun hvis der klikkes på selve baggrunden
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Variabler til at vise i modal
    const displayItem = itemDetails || item;
    const displayTitle = displayItem.title || displayItem.name || displayItem.original_title || displayItem.original_name || 'Unknown Title';
    const displayReleaseDate = displayItem.release_date || displayItem.first_air_date;

    return (
        <div className="modal-backdrop" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Luk knap */}
                <button className="modal-close" onClick={handleCloseModal} aria-label="Close">
                    ×
                </button>

                {/* Baggrundsbillede */}
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

                {/* Scrollbart indhold */}
                <div className="modal-scrollable-content">
                    <div className="modal-body">
                        {/* Poster sektion */}
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

                        {/* Information sektion */}
                        <div className="modal-info-section">
                            {/* Header med titel */}
                            <div className="modal-header">
                                <h1 className="modal-title">{displayTitle}</h1>
                                {displayItem?.tagline && (
                                    <p className="modal-tagline">{displayItem.tagline}</p>
                                )}
                            </div>

                            {/* Handling knapper */}
                            <div className="modal-actions">
                                {/* Se trailer knap */}
                                {trailers?.length > 0 && (
                                    <button
                                        className="action-btn"
                                        onClick={() => setShowTrailer(true)}
                                    >
                                        <span className="btn-icon">▶</span>
                                        Watch Trailer
                                    </button>
                                )}

                                {/* Besøg hjemmeside knap */}
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

                            {/* Meta information (dato, bedømmelse, osv.) */}
                            <div className="modal-meta">
                                {/* Udgivelsesdato */}
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

                                {/* Bedømmelse */}
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

                                {/* Sæsoner (kun for TV serier) */}
                                {isSeries && displayItem?.number_of_seasons && (
                                    <div className="modal-meta-item">
                                        <span className="meta-label">Seasons:</span>
                                        <span className="meta-value">{displayItem.number_of_seasons}</span>
                                    </div>
                                )}

                                {/* Episoder (kun for TV serier) */}
                                {isSeries && displayItem?.number_of_episodes && (
                                    <div className="modal-meta-item">
                                        <span className="meta-label">Episodes:</span>
                                        <span className="meta-value">{displayItem.number_of_episodes}</span>
                                    </div>
                                )}

                                {/* Spilletid (kun for film) */}
                                {isMovie && displayItem?.runtime && (
                                    <div className="modal-meta-item">
                                        <span className="meta-label">Runtime:</span>
                                        <span className="meta-value">{displayItem.runtime} min</span>
                                    </div>
                                )}

                                {/* Genrer */}
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

                                {/* Status */}
                                {displayItem?.status && (
                                    <div className="modal-meta-item">
                                        <span className="meta-label">Status:</span>
                                        <span className="meta-value">{displayItem.status}</span>
                                    </div>
                                )}
                            </div>

                            {/* Oversigt/Beskrivelse */}
                            {displayItem?.overview && (
                                <div className="modal-overview">
                                    <h3>Overview</h3>
                                    <p>{displayItem.overview}</p>
                                </div>
                            )}

                            {/* Cast sektion */}
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

                            {/* Loading tilstand */}
                            {loadingTrailers && (
                                <div className="loading-indicator">Loading details...</div>
                            )}

                            {/* Fejl tilstand */}
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