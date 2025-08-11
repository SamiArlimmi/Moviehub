import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MovieDetail from '../Components/MovieDetail';
import MediaModal from '../Components/Modals/MediaModal'; // Fixed import name
import PlaylistModal from '../Components/Modals/PlaylistModal';
import { useFavorites } from '../Context/FavoritesContext';
import { usePlaylist } from '../Context/PlaylistContext';
import '../css/Favorites.css';

function Favorites() {
    const { favorites, clearFavorites, favoritesCount, isAuthenticated, user } = useFavorites();
    const { getPlaylistStats } = usePlaylist();
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [playlistModalMovie, setPlaylistModalMovie] = useState(null);

    // Handle movie click to open modal
    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
    };

    // Handle add to playlist
    const handleAddToPlaylist = (movie) => {
        setPlaylistModalMovie(movie);
        setShowPlaylistModal(true);
    };

    // Close modals
    const closeModal = () => {
        setSelectedMovie(null);
    };

    const closePlaylistModal = () => {
        setShowPlaylistModal(false);
        setPlaylistModalMovie(null);
    };

    // Handle clear all favorites with confirmation
    const handleClearAll = () => {
        if (showClearConfirm) {
            clearFavorites();
            setShowClearConfirm(false);
        } else {
            setShowClearConfirm(true);
            setTimeout(() => setShowClearConfirm(false), 3000);
        }
    };

    // Get some stats for display
    const currentYear = new Date().getFullYear();
    const addedThisYear = favorites.filter(movie =>
        new Date(movie.addedAt).getFullYear() === currentYear
    ).length;

    const recentlyAdded = favorites
        .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
        .slice(0, 3);

    // Get playlist stats
    const playlistStats = getPlaylistStats();

    // If not authenticated, show login prompt
    if (!isAuthenticated) {
        return (
            <div className="favorites">
                <div className="favorites-hero">
                    <div className="hero-background"></div>
                    <div className="hero-content">
                        <div className="auth-prompt">
                            <div className="auth-icon">
                                <div className="lock-container">
                                    <div className="lock-body">🔒</div>
                                    <div className="lock-glow"></div>
                                </div>
                            </div>
                            <h1 className="auth-title">Your Personal Movie Collection Awaits</h1>
                            <p className="auth-subtitle">
                                Sign in to unlock your favorites, build your personal movie library,
                                create playlists, and rate your favorite films.
                            </p>

                            <div className="auth-actions">
                                <Link to="/login" className="btn btn-primary">
                                    <span className="btn-icon">🚀</span>
                                    Get Started
                                </Link>
                                <Link to="/" className="btn btn-secondary">
                                    <span className="btn-icon">🍿</span>
                                    Browse Movies
                                </Link>
                            </div>

                            <div className="feature-showcase">
                                <h3>What you'll get:</h3>
                                <div className="features-grid">
                                    <div className="feature-card">
                                        <div className="feature-icon">💾</div>
                                        <div className="feature-content">
                                            <h4>Save & Organize</h4>
                                            <p>Create your personal movie collection</p>
                                        </div>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-icon">📋</div>
                                        <div className="feature-content">
                                            <h4>Create Playlists</h4>
                                            <p>Organize movies into custom playlists</p>
                                        </div>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-icon">⭐</div>
                                        <div className="feature-content">
                                            <h4>Rate Movies</h4>
                                            <p>Give personal ratings to your favorites</p>
                                        </div>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-icon">📊</div>
                                        <div className="feature-content">
                                            <h4>Track Progress</h4>
                                            <p>See your movie watching journey</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // If authenticated but no favorites
    if (favoritesCount === 0) {
        return (
            <div className="favorites">
                <div className="favorites-hero">
                    <div className="hero-background"></div>
                    <div className="hero-content">
                        <div className="empty-state">
                            <div className="empty-animation">
                                <div className="heart-container">
                                    <div className="heart-main">❤️</div>
                                    <div className="heart-pulse"></div>
                                </div>
                            </div>
                            <h1 className="empty-title">Start Your Movie Journey</h1>
                            <p className="empty-subtitle">
                                Welcome {user?.name}! Your favorites collection is empty.
                                Let's find some amazing movies to add to your personal library.
                            </p>

                            <div className="empty-actions">
                                <Link to="/" className="btn btn-primary">
                                    <span className="btn-icon">🎬</span>
                                    Discover Movies
                                </Link>
                                <Link to="/search" className="btn btn-secondary">
                                    <span className="btn-icon">🔍</span>
                                    Search Collection
                                </Link>
                            </div>

                            <div className="quick-tips">
                                <h3>💡 Quick tip:</h3>
                                <p>Click the heart icon on any movie to add it to your favorites, then create playlists and rate them!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show favorites if authenticated and has favorites
    return (
        <>
            <div className="favorites">
                {/* Beautiful Header with Gradient */}
                <div className="favorites-hero">
                    <div className="hero-background"></div>
                    <div className="hero-content">
                        <div className="hero-header">
                            <div className="user-welcome">
                                <div className="avatar-section">
                                    <div className="user-avatar">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt={user.name} />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="welcome-text">
                                        <h1 className="hero-title">
                                            <span className="greeting">Welcome back, {user?.name}!</span>
                                            <span className="collection-title">Your Movie Collection</span>
                                        </h1>
                                        <p className="hero-subtitle">
                                            {favoritesCount} movie{favoritesCount !== 1 ? 's' : ''} in your personal library
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="hero-actions">
                                <Link to="/playlists" className="btn btn-secondary">
                                    <span className="btn-icon">📋</span>
                                    Manage Playlists
                                </Link>
                                <button
                                    onClick={handleClearAll}
                                    className={`btn btn-danger ${showClearConfirm ? 'confirm' : ''}`}
                                    title="Clear all favorites"
                                >
                                    <span className="btn-icon">
                                        {showClearConfirm ? '⚠️' : '🗑️'}
                                    </span>
                                    {showClearConfirm ? 'Confirm Clear All' : 'Clear All'}
                                </button>
                            </div>
                        </div>

                        {/* Enhanced Stats Cards */}
                        <div className="stats-dashboard">
                            <div className="stat-card">
                                <div className="stat-icon">📚</div>
                                <div className="stat-content">
                                    <div className="stat-number">{favoritesCount}</div>
                                    <div className="stat-label">Total Movies</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📋</div>
                                <div className="stat-content">
                                    <div className="stat-number">{playlistStats.totalPlaylists}</div>
                                    <div className="stat-label">Playlists</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⭐</div>
                                <div className="stat-content">
                                    <div className="stat-number">{playlistStats.totalRatings}</div>
                                    <div className="stat-label">Rated Movies</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">✨</div>
                                <div className="stat-content">
                                    <div className="stat-number">{addedThisYear}</div>
                                    <div className="stat-label">Added This Year</div>
                                </div>
                            </div>
                            {recentlyAdded.length > 0 && (
                                <div className="stat-card recent-card">
                                    <div className="stat-icon">🕐</div>
                                    <div className="stat-content">
                                        <div className="recent-movie">{recentlyAdded[0].title}</div>
                                        <div className="stat-label">Latest Addition</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Movies Section */}
                <div className="favorites-content">
                    <div className="content-header">
                        <h2 className="section-title">
                            <span className="title-icon">❤️</span>
                            Your Favorites
                        </h2>
                        <div className="view-options">
                            <span className="movies-count">{favoritesCount} movies</span>
                            {playlistStats.averageRating > 0 && (
                                <span className="avg-rating">
                                    Average Rating: {playlistStats.averageRating}/10 ⭐
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="movies-container">
                        <div className="movies-grid">
                            {favorites.map((movie, index) => (
                                <div
                                    key={movie.id}
                                    className="movie-item"
                                    style={{ '--delay': `${index * 0.1}s` }}
                                >
                                    <MovieDetail
                                        movie={movie}
                                        showAddedDate={true}
                                        showRating={true}  // Add this line to enable rating on favorites page
                                        onMovieClick={handleMovieClick}
                                        onAddToPlaylist={handleAddToPlaylist}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions Section */}
                    <div className="quick-actions">
                        <div className="quick-actions-content">
                            <h3>Quick Actions</h3>
                            <div className="actions-grid">
                                <Link to="/playlists" className="action-card">
                                    <div className="action-icon">📋</div>
                                    <div className="action-content">
                                        <h4>Manage Playlists</h4>
                                        <p>Organize your favorites into custom playlists</p>
                                    </div>
                                </Link>
                                <div className="action-card" onClick={() => {
                                    // Scroll to top to see all movies
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}>
                                    <div className="action-icon">⭐</div>
                                    <div className="action-content">
                                        <h4>Rate Movies</h4>
                                        <p>Give personal ratings to your favorite films</p>
                                    </div>
                                </div>
                                <Link to="/" className="action-card">
                                    <div className="action-icon">🔍</div>
                                    <div className="action-content">
                                        <h4>Discover More</h4>
                                        <p>Find new movies to add to your collection</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Movie Modal - Fixed prop name */}
            {selectedMovie && (
                <MediaModal item={selectedMovie} onClose={closeModal} />
            )}

            {/* Playlist Modal */}
            {showPlaylistModal && playlistModalMovie && (
                <PlaylistModal
                    movie={playlistModalMovie}
                    onClose={closePlaylistModal}
                    isOpen={showPlaylistModal}
                />
            )}
        </>
    );
}

export default Favorites;