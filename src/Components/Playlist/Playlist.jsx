import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlaylist } from "../../Context/PlaylistContext";
import { useFavorites } from "../../Context/FavoritesContext";
import MovieDetail from "../MovieDetail";

import MediaModal from '../Modals/MediaModal'; // renamed import for clarity
import PlaylistModal from '../Modals/PlaylistModal'; // renamed import for clarity
import '../../css/Playlists.css';


function Playlists() {
    const { playlists, createPlaylist, deletePlaylist, updatePlaylist, getPlaylistStats } = usePlaylist();
    const { isAuthenticated, user } = useFavorites();

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [playlistModalMovie, setPlaylistModalMovie] = useState(null);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
    const [editingPlaylist, setEditingPlaylist] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const stats = getPlaylistStats();

    // Handle movie click to open modal
    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
    };

    // Close movie modal
    const closeMovieModal = () => {
        setSelectedMovie(null);
    };

    // Handle create playlist
    const handleCreatePlaylist = (e) => {
        e.preventDefault();
        if (!newPlaylistName.trim()) return;

        createPlaylist(newPlaylistName, newPlaylistDescription);
        setNewPlaylistName('');
        setNewPlaylistDescription('');
        setShowCreateForm(false);
    };

    // Handle edit playlist
    const handleEditPlaylist = (e) => {
        e.preventDefault();
        if (!editingPlaylist || !newPlaylistName.trim()) return;

        updatePlaylist(editingPlaylist.id, {
            name: newPlaylistName,
            description: newPlaylistDescription
        });

        setEditingPlaylist(null);
        setNewPlaylistName('');
        setNewPlaylistDescription('');
    };

    // Start editing a playlist
    const startEdit = (playlist) => {
        setEditingPlaylist(playlist);
        setNewPlaylistName(playlist.name);
        setNewPlaylistDescription(playlist.description || '');
        setShowCreateForm(false);
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingPlaylist(null);
        setNewPlaylistName('');
        setNewPlaylistDescription('');
    };

    // Handle delete with confirmation
    const handleDelete = (playlist) => {
        if (deleteConfirm === playlist.id) {
            deletePlaylist(playlist.id);
            setDeleteConfirm(null);
        } else {
            setDeleteConfirm(playlist.id);
            setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="playlists-page">
                <div className="playlists-hero">
                    <div className="hero-background"></div>
                    <div className="hero-content">
                        <div className="auth-prompt">
                            <div className="auth-icon">
                                <div className="playlist-icon-container">
                                    <div className="playlist-icon">📋</div>
                                    <div className="playlist-glow"></div>
                                </div>
                            </div>
                            <h1 className="auth-title">Organize Your Movie Collection</h1>
                            <p className="auth-subtitle">
                                Sign in to create custom playlists, rate your favorite movies,
                                and organize your collection exactly how you want it.
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
                                <h3>What you can do:</h3>
                                <div className="features-grid">
                                    <div className="feature-card">
                                        <div className="feature-icon">📝</div>
                                        <div className="feature-content">
                                            <h4>Create Playlists</h4>
                                            <p>Organize movies by genre, mood, or any theme</p>
                                        </div>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-icon">⭐</div>
                                        <div className="feature-content">
                                            <h4>Rate Movies</h4>
                                            <p>Give your personal ratings from 1 to 10 stars</p>
                                        </div>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-icon">🎯</div>
                                        <div className="feature-content">
                                            <h4>Smart Organization</h4>
                                            <p>Find exactly what you're looking for, fast</p>
                                        </div>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-icon">📊</div>
                                        <div className="feature-content">
                                            <h4>Track Statistics</h4>
                                            <p>See your collection grow and preferences</p>
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

    return (
        <>
            <div className="playlists-page">
                {/* Hero Section */}
                <div className="playlists-hero">
                    <div className="hero-background"></div>
                    <div className="hero-content">
                        <div className="hero-header">
                            <div className="user-welcome">
                                <h1 className="hero-title">
                                    <span className="greeting">Your Playlists</span>
                                    <span className="subtitle">Organize & Rate Your Collection</span>
                                </h1>
                            </div>
                            <div className="hero-actions">
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="btn btn-primary"
                                >
                                    <span className="btn-icon">+</span>
                                    Create Playlist
                                </button>
                            </div>
                        </div>

                        {/* Stats Dashboard */}
                        <div className="stats-dashboard">
                            <div className="stat-card">
                                <div className="stat-icon">📋</div>
                                <div className="stat-content">
                                    <div className="stat-number">{stats.totalPlaylists}</div>
                                    <div className="stat-label">Playlists</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🎬</div>
                                <div className="stat-content">
                                    <div className="stat-number">{stats.totalMoviesInPlaylists}</div>
                                    <div className="stat-label">Movies</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⭐</div>
                                <div className="stat-content">
                                    <div className="stat-number">{stats.totalRatings}</div>
                                    <div className="stat-label">Ratings</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📊</div>
                                <div className="stat-content">
                                    <div className="stat-number">{stats.averageRating || 0}</div>
                                    <div className="stat-label">Avg Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="playlists-content">
                    {/* Create/Edit Form */}
                    {(showCreateForm || editingPlaylist) && (
                        <div className="playlist-form-section">
                            <form onSubmit={editingPlaylist ? handleEditPlaylist : handleCreatePlaylist}>
                                <h3>{editingPlaylist ? 'Edit Playlist' : 'Create New Playlist'}</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Playlist Name *</label>
                                        <input
                                            type="text"
                                            value={newPlaylistName}
                                            onChange={(e) => setNewPlaylistName(e.target.value)}
                                            placeholder="My Awesome Movies"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Description (Optional)</label>
                                        <textarea
                                            value={newPlaylistDescription}
                                            onChange={(e) => setNewPlaylistDescription(e.target.value)}
                                            placeholder="A collection of my favorite action movies..."
                                            rows={2}
                                        />
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={editingPlaylist ? cancelEdit : () => setShowCreateForm(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        <span className="btn-icon">{editingPlaylist ? '✓' : '+'}</span>
                                        {editingPlaylist ? 'Update Playlist' : 'Create Playlist'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Playlists Grid */}
                    {playlists.length === 0 && !showCreateForm ? (
                        <div className="empty-playlists">
                            <div className="empty-icon">📋</div>
                            <h3>No playlists yet</h3>
                            <p>Create your first playlist to start organizing your movie collection!</p>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="btn btn-primary"
                            >
                                <span className="btn-icon">+</span>
                                Create Your First Playlist
                            </button>
                        </div>
                    ) : (
                        <div className="playlists-grid">
                            {playlists.map((playlist, index) => (
                                <div
                                    key={playlist.id}
                                    className="playlist-card"
                                    style={{ '--delay': `${index * 0.1}s` }}
                                >
                                    <div className="playlist-header">
                                        <div className="playlist-info">
                                            <h3 className="playlist-name">{playlist.name}</h3>
                                            {playlist.description && (
                                                <p className="playlist-description">{playlist.description}</p>
                                            )}
                                            <div className="playlist-meta">
                                                <span className="movie-count">
                                                    {playlist.movies.length} movie{playlist.movies.length !== 1 ? 's' : ''}
                                                </span>
                                                <span className="created-date">
                                                    Created {new Date(playlist.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="playlist-actions">
                                            <button
                                                onClick={() => startEdit(playlist)}
                                                className="action-btn edit"
                                                title="Edit playlist"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(playlist)}
                                                className={`action-btn delete ${deleteConfirm === playlist.id ? 'confirm' : ''}`}
                                                title={deleteConfirm === playlist.id ? 'Click to confirm delete' : 'Delete playlist'}
                                            >
                                                {deleteConfirm === playlist.id ? '⚠️' : '🗑️'}
                                            </button>
                                        </div>
                                    </div>

                                    {playlist.movies.length === 0 ? (
                                        <div className="empty-playlist">
                                            <div className="empty-playlist-icon">🎬</div>
                                            <p>No movies yet</p>
                                            <Link to="/favorites" className="add-movies-link">
                                                Add from favorites →
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="playlist-movies">
                                            <div className="movies-preview">
                                                {playlist.movies.slice(0, 4).map((movie, movieIndex) => (
                                                    <div
                                                        key={`${movie.id}-${movieIndex}`}
                                                        className="movie-preview"
                                                        onClick={() => handleMovieClick(movie)}
                                                    >
                                                        <img
                                                            src={movie.poster_path
                                                                ? `https://image.tmdb.org/t/p/w154${movie.poster_path}`
                                                                : '/placeholder-poster.jpg'
                                                            }
                                                            alt={movie.title || movie.name}
                                                            loading="lazy"
                                                        />
                                                        <div className="movie-overlay">
                                                            <span>▶</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {playlist.movies.length > 4 && (
                                                    <div
                                                        className="more-movies"
                                                        onClick={() => setSelectedPlaylist(playlist)}
                                                    >
                                                        <span>+{playlist.movies.length - 4}</span>
                                                        <span>more</span>
                                                    </div>
                                                )}
                                            </div>
                                            {playlist.movies.length > 0 && (
                                                <button
                                                    className="view-all-btn"
                                                    onClick={() => setSelectedPlaylist(playlist)}
                                                >
                                                    View All Movies
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Selected Playlist View */}
            {selectedPlaylist && (
                <div className="playlist-detail-modal" onClick={() => setSelectedPlaylist(null)}>
                    <div className="playlist-detail-content" onClick={(e) => e.stopPropagation()}>
                        <div className="playlist-detail-header">
                            <div className="playlist-title-section">
                                <h2>{selectedPlaylist.name}</h2>
                                {selectedPlaylist.description && (
                                    <p className="playlist-desc">{selectedPlaylist.description}</p>
                                )}
                                <div className="playlist-stats">
                                    <span>{selectedPlaylist.movies.length} movies</span>
                                    <span>Created {new Date(selectedPlaylist.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedPlaylist(null)}
                                className="close-detail-btn"
                            >
                                ×
                            </button>
                        </div>

                        <div className="playlist-movies-grid">
                            {selectedPlaylist.movies.map((movie, index) => (
                                <div
                                    key={`${movie.id}-${index}`}
                                    className="playlist-movie-item"
                                    style={{ '--delay': `${index * 0.05}s` }}
                                >
                                    <MovieDetail
                                        movie={movie}
                                        onMovieClick={handleMovieClick}
                                        showAddedDate={true}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Movie Modal */}
            {selectedMovie && (
                <MediaModal
                    item={selectedMovie}
                    onClose={closeMovieModal}
                />
            )}

            {/* Playlist Modal */}
            {showPlaylistModal && playlistModalMovie && (
                <PlaylistModal
                    movie={playlistModalMovie}
                    onClose={() => {
                        setShowPlaylistModal(false);
                        setPlaylistModalMovie(null);
                    }}
                    isOpen={showPlaylistModal}
                />
            )}
        </>
    );
}

export default Playlists;